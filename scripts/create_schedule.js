import { Selector, OptionSelectorConfig } from "./modules/OptionSelector.js";
import { Schedule, scheduleKey } from "./modules/schedule.js";
let curveTypeOptions = ["linear", "exponential", "logarithmic"];
let doseOptions = ["5 Grams", "4 Grams", "9,999+ Grams", "9,999+ Grams", "100+ Grams", "999+ Grams", "2 Grams", "0.0000001 Grams"];
let OSConfig = new OptionSelectorConfig({
    backgroundColor: "#EDEDED",
    boxShadow: "5px 5px grey"
});
let startDoseSelector = new Selector([doseOptions, OSConfig, true]);
let endDoseSelector = new Selector([doseOptions, OSConfig, true]);
let curveTypeSelector = new Selector([curveTypeOptions, OSConfig]);
window.addEventListener('load', () => {
    document.getElementById("curveTypeSelector").appendChild(curveTypeSelector.getElement());
    document.getElementById("startDoseSelector").appendChild(startDoseSelector.getElement());
    document.getElementById("endDoseSelector").appendChild(endDoseSelector.getElement());
    curveTypeSelector.initialize();
    startDoseSelector.initialize();
    endDoseSelector.initialize();
});
document.getElementById("submitButton").addEventListener('click', submitSchedule);
function submitSchedule() {
    let drugName = document.getElementById("drugName").value;
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;
    let startDose = startDoseSelector.getSelected();
    let endDose = endDoseSelector.getSelected();
    let curveType = curveTypeSelector.getSelected();
    let schedule = {
        drugName: drugName,
        startDate: startDate,
        endDate: endDate,
        startDose: startDose,
        endDose: endDose,
        curveType: curveType
    }
    let scheduleIndex = 0;
    while((scheduleKey + scheduleIndex) in localStorage){
        scheduleIndex++;
    }
    let submission = new Schedule(schedule);
    if(!(() => {
        let hasValue = false;
        for(var i = 0; i < localStorage.length; i++){
            if(JSON.stringify(submission) === localStorage.getItem(localStorage.key(i))) {
                hasValue = true;
            }
        }
        return hasValue;
    })()){
        localStorage.setItem(scheduleKey+scheduleIndex, JSON.stringify(submission));
        window.alert("This is a temporary alert. Your schedule has been created.");
    } else {
        window.alert("This schedule has already been created.");
    }
    //submit to database and PWA local storage instead. This method is just for testing.
}