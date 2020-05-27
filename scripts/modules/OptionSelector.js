let tester;
function startTester() {
    tester = new Tester();
    tester.start();
}
class Tester {
    mySelectorList = new SelectorOptionLinkedList("o");
    mySelector;
    start() {
        this.mySelectorList.add(new SelectorOption(this.mySelectorList.last, "333", null));
        this.mySelectorList.add(new SelectorOption(this.mySelectorList.last, "yt", null));
        this.mySelectorList.add(new SelectorOption(this.mySelectorList.last, "4", null));
        this.mySelectorList.add(new SelectorOption(this.mySelectorList.last, "324", null));
        this.mySelectorList.add(new SelectorOption(this.mySelectorList.last, "fsdf", null));
        this.mySelectorList.add(new SelectorOption(this.mySelectorList.last, "124", null));
        this.mySelectorList.add(new SelectorOption(this.mySelectorList.last, "fxd43f", null));
        for(var i = 0; i < 30; i++){
            this.mySelectorList.add(new SelectorOption(this.mySelectorList.last, "forloop, " + i, null));
        }
        this.mySelector = new Selector("option", this.mySelectorList);
    }
    mySubmit(){
        this.mySelector.refreshOptions();
    }
}

class Selector {
    
    scrollSensitivity = 1;
    fontSize = 16;
    selectorOptionList;
    currentOption;
    selectorSectionId;
    selectorSection;
    optionBoxes = [];
    selectorTextParagraph = [];
    optionBoxHeight = 50;
    fingerVelocity;
    previousScrollPosition;
    decelerationInterval;
    smoothHeightInterval;
    constructor(selectorSectionId, selectorOptionList){
        this.selectorSectionId = selectorSectionId;
        this.selectorOptionList = selectorOptionList;
        this.currentOption = selectorOptionList.root;
        this.selectorSection = document.getElementById(this.selectorSectionId);
        this.createoptionBoxes();
        this.scrollEvents();
        this.optionBoxHeight=this.selectorSection.offsetHeight/4;
    }

    createoptionBoxes() {
        for(let i = 0; i < 5; i++) {
            this.optionBoxes[i] = document.createElement("div");
            this.optionBoxes[i].id = "SelectorOptionBox" + i;
            this.optionBoxes[i].className = "SelectorOptionBox";
            this.selectorSection.appendChild(this.optionBoxes[i]);
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
        this.selectorSection.addEventListener("touchstart", ev => {
            clearInterval(this.decelerationInterval);
            touchOrigin = ev.touches[0].clientY;
            currentScrolls = 0;
        }, {passive: true});
        this.selectorSection.addEventListener("touchmove", ev => {
            let fingerPos = ev.targetTouches[0];
            let fingerPosY = fingerPos.clientY-(touchOrigin%this.optionBoxHeight);
            this.setFingerVelocity(fingerPosY, previousFingerPosY, previousTimeStamp);
            previousFingerPosY = this.scroll(fingerPosY, previousFingerPosY);
            this.previousScrollPosition = previousFingerPosY;
            previousTimeStamp = Date.now();
        }, {passive: true});
        this.selectorSection.addEventListener("touchend", ev => {
            this.decelerationInterval = setInterval(this.smoothDeceleration, 1000/60);
        }, {passive: true});
    }

    //scroll preforms scroll actions and returns previousFingerPos
    scroll(fingerPosY, previousFingerPosY) {
        
        let relativeFingerPosY = fingerPosY % this.optionBoxHeight;
        let numberOfCurrentOptionBoxesWithinFingerDistance = Math.floor(fingerPosY/this.optionBoxHeight);
        let numberOfPreviousOptionBoxesWithinFingerDistance = Math.floor(previousFingerPosY/this.optionBoxHeight);
        while(relativeFingerPosY<0){
            relativeFingerPosY+= this.optionBoxHeight;
        }
        if(numberOfPreviousOptionBoxesWithinFingerDistance < numberOfCurrentOptionBoxesWithinFingerDistance){
                this.selectPrevious();
                this.refreshOptions();
            } else if(numberOfPreviousOptionBoxesWithinFingerDistance > numberOfCurrentOptionBoxesWithinFingerDistance){
                this.selectNext();
                this.refreshOptions();
            }else {
                this.optionBoxes[0].style.height = relativeFingerPosY + "px";
                this.optionBoxes[4].style.height = this.optionBoxHeight-relativeFingerPosY + "px";
                this.optionBoxes[0].childNodes[0].style.fontSize = this.fontSize*(relativeFingerPosY/this.optionBoxHeight) + "px";
                this.optionBoxes[4].childNodes[0].style.fontSize = this.fontSize*((this.optionBoxHeight-relativeFingerPosY)/this.optionBoxHeight) + "px";
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
            console.log(nextScrollPosition + "above range");
        } else if(this.fingerVelocity<-snapRange){
            let nextScrollPosition = this.previousScrollPosition + this.fingerVelocity*speed;
            this.scroll(nextScrollPosition, this.previousScrollPosition);
            this.fingerVelocity+=decelerationRate;
            this.previousScrollPosition = nextScrollPosition;
            console.log(nextScrollPosition);
        } else{
            this.smoothHeightReset();
        }

    }

    selectPrevious(){
        if(this.currentOption.previous != null && this.currentOption.previous.previous!=null)this.currentOption = this.currentOption.previous;
        this.optionBoxes[0].style.height = "0px";
        this.optionBoxes[4].style.height = this.optionBoxHeight + "px"; 
        this.optionBoxes[0].childNodes[0].style.fontSize = "0px";
        this.optionBoxes[4].childNodes[0].style.fontSize = this.fontSize + "px";
    }

    selectNext() {
        if(this.currentOption.next != null && this.currentOption.next.next!=null)this.currentOption = this.currentOption.next;
        this.optionBoxes[4].style.height = "0px";
        this.optionBoxes[0].style.height = this.optionBoxHeight + "px";
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
            }
            this.selectorTextParagraph[1].innerHTML = this.currentOption.previous.data;
            this.optionBoxes[1].style.height = this.optionBoxHeight+"px";
        }

        this.selectorTextParagraph[2].innerHTML = this.currentOption.data;
        this.optionBoxes[2].style.height = this.optionBoxHeight+"px";
        this.optionBoxes[2].style.borderStyle = "solid";
        this.optionBoxes[2].style.borderColor = "red";

        if(this.currentOption.next != null){
            this.selectorTextParagraph[3].innerHTML = this.currentOption.next.data;
            this.optionBoxes[3].style.height = this.optionBoxHeight+"px";
            if(this.currentOption.next.next != null){
                this.selectorTextParagraph[4].innerHTML = this.currentOption.next.next.data;

            }
        }
    }


    smoothHeightReset = () => {
        let heightDeceleration = 5;
        let stoppingRange = 1;
        if(this.optionBoxes[0].offsetHeight < (this.optionBoxHeight/2)-(stoppingRange*heightDeceleration)){
            
            this.optionBoxes[0].style.height = (this.optionBoxes[0].offsetHeight+heightDeceleration) + "px";
            this.optionBoxes[4].style.height = (this.optionBoxes[4].offsetHeight-heightDeceleration) + "px";
            this.optionBoxes[4].childNodes[0].style.fontSize = this.fontSize/2 + "px";
            this.optionBoxes[0].childNodes[0].style.fontSize = this.fontSize/2 + "px";
        } else if(this.optionBoxes[0].offsetHeight > (this.optionBoxHeight/2)+(stoppingRange*heightDeceleration)){
            this.optionBoxes[0].style.height = (this.optionBoxes[0].offsetHeight-heightDeceleration) + "px";
            this.optionBoxes[4].style.height = (this.optionBoxes[4].offsetHeight+heightDeceleration) + "px";
            this.optionBoxes[4].childNodes[0].style.fontSize = this.fontSize/2 + "px";
            this.optionBoxes[0].childNodes[0].style.fontSize = this.fontSize/2 + "px";
        } else {
            this.optionBoxes[0].style.height = this.optionBoxHeight/2 + "px";
            this.optionBoxes[4].style.height = this.optionBoxHeight/2 + "px";
            this.optionBoxes[4].childNodes[0].style.fontSize = this.fontSize/2 + "px";
            this.optionBoxes[0].childNodes[0].style.fontSize = this.fontSize/2 + "px";
            clearInterval(this.decelerationInterval);
            clearInterval(this.smoothHeightInterval);
        }
    }
    
}

class SelectorOptionLinkedList {
    root;
    last;
    constructor(data){
        this.root = new SelectorOption(null, data, null);
        this.last = this.root;
    }

    add(selectorOption) {
        try {
            if(!(selectorOption instanceof SelectorOption)) throw "Must be of type 'SelectorOption'";
        } catch(err) {
            console.error(err);
        }
        this.last.next = selectorOption;
        this.last = selectorOption;
    }

}

class SelectorOption{
    data;
    previous;
    next;
    constructor(previous, data, next) {
        this.previous = previous;
        this.data = data;
        this.next = next;
    }
}