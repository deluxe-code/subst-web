import {Selector, Option, timeSelectorList} from "../modules/elements/option_selector.js";
import {Styles} from "../modules/tools/style_manager.js"
import { Schedule, scheduleKey, ScheduleStorage, Schedules } from "../modules/elements/schedule.js";
import { FormSection, FormSectionSwiper } from "../modules/elements/form_section_swiper.js";
import { PopUp } from "../modules/elements/pop_up.js";
let swiperPagesContainer;
let formPages = [];
let StrungPopUpObject;
let timesDisplay;
let timesArray = [];
let submitButton;
let bodyStyles = {
    backgroundColor: "#EEF0F1",
    borderTopRightRadius: "30px",
    borderTopLeftRadius: "30px",
    height: "calc(100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
}
let formStyles = {
    width: "80%",
    height: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    paddingTop: "35px"
}
let generalInputStyles = {
    width: "100%",
    height: "40px",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "15px",
    borderRadius: "20px",
    fontSize: "1.5em",
    border: "none",
    paddingLeft: "20px"
}
let submitButtonStyles = {
    width: "50%",
    height: "40px"
}
//Starting point
window.addEventListener('load', () => {
    swiperPagesContainer = document.getElementById("swiperPagesContainer");
    submitButton = (()=> {
        let button = document.createElement('button');
        button.addEventListener('click', ()=> {
            sendSchedule();
        });
        button.innerHTML = "Submit Schedule";
        return button;
    })();
    createForm1();
    createForm2();
    StrungPopUpObject = new FormSectionSwiper(swiperPagesContainer,formPages);
});
function createForm1() {
    let bodyElements = [];
    let form = document.createElement("form");
        Styles.assign(formStyles, form);
        bodyElements.push(form);
    let drugName = new Selector([new Option("d","Drug Name"),new Option("d","test1"),new Option("d","test2")]);//change to new search selector
        Styles.assign(generalInputStyles, drugName.selector);
        form.appendChild(drugName.selector);
        drugName.selector.id = "drugName";
    let startDate = document.createElement("input");
        startDate.type = "date";
        Styles.assign(generalInputStyles, startDate);
        form.appendChild(startDate);
        startDate.id = "startDate";
    let endDate = document.createElement("input");
        endDate.type = "date";
        Styles.assign(generalInputStyles, endDate);
        form.appendChild(endDate);
        endDate.id = "endDate";
    let startDose = document.createElement("input");
        startDose.placeholder = "Start Dose";
        startDose.type = "number";
        Styles.assign(generalInputStyles, startDose);
        startDose.style.width = "45%";
        //overwriting width assigned by 'Styles'
        form.appendChild(startDose);
        startDose.id = "startDose";
    let endDose = document.createElement("input");
        Styles.assign(generalInputStyles, endDose);
        endDose.placeholder = "End Dose";
        endDose.style.float = "right";
        endDose.style.width = "45%";
        //overwriting width assigned by 'Styles'
        form.appendChild(endDose);
        endDose.id = "endDose";
    let unitType = new Selector([new Option("d","Unit Type"), new Option("d","Grams"), new Option("d","Kilos")]);//change to new search selector
        Styles.assign(generalInputStyles, unitType.selector);
        endDose.style.width = "45%";
        //overwriting width assigned by 'Styles'
        form.appendChild(unitType.selector);
        unitType.selector.id = "unitType";
    let popUpConfig = {
        container: swiperPagesContainer,
        bodyElements: bodyElements
    }

    formPages.push(new FormSection(popUpConfig));
    //swiperPagesContainer.appendChild(form);
}

function createForm2() {
    let bodyElements = [];
        //Styles.assign(bodyStyles, body);
    timesDisplay = document.createElement("div");
    bodyElements.push(timesDisplay);
    let daySelector = new Selector([new Option("2", "M"),
            new Option("3", "T"),new Option("4", "W"),
            new Option("5", "Th"),new Option("6", "F"),
            new Option("7", "Sat"),new Option("1", "Sun")])
            daySelector.selector.multiple = "multiple";
    
    let filterDuplicates = (obj) => {
        let newList = [];
        console.log(obj);
        obj.days.forEach(dayToAdd =>{
            let duplicateFound = false;
            timesArray.forEach(storedTimeObj => {
                console.log(storedTimeObj.time);
                if(storedTimeObj.time.id != obj.time.id) {
                    duplicateFound = false;
                } else {
                    storedTimeObj.days.forEach(storedDay =>{
                        console.log(dayToAdd.id + ", " + storedDay.id);
                        if(dayToAdd.id==storedDay.id) {
                            duplicateFound = true;
                        }
                    });
                }
            });
            if(!duplicateFound) {
                newList.push(dayToAdd);
            }
        });
        console.log(obj.time.title);
        return {time: obj.time, days: newList};
    }
    
    let popUpChildrenObjects = {
        timeSelector: new Selector(timeSelectorList),
        daySelector: daySelector,
        submitButton: () => {
            let button = document.createElement("button");
            button.addEventListener('click', () => {
                
                let timeObj = filterDuplicates({
                    time: popUpChildrenObjects.timeSelector.getSelected(), 
                    days: popUpChildrenObjects.daySelector.getSelected()
                });
                console.log(timeObj);
                //if() {
                    timesArray.push(timeObj);
                //}
                timeSubmitionPopup.close();
                refreshTimesDisplay();
            });
            return button;
        }

    }
    popUpChildrenObjects.timeSelector.multiple = null;
    let popupContent = [popUpChildrenObjects.timeSelector.selector, popUpChildrenObjects.daySelector.selector, popUpChildrenObjects.submitButton()];
    let timeSubmitionPopup = new PopUp(popupContent, "Do Something", document.body);
    let addButton = document.createElement("button");
        let addButtonStyles = {
            width: "50%",
            height: "100px"
        }
        Styles.assign(addButtonStyles, addButton);
        addButton.addEventListener('click', () => {
            timeSubmitionPopup.open();
        });
        bodyElements.push(addButton);
        bodyElements.push(submitButton);
    Styles.assign(submitButtonStyles, submitButton);
    let FormConfig = {
        container: swiperPagesContainer,
        bodyElements: bodyElements
    }
    formPages.push(new FormSection(FormConfig));
    
    
}

function refreshTimesDisplay() {
    timesDisplay.innerHTML = "";
    timesArray.forEach(dayTime => {
        dayTime.days.forEach(day => {
            let element = document.createElement("p");
            element.innerHTML = dayTime.time.title + ", " + day.title;
            timesDisplay.appendChild(element);
        });
    });
}

let sendSchedule = () => {
    console.log(timesArray);
    let info = {
        drugName: document.getElementById("drugName").value,
        startDate: new Date(document.getElementById("startDate").value),
        endDate: new Date(document.getElementById("endDate").value),
        startDose: document.getElementById("startDose").value,
        endDose: document.getElementById("endDose").value,
        weeklyTimes: timesArray
      }
      console.log(info);
      let schedule = new Schedule(info);
      ScheduleStorage.storeLocal(schedule);
}