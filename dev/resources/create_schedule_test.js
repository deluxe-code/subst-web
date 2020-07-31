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
    console.log(document.getElementById("popUpBox"));
    let strungPopUps = new StrungPopUps(document.getElementById("popUpBox"), popUps);
    strungPopUps.open();
}
openPopup();