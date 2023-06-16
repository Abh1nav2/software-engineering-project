console.log("student")

async function viewTimetable(me){
  openDisplay(me);
  const response = await fetch("/viewtimetable")
  const data = await response.json();
  console.log(data);
  
  
  $("#display .displayWrapper .loader").remove();
  const div = document.createElement("div");
  div.style.width = "100%";
  div.innerHTML = `
    <h1 style="padding:5px;padding-left:8px;">My Timetable</h1>
    <img src="${data.png}" style="width:100%;">
  `
  $("#display .displayWrapper").appendChild(div);
}


async function findSubjectClassroom(me){
  openDisplay(me);
  const respAllSubs = await fetch("/getallsubjects?electives=true")
  const allSubjects = await respAllSubs.json();
  const values = allSubjects.map(item=>`<option value="${item.course_id}">${item.course_name}</option>`)
  
  
  $("#display .displayWrapper .loader").remove();
  const div = document.createElement("div");
  div.style.width = "100%";
  div.innerHTML = `
    <h1 style="padding:5px;padding-left:18px;">Find Subject Classroom</h1>
    <form style="text-align: center;padding-top: 20px;" onsubmit="findSubjectClassroomSubmit(event)">
    
      <div>
        <label for="subject" disabled selected style="font-size:1.4rem;">Choose a Subject:</label>
        <select id="subjectId" name="subject" style="font-size: 1.2rem;outline: none;width: min(90%,600px);">
          <option disabled selected value="" style="display:none">Select a Course</option>
          ${values.join("")}
        </select>
      </div>
      
      <div style="padding-top:20px;--fontSize: 2rem;" class="sectionSelect">
      
        <div style="padding-block:20px;">
         Select a Section:
        </div>
      
        <input type="radio" id="secA" name="section" value="A">
        <label for="secA">A</label>
        
        <input type="radio" id="secB" name="section" value="B">
        <label for="secB">B</label>
        
        <input type="radio" id="secC" name="section" value="C">
        <label for="secC">C</label>
        
        <input type="radio" id="secD" name="section" value="D">
        <label for="secD">D</label>
        
        <input type="radio" id="secE" name="section" value="E">
        <label for="secE">E</label>
        
        <input type="radio" id="secF" name="section" value="F">
        <label for="secF">F</label>
        
      </div>
      
      <div style="padding-top:10px;">
        <button type="submit" style="padding:5px 10px; border-radius:25px;font-size:1.2rem;">Search</button>
      </div>
    
    </form>
    
    <div id="displayContent">
    </div>
    
  `
  
  $("#display .displayWrapper").appendChild(div);
}

async function findSubjectClassroomSubmit(e){
  e.preventDefault();
  const subject = e.target.querySelector("#subjectId").value
  let section = "";
  if (e.target.querySelector("input[name='section']:checked")) {
    section = e.target.querySelector("input[name='section']:checked").value
  }
  console.log(subject, section)
  
  const response = await fetch("/findsubjectclassroom?subject=" + subject + "&section=" + section)
  const data = await response.json();
  console.log(data)
  
  $("#displayContent").innerHTML = `<table style="width:90%;margin-inline: auto;">
    <tr>
      <th>Classoom No.</th>
      <th>Faculty</th>
      <th>Type</th>
    </tr>
  </table>`;
  
  data.forEach((item,idx)=>{
    const tr = document.createElement("tr")
    
    tr.innerHTML = `
      <td> ${item.roomno} </td>
      <td> ${item.faculty} </td>
      <td> ${ item.course_name.endsWith("Lab") ? "Lab" : "Theory" } </td>
    `
    $("#displayContent table").appendChild(tr);
  })
  
}

// #####################################################################################################################
// #####################################################################################################################
// #####################################################################################################################

async function findSubjectFaculty(me){
  openDisplay(me);
  // show faculty time slot on timetable
  // for that we need the faculty name and all the closests they take and their details like course id, slot, day
  
  const respAllFac = await fetch("/getallfaculty")
  const allFaculties = await respAllFac.json();
  
  const values = allFaculties.map(item=>`<option value="${sanitizeFacultyName(item.faculty)}">${sanitizeFacultyName(item.faculty)}</option>`)
  
  
  $("#display .displayWrapper .loader").remove();
  const div = document.createElement("div");
  div.style.width = "100%";
  div.innerHTML = `
    <h1 style="padding:5px;padding-left:18px;">Find Faculty</h1>
    <form style="text-align: center;padding-top: 20px;" onsubmit="findSubjectFacultySubmit(event)">
    
      <div>
        <label for="facultyId" disabled selected style="font-size:1.4rem;">Choose a Faculty:</label>
        <select id="facultyId" name="faculty" style="font-size: 1.2rem;outline: none;width: min(90%,600px);">
          <option disabled selected value="" style="display:none">Select a Faculty</option>
          ${values.join("")}
        </select>
      </div>
      
      <div style="padding-top:20px;--fontSize: 1rem;" class="sectionSelect">
      
      </div>
      
      <div style="padding-top:10px;">
        <button type="submit" style="padding:5px 10px; border-radius:25px;font-size:1.2rem;">Search</button>
      </div>
    
    </form>
    
    <div id="displayContent">
    </div>
    
  `
  
  $("#display .displayWrapper").appendChild(div);
}
function sanitizeFacultyName(name){
  // console.log(name)
  let idxOf = name.indexOf("(");
  if(idxOf == -1) {idxOf = name.length}
  else{
    if( (name.trim()).endsWith(")") == false ){
      idxOf = name.length;
    }
  }
  return (name.substr(0,idxOf)).trim();
}

async function findSubjectFacultySubmit(e){
  e.preventDefault();
  const faculty = e.target.querySelector("#facultyId").value
  let slot = 0;
  if (e.target.querySelector("input[name='slot']:checked")) {
    slot = e.target.querySelector("input[name='slot']:checked").value
  }
  console.log(faculty, slot)
  
  const response = await fetch("/findsubjectfaculty?faculty=" + faculty + "&slot=" + slot)
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
  
  `;
  
  data.forEach((item)=>{
    document.querySelectorAll(`#displayContent table .day${item.day} td`)[item.slot].innerHTML = item.roomno;
  })
  
}


// #####################################################################################################################
// #####################################################################################################################
// #####################################################################################################################


async function requestSlotChange(me){
  openDisplay(me);
  const respAllSubs = await fetch("/getallsubjects?electives=false")
  const allSubjects = await respAllSubs.json();
  const values = allSubjects.map(item=>`<option value="${item.course_id}">${item.course_name}</option>`)
  
  
  $("#display .displayWrapper .loader").remove();
  const div = document.createElement("div");
  div.innerHTML = `
    <h1 style="padding:5px;padding-left:18px;">Request Slot Change</h1>
    <form style="text-align: center;padding-top: 20px;" onsubmit="requestSlotChangeSubmit(event)">
    
      <div>
        <label for="subject" disabled selected style="font-size:1.4rem;">Choose a Subject:</label>
        <select id="subjectId" name="subject" style="font-size: 1.2rem;outline: none;width: min(90%,600px);" onchange="selectedSlot()">
          <option disabled selected value="" style="display:none">Select a Course</option>
          ${values.join("")}
        </select>
      </div>
      
      <div style="padding-top:20px;--fontSize: 2rem;display:grid;grid-template-columns: 1fr 1fr;" class="sectionSelect">
        
          <div class="fromSlotWrapper">
            <select id="fromSlot" style="font-size: 1.2rem;outline: none;">
              <option disabled selected value="" style="display:none">Select the slot</option>
              
            </select>
          </div>
          
          <div class="toSlotWrapper" display="flex;flex-direction:column;">
            <select id="dayId" name="day" style="font-size: 1.2rem;outline: none;">
              <option disabled selected value="" style="display:none">Select a Day</option>
              <option value="0">MONDAY</option>
              <option value="1">TUESDAY</option>
              <option value="2">WEDNESDAY</option>
              <option value="3">THURSDAY</option>
              <option value="4">FRIDAY</option>
            </select>
            
            <select id="slotId" name="toSlot" style="font-size: 1.2rem;outline: none;">
              <option disabled selected value="" style="display:none">Select a Slot</option>
              <option value="1">Slot 1</option>
              <option value="2">Slot 2</option>
              <option value="3">Slot 3</option>
              <option value="4">Slot 4</option>
              <option value="5">Slot 5</option>
              <option value="6">Slot 6</option>
              <option value="7">Slot 7</option>
              <option value="8">Slot 8</option>
            </select>
            
          </div>
          
      </div>
      
      <div style="padding-top:10px;">
        <button type="submit" style="padding:5px 10px; border-radius:25px;font-size:1.2rem;">Submit</button>
      </div>
    
    </form>
    
    <div id="displayContent">
    </div>
    
  `
  
  $("#display .displayWrapper").appendChild(div);

}

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]
async function selectedSlot(){
  const subject = $("#subjectId").value
  console.log(subject);
  const response = await fetch("/findsubjectslots?subject=" + subject);
  const data = await response.json();
  console.log(data)
  const values = data.map(item=>`<option value="dayslot_${item.day}_${item.slot}">${days[item.day]} on Slot ${item.slot}</option>`)
  $("#fromSlot").innerHTML = `
    <option disabled selected value="" style="display:none">Select the slot</option>
    ${values.join("")}
  `
}

async function requestSlotChangeSubmit(e){
  e.preventDefault();
  const dayId = e.target.querySelector("#dayId").value
  const slotId = e.target.querySelector("#slotId").value
  const subjectId = e.target.querySelector("#subjectId").value
  const daySlot = e.target.querySelector("#fromSlot").value
  console.log(dayId, slotId, subjectId);
  
  const response = await fetch("/requestSlotChangefromStudent?subjectId=" + subjectId + "&dayId=" + dayId + "&slotId=" + slotId + "&from=" + daySlot)
  const data = await response.json();
  
  console.log(data)
  if(data.status == "ok"){
    $("#displayContent").innerHTML = `
      <h2>Your Request has been posted!</h2>
    `
  }else{
    $("#displayContent").innerHTML = `
      <h2>Unable to accept submission, Please try again later</h2>
    `
  }
}