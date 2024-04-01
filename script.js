
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
// target titles
const budgetTitleEl = document.querySelector("[for=budget]");
const exTitleEl = document.querySelector("[for=expense__title]");
const exAmountTitleEl = document.querySelector("[for=expense__amount]");
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
        displayAlert(budgetTitleEl, "budget added successfully!", "success__alert");
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
        budgetTitleEl.innerText = "please enter your budget";
        budgetTitleEl.classList.remove("success__alert");
        displayAlert(budgetTitleEl, "budget edited successfully!", "success__alert");
    } else if(editBudget && (budgetValue==0)) {
        let list = JSON.parse(localStorage.getItem("valuesList"));
        list = list.map(item => {
            if(item.id==="budget") item.value=0;
            return item;
        });
        localStorage.setItem("valuesList", JSON.stringify(list));
        budgetInput.value = "";
        editBudget = false;
        reloadPage();
        budgetTitleEl.innerText = "please enter your budget"
        budgetTitleEl.classList.remove("success__alert");
        displayAlert(budgetTitleEl, "budget edited successfully!", "success__alert");
    } else if((editBudget||!editBudget) && !budgetValue){
        displayAlert(budgetTitleEl, "Enter Value!", "danger__alert");
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
    if(exTitle.length <= 11 && exAmount > 0 && !editFlag) {
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
        displayAlert(exTitleEl, "expense added successfully", "success__alert");
        displayAlert(exAmountTitleEl, "expense added successfully", "success__alert");
    } else if(exTitle.length <= 11 && exAmount > 0 && editFlag) {
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
        exAmountTitleEl.innerText = "please enter your expense amount";
        exAmountTitleEl.classList.remove("success__alert");
        exTitleEl.innerText = "Please Enter Your Expense Title";
        exTitleEl.classList.remove("success__alert");
        displayAlert(exTitleEl, "expense edited successfully", "success__alert");
        displayAlert(exAmountTitleEl, "expense edited successfully", "success__alert");
    } else {
        if((exTitle.length > 11 || exTitle.length < 1) && (editFlag||!editFlag)) {
            displayAlert(exTitleEl, "maxmum 11 chars and minimum 1 char!", "danger__alert");
        } else if ((exAmount < 1||!exAmount) && (editFlag||!editFlag)) {
            displayAlert(exAmountTitleEl, "minimum $1!", "danger__alert");
        }
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
    exAmountTitleEl.innerText = "ready to edit!";
    exAmountTitleEl.classList.add("success__alert");
    exTitleEl.innerText = "ready to edit!";
    exTitleEl.classList.add("success__alert");
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
    budgetTitleEl.innerText = "ready to edit";
    budgetTitleEl.classList.add("success__alert");
}
function scrollList() {
    let items = JSON.parse(localStorage.getItem("expensesList"));
    if(window.innerWidth > 992) {
        if(items.length > 6) {
            expensesList.classList.add("scroll-1");
        } else {
            expensesList.classList.remove("scroll-1");
        }
    } else {
        if(items.length > 4) {
            expensesList.classList.add("scroll-2");
        } else {
            expensesList.classList.remove("scroll-2");
        }
    }
}
function displayAlert(element, value, className){
    let orgValue = element.innerText;
    element.innerText = value;
    element.classList.add(className);
    setTimeout(()=> {
        element.innerText = orgValue;
        element.classList.remove(className);
    }, 1600);
}
function reloadPage() {
    setValues();
    setItems();
    updateBalance();
    checkBudget();
    scrollList();
}
// scroll