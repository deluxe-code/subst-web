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
    formPageElement;
    container;
    elementDragger;
    label;
    bodyElements;
    labelElement;
    constructor(config) {
        this.container = config.container;
        this.label = (config.label || null);
        this.bodyElements = config.bodyElements;
        this.createPopUp();
    }
    open(){
        //change this to layout system when Ethan finishes that. I'm thinking of doing the bodyElements replacement method since "fixed position is generally bad for mobile"
        this.container.appendChild(this.formPageElement);
        this.container.style.zIndex = "1";
        //this.card.card.style.margin = "auto";
    }
    createPopUp(){

        this.formPageElement = document.createElement("div");
        this.formPageElement.className = "formPageElement";
        //this.formPageElement.style.backgroundColor = "white";
        this.formPageElement.style.minHeight = "100%";
        this.formPageElement.style.minWidth = "100%";
        this.formPageElement.style.margin = "none";
        this.formPageElement.style.display = "flexbox";
        this.formPageElement.style.position = "relative";
        if(this.label!=null) {
            this.labelElement = document.createElement("h1");
            this.labelElement.style.width = "50%";
            this.labelElement.style.margin = "auto";
            this.labelElement.style.marginTop = "25px";
            this.labelElement.innerHTML = this.label;
            this.labelElement.className = "popupLabel";
            this.formPageElement.appendChild(this.labelElement);
        }
        if(this.bodyElements != null) {
            this.createBodyElements();
            //this.formPageElement.appendChild(this.bodyElements);
        }
    }
    
    createBodyElements() {
        this.bodyElements.forEach(element => {
            this.formPageElement.appendChild(element);
        });
    }
    close() {
        this.container.innerHTML = "";
    }
}