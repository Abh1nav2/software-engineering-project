const fs = require("fs");
const path = require("path");
const fastify = require("fastify")({logger: false,});
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

fastify.register(require("@fastify/static"), {root: path.join(__dirname, "public"),prefix: "/", });
fastify.register(require("@fastify/formbody"));
fastify.register(require("@fastify/view"), {
  engine: {handlebars: require("handlebars"),},
  options: {
    partials:{
      head: "/src/partials/head.handlebars",
      nav: "/src/partials/nav.handlebars",
      profile: "/src/partials/profile.handlebars",
      display: "/src/partials/display.handlebars",
      passwordReset: "/src/partials/passwordReset.handlebars",
      mail: "/src/partials/mail.handlebars",
    }
  },
});

// Load and parse SEO data
const seo = require("./src/seo.json");
if (seo.url === "glitch-default") { seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`; }
const data = require("./src/data.json");
const db = require("./src/" + data.database);

fastify.register(require('@fastify/cookie'), {
  secret: process.env.COOKIE_SECRET, // for cookies signature
  parseOptions: {}     // options for parsing cookies
})
fastify.register(require("@fastify/session"), {
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true, 
  cookie: {
    secure:false, 
    httpOnly: true, 
    sameSite: false, 
    maxAge: 1000 * 60 * 60 * 24 * 30 * 12 // a year
  }
});

fastify.addHook("onRequest", (request, reply, next) => {
  const protocol = request.raw.headers["x-forwarded-proto"].split(",")[0];
  if (protocol === "http") {reply.redirect("https://" + request.hostname + request.url);}

  console.log(request.url)
  if( request.session.isAuthenticated === undefined && ["/login","/css/style.css", "/resetPassword"].indexOf(request.url) == -1 && request.url.startsWith("/getSubjectTimetable") == false ){
    reply.redirect("/login");
  }
  
  next();
});


const Section2Classroom = {
  "A": "C203",
  "B": "C103",
  "C": "C104",
  "D": "A102",
  "E": "C102",
  "F": "A104"
}

const Section2Advicers = {
  "default": "g_radhika@cb.amrita.edu, v_ananthanarayanan@cb.amrita.edu"
}


fastify.get("/", async(request, reply)=>{
  if ( request.session.isAuthenticated ){
    const user = request.session.user;
    const userDetails = (await db.runQuery1(`SELECT usertype, name, rollno FROM Users WHERE email='${user.email}'`) )[0]
    // const userDetails = (await db.runQuery1(`SELECT usertype, name, rollno FROM Users WHERE email='cb.en.u4cse20201@cb.students.amrita.edu'`) )[0]
    // copy svgs
    const pfps = {
      "admin": "https://cdn.glitch.global/13adfb5b-b8cd-4367-a6c4-4deb15b4aee7/admin_w.svg?v=1684953175495",
      "faculty": "https://cdn.glitch.global/13adfb5b-b8cd-4367-a6c4-4deb15b4aee7/teacher_w.svg?v=1684952865323",
      "student": "https://cdn.glitch.global/13adfb5b-b8cd-4367-a6c4-4deb15b4aee7/student_w.svg?v=1684952864038"
    }
    
    const operations = {
      "student": [
        {title:"Subject Classroom", function:"findSubjectClassroom(this)" },
        {title:"Subject Faculty", function:"findSubjectFaculty(this)" },
        {title:"Request Slot Change", function:"requestSlotChange(this)"},
        {title:"View My Time Table", function:"viewTimetable(this)" }
      ],
      "faculty": [
        {title:"View Classes", function:"viewClasses(this)" },
        {title:"Reserve a slot", function:"bookSlot(this)"},
        {title:"Request faculty's slot", function:"requestFacultySlot(this)"},
        {title:"View My Time Table", function:"viewTimetable(this)" }
      ],
      "admin": [
        {title:"Create new user", function:"createUser(this)" },
        {title:"Modify user details", function:"modifyUser(this)" },
        {title:"Change slot", function:"bookSlot(this)"}, // replacing changeSlot to bookSlot(faculty) for presentation
        {title:"History of Room changes", function:"viewHistory(this)" }
      ]
    }
    
    
    console.log(userDetails)
    return reply.view("./src/pages/index.hbs", {
      seo:seo,
      pfp: pfps[userDetails.usertype],
      user: userDetails,
      operations: operations[userDetails.usertype],
      opScript: `/js/op/${userDetails.usertype}.js`
    });
  } else {
    return reply.redirect("/login");
  }
});
fastify.get("/mailing", async(request, reply)=>{ return reply.view("./src/pages/mailing.hbs", {seo:seo}); });

fastify.get("/resetPassword", async(request, reply)=>{ return reply.view("./src/pages/resetPassword.hbs", {seo:seo}); });
fastify.post("/resetPassword", async(request, reply)=>{ 
  const userdata = request.body.formUserdata;
  const newPassword = "abc123";
  const emailHTMLcontent = `
        <h1>Your Password has been reset</h1>
        <br>
        <code style="padding:10px;">${newPassword}</code>
        <br>
        This is your new password!
        
        <br>
        <img src="https://upload.wikimedia.org/wikipedia/en/f/f8/Amrita-vishwa-vidyapeetham-color-logo.png">
  `
  const emailData = {
      to: 'nandhakumar2058@gmail.com',
      from: process.env.MAIL_SENDER,
      subject: 'Password Reset',
      text: `()`,
      html: emailHTMLcontent
    };

  try {
    await sgMail.send(emailData);
    console.log('Email sent successfully');
    // return reply.send({"mail":'sent', status:"ok"});
    return reply.view("./src/pages/resetPassword.hbs", {seo:seo, error:"check your mail"}); 
  } catch (error) {
    console.error('Error sending email:', error);
    // return reply.send({"mail":'error when sending', status:"error"});
    return reply.view("./src/pages/resetPassword.hbs", {seo:seo, error:"could not reset password"}); 
  }
  
});
fastify.get("/checkLogged", async(request, reply)=>{console.log("USER CHECK LOGGED");if ( request.session.isAuthenticated ){ return reply.send({logged:"true"})} else { return reply.send({logged:"false"})} });

fastify.get("/login", async(request, reply)=>{
  if( request.session.isAuthenticated ){
    return reply.redirect("/");
  } else {
    return reply.view("./src/pages/login.hbs", {seo:seo, error: ""});
  }
});

fastify.post("/login", async (request, reply) => {
  const { formUserdata, formPassword } = request.body;
  console.log(formUserdata, formPassword)
  const user = await db.runQuery1(`SELECT * FROM Users WHERE password='${formPassword}' AND rollno=upper('${formUserdata}')`);
  console.log(user)
  
  if( user.length > 0 ){
    request.session.user = { email: user[0].email };
    request.session.isAuthenticated = true;
    return reply.redirect("/");
  }else{
    return reply.view("/src/pages/login.hbs", {seo:seo, error:"ⓘ User does not exist!"});
  }  
});

fastify.get("/logout", async (request, reply) => {
  console.log("USER LOGGED OUT");
  if(request.session.isAuthenticated){
    request.session.destroy();
  }
  return reply.redirect("/login");
});


fastify.get("/getallsubjects", async(request, reply)=>{
  // All Courses + Electives
  const electives = request.query.electives;
  if ( electives == "true" ){
    const data = await db.runQuery1("SELECT distinct course_id, course_name FROM TimeTable1 WHERE LENGTH(course_id)=8 AND course_name NOT LIKE '%Lab'");
    return reply.send(data);
  } else {
    const data = await db.runQuery1("SELECT distinct course_id, course_name FROM TimeTable1 WHERE course_id NOT IN (SELECT distinct course_id FROM TimeTable1 WHERE LENGTH(course_id)=8 AND section LIKE '%I') AND LENGTH(course_id)=8 AND course_name NOT LIKE '%Lab'");
    return reply.send(data);
  }
});
fastify.get("/getallfaculty", async(request, reply)=>{
  const data = await db.runQuery1("SELECT distinct faculty FROM TimeTable1 WHERE course_name NOT LIKE '%Lab' AND faculty NOT LIKE '%/%' AND faculty NOT LIKE '%,%' AND faculty != 'None' ");
  // console.log(data, data.length)
  return reply.send(data);
});

fastify.get("/findsubjectslots", async(request, reply)=>{
  const subject = request.query.subject;
  const user = request.session.user;
  const userDetails = (await db.runQuery1(`SELECT * FROM Users WHERE email='${user.email}'`) )[0]
  const section = userDetails.section;
  const data = await db.runQuery1(`SELECT day, slot FROM TimeTable1 WHERE course_id='${subject}' AND roomno='${Section2Classroom[section]}'`);
  return reply.send(data);
});


fastify.get("/findsubjectclassroom", async(request, reply)=>{
  // SECTION ONLY FOR NORMAL CLASSES
  // NOT FOR ELECTIVES
  const subject = request.query.subject;
  const section = request.query.section;
  
  console.log(section)
  
  const isElective = await db.runQuery1(`SELECT distinct course_id, course_name FROM TimeTable1 WHERE LENGTH(course_id)=8 AND section LIKE '%I' AND course_id='${subject}'`);
  
  if(section && isElective.length == 0){
    const data = await db.runQuery1(`SELECT distinct roomno, faculty, course_name FROM TimeTable1 WHERE course_id='${subject}' AND 
                                                                                          '${section}'= SUBSTR(section, LENGTH(section)) OR 
                                                                                           course_name='${subject}'`);
    return reply.send(data);
  } else {
    const data = await db.runQuery1(`SELECT distinct roomno, faculty, course_name FROM TimeTable1 WHERE course_id='${subject}' OR 
                                                                                           course_name='${subject}'`); 
    return reply.send(data);
  }
});

fastify.get("/findsubjectfaculty", async(request, reply)=>{
  const faculty = request.query.faculty;
  console.log(faculty);
  const data = await db.runQuery1(`SELECT roomno, slot, day FROM TimeTable1 WHERE faculty LIKE '%${faculty}%' ORDER BY day`); 
  return reply.send(data);
});


fastify.get("/sectiontimetable", async(request, reply)=>{
  const section = request.query.section;
  const isAdmin = request.query.isAdmin;

  if(isAdmin == "false"){
    const data = await db.runQuery1(`SELECT slot, day FROM TimeTable1 WHERE roomno='${Section2Classroom[section]}' AND course_name='None' AND (day,slot) NOT IN (SELECT toDay, toSlot FROM FacultyReservingHistory)`); 
    return reply.send(data);
  } else{
    const data = await db.runQuery1(`SELECT slot, day FROM TimeTable1 WHERE roomno='${Section2Classroom[section]}' AND course_name='None'`); 
    // notify faculty if class was overtaken during SUBMISSION OF BOOKING;
    return reply.send(data);
  }
  
  // console.log(data0,data)
});

fastify.get("/facultybookslot", async(request, reply)=>{
  const {slot, day, section} = request.query; 
  
  const data = await db.runQuery1(`SELECT slot, day FROM TimeTable1 WHERE roomno='${Section2Classroom[section]}' AND course_name='None'`); 
  return reply.send(data);
});

fastify.get("/confirmBookSlot", async(request, reply)=>{
 // const {slot, day, section} = request.query;
  const toAddress = 'nandhakumar2058@gmail.com';
  
  const { day, slot, subject, section} = request.query;
  const user = request.session.user;
  const userDetails = (await db.runQuery1(`SELECT * FROM Users WHERE email='${user.email}'`) )[0]
  const sub = await db.runQuery1(`SELECT distinct course_name FROM TimeTable1 WHERE course_id='${subject}'`)
  console.log("confirmBookSlot",sub,day, slot)
    const emailHTMLcontent = `
        A slot has been allocated for the subject ${sub[0].course_name} by your faculty.
        <br>
        Timing:
        <br>
        ${days[day]}, Slot ${slot}
        <br>
        <img src="https://upload.wikimedia.org/wikipedia/en/f/f8/Amrita-vishwa-vidyapeetham-color-logo.png">
    `
    const emailData = {
      to:  toAddress,
      from: process.env.MAIL_SENDER,
      subject: 'Requesting Slot Change',
      text: `()`,
      html: emailHTMLcontent
    };

  try {
    await sgMail.send(emailData);
    await db.runQuery2(`INSERT INTO FacultyReservingHistory (name,section,classroom,toSlot,toDay) VALUES ('${userDetails.name}', '${section}','${Section2Classroom[section]}', ${Number(slot)}, ${Number(day)})`)
    console.log('Email sent successfully');
    return reply.send({"mail":'sent', status:"ok"});
  } catch (error) {
    console.error('Error sending email:', error);
    return reply.send({"mail":'error when sending', status:"error"});
  }
  
});

fastify.get("/confirmBookInchargedSlot", async(request, reply)=>{
 // const {slot, day, section} = request.query;
  const { day, slot, subject, section} = request.query;
  const user = request.session.user;
  const userDetails = (await db.runQuery1(`SELECT * FROM Users WHERE email='${user.email}'`) )[0]
//   const sub = await db.runQuery1(`SELECT distinct course_name FROM TimeTable1 WHERE course_id='${subject}'`)
//   console.log("confirmBookSlot",sub,day, slot)
  const faculty = await db.runQuery1(`SELECT roomno, slot, day FROM TimeTable1 WHERE faculty LIKE '%${faculty}%' ORDER BY day`)
//     const emailData = {
//       to: 'nandhakumar2058@gmail.com',
//       from: process.env.MAIL_SENDER,
//       subject: 'Requesting Slot Change',
//       text: `()`,
//       html:`
//         A slot has been allocated for the subject ${sub[0].course_name} by your faculty.
//         <br>
//         Timing:
//         <br>
//         ${days[day]}, Slot ${slot}
//         <br>
//         <img src="https://upload.wikimedia.org/wikipedia/en/f/f8/Amrita-vishwa-vidyapeetham-color-logo.png">
//       `
//     };

//   try {
//     await sgMail.send(emailData);
//     await db.runQuery2(`INSERT INTO FacultyReservingHistory (name,section,classroom,toSlot,toDay) VALUES ('${userDetails.name}', '${section}','${Section2Classroom[section]}', ${Number(slot)}, ${Number(day)})`)
//     console.log('Email sent successfully');
//     return reply.send({"mail":'sent', status:"ok"});
//   } catch (error) {
//     console.error('Error sending email:', error);
//     return reply.send({"mail":'error when sending', status:"error"});
//   }
  
  return reply.send({a:"b"})
});

fastify.get("/adminviewchanges", async(request, reply)=>{
  const data1 = await db.runQuery1(`SELECT * FROM FacultyReservingHistory`); 
  const data2 = await db.runQuery1(`SELECT * FROM StudentRequestHistory`); 
  console.log(data1, data2)
  return reply.send({ faculty:data1, student:data2 });
});


fastify.get("/viewtimetable", async(request, reply)=>{
  
//   https://cdn.glitch.global/13adfb5b-b8cd-4367-a6c4-4deb15b4aee7/BTechCSEA6.pdf?v=1684904450112
//   https://cdn.glitch.global/13adfb5b-b8cd-4367-a6c4-4deb15b4aee7/BTechCSEB6.pdf?v=1684904454802
//   https://cdn.glitch.global/13adfb5b-b8cd-4367-a6c4-4deb15b4aee7/BTechCSEC6.pdf?v=1684904455957
//   https://cdn.glitch.global/13adfb5b-b8cd-4367-a6c4-4deb15b4aee7/BTechCSED6.pdf?v=1684904453534
//   https://cdn.glitch.global/13adfb5b-b8cd-4367-a6c4-4deb15b4aee7/BTechCSEE6.pdf?v=1684904452819
//   https://cdn.glitch.global/13adfb5b-b8cd-4367-a6c4-4deb15b4aee7/BTechCSEF6.pdf?v=1684904450851
//   https://cdn.glitch.global/13adfb5b-b8cd-4367-a6c4-4deb15b4aee7/BTechCSEE.png?v=1685043631964
//   https://cdn.glitch.global/13adfb5b-b8cd-4367-a6c4-4deb15b4aee7/BTechCSEA.png?v=1685043637331
  // https://cdn.glitch.global/13adfb5b-b8cd-4367-a6c4-4deb15b4aee7/BTechCSEF.png?v=1685345875867
  
     // https://cdn.glitch.global/13adfb5b-b8cd-4367-a6c4-4deb15b4aee7/BTechCSEC.png?v=1685345881001
  const tt = {
    A: "https://cdn.glitch.global/13adfb5b-b8cd-4367-a6c4-4deb15b4aee7/BTechCSEA.png?v=1685345885398",
    B: "https://cdn.glitch.global/13adfb5b-b8cd-4367-a6c4-4deb15b4aee7/BTechCSEB.png?v=1685345882953",
    C: "https://cdn.glitch.global/13adfb5b-b8cd-4367-a6c4-4deb15b4aee7/BTechCSEC.png?v=1685345881001",
    D: "https://cdn.glitch.global/13adfb5b-b8cd-4367-a6c4-4deb15b4aee7/BTechCSED.png?v=1685345878362",
    E: "https://cdn.glitch.global/13adfb5b-b8cd-4367-a6c4-4deb15b4aee7/BTechCSEE.png?v=1685345876927",
    F: "https://cdn.glitch.global/13adfb5b-b8cd-4367-a6c4-4deb15b4aee7/BTechCSEF.png?v=1685345875867"
  }
  
  const user = (await db.runQuery1(`SELECT * FROM Users WHERE email='${request.session.user.email}' AND usertype='student'`) )[0]
  return reply.send({
    png: tt[user.section]
  });
});

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]
fastify.get("/requestSlotChangefromStudent", async(request, reply)=>{
  const { dayId, slotId, subjectId, from } = request.query;
  console.log(dayId, slotId, subjectId)
  const user = request.session.user;
  const userDetails = (await db.runQuery1(`SELECT * FROM Users WHERE email='${user.email}'`) )[0]
  const sub = await db.runQuery1(`SELECT distinct course_name FROM TimeTable1 WHERE course_id='${subjectId}'`)
  // const subject = sub[0].course_name;
  console.log(sub)
  
  const toAddress = 'nandhakumar2058@gmail.com'
  
  const fromDay = from.split("_")[1]
  const fromSlot = from.split("_")[2]
  console.log(fromDay, fromSlot)
  const emailHTMLcontent = `asdfasdf
      for subject: ${sub[0].course_name}
      <br>
      ${days[fromDay]}, Slot ${fromSlot} -> ${days[dayId]}, Slot ${slotId}
      <br>
    <img src="https://upload.wikimedia.org/wikipedia/en/f/f8/Amrita-vishwa-vidyapeetham-color-logo.png">
  `
  const emailData = {
    to: toAddress,
    from: process.env.MAIL_SENDER,
    subject: 'Requesting Slot Change',
    text: `(${userDetails.name})`,
    html: emailHTMLcontent
  };

  try {
    await sgMail.send(emailData);
    // sgMail.sendMultiple()
    console.log('Email sent successfully');
    
    await db.runQuery2(`INSERT INTO StudentRequestHistory (name,classroom,fromSlot,fromDay,toSlot,toDay) VALUES ('${userDetails.name}','${Section2Classroom[userDetails.section]}',${Number(fromSlot)},${Number(fromDay)}, ${Number(slotId)}, ${Number(dayId)})`)
    
    return reply.send({"mail":'sent', status:"ok"});
  } catch (error) {
    console.error('Error sending email:', error);
    return reply.send({"mail":'error when sending', status:"error"});
  }
  
});



fastify.post("/createUserSubmit", async (request, reply) => {
  const {email,name,rollno,password,usertype,section,classroom="",elective1="",elective2= "",advicers} = request.body;
  try{
    const result = await db.runQuery2(`INSERT INTO Users (email,name,rollno,password,usertype,section,classroom,elective1,elective2,advicers) VALUES (
            '${email}',
            '${name}',
            '${rollno}',
            '${password}',
            '${usertype.toLowerCase()}',
            '${section.toUpperCase()}',
            '${Section2Classroom[section.toUpperCase()]}',
            '${elective1}',
            '${elective2}',
            '${Section2Advicers["default"]}')`)
    
    return reply.send({"msg":'New User Added', status:"ok"});
  } catch (err) {
    return reply.send({"msg":'db error', status:"error"});
  }
  
});

fastify.post("/modifyUserSubmit", async (request, reply) => {
  const {email,name,rollno,password,usertype,section,classroom,elective1,elective2,advicers} = request.body;
  try{
    
    name ? await db.runQuery2(`UPDATE Users SET name='${name}' WHERE email='${email.toLowerCase()}'`) : "";
    rollno ? await db.runQuery2(`UPDATE Users SET rollno='${rollno.toUpperCase()}' WHERE email='${email.toLowerCase()}'`) : "";
    password ? await db.runQuery2(`UPDATE Users SET password='${password}' WHERE email='${email.toLowerCase()}'`) : "";
    usertype ? await db.runQuery2(`UPDATE Users SET usertype='${usertype}' WHERE email='${email.toLowerCase()}'`) : "";
    section ? await db.runQuery2(`UPDATE Users SET section='${section}' WHERE email='${email.toLowerCase()}'`) : "";
    classroom ? await db.runQuery2(`UPDATE Users SET classroom='${classroom}' WHERE email='${email.toLowerCase()}'`) : "";
    elective1 ? await db.runQuery2(`UPDATE Users SET elective1='${elective1}' WHERE email='${email.toLowerCase()}'`) : "";
    elective2 ? await db.runQuery2(`UPDATE Users SET elective2='${elective2}' WHERE email='${email.toLowerCase()}'`) : "";
    advicers ? await db.runQuery2(`UPDATE Users SET advicers='${advicers}' WHERE email='${email.toLowerCase()}'`) : "";
    
    return reply.send({"msg":'User updated', status:"ok"});
  } catch (err) {
    return reply.send({"msg":'db error', status:"error"});
  }
  
});


fastify.post("/resetMyPassword", async(request, reply)=>{

  const { oldPassword, newPassword } = request.body;
  console.log(oldPassword, newPassword)
  const user = request.session.user;
  const userDetails = (await db.runQuery1(`SELECT * FROM Users WHERE email='${user.email}'`) )[0]
  
  try {
    const data = await db.runQuery2(`UPDATE Users SET password='${newPassword}' WHERE rollno='${userDetails.rollno}' AND password='${oldPassword}'`);
    return reply.send({"status":"successfully changed password"});
    
  } catch(err)  {
    return reply.send({"status":"error occurred, could not change password"});
  }
});


fastify.get("/getSubjectTimetable", async(request, reply)=>{
  const { section="None" } = request.query;
  console.log(section)
  const data = await db.runQuery1(`SELECT day, slot, course_id FROM TimeTable2 WHERE section='${section}' AND course_id != '' AND course_id NOT LIKE 'PE%'`)
  return reply.send(data);
});










fastify.get("/mail", async(request, reply)=>{
  
  const emailData = {
    to: 'nandhakumar2058@gmail.com',
    from: process.env.MAIL_SENDER,
    subject: 'hello',
    text: 'this is from amrita class nav',
    html:'<strong></strong>'
  };

  try {
    await sgMail.send(emailData);
    // await sgMail.sendMultiple(emailData)
    console.log('Email sent successfully');
    return reply.send({"mail":'sent'});
  } catch (error) {
    console.error('Error sending email:', error);
    return reply.send({"mail":'error when sending'});
  }
  
});


fastify.get("/check", async(request, reply)=>{
  const data = await db.runQuery1("SELECT * FROM TimeTable2");
  return reply.send(data);
});


fastify.post("/mailing", async(request, reply)=>{
  const {receiver1, receiver2="", title, content} = request.body;
  
  console.log(receiver1, receiver2);
  
  const emailData = {
    to: [receiver1, receiver2 ],
    from: process.env.MAIL_SENDER,
    subject: 'THIS IS AN OFFICIAL MAIL',
    text: '...',
    html:`<strong>${title}</strong>
      <p>${content}</p>
      
      <br>
      <br>
      <img src="https://upload.wikimedia.org/wikipedia/en/f/f8/Amrita-vishwa-vidyapeetham-color-logo.png">
    `
  };

  try {
    await sgMail.send(emailData);
    // await sgMail.sendMultiple(emailData)
    console.log('Email sent successfully');
    return reply.send({"mail":'sent'});
  } catch (error) {
    console.error('Error sending email:', error);
    return reply.send({"mail":'error when sending'});
  }
    return reply.send({"status":"checking"});
});

fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
