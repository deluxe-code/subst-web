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
        this.mySelector.displayOptions();
    }
}

class Selector {
    
    selectorOptionList;
    currentOption;
    selectionSectionId;
    divBoxes = [];
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
            this.divBoxes[i].id = "optionBox" + i;
            this.selectionSection.appendChild(this.divBoxes[i]);
        }
    }

    selectPrevious(){
        currentOption = currentOption.previous;
    }

    selectNext() {
        currentOption = currentOption.next;
    }

    displayOptions(){
        document.getElementById("optionBox2").innerHTML = this.currentOption.data;
        this.divBoxes[0].innerHTML = this.currentOption.previous.previous.data;
        this.divBoxes[1].innerHTML = this.currentOption.previous.data;
        this.divBoxes[2].innerHTML = this.currentOption.data;
        this.divBoxes[3].innerHTML = this.currentOption.next.data;
        this.divBoxes[4].innerHTML = this.currentOption.next.next.data;
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