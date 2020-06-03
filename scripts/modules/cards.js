// import * as OptionSelector from "./OptionSelector.js";
import { EventHandler } from "./event_handler.js";
import * as OptionSelector from "./OptionSelector.js";
import * as inputModules from "./input_modules.js";
export const cards_config = {
    autoPlace: "false",
    defaultContainer: document.querySelector("#body"),
    setDefaultContainer: function(query) {
        this.defaultContainer = document.querySelector(query);
    }
}
function generateCard(config) {
    let { id, label, className } = config;
    let card_container = document.createElement("div");
    if (id) card_container.id = id;
    card_container.className = (className ? `card_container ${className}` : `card_container`);

    if (label) {
        let card_label = new Label({
            className: "card_label",
            label: label
        });
        card_container.appendChild(card_label);
    }
    return card_container;
}
class Card {
    getLabel = () => this._config.label;
    getID = () => this._config.id;
    getContent = () => this._config.content;
    finishLayout = () => this.card.appendChild(this.buildLayout());
    constructor(card_config) {
        this._config = card_config;
        this._eventHandler = new EventHandler();
        this.events = {
            addEventListener: this._eventHandler.addEventListener
        };
        this.card = generateCard(card_config);
        if (cards_config.autoPlace) this.place();
    }
    // initializeLayout = () => {
    //     this.card_layout = this.buildLayout();
    //     this.card.appendChild(this.card_layout);
    // }
    place() {
        if ((this._config.location || "default") == "default") {
            cards_config.defaultContainer.appendChild(this.card);
        } else {
            document.querySelector(this._config.location).appendChild(this.card);
        }
    }

}

export class TextAreaCard extends Card {
    constructor(card_config) {
        card_config.className = "input_card";
        super(card_config);
        this.card_layout = this.finishLayout();

    }
    buildLayout = () => {
        let content = this.getContent();
        let inputBox = document.createElement("textarea");
        inputBox.placeholder = content.placeholder;
        inputBox.addEventListener("keydown", () => {
            this._eventHandler.newEvent({
                type: "change",
                body: {
                    value: inputBox.value,
                    location: inputBox,
                    author: this
                }
            });
        });

        return inputBox;
    }
    getOutput = () => {
        return this.card.getElementsByTagName("textarea")[0].value;
    }
}
export class InputModulesCard extends Card {
    constructor(card_config) {
        super(card_config);
        this.card_layout = this.finishLayout();
    }
    buildLayout = () => {
        let settingToggle = new inputModules.ToggleInput({
            status: false,
            options: ["OFF", "ON"]
        });
        settingToggle.eventHandler.addEventListener("toggle", (event) => {
            console.log(event.getValue());
        })
        // NOTE: Or just get the output at an exact time by using settingToggle.getStatus();
        return settingToggle.node;
    }
}
export class OptionSelectorCard extends Card {
    constructor(card_config) {
        super(card_config);
        this.card_layout = this.finishLayout();
    }
    buildLayout = () => {
        let containerTest = document.createElement("div");
        containerTest.id = "optionSelector-container";
        containerTest.style.width = "200px";
        containerTest.style.height = "100px";
        containerTest.style.margin = "auto";
        let options_array = this.getContent().options;
        let mySelector = new OptionSelector.Selector(options_array);
        containerTest.appendChild(mySelector.getElement());
        return containerTest;
    }
    getOutput = () => {

    }
}
export class SubstancePickerCard extends Card {
    constructor(card_config) {
        card_config.className = "picker_card";
        super(card_config);
        this.card_layout = this.finishLayout();
    }
    buildLayout = () => {
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
                    this._eventHandler.newEvent({
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
    show = (delay) => {
        setTimeout(() => {
            this.card.style.display = "flex";
            this.card.animate([
                { transform: 'translateY(500px)' },
                { transform: 'translateY(0px)' }

            ], {
                duration: 300,
                fill: "forwards"
            });
        }, (delay || 0));
    }
    hide = (delay) => {
        setTimeout(() => {
            this.card.animate([
                { transform: 'translateY(0px)' },
                { transform: 'translateY(500px)' }

            ], {
                duration: 500,
                fill: "forwards",
                easing: "ease-in-out"
            });
            setTimeout(() => {
                this.card.style.display = "none";
            }, 500);
        }, (delay || 0));
    }
}
// NOTE: Deprecate the label class?
class Label {
    constructor(label_config) {
        this._config = label_config;
        let label_element = document.createElement("span");
        label_element.className = this._config.className;
        if (this._config.id) label_element.id = this._config.id;
        label_element.innerHTML = this._config.label;
        this._node = label_element;
        return this._node;
    }
}



