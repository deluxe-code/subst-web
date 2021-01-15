import {Styles} from "../tools/style_manager.js" 
export class PopUp {
    element;
    body;
    label;
    recipe;
    container;
    height = 325;
    openedBackgroundElementStyles = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.33)",
        zIndex: "2"

    }
    closedBackgroundElementStyles = {
        display: "none"
    }
    mainStyles = {
        display: "inline-block",
        backgroundColor: "white",
        width: "95%",
        height: this.height+"px",
        borderRadius: "20px",
        boxSizing: "border-box",
        paddingTop: "5px",
        padding: "25px"
    }
    childStyles = {
        width: "100%",
        height: ()=>{
            let childStylesHeightOffset = this.height/2;
            return (this.height - childStylesHeightOffset)/(this.recipe.length) + "px";
        }
    }
    labelStyles = {
        textAlign: "center"
    }
    constructor(recipe, label, container=document.body) {
        this.recipe = recipe;
        this.childStyles.height = this.childStyles.height();
        if(Array.isArray(recipe)) {
            this.body = document.createElement("div");
            recipe.forEach(element => {
                let PopUpChild = element;
                Styles.assign(this.childStyles, PopUpChild);
                this.body.appendChild(PopUpChild);
            });
        } else {
            this.body = recipe;
        }
        this.label = label;
        this.element = this.createElement();
        this.container = container;
        container.appendChild(this.element);
    }

    open() {
        Styles.assign(this.openedBackgroundElementStyles, this.element);
    }
    close() {//make sure tapping outside of pop-up closes it, and have button to click
        Styles.assign(this.closedBackgroundElementStyles, this.element);
    }

    createElement() {
        let backgroundElement = document.createElement("div");
            Styles.assign(this.closedBackgroundElementStyles, backgroundElement);
            backgroundElement.addEventListener("click", (e)=>{
                if(e.target == backgroundElement){ //because click activates regardless of whether or not we click the children, we check if the thing we clicked on was the background
                    this.close();
                }
            });
        let mainElement = document.createElement("div");
            backgroundElement.appendChild(mainElement);
            Styles.assign(this.mainStyles, mainElement);
        let label = document.createElement("h1");
            label.innerHTML = this.label;
            mainElement.appendChild(label);
            Styles.assign(this.labelStyles, label);
            //mainElement.appendChild(this.body);
        mainElement.appendChild(this.body);
        return backgroundElement;
    }
    
}