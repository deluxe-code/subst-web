import { Selector, OptionSelectorConfig } from "./modules/OptionSelector.js";
let curveTypeOptions = ["linear", "exponential", "logarithmic"];
let doseOptions = ["5 Grams", "4 Grams", "9,999+ Grams"];
let OSConfig = new OptionSelectorConfig({
    backgroundColor: "#EDEDED",
    boxShadow: "5px 5px grey"
});
let curveTypeSelector = new Selector([curveTypeOptions, OSConfig]);
let startDoseSelector = new Selector([doseOptions, OSConfig]);
let endDoseSelector = new Selector([doseOptions, OSConfig]);
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
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;
    let startDose = startDoseSelector.getSelected();
    let endDose = endDoseSelector.getSelected();
    let curveType = curveTypeSelector.getSelected();
    let submission = {
        startDate,
        endDate,
        startDose,
        endDose,
        curveType
    }
    console.log(submission);
}