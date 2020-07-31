import * as OptionSelector from "../../modules/OptionSelector.js";
import * as cards from "../../modules/cards.js";
import {PopUp, StrungPopUps} from "../../modules/pop_ups.js";
let mySelector;
function start() {

    let arr = [];
    for(var i = 0; i < 10; i++){
        arr[i] = "forloop, " + i;
    }
    mySelector = new OptionSelector.Selector([arr, new OptionSelector.OptionSelectorConfig()]);
    mySelector.animator.boxGrowthAmount = 0.5;
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
let card2 = new cards.OptionSelectorCard({
    id: "strainSelector",
    label: "Pick a strain",
    content: {
        options: ["Super Silver Haze", "Girl Scout Cookies", "Fruity Pebbles", "Vibe Juices", "OG Granny"],
        styles: new OptionSelector.OptionSelectorConfig(),
        hasAddButton: false
    }
});
let card3 = new cards.OptionSelectorCard({
    id: "strainSelector",
    label: "Pick a strain",
    content: {
        options: ["Super Silver Haze", "Girl Scout Cookies", "Fruity Pebbles", "Vibe Juices", "OG Granny"],
        styles: new OptionSelector.OptionSelectorConfig(),
        hasAddButton: false
    }
});
let testPopUp = new PopUp(card, document.getElementById("cardLocation"));
let testStrungPopUp = new StrungPopUps(document.getElementById("cardLocation"), [testPopUp, new PopUp(card2, document.getElementById("cardLocation")), new PopUp(card3, document.getElementById("cardLocation"))]);

document.getElementById("popupButton").addEventListener('click', () => {testStrungPopUp.open()});