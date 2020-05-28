import { cards_config, TextAreaCard, SubstancePickerCard } from "./modules/cards.js";
import { drugs_directory } from "./modules/local_database.js";
import { CustomElement, SelectedItemBar } from "./modules/elements.js";
cards_config.setDefaultContainer("#body");
// cards_config.autoPlace = true;



let newTextCard = new TextAreaCard({
    id: "doseInfo_input",
    label: "Dose Information",
    location: "default",
    content: {
        placeholder: "Yo yo this is a placeholder"
    }
});
setTimeout(newTextCard.getOutput, 1000);

// NOTE: To get output from newTextCard, simply call
//       newTextCard.getOutput();

// newTextCard.getEventHandler().listenFor("change", function(event) {
//     console.log(event);
// });

let pickerCard = new SubstancePickerCard({
    id: "substances_container",
    label: "Substances",
    content: {
        substances: drugs_directory
    }
})
let pickerEvents = pickerCard.events;
pickerEvents.listenFor("select", (event) => {
    let drugName = (event.body.value).replace('drug_','');
    let card = pickerCard.card_layout;
    pickerCard.hide();
    setTimeout(() => {
        
        let chosenDrug_bar = new SelectedItemBar(drugName, pickerCard);
        chosenDrug_bar.place("#s10e");
        
    }, 650);

    let chosenDrug = document.createElement("div");
    chosenDrug.innerHTML = event.body.location;
    card.appendChild(chosenDrug);
    
    console.log("ACTION MADE: User has made a " + event.type + " event, they selected " + event.body.value)
});







