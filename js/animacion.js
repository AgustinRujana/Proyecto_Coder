
//////////////////////
//      JQuery      //
//////////////////////

let MainTl = gsap.timeline();
let BtnTl = gsap.timeline();
let HideTl = gsap.timeline();
let BtnDuration = 0.2;
let Run = true //Create a boolean to identify when an animation is running

// Entry button animation
$("#entry_btn").click(function(){
    MainTl.to("#entry_logo", {opacity:0, duration:1});
    MainTl.to("#entry_btn", {opacity:0, duration:1});
    MainTl.to("#entry_move", {width:100 ,backgroundColor:"#3e978b", duration:1, onComplete: function(){ChangePlaces()}});
})

// This function transition from the entry panel to the main table
function ChangePlaces(){
    $("#entry_area").remove()
    $("#mainarea").hide()
    $("#mainarea").removeClass("display_none")
    $("#mainarea").fadeIn()
}

// If the input is 0 and the user try to lower it to negative values this animation will show up
function RejectAnimation(index){
    let BtnSelect = "." + biciInput[index].name;
    if (Run){ //Check if the animation is running
        BtnTl.fromTo(BtnSelect,
            {backgroundColor:"red", opacity:1, duration:BtnDuration},
            {backgroundColor:"red", opacity:0, duration:BtnDuration, onStart: function(){Running()}},
        );
        BtnTl.fromTo(BtnSelect,
            {backgroundColor:"red", opacity:0, duration:BtnDuration},
            {backgroundColor:"white", opacity:1, duration:BtnDuration, onComplete: function(){Running()}}
        );
    }
}

//This function prevent the animation from running multiple times if the user spam the buttons
function Running(){
    Run = !Run; //When run is false an animation is running
}

//This function changes a boolean dependent of printTable to define between three posible states
//                             (Table Showing/Updating/Hiding)
function TableMemo(x){
    (x.innerHTML == '') ? ShowTable() : UpdateTable()
}

function ShowTable(){
    SettingDiv()
    $("#l-bttm").slideDown("slow");
}

function HideTable(){
    $("#l-bttm").slideUp("slow").delay(600).html('');    
}

function UpdateTable(){
    $("#DetailTable").fadeOut(750,function(){SettingDiv()});
    
    //Opening the sure btn after "Cerrar Pedido"
    $("#sure_btn").hide();
    $("#enviar_btn").click( function(){$("#sure_btn").fadeIn(500);});
    $("#sure_btn").click(function(){SendAnimation()});
}

////////////////////////////////////////
function SettingDiv(){
    $("#l-bttm").html(createTable())

    //Opening the sure btn after "Cerrar Pedido"
    $("#sure_btn").hide();
    $("#enviar_btn").click( function(){$("#sure_btn").fadeIn(500);});
    $("#sure_btn").click(function(){SendAnimation()});
}

function SendAnimation(){
    HideTl.to("#mainarea",{opacity:0, duration:1});
    HideTl.to("#entry_move", {width:'100vw' ,backgroundColor:"#2ec1ac", duration:1,onComplete: function(){EndingAnimation()}});
}

function EndingAnimation(){
    $("#entry_move").html('<div class="flexcentered"><img id="ending_logo" src="../img/Logo3.jpg" alt="Logo Puerto Bici"><h2 id="thanks">Gracias!</h2><h6 class="pay">Redireccionando a la ventana de pago</h6><div class="pay spinner-border text-warning" role="status"><span class="sr-only">Loading...</span></div></div>');
    HideTl.to("#ending_logo", {opacity:1, duration:1});
    HideTl.to("#thanks", {opacity:1, duration:0.5});
    HideTl.to(".pay", {opacity:1, duration:0.5});
}


