import { Schedule, scheduleKey, ScheduleStorage, Schedules } from "../../../app/modules/elements/schedule.js";
import { ScheduleChart } from "./schedule_chart.js";
import { ElementDragger } from "../../../app/modules/tools/element_dragger.js";
import { Styles } from "../../../app/modules/tools/style_manager.js";
import { FormSection, FormSectionSwiper } from "../../../app/modules/elements/form_section_swiper.js";
import * as Cards from "../../../app/modules/elements/cards.js";
import { Selector, Option, timeSelectorList } from "../../../app/modules/elements/option_selector.js";
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
let popUps;
let scheduleInfo = {

}

function openPopup() {

    for(const key in popUps) {
      let card = popUps[key].card;
      if(card != null){
        card.card.style.backgroundColor = "#313131";
        if(card.getLabel()) {
          card.card.childNodes[0].style.color = "white";
          card.card.childNodes[0].width = "50%";
          card.card.childNodes[0].height = "50%";
        }
      }

    }
/*
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
    */
    console.log(document.getElementById("popUpBox"));
    let strungPopUps = new StrungPopUps(document.getElementById("popUpBox"), Object.values(popUps));
    strungPopUps.open();
}

function createPopUps() {
  timesPageElements = createTimesPageContent();
  let timesPageBody = timesPageElements.element;
  let scheduleGraph = new ScheduleGraph();
  calculateTimes();
  let drugs = [new Option("weed", "Weed"), new Option("kratom", "Kratom"), new Option("cocaine", "Cocaine"), new Option("heroin", "Heroin"), new Option("lexapro", "Lexapro")];
  let doseSizes = [new Option("1g","1gram"), new Option("2g","2gram"), new Option("3g","3gram"), new Option("4g","4gram"), new Option("5g","5gram")];
  popUps = {
    drugName: new PageSwiper({
      body: new Selector(drugs).selector,
      container: document.getElementById("popUpBox"),
      label: "Graph"
    }),
    startDate: new PageSwiper({
      card: new Cards.InputCard({
              content: {
                type: "date",
                placeholder: "custom placeholder"
              },
            }), 
      container: document.getElementById("popUpBox"), 
      label: "START DATE"
    }),
    endDate: new PageSwiper({
      card: new Cards.InputCard({
              content: {
                type: "date",
                placeholder: "custom placeholder"
              },
            }), 
      container: document.getElementById("popUpBox"), 
      label: "END DATE"
    }),
    startDose: new PageSwiper({
      body: new Selector(doseSizes).selector,
      container: document.getElementById("popUpBox"),
      label: "START DOSE",
    }),
    endDose: new PageSwiper({
      body: new Selector(doseSizes).selector,
      container: document.getElementById("popUpBox"),
      label: "END DOSE",
    }),
    timeSelection: new PageSwiper({
      body: timesPageBody,
      container: document.getElementById("popUpBox"),
      label: "Time Selection"
    }),
    graph: new PageSwiper({
      body: scheduleGraph.elements.mainContainer,
      container: document.getElementById("popUpBox"),
      label: "Graph"
    })
  };

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
  selectTimeButton.innerHTML = "Select a time▼";
  let timeSelector = new Selector(timeSelectorList);
  let timeSelectorElement = timeSelector.selector;
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
  Styles.assign(selectTimeCardElementStyles, timeSelectorElement);
  Styles.assign(selectDayButtonStyles, selectDayButton);
  Styles.assign(daySelectionStyles, daySelection);
  Styles.assign(addTimeSectionStyles, addTimeSection);
  Styles.assign(submitTimeButtonStyles, submitTimesButton);
  selectTimeButton.addEventListener("click", () => {openFunction(timeSelectorElement)});
  selectDayButton.addEventListener("click", () => {openFunction(daySelection)});
  addTimeButton.addEventListener("click", () => {addTimeSection.style.display = "block"; addTimeButton.style.display = "none";});
  submitTimesButton.addEventListener("click", () => {addTimeSection.style.display = "none"; addTimeButton.style.display = "block"; calculateTimes();});
  updateTimesDisplay();
  timesPageContent.appendChild(scheduledTimesDisplay);
  timesPageContent.appendChild(addTimeButton);
  timesPageContent.appendChild(addTimeSection);
  addTimeSection.appendChild(selectTimeButton);
  addTimeSection.appendChild(timeSelectorElement);
  addTimeSection.appendChild(selectDayButton);
  addTimeSection.appendChild(daySelection);
  addTimeSection.appendChild(submitTimesButton);
  return {
    element: timesPageContent,
    timeSelector: timeSelector,
    daySelection: daySelection
  };
}

function calculateTimes() {

  let unformattedTime = timesPageElements.timeSelector.getSelected().content.time;
  console.log(timesPageElements.timeSelector.getSelected());
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
    addTimes(unformattedTime+"d"+i);//addTimes(unformattedDays[i].name.substring(0,1).toUpperCase() + unformattedDays[i].name.substring(1) + ", " + unformattedTime)
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
  Schedules.formatDay(dateString);
  console.log("test");
  return Schedules.formatDay(dateString);
  
}

function calculateExactDates() {
  let initDate = new Date(popUps.startDate.card.inputElement.value);
  initDate.getDay();
}

function submitSchedule() {
  let info = {
    drugName: popUps.drugName.card.optionSelector.getSelected(),
    startDate: new Date(popUps.startDate.card.inputElement.value),
    endDate: new Date(popUps.endDate.card.inputElement.value),
    startDose: popUps.startDose.card.optionSelector.getSelected(),
    endDose: popUps.endDose.card.optionSelector.getSelected(),
    weeklyTimes: scheduledTimes
  }
  let schedule = new Schedule(info);
  ScheduleStorage.storeLocal(schedule);
};

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
  createElements() {
    let mainContainer = document.createElement("div");
    let label = document.createElement("h1");
    let graph = new ScheduleChart();
    let presetSelector = graph.presetSelector.selector;
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
createPopUps();
openPopup();
ScheduleStorage.storeLocal();
document.addEventListener('keypress', (e) => {submitSchedule()});