export class Selector {
    
    selectorBox;
    scrollSensitivity = 1;
    fontSize = 16;
    selectorOptionList;
    currentOption;
    optionBoxes = [];
    selectorTextParagraph = [];
    fingerVelocity;
    previousScrollPosition;
    decelerationInterval;
    smoothHeightInterval;
    
    constructor(arr){
        this.selectorOptionList = new SelectorOptionLinkedList(arr);
        this.currentOption = this.selectorOptionList.root;
        this.createOptionBoxes();
        this.scrollEvents();
        this.createSelectorResizeObserver();
        this.selectorBox.style.height = "100%";
        this.selectNext();this.selectNext();this.selectNext();this.selectNext();this.selectNext();
        this.refreshOptions();
        //this.setStyles();
    }

    createSelectorResizeObserver(){
        let resizeObserver = new ResizeObserver(() => {
            this.revertToDefaultPosition();
            this.refreshOptions();
        });
        resizeObserver.observe(this.selectorBox);
    }

    setStyles() {
        
        this.optionBoxes.forEach(e => {
            e.style.top = -this.getOptionBoxHeight();
        }, {passive: true});
    }

    getElement() {
        return this.selectorBox;
    }

    addOption(data) {
        this.selectorOptionList.add(data);
    }
    createOptionBoxes() {
        this.selectorBox =  document.createElement("div");
        this.selectorBox.className = "SelectorBox";
        for(let i = 0; i < 5; i++) {
            this.optionBoxes[i] = document.createElement("div");
            this.optionBoxes[i].id = "SelectorOptionBox" + i;
            this.optionBoxes[i].className = "SelectorOptionBox";
            this.selectorBox.appendChild(this.optionBoxes[i]);
            this.selectorTextParagraph[i] = this.optionBoxes[i].appendChild(document.createElement("p"));
            this.selectorTextParagraph[i].style.margin = "0px";
        }
    }

    numberOfPositionResets = 1;
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
        }, {passive: true});
        this.selectorBox.addEventListener("touchmove", ev => {
            
            let fingerPos = ev.targetTouches[0];
            let fingerPosY = fingerPos.clientY;
            this.setFingerVelocity(fingerPosY, previousFingerPosY, previousTimeStamp);
            previousFingerPosY = this.scroll(fingerPosY, previousFingerPosY, touchOriginY);
            this.previousScrollPosition = previousFingerPosY;
            previousTimeStamp = Date.now();
        }, {passive: true});
        this.selectorBox.addEventListener("touchend", ev => {
            //this.decelerationInterval = setInterval(this.smoothDeceleration, 1000/60);
            this.snapToNearestOption(previousFingerPosY);
            this.revertToDefaultPosition();
        }, {passive: true});
        this.selectorBox.addEventListener("scroll", ev => {

        });
    }

    snapToNearestOption(fingerPosY) {
        console.log(fingerPosY);
        if(fingerPosY%this.getOptionBoxHeight() < this.getOptionBoxHeight()/2) {
            console.log("yess");
            this.selectPrevious();
            this.refreshOptions();
        } else{
            
        }
    }

    //scroll preforms scroll actions and returns previousFingerPos
    scroll(currentTouchPosY, previousTouchPosY, touchOriginY) {
        let position = (currentTouchPosY-touchOriginY-(this.getOptionBoxHeight()*this.numberOfPositionResets));
        this.optionBoxes.forEach(e => {
            e.style.top = position + "px";
        });
        if(position < - this.getOptionBoxHeight()*2){
            this.numberOfPositionResets--;
            this.selectNext();
            this.refreshOptions();
        } else if(position > 0) {
            this.numberOfPositionResets++;
            this.selectPrevious();
            this.refreshOptions();
        }
        return currentTouchPosY;

    }

    revertToDefaultPosition(){
        this.optionBoxes.forEach(e => {
            e.style.top = -this.getOptionBoxHeight() + "px";
        });
    }

    getOptionBoxHeight(){
        return (this.selectorBox.offsetHeight/3);
    }
    setFingerVelocity(fingerPosY, previousFingerPosY, previousTimeStamp) {
        let timeBetweenFingers = Date.now() - previousTimeStamp;
        let distance = fingerPosY - previousFingerPosY;
        this.fingerVelocity = distance/timeBetweenFingers;
    }

    smoothDeceleration = () => {
        let decelerationRate = 0.05;
        let speed = 8;
        let snapRange = 0.1;
        console.log(this.fingerVelocity);
        if(this.fingerVelocity > snapRange){
            
            let nextScrollPosition = this.previousScrollPosition + this.fingerVelocity*speed;
            this.scroll(nextScrollPosition, this.previousScrollPosition, 0);
            this.fingerVelocity-=decelerationRate;
            this.previousScrollPosition = nextScrollPosition;
        } else if(this.fingerVelocity<-snapRange){

            let nextScrollPosition = this.previousScrollPosition + this.fingerVelocity*speed;
            this.scroll(nextScrollPosition, this.previousScrollPosition, 0);
            this.fingerVelocity+=decelerationRate;
            this.previousScrollPosition = nextScrollPosition;
        } else{
            this.revertToDefaultPosition();
            clearInterval(this.decelerationInterval);
        }

    }

    selectPrevious(){
        if(this.currentOption.previous != null)this.currentOption = this.currentOption.previous;
    }

    selectNext() {
        if(this.currentOption.next != null)this.currentOption = this.currentOption.next;
    }

    hasNext() {
        return this.currentOption.next != null && this.currentOption.next.next != null;
    }

    hasPrevious(){
        return this.currentOption.previous != null && this.currentOption.previous.previous != null;
    }

    refreshOptions(){
        if(this.currentOption.previous != null) {
            if(this.currentOption.previous.previous != null){
                this.selectorTextParagraph[0].innerHTML = this.currentOption.previous.previous.data;
                this.optionBoxes[0].style.height = this.getOptionBoxHeight()+"px";
            } else {
                this.selectorTextParagraph[0].innerHTML = "";
            }
            this.selectorTextParagraph[1].innerHTML = this.currentOption.previous.data;
            this.optionBoxes[1].style.height = this.getOptionBoxHeight()+"px";
        } else{
            this.selectorTextParagraph[0].innerHTML = "";
            this.selectorTextParagraph[1].innerHTML = "";
        }

        this.selectorTextParagraph[2].innerHTML = this.currentOption.data;
        this.optionBoxes[2].style.height = this.getOptionBoxHeight()+"px";

        if(this.currentOption.next != null){
            this.selectorTextParagraph[3].innerHTML = this.currentOption.next.data;
            this.optionBoxes[3].style.height = this.getOptionBoxHeight()+"px";
            if(this.currentOption.next.next != null){
                this.selectorTextParagraph[4].innerHTML = this.currentOption.next.next.data;
                this.optionBoxes[4].style.height = this.getOptionBoxHeight()+"px";
            } else {
                this.selectorTextParagraph[4].innerHTML = "";
            }
        } else{
            this.selectorTextParagraph[3].innerHTML = "";
            this.selectorTextParagraph[4].innerHTML = "";
        }
    }

}

export class SelectorOptionLinkedList {
    root;
    last;

    constructor(arr){
        if(arr!=null){
            this.insertArray(arr);
        }
    }

    insertArray(arr){
        arr.forEach(option => {
            this.add(new SelectorOption(this.last, option, null));
        });
    }

    insertListFromDatabase(){

    }

    add(selectorOption) {
        try {
            if(!(selectorOption instanceof SelectorOption)) throw "Must be of type 'SelectorOption'";
        } catch(err) {
            console.error(err);
        }

        if(this.root==null){
            this.root = selectorOption;
        }else{
            this.last.next = selectorOption;
        }
        this.last = selectorOption;
    }

}

export class SelectorOption{
    data;
    previous;
    next;
    constructor(previous, data, next) {
        this.previous = previous;
        this.data = data;
        this.next = next;
    }
}