import {PopUp} from "../elements/pop_up.js"; 
export class Timer {
    startTime;
    name;
    updateFrequency = 10;//how many times per second time is updated
    constructor(name, startTime = Date.now(), appended = false) {
        this.startTime = startTime;
        this.name = name;
        if(!appended) this.appendToStorage("timers", JSON.stringify(this));  
    }
    generateCard() {
        let card = document.createElement('div');
        let title = document.createElement('h1');
        let time = document.createElement('h2');
        title.innerHTML = this.name;
        card.appendChild(title);
        card.appendChild(time);
        setInterval(()=>{this.liveUpdateTime(time)}, 1000/this.updateFrequency);
        card.className = "timerCard";
        title.className = "timerCardText";
        time.className = "timerCardText";
        return card;
    }

    liveUpdateTime(timeElement) {
        let timePassed = Date.now() - this.startTime;
        timeElement.innerHTML = Math.floor((((timePassed)/1000)/60)/60) + ":" + Math.floor(((timePassed)/1000)/60)%60 +":" + Math.floor((timePassed)/1000)%60 + "." + timePassed%1000;
    }

    appendToStorage(name, data){
        let old = JSON.parse(localStorage.getItem(name));
        if(old === null) old = [];
        old.push(data);
        localStorage.setItem(name, JSON.stringify(old));
    }
}