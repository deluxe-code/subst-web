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
export class SelectedItemBar extends CustomElement {
    animationDuration = 200;
    constructor(label, pickerCard) {
        super({
            element: "div",
            className: "selectedItemBar"
        });
        // this.setClassName("selectedItemBar");
        // NOTE: TRANSITION JITTER IS LIKELY DUE TO THE SETTING OF DISPLAY: NONE
        // ON THE SelectedItemBar, which removes it from the DOM Tree and messes up
        // the page layout sizing due to the fact that #body's display: flex;
        this.cancelElement = this.insert("a", "selectedItem_button cancel");
        this.cancelElement.addEventListener("click", () => {
            this.hide();
            setTimeout(() => {
                pickerCard.show();
            }, 300);
        });
        this.labelElement = this.insert("span", "selectedItem_label");
        this.labelElement.innerHTML = label;
        this.confirmElement = this.insert("a", "selectedItem_button accept");
        this.confirmElement.addEventListener("click", () => {
            // NOTE: ADVANCE
        });
        this.show();
        this.node.style.transform = "translateY(0px)";


    }
    show() {
        this.node.style.display = "grid";
        this.node.animate([
            { transform: 'translateY(70px)'},
            { transform: 'translateY(0px)'}
        ],
        {
            duration: this.animationDuration,
            fill: "forwards",
            easing: "ease-in-out"
        });
    }
    hide() {
        this.node.animate([
            { transform: 'translateY(0px)'},
            { transform: 'translateY(70px)'}
        ],
        {
            duration: this.animationDuration,
            fill: "forwards",
            easing: "ease-in-out"
        });
        setTimeout(() => {
            this.node.style.display = "none";
        }, this.animationDuration);
    }
}