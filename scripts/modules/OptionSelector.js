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

    constructor(config) {
        let [arr, styles = new OptionSelectorConfig(), hasAddButton = false] = config;
        this.styles = styles;
        this.optionsList = arr;
        this.optionSelectorElement = document.createElement("div");
        this.selectorBox = document.createElement("div");
        this.selectorBox.className = "SelectorBox";
        this.optionSelectorElement.appendChild(this.selectorBox);
        this.createOptionBoxes();
        if(hasAddButton){
            this.createAddButton();
        }
        this.scrollEvents();
        this.animator = new OptionSelectorAnimator(this, this.optionBoxes);
        this.optionSelectorElement.style.height = "100%";
        this.selectorBox.style.overflow = "hidden";
        this.selectorBox.style.touchAction = "none";
        this.selectorBox.style.height = "100%";
        this.selectorBox.style.padding = this.selectorBoxPadding;
    }

    getOptionBoxHeight() {
        return (this.selectorBox.offsetHeight * this.optionBoxSize / 3);
    }

    createAddButton() {
        this.selectorBox.style.height = "80%";
        this.addButton = document.createElement("button");
        this.addButton.type = "button";
        this.addButton.style.marginTop = "25px";
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
    setStyles() {

        this.optionBoxes.forEach(e => {
            e.style.top = -this.getOptionBoxHeight();
        }, { passive: true });
    }

    initialize() {
        for(var i = 0; i < this.optionBoxes.length; i++){
            this.animator.growWidth(this.optionBoxes[i], 0, i);
        }
    }

    getElement() {
        return this.optionSelectorElement;
    }

    getSelected() {
        return this.optionsList[this.currentOption];
    }
    createOptionBoxes() {
        let {boxShadow, borderRadius, backgroundColor, fontFamily, fontSize} = this.styles;
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
            this.optionBoxes[i].style.fontSize = fontSize;
            this.optionBoxes[i].style.position = "relative";
            this.optionBoxes[i].style.marginRight = "auto";
            this.optionBoxes[i].style.marginLeft = "auto";
            this.optionBoxes[i].style.display = "table";
            let child = this.optionBoxes[i].appendChild(document.createElement("p"));
            child.innerHTML = this.optionsList[i];
            child.style.position = "relative";
            child.style.textAlign = "center";
            child.style.width = "50%";
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
        this.selectorBox.addEventListener("touchstart", ev => {
            this.animator.startScroll();
            clearInterval(this.decelerationInterval);
            touchOriginY = ev.touches[0].clientY;
            currentScrolls = 0;
        }, { passive: true });
        this.selectorBox.addEventListener("touchmove", ev => {
            let fingerPos = ev.targetTouches[0];
            let fingerPosY = fingerPos.clientY;
            this.animator.scroll(fingerPosY, touchOriginY, this.optionBoxes);
            this.animator.setFingerVelocity(fingerPosY, previousTimeStamp);
            this.animator.lastFingerPositionY = fingerPosY;
            previousTimeStamp = Date.now();
        }, { passive: true });
        this.selectorBox.addEventListener("touchend", ev => {
            this.animator.endTouch(touchOriginY);
        }, { passive: true });
        this.selectorBox.addEventListener("scroll", ev => {

        });
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
    boxGrowthAmount = 1;
    constructor(mySelector, optionBoxes) {
        this.optionBoxes = optionBoxes;
        this.mySelector = mySelector;
    }
    scroll(currentTouchPosY, touchOriginY) {
        let position = this.newScrollPosition + (currentTouchPosY - touchOriginY);
        this.scrollToPagePosition(position, this.optionBoxes);
        this.previousScreenPositionY = currentTouchPosY;
    }

    scrollToPagePosition(position) {
        for(var i = 0; i < this.optionBoxes.length; i++) {
            this.optionBoxes[i].style.top = position + "px";
            this.growWidth(this.optionBoxes[i], position, i);

        }
        this.previousTimeStamp = Date.now();
        this.previousScrollPositionY = position;
    }

    growWidth(e, position, i) {
        let elementSize = function(mySelector, boxGrowthAmount) {
            let centerPosition = ((mySelector.selectorBox.offsetHeight/2)-mySelector.getOptionBoxHeight()/2);
            let boxElementPosition = position + mySelector.getOptionBoxHeight()*i;
            let elementSize = "calc(100% - " + boxGrowthAmount*Math.abs(centerPosition-boxElementPosition) + "px)";
            return elementSize;
        }(this.mySelector, this.boxGrowthAmount);
        e.style.width = elementSize;
    }
    endTouch(touchOriginY) {
        if (this.fingerVelocity < 0) {
            this.mySelector.currentOption = Math.ceil((-this.previousScrollPositionY / this.mySelector.getOptionBoxHeight())) + 1;
        } else if (this.fingerVelocity > 0) {
            this.mySelector.currentOption = Math.floor((-this.previousScrollPositionY / this.mySelector.getOptionBoxHeight())) + 1;
        }
        if(this.mySelector.currentOption < 0) {
            this.mySelector.currentOption = 0;
        } else if(this.mySelector.currentOption > this.mySelector.optionBoxes.length-1) {
            this.mySelector.currentOption = this.mySelector.optionBoxes.length-1;
        }
        this.globalTouchOrigin = touchOriginY;
        this.decelerate();
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
    }
}



    const optionBox_default = {
        boxShadow: "0px 5px 5px rgba(86, 86, 86, 0.25)",
        backgroundColor: "white",
        borderRadius: "10px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;",
        fontSize: "2.5em"
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
                fontSize: (config.fontSize ? config.fontSize : optionBox_default.fontSize)
            }
        } else {
            return optionBox_default
        }
    }

}