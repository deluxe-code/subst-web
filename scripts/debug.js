import { Card, card_presets } from "./modules/cards.js";
import { drugs_directory } from "./modules/local_database.js";

let extraInfo_card = new Card({
    id: "addInfo_input",
    label: "Additional description",
    preset: card_presets.textInput,
    content: {
        placeholder: "Type yo extra info here"
    }
}).listenFor("change", function(event) {
    console.log("ACTION MADE: User has made a " + event.getType() + " event, value of " + event.getValue());
})/* TODO: .getActivityOutputExtractor() */;

// This was breaking because I was asking for the output as soon as 
// the page loaded, which is unrealistic for a text input anyways
// setTimeout(() => {
//     console.log(extraInfo_card.getContent());
// }, 1000);


// NOTE: What is the importance of the id parameter sent through?
// could it be removed/replaced in a way that doesn't allow for
// confusion between the preset id vs the new card config id
let pickerCard = new Card({
    id: "substances_container",
    label: "Substances",
    preset: card_presets.substance_picker,
    content: {
        substances: drugs_directory
    }
}).listenFor("select", function(event) {
    console.log("ACTION MADE: User has made a " + event.getType() + " event, they selected " + event.getValue())
});


// .attachHook(function(selected_drug) {
//     console.log("SUBSTANCE SELECTED: " + selected_drug.id);
//     // For the add_dose page's version of the substance picker,
//     // should I hide the entire card then make some sort of 
//     // aspect of the module or new module which has the
//     // "_____ DRUG SELECTED", which lets you then proceed with adding
//     // a new dose

// });






