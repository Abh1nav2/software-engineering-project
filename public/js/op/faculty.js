console.log("faculty")


function viewClasses(me){
  openDisplay(me);
  
  
  $("#display .displayWrapper .loader").remove();
  const div = document.createElement("div");
  div.style.width = "100%";
  div.innerHTML = `
    <h1 style="padding:5px;padding-left:18px;">Section Wise Classes</h1>
    <div style="text-align: center;padding-top: 20px;">
   
      <div style="padding-top:10px;--fontSize: 2rem;" class="sectionSelect">
        <div>
           Select a Section:
        </div>
        
        <input type="radio" id="secA" name="section" value="A" oninput=showTimetable(this)>
        <label for="secA">A</label>
        
        <input type="radio" id="secB" name="section" value="B" oninput=showTimetable(this)>
        <label for="secB">B</label>
        
        <input type="radio" id="secC" name="section" value="C" oninput=showTimetable(this)>
        <label for="secC">C</label>
        
        <input type="radio" id="secD" name="section" value="D" oninput=showTimetable(this)>
        <label for="secD">D</label>
        
        <input type="radio" id="secE" name="section" value="E" oninput=showTimetable(this)>
        <label for="secE">E</label>
        
        <input type="radio" id="secF" name="section" value="F" oninput=showTimetable(this)>
        <label for="secF">F</label>
        
      </div>
      
    </div>
    
    <div id="displayContent" style="width:100%;">
      
    </div>
    
  `
  $("#display .displayWrapper").appendChild(div);
  
}

function showTimetable({value}){
  $("#displayContent").innerHTML = `<img src="https://cdn.glitch.global/13adfb5b-b8cd-4367-a6c4-4deb15b4aee7/BTechCSE${value}.png" style="width:100%;">`
}


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

function requestFacultySlot(me){
  openDisplay(me);
  $("#display .displayWrapper .loader").remove();
  const div = document.createElement("div");
  div.style.width = "100%";
  div.innerHTML = `
    <h1 style="padding:5px;padding-left:18px;">Requesting incharge faculty for class</h1>
    <div style="text-align: center;padding-top: 25px;">
    
      <div>
          <label>
            Which Classroom?:
            <select id="sectionId" name="section" style="font-size: 1.2rem;outline: none;" oninput="selectedSectionNNNNNNNNNNNNNNNNN(this)">
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
          Subject to take?:
          <input type="text" id="subjectId" name="subject" maxlength="8" style="font-size: 1.2rem;outline: none;max-width:130px;" placeholder="eg. 19CSE314">
        </label>
        
    </div>

    <div id="displayContent">
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
    
    </div>
    
  `
  $("#display .displayWrapper").appendChild(div);
}

async function selectedSectionNNNNNNNNNNNNNNNNN({value}){
  const response = await fetch("/getSubjectTimetable?section=" + value)
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
    td.innerHTML = `<button onclick="requestSlotDetails(${item.day},${item.slot}, '${item.course_id}')" style="cursor:pointer;">${(item.course_id).split("-")[0]}</button>`;
    td.style.background = "var(--theme2)";
    // td.style.cursor = "pointer";
    td.style.opacity = "0.7";
  })  
}

async function requestSlotDetails(day, slot, course_id){
  console.log(day, slot, course_id)
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
  
  const response = await fetch("/confirmBookInchargedSlot?section=" + section + "&day="+day+"&slot="+slot + "&subject=" + course_id + "&new_subject=" + subject);
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




async function selectedSection({value}){
  const response = await fetch("/sectiontimetable?section=" + value + "&isAdmin=false");
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








function viewTimetable(me){
  alert("function not available yet")
}