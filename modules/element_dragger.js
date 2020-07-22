export class ElementDragger {

    restrictX;
    restrictY;
    elementToDrag;
    dragThreshold = 50;
    previousFingerPosition= {
        y: 0,
        x: 0
    };;
    currentFingerPosition= {
        y: 0,
        x: 0
    };;
    currentRelativeFingerPosition;
    touchOrigin = {
        y: 0,
        x: 0
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
        this.currentFingerPosition = this.touchOrigin;
    }
    move(e) {

        this.currentFingerPosition = {
            y: e.touches[0].clientY,
            x: e.touches[0].clientX
        }
        if(!this.draggableY && (this.touchDistance().y>this.dragThreshold || this.touchDistance().y<-this.dragThreshold)) {
            this.draggableY = true;
        }
        if(!this.draggableX && (this.touchDistance().x>this.dragThreshold || this.touchDistance().x<-this.dragThreshold)) {
            this.draggableX = true;
        }
        this.currentRelativeFingerPosition = this.getRelativeFingerPosition(this.currentFingerPosition);
        if(!this.restrictY && this.draggableY)this.elementToDrag.style.top = this.currentRelativeFingerPosition.y;
        if(!this.restrictX && this.draggableX)this.elementToDrag.style.left = this.currentRelativeFingerPosition.x;
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
        console.log(this.touchOrigin.x);
        console.log(this.currentFingerPosition.x)
        let currentRelativeFingerPosition = {
            y:  this.currentFingerPosition.y - this.touchOrigin.y,
            x:  this.currentFingerPosition.x - this.touchOrigin.x
        };
        return currentRelativeFingerPosition;
    }
    snapBetweenPositions(threshold, defaultPosition, newPosition, axis) {
        if(axis=="x"){
            if(this.touchDistance().x < this.dragThreshold+threshold) {
                this.smoothTranslate(this.elementToDrag, {x: defaultPosition, y: 0}, 0.5);
            } else{
                this.smoothTranslate(this.elementToDrag, {x: newPosition, y: 0}, 0.5);
            }
        } else{
            if(this.touchDistance().y < this.dragThreshold+threshold) {

            } else{

            }
        }
    }
    snapOnInterval(threshold = 50, defaultPosition = 0, interval, axis, minReferenceFrame = 0, maxReferenceFrame = 1) {
        if(axis=="x"){
            if(this.touchDistance().x < -(this.dragThreshold+threshold) && this.currentReferenceFrame.x < maxReferenceFrame){
                this.currentReferenceFrame.x++;
            } else if(this.touchDistance().x > this.dragThreshold+threshold && this.currentReferenceFrame.x > minReferenceFrame){
                this.currentReferenceFrame.x--;
            }
        } else{
            if(this.touchDistance().y < this.dragThreshold+threshold) {

            } else{

            }
        }
        this.smoothTranslate(this.elementToDrag, {x: interval*-this.currentReferenceFrame.x, y: 0}, 0.5);
    }
    smoothTranslate(element, position, fadeTime) {
        element.style.transform = "translate(" + (position.x - element.offsetLeft) +"px, " + (position.y - element.offsetTop) + "px)";
        element.style.transition = "transform " + fadeTime + "s";
    }
}