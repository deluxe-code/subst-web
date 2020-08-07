import {ElementDragger} from "../tools/element_dragger.js";

export class StrungPopUps {
    popUps = [];
    elementDragger;
    container;
    currentPopUp = 0;
    constructor(container, popUps) {
        this.container = container;
        this.popUps = popUps;
        this.container.style.position = "relative";
        this.container.style.display = "none";
        this.container.style.touchAction = "none";
        let releaseFunction = () => {
            let currentPopUp = this.currentPopUp;
            let popUps = this.popUps;
            return function () {
                this.snapOnInterval(25, 0, this.elementToDrag.offsetWidth, "x", 0, popUps.length-1);
            };
        }
        this.elementDragger = new ElementDragger({
            elementToDrag: this.container,
            restrictY: true,
            releaseFunction: releaseFunction()
        });
        this.elementDragger.dragThreshold = {
            x: 100,
            y: 75
        };
    }
    open() {
        this.container.style.display = "flex";
        this.container.style.width = "100%";
        for(var i = 0; i < this.popUps.length; i++) {
            this.popUps[i].open();
        }
    }
}
export class PopUp {
    card;
    popUpElement;
    container;
    doneButton;
    elementDragger;
    label;
    body;
    labelElement;
    constructor(config) {
        let card = (config.card || null);
        let container = config.container;
        let label = config.label;
        this.card = card;
        this.container = container;
        this.label = label;
        this.body = config.body;
        this.createPopUp();
    }
    open(){
        //change this to layout system when Ethan finishes that. I'm thinking of doing the body replacement method since "fixed position is generally bad for mobile"
        this.container.appendChild(this.popUpElement);
        this.container.style.zIndex = "1";
        //this.card.card.style.margin = "auto";
        this.doneButton.addEventListener('click', () => {
            this.close();
        });

        console.log("opened");
    }
    createPopUp(){
        if(this.card != null){
            this.card.card.style.height = "50%";
            this.card.card.style.marginRight = "auto";
            this.card.card.style.marginLeft = "auto";
            this.card.card.style.marginTop = "50px";
        }
        this.popUpElement = document.createElement("div");
        this.popUpElement.id = "popUpElement";
        //this.popUpElement.style.backgroundColor = "white";
        this.popUpElement.style.minHeight = "100%";
        this.popUpElement.style.minWidth = "100%";
        this.popUpElement.style.margin = "none";
        this.popUpElement.style.display = "flexbox";
        this.popUpElement.style.position = "relative";
        this.labelElement = document.createElement("h1");
        this.labelElement.style.width = "50%";
        this.labelElement.style.margin = "auto";
        this.labelElement.innerHTML = this.label;
        this.labelElement.className = "popupLabel";
        this.popUpElement.appendChild(this.labelElement);
        if(this.body != null) {
            this.popUpElement.appendChild(this.body);
        }
        if(this.card != null){
            this.popUpElement.appendChild(this.card.card);
        }
        this.doneButton = document.createElement("button");
        this.doneButton.type = "button";
        this.doneButton.innerHTML = "Done";
        this.doneButton.style.width = "100px";
        this.doneButton.style.height = "35px";
        this.doneButton.style.float = "right";
        this.doneButton.style.marginTop = "5%";
        this.doneButton.style.marginRight = "5%";
        this.popUpElement.appendChild(this.doneButton);
    }
    close() {
        this.container.innerHTML = "";
    }
    done(){

    }
}