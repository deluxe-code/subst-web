import * as Cards from "./modules/card-module.js";

let CardInstance = Cards.CardInstance;
let cardTypes = Cards.cardTypes;
console.log(CardInstance);

let drugStrainCard = new CardInstance({
    id: "extra_input",
    label: "Additional description",
    type: cardTypes.textInput,
    content: {
        placeholder: "Type yo extra info here"
    }
});



