import { Schedule, scheduleKey, ScheduleStorage } from "../modules/elements/schedule.js";
let scheduledItems = [];
var swiped = false;
const swipeTriggerDistance = 150;

for(var i = 0; i < ScheduleStorage.getStoredLocal().length; i++){
    if(localStorage.schedules[i]){
        //push to localstorage objects to schedule items, and make it so scheduledItems can interpret it
        console.log(ScheduleStorage.getStoredLocal()[i]);
        let currentSchedule = new Schedule(ScheduleStorage.getStoredLocal()[i]);
        let currentScheduleCards = currentSchedule.getDailyScheduleCards();
        console.log(currentScheduleCards);
        for(var j = 0; j < currentScheduleCards.length; j++) {
            scheduledItems.push(currentScheduleCards[j]);
        }
    }
}

console.log(scheduledItems);
window.addEventListener('load', (event) => { startUp() });
function startUp() {
    dragList(0, 0, document.getElementById("topSection").offsetHeight, 0);// * This is to set the position to the default position.
    // * For some reason the positioning doesn't work correctly when initialized, even though it looks like it is.
    // * Using this statement as part of initialization fixes the issue.
    let touchOrigin;
    let fingerPos;
    let fingerPosY;
    let thresholdCompensationAmount = 0;
    let isFirstMovementSample;
    loadScheduledItems();
    document.getElementById("bottomSection").style.touchAction = "none";
    document.getElementById("mainSection").style.overflow = "hidden";
    document.getElementById("bottomSection").style.overflow = "hidden";
    document.getElementById("bottomSection").style.touchAction = "none";
    function touchStart(e) {
        isFirstMovementSample = true;
        let hasFingerMoved = false;
        fingerPos = e.targetTouches[0];
        fingerPosY = fingerPos.clientY;
        touchOrigin = fingerPosY + document.getElementById("mainSection").scrollTop;
        document.getElementById("bottomSection").style.transition = "transform 0s";
    }
    function touchMove(e) {
        fingerPos = e.targetTouches[0];
        fingerPosY = fingerPos.clientY;
        if (!swiped) {
            dragList(fingerPosY, touchOrigin, document.getElementById("topSection").offsetHeight, 0);
        } else if (document.getElementById("mainSection").scrollTop == 0 && (fingerPosY >= touchOrigin)) {
            document.getElementById("bottomSection").style.touchAction = "none";
            if (isFirstMovementSample) {
                thresholdCompensationAmount = fingerPosY - touchOrigin;
                isFirstMovementSample = false;
            }
            dragList(fingerPosY - document.getElementById("topSection").offsetHeight - thresholdCompensationAmount, touchOrigin, 0, 0);
            //Find more efficient way to do this^
        }

    }
    function touchEnd(e) {
        if (!swiped) {
            if ((fingerPosY - touchOrigin) < -swipeTriggerDistance) {
                dragList(-document.getElementById("topSection").offsetHeight, 0, document.getElementById("topSection").offsetHeight, 0.6);
                swiped = true;
            } else {
                dragList(0, 0, document.getElementById("topSection").offsetHeight, 0.6);
            }
        } else {
            if (document.getElementById("mainSection").scrollTop == 0) {
                if ((fingerPosY - touchOrigin) > swipeTriggerDistance) {
                    dragList(0, 0, document.getElementById("topSection").offsetHeight, 0.6);
                    swiped = false;
                } else {
                    dragList(-document.getElementById("topSection").offsetHeight, 0, document.getElementById("topSection").offsetHeight, 0.6);
                }
            }
        }
        //second "swiped" if statement in a row. This is because the first one potentially changes the state of swiped.
        if (!swiped) {
            document.getElementById("mainSection").style.overflow = "hidden";
            document.getElementById("bottomSection").style.overflow = "hidden";
            document.getElementById("bottomSection").style.touchAction = "none";
        } else {
            document.getElementById("mainSection").style.overflow = "scroll";
            document.getElementById("bottomSection").style.overflow = "scroll";
            document.getElementById("bottomSection").style.touchAction = "auto";
        }
    }
    //unable to properly detect overscroll because scrollTop doesn't go past 0. 0 is the default state, so things conflict. I need to find either a better way of detecting overscroll or something else.
    document.getElementById("bottomSection").addEventListener("touchend", touchEnd, { passive: true });
    document.getElementById("bottomSection").addEventListener("touchstart", touchStart, { passive: true });
    document.getElementById("bottomSection").addEventListener("touchmove", touchMove, { passive: true });
}
function loadScheduledItems() { 
    scheduledItems.forEach(element => {
        document.getElementById("bottomSection").appendChild(element);
    });
    document.getElementById("bottomSection").appendChild
}
function smoothTranslateY(element, position, transitionTime) {
    element.style.transform = "translate(0px, " + (position) + "px)";
    document.getElementById("bottomSection").style.transition = "transform " + transitionTime + "s";
}
function dragList(fingerPos, touchOrigin, heightOfAboveElements, transitionTime) {
    let relativeFingerPos = fingerPos - heightOfAboveElements;
    let fingerPosWithRespectToLocalPos = relativeFingerPos - (touchOrigin - heightOfAboveElements);
    smoothTranslateY(document.getElementById("bottomSection"), fingerPosWithRespectToLocalPos, transitionTime);
    //document.getElementById("bottomSection").style.transform = "translate(0px, " + (fingerPosWithRespectToLocalPos) + "px)";
    //console.log(fingerPosWithRespectToLocalPos);
}