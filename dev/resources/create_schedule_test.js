import { Schedule, ScheduleElement } from "../../modules/schedule.js";
import { PopUp, StrungPopUps } from "../../modules/pop_ups.js";
import * as Cards from "../../modules/cards.js";
import { OptionSelectorConfig } from "../../modules/OptionSelector.js"
function openPopup() {

    let graphPageBody = document.createElement("div");
    let childtest = document.createElement("p");
    childtest.innerHTML = "fuck";
    graphPageBody.appendChild(childtest);
    let popUps = [
        new PopUp({
          card: new Cards.OptionSelectorCard({
            id: "strainSelector",
            label: "Select a drug",
            content: {
                options: ["Weed", "Kratom", "Cocaine", "Heroin", "Lexapro"],
                styles: new OptionSelectorConfig(),
                hasAddButton: true
            }
          }), 
          container: document.getElementById("popUpBox"),
          label: "DRUG SELECTION"
        }),
        new PopUp({
          card: new Cards.InputCard({
                  content: {
                    type: "date",
                    placeholder: "custom placeholder"
                  },
                }), 
          container: document.getElementById("popUpBox"), 
          label: "START DATE"
        }),
        new PopUp({
          card: new Cards.InputCard({
                  content: {
                    type: "date",
                    placeholder: "custom placeholder"
                  },
                }), 
          container: document.getElementById("popUpBox"), 
          label: "END DATE"
        }),
        new PopUp({
          card: new Cards.OptionSelectorCard({
            id: "strainSelector",
            label: "Select a dose",
            content: {
                options: ["1g", "2g", "3g", "4g", "5g"],
                styles: new OptionSelectorConfig(),
                hasAddButton: true
            }
          }), 
          container: document.getElementById("popUpBox"),
          label: "START DOSE",
        }),
        new PopUp({
          card: new Cards.OptionSelectorCard({
            id: "strainSelector",
            label: "Select a dose",
            content: {
                options: ["1g", "2g", "3g", "4g", "5g"],
                styles: new OptionSelectorConfig(),
                hasAddButton: true
            }
          }), 
          container: document.getElementById("popUpBox"),
          label: "END DOSE"
        }),
        new PopUp({
          body: graphPageBody,
          container: document.getElementById("popUpBox"),
          label: "Haha"
        })
    ];

    for(var i = 0; i < popUps.length; i++) {
      let card = popUps[i].card;
      if(card != null){
        card.card.style.backgroundColor = "#313131";
        if(card.getLabel()) {
          card.card.childNodes[0].style.color = "white";
          card.card.childNodes[0].width = "50%";
          card.card.childNodes[0].height = "50%";
        }
      }
    }
    console.log(document.getElementById("popUpBox"));
    let strungPopUps = new StrungPopUps(document.getElementById("popUpBox"), popUps);
    strungPopUps.open();
}
openPopup();