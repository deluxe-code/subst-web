import { Schedule, ScheduleElement } from "../../modules/schedule.js";
import { PopUp, StrungPopUps } from "../../modules/pop_ups.js";
import * as Cards from "../../modules/cards.js";
import { OptionSelectorConfig } from "../../modules/OptionSelector.js"
function openPopup() {

    let popUps = [
        new PopUp(new Cards.OptionSelectorCard({
            id: "strainSelector",
            label: "Select a drug",
            content: {
                options: ["Weed", "Kratom", "Cocaine", "Heroin", "Lexapro"],
                styles: new OptionSelectorConfig(),
                hasAddButton: false
            }
        }), document.getElementById("popUpBox")),
        new PopUp(new Cards.InputCard({
            content: {
              type: "date",
              placeholder: "custom placeholder"
            },
          }), document.getElementById("popUpBox")),
        new PopUp(new Cards.InputCard({
            content: {
              type: "date",
              placeholder: "custom placeholder"
            },
          }), document.getElementById("popUpBox")),
        new PopUp(new Cards.InputCard({
            content: {
              type: "date",
              placeholder: "custom placeholder"
            },
          }), document.getElementById("popUpBox")),
        new PopUp(new Cards.InputCard({
            content: {
              type: "date",
              placeholder: "custom placeholder"
            },
          }), document.getElementById("popUpBox")),
        new PopUp(new Cards.InputCard({
            content: {
              type: "date",
              placeholder: "custom placeholder"
            },
          }), document.getElementById("popUpBox")),
        new PopUp(new Cards.InputCard({
            content: {
              type: "date",
              placeholder: "custom placeholder"
            },
          }), document.getElementById("popUpBox"))
    ];

    for(var i = 0; i < popUps.length; i++) {
      let card = popUps[i].card;
      card.card.style.backgroundColor = "#313131";
      if(card.getLabel()) {
        card.card.childNodes[0].style.color = "white";
        card.card.childNodes[0].width = "50%";
        card.card.childNodes[0].height = "50%";
      }
    }
    console.log(document.getElementById("popUpBox"));
    let strungPopUps = new StrungPopUps(document.getElementById("popUpBox"), popUps);
    strungPopUps.open();
}
openPopup();