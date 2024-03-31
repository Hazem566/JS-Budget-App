
/* ---------------------- TARGET ELEMENTS ---------------------- */
// target inputs
const budgetInput = document.getElementById("budget");
const expenseTitle = document.getElementById("expense__title");
const expenseAmount = document.getElementById("expense__amount");
// target buttons
const calc = document.querySelector(".btn0");
const addExp = document.querySelector(".btn1");
const editBud = document.querySelector(".btn3");
// target values 
const budget = document.querySelector(".budget__s");
const expense = document.querySelector(".expense__s");
const balance = document.querySelector(".balance__s");
// target elements
const expensesList = document.querySelector('.list');
const listSection = document.querySelector(".expenses__info");
// Edit Elements
let editFlag = false;
let editBudget = false;
let elementID = "";
/* ---------------------- EVENT LISTNER ---------------------- */
calc.addEventListener("click", addBudget);
window.addEventListener("DOMContentLoaded", reloadPage);
addExp.addEventListener("click", addExpenses);
editBud.addEventListener("click", editBudgetFun)
/* ---------------------- FUNCTIONS ---------------------- */
// valuesList / expensesList
function addBudget(e) {
    e.preventDefault();
    let budgetValue = parseInt(budgetInput.value);
    if((budgetValue && budgetValue > 0) && !editBudget) {
        let localBudget = getData("budget");
        localBudget += budgetValue;
        let valuesList = getValuesList();
        valuesList = valuesList.map(i=>{if(i.id=="budget")i.value = localBudget;return i});
        localStorage.setItem("valuesList", JSON.stringify(valuesList));
        budgetInput.value = "";
        reloadPage();
    } else if(editBudget && budgetValue){
        let list = JSON.parse(localStorage.getItem("valuesList"));
        list = list.map(item => {
            if(item.id==="budget") item.value=budgetValue;
            return item;
        });
        localStorage.setItem("valuesList", JSON.stringify(list));
        budgetInput.value = "";
        editBudget = false;
        reloadPage();
    } else if(editBudget && (!budgetValue||budgetValue==0)) {
        let list = JSON.parse(localStorage.getItem("valuesList"));
        list = list.map(item => {
            if(item.id==="budget") item.value=0;
            return item;
        });
        localStorage.setItem("valuesList", JSON.stringify(list));
        budgetInput.value = "";
        editBudget = false;
        reloadPage();
    }
}
// localStorage.clear();
function getValuesList(){
    return localStorage.getItem("valuesList") ?
    JSON.parse(localStorage.getItem("valuesList")) : 
    [{"id": "budget", "value": 0},{"id": "expense", "value": 0},{"id": "balance", "value": 0}];
}
function getData(key) {
    let valuesList = getValuesList();
    if(key=="budget")return parseInt(valuesList.filter(i=>{
        if(i.id=="budget")return i;
    })[0].value);
    else if(key=="expense")return parseInt(valuesList.filter(i=>{
        if(i.id=="expense")return i;
    })[0].value);
    else if(key=="balance")return parseInt(valuesList.filter(i=>{
        if(i.id=="balance")return i;
    })[0].value);
}
function setValues() {
    budget.innerText = getData("budget");
    expense.innerText = getData("expense");
    balance.innerText = getData("balance");
}
function updateBalance() {
    let budget = getData("budget");
    let expense = getData("expense");
    let newBalance = budget - expense;
    let valuesList = getValuesList().map(i=>{
        if(i.id=="balance")i.value=newBalance;
        return i
    });
    localStorage.setItem("valuesList", JSON.stringify(valuesList));
    setValues();
}
function addExpenses(e) {
    e.preventDefault();
    let exTitle = expenseTitle.value;
    let exAmount = parseInt(expenseAmount.value);
    if((exAmount&&exTitle)&&!editFlag) {
        expenseAmount.value = "";
        expenseTitle.value = "";
        let id = new Date().getTime().toString();
        addToLocalStorage(exTitle, exAmount, id);
        let localEx = getData("expense") + exAmount;
        let valuesList = getValuesList().map(item => {
            if(item.id == "expense") item.value = localEx; return item;
        });
        localStorage.setItem("valuesList", JSON.stringify(valuesList));
        reloadPage();
    } else if((exAmount&&exTitle)&&editFlag) {
        expenseAmount.value = "";
        expenseTitle.value = "";
        let list = JSON.parse(localStorage.getItem("expensesList"));
        list = list.map(item => {
            if(item.id===elementID){
                item.value=exAmount;item.title=exTitle;
            }
            return item;
        });
        localStorage.setItem("expensesList", JSON.stringify(list));
        editFlag = false;
        let localEx = getData("expense") + exAmount;
        let valuesList = getValuesList().map(item => {
            if(item.id == "expense") item.value = localEx;
            return item;
        });
        localStorage.setItem("valuesList", JSON.stringify(valuesList));
        reloadPage();
    }
}
function setItems() {
    let items = localStorage.getItem("expensesList")?
    JSON.parse(localStorage.getItem("expensesList")):[];
    if(items.length > 0) {
        listSection.classList.add("show");
        expensesList.innerHTML = JSON.parse(localStorage.getItem("expensesList")).map(item => {
            return `<li class="item" id="${item.id}">
            <p>${item.title}</p>
            <h3>${item.value}</h3>
            <div class="tools">
                <button type="button" class="tool edit__btn">
                    <img src="./assets/checked_709510.png" style="transform: scale(0.85);" alt="edit image" />
                </button>
                <button type="button" class="tool delete__btn">
                    <img src="./assets/trash-bin_5028066.png" alt="delete image" />
                </button>
            </div>
            </li>`;
        }).join("");
        let deleteBtns = document.querySelectorAll("ul li .delete__btn");
        deleteBtns.forEach(btn => btn.addEventListener("click", (e) => deleteItems(e)));
        let editBtns = document.querySelectorAll("ul li .edit__btn");
        editBtns.forEach(btn => btn.addEventListener("click", (e) => editItem(e)));
    } else {
        listSection.classList.remove("show");
    }
}
function addToLocalStorage(title, value, id){
    let item = {title, value, id};
    let exList = localStorage.getItem("expensesList") ?
    JSON.parse(localStorage.getItem("expensesList")) : [];
    exList.push(item);
    localStorage.setItem("expensesList", JSON.stringify(exList));
}
function deleteItems(e){
    let item = e.currentTarget.parentElement.parentElement;
    let id = item.id;
    expensesList.removeChild(item);
    let value = parseInt(e.currentTarget.parentElement.previousElementSibling.innerText);
    let totalEx = getData("expense") - value;
    let valuesList = getValuesList().map(item => {
        if(item.id=="expense")item.value=totalEx;
        return item;
    });
    localStorage.setItem("valuesList", JSON.stringify(valuesList));
    let exList = JSON.parse(localStorage.getItem("expensesList"));
    exList = exList.filter(item => item.id != id);
    localStorage.setItem("expensesList", JSON.stringify(exList));
    updateBalance();
    reloadPage();
}
function editItem(e) {
    editFlag = true;
    elementID = e.currentTarget.parentElement.parentElement.id;
    let list = JSON.parse(localStorage.getItem("expensesList"));
    let item = list.filter(i => i.id == elementID)[0];
    expenseAmount.value = item.value;
    expenseTitle.value = item.title;
    let localEx = getData("expense") - item.value;
    let valuesList = getValuesList().map(item => {
        if(item.id == "expense") item.value = localEx;
        return item;
    });
    localStorage.setItem("valuesList", JSON.stringify(valuesList));
    reloadPage();
}
function checkBudget(){
    let bud = getData("budget");
    if(bud > 0){
        editBud.classList.add("show");
    } else {
        editBud.classList.remove("show");
    }
}
function editBudgetFun(e){
    e.preventDefault();
    let localBud = getData("budget");
    budgetInput.value = localBud;
    let list = JSON.parse(localStorage.getItem("valuesList"));
    list = list.map(item => {
        if(item.id === "budget") item.value=0;
        return item;
    });
    console.log(localBud);
    localStorage.setItem("valuesList", JSON.stringify(list));
    editBudget = true;
    reloadPage();
}
function reloadPage() {
    setValues();
    setItems();
    updateBalance();
    checkBudget()
}