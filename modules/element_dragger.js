export class ElementDragger {

    restrictX;
    restrictY;
    elementToDrag;
    allowSimultaneousAxesDrag = false;
    dragThreshold = {
        x: 20,
        y: 75
    }
    previousFingerPosition = {
        x: 0,
        y: 0
    };;
    currentFingerPosition = {
        x: 0,
        y: 0
    };;
    currentRelativeFingerPosition;
    distanceMoved = {
        x: 0,
        y: 0
    }
    touchOrigin = {
        x: 0,
        y: 0
    };
    initialRelativePositionValues;
    releaseFunction;
    defaultTouchAction;
    currentReferenceFrame = {
        x: 0,
        y: 0
    }
    constructor(dragger_config) {
        this.elementToDrag = dragger_config.elementToDrag;
        this.restrictX = (dragger_config.restrictX || false);
        this.restrictY = (dragger_config.restrictY || false);
        this.elementToDrag.addEventListener("touchstart", e => {this.initializeTouch(e)}, { passive: true });
        this.elementToDrag.addEventListener("touchmove", e => {this.move(e)}, { passive: true });
        this.elementToDrag.addEventListener("touchend", e => {this.release(e)}, { passive: true });
        this.releaseFunction = dragger_config.releaseFunction || function(){};
    }

    initializeTouch(e) {
        this.defaultTouchAction = document.documentElement.style.touchAction;
        document.documentElement.style.touchAction = "none";
        this.initialRelativePositionValues = {
            top: parseInt(this.elementToDrag.style.top, 10) || 0,
            left: parseInt(this.elementToDrag.style.left, 10) || 0
        }

        this.touchOrigin = {
            y: e.touches[0].clientY,
            x: e.touches[0].clientX
        }
        this.distanceMoved = {
            x: 0,
            y: 0
        }
        this.currentFingerPosition = this.touchOrigin;
    }
    move(e) {
        this.currentFingerPosition = {
            y: e.touches[0].clientY,
            x: e.touches[0].clientX
        }
        if(this.draggableX && !this.allowSimultaneousAxesDrag) {
            this.draggableY = false;
        } else if(!this.draggableY && (this.touchDistance().y>this.dragThreshold.y || this.touchDistance().y<-this.dragThreshold.y)) {
            this.draggableY = true;
        }

        if(this.draggableY && !this.allowSimultaneousAxesDrag) {
            this.draggableX = false;
        } else if(!this.draggableX && (this.touchDistance().x>this.dragThreshold.x || this.touchDistance().x<-this.dragThreshold.x)) {
            this.draggableX = true;
        }
        this.currentRelativeFingerPosition = this.getRelativeFingerPosition(this.currentFingerPosition);
        if(!this.restrictY && this.draggableY){
            this.elementToDrag.style.top = this.currentRelativeFingerPosition.y;
            this.distanceMoved.y = this.currentRelativeFingerPosition.y;
        }
        if(!this.restrictX && this.draggableX){
            this.elementToDrag.style.left = this.currentRelativeFingerPosition.x;
            this.distanceMoved = this.touchDistance();
        }
    }

    release(e) {
        this.draggableX = false;
        this.draggableY = false;
        document.documentElement.style.touchAction = this.defaultTouchAction;
        this.releaseFunction(e);
    }

    getRelativeFingerPosition() {
        let currentRelativeFingerPosition = {
            y:  this.initialRelativePositionValues.top + (this.currentFingerPosition.y - this.touchOrigin.y),
            x:  this.initialRelativePositionValues.left + (this.currentFingerPosition.x - this.touchOrigin.x)
        };
        return currentRelativeFingerPosition;
    }
    getVelocity() {

    }
    snapToOrigin(){

    }
    touchDistance() {
        let currentRelativeFingerPosition = {
            y:  this.currentFingerPosition.y - this.touchOrigin.y,
            x:  this.currentFingerPosition.x - this.touchOrigin.x
        };
        return currentRelativeFingerPosition;
    }
    snapBetweenPositions(threshold, defaultPosition, newPosition, axis) {
        if(axis=="x"){
            if(this.touchDistance().x < this.dragThreshold.x+threshold) {
                this.smoothTranslate(this.elementToDrag, {x: defaultPosition, y: 0}, 0.5);
            } else{
                this.smoothTranslate(this.elementToDrag, {x: newPosition, y: 0}, 0.5);
            }
        } else{
            if(this.touchDistance().y < this.dragThreshold.y+threshold) {

            } else{

            }
        }
    }
    snapOnInterval(threshold = 50, defaultPosition = 0, interval, axis, minReferenceFrame = 0, maxReferenceFrame = 1) {
        if(axis=="x"){
            if(this.distanceMoved.x < -(this.dragThreshold.x+threshold) && this.currentReferenceFrame.x < maxReferenceFrame){
                this.currentReferenceFrame.x++;
            } else if(this.distanceMoved.x > this.dragThreshold.x+threshold && this.currentReferenceFrame.x > minReferenceFrame){
                this.currentReferenceFrame.x--;
            }
        } else{
            if(this.distanceMoved.y < this.dragThreshold.y+threshold) {

            } else{

            }
        }
        console.log(this.currentReferenceFrame.x);
        this.smoothTranslate(this.elementToDrag, {x: interval*-this.currentReferenceFrame.x, y: 0}, 0.5);
    }
    smoothTranslate(element, position, fadeTime) {
        let xPos;
        let yPos;
        if(this.restrictY) {
            yPos = 0;
        } else {
            yPos = position.y - element.offsetTop;
        }
        if(this.restrictX) {
            xPos = position.x - element.offsetLeft;
        } else {
            xPos = position.x - element.offsetLeft;
        }
        element.style.transform = "translate(" + (xPos) +"px, " + (yPos) + "px)";

        element.style.transition = "transform " + fadeTime + "s";
    }
}