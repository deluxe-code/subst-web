import {PopUp} from "../modules/elements/pop_up.js"; 
import {Timer} from "../modules/tools/timer.js"; 

window.addEventListener('load', ()=> {
    let timers = JSON.parse(localStorage.getItem("timers"));
    timers.forEach(timerString => {
        let timerInfo = JSON.parse(timerString);
        let timer = new Timer(timerInfo.name, timerInfo.startTime, true);
        document.body.appendChild(timer.generateCard());
    });
    
});

document.getElementById('addTimerButton').addEventListener('click', () => {
    let nameInput = document.createElement('input');
    let submitButton = document.createElement('button');
    nameInput.type = "text";
    submitButton.type = "button";
    submitButton.innerHTML = "Add Timer";
    let timerInfo = new PopUp([nameInput, submitButton], "Do Something", document.body);
    timerInfo.open();
    submitButton.addEventListener('click', ()=> {
        let timer = new Timer(nameInput.value);
        document.body.appendChild(timer.generateCard());
        timerInfo.close();
    });
    
});

