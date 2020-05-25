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
    divBoxes = [];
    selectorTextParagraph = [];
    optionBoxDefaultHeight = 50;
    constructor(selectorSectionId, selectorOptionList){
        this.selectorSectionId = selectorSectionId;
        this.selectorOptionList = selectorOptionList;
        this.currentOption = selectorOptionList.root;
        this.selectorSection = document.getElementById(this.selectorSectionId);
        this.createDivBoxes();
        this.scrollEvents();
    }

    createDivBoxes() {
        for(let i = 0; i < 5; i++) {
            this.divBoxes[i] = document.createElement("div");
            this.divBoxes[i].id = "SelectorOptionBox" + i;
            this.divBoxes[i].className = "SelectorOptionBox";
            this.selectorSection.appendChild(this.divBoxes[i]);
            this.selectorTextParagraph[i] = this.divBoxes[i].appendChild(document.createElement("p"));
            this.selectorTextParagraph[i].style.margin = "0px";
        }
    }

    scrollEvents() {
        let touchOrigin;
        let currentScrolls = 0;
        let previousFingerPos = 0;
        this.selectorSection.addEventListener("touchstart", function(ev) {
            touchOrigin = ev.touches[0].clientY;
            currentScrolls = 0;
        }, {passive: true});
        this.selectorSection.addEventListener("touchmove", ev => {
            let fingerPos = ev.targetTouches[0];
            let relativeFingerPos = fingerPos.clientY % this.optionBoxDefaultHeight;
            console.log(Math.floor(relativeFingerPos) + ", prev: " + Math.floor(previousFingerPos % this.optionBoxDefaultHeight));
            if(Math.floor(fingerPos.clientY % this.optionBoxDefaultHeight)==0){
                this.divBoxes[4].childNodes[0].style.fontSize = "0px";
                this.divBoxes[0].childNodes[0].style.fontSize = "0px";
                if(previousFingerPos < fingerPos.clientY){
                    this.selectPrevious();
                    this.refreshOptions();
                } else if(previousFingerPos > fingerPos.clientY){
                    this.selectNext();
                    this.refreshOptions();
                }
            } else {
                this.divBoxes[0].style.height = relativeFingerPos + "px";
                this.divBoxes[4].style.height = this.optionBoxDefaultHeight-relativeFingerPos + "px";
                this.divBoxes[0].childNodes[0].style.fontSize = this.fontSize*(relativeFingerPos/this.optionBoxDefaultHeight) + "px";
                this.divBoxes[4].childNodes[0].style.fontSize = this.fontSize*((this.optionBoxDefaultHeight-relativeFingerPos)/this.optionBoxDefaultHeight) + "px";
                

            }
            
            previousFingerPos = fingerPos.clientY;
        }, {passive: true});
    }

    selectPrevious(){
        if(this.currentOption.previous != null && this.currentOption.previous.previous!=null)this.currentOption = this.currentOption.previous;
        this.divBoxes[0].style.height = "0px";
        this.divBoxes[4].style.height = this.optionBoxDefaultHeight + "px";
    }

    selectNext() {
        if(this.currentOption.next != null && this.currentOption.next.next!=null)this.currentOption = this.currentOption.next;
        this.divBoxes[0].style.height = this.optionBoxDefaultHeight + "px";
        this.divBoxes[4].style.height = "0px";
    }

    refreshOptions(){
        if(this.currentOption.previous != null) {
            if(this.currentOption.previous.previous != null){
                this.selectorTextParagraph[0].innerHTML = this.currentOption.previous.previous.data;
            }
            this.selectorTextParagraph[1].innerHTML = this.currentOption.previous.data;
            this.divBoxes[1].style.height = this.optionBoxDefaultHeight+"px";
        }

        this.selectorTextParagraph[2].innerHTML = this.currentOption.data;
        this.divBoxes[2].style.height = this.optionBoxDefaultHeight+"px";

        if(this.currentOption.next != null){
            this.selectorTextParagraph[3].innerHTML = this.currentOption.next.data;
            this.divBoxes[3].style.height = this.optionBoxDefaultHeight+"px";
            if(this.currentOption.next.next != null){
                this.selectorTextParagraph[4].innerHTML = this.currentOption.next.next.data;

            }
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