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
    decelerationInterval;
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

    createOptionBoxes() {
        this.selectorBox = document.createElement("div");
        this.selectorBox.className = "SelectorBox";
        console.log(this.optionsList.length);
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
    scrollVelocity;
    previousScrollPositionY = 0;
    lastFingerPositionY;
    previousTimeStamp = Date.now();
    decelerationInterval;
    globalTouchOrigin;
    constructor(mySelector) {
        this.mySelector = mySelector;
    }
    scroll(currentTouchPosY, touchOriginY, optionBoxes) {
        this.optionBoxes = optionBoxes;
        let position = this.newScrollPosition + (currentTouchPosY - touchOriginY);
        optionBoxes.forEach(e => {
            e.style.top = position + "px";
        });
        this.setFingerVelocity(currentTouchPosY, this.previousTimeStamp);
        this.previousTimeStamp = Date.now();
        this.previousScrollPositionY = position;
    }

    endTouch(touchOriginY) {
        this.globalTouchOrigin = touchOriginY;
        this.mySelector.currentOption = Math.floor(-this.newScrollPosition / this.optionBoxes[0].offsetHeight);//replace with optionbox height please
        console.log("curr: " + this.mySelector.currentOption + " newScrollPosition: " + -this.newScrollPosition + " offsetHeight:" + this.optionBoxes[0].offsetHeight);
        this.decelerate();
    }

    setFingerVelocity(fingerPosY, previousTimeStamp) {
        let timeBetweenFingers = Date.now() - previousTimeStamp;
        let distance = fingerPosY - this.lastFingerPositionY;
        this.fingerVelocity = distance / timeBetweenFingers;
    }

    decelerate = () => {
        this.scrollVelocity = this.fingerVelocity;
        this.decelerationInterval = setInterval(this.smoothDeceleration, 1000 / 60);
    }
    smoothDeceleration = () => {
        let decelerationRate = 0.05;
        let speed = 5;
        let snapRange = 0.1;

        if (this.scrollVelocity > snapRange) {
            let nextScrollPosition = this.lastFingerPositionY + (this.scrollVelocity * speed);
            this.scroll(nextScrollPosition, this.globalTouchOrigin, this.optionBoxes);
            this.scrollVelocity -= decelerationRate;
            this.lastFingerPositionY = nextScrollPosition;
        } else if (this.scrollVelocity < -snapRange) {
            let nextScrollPosition = this.lastFingerPositionY + (this.scrollVelocity * speed);
            this.scroll(nextScrollPosition, this.globalTouchOrigin, this.optionBoxes);
            this.scrollVelocity += decelerationRate;
            this.lastFingerPositionY = nextScrollPosition;
        } else {
            clearInterval(this.decelerationInterval);
        }

    }
    startScroll() {
        this.newScrollPosition = this.previousScrollPositionY;
    }
}