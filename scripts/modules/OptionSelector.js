export class Selector {

    selectorBox;
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

    constructor(arr) {
        this.optionsList = arr;
        this.createOptionBoxes();
        this.scrollEvents();
        this.createSelectorResizeObserver();
        this.animator = new OptionSelectorAnimator(this);
        this.selectorBox.style.height = "100%";
    }

    createSelectorResizeObserver() {
        let resizeObserver = new ResizeObserver(() => {
            //this.refreshOptions();
        });
        resizeObserver.observe(this.selectorBox);
    }

    getOptionBoxHeight() {
        return (this.selectorBox.offsetHeight / 3);
    }
    setStyles() {

        this.optionBoxes.forEach(e => {
            e.style.top = -this.getOptionBoxHeight();
        }, { passive: true });
    }

    getElement() {
        return this.selectorBox;
    }

    getSelected() {
        return optionsList[this.currentOption];
    }
    createOptionBoxes() {
        this.selectorBox = document.createElement("div");
        this.selectorBox.className = "SelectorBox";
        for (let i = 0; i < this.optionsList.length; i++) {
            this.optionBoxes[i] = document.createElement("div");
            this.optionBoxes[i].id = "SelectorOptionBox" + i;
            this.optionBoxes[i].className = "SelectorOptionBox";
            this.optionBoxes[i].style.height = (100 / 3) + "%";
            this.selectorBox.appendChild(this.optionBoxes[i]);
            let child = this.optionBoxes[i].appendChild(document.createElement("p"));
            child.innerHTML = this.optionsList[i];
            child.style.position = "relative";
            child.style.textAlign = "center";
            child.style.width = "50%";
            child.style.marginTop = "0px";
            child.style.marginBottom = "0px";
            child.style.marginLeft = "auto";
            child.style.marginRight = "auto";
            child.style.padding = "60px";
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
    constructor(mySelector) {
        this.mySelector = mySelector;
    }
    scroll(currentTouchPosY, touchOriginY, optionBoxes) {
        let position = this.newScrollPosition + (currentTouchPosY - touchOriginY);
        this.scrollToPagePosition(position, optionBoxes);
        this.previousScreenPositionY = currentTouchPosY;
    }

    scrollToPagePosition(position, optionBoxes) {
        this.optionBoxes = optionBoxes;
        optionBoxes.forEach(e => {
            e.style.top = position + "px";
        });
        this.previousTimeStamp = Date.now();
        this.previousScrollPositionY = position;
    }
    endTouch(touchOriginY) {
        if (this.fingerVelocity < 0) {
            this.mySelector.currentOption = Math.ceil(-this.previousScrollPositionY / this.mySelector.getOptionBoxHeight()) + 1;
        } else if (this.fingerVelocity > 0) {
            this.mySelector.currentOption = Math.floor(-this.previousScrollPositionY / this.mySelector.getOptionBoxHeight()) + 1;
        }
        this.globalTouchOrigin = touchOriginY;
        //replace with optionbox height please
        this.decelerate();
    }

    setFingerVelocity(fingerPosY, previousTimeStamp) {
        let timeBetweenFingers = Date.now() - previousTimeStamp;
        let distance = fingerPosY - this.lastFingerPositionY;
        this.fingerVelocity = distance / timeBetweenFingers;
    }

    decelerate() {
        let sensitivity = 1;
        let thisObject = this;
        let scrollVelocity = this.fingerVelocity;
        let targetPosition = -(this.mySelector.currentOption - 1) * this.mySelector.getOptionBoxHeight();
        let nextPosition = this.previousScrollPositionY;
        this.decelerationInterval = setInterval(smoothDeceleration, 1000 / 60);
        let speed = 10;
        let decelerationRate = 50;
        console.log(this.mySelector.currentOption);
        console.log(targetPosition);
        function smoothDeceleration() {

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
        }
    }

    startScroll() {
        clearInterval(this.decelerationInterval);
        this.newScrollPosition = this.previousScrollPositionY;
    }
}