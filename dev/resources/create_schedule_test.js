import { Schedule, ScheduleElement, scheduleKey } from "../../modules/schedule.js";
import { ElementDragger } from "../../modules/element_dragger.js";
import { PopUp, StrungPopUps } from "../../modules/pop_ups.js";
import * as Cards from "../../modules/cards.js";
import { OptionSelectorConfig } from "../../modules/OptionSelector.js"
function openPopup() {

    let popUps = createPopUps();

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

function createPopUps() {
  let graphPageBody = createGraphBody();
  return [
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
      label: "Time Selection"
    })
  ];
}
let scheduledTimes = ["Sunday 6:30 AM - 5 Grams", "Monday 6:30 AM - 5 Grams"];
let scheduledTimesDisplay = document.createElement("div");
function createGraphBody(){
  let graphBody = document.createElement("div");
  updateTimesDisplay();
  graphBody.appendChild(scheduledTimesDisplay);
  return graphBody;
}

function updateTimesDisplay() {
  let scheduledTimeElements = [];
  for(var i = 0; i < scheduledTimes.length; i++) {
    let scheduledTimeElement = document.createElement("h2");
    scheduledTimeElement.innerHTML = rearangeDateString(scheduledTimes[i]);
    scheduledTimeElement.style.borderBottom = "2px solid #C9C9C9";
    scheduledTimeElement.style.fontSize = "1em";
    scheduledTimeElement.style.paddingLeft = "20px";
    scheduledTimeElement.style.paddingRight = "20px";
    scheduledTimeElement.style.paddingBottom = "5px";
    scheduledTimeElement.style.width = "50%";
    scheduledTimeElement.style.marginLeft ="auto";
    scheduledTimeElement.style.marginRight = "auto";
    scheduledTimesDisplay.appendChild(scheduledTimeElement);
  }
}

function rearangeDateString(dateString) {
  return dateString;
}
openPopup();