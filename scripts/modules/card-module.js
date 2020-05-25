// import * as OptionSelector from "./OptionSelector.js";
export class Card {
    constructor(card_info) {
        this.type = card_info.type;
        this.layout = new CardLayout(this, card_info);
    }
    delete() {
        // DELETE THE ENTIRE CARD 
        
    }
    getOutput() {
        return this.type.output(this.layout.card_container);
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
        build: async function(content) {
            let inputBox = document.createElement("textarea");
            inputBox.id = "input_textarea";
            inputBox.placeholder = content.placeholder;
            return inputBox;
        },
        output: function() {
            return document.querySelector(this.inputReference);
        },
        inputReference: "#input_textarea"
        // TODO template: makeATemplateSystemHere
    },
    substance_picker: {
        id: global_card_className + "picker_card",
        build: async function(content) {
            let substanceArray = content.items;
            let list_container = document.createElement("div");
            list_container.id = "substance_list";
            let list_items = [];
            substanceArray.forEach(substance => {
                let item_container = document.createElement("div");
                item_container.className = "substance_item";

                let label_container = document.createElement("div");
                label_container.className = "substance_label";
                label_container.innerHTML = substance;

                let add_container = document.createElement("div");
                add_container.className = "add_button";
                add_container.innerHTML = "+";
                
                item_container.appendChild(label_container);
                item_container.appendChild(add_container);
                list_items.push(item_container);
            });
            list_items.forEach(item => {
                list_container.appendChild(item);
            })
            // Make this do more later
            return list_container;
        }
    }
}
class CardLayout {
    constructor(card_context, card_properties) {
        this.card_context = card_context;
        this.card_properties = card_properties;
        this.initialize();

    }
    async initialize() {
        let { id, label, type, content} = this.card_properties;

        // CREATE CARD CONTAINER ELEMENT
        this.card_container = document.createElement("div");
        this.card_container.id = id;
        this.card_container.className = type.id;

        // CREATE LABEL
        this.card_label = document.createElement("span");
        this.card_label.className = "card_label";
        this.card_label.innerHTML = label;
        // INSERT THE CARD'S LABEL
        this.card_container.appendChild(this.card_label);



        
        // INSERT THE GENERATED ELEMENT
        // this.card_container.appendChild(type.build(content));

        await this.generate().then(element => {
            this.card_container.appendChild(element);
            this.place();
        });
    }
    async generate() {
        let builderFunction = this.card_context.type.build;

        let content = this.card_properties.content;
        return await builderFunction(content).then(buildOutput => {
            return buildOutput;
        });

    }
    place() {
        document.body.appendChild(this.card_container);
        console.log(this + " has been placed in the DOM");
    }
}

