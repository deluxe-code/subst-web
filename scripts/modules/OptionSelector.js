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
    selectionSectionId;
    divBoxes = [];
    selectorTextParagraph = [];
    constructor(selectionSectionId, selectorOptionList){
        this.selectionSectionId = selectionSectionId;
        this.selectorOptionList = selectorOptionList;
        this.currentOption = selectorOptionList.root;
        this.selectionSection = document.getElementById(this.selectionSectionId);
        this.createDivBoxes();
    }

    createDivBoxes() {
        for(let i = 0; i < 5; i++) {
            this.divBoxes[i] = document.createElement("div");
            this.divBoxes[i].id = "SelectorOptionBox" + i;
            this.divBoxes[i].className = "SelectorOptionBox";
            this.selectionSection.appendChild(this.divBoxes[i]);
            this.selectorTextParagraph[i] = this.divBoxes[i].appendChild(document.createElement("p"));
        }
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