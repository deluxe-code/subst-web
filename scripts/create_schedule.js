import { Selector, OptionSelectorConfig } from "./modules/OptionSelector.js";
let curveTypeOptions = ["linear", "exponential", "logarithmic"];
let OSConfig = new OptionSelectorConfig({
    backgroundColor: "#EDEDED",
    boxShadow: "5px 5px grey"
});
let curveTypeSelector = new Selector([curveTypeOptions, OSConfig]);
window.addEventListener('load', () => {
    document.getElementById("curveTypeSelector").appendChild(curveTypeSelector.getElement());
    curveTypeSelector.initialize();
});