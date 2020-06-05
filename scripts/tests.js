import * as OptionSelector from "./modules/OptionSelector.js";
let mySelector;
function start() {

    let arr = [];
    for(var i = 0; i < 10; i++){
        arr[i] = "forloop, " + i;
    }
    mySelector = new OptionSelector.Selector(arr);
    document.getElementById("option").appendChild(mySelector.getElement());
}
start();