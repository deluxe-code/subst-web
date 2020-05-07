let tester;
function startTester() {
    tester = new Tester();
    tester.start();
}
class Tester {
    mySelectorList = new SelectorOptionLinkedList("o");
    mySelector;
    start() {
        this.mySelectorList.add(new SelectorOption(this.mySelectorList.last, "3", null));
        this.mySelectorList.add(new SelectorOption(this.mySelectorList.last, "yt", null));
        this.mySelector = new Selector("option", this.mySelectorList);
    }
    mySubmit(){
        this.mySelector.refreshOptions();
    }
}

class Selector {
    
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

    scroll() {
        touchOrigin = [];
        selectorSection.addEventListener("touchstart", function(ev) {
            //touchOrigin[0] = ev.originalEvent.touches[0].pageX;
            //touchOrigin[1] = ev.originalEvent.touches[0].pageY;
            console.log("egh");
        });
        selectorSection.addEventListener("touchmove", function(ev) {
            
        });
    }
    selectPrevious(){
        currentOption = currentOption.previous;
    }

    selectNext() {
        currentOption = currentOption.next;
    }

    refreshOptions(){
        if(this.currentOption.previous != null && this.currentOption.previous.previous != null)
            this.selectorTextParagraph[0].innerHTML = this.currentOption.previous.previous.data;
        if(this.currentOption.previous != null)
            this.selectorTextParagraph[1].innerHTML = this.currentOption.previous.data;

        this.selectorTextParagraph[2].innerHTML = this.currentOption.data;

        if(this.currentOption.next != null)
            this.selectorTextParagraph[3].innerHTML = this.currentOption.next.data;
        if(this.currentOption.next != null && this.currentOption.next.next != null)
            this.selectorTextParagraph[4].innerHTML = this.currentOption.next.next.data;
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