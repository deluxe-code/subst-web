import { Schedule, ScheduleElement, scheduleKey } from "../../../app/modules/elements/schedule.js";
import { ScheduleChart } from "./schedule_chart.js";
import { ElementDragger } from "../../../app/modules/tools/element_dragger.js";
import { Styles } from "../../../app/modules/tools/style_manager.js";
import { PopUp, StrungPopUps } from "../../../app/modules/elements/pop_ups.js";
import * as Cards from "../../../app/modules/elements/cards.js";
import { OptionSelectorConfig, OptionSelectorNode, timeSelectorList } from "../../../app/modules/elements/option_selector.js";
let timesPageElements;
let selectTimeCardElementStyles = {
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
let addTimeButtonStyles = {
  height: "50px",
  width: "100px",
  marginLeft: "auto",
  marginRight: "auto",
  display: "block"
}
let addTimeSectionStyles = {
  display: "none"
}
let submitTimeButtonStyles = {
  height: "50px",
  width: "100px",
  marginLeft: "auto",
  marginRight: "auto",
  display: "block"
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
  timesPageElements = createTimesPageContent();
  let timesPageBody = timesPageElements.element;
  let scheduleGraph = new ScheduleGraph();
  calculateTimes();
  return [
    new PopUp({
      card: new Cards.OptionSelectorCard({
        id: "strainSelector",
        label: "Select a drug",
        content: {
            options: [new OptionSelectorNode("Weed", "weed"), new OptionSelectorNode("Kratom", "kratom"), new OptionSelectorNode("Cocaine", "cocaine"), new OptionSelectorNode("Heroin", "heroin"), new OptionSelectorNode("Lexapro", "lexapro")],
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
            options: [new OptionSelectorNode("1g","1gram"), new OptionSelectorNode("2g","2gram"), 
            new OptionSelectorNode("3g","3gram"), new OptionSelectorNode("4g","4gram"), new OptionSelectorNode("5g","5gram")],
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
            options: [new OptionSelectorNode("1g","1gram"), new OptionSelectorNode("2g","2gram"), 
            new OptionSelectorNode("3g","3gram"), new OptionSelectorNode("4g","4gram"), new OptionSelectorNode("5g","5gram")],
            styles: new OptionSelectorConfig(),
            hasAddButton: true
        }
      }), 
      container: document.getElementById("popUpBox"),
      label: "END DOSE"
    }),
    new PopUp({
      body: timesPageBody,
      container: document.getElementById("popUpBox"),
      label: "Time Selection"
    }),
    new PopUp({
      body: scheduleGraph.elements.mainContainer,
      container: document.getElementById("popUpBox"),
      label: "Graph"
    })
  ];
}

let scheduledTimes = [];
let scheduledTimesDisplay = document.createElement("div");

function createTimesPageContent(){
  let openFunction = function(elem) {
    if(elem.style.display=="block"){
      elem.style.display = "none";
    } else{
      elem.style.display = "block";
    }
  };

  let timesPageContent = document.createElement("div");
  let addTimeButton = document.createElement("button");
  addTimeButton.innerHTML = "Add Time"; 
  let addTimeSection = document.createElement("div");
  let selectTimeButton = document.createElement("button");
  selectTimeButton.innerHTML = "Select a time▼"
  let selectTimeCard = new Cards.OptionSelectorCard({
    id: "timeSelector",
    label: "Select a Time",
    content: {
        options: timeSelectorList,
        styles: new OptionSelectorConfig(),
        hasAddButton: true
    }
  });
  let selectTimeCardElement = selectTimeCard.card;
  let selectDayButton = document.createElement("button");
  selectDayButton.innerHTML = "Select a day▼"
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
    let dayNames = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    for(var i = 0; i < dayNames.length; i++) {
      labels[i] = document.createElement("label");
      labels[i].innerHTML = dayNames[i].substring(0,1).toUpperCase();
      Styles.assign(daySelectionCheckmarkLabelStyles, labels[i]);
      daySelectionElements[i] = document.createElement("input");
      daySelectionElements[i].type = "checkbox";
      daySelectionElements[i].name = dayNames[i];
      formElement.appendChild(labels[i]);
      formElement.appendChild(daySelectionElements[i]);
      Styles.assign(daySelectionCheckmarkStyles, daySelectionElements[i]);
    }
    myBody.appendChild(formElement);
    return myBody;
  }();
  let submitTimesButton = document.createElement("button");
  submitTimesButton.innerHTML = "Submit";
  Styles.assign(addTimeButtonStyles, addTimeButton);
  Styles.assign(selectTimeButtonStyles, selectTimeButton);
  Styles.assign(selectTimeCardElementStyles, selectTimeCardElement);
  Styles.assign(selectDayButtonStyles, selectDayButton);
  Styles.assign(daySelectionStyles, daySelection);
  Styles.assign(addTimeSectionStyles, addTimeSection);
  Styles.assign(submitTimeButtonStyles, submitTimesButton);
  selectTimeButton.addEventListener("click", () => {openFunction(selectTimeCardElement)});
  selectDayButton.addEventListener("click", () => {openFunction(daySelection)});
  addTimeButton.addEventListener("click", () => {addTimeSection.style.display = "block"; addTimeButton.style.display = "none";});
  submitTimesButton.addEventListener("click", () => {addTimeSection.style.display = "none"; addTimeButton.style.display = "block"; calculateTimes();});
  updateTimesDisplay();
  timesPageContent.appendChild(scheduledTimesDisplay);
  timesPageContent.appendChild(addTimeButton);
  timesPageContent.appendChild(addTimeSection);
  addTimeSection.appendChild(selectTimeButton);
  addTimeSection.appendChild(selectTimeCardElement);
  addTimeSection.appendChild(selectDayButton);
  addTimeSection.appendChild(daySelection);
  addTimeSection.appendChild(submitTimesButton);
  return {
    element: timesPageContent,
    timeSelectionCard: selectTimeCard,
    daySelection: daySelection
  };
}

function calculateTimes() {

  let unformattedTime = timesPageElements.timeSelectionCard.optionSelector.getSelected().content.time;
  let unformattedDays = function(){
    let allCheckboxes = Array.from(timesPageElements.daySelection.getElementsByTagName("input"));
    let checkedBoxes = [];
    console.log(allCheckboxes.length);
    allCheckboxes.forEach(element => {
      if(element.checked){
        checkedBoxes.push(element);
      }
    });
    console.log(checkedBoxes.length);
    return checkedBoxes;
    
  }();
  console.log(unformattedDays.length);
  for(var i = 0; i < unformattedDays.length; i++) {
    
    addTimes(unformattedDays[i].name.substring(0,1).toUpperCase() + unformattedDays[i].name.substring(1) + ", " + unformattedTime);
  }

}

function addTimes(dayTime) {
  if(!scheduledTimes.includes(dayTime)) {
    scheduledTimes.push(dayTime);
  }
  updateTimesDisplay();
}
function updateTimesDisplay() {
  scheduledTimesDisplay.innerHTML = "";
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

class ScheduleGraph {
  mainContainerStyles = {
    border: "2px solid black",
    borderRadius: "10px",
    backgroundColor: "#313131",
    color: "white",
    padding: "10px",
    width: "80%",
    height: "50%",
    margin: "auto"
  }
  elements = this.createElements();
  points = [];//should be comprised of objects holding the x, y, and connection function type
  constructor() {
  }
  createElements(){
    let mainContainer = document.createElement("div");
    let label = document.createElement("h1");
    let graph = new ScheduleChart();
    let presetSelector = graph.presetSelector.getElement();
    let presetSelectorContainer = document.createElement('div');
    presetSelectorContainer.appendChild(presetSelector);
    presetSelectorContainer.style.marginTop = "20px";
    presetSelectorContainer.style.backgroundColor = "313131";
    presetSelectorContainer.style.height = "20%";
    presetSelectorContainer.style.position = "relative";
    presetSelectorContainer.style.display = "block";
    mainContainer.appendChild(label);
    graph.placeElement(mainContainer);
    mainContainer.appendChild(presetSelectorContainer);
    Styles.assign(this.mainContainerStyles, mainContainer);
    return {
      mainContainer: mainContainer,
      label: label,
      graph: graph,
      presetSelector: presetSelector
    }
  }
}
openPopup();