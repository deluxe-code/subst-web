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
    dragList(0, 0, document.getElementById("topSection").offsetHeight, 0);// * This is to set the position to the default position.
    // * For some reason the positioning doesn't work correctly when initialized, even though it looks like it is.
    // * Using this statement as part of initialization fixes the issue.
    let touchOrigin;
    let fingerPos;
    let fingerPosY;
    let thresholdCompensationAmount = 0;
    let isFirstMove;
    loadScheduledItems();
    document.getElementById("bottomSection").style.touchAction = "none";
    function touchStart(e) {
        isFirstMove = true;
        hasFingerMoved = false;
        fingerPos = e.targetTouches[0];
        fingerPosY = fingerPos.clientY;
        touchOrigin = fingerPosY + document.getElementById("mainSection").scrollTop;
        document.getElementById("bottomSection").style.transition = "transform 0s";
        console.log("~~~~~~~~~newstart~~~~~~~~~~~~~~~~");
    }
    function touchMove(e) {
        fingerPos = e.targetTouches[0];
        fingerPosY = fingerPos.clientY;
        if (!swiped) {
            dragList(fingerPosY, touchOrigin, document.getElementById("topSection").offsetHeight, 0);
        } else if (document.getElementById("mainSection").scrollTop == 0 && (fingerPosY > touchOrigin)) {
            if (isFirstMove) {
                thresholdCompensationAmount = fingerPosY - touchOrigin;
                isFirstMove = false;
            }
            console.log(thresholdCompensationAmount);
            dragList(fingerPosY - document.getElementById("topSection").offsetHeight - thresholdCompensationAmount, touchOrigin, 0, 0);
            document.getElementById("mainSection").style.overflow = "hidden";
            document.getElementById("bottomSection").style.overflow = "hidden";
            document.getElementById("bottomSection").style.touchAction = "none";
            //Find more efficient way to do this^
        }

    }
    function touchEnd(e) {

        if (!swiped) {
            if ((fingerPosY - touchOrigin) < -swipeTriggerDistance) {
                dragList(-document.getElementById("topSection").offsetHeight, 0, document.getElementById("topSection").offsetHeight, 0.6);
                document.getElementById("mainSection").style.overflow = "scroll";
                document.getElementById("bottomSection").style.overflow = "scroll";
                document.getElementById("bottomSection").style.touchAction = "auto";
                swiped = true;
            } else {
                swiped = false;
                dragList(0, 0, document.getElementById("topSection").offsetHeight, 0.6);
            }
        } else {
            if (document.getElementById("mainSection").scrollTop == 0) {
                if ((fingerPosY - touchOrigin) > swipeTriggerDistance) {
                    dragList(0, 0, document.getElementById("topSection").offsetHeight, 0.6);
                    document.getElementById("mainSection").style.overflow = "hidden";
                    document.getElementById("bottomSection").style.overflow = "hidden";
                    document.getElementById("bottomSection").style.touchAction = "none";
                    swiped = false;
                } else {
                    dragList(-document.getElementById("topSection").offsetHeight, 0, document.getElementById("topSection").offsetHeight, 0.6);
                }
            }
        }
    }
    //unable to properly detect overscroll because scrollTop doesn't go past 0. 0 is the default state, so things conflict. I need to find either a better way of detecting overscroll or something else.
    document.getElementById("bottomSection").addEventListener("touchend", touchEnd, { passive: true });
    document.getElementById("bottomSection").addEventListener("touchstart", touchStart, { passive: true });
    document.getElementById("bottomSection").addEventListener("touchmove", touchMove, { passive: true });
}
function loadScheduledItems() {
    this.scheduledItems.forEach(element => {
        document.getElementById("bottomSection").appendChild(element.element);
    });
    document.getElementById("bottomSection").appendChild
}
function smoothTranslateY(element, position, transitionTime) {
    element.style.transform = "translate(0px, " + (position) + "px)";
    document.getElementById("bottomSection").style.transition = "transform " + transitionTime + "s";
}
function dragList(fingerPos, touchOrigin, heightOfAboveElements, transitionTime) {
    relativeFingerPos = fingerPos - heightOfAboveElements;
    fingerPosWithRespectToLocalPos = relativeFingerPos - (touchOrigin - heightOfAboveElements);
    smoothTranslateY(document.getElementById("bottomSection"), fingerPosWithRespectToLocalPos, transitionTime);
    //document.getElementById("bottomSection").style.transform = "translate(0px, " + (fingerPosWithRespectToLocalPos) + "px)";
    //console.log(fingerPosWithRespectToLocalPos);
}