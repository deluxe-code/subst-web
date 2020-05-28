import * as OptionSelector from "./modules/OptionSelector.js";
let mySelector;
function start() {

    let arr = [];
    for(var i = 0; i < 30; i++){
        arr[i] = "forloop, " + i;
    }
    mySelector = new OptionSelector.Selector("option", new OptionSelector.SelectorOptionLinkedList(arr));
}
start();