import { Card, cardType } from "./modules/card-module.js";

let extraInfo_card = new Card({
    id: "addInfo_input",
    label: "Additional description",
    type: cardType.textInput,
    content: {
        placeholder: "Type yo extra info here"
    }
});

// This was breaking because I was asking for the output as soon as 
// the page loaded, which is unrealistic for a text input anyways
setTimeout(() => {
    console.log(extraInfo_card.getOutput());
}, 1000);

let pickerCard = new Card({
    id: "substances_container",
    label: "Substances",
    type: cardType.substance_picker,
    content: {
        items: ["Marijuana", "Kratom"]
    }
});




