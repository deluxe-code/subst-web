import {ElementDragger} from "./element_dragger.js";

export class StrungPopUps {
    popUps = [];
    elementDragger;
    container;
    currentPopUp = 0;
    constructor(container, popUps) {
        this.container = container;
        this.popUps = popUps;
        this.container.style.position = "relative";
        this.container.style.top = -this.container.offsetTop;
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
    }
    open() {
        this.container.style.display = "flex";
        this.container.style.display = "row";
        this.container.style.width = "100%";
        this.popUps[0].open();
        this.popUps[1].open();
        this.popUps[2].open();
    }
}
export class PopUp {
    card;
    popUpElement;
    next;
    previous;
    container;
    doneButton;
    elementDragger;
    constructor(card, next, previous, container) {
        this.card = card;
        this.next = next;
        this.previous = previous;
        this.container = container;
        this.createPopUp();
    }
    open(){
        //change this to layout system when Ethan finishes that. I'm thinking of doing the body replacement method since "fixed position is generally bad for mobile"
        this.container.appendChild(this.popUpElement);
        this.card.card.style.margin = "auto";
        this.doneButton.addEventListener('click', () => {
            this.close();
        });
        console.log("opened");
    }
    createPopUp(){
        this.popUpElement = document.createElement("div");
        this.popUpElement.appendChild(this.card.card);
        this.popUpElement.id = "popUpElement";
        this.popUpElement.style.backgroundColor = "white";
        this.popUpElement.style.minHeight = "100%";
        this.popUpElement.style.minWidth = "100%";
        this.popUpElement.style.margin = "auto";
        this.popUpElement.style.display = "flexbox";
        this.popUpElement.style.position = "relative";
        this.doneButton = document.createElement("button");
        this.doneButton.type = "button";
        this.doneButton.innerHTML = "Done";
        this.doneButton.style.width = "100px";
        this.doneButton.style.height = "35px";
        this.doneButton.style.position = "absolute";
        this.doneButton.style.bottom = "20px";
        this.doneButton.style.right = "20px";
        this.popUpElement.appendChild(this.doneButton);
    }
    close() {
        this.container.innerHTML = "";
    }
    next() {
        this.close();
        this.next.open();
    }
    previous() {

    }
    done(){

    }
}