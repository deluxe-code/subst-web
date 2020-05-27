// import * as OptionSelector from "./OptionSelector.js";
import { EventHandler } from "./event_handler.js";

export const cards_config = {
    autoPlace: "false",
    defaultContainer: document.body,
    setDefaultContainer: function(query) {
        this.defaultContainer = document.querySelector(query);
    }
}
class Card {
    constructor(card_config, className) {
        this.className = "card_container ";
        className ? this.className += className : console.log("no class given");
        this._config = card_config;
        this._layout = new CardLayout(this);
        this._eventHandler = new EventHandler(this);
    }
    getEventHandler() {
        return this._eventHandler;
    }
    getLabel() {
        return this._config.label;
    }
    getID() {
        return this._config.id;
    }
    getContent() {
        return this._config.content;
    }
}
export class TextAreaCard extends Card {
    constructor(card_config) {
        super(card_config, "input_card");
        this._outputReference;
        // NOTE: THE LAYOUT IS CREATED BEFORE THE className ADJUSTMENT CAN BE MADE
    }
    build() {
        let content = this.getContent();
        let inputBox = document.createElement("textarea");
        inputBox.placeholder = content.placeholder;
        inputBox.addEventListener("keydown", () => {
            this.getEventHandler().newEvent({
                type: "change",
                body: {
                    value: inputBox.value,
                    location: inputBox,
                    author: this
                }
            });
        });

        this._outputReference = inputBox;
        return inputBox;
    }
    getOutput() {
        console.log("Output requested for TextArea Card");
        return this._outputReference.value;
    }
}
export class OptionSelectorCard extends Card {
    constructor(card_config) {
        super(card_config, "option_selector_card");
    }
    build() {

    }
    getOutput() {
        
    }
}
export class SubstancePickerCard extends Card {
    constructor(card_config) {
        super(card_config, "picker_card");
    }
    build() {
        let content = this.getContent();
        let substanceArray = content.substances;
            let list_container = document.createElement("div");
            list_container.id = "substance_list";
            let list_items = [];
            substanceArray.forEach(substance => {
                let item_container = document.createElement("div");
                item_container.className = "substance_item";

                let label_container = document.createElement("div");
                label_container.className = "substance_label";
                label_container.innerHTML = substance.name;

                let add_container = document.createElement("div");
                add_container.className = "add_button";
                add_container.innerHTML = "+";

                add_container.addEventListener("click", () => {
                    this.getEventHandler().newEvent({
                        type: "select",
                        body: {
                            value: substance.id,
                            location: add_container,
                            author: this
                        }
                    });
                });
                
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
class CardLayout {
    constructor(parent) {
        this._parent = parent;
        let card_container = document.createElement("div");
        card_container.id = this._parent.getID();
        card_container.className = this._parent.className;


        if (this._parent.getLabel()) {
            let card_label = new Label({
                className: "card_label",
                label: this._parent.getLabel()
            });
            card_container.appendChild(card_label);
        }
        let generatedLayout = this._parent.build();
        card_container.appendChild(generatedLayout);

        if (cards_config.autoPlace) {
            cards_config.defaultContainer.appendChild(card_container);
        }
    }
}
class Label {
    constructor(label_config) {
        this._config = label_config;
        let label_element = document.createElement("span");
        label_element.className = this._config.className;
        if (this._config.id) {
            label_element.id = this._config.id;
        }
        label_element.innerHTML = this._config.label;
        this._node = label_element;
        return this._node;
    }
}


