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
        this.mySelector = new Selector("option", this.mySelectorList);
    }
    mySubmit(){
        this.mySelector.refreshOptions();
    }
}

class Selector {
    
    scrollSensitivity = 10;
    selectorOptionList;
    currentOption;
    selectorSectionId;
    selectorSection;
    divBoxes = [];
    selectorTextParagraph = [];
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
        }
    }

    scrollEvents() {
        let touchOrigin;
        this.selectorSection.addEventListener("touchstart", function(ev) {
            touchOrigin = ev.touches[0].clientY;
        }, {passive: true});
        this.selectorSection.addEventListener("touchmove", ev => {
            let fingerPos = ev.targetTouches[0];
            let relativeFingerPos = touchOrigin-fingerPos.clientY;
            if((relativeFingerPos) > this.scrollSensitivity && 
                (Math.round(relativeFingerPos) % this.scrollSensitivity == 0)){
                
                this.selectNext();
                this.refreshOptions();
                
            } else if(relativeFingerPos < -this.scrollSensitivity && 
                (Math.round(relativeFingerPos) % this.scrollSensitivity == 0)){
                
                this.selectPrevious();
                this.refreshOptions();
                
            } else {
                this.divBoxes.forEach(element => {
                    element.style.top = relativeFingerPos + 'px';
                    console.log(element.style.top + ", rel: " + relativeFingerPos);
                });
            }
        }, {passive: true});
    }
    selectPrevious(){
        if(this.currentOption.previous != null && this.currentOption.previous.previous!=null)this.currentOption = this.currentOption.previous;
    }

    selectNext() {
        if(this.currentOption.next != null && this.currentOption.next.next!=null)this.currentOption = this.currentOption.next;
    }

    refreshOptions(){
        if(this.currentOption.previous != null) {
            this.selectorTextParagraph[0].innerHTML = this.currentOption.previous.data;
        }

        this.selectorTextParagraph[1].innerHTML = this.currentOption.data;

        if(this.currentOption.next != null){
            this.selectorTextParagraph[2].innerHTML = this.currentOption.next.data;
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