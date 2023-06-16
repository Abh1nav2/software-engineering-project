const fs = require("fs");

const dbFile = "./.data/project.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
let db;

dbWrapper
  .open({
    filename: dbFile,
    driver: sqlite3.Database
  })
  .then(async dBase => {
    db = dBase;
    try {
      if (!exists) {
        console.log("db DOES NOT EXIST!");

        const rawTimetable = fs.readFileSync("./__data.json");
        const rawUsers = fs.readFileSync("./__endusers.json");

        const timetable = JSON.parse(rawTimetable);
        const users = JSON.parse(rawUsers);

        await db.run("CREATE TABLE Users (email TEXT PRIMARY KEY,name TEXT,rollno TEXT, password TEXT, usertype TEXT, section TEXT, classroom TEXT, elective1 TEXT, elective2 TEXT, advicers TEXT)");

        await db.run("CREATE TABLE TimeTable1 (roomno TEXT,day INTEGER,slot INTEGER,course_id TEXT,course_name TEXT,section TEXT,faculty TEXT)");
        await db.run("CREATE TABLE TimeTable2 (section TEXT,day INTEGER,slot INTEGER,course_id TEXT)");

        //abhinav
        await db.run("CREATE TABLE StudentRequestHistory (name TEXT, classroom TEXT,fromSlot INTEGER,fromDay INTEGER,toSlot INTEGER, toDay INTEGER)")
        await db.run("CREATE TABLE FacultyReservingHistory (name TEXT, section TEXT, classroom TEXT,toSlot INTEGER, toDay INTEGER)")

        // mail service
        await db.run("CREATE TABLE Mail(email TEXT, timestamp REAL, msg TEXT, isClosed INTGER)")

        users["table"].forEach(item => {
          db.run(`INSERT INTO Users (email,name,rollno,password,usertype,section,classroom,elective1,elective2,advicers) VALUES (
          '${item.email}',
          '${item.name}',
          '${item.rollno}',
          '${item.password}',
          '${item.usertype}',
          '${item.section}',
          '${item.classroom}',
          '${item.elective1}',
          '${item.elective2}',
          '${item.advicers}')`)}
        );
        
        //######
        timetable["table"].forEach(item => {
          
          let dayCount = 0;
          item["timetable"].forEach( dayItem => {
            
            db.run(`INSERT INTO TimeTable1 (roomno, day, slot, course_id, course_name, section, faculty) VALUES ('${item.classroom}',
${dayCount},1,'${dayItem.slot1.course_id}','${dayItem.slot1.course_name}','${dayItem.slot1.section}', '${dayItem.slot1.faculty}')`)
            db.run(`INSERT INTO TimeTable1 (roomno, day, slot, course_id, course_name, section, faculty) VALUES ('${item.classroom}',
${dayCount},2,'${dayItem.slot2.course_id}','${dayItem.slot2.course_name}','${dayItem.slot2.section}', '${dayItem.slot2.faculty}')`)
            db.run(`INSERT INTO TimeTable1 (roomno, day, slot, course_id, course_name, section, faculty) VALUES ('${item.classroom}',
${dayCount},3,'${dayItem.slot3.course_id}','${dayItem.slot3.course_name}','${dayItem.slot3.section}', '${dayItem.slot3.faculty}')`)
            db.run(`INSERT INTO TimeTable1 (roomno, day, slot, course_id, course_name, section, faculty) VALUES ('${item.classroom}',
${dayCount},4,'${dayItem.slot4.course_id}','${dayItem.slot4.course_name}','${dayItem.slot4.section}', '${dayItem.slot4.faculty}')`)
            db.run(`INSERT INTO TimeTable1 (roomno, day, slot, course_id, course_name, section, faculty) VALUES ('${item.classroom}',
${dayCount},5,'${dayItem.slot5.course_id}','${dayItem.slot5.course_name}','${dayItem.slot5.section}', '${dayItem.slot5.faculty}')`)
            db.run(`INSERT INTO TimeTable1 (roomno, day, slot, course_id, course_name, section, faculty) VALUES ('${item.classroom}',
${dayCount},6,'${dayItem.slot6.course_id}','${dayItem.slot6.course_name}','${dayItem.slot6.section}', '${dayItem.slot6.faculty}')`)
            db.run(`INSERT INTO TimeTable1 (roomno, day, slot, course_id, course_name, section, faculty) VALUES ('${item.classroom}',
${dayCount},7,'${dayItem.slot7.course_id}','${dayItem.slot7.course_name}','${dayItem.slot7.section}', '${dayItem.slot7.faculty}')`)
            db.run(`INSERT INTO TimeTable1 (roomno, day, slot, course_id, course_name, section, faculty) VALUES ('${item.classroom}',
${dayCount},8,'${dayItem.slot8.course_id}','${dayItem.slot8.course_name}','${dayItem.slot8.section}', '${dayItem.slot8.faculty}')`)

            
            dayCount += 1;
          });
          
        });
        //######
        timetable["table2"].forEach(item => {
            
          let dayCount = 0;
          item.timetable.forEach( dayItem => {
              
            db.run(`INSERT INTO TimeTable2 (section, day, slot, course_id) VALUES ('${item.section}', ${dayCount}, 1, '${dayItem.slot1.course_id}')`)
            db.run(`INSERT INTO TimeTable2 (section, day, slot, course_id) VALUES ('${item.section}', ${dayCount}, 2, '${dayItem.slot2.course_id}')`)
            db.run(`INSERT INTO TimeTable2 (section, day, slot, course_id) VALUES ('${item.section}', ${dayCount}, 3, '${dayItem.slot3.course_id}')`)
            db.run(`INSERT INTO TimeTable2 (section, day, slot, course_id) VALUES ('${item.section}', ${dayCount}, 4, '${dayItem.slot4.course_id}')`)
            db.run(`INSERT INTO TimeTable2 (section, day, slot, course_id) VALUES ('${item.section}', ${dayCount}, 5, '${dayItem.slot5.course_id}')`)
            db.run(`INSERT INTO TimeTable2 (section, day, slot, course_id) VALUES ('${item.section}', ${dayCount}, 6, '${dayItem.slot6.course_id}')`)
            db.run(`INSERT INTO TimeTable2 (section, day, slot, course_id) VALUES ('${item.section}', ${dayCount}, 7, '${dayItem.slot7.course_id}')`)
            db.run(`INSERT INTO TimeTable2 (section, day, slot, course_id) VALUES ('${item.section}', ${dayCount}, 8, '${dayItem.slot8.course_id}')`)
              
            dayCount += 1;
          });
          
        });
        
        
      } else {
        console.log("db exists!");        
      }
    } catch (dbError) {
      console.error(dbError);
    }
  });
// Our server script will call these methods to connect to the db
module.exports = {
  runQuery1: async (q) => {
    try {
      return await db.all(q);
    } catch (dbError) {
      console.error(dbError);
    }
  },  
  runQuery2: async (q) => {
    try {
      return await db.run(q);
    } catch (dbError) {
      console.error(dbError);
    }
  },
};