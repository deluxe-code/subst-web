import { Schedule, ScheduleElement, scheduleKey } from "../../../app/modules/elements/schedule.js";
import { ElementDragger } from "../../../app/modules/tools/element_dragger.js";
import { Styles } from "../../../app/modules/tools/style_manager.js";
import { PopUp, StrungPopUps } from "../../../app/modules/elements/pop_ups.js";
import * as Cards from "../../../app/modules/elements/cards.js";
import { OptionSelectorConfig } from "../../../app/modules/elements/option_selector.js";
let selectTimeCardStyles = {
  height: "50%",
  width: "85%",
  marginRight: "auto",
  marginLeft: "auto",
  marginTop: "0px",
  backgroundColor: "#313131",
  display: "none",
  transition: "display 2s"
}
let scheduledTimeElementStyles = {
  borderBottom: "2px solid #C9C9C9",
  fontSize: "1em",
  paddingLeft: "20px",
  paddingRight: "20px",
  paddingBottom: "5px",
  width: "50%",
  marginLeft:"auto",
  marginRight: "auto",

}
let selectTimeButtonStyles = {
  width:"90%",
  height: "50px",
  marginRight: "auto",
  marginLeft: "auto",
  display: "block",
  marginTop: "50px"
}

let selectDayButtonStyles = {
  width:"90%",
  height: "50px",
  marginRight: "auto",
  marginLeft: "auto",
  display: "block",
  marginTop: "5px"
}
let daySelectionStyles = {
  height: "50px",
  width: "85%",
  marginRight: "auto",
  marginLeft: "auto",
  marginTop: "0px",
  backgroundColor: "#313131",
  display: "none",
  transition: "display 2s"
}
let daySelectionCheckmarkStyles = {
  flex: "1"
}
let daySelectionCheckmarkLabelStyles = {
  color: "white"
}
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
  let openFunction = function(cardElement) {
    if(cardElement.style.display=="block"){
      cardElement.style.display = "none";
    } else{
      cardElement.style.display = "block";
    }
  };

  let graphBody = document.createElement("div");
  let selectTimeButton = document.createElement("button");
  let selectTimeCard = new Cards.OptionSelectorCard({
      id: "timeSelector",
      label: "Select a Time",
      content: {
          options: ["7:00 AM", "8:00 AM", "9AM", "10AM", "11Am"],
          styles: new OptionSelectorConfig(),
          hasAddButton: true
      }
  }).card;
  let selectDayButton = document.createElement("button");
  let daySelection = function() {
    let myBody = document.createElement("div");
    let formElement = document.createElement("form");
    let formStyles = {
      width: "100%",
      display: "flex"
    }
    Styles.assign(formStyles, formElement);
    let daySelectionElements = [];
    let labels = [];
    let dayNames = ["M", "T", "W", "Th", "F", "S", "S"];
    for(var i = 0; i < dayNames.length; i++) {
      labels[i] = document.createElement("label");
      labels[i].innerHTML = dayNames[i];
      Styles.assign(daySelectionCheckmarkLabelStyles, labels[i])
      daySelectionElements[i] = document.createElement("input");
      daySelectionElements[i].type = "checkbox";
      formElement.appendChild(labels[i]);
      formElement.appendChild(daySelectionElements[i]);
      Styles.assign(daySelectionCheckmarkStyles, daySelectionElements[i]);
    }
    myBody.appendChild(formElement);
    return myBody;
  }();
  Styles.assign(selectTimeButtonStyles, selectTimeButton);
  Styles.assign(selectTimeCardStyles, selectTimeCard);
  Styles.assign(selectDayButtonStyles, selectDayButton);
  Styles.assign(daySelectionStyles, daySelection);
  selectTimeButton.addEventListener("click", () => {openFunction(selectTimeCard)});
  selectDayButton.addEventListener("click", () => {openFunction(daySelection)});
  updateTimesDisplay();
  graphBody.appendChild(scheduledTimesDisplay);
  graphBody.appendChild(selectTimeButton);
  graphBody.appendChild(selectTimeCard);
  graphBody.appendChild(selectDayButton);
  graphBody.appendChild(daySelection);
  return graphBody;
}
function updateTimesDisplay() {
  let scheduledTimeElements = [];
  for(var i = 0; i < scheduledTimes.length; i++) {
    let scheduledTimeElement = document.createElement("h2");
    scheduledTimeElement.innerHTML = rearangeDateString(scheduledTimes[i]);
    Styles.assign(scheduledTimeElementStyles, scheduledTimeElement);
    scheduledTimesDisplay.appendChild(scheduledTimeElement);
  }
}

function rearangeDateString(dateString) {
  return dateString;
}
openPopup();