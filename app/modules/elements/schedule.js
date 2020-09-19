export const scheduleKey = "mySchedule";
export const ScheduleStorage = {
    storeLocal: function(schedule) {
        if(!ScheduleStorage.hasSchedule(schedule)){
            let tempStorage = JSON.parse(localStorage.getItem("schedules"));
            tempStorage.push(schedule);
            localStorage.schedules = JSON.stringify(tempStorage);
            console.log(localStorage.schedules);
        }
    },
    storeCloud: null,
    getSchedulesString: function(){
        if(localStorage.schedules==null || localStorage.schedules == "") {
            localStorage.schedules = JSON.stringify([""]);
        }
        return localStorage.getItem("schedules");
    },
    getStoredLocal: function() {
        return JSON.parse(ScheduleStorage.getSchedulesString());
    },
    getStoredCloud: null,
    hasSchedule: function(schedule) {
        schedule = JSON.stringify(schedule);
        if(ScheduleStorage.getSchedulesString().includes(schedule)){
            window.alert("This schedule already exists!");
            return true;
        } else {
            return false;
        }
    }

};
export class Schedule{
    drugName;
    startDate;
    endDate;
    startDose;
    endDose;
    curveType;
    doseTimes;//doseTimes stores the day of the week and the time for each dose.
    doseDateAndTimes;//doseDateAndTimes stores the exact dates and times of each dose.
    
    constructor(obj) {
        this.drugName = obj.drugName;
        this.startDate = obj.startDate;
        this.endDate = obj.endDate;
        this.startDose = obj.startDose;
        this.endDose = obj.endDose;
        this.curveType = obj.curveType;
        this.doseTimes = obj.doseTimes;
    }

    calculateDoseDateAndTimes() {
        
    }
}

export class DoseElement {
    schedule;
    constructor(schedule) {
        this.schedule = schedule;
        this.createElement();
    }

    createElement() {
        let mainContainer = document.createElement("div");
        let drugNameTitle = document.createElement("h1");
        let scheduledTime = document.createElement("h2");
        drugNameTitle.innerHTML = this.schedule.drugName;
        scheduledTime.innerHTML = this.calculateTime();
        mainContainer.appendChild(drugNameTitle);
        mainContainer.appendChild(scheduledTime);
        mainContainer.className = "dose";
        this.element = mainContainer;
        return mainContainer;
    }

    calculateTime() {
        this.schedule
    }
}