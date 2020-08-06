import { EventHandler } from "./event_handler.js";

export class CustomElement {
    constructor(config) {
        let { element_type, className, id } = config;
        this.node = document.createElement(element_type);
        className ? this.node.className = className : false;
        id ? this.node.id = id : false;
        this.eventHandler = new EventHandler();
    }
    insert(element_type, className, id) {
        let newElement = document.createElement(element_type);
        className ? newElement.className = className : false;
        id ? newElement.id = id : false;
        this.node.appendChild(newElement);
        return newElement;
    }
    setClassName(newName) {
        this.node.className = newName;
    }
    place(location) {
        return (location ?
        document.querySelector(location) :
        document.body)?.appendChild(this.node);
    }
}
