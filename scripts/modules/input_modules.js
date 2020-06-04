import { CustomElement } from "./elements.js";
export class ToggleInput extends CustomElement {
    constructor(config) {
        super({
            element_type: "div",
            className: "toggle-input"
        });
        this._status = config.status;
        this._optionsArray = ["Enable", "Disable"];
        this._eventPush = () => {
            this.eventHandler.newEvent({
                type: "toggle",
                body: {
                    value: this._status,
                    location: this.button,
                    author: this
                }
            });
        }
        if (config.label) {
            this.label = super.insert("span", "toggle-label").innerHTML = label;
        }

        if (config.options) {
            this._optionsArray = config.options;
        }
        this.button = super.insert("a", "toggle-button");
        this.button.className = `toggle-button ${(this._status || "disabled")}`;
        if (this._status) {
            this.button.className += " toggle-enabled";
            this.button.innerHTML = this._optionsArray[1];
        } else {
            this.button.className += " toggle-disabled";
            this.button.innerHTML = this._optionsArray[0];
        }
        this.button.addEventListener("click", () => {
            this._status ? this.disable() : this.enable();
        });
    }
    enable() {
        this.button.className = "toggle-button toggle-enabled";
        this.button.innerHTML = this._optionsArray[1];;
        this._status = true;
        this._eventPush();
    }
    disable() {
        this.button.className = "toggle-button toggle-disabled";
        this.button.innerHTML = this._optionsArray[0];
        this._status = false;
        this._eventPush();

    }
    getStatus() {
        return this._status;
    }
    setStatus(newStatus) {
        if (newStatus == true) {
            this._status ? console.log("Toggle Status is already true!") : this._status = true;
        }
        if (newStatus == false) {
            this._status ? this._status = false : console.log("Toggle Status is already false!");
        }
    }

}



export class SelectedItemBar extends CustomElement {
    animationDuration = 200;
    constructor(label) {
        super({
            element_type: "div",
            className: "selectedItemBar"
        });
        this.events = {
            listenFor: this.eventHandler.addEventListener
        }
        // this.setClassName("selectedItemBar");
        // NOTE: TRANSITION JITTER IS LIKELY DUE TO THE SETTING OF DISPLAY: NONE
        // ON THE SelectedItemBar, which removes it from the DOM Tree and messes up
        // the page layout sizing due to the fact that #body's display: flex;
        this.cancelElement = this.insert("a", "selectedItem_button cancel");
        this.cancelElement.addEventListener("click", () => {
            this.eventHandler.newEvent({
                type: "cancel",
                body: {
                    location: this.cancelElement,
                    author: this
                }
            })
            this.hide();
            // setTimeout(() => {
            //     previousCard.show();
            // }, 300);
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
    show(delay) {

        let showFunction = () => {
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
        delay ? setTimeout(showFunction, delay) : showFunction();
    }
    hide(delay) {

        let hideFunction = () => {
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
        delay ? setTimeout(hideFunction, delay) : hideFunction();

    }
}

