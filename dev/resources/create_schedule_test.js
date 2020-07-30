import { Schedule, ScheduleElement } from "../../modules/schedule.js";
import { PopUp, StrungPopUps } from "../../modules/pop_ups.js";
import { OptionSelectorCard } from "../../modules/cards.js";
import { OptionSelectorConfig } from "../../modules/OptionSelector.js"
document.getElementById("openPopup").addEventListener("click", () => {
    openPopup();
});

function openPopup() {

    let popUps = [
        new PopUp(new OptionSelectorCard({
            id: "strainSelector",
            label: "Pick a strain",
            content: {
                options: ["Super Silver Haze", "Girl Scout Cookies", "Fruity Pebbles", "Vibe Juices", "OG Granny"],
                styles: new OptionSelectorConfig(),
                hasAddButton: false
            }
        }), document.getElementById("popUpBox")),
        new PopUp(new OptionSelectorCard({
            id: "strainSelector",
            label: "Pick a strain",
            content: {
                options: ["Super Silver Haze", "Girl Scout Cookies", "Fruity Pebbles", "Vibe Juices", "OG Granny"],
                styles: new OptionSelectorConfig(),
                hasAddButton: false
            }
        }), document.getElementById("popUpBox")),
        new PopUp(new OptionSelectorCard({
            id: "strainSelector",
            label: "Pick a strain",
            content: {
                options: ["Super Silver Haze", "Girl Scout Cookies", "Fruity Pebbles", "Vibe Juices", "OG Granny"],
                styles: new OptionSelectorConfig(),
                hasAddButton: false
            }
        }), document.getElementById("popUpBox")),
        new PopUp(new OptionSelectorCard({
            id: "strainSelector",
            label: "Pick a strain",
            content: {
                options: ["Super Silver Haze", "Girl Scout Cookies", "Fruity Pebbles", "Vibe Juices", "OG Granny"],
                styles: new OptionSelectorConfig(),
                hasAddButton: false
            }
        }), document.getElementById("popUpBox")),
        new PopUp(new OptionSelectorCard({
            id: "strainSelector",
            label: "Pick a strain",
            content: {
                options: ["Super Silver Haze", "Girl Scout Cookies", "Fruity Pebbles", "Vibe Juices", "OG Granny"],
                styles: new OptionSelectorConfig(),
                hasAddButton: false
            }
        }), document.getElementById("popUpBox")),
        new PopUp(new OptionSelectorCard({
            id: "strainSelector",
            label: "Pick a strain",
            content: {
                options: ["Super Silver Haze", "Girl Scout Cookies", "Fruity Pebbles", "Vibe Juices", "OG Granny"],
                styles: new OptionSelectorConfig(),
                hasAddButton: false
            }
        }), document.getElementById("popUpBox")),
        new PopUp(new OptionSelectorCard({
            id: "strainSelector",
            label: "Pick a strain",
            content: {
                options: ["Super Silver Haze", "Girl Scout Cookies", "Fruity Pebbles", "Vibe Juices", "OG Granny"],
                styles: new OptionSelectorConfig(),
                hasAddButton: false
            }
        }), document.getElementById("popUpBox"))
    ];
    console.log(document.getElementById("popUpBox"));
    let strungPopUps = new StrungPopUps(document.getElementById("popUpBox"), popUps);
    strungPopUps.open();
}