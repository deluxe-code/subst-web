export class Selector {
    options = [];
    selector;
    constructor(options) {
        this.options = options;
        this.createOptionElements();
    }

    createOptionElements() {
        this.selector = document.createElement("select");
        for(var i = 0; i < this.options.length; i++) {
            let currentOptionElement = document.createElement("option");
            currentOptionElement.value = i + "," + this.options[i].id;
            //^incorperates index and ID into the value
            currentOptionElement.innerHTML = this.options[i].title;
            if(this.options[i].content==null) {
                this.options[i].content = {};
            }
            this.options[i].content.element = currentOptionElement;
            this.selector.appendChild(currentOptionElement);
        }
    }

    getSelected() {
        let currentIndex = this.selector.options[this.selector.selectedIndex].value.split(",")[0];
        return this.options[currentIndex];
    }
}

export class Option {
    id;
    title;
    content;
    constructor(id, title, content){
        this.id = id;
        this.title = title;
        this.content = content;
    }
}

export const timeSelectorList = function() {
    let timeSelectorArray = [];
    timeSelectorArray[0] = new Option(0, "12:00 AM", {time: "00:00"});
    for(var i = 1; i < 24; i++){

        if(i < 12) {
        if(i<10) {
            timeSelectorArray[i] = new Option(i, i + ":00 AM", {time: "0" + i+":00"});
        } else{
            timeSelectorArray[i] = new Option(i, i + ":00 AM", {time: i+":00"});
        }

        } else{
        if(i != 12){
            timeSelectorArray[i] = new Option(i, i-12 + ":00 PM", {time: i+":00"});
        }
        }
        
    }
    timeSelectorArray[12] = new Option(i, "12:00 PM", {time: "12:00"});
    return timeSelectorArray;
}();