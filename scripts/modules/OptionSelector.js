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
        this.animator = new OptionSelectorAnimator();
        this.selectorBox.style.height = "100%";
    }

    createSelectorResizeObserver() {
        let resizeObserver = new ResizeObserver(() => {
            //this.refreshOptions();
        });
        resizeObserver.observe(this.selectorBox);
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

    numberOfPositionResets = 1;
    globalTouchOrigin;
    scrollEvents() {
        let touchOriginY;
        let currentScrolls = 0;
        let previousFingerPosY = 0;
        let previousTimeStamp = Date.now();
        let initialOffset;
        let numberOfPreviousOptionBoxesWithinFingerDistance = 0;
        this.selectorBox.addEventListener("touchstart", ev => {
            clearInterval(this.decelerationInterval);
            touchOriginY = ev.touches[0].clientY;
            currentScrolls = 0;
            this.numberOfPositionResets = 1;
        }, { passive: true });
        this.selectorBox.addEventListener("touchmove", ev => {

            let fingerPos = ev.targetTouches[0];
            let fingerPosY = fingerPos.clientY;
            this.setFingerVelocity(fingerPosY, previousFingerPosY, previousTimeStamp);
            previousFingerPosY = this.scroll(fingerPosY, touchOriginY);
            this.previousScrollPosition = previousFingerPosY;
            previousTimeStamp = Date.now();
        }, { passive: true });
        this.selectorBox.addEventListener("touchend", ev => {
            this.globalTouchOrigin = touchOriginY;
            this.decelerationInterval = setInterval(this.smoothDeceleration, 1000 / 60);

        }, { passive: true });
        this.selectorBox.addEventListener("scroll", ev => {

        });
    }

    //scroll preforms scroll actions and returns previousFingerPos
    scroll(currentTouchPosY, touchOriginY) {
        let position = this.newScrollPosition + (currentTouchPosY - touchOriginY);
        this.optionBoxes.forEach(e => {
            e.style.top = position + "px";
        });
        return currentTouchPosY;
    }

    getOptionBoxHeight() {
        return (this.selectorBox.offsetHeight / 3);
    }

    setFingerVelocity(fingerPosY, previousFingerPosY, previousTimeStamp) {
        let timeBetweenFingers = Date.now() - previousTimeStamp;
        let distance = fingerPosY - previousFingerPosY;
        this.fingerVelocity = distance / timeBetweenFingers;
    }

    smoothDeceleration = () => {
        let decelerationRate = 0.05;
        let speed = 5;
        let snapRange = 0.1;
        if (this.fingerVelocity > snapRange) {

            let nextScrollPosition = this.previousScrollPosition + (this.fingerVelocity * speed);
            this.scroll(nextScrollPosition, this.globalTouchOrigin);
            this.fingerVelocity -= decelerationRate;
            this.previousScrollPosition = nextScrollPosition;
        } else if (this.fingerVelocity < -snapRange) {

            let nextScrollPosition = this.previousScrollPosition + (this.fingerVelocity * speed);
            this.scroll(nextScrollPosition, this.globalTouchOrigin);
            this.fingerVelocity += decelerationRate;
            this.previousScrollPosition = nextScrollPosition;
        } else {
            clearInterval(this.decelerationInterval);
        }

    }

}

export class SelectorOptionLinkedList {
    root;
    last;

    constructor(arr) {
        if (arr != null) {
            this.insertArray(arr);
        }
    }

    insertArray(arr) {
        arr.forEach(option => {
            this.add(new SelectorOption(this.last, option, null));
        });
    }

    insertListFromDatabase() {

    }

    add(selectorOption) {
        try {
            if (!(selectorOption instanceof SelectorOption)) throw "Must be of type 'SelectorOption'";
        } catch (err) {
            console.error(err);
        }

        if (this.root == null) {
            this.root = selectorOption;
        } else {
            this.last.next = selectorOption;
        }
        this.last = selectorOption;
    }

}

export class SelectorOption {
    data;
    previous;
    next;
    constructor(previous, data, next) {
        this.previous = previous;
        this.data = data;
        this.next = next;
    }
}

class OptionSelectorAnimator {
    //scroll preforms scroll actions and returns previousFingerPos
    scroll(currentTouchPosY, touchOriginY) {
        let position = this.newScrollPosition + (currentTouchPosY - touchOriginY);
        this.optionBoxes.forEach(e => {
            e.style.top = position + "px";
        });
        return currentTouchPosY;
    }

    getOptionBoxHeight() {
        return (this.selectorBox.offsetHeight / 3);
    }

    setFingerVelocity(fingerPosY, previousFingerPosY, previousTimeStamp) {
        let timeBetweenFingers = Date.now() - previousTimeStamp;
        let distance = fingerPosY - previousFingerPosY;
        this.fingerVelocity = distance / timeBetweenFingers;
    }

    smoothDeceleration = () => {
        let decelerationRate = 0.05;
        let speed = 5;
        let snapRange = 0.1;
        if (this.fingerVelocity > snapRange) {

            let nextScrollPosition = this.previousScrollPosition + (this.fingerVelocity * speed);
            this.scroll(nextScrollPosition, this.globalTouchOrigin);
            this.fingerVelocity -= decelerationRate;
            this.previousScrollPosition = nextScrollPosition;
        } else if (this.fingerVelocity < -snapRange) {

            let nextScrollPosition = this.previousScrollPosition + (this.fingerVelocity * speed);
            this.scroll(nextScrollPosition, this.globalTouchOrigin);
            this.fingerVelocity += decelerationRate;
            this.previousScrollPosition = nextScrollPosition;
        } else {
            clearInterval(this.decelerationInterval);
        }

    }
}