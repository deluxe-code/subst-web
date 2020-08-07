export class ElementDragger {

    restrictX;
    restrictY;
    elementToDrag;
    allowSimultaneousAxesDrag = false;
    dragThreshold = {
        x: 0,
        y: 0
    };
    previousFingerPosition = {
        x: 0,
        y: 0
    };
    currentFingerPosition = {
        x: 0,
        y: 0
    };
    currentRelativeFingerPosition = {
        x: 0,
        y: 0
    };
    currentRelativeScrollPosition = {
        x: 0,
        y: 0
    };
    distanceMoved = {
        x: 0,
        y: 0
    };
    touchOrigin = {
        x: 0,
        y: 0
    };
    initialRelativePositionValues;
    movementFunction;
    releaseFunction;
    defaultTouchAction;
    currentReferenceFrame = {
        x: 0,
        y: 0
    }
    fadeTime = 0.5;
    constructor(dragger_config) {
        this.elementToDrag = dragger_config.elementToDrag;
        this.restrictX = (dragger_config.restrictX || false);
        this.restrictY = (dragger_config.restrictY || false);
        this.elementToDrag.addEventListener("touchstart", e => {this.initializeTouch(e)}, { passive: true });
        this.elementToDrag.addEventListener("touchmove", e => {this.move(e)}, { passive: true });
        this.elementToDrag.addEventListener("touchend", e => {this.release(e)}, { passive: true });
        this.releaseFunction = dragger_config.releaseFunction || function(){};
        this.movementFunction = dragger_config.movementFunction || function() {}
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
        this.elementToDrag.style.transition = "";
    }
    move(e) {
        this.currentFingerPosition = {
            y: e.touches[0].clientY,
            x: e.touches[0].clientX
        }
        if(ElementDragger.draggableX && !this.allowSimultaneousAxesDrag) {
            ElementDragger.draggableY = false;
        } else if(!ElementDragger.draggableY && (this.touchDistance().y>this.dragThreshold.y || this.touchDistance().y<-this.dragThreshold.y)) {
            ElementDragger.draggableY = true;
        }

        if(ElementDragger.draggableY && !this.allowSimultaneousAxesDrag) {
            ElementDragger.draggableX = false;
        } else if(!ElementDragger.draggableX && (this.touchDistance().x>this.dragThreshold.x || this.touchDistance().x<-this.dragThreshold.x)) {
            ElementDragger.draggableX = true;
        }
        this.currentRelativeFingerPosition = this.getRelativeFingerPosition(this.currentFingerPosition);
        if(!this.restrictY && ElementDragger.draggableY || !this.restrictX && ElementDragger.draggableX){
            let dragPosition = {
                x: 0,
                y: 0
            }
            if(!this.restrictY && ElementDragger.draggableY){
                dragPosition.y = this.currentRelativeFingerPosition.y;
            }
            if(!this.restrictX && ElementDragger.draggableX){
                dragPosition.x = this.currentRelativeFingerPosition.x;
            }
            this.smoothTranslate(dragPosition, 0);
            this.distanceMoved = this.touchDistance();
            this.movementFunction();
        }
    }

    release(e) {
        let previousDraggableState = {
            x: ElementDragger.draggableX,
            y: ElementDragger.draggableY
        }
        ElementDragger.draggableX = false;
        ElementDragger.draggableY = false;
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
                this.smoothTranslate({x: defaultPosition, y: 0}, this.fadeTime);
            } else{
                this.smoothTranslate({x: newPosition, y: 0}, this.fadeTime);
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
            this.smoothTranslate({x: interval*-this.currentReferenceFrame.x, y: 0}, this.fadeTime);
        } else{
            if(this.distanceMoved.y < -(this.dragThreshold.y+threshold) && this.currentReferenceFrame.y < maxReferenceFrame) {
                this.currentReferenceFrame.y++;
                //this.currentReferenceFrame.y = Math.floor(this.distanceMoved.y/interval);
                console.log(this.currentReferenceFrame.y);
            } else if(this.distanceMoved.y > this.dragThreshold.y+threshold && this.currentReferenceFrame.y > minReferenceFrame){
                //this.currentReferenceFrame.y = Math.floor(this.distanceMoved.y/interval)-1;
                this.currentReferenceFrame.y--;
            }
            //this.currentReferenceFrame.y = Math.floor(this.distanceMoved.y/interval);
            this.smoothTranslate({x: 0, y: interval*this.currentReferenceFrame.y}, this.fadeTime);
        }
        
    }

    snapToNearestInterval(threshold = 50, defaultPosition = 0, interval, axis, minReferenceFrame = 0, maxReferenceFrame = 1) {
        if(this.distanceMoved.x !=0 || this.distanceMoved.y !=0){
            if(axis=="x"){
                if(this.distanceMoved.x < -(this.dragThreshold.x+threshold) && this.currentReferenceFrame.x < maxReferenceFrame){
                    this.currentReferenceFrame.x++;
                } else if(this.distanceMoved.x > this.dragThreshold.x+threshold && this.currentReferenceFrame.x > minReferenceFrame){
                    this.currentReferenceFrame.x--;
                }
                this.smoothTranslate({x: interval*-this.currentReferenceFrame.x, y: 0}, this.fadeTime);
            } else{
                if(this.distanceMoved.y < -(this.dragThreshold.y+threshold) && this.currentReferenceFrame.y+Math.floor(this.distanceMoved.y/interval) < maxReferenceFrame) {
                    this.currentReferenceFrame.y += Math.ceil(this.distanceMoved.y/interval);
                } else if(this.distanceMoved.y > this.dragThreshold.y+threshold && this.currentReferenceFrame.y+Math.floor(this.distanceMoved.y/interval)+1 > minReferenceFrame){
                    this.currentReferenceFrame.y += Math.floor(this.distanceMoved.y/interval);
                } else if(this.currentReferenceFrame.y+Math.floor(this.distanceMoved.y/interval) < maxReferenceFrame){
                    this.currentReferenceFrame.y = minReferenceFrame;
                } else {
                    this.currentReferenceFrame.y = maxReferenceFrame;
                }
                let position = {x: 0, y: interval*this.currentReferenceFrame.y};
                this.currentRelativeScrollPosition = position;
                this.smoothTranslate(position, this.fadeTime);
            }
        }
        
    }
    smoothTranslate(position, fadeTime) {
        let xPos = 0;
        let yPos = 0;
        if(this.restrictY) {
            yPos = 0;
        } else {
            yPos = position.y;
        }
        if(this.restrictX) {
            xPos = position.x;
        } else {
            xPos = position.x;
        }
        this.elementToDrag.style.top = yPos;
        this.elementToDrag.style.left = xPos;
        this.elementToDrag.style.transition = "top " + fadeTime + "s, " + "left " + fadeTime + "s";
    }
}