
import {ScheduleChart} from "./schedule_chart.js";

window.addEventListener('load', (event) => {
    startTest();
});
function startTest() {
    let myChart = new ScheduleChart();
    myChart.placeElement(document.getElementById("chartLocationTest"));
}