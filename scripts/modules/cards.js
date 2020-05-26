// import * as OptionSelector from "./OptionSelector.js";
import { EventHandler } from "./event_handler.js";

class CardEventHandler extends EventHandler {
    constructor(parentCard) {
        super("Send through everything that would be common between the different types of EventHandlers");
        this._parentCard = parentCard;
        this._currentListeners = [];
        this._events = [];
    }
    newEvent(event_info) {
        // NOTE: Remember that not all events will have a listener, since not all events
        // require any sort of immediate action
        let newEvent = new CardEvent(event_info);
        
        // Check if there are any listeners that want to run an action
        this._currentListeners.forEach(listener => {
            if (listener.event_type == newEvent.getType()) {
                listener.action(newEvent);
            }
        })
        this._events.push(newEvent);
    }
    listenFor(event_type, action) {
        // NOTE: BEWARE!!! With the current code, if there are two listeners for the same
        // event_type, it looks like the code would run all the listeners' code which 
        // could cause a very difficult time debugging if not careful.
        this._currentListeners.push({
            event_type: event_type,
            action: action
        });
    }
}

class CardEvent {
    constructor(event_info) {
        this.type = event_info.type;
        this.body = event_info.body;
    }
    getAuthor() {
        return this.body.author;
    }
    getType() {
        return this.type;
    }
    getBody() {
        return this.body;
    }
    getValue() {
        if (this.body.value != null) {
            return this.body.value;
        } else {
            return "NO_TARGET_FOUND";
        }
    }
}


export class Card {
    constructor(card_config) {
        // this.type = card_info.type;
        this._info = card_config;
        this._layout = new CardLayout(this);
        this._eventHandler = new CardEventHandler(this);

        // This is so that the developer can chain a event listenFor(), etc to the card's event handler
        return this.getEventHandler();
    }
    getLayout() {
        return this._layout;
    }
    getEventHandler() {
        return this._eventHandler;
    }
    getLabel() {
        return this._info.label;
    }
    getPreset() {
        return this._info.preset;
    }
    getID() {
        return this._info.id;
    }
    getContent() {
        return this._info.content;
    }
    getOutput() {
        return this.getPreset().output(this._layout.layout_container);
        // NOTE Find a way to get outputs in a dynamic way.
        // While a textarea input card will just have one output, the text typed inside
        // Other cards will likely need a special interface for outputting more than just thing
    }
}
let globalCard_className = "card_container ";
export let card_presets = {
    textInput: {
        className: globalCard_className + "input_card",
        build: async function(parentCard) {
            let content = parentCard.getContent();
            let inputBox = document.createElement("textarea");
            inputBox.id = "input_textarea";
            inputBox.placeholder = content.placeholder;
            inputBox.addEventListener("keydown", function() {
                parentCard.getEventHandler().newEvent({
                    type: "change",
                    body: {
                        value: inputBox.value,
                        author: parentCard
                    }
                });
            });
            return inputBox;
        },
        getOutput: function() {
            return document.querySelector(this.inputReference).value;
        },
        inputReference: "#input_textarea"
        // TODO template: makeATemplateSystemHere
    },
    substance_picker: {
        className: globalCard_className + "picker_card",
        build: async function(parentCard) {
            let content = parentCard.getContent();
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

                add_container.addEventListener("click", function() {
                    parentCard.getEventHandler().newEvent({
                        type: "select",
                        body: {
                            value: substance.id,
                            author: parentCard
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
}
class CardLayout {
    constructor(parentCard) {
        this._parentCard = parentCard;

        // this.card_properties = card_properties;
        this.initialize();

    }
    async initialize() {
        let parentCard = this._parentCard;

        // CREATE CARD CONTAINER ELEMENT
        this.layout_container = document.createElement("div");
        this.layout_container.id = parentCard.getID();
        this.layout_container.className = parentCard.getPreset().className;

        // CREATE LABEL
        this.card_label = document.createElement("span");
        this.card_label.className = "card_label";
        this.card_label.innerHTML = parentCard.getLabel();
        // INSERT THE CARD'S LABEL
        this.layout_container.appendChild(this.card_label);



        
        // INSERT THE GENERATED ELEMENT
        // this.card_container.appendChild(type.build(content));

        await this.generate().then(element => {
            this.layout_container.appendChild(element);
            this.place();
        });
    }
    async generate() {
        let parentCard = this._parentCard;
        let content = parentCard.getContent();
        let presetConfig = parentCard.getPreset();
        return await presetConfig.build(parentCard).then(generatedNode => {
            return generatedNode;
        })

    }
    place() {
        document.body.appendChild(this.layout_container);
        console.log(this + " has been placed in the DOM");
    }
}

