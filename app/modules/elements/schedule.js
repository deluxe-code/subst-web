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
        console.log(capitalize(OrderedDays[dayOfWeek]) + ', ' + time);
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
        console.log(this.startDate.getDay());
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
            
            let startDay = this.startDate.getDay();
            for(var i = 0; i < this.weeklyTimes.length; i++) {
                let day = this.weeklyTimes[i].split("d")[1];
                let time = {
                    fullTime: this.weeklyTimes[i].split("d")[0],
                    hour: () => {
                        if(this.weeklyTimes[i].split("d")[0].split(":")[0]<12) {
                            return this.weeklyTimes[i].split("d")[0].split(":")[0];
                        } else {
                            return this.weeklyTimes[i].split("d")[0].split(":")[0]-12;
                        }
                    },
                    hourTwelve: () => {
                        return this.weeklyTimes[i].split("d")[0].split(":")[0]
                    },
                    minute: this.weeklyTimes[i].split("d")[0],
                    suffix: () => {
                        if(this.time.split(":")[0]<12) {
                            return "AM";
                        } else {
                            return "PM";
                        }
                    }  
                }
                let daysAway = function() {
                    if(day - startDay > 0){
                        return day - startDay
                    } else if(day - startDay < 0) {
                        return 7 + (day - startDay)
                    } else {
                        return 0
                    }
                }();
                let nextDate = new Date(this.startDate);
                nextDate.setDate(nextDate.getDate() + daysAway);
                nextDate.setHours(time.hourTwelve());
                while(nextDate < this.endDate) {
                    console.log(nextDate);
                    doseDateAndTimes.push(nextDate);
                    let prevDate = nextDate;
                    nextDate = new Date(prevDate);
                    nextDate.setDate(prevDate.getDate() + 7)
                    nextDate.setHours(time.hourTwelve());
                }
            }
            console.log(doseDateAndTimes);
            this.doseDateAndTimes = doseDateAndTimes;
            return doseDateAndTimes;
        }
    }
    
    isTodaysDate() {

    }
    getDailyScheduleCards = () => {
        let cards = [];
        console.log(this.calculateDoseDateAndTimes());
        for(var i = 0; i < this.calculateDoseDateAndTimes().length; i++) {
            if(Schedules.isToday(this.calculateDoseDateAndTimes()[i])) {
                let mainContainer = document.createElement('div');
                let icon = null;//blank for now. Will be clock icon.
                let title = document.createElement('h1');
                title.style.fontSize = "4em";
                let time = document.createElement('h1');
                time.style.fontSize = "4em";
                mainContainer.style.width = "100%";
                mainContainer.style.height = "20%";
                mainContainer.style.backgroundColor = "white";
                title.innerHTML = this.drugName.text;
                time.innerHTML = this.doseDateAndTimes[i].toLocaleTimeString('en-US');
                mainContainer.appendChild(title);
                mainContainer.appendChild(time);
                cards.push(mainContainer);
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