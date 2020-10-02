import {Option, NewSelector} from "../../../app/modules/elements/new_selector.js";
import * as cards from "../../../app/modules/elements/cards.js";
import {PopUp, StrungPopUps} from "../../../app/modules/elements/pop_ups.js";
let mySelector;
window.addEventListener('load', ()=>{start();})
function start() {
    let myArray = [];
    myArray.push(new Option("1", "title", "content"));
    myArray.push(new Option("2", "title", "content"));
    myArray.push(new Option("3", "title", "content"));
    mySelector = new NewSelector(myArray);
    document.body.appendChild(mySelector.selector);
}