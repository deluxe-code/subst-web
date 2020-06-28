class ScheduleItem {
    drugTitle;
    scheduledTime;
    taken;
    timeTook;
    element;
    constructor(drugTitle, scheduledTime) {
        this.drugTitle = drugTitle;
        this.scheduledTime = scheduledTime;
        this.createElement();
    }

    createElement() {
        let mainContainer = document.createElement("div");
        let drugTitle = document.createElement("h1");
        let scheduledTime = document.createElement("h2");
        drugTitle.innerHTML = this.drugTitle;
        scheduledTime.innerHTML = this.scheduledTime;
        mainContainer.appendChild(drugTitle);
        mainContainer.appendChild(scheduledTime);
        mainContainer.className = "dose";
        this.element = mainContainer;
        return mainContainer;
    }
}
var scheduledItems = [];
scheduledItems[0] = new ScheduleItem("Kratom", "8:30PM");
scheduledItems[1] = new ScheduleItem("Krokodile", "8:30PM");
scheduledItems[2] = new ScheduleItem("Krokodile", "8:30PM");
window.addEventListener('load', (event) => { loadScheduledItems() });
function loadScheduledItems() {
    this.scheduledItems.forEach(element => {
        document.getElementById("bottomSection").appendChild(element.element);
    });
    document.getElementById("bottomSection").appendChild
}