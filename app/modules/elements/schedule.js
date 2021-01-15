import {Timer} from "../tools/timer.js"; 
export const scheduleKey = "mySchedule";
const OrderedDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
export const ScheduleStorage = {
    storeLocal: function(schedule) {
        if(schedule!=null) {
            if(localStorage.schedules == null || localStorage.schedules == "") {
                localStorage.schedules = JSON.stringify([]);
            }
            let tempStorage = JSON.parse(localStorage.getItem("schedules"));
            tempStorage.push(schedule);
            localStorage.schedules = JSON.stringify(tempStorage);
        } else {
            window.alert("Schedule is not complete.");
        }
    },
    storeCloud: null,
    getStoredLocal: function() {
        if(localStorage.schedules!=null) {
            return JSON.parse(localStorage.schedules);
        } else {
            return [];
        }
    },
    getStoredCloud: null,
    canStore: function() {
        
    }
};

export const Schedules = {
    
    formatDay: function (weeklyTime){
        let time = weeklyTime.split('d')[0];
        let dayOfWeek = weeklyTime.split('d')[1];
        function capitalize(str) {
            return str.substring(0,1).toUpperCase() + str.substring(1).toLowerCase();
        };
        return capitalize(OrderedDays[dayOfWeek]) + ', ' + time;
    },
    isToday: (someDate) => {
        const today = new Date()
        return someDate.getDate() == today.getDate() &&
          someDate.getMonth() == today.getMonth() &&
          someDate.getFullYear() == today.getFullYear()
      }
};
export class Schedule{
    drugName;
    startDate;
    endDate;
    startDose;
    endDose;
    curveType;
    weeklyTimes;//weeklyTimes stores the day of the week and the time for each dose.
    doseDateAndTimes = [];//doseDateAndTimes stores the exact dates and times of each dose.
    constructor(obj) {
        this.drugName = obj.drugName;
        this.startDate = new Date(obj.startDate);
        this.endDate = new Date(obj.endDate);
        this.startDose = obj.startDose;
        this.endDose = obj.endDose;
        this.curveType = obj.curveType;
        this.weeklyTimes = obj.weeklyTimes;
    }

    calculateDoseDateAndTimes = () => {
        let doseDateAndTimes = [];
        if(this.doseDateAndTimes.length>0) {
            return this.doseDateAndTimes;
        } else {
            for(var i = 0; i < this.weeklyTimes.length; i++) {
                //let day = this.weeklyTimes[i].split("d")[1];
                let days = this.weeklyTimes[i].days;
                let time = this.weeklyTimes[i].time;
                let daysAway = function(day, startDay) {
                    if(day - startDay > 0){
                        return day - (startDay+1)
                    } else if(day - startDay < 0) {
                        return 7 + (day - startDay)
                    } else {
                        return 0
                    }
                };
                
                days.forEach(day => {
                    day = day.id;
                    let nextDate = new Date(this.startDate);
                    nextDate.setDate(nextDate.getDate() + daysAway(day, this.startDate.getDay()));
                
                    nextDate.setHours(time.id);
                    while(nextDate < this.endDate) {
                        
                        doseDateAndTimes.push(nextDate);
                        let prevDate = nextDate;
                        nextDate = new Date(prevDate);
                        nextDate.setDate(prevDate.getDate() + 7)
                        nextDate.setHours(time.id);
                    } 
                });
            }
            this.doseDateAndTimes = doseDateAndTimes;
            return doseDateAndTimes;
        }
    }
    isTodaysDate() {

    }
    getDailyScheduleCards = () => {
        let cards = [];
        for(var i = 0; i < this.calculateDoseDateAndTimes().length; i++) {
            if(Schedules.isToday(this.calculateDoseDateAndTimes()[i])) {
                let scheduleCard = new ScheduleCard(this.drugName,this.doseDateAndTimes[i].toLocaleTimeString('en-US'));
                cards.push(scheduleCard.getElement());
            }

        }
       return cards;
    }

    
}

class ScheduleDoseNode {
    info;
    constructor(info) {
        this.info = info;
    }

    createElement() {
        let mainContainer = document.createElement("div");
        let drugNameTitle = document.createElement("h1");
        let scheduledTime = document.createElement("h2");
        drugNameTitle.innerHTML = info.drugName.text;
        mainContainer.appendChild(drugNameTitle);
        mainContainer.appendChild(scheduledTime);
        mainContainer.className = "dose";
        this.element = mainContainer;
        return mainContainer;
    }
}

class ScheduleCard {
    mainContainer;
    mainCardContainer;
    icon;
    textContainer;
    titleText;
    timeText;
    titleElement;
    timeElement;
    dropdownCard;

    constructor(title, time) {
        this.titleText = title;
        this.timeText = time;
        this.createElement();
        this.mainCardContainer.addEventListener('click', ()=> {
            if(this.dropdownCard.opened) {
                this.dropdownCard.close();
            } else {
                this.dropdownCard.open();
            }
            
        });
    }

    //title and time need to be set before calling.
    createElement() {
        this.mainContainer = document.createElement('div');
        this.mainCardContainer = document.createElement('div');
        this.mainContainer.appendChild(this.mainCardContainer);
        this.icon = null;//blank for now. Will be clock icon.
        this.textContainer = document.createElement('div');
        this.textContainer.className = "scheduleCardTextContainer";
        this.mainCardContainer.appendChild(this.textContainer);
        this.titleElement = document.createElement('h1');
        this.titleElement.className = "scheduleCardText";
        this.time = document.createElement('h1');
        this.time.className = "scheduleCardText";
        this.mainCardContainer.className = "scheduleCard";
        this.titleElement.innerHTML = this.titleText;
        this.time.innerHTML = this.timeText;
        this.textContainer.appendChild(this.titleElement);
        this.textContainer.appendChild(this.time);
        this.dropdownCard = new DropdownCard();
        this.mainContainer.appendChild(this.dropdownCard.getElement());
    }

    getElement() {
        return this.mainContainer;
    }
}

class DropdownCard {
    mainContainer;
    icon;
    bodyContainer;
    timeText;
    timeElement;
    takeButton;
    opened;

    constructor(time) {
        this.timeText = time;
        this.createElement();
        this.close();
    }

    //title and time need to be set before calling.
    createElement() {
        this.mainContainer = document.createElement('div');
        this.icon = null;//blank for now. Will be clock icon.
        this.bodyContainer = document.createElement('div');
        this.bodyContainer.className = "dropdownCardBodyContainer";
        this.mainContainer.appendChild(this.bodyContainer);
        this.takeButton = document.createElement('button');
        this.takeButton.type = "button";
        this.takeButton.className = "takeDoseButton";
        this.takeButton.innerHTML = "Take Dose";
        this.bodyContainer.appendChild(this.takeButton);
        this.mainContainer.className = "dropdownCard";
        this.takeButton.addEventListener('click', ()=> {
            this.showTimer();
        });
    }

    getElement() {
        return this.mainContainer;
    }

    open() {
        this.mainContainer.style.transition = "height 0.3s";
        this.mainContainer.style.height = "";
        console.log("open");
        this.opened = true;
        this.bodyContainer.style.transition = "opacity 0.3s";
        this.bodyContainer.style.opacity = "1";
    }

    close() {
        this.mainContainer.style.transition = "height 0.3s";
        this.mainContainer.style.height = "0%";
        this.opened = false;
        this.bodyContainer.style.transition = "opacity 0.3s";
        this.bodyContainer.style.opacity = "0";
    }

    showTimer() {
        //Don't need a title for the timer
        this.bodyContainer.innerHTML = "";
        let timer = new Timer("Time since taking dose: ");
        this.bodyContainer.appendChild(timer.generateCard());
    }
}