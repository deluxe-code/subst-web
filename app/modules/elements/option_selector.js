import { ElementDragger } from "../tools/element_dragger.js";

const selectionChange = new Event('selectionChange');

export class Selector {

    selectorBox;
    optionSelectorElement;
    fontSize = 16;
    optionsList = [];
    currentOption = 0;
    newScrollPosition = 0;
    optionBoxes = [];
    selectorTextParagraph = [];
    fingerVelocity;
    previousScrollPosition;
    smoothHeightInterval;
    animator;
    selectorBoxPadding = 5;
    addButton;
    optionBoxSize = 1;
    hasAddButton = false;

    constructor(config) {

        let [arr, styles = new OptionSelectorConfig(), hasAddButton] = config;
        if(hasAddButton != "undefined") {
            this.hasAddButton = hasAddButton;
        }
        this.styles = styles;
        let isNode = true;
        Array.prototype.forEach.call(arr, element => {
            if(!(element instanceof OptionSelectorNode)){
                isNode = false;
            }
        });
        if(isNode) {
            this.optionsList = arr;
        } else {
            console.error("Elements in array must be of type OptionSelectorNode");
        }
        this.optionSelectorElement = document.createElement("div");
        this.selectorBox = document.createElement("div");
        this.optionSelectorElement.className = "Selector";
        this.selectorBox.className = "SelectorBox";
        this.optionSelectorElement.appendChild(this.selectorBox);
        this.createOptionBoxes();
        if(this.hasAddButton){
            this.createAddButton();
        }
        this.scrollEvents();
        this.animator = new OptionSelectorAnimator(this, this.optionBoxes);
        this.optionSelectorElement.style.height = "100%";
        this.optionSelectorElement.style.overflow = "hidden";
        this.selectorBox.style.overflow = "visible";
        this.selectorBox.style.touchAction = "none";
        this.selectorBox.style.height = "100%";
        this.selectorBox.style.padding = this.selectorBoxPadding;
        this.selectorBox.style.position = "relative";
    }

    getOptionBoxHeight() {
        return (this.selectorBox.offsetHeight * this.optionBoxSize / 3);
    }

    createAddButton() {
        this.selectorBox.style.height = "80%";
        this.addButton = document.createElement("button");
        this.addButton.type = "button";
        this.addButton.style.marginTop = "10px";
        this.addButton.style.width = "30%";
        this.addButton.style.height = "10%";
        this.addButton.style.marginLeft = "auto";
        this.addButton.style.marginRight = "auto";
        this.addButton.style.display = "block";
        this.addButton.style.fontSize = "3em"
        this.addButton.style.backgroundColor = "Transparent";
        this.addButton.style.border = "none";
        this.addButton.style.cursor = "pointer";
        this.addButton.style.outline = "none";
        this.addButton.innerHTML = "+";
        this.optionSelectorElement.appendChild(this.addButton);
    }

    initialize() {
        this.animator.growWidth(this.optionBoxes[i], 0, 0);
    }

    getElement() {
        return this.optionSelectorElement;
    }

    getSelected() {
        return this.optionsList[this.currentOption];
    }
    createOptionBoxes() {
        let {boxShadow, borderRadius, backgroundColor, fontFamily, fontSize, color} = this.styles;
        this.fontSize = fontSize;
        let boxHeight = (100*this.optionBoxSize / 3) + "%";
        for (let i = 0; i < this.optionsList.length; i++) {
            this.optionBoxes[i] = document.createElement("div");
            this.optionBoxes[i].id = "SelectorOptionBox" + i;
            this.optionBoxes[i].className = "SelectorOptionBox";
            this.optionBoxes[i].style.height = boxHeight;
            this.selectorBox.appendChild(this.optionBoxes[i]);
            this.optionBoxes[i].style.boxShadow = boxShadow;
            this.optionBoxes[i].style.backgroundColor = backgroundColor;
            this.optionBoxes[i].style.borderRadius = borderRadius;
            this.optionBoxes[i].style.fontFamily = fontFamily;
            this.optionBoxes[i].style.color = color;
            this.optionBoxes[i].style.fontSize = fontSize;
            this.optionBoxes[i].style.position = "relative";
            this.optionBoxes[i].style.marginRight = "auto";
            this.optionBoxes[i].style.marginLeft = "auto";
            this.optionBoxes[i].style.display = "table";
            this.optionBoxes[i].style.overflow = "hidden";
            let child = this.optionBoxes[i].appendChild(document.createElement("p"));
            child.innerHTML = this.optionsList[i].text;
            child.style.position = "relative";
            child.style.textAlign = "center";
            child.style.textOverflow = "clip";
            child.style.whiteSpace = "nowrap";
            child.style.width = "100%";
            child.style.marginTop = "0px";
            child.style.marginBottom = "0px";
            child.style.marginLeft = "auto";
            child.style.marginRight = "auto";
            child.style.padding = "0px";
            child.style.display = "table-cell";
            child.style.verticalAlign = "middle";
        }
    }

    scrollEvents() {
        let touchOriginY;
        let currentScrolls = 0;
        let previousFingerPosY = 0;
        let previousTimeStamp = Date.now();
        let initialOffset;
        let numberOfPreviousOptionBoxesWithinFingerDistance = 0;

    }

}

class OptionSelectorAnimator {
    //scroll preforms scroll actions and returns previousFingerPos
    mySelector;
    optionBoxes;
    newScrollPosition = 0;
    fingerVelocity;
    previousScrollPositionY = 0;
    previousScreenPositionY = 0;
    lastFingerPositionY;
    previousTimeStamp = Date.now();
    globalTouchOrigin;
    decelerationInterval;
    boxGrowthAmount = 0.2;
    fontGrowthAmount = 0.05;
    elementDragger;
    frameRate = 60;
    constructor(mySelector, optionBoxes) {
        this.optionBoxes = optionBoxes;
        this.mySelector = mySelector;
        window.addEventListener('load', ()=> {
            this.growWidth(this.optionBoxes, this.elementDragger.currentRelativeScrollPosition.y, this.elementDragger.fadeTime);
        });
        let dragger_config = {
            elementToDrag: mySelector.selectorBox,
	        restrictX: true,
            releaseFunction: () => {
                let boxHeight = () => {return this.mySelector.getOptionBoxHeight()};
                //height not defined
                let optionBoxes = () => {return this.optionBoxes;};
                this.elementDragger.snapToNearestInterval(0, -1, -boxHeight(), "y", -1, optionBoxes().length-2);
                this.growWidth(this.optionBoxes, this.elementDragger.currentRelativeScrollPosition.y, this.elementDragger.fadeTime);
                if(this.mySelector.currentOption!=this.elementDragger.currentReferenceFrame.y+1) {
                    this.mySelector.currentOption = this.elementDragger.currentReferenceFrame.y+1;
                    this.mySelector.getElement().dispatchEvent(selectionChange);
                }
                
            },
            movementFunction: () => {
                this.growWidth(this.optionBoxes, this.elementDragger.currentRelativeFingerPosition.y, 0);
                this.previousTimeStamp = Date.now();
                this.previousScrollPositionY = this.elementDragger.currentFingerPosition.y;
            }
        }
        this.elementDragger = new ElementDragger(dragger_config);
        this.elementDragger.dragThreshold = {
            x: 0,
            y: 10
        };

    }

    growWidth(element, position, fadeTime) {
        for(var i = 0; i < element.length; i++) {
            function calcSize(mySelector, boxGrowthAmount, sizeModifier) {
                let centerPosition = ((mySelector.selectorBox.offsetHeight/2)-mySelector.getOptionBoxHeight()/2);
                let boxElementPosition = position + mySelector.getOptionBoxHeight()*i;
                let elementSize = "calc(100% - " + (boxGrowthAmount*Math.abs(centerPosition-boxElementPosition)+sizeModifier) + "px)";
                return elementSize;
            }
            let elementSize = calcSize(this.mySelector, this.boxGrowthAmount, 0);
            element[i].style.width = elementSize;
            
            element[i].style.transition ="width " + fadeTime + "s" + ", " + "font-size " + fadeTime + "s";
            element[i].style.fontSize = calcSize(this.mySelector, this.fontGrowthAmount, -20);
         
            
        }
    }


    setFingerVelocity(fingerPosY, previousTimeStamp) {
        let timeBetweenFingers = Date.now() - previousTimeStamp;
        let distance = fingerPosY - this.lastFingerPositionY;
        this.fingerVelocity = distance / timeBetweenFingers;
    }

    decelerate() {
        let sensitivity = 4;
        let thisObject = this;
        let scrollVelocity = this.fingerVelocity;
        let targetPosition = -(this.mySelector.currentOption - 1) * this.mySelector.getOptionBoxHeight();
        let nextPosition = this.previousScrollPositionY;
        this.decelerationInterval = setInterval(smoothDeceleration => {

            //clearInterval(decelerationInterval);
            if (thisObject.fingerVelocity < 0) {
                scrollVelocity = (thisObject.fingerVelocity - 1) * Math.abs(((targetPosition - nextPosition) / decelerationRate));
            } else {
                scrollVelocity = (thisObject.fingerVelocity + 1) * Math.abs(((targetPosition - nextPosition) / decelerationRate));
            }

            thisObject.scrollToPagePosition(nextPosition, thisObject.optionBoxes);

            if (nextPosition < (targetPosition - sensitivity)) {
                nextPosition += Math.abs(scrollVelocity * speed);
            } else if (nextPosition > (targetPosition + sensitivity)) {
                nextPosition -= Math.abs(scrollVelocity * speed);
            } else {
                nextPosition = targetPosition;
                thisObject.scrollToPagePosition(targetPosition, thisObject.optionBoxes);
                clearInterval(this.decelerationInterval);
            }
        }, 1000 / 60);
        let speed = 3;
        let decelerationRate = 50;
    }

    startScroll() {
        clearInterval(this.decelerationInterval);
        this.newScrollPosition = this.previousScrollPositionY;
        this.optionBoxes.foreach(box => {
            box.style.transition = "";
        });
    }
}



    const optionBox_default = {
        boxShadow: "0px 5px 5px rgba(86, 86, 86, 0.25)",
        backgroundColor: "white",
        borderRadius: "10px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;",
        fontSize: "2.5em",
        color: "black"
    }
export class OptionSelectorConfig {
    /*
        defaultAssignments = {
            boxShadow: "0px 5px 5px rgba(86, 86, 86, 0.25)",
            backgroundColor: "white",
            borderRadius: "10px"
        };
    */
    constructor(config) {
       if (config) {
           return {
                boxShadow: (config.boxShadow ? config.boxShadow : optionBox_default.boxShadow),
                backgroundColor: (config.backgroundColor ? config.backgroundColor : optionBox_default.backgroundColor),
                borderRadius: (config.borderRadius ? config.borderRadius : optionBox_default.borderRadius),
                fontType: (config.fontType ? config.fontType : optionBox_default.fontType),
                fontSize: (config.fontSize ? config.fontSize : optionBox_default.fontSize),
                color: (config.color ? config.color : optionBox_default.color)
            }
        } else {
            return optionBox_default
        }
    }

}

export class OptionSelectorNode {
    text;
    id;
    content = {};
    constructor(text, id, content = {}) {
        this.text = text;
        this.id = id;
        this.content = content;
    }
}

export const timeSelectorList = function() {
    let timeSelectorArray = [];
    timeSelectorArray[0] = new OptionSelectorNode("12:00 AM", 0, {time: "00:00"});
    for(var i = 1; i < 24; i++){

        if(i < 12) {
        if(i<10) {
            timeSelectorArray[i] = new OptionSelectorNode(i + ":00 AM", i, {time: "0" + i+":00"});
        } else{
            timeSelectorArray[i] = new OptionSelectorNode(i + ":00 AM", i, {time: i+":00"});
        }

        } else{
        if(i != 12){
            timeSelectorArray[i] = new OptionSelectorNode(i-12 + ":00 PM", i, {time: i+":00"});
        }
        }
        
    }
    timeSelectorArray[12] = new OptionSelectorNode("12:00 PM", i, {time: "12:00"});
    return timeSelectorArray;
}();