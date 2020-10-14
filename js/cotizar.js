//Shortcuts
const d = document

// Setting up Bicycle types & it corresponding prices per hour
const type=["Playera", "Doble", "Mountain S", "Mountain P"]
const pxh=[ 60, 150, 120, 180];

//////////////////////////////////////////////////////////////

let  userinfo;
let biciInput;
let biciObject;
let inputValue;
let cotizarBtn;
let printTable;
let id;
let hours;
let hoursObject;
let reloadbtn;
let containercard;

////////////////////////////////////////////

window.onload = () => {
    hours = d.getElementById('hours');
    reloadbtn = d.getElementById('reload-btn');
    containercard= d.getElementById('bike-details');
    cotizarBtn = d.getElementById('save-btn');
    printTable = false;
    userinfo = [];
    inputValue = [0,0,0,0];
    biciObject = {};
    hoursObject = {};
    biciInput = Array.from(d.querySelectorAll('.bici-input'));
    biciInfoBtn = Array.from(d.querySelectorAll('.MoreI'));

    hours.addEventListener('input', function(){inputupdate()}); 
    reloadbtn.addEventListener('click',function(){loadinfo(biciInput)});

    cotizarBtn.addEventListener('click', e => {
        biciInput.forEach((bici) => {almacenarObjeto(bici.name, bici.value)})
    })
    
    // Array from the + & - buttons and their events
    let MinusBtn = Array.from(d.querySelectorAll('.minus'));
    let PlusBtn = Array.from(d.querySelectorAll('.plus'));

    MinusBtn.forEach((minus, l) => {
        minus.addEventListener('click', event => {
            Decrease(l, event.target)
            inputupdate(l)
        })
    })
    PlusBtn.forEach((plus, l) => {
        plus.addEventListener('click', event => {
            Increase(l, event.target)
            inputupdate(l)
        })
    })

    //Retrieves information from JSON when needed
    $(".MoreI").click(function(){
        id = $(this).attr('id')
        $.ajax({
        url: "../js/bikes.json",
        dataType: "json",
        success: function(response) {
            MoreInfo(id, response)
        }
        });
    });
};

////// END OF WINDOW.ONLOAD ///////

///////////////////////////////////
//           Math/Logic          //
///////////////////////////////////

// This function will run automatically after onload events are triggered
function inputupdate(index) {
    if (index == 4){ //Preventing "hours" from changing data of biciInput
        userinfo = quote()
    } else {
        let SelectedInput = biciInput[index];
        inputValue[index] = parseInt(SelectedInput.value);
        userinfo = quote()
    }
}

// quote() will set up userinfo[] for using later
function quote(){
    let subtotal = [0, 0, 0, 0];
    hours = d.getElementById('hours').value
    let amount = inputValue;

    for (let i in amount){
        (amount[i] !== 0) ? subtotal[i] = pxh[i]*hours : subtotal[i] = 0
    }

    booleanTable(hours, amount)
    userinfo = [amount, hours, subtotal];

    //Print Table after updating the data
    buildTable(printTable)

    return userinfo;
}

//total() will calculate how much the user has to pay
function total(){
    let sum = 0
    subtotal = userinfo [2]
    amount = userinfo [0]
    let i=0
    subtotal.forEach(element => {
            sum = sum + (element*amount[i])
            i++
    });
    return sum
}

////////////////////////////////
//  Dinamic Table Generation  //
////////////////////////////////

// BooleanTable will check wether the table should print or not
function booleanTable(condition1, condition2){
    let sum = 0
    for (let i=0 ; i < condition2.length ; i++){
        sum = sum + condition2[i]
    }
    (condition1 != 0 && sum !== 0) ? printTable = true : printTable = false; 
}

//Place the table in the Html if PrintTable=True
function buildTable(){
    let container = d.getElementById('l-bttm')
    if (printTable){
        TableMemo(container);
    } else {
        HideTable();
    }
}

//Place the table in the Html if PrintTable=True
function buildTable(){
    let container = d.getElementById('l-bttm')
    if (printTable){
        TableMemo(container);
    } else {
        HideTable();
    }
}

//Table render
function createTable(){
    let sum = total();
       return `
        <table class="table is-fullwidth" id=DetailTable>
            <thead>
                <tr>
                <th id="order">Tu pedido</th>
                <th>Detalle</th>
            </tr>
            </thead>
            <tbody>
                ${CreateRows()}
                <tr>
                    <td> Total </td>
                    <td> $${sum}
                </tr>
            </tbody>
        </table>
     <div class="row">
        <button class="btn" id="enviar_btn">Cerrar pedido</button>
        <button class="btn" id="sure_btn">✔</button>
     </div>  
       `
}

//Create the rows
function CreateRows(){
    let printT = inputValue
    let fila = ''
    let i=0
    printT.forEach(element => {
        if (element != 0){
            fila += `<tr>
                    ${CreateColumns(i)}
                </tr>`
        }
    i++ 
    });
    return fila
}

//Create Columns
function CreateColumns(i){
    subtotal = userinfo[2]
    amount = userinfo[0]
    let column = ''
    column += `<td>${amount[i]} ${type[i]} $${pxh[i]} x ${hours} Horas </td>
               <td>$${subtotal[i]*amount[i]}</td>`
    return column
}

//////////////////////////////
//   Modal & MoreInfo Card  //
//////////////////////////////

//Determine which button is click and print the respective information
function MoreInfo(identifier, bike) {
    bike.forEach(element => {
        if (element.id === identifier){BuildCard(element)}
    })
}

//Build the HTML of the modal card
function BuildCard(selected){
    let html =
    `<div class="row justify-content-center mt-5">
        <div class="card" style="width: 18rem;">
            <img src="${selected.img}" class="card-img-top" alt="${selected.name}">
            <div class="card-body">
                <h5 class="card-title">${selected.name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Precio por hora: ${selected.price}</h6>
                <h7 class="card-subtitle mb-2 text-muted">Carga maxima: ${selected.carga}</h7>
                <p class="card-text">${selected.description}</p>
            </div>
        </div>
    </div> `
    containercard.innerHTML = html
}

////////////////////////////////
//       + & - Buttons        //
////////////////////////////////

// Functions for the + & - buttons
function Decrease(index){
    let CurrentInput = biciInput[index];
    let CurrentValue = Number(CurrentInput.value) || 0;
    (CurrentValue == 0) ? RejectAnimation(index) : CurrentInput.value = CurrentValue - 1;
}

function Increase(index){
    let CurrentInput = biciInput[index];
    let CurrentValue = Number(CurrentInput.value) || 0;
    CurrentInput.value = CurrentValue + 1;
}

/////////////////////////////////
//     LocalStorage Buttons    //
/////////////////////////////////

// This function creates and saves biciObject
function almacenarObjeto(name, quantity){
    biciObject = {
        ...biciObject,
        [name]: quantity
    }

    let biciString = JSON.stringify(biciObject);
    localStorage.setItem('data', biciString);
}

// loadinfo retrieves information from localStorage
function loadinfo(list){
    let biciObjectParse = JSON.parse(localStorage.getItem('data'))

    inputValue = [biciObjectParse.playera,biciObjectParse.doble,biciObjectParse.mountainS,biciObjectParse.mountainD, biciObjectParse.hours]

    list.forEach((input, i) => {
        input.value = inputValue[i]
    })

    quote()
}