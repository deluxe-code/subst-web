export class PopUp {
    card;
    popUpElement;
    next;
    previous;
    location;
    doneButton;
    constructor(card, next, previous, location) {
        this.card = card;
        this.next = next;
        this.previous = previous;
        this.location = location;
        this.createPopUp();
    }
    open(){
        //change this to layout system when Ethan finishes that. I'm thinking of doing the body replacement method since "fixed position is generally bad for mobile"
        this.location.appendChild(this.popUpElement);
        this.location.style.position = "absolute";
        this.card.card.style.margin = "auto";
        this.location.style.top = (screen.height/2) - this.location.offsetHeight/2;
        this.doneButton.addEventListener('click', () => {
            this.close();
        });
        console.log("opened");
    }
    createPopUp(){
        this.popUpElement = document.createElement("div");
        this.popUpElement.appendChild(this.card.card);
        this.popUpElement.id = "optionSelector-container";
        this.popUpElement.style.backgroundColor = "white";
        this.popUpElement.style.width = "100%";
        this.popUpElement.style.height = "100%";
        this.popUpElement.style.margin = "auto";
        this.doneButton = document.createElement("button");
        this.doneButton.type = "button";
        this.doneButton.innerHTML = "Done";
        this.doneButton.style.width = "100px";
        this.doneButton.style.height = "35px";
        this.doneButton.style.position = "absolute";
        this.doneButton.style.bottom = "20px";
        this.doneButton.style.right = "20px";
        this.popUpElement.appendChild(this.doneButton);
    }
    close() {
        this.location.innerHTML = "";
    }
    next() {
        this.close();
        this.next.open();
    }
    previous() {

    }
    done(){

    }
}