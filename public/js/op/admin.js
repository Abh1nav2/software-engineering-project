console.log("admin")


async function createUser(me){
  openDisplay(me);
 
  $("#display .displayWrapper .loader").remove();
  const div = document.createElement("div");
  div.style.width = "100%";
  div.innerHTML = `
    <h1 style="padding:5px;padding-left:18px;">Create User</h1>
    <div style="text-align: center;padding-top: 20px;">
    
<form id="createUserForm" onsubmit="createUserSubmit(event)" autocomplete="off" style="display:flex;flex-direction:column;font-size:1.2rem;">
        <table>
        <tr>
          <td><label>Email<span class="imp">*</span> :</label></td>
          <td><input type="email" name="email" required></td>
        </tr>
        <tr>
          <td><label>Name<span class="imp">*</span> :</label></td>
          <td><input type="text" name="name" required></td>
        </tr>
        <tr>
          <td><label>Rollno<span class="imp">*</span>: </label></td>
          <td><input type="text" name="rollno" required></td>
        </tr>
        <tr>
          <td><label>Password<span class="imp">*</span>: </label></td>
          <td><input type="text" name="password" required></td>
        </tr>
        <tr>
          <td>
             <label>Usertype<span class="imp">*</span>: </label>
          </td>
          <td>
             <select for="userType" name="userType">
               <option value="student" name="userType">Student</option>
               <option value="faculty" name="userType">Faculty</option>
             </select>
          </td>
        </tr>
        
        <tr>
            <td>
                <label>Section<span class="imp">*</span>: </label>
            </td>
            <td style>
                <select id="sectionId" name="section" style="">
                  <option disabled selected value="" style="display:none">Select a Section</option>
                  <option value="None">None</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                  <option value="D">Section D</option>
                  <option value="E">Section E</option>
                  <option value="F">Section F</option>
                </select>
            </td>
        </tr>
<!--
        <tr>
          <td><label>Classroom: </label></td>
          <td><input type="text" name="classroom" required></td>
        </tr>
        <tr>
          <td><label>Elective 1:  </label></td>
          <td><input type="text" name="elective1" required></td>
        </tr>
        <tr>
          <td><label>Elective 2: </label></td>
          <td> <input type="text" name="elective2" required></td>
        </tr>
        <tr>
          <td><label>Advicers: </label></td>
          <td> <input type="text" name="advicers" required></td>
        </tr>
-->
        
        </table>

      <tr>
      <center>
      <button type="submit" style="width:275px;font-size:1.2rem;padding:5px;margin-inline:auto;margin-top:20px;border-radius:15px;">Register New User</button>
      </center></tr>
</form>
    
    <div id="displayContent" style="width:100%;">
    </div>
    
    </div>
  `
  $("#display .displayWrapper").appendChild(div);
}


async function createUserSubmit(e){
  console.log(e)
  e.preventDefault();
  const email = e.target.querySelector("input[name='email']").value
  const name = e.target.querySelector("input[name='name']").value
  const rollno = e.target.querySelector("input[name='rollno']").value
  const password = e.target.querySelector("input[name='password']").value
  const usertype = e.target.querySelector("select[name='userType']").value
  const section = e.target.querySelector("select[name='section']").value
  // const classroom = e.target.querySelector("input[name='classroom']").value
  // const elective1 = e.target.querySelector("input[name='elective1']").value
  // const elective2 = e.target.querySelector("input[name='elective2']").value
  // const advicers = e.target.querySelector("input[name='advicers']").value
  
  
  const response = await fetch('/createUserSubmit', {
    method: 'POST',
    headers: {accept: 'application.json','Content-Type': 'application/json'},
    body: JSON.stringify({
      email: email,
      name: name,
      rollno: rollno,
      password: password,
      section: section,
      usertype: usertype
      // classroom: classroom,
      // elective1: elective1,
      // elective2: elective2,
      // advicers: advicers
    }),
  });
  const data = await response.json();
  if(data.status == "ok"){
    $("#createUserForm").reset();
    $("#displayContent").innerHTML = `
      <h2>${data.msg}</h2>
    `
    setTimeout(()=>{
      $("#displayContent").innerHTML = `
        <h2></h2>
      `
    },2000)
  } else {
    $("#displayContent").innerHTML = `
      <h2>An error occurred, user not added</h2>
      ${data.msg}
    `
  }
  
  
}




async function modifyUser(me){
  openDisplay(me);
 
  $("#display .displayWrapper .loader").remove();
  const div = document.createElement("div");
  div.style.width = "100%";
  div.innerHTML = `
    <h1 style="padding:5px;padding-left:18px;">Modify User</h1>
    <div style="text-align: center;padding-top: 20px;">
    
<form id="createUserForm" onsubmit="modifyUserSubmit(event)" autocomplete="off" style="display:flex;flex-direction:column;font-size:1.2rem;">
        <table>
        <tr>
          <td><label>Email<span class="imp">*</span>: </label></td>
          <td><input type="email" name="email" required></td>
        </tr>
        <tr>
          <td><label>Name: </label></td>
          <td><input type="text" name="name"></td>
        </tr>
        <tr>
          <td><label>Rollno: </label></td>
          <td><input type="text" name="rollno"></td>
        </tr>
        <tr>
          <td><label>Password: </label></td>
          <td><input type="text" name="password"></td>
        </tr>
        <tr>
          <td>
             <label>Usertype: </label>
          </td>
          <td>
             <select for="userType">
               <option value="student" name="userType">Student</option>
               <option value="faculty" name="userType">Faculty</option>
             </select>
          </td>
        </tr>
        
        <tr>
            <td>
                <label>Section: </label>
            </td>
            <td style>
                <select id="sectionId" name="section" style="">
                  <option disabled selected value="" style="display:none">Select a Section</option>
                  <option value="None">None</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                  <option value="D">Section D</option>
                  <option value="E">Section E</option>
                  <option value="F">Section F</option>
                </select>
            </td>
        </tr>

        <tr>
          <td><label>Classroom: </label></td>
          <td><input type="text" name="classroom"></td>
        </tr>
        <tr>
          <td><label>Elective 1:  </label></td>
          <td><input type="text" name="elective1"></td>
        </tr>
        <tr>
          <td><label>Elective 2: </label></td>
          <td> <input type="text" name="elective2"></td>
        </tr>
        <tr>
          <td><label>Advicers: </label></td>
          <td> <input type="text" name="advicers"></td>
        </tr>

        
        </table>

      <tr>
      <center>
      <button type="submit" style="width:275px;font-size:1.2rem;padding:5px;margin-inline:auto;margin-top:20px;border-radius:15px;">Modify User</button>
      </center></tr>
</form>
    
    <div id="displayContent" style="width:100%;">
    </div>
    
    </div>
  `
  $("#display .displayWrapper").appendChild(div);
  
}

async function modifyUserSubmit(e){
  console.log(e)
  e.preventDefault();
  const email = e.target.querySelector("input[name='email']").value
  const name = e.target.querySelector("input[name='name']").value
  const rollno = e.target.querySelector("input[name='rollno']").value
  const password = e.target.querySelector("input[name='password']").value
  const section = e.target.querySelector("select[name='section']").value
  const classroom = e.target.querySelector("input[name='classroom']").value
  const elective1 = e.target.querySelector("input[name='elective1']").value
  const elective2 = e.target.querySelector("input[name='elective2']").value
  const advicers = e.target.querySelector("input[name='advicers']").value
  
  const response = await fetch('/modifyUserSubmit', {
    method: 'POST',
    headers: {accept: 'application.json','Content-Type': 'application/json'},
    body: JSON.stringify({
      email: email,
      name: name,
      rollno: rollno,
      password: password,
      section: section,
      classroom: classroom,
      elective1: elective1,
      elective2: elective2,
      advicers: advicers
    }),
  });
  const data = await response.json();
  if(data.status == "ok"){
    $("#createUserForm").reset();
    $("#displayContent").innerHTML = `
      <h2>${data.msg}</h2>
    `
    setTimeout(()=>{
      $("#displayContent").innerHTML = `
        <h2></h2>
      `
    },2000)
  } else {
    $("#displayContent").innerHTML = `
      <h2>An error occurred, user not updated</h2>
      ${data.msg}
    `
  }  
}


async function changeSlot(me){
  alert("work in progress")
  // openDisplay(me);
}

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]
async function viewHistory(me){
  openDisplay(me);
  const response = await fetch('/adminviewchanges');
  const viewChanges = await response.json();
  console.log(viewChanges)
  
  const fac = viewChanges["faculty"].map(item=>`<tr> <td>${item.name}</td> <td>${item.section}</td> <td>${item.classroom}</td> <td>${days[item.toDay]}</td> <td>Slot ${item.toSlot}</td> </tr>`)
  const stu = viewChanges["student"].map(item=>`<tr> <td>${item.name}</td> <td>${item.classroom}</td> <td>${days[item.fromDay]}</td> <td>Slot ${item.fromSlot}</td>  <td>${days[item.toDay]}</td> <td>Slot ${item.toSlot}</td></tr>`)
    
 $("#display .displayWrapper .loader").remove();
  const div = document.createElement("div");
  div.style.width = "100%";
  div.innerHTML = `
    <h1 style="padding:5px;padding-left:18px;">Viewing History of Changes</h1>
    <div style="text-align: center;padding-top: 20px;display:grid;grid-template-columns:auto auto;overflow:auto;">
      <div style="margin-inline: auto;">
        <table>
          <tr><th colspan="5">Faculty Booking History</th></tr>
          <tr>
            <td>Name</td>
            <td>Section</td>
            <td>Classroom</td>
            <td>Day</td>
            <td>Slot</td>
          </tr>
          
          ${fac.join("")}
        </table>
      </div>
      <div>
        <table>
          <tr><th colspan="6">Student Request History</th></tr>
          <tr>
            <td>Name</td>
            <td>Classroom</td>
            <td>From Day</td>
            <td>From Slot</td>
            <td>To Day</td>
            <td>To Slot</td>
          </tr>
          
          ${stu.join("")}
        </table>
      </div>
    </div>
  `
  $("#display .displayWrapper").appendChild(div);
  
  
}



// ########################################################################################################################################


function bookSlot(me){
  openDisplay(me);
  // faculty can click on emppty slots for that particular section and then set an addtional class for them, 
  // this will be notified to all the students
$("#display .displayWrapper .loader").remove();
  const div = document.createElement("div");
  div.style.width = "100%";
  div.innerHTML = `
    <h1 style="padding:5px;padding-left:18px;"></h1>
    <div style="text-align: center;padding-top: 25px;">
    
    <div>
      <label>
        Room:
        <select id="sectionId" name="section" style="font-size: 1.2rem;outline: none;" oninput="selectedSection(this)">
          <option disabled selected value="" style="display:none">Select a Room</option>
          <option value="A">C203 (A)</option>
          <option value="B">C103 (B)</option>
          <option value="C">C104 (C)</option>
          <option value="D">A102 (D)</option>
          <option value="E">C102 (E)</option>
          <option value="F">A103 (F)</option>
        </select>
      </label>  
      
        <label style="display:inline-block;">
          Subject
          <input type="text" id="subjectId" name="subject" maxlength="8" style="font-size: 1.2rem;outline: none;max-width:130px;" placeholder="eg. 19CSE314">
        </label>
    </div>
    
    <div id="displayContent" style="width:100%;">
      
    </div>
    
  `
  $("#display .displayWrapper").appendChild(div);
  
  $("#displayContent").innerHTML = `
  <div style="overflow:auto;">
    <table style="width:90%;margin-inline: auto;">
      <tr>
        <th>Day</th>
        <th>Slot1</th>
        <th>Slot2</th>
        <th>Slot3</th>
        <th>Slot4</th>
        <th>Slot5</th>
        <th>Slot6</th>
        <th>Slot7</th>
        <th>Slot8</th>
      </tr>

      <tr class="day0"><td>Monday</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr class="day1"><td>Tuesday</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr class="day2"><td>Wednesday</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr class="day3"><td>Thursday</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr class="day4"><td>Friday</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>

    </table>
  </div>
  `
}

async function selectedSection({value}){
  const response = await fetch("/sectiontimetable?section=" + value + "&isAdmin=true");
  const data = await response.json();
  console.log(data)
  
  $("#displayContent").innerHTML = `
  <div style="overflow:auto;">
    <table style="width:90%;margin-inline: auto;">
      <tr>
        <th>Day</th>
        <th>Slot1</th>
        <th>Slot2</th>
        <th>Slot3</th>
        <th>Slot4</th>
        <th>Slot5</th>
        <th>Slot6</th>
        <th>Slot7</th>
        <th>Slot8</th>
      </tr>

      <tr class="day0"><td>Monday</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr class="day1"><td>Tuesday</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr class="day2"><td>Wednesday</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr class="day3"><td>Thursday</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr class="day4"><td>Friday</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>

    </table>
  </div>
  `
  
  data.forEach((item)=>{
    const td = document.querySelectorAll(`#displayContent table .day${item.day} td`)[item.slot]
    td.innerHTML = `<button onclick="bookSlotDetails(${item.day},${item.slot})" style="cursor:pointer;">AVL</button>`;
    td.style.background = "var(--theme2)";
    // td.style.cursor = "pointer";
    td.style.opacity = "0.7";
  })
}

async function bookSlotDetails(day, slot){
  const subject = $("#subjectId").value;
  console.log(day,slot, subject);
  if(subject == ""){
    alert("Please provide a course id")
    return
  }
  const res = confirm(`Do you confirm to book ${subject} to this slot?`)
  if(res == false) {
    return;
  }
  const section = $("#sectionId").value;
  
  const response = await fetch("/confirmBookSlot?section=" + section + "&day="+day+"&slot="+slot + "&subject=" + subject);
  const data = await response.json();
  
  const selected_td = document.querySelectorAll(`#displayContent table .day${day} td`)[slot]
  
  if(data.status == "ok"){
    selected_td.style.background = "yellowgreen"
    setTimeout(()=>{alert("Your Slot has been booked.")},100)
  }else{
    selected_td.style.background = "indianred"
    setTimeout(()=>{alert("There was an error, Could not book slot.")},100)
  }
  
}

