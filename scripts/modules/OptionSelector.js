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
        this.refreshOptions();
    }

    createSelectorResizeObserver(){
        let resizeObserver = new ResizeObserver(() => {
            this.refreshOptions();
        });
        resizeObserver.observe(this.selectorBox);
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

    scrollEvents() {
        let touchOrigin;
        let currentScrolls = 0;
        let previousFingerPosY = 0;
        let previousTimeStamp = Date.now();
        let initialOffset;
        let numberOfPreviousOptionBoxesWithinFingerDistance = 0;
        this.selectorBox.addEventListener("touchstart", ev => {
            clearInterval(this.decelerationInterval);
            touchOrigin = ev.touches[0].clientY;
            currentScrolls = 0;
        }, {passive: true});
        this.selectorBox.addEventListener("touchmove", ev => {
            
            let fingerPos = ev.targetTouches[0];
            let fingerPosY = fingerPos.clientY-(touchOrigin%(this.selectorBox.offsetHeight/4));
            this.setFingerVelocity(fingerPosY, previousFingerPosY, previousTimeStamp);
            previousFingerPosY = this.scroll(fingerPosY, previousFingerPosY);
            this.previousScrollPosition = previousFingerPosY;
            previousTimeStamp = Date.now();
        }, {passive: true});
        this.selectorBox.addEventListener("touchend", ev => {
            this.decelerationInterval = setInterval(this.smoothDeceleration, 1000/60);
        }, {passive: true});
        this.selectorBox.addEventListener("scroll", ev => {

        });
    }

    //scroll preforms scroll actions and returns previousFingerPos
    scroll(fingerPosY, previousFingerPosY) {
        
        let relativeFingerPosY = (fingerPosY % (this.selectorBox.offsetHeight/4)) ;
        console.log(relativeFingerPosY);
        let numberOfCurrentOptionBoxesWithinFingerDistance = Math.floor(fingerPosY/(this.selectorBox.offsetHeight/4));
        let numberOfPreviousOptionBoxesWithinFingerDistance = Math.floor(previousFingerPosY/(this.selectorBox.offsetHeight/4));
        while(relativeFingerPosY<0){
            relativeFingerPosY+= (this.selectorBox.offsetHeight/4);
        }
        if(numberOfPreviousOptionBoxesWithinFingerDistance < numberOfCurrentOptionBoxesWithinFingerDistance){
                this.selectPrevious();
                this.refreshOptions();
        }else if(numberOfPreviousOptionBoxesWithinFingerDistance > numberOfCurrentOptionBoxesWithinFingerDistance){
                this.selectNext();
                this.refreshOptions();
        }else {
                this.optionBoxes[0].style.height = ((relativeFingerPosY)/this.selectorBox.offsetHeight)*100 + "%";
                this.optionBoxes[4].style.height = (((this.selectorBox.offsetHeight/4)-relativeFingerPosY)/this.selectorBox.offsetHeight)*100 + "%";
                this.optionBoxes[0].childNodes[0].style.fontSize = this.fontSize*(relativeFingerPosY/(this.selectorBox.offsetHeight/4)) + "px";
                this.optionBoxes[4].childNodes[0].style.fontSize = this.fontSize*(((this.selectorBox.offsetHeight/4)-relativeFingerPosY)/(this.selectorBox.offsetHeight/4)) + "px";
        }       
        previousFingerPosY = fingerPosY;
        return previousFingerPosY;
    }

    setFingerVelocity(fingerPosY, previousFingerPosY, previousTimeStamp) {
        let timeBetweenFingers = Date.now() - previousTimeStamp;
        let distance = fingerPosY - previousFingerPosY;
        this.fingerVelocity = distance/timeBetweenFingers;
    }

    smoothDeceleration = () => {
        let decelerationRate = 0.05;
        let speed = 4;
        let snapRange = 0.1;
        if(this.fingerVelocity > snapRange){
            let nextScrollPosition = this.previousScrollPosition + this.fingerVelocity*speed;
            this.scroll(nextScrollPosition, this.previousScrollPosition);
            this.fingerVelocity-=decelerationRate;
            this.previousScrollPosition = nextScrollPosition;
        } else if(this.fingerVelocity<-snapRange){
            let nextScrollPosition = this.previousScrollPosition + this.fingerVelocity*speed;
            this.scroll(nextScrollPosition, this.previousScrollPosition);
            this.fingerVelocity+=decelerationRate;
            this.previousScrollPosition = nextScrollPosition;
        } else{
            this.smoothHeightReset();
        }

    }

    selectPrevious(){
        if(this.currentOption.previous != null)this.currentOption = this.currentOption.previous;
        this.optionBoxes[0].style.height = "0px";
        this.optionBoxes[4].style.height = (this.selectorBox.offsetHeight/4) + "px"; 
        this.optionBoxes[0].childNodes[0].style.fontSize = "0px";
        this.optionBoxes[4].childNodes[0].style.fontSize = this.fontSize + "px";
    }

    selectNext() {
        if(this.currentOption.next != null)this.currentOption = this.currentOption.next;
        this.optionBoxes[4].style.height = "0px";
        this.optionBoxes[0].style.height = (this.selectorBox.offsetHeight/4) + "px";
        this.optionBoxes[4].childNodes[0].style.fontSize = "0px";
        this.optionBoxes[0].childNodes[0].style.fontSize = this.fontSize + "px";
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
            } else {
                this.selectorTextParagraph[0].innerHTML = "";
            }
            this.selectorTextParagraph[1].innerHTML = this.currentOption.previous.data;
            this.optionBoxes[1].style.height = (this.selectorBox.offsetHeight/4)+"px";
        } else{
            this.selectorTextParagraph[0].innerHTML = "";
            this.selectorTextParagraph[1].innerHTML = "";
        }

        this.selectorTextParagraph[2].innerHTML = this.currentOption.data;
        this.optionBoxes[2].style.height = (this.selectorBox.offsetHeight/4)+"px";

        if(this.currentOption.next != null){
            this.selectorTextParagraph[3].innerHTML = this.currentOption.next.data;
            this.optionBoxes[3].style.height = (this.selectorBox.offsetHeight/4)+"px";
            if(this.currentOption.next.next != null){
                this.selectorTextParagraph[4].innerHTML = this.currentOption.next.next.data;
            } else {
                this.selectorTextParagraph[4].innerHTML = "";
            }
        } else{
            this.selectorTextParagraph[3].innerHTML = "";
            this.selectorTextParagraph[4].innerHTML = "";
        }
    }

    smoothHeightReset = () => {
        let heightDeceleration = 5;
        let stoppingRange = 1;
        if(this.optionBoxes[0].offsetHeight < ((this.selectorBox.offsetHeight/4)/2)-(stoppingRange*heightDeceleration)){
            
            this.optionBoxes[0].style.height = (this.optionBoxes[0].offsetHeight+heightDeceleration) + "px";
            this.optionBoxes[4].style.height = (this.optionBoxes[4].offsetHeight-heightDeceleration) + "px";
            this.optionBoxes[4].childNodes[0].style.fontSize = this.fontSize/2 + "px";
            this.optionBoxes[0].childNodes[0].style.fontSize = this.fontSize/2 + "px";
        } else if(this.optionBoxes[0].offsetHeight > ((this.selectorBox.offsetHeight/4)/2)+(stoppingRange*heightDeceleration)){
            this.optionBoxes[0].style.height = (this.optionBoxes[0].offsetHeight-heightDeceleration) + "px";
            this.optionBoxes[4].style.height = (this.optionBoxes[4].offsetHeight+heightDeceleration) + "px";
            this.optionBoxes[4].childNodes[0].style.fontSize = this.fontSize/2 + "px";
            this.optionBoxes[0].childNodes[0].style.fontSize = this.fontSize/2 + "px";
        } else {
            this.optionBoxes[0].style.height = (this.selectorBox.offsetHeight/4)/2 + "px";
            this.optionBoxes[4].style.height = (this.selectorBox.offsetHeight/4)/2 + "px";
            this.optionBoxes[4].childNodes[0].style.fontSize = this.fontSize/2 + "px";
            this.optionBoxes[0].childNodes[0].style.fontSize = this.fontSize/2 + "px";
            clearInterval(this.decelerationInterval);
            clearInterval(this.smoothHeightInterval);
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