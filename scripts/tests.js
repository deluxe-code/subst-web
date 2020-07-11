import * as OptionSelector from "./modules/OptionSelector.js";
import * as cards from "./modules/cards.js";
import {PopUp} from "./modules/pop_ups.js";
import {ElementDragger} from "./modules/element_dragger.js";
let mySelector;
function start() {

    let arr = [];
    for(var i = 0; i < 10; i++){
        arr[i] = "forloop, " + i;
    }
    mySelector = new OptionSelector.Selector([arr, new OptionSelector.OptionSelectorConfig()]);
    mySelector.animator.boxGrowthAmount = 0.2;
    document.getElementById("option").appendChild(mySelector.getElement());
}
start();
let cardElement = document.createElement("div");
let card = new cards.OptionSelectorCard({
    id: "strainSelector",
    label: "Pick a strain",
    content: {
        options: ["Super Silver Haze", "Girl Scout Cookies", "Fruity Pebbles", "Vibe Juices", "OG Granny"],
        styles: new OptionSelector.OptionSelectorConfig(),
        hasAddButton: false
    }
});
let testPopUp = new PopUp(card,null,null, document.getElementById("cardLocation"));
document.getElementById("popupButton").addEventListener('click', () => {testPopUp.open()});
let testDrag = new ElementDragger({
    elementToDrag: document.getElementById("dragTest"),
    restrictY: true,
    releaseFunction: function() {console.log()}
});