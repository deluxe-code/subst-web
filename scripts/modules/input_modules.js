import { CustomElement } from "./elements.js";
console.log(CustomElement);
export class ToggleInput extends CustomElement {
    constructor(label, buttonStatus) {
        super({
            element_type: "div",
            className: "toggle-input"
        });
        this._status = buttonStatus;


        this.label = super.insert("span", "toggle-label").innerHTML = label;
        this.button = super.insert("a", "toggle-button");
        if (this._status) {
            this.button.className += " toggle-enabled";
            this.button.innerHTML = "Disable";
        } else {
            this.button.className += " toggle-disabled";
            this.button.innerHTML = "Enable";
        }
        this.button.addEventListener("click", () => {
            this._status ? this.disable() : this.enable();

            this.eventHandler.newEvent({
                type: "toggle",
                body: {
                    value: this.getStatus(),
                    location: this.button,
                    author: this
                }
            });
        });
        return this.node;
    }
    enable() {
        this.button.className = "toggle-button toggle-enabled";
        this.button.innerHTML = "Disable";
        this._status = true;
    }
    disable() {
        this.button.className = "toggle-button toggle-disabled";
        this.button.innerHTML = "Enable";
        this._status = false;

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

