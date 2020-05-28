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
class Card {
    constructor(card_config) {
        this._config = card_config;
        this._eventHandler = new EventHandler(this);
        this.events = {
            listenFor: this._eventHandler.listenFor
        }
        this.card = generateCard(card_config);
        cards_config.autoPlace ? this.place() : console.log("Will not place for now");
    }
    injectLayout = (generatedLayout) => {
        this.card_layout = generatedLayout;
        this.card.appendChild(this.card_layout);
    }
    place() {
            if (this._config.location == "default" || !this._config.location) {
                cards_config.defaultContainer.appendChild(this.card);
            } else {
                document.querySelector(this._config.location).appendChild(this.card);
            }
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
        card_config.className = "input_card";
        super(card_config);
        this.injectLayout(this.generateLayout());
    }
    generateLayout = () => {
        let content = super.getContent();
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
        console.log("Output requested for TextArea Card");
        return this.card.getElementsByTagName("textarea")[0].value;
    }
}
export class LineGraphCard extends Card {
    constructor(card_config) {
        super(card_config, "line_graph_card");
    }
    generateLayout = () => {

    }
}
export class InputModulesCard extends Card {
    constructor(card_config) {
        super(card_config, "bazigga");
        this.injectLayout(this.generateLayout());
    }
    generateLayout = () => {
        let settingToggle = new inputModules.ToggleInput("Sound", false);
        settingToggle.eventHandler.listenFor("toggle", (event) => {
            console.log(event);
        })
        return settingToggle;
    }
    inputHooks = () => {
        
    }
}
export class OptionSelectorCard extends Card {
    constructor(card_config) {
        super(card_config, "option_selector_card");
        this.injectLayout(this.generateLayout());
        this.testOptionSelector();
    }
    generateLayout = () => {
        let containerTest = document.createElement("div");
        containerTest.id = "zibba";
        containerTest.style.height = "200px";
        return containerTest;
    }
    testOptionSelector() {
        let mySelectorList = new OptionSelector.SelectorOptionLinkedList("o");
        let mySelector;
        mySelectorList.insertArray(this.getContent().options);
        mySelector = new OptionSelector.Selector("zibba", mySelectorList);
        mySelector.refreshOptions();
    }
    refactoredCode() {
        let optionsArray = this.getContent().options;

        let optionSelector = new OptionSelector(optionsArray)
    }
    getOutput = () => {

    }
}
export class SubstancePickerCard extends Card {
    constructor(card_config) {
        card_config.className = "picker_card";
        super(card_config);
        this.injectLayout(this.generateLayout());
    }
    show = () => {
        this.card.style.display = "block";
        this.card.animate([
            { transform: 'translateY(500px)' },
            { transform: 'translateY(0px)' }
    
        ], {
            duration: 300,
            fill: "forwards"
        });
    }
    hide = () => {
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
    }
    generateLayout = () => {
        let content = super.getContent();
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
function generateCard(prerequisites) {
    let { id, label, className } = prerequisites;
    // this._parent = parent;
    let card_container = document.createElement("div");
    card_container.id = id;
    // The classname below won't work or will not include the proper secondary class name
    card_container.className = (className ? `card_container ${className}` : `card_container`);

    if (label) {
        let card_label = new Label({
            className: "card_label",
            label: label
        });
        card_container.appendChild(card_label);
    }
    return card_container;
    // let generatedLayout = this._parent.build();
    // card_container.appendChild(generatedLayout);

    // if (cards_config.autoPlace) {
    //     cards_config.defaultContainer.appendChild(card_container);
    // }
}
function generateLayout() {

}
class TestCardLayout {
    constructor(prerequisites) {
        let { id, label } = prerequisites;
        this._parent = parent;
        let card_container = document.createElement("div");
        card_container.id = id;
        // The classname below won't work or will not include the proper secondary class name
        card_container.className = this.className;


        if (label) {
            let card_label = new Label({
                className: "card_label",
                label: label
            });
            card_container.appendChild(card_label);
        }
        let generatedLayout = this._parent.build();
        card_container.appendChild(generatedLayout);

        if (cards_config.autoPlace) {
            cards_config.defaultContainer.appendChild(card_container);
        }
    }
    buildEmptyCard() {

    }
}
class TextAreaLayout extends TestCardLayout {
    constructor(parent) {
        super(parent);
        this.className = "card_container input_card";
    }
    buildTextArea() {
        let content = super.getContent();
        let inputBox = document.createElement("textarea");
        inputBox.placeholder = content.placeholder;
        inputBox.addEventListener("keydown", () => {
            super._eventHandler.newEvent({
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
export class TestCard {
    constructor(card_config) {
        this._outputReference;
    }
    build() {

    }
    getOutput() {

    }
}



