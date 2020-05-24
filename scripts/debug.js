import { Card, cardType } from "./modules/card-module.js";

let extraInfo_card = new Card({
    id: "addInfo_input",
    label: "Additional description",
    type: cardType.textInput,
    content: {
        placeholder: "Type yo extra info here"
    }
});

let pickerCard = new Card({
    id: "substances_container",
    label: "Substances",
    type: cardType.substance_picker,
    content: {
        items: ["Marijuana", "Kratom"]
    }
});




