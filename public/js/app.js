async function logout(){
  const resp = confirm("Confirm to logout?")
  if(resp){
    const response = await fetch("/logout");
    document.location.reload()
  }
}

function openDisplay(me){
  console.log(me);
  // me.style.display = "none";
  // $(".floorplanBtn").style.display = "block";
  $("#display").classList.add("active");
  $("main").style.overflow = "hidden";
  $("main").scrollTo(0,0)
  
  $("#display").innerHTML = `
    <div class="displayWrapper noSelect myScrollbar">
      <span class="material-symbols-outlined icon noSelect cancelBtn" onclick="closeDisplay()">cancel</span>
      
        <span class="loader"></span>
      
    </div>
  `
  
  const x = me.offsetLeft + (me.offsetWidth / 2) 
  const y = me.offsetTop + (me.offsetHeight / 2) 
  console.log(`${ (x / $("#display").offsetWidth) * 100 }% ${(y / $("#display").offsetHeight) * 100}%`)
  $("#display").style.transformOrigin = `${ (x / $("#display").offsetWidth) * 100 }% ${(y / $("#display").offsetHeight) * 100}%`
  
}

function closeDisplay(){
  $("#display").classList.remove("active");
  $("main").style.overflow = "inherit";
  // document.querySelectorAll(".operationDiv").forEach(div=>{div.style.display = "flex";})
  // $(".floorplanBtn").style.display = "block";
}

document.addEventListener("keyup",(evt)=>{
  if(evt.key === "Escape") {
    if( document.activeElement.nodeName == "BODY" ) closeDisplay();
  }
})


function showFloorplan(me){
  console.log("viewing floor plan");
  openDisplay(me);
  
  $("#display .displayWrapper .loader").remove();
  const div = document.createElement("div");
  div.style.width = "100%";
  div.style.overflow = "auto";
  div.innerHTML = `
    <h1 style="padding:5px;padding-left:8px;">Floor Plan</h1>
    <div style="padding-left:20px;text-decoration:underline;">
      Ground Floor Plan
    </div>
    <img src="https://cdn.glitch.global/13adfb5b-b8cd-4367-a6c4-4deb15b4aee7/GROUND%20FLOOR_1.svg?v=1685343593520" style="width:90%;display:block;">
    
    <br>
    <br>
    <br>
    
    <div style="padding-left:20px;text-decoration:underline;">
      First Floor Plan
    </div>
    <img src="https://cdn.glitch.global/13adfb5b-b8cd-4367-a6c4-4deb15b4aee7/1ST%20FLOOR_1.svg?v=1685343594200" style="width:90%;display:block;">
  `
  $("#display .displayWrapper").appendChild(div);
}



function openSettings(){
  console.log("settings..")
  $("#passwordReset").classList.add("active");
}

function closeSettings(){
    $("#passwordReset").classList.remove("active");
}


function openMessages(){
  $("#mailContainer").classList.toggle("active");
  const navWidth = $("#container nav").offsetWidth + "px";
  console.log(navWidth);
  $("#mailContainer").style.setProperty("--navWidth", navWidth );
}
