// import * as OptionSelector from "./OptionSelector.js";
export class Card {
    constructor(card_info) {
        this.layout = new CardLayout(card_info);
    }
    delete() {
        // DELETE THE ENTIRE CARD 
        
    }
    getOutput() {
        // NOTE Find a way to get outputs in a dynamic way.
        // While a textarea input card will just have one output, the text typed inside
        // Other cards will likely need a special interface for outputting more than just thing
    }
}
let global_card_className = "card_container ";
export let cardType = {
    options: {
        // CONTAINS THE OPTION SELECTOR, AND HAS A SINGULAR OUTPUT
        id: global_card_className + "options_card",
        build: function(content) {
            console.log("Time to make an option selector div and return it!");
            // return OptionSelectorElement;
        },
        prerequisite: "This needs an array for the options that will be displayed in the OptionSelector"
    },
    textInput: {
        id: global_card_className + "input_card",
        build: function(content) {
            let inputBox = document.createElement("textarea");
            inputBox.class = "input_textarea";
            inputBox.placeholder = content.placeholder;
            return inputBox;
        }
        // TODO template: makeATemplateSystemHere
    },
    time: {

    },
    substance_picker: {
        id: global_card_className + "picker_card",
        build: function(content) {
            let substanceArray = content.items;
            for (let substance in substanceArray) {
                console.log(substanceArray[substance]);
            }
        }
    }
}
class CardLayout {
    constructor(card_info) {
        this.info = card_info;
        this.initialize();

    }
    initialize() {
        let { id, label, type, content} = this.info;
        this.card_container = document.createElement("div");
        this.card_container.id = id;
        this.card_container.className = type.id;

        this.card_label = document.createElement("span");
        // CREATE LABEL DIV AND SET .innerHTML to label variable
        this.card_label.innerHTML = label;
        this.card_label.className = "card_label";




        // INSERT THE CARD'S LABEL
        this.card_container.appendChild(this.card_label);
        // INSERT THE GENERATED ELEMENT
        // this.card_container.appendChild(type.build(content));
        this.build();
        this.place();
    }
    build() {
        

    }
    place() {
        document.body.appendChild(this.card_container);
    }
}

