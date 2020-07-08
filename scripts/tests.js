import * as OptionSelector from "./modules/OptionSelector.js";
import * as cards from "./modules/cards.js";
import {PopUp} from "./modules/pop_ups.js";
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
let card = new cards.TextAreaCard({
	label: "Add description",
	location: "#cardLocation",
	content: {
		placeholder: "What was your dose like?"
	}
});
let testPopUp = new PopUp(card,null,null, document.getElementById("cardLocation"));
document.getElementById("popupButton").addEventListener('click', testPopUp.open());