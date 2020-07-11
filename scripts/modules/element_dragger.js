export class ElementDragger {

    restrictX;
    restrictY;
    elementToDrag;
    previousFingerPosition;
    currentFingerPosition;
    currentRelativeFingerPosition;
    touchOrigin;
    initialRelativePositionValues;
    releaseFunction;
    constructor(dragger_config) {
        this.elementToDrag = dragger_config.elementToDrag;
        this.restrictX = (dragger_config.restrictX || false);
        this.restrictY = (dragger_config.restrictY || false);
        this.elementToDrag.addEventListener("touchstart", e => {this.initializeTouch(e)});
        this.elementToDrag.addEventListener("touchmove", e => {this.move(e)});
        this.elementToDrag.addEventListener("touchend", e => {this.releaseFunction(e)});
        this.releaseFunction = dragger_config.releaseFunction || function(){};
    }

    initializeTouch(e) {
        this.initialRelativePositionValues = {
            top: parseInt(this.elementToDrag.style.top, 10) || 0,
            left: parseInt(this.elementToDrag.style.left, 10) || 0
        }

        this.touchOrigin = {
            y: e.touches[0].clientY,
            x: e.touches[0].clientX
        }
    }
    move(e) {
        this.currentFingerPosition = {
            y: e.touches[0].clientY,
            x: e.touches[0].clientX
        }
        this.currentRelativeFingerPosition = this.getRelativeFingerPosition(this.currentFingerPosition);
        if(!this.restrictY)this.elementToDrag.style.top = this.currentRelativeFingerPosition.y;
        if(!this.restrictX)this.elementToDrag.style.left = this.currentRelativeFingerPosition.x;
    }

    release() {
        this.releaseFunction;
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
}