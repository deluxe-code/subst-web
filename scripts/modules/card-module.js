import * as OptionSelector from "./OptionSelector.js";
export class CardInstance {
    cardContainer = document.createElement("div");
    cardLabel = document.createElement("span");
    constructor(card) {
        let { id, label, type, content} = card;
        this.cardContainer.id = id;
        this.cardContainer.className = type.id;
        // CREATE LABEL DIV AND SET .innerHTML to label variable
        this.cardLabel.innerHTML = label;
        this.cardLabel.className = "card_label";
        this.cardContainer.appendChild(this.cardLabel);
        this.cardContainer.appendChild(type.build(content));
        console.log(this.cardContainer);
        this.debugPlace();
    }
    debugPlace() {
        document.body.appendChild(this.cardContainer);
    }
}
let global_card_className = "card_container ";
export let cardTypes = {
    options: {
        // CONTAINS THE OPTION SELECTOR, AND HAS A SINGULAR OUTPUT
        id: global_card_className + "options_card",
        build: function(content) {
            console.log("Time to make an option selector div and return it!");
            
        },
        prerequisite: "This needs an array for the options that will be displayed in the OptionSelector"
    },
    textInput: {
        id: global_card_className + "input_card",
        build: function(content) {
            let inputBox = document.createElement("textarea");
            inputBox.id = "input_box";
            inputBox.placeholder = content.placeholder;
            return inputBox;
        }
    },
    time: {

    }
}

