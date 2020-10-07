import {Selector, Option} from "../modules/elements/option_selector.js";
import {Styles} from "../modules/tools/style_manager.js"
let contentSection;
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
    backgroundColor: "#4C5669",
    color: "white",
    fontSize: "1.5em",
    border: "none",
    paddingLeft: "20px"
}
window.addEventListener('load', () => {
    contentSection = document.getElementById("contentSection");
    createForm1();
    
});
function createForm1() {
    let form = document.createElement("form");
        Styles.assign(formStyles, form);
    let drugName = new Selector([new Option("d","Drug Name"),new Option("d","test1"),new Option("d","test2")]);//change to new search selector
        Styles.assign(generalInputStyles, drugName.selector);
        form.appendChild(drugName.selector);  
    let startDate = document.createElement("input");
        startDate.type = "date";
        Styles.assign(generalInputStyles, startDate);
        form.appendChild(startDate);
    let endDate = document.createElement("input");
        endDate.type = "date";
        Styles.assign(generalInputStyles, endDate);
        form.appendChild(endDate);
    let initialDose = document.createElement("input");
        initialDose.placeholder = "Start Dose";
        initialDose.type = "number";
        Styles.assign(generalInputStyles, initialDose);
        initialDose.style.width = "45%";
        //overwriting width assigned by 'Styles'
        form.appendChild(initialDose);
    let endDose = document.createElement("input");
        Styles.assign(generalInputStyles, endDose);
        endDose.placeholder = "End Dose";
        endDose.style.float = "right";
        endDose.style.width = "45%";
        //overwriting width assigned by 'Styles'
        form.appendChild(endDose);
    let unitType = new Selector([new Option("d","Unit Type"), new Option("d","Grams"), new Option("d","Kilos")]);//change to new search selector
        Styles.assign(generalInputStyles, unitType.selector);
        endDose.style.width = "45%";
        //overwriting width assigned by 'Styles'
        form.appendChild(unitType.selector);
    contentSection.appendChild(form);
}