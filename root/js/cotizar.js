//Shortcuts
const d = document

// Setting up Bicycle types & it corresponding prices per hour
const type=["Playera", "Doble", "Mountain S", "Mountain P"]
const pxh=[ 60, 150, 120, 180];

let  userinfo, biciInput, biciObject, inputValue;
let hours = d.getElementById('hours')
let reloadbtn = d.getElementById('reload-btn')
let cotizarBtn;
let printTable;


window.onload = () => {
    console.log('The page has fully loaded');
    cotizarBtn = d.getElementById('save-btn')
    printTable = false
    userinfo = [];
    inputValue = [0,0,0,0];
    biciObject = {};
    biciInput = Array.from(d.querySelectorAll('.bici-input'));

    biciInput.forEach((bici, i) => {
        bici.addEventListener('input', event => {
            inputupdate(i, event.target.value)
        })
    })

    hours.addEventListener('input', function(){inputupdate()});
    reloadbtn.addEventListener('click',function(){loadinfo(biciInput)})
    cotizarBtn.addEventListener('click', e => {
        biciInput.forEach((bici, i) => {
                almacenarObjeto(bici.name, bici.value)
        })
    })
};

///////// SLIDER /////////

var rangeSlider = function(){
    var slider = $('.range-slider'),
        range = $('.range-slider__range'),
        value = $('.range-slider__value');
      
    slider.each(function(){
  
      value.each(function(){
        var value = $(this).prev().attr('value');
        $(this).html(value);
      });
  
      range.on('input', function(){
        $(this).next(value).html(this.value);
      });
    });
  };
rangeSlider();

///////////////////////////

// This function creates and saves biciObject
function almacenarObjeto(name, value){
    biciObject = {
        ...biciObject,
        [name]: value
    }
    let biciString = JSON.stringify(biciObject)
    localStorage.setItem('data', biciString);
}

function loadinfo(list){
    let biciObjectParse = JSON.parse(localStorage.getItem('data'))

    inputValue = [biciObjectParse.playera,biciObjectParse.doble,biciObjectParse.mountainS,biciObjectParse.mountainD]
    
    list.forEach((input, i) => {
        input.value = inputValue[i]
    })
    quote()
}

// This function will run automatically after onload events are triggered
function inputupdate(index,value) {
    inputValue[index] = parseInt(value);
    // inputValue = [biciObject.playera, biciObject.doble, biciObject.mountainS, biciObject.mountainD]
    // console.log(inputValue)
    userinfo = quote()
}

// quote() will set up userinfo[], triggered by events on #SECTION B#
function quote(){
    let subtotal = [0, 0, 0, 0];
    hours = d.getElementById('hours').value
    let amount = inputValue

    for (let i in amount){
        (amount[i] !== 0) ? subtotal[i] = pxh[i]*hours : subtotal[i] = 0
    }
    
    // for (let i=0 ; i < amount.length ; i++){
    //     if (amount[i] != 0){
    //         subtotal[i] = pxh[i]*hours
    //     } else {
    //         subtotal[i] = 0
    //     }
    // }

    booleanTable(hours, amount)
    userinfo = [amount, hours, subtotal];

    //Print Table after updating the data
    buildTable(printTable)

    return userinfo;
}

function booleanTable(condition1, condition2){
    let sum = 0
    // let time = parseInt(condition1)
    for (let i=0 ; i < condition2.length ; i++){
        sum = sum + condition2[i]
    }

    // condition2.forEach(element => {
    //     sum = sum + element
    // })
    (condition1 != 0 && sum !== 0) ? printTable = true : printTable = false; 
}

//Table render
function createTable(){
    let sum = total();
       return `
      <table class="table is-fullwidth">
         <thead>
             <tr>
             <th id="order">Tu pedido</th>
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

//Place the table in the Html, triggered by events on #SECTION C#
function buildTable(){
    let container = d.getElementById('l-bttm')
    container.innerHTML = '';
    if (printTable){
    container.innerHTML = '';
    let html = createTable();
    container.innerHTML = html;
    }
}

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

/////////////////////////////////////////////////////////////////

// Run info() if you need to check the data uploaded
function info() { 
    let amount = userinfo [0]
    let hours = userinfo [1]
    for (let i=0 ; i < amount.length ; i++){
        if (amount[i] != 0){
        console.log("Se alquilo " + amount[i] + " Bici/s del tipo " + type[i] + " por " + hours + " horas, el total a cobrar es de: $" + pxh[i]);
        }
    }
}


