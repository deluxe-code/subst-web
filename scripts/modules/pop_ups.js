export class PopUp {
    card;
    next;
    previous;
    location;
    constructor(card, next, previous, location) {
        this.card = card;
        this.next = next;
        this.previous = previous;
        this.location = location;
    }
    open(){
        location.appendChild(this.card.getElement());
        console.log("opened");
    }
    close() {
        location.innerHTML = "";
    }
    next() {

    }
    previous() {

    }
    done(){

    }
}