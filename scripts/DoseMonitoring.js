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
var swiped = false;
const swipeTriggerDistance = 150;
scheduledItems[0] = new ScheduleItem("Kratom", "8:30PM");
scheduledItems[1] = new ScheduleItem("Krokodile", "8:30PM");
for (var i = 2; i < 15; i++) {
    scheduledItems[i] = new ScheduleItem("Krokodile", "8:30PM");
}
window.addEventListener('load', (event) => { startUp() });
function startUp() {
    let touchOrigin;
    let fingerPos;
    let fingerPosY;
    loadScheduledItems();
    document.getElementById("bottomSection").style.touchAction = "none";
    document.getElementById("bottomSection").addEventListener("touchstart", ev => {
        fingerPos = ev.targetTouches[0];
        fingerPosY = fingerPos.clientY;
        touchOrigin = fingerPosY;
        document.getElementById("bottomSection").style.transition = "transform 0s";
    }, { passive: true });
    document.getElementById("bottomSection").addEventListener("touchmove", ev => {
        if (!swiped) {
            fingerPos = ev.targetTouches[0];
            fingerPosY = fingerPos.clientY;
            dragList(fingerPosY, touchOrigin);
        }
    }, { passive: true });
    document.getElementById("bottomSection").addEventListener("touchend", ev => {
        if (!swiped) {
            if ((fingerPosY - touchOrigin) < -swipeTriggerDistance) {
                document.getElementById("bottomSection").style.transition = "transform 0.6s";
                dragList(-document.getElementById("topSection").offsetHeight, 0);
                document.getElementById("mainSection").style.overflow = "scroll";
                document.getElementById("bottomSection").style.overflow = "scroll";
                document.getElementById("bottomSection").removeEventListener("touchstart", ev => { }, false);
                document.getElementById("bottomSection").removeEventListener("touchmove", ev => { }, false);
                document.getElementById("bottomSection").removeEventListener("touchend", ev => { }, false);
                swiped = true;
            } else {
                document.getElementById("bottomSection").style.transition = "transform 0.6s";
                dragList(0, 0);
            }
        }
    }, { passive: true });
}
function loadScheduledItems() {
    this.scheduledItems.forEach(element => {
        document.getElementById("bottomSection").appendChild(element.element);
    });
    document.getElementById("bottomSection").appendChild
}
function dragList(fingerPos, touchOrigin) {
    relativeFingerPos = fingerPos - document.getElementById("topSection").offsetHeight;
    fingerPosWithRespectToLocalPos = relativeFingerPos - (touchOrigin - document.getElementById("topSection").offsetHeight);
    document.getElementById("bottomSection").style.transform = "translate(0px, " + (fingerPosWithRespectToLocalPos) + "px)";
}