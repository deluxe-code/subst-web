import * as OptionSelector from "./modules/OptionSelector.js";
console.log("4");
let mySelectorList = new SelectorOptionLinkedList("o");
let mySelector;

function start() {
    
    let arr = [];
    for(var i = 0; i < 30; i++){
        arr[i] = "forloop, " + i;
    }
    this.mySelectorList.insertArray(arr);
    this.mySelector = new Selector("option", this.mySelectorList);
    this.mySelector.refreshOptions();
}
start();