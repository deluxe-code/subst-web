export const scheduleKey = "mySchedule";
export const ScheduleStorage = {
    storeLocal: function(schedule) {
        if(localStorage.schedules = "") {
            localStorage.schedules = JSON.stringify([]);
        }
        let tempStorage = JSON.parse(localStorage.getItem("schedules"));
        tempStorage.push(schedule);
        localStorage.schedules = JSON.stringify(tempStorage);
        console.log(localStorage.schedules);
    },
    storeCloud: null,
    getStoredLocal: function() {},
    getStoredCloud: null

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

export class ScheduleElement {
    drugName;
    scheduledTime;
    taken;
    timeTook;
    element;
    constructor(obj) {
        this.drugName = obj.drugName;
        this.scheduledTime = obj.scheduledTime;
        this.createElement();
    }

    createElement() {
        let mainContainer = document.createElement("div");
        let drugNameTitle = document.createElement("h1");
        let scheduledTime = document.createElement("h2");
        drugNameTitle.innerHTML = this.drugName;
        scheduledTime.innerHTML = this.scheduledTime;
        mainContainer.appendChild(drugNameTitle);
        mainContainer.appendChild(scheduledTime);
        mainContainer.className = "dose";
        this.element = mainContainer;
        return mainContainer;
    }
}