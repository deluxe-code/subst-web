import {ElementDragger} from "../tools/element_dragger.js";
import {PopUp} from "../elements/pop_up.js";
import {ScheduleStorage} from "../elements/schedule.js";
export class FormSectionSwiper {
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
            x: 15,
            y: 15
        };
        this.open();
    }
    open() {
        this.container.style.display = "flex";
        this.container.style.width = "100%";
        for(var i = 0; i < this.popUps.length; i++) {
            this.popUps[i].open();
        }
    }
}
export class FormSection {
    popUpElement;
    container;
    elementDragger;
    label;
    body;
    labelElement;
    constructor(config) {
        this.container = config.container;
        this.label = (config.label || null);
        this.body = config.body;
        this.createPopUp();
    }
    open(){
        //change this to layout system when Ethan finishes that. I'm thinking of doing the body replacement method since "fixed position is generally bad for mobile"
        this.container.appendChild(this.popUpElement);
        this.container.style.zIndex = "1";
        //this.card.card.style.margin = "auto";
    }
    createPopUp(){

        this.popUpElement = document.createElement("div");
        this.popUpElement.id = "popUpElement";
        //this.popUpElement.style.backgroundColor = "white";
        this.popUpElement.style.minHeight = "100%";
        this.popUpElement.style.minWidth = "100%";
        this.popUpElement.style.margin = "none";
        this.popUpElement.style.display = "flexbox";
        this.popUpElement.style.position = "relative";
        if(this.label!=null) {
            this.labelElement = document.createElement("h1");
            this.labelElement.style.width = "50%";
            this.labelElement.style.margin = "auto";
            this.labelElement.style.marginTop = "25px";
            this.labelElement.innerHTML = this.label;
            this.labelElement.className = "popupLabel";
            this.popUpElement.appendChild(this.labelElement);
        }
        if(this.body != null) {
            this.popUpElement.appendChild(this.body);
        }
    }
    close() {
        this.container.innerHTML = "";
    }
}