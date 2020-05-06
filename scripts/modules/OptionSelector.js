function test() {
    mySelector = new SelectorOptionLinkedList("o");
    mySelector.add(new SelectorOption(mySelector.current, "3", null));
    mySelector.add(new SelectorOption(mySelector.current, "yt", null));
    curr = mySelector.root;
    document.getElementById("option").innerHTML += curr.data;
    curr = curr.next;
    document.getElementById("option").innerHTML += curr.data;
    curr = curr.next;
    document.getElementById("option").innerHTML += curr.data;
}

class Selector {
    
}

class SelectorOptionLinkedList {
    root;
    current;
    constructor(data){
        this.root = new SelectorOption(null, data, null);
        this.current = this.root;
    }

    add(selectorOption) {
        try {
            if(!(selectorOption instanceof SelectorOption)) throw "Must be of type 'SelectorOption'";
        } catch(err) {
            console.error(err);
        }
        this.current.next = selectorOption;
        this.current = selectorOption;
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