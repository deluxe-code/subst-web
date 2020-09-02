import * as OptionSelector from "../../../app/modules/elements/option_selector.js";
const daysInAWeek = 7;
export class ScheduleChart {
    canv = document.createElement("canvas");
    chart;
    presetSelector;
    dateRange = {
        startDate: "2001-05-22",
        endDate: "2001-08-07"
    }
    doseRange = {
        startDose: 150,
        endDose: 100,
        unit: "g"
    }
    allDates = this.calculateDates();
    points = this.calculateDefaultPoints();
    currentlySelectedPoint = -1;
    currentPointOrigin = 0;
    moving = false;
    basicGraphFunctions = {
        linear: (x) => {
            let yIntercept = this.doseRange.startDose;
            let slope = (this.doseRange.endDose-yIntercept)/(this.points.length-1);
            return slope*x+yIntercept;
        },
        exponentialDecay: (x) => {
            let stretchAmount = Math.log((this.doseRange.endDose + 1)/(this.doseRange.startDose+1))/this.points.length-1;
            let yIntercept = this.doseRange.startDose;
            return (yIntercept+1)*Math.pow(1.75, stretchAmount*x) -1;
        },
        constant: (x) => {
            return this.findBiggestPoint();
        } 
    }
    constructor() {
        this.canv.id="scheduleChart";
        this.chart = this.createChart();
        this.presetSelector = this.createPresetSelector();
        //this.chart = new Chart(this.canv, chartConfig);
        this.setupEventListeners();
        this.followFunction(this.basicGraphFunctions.linear);
    }

    setupEventListeners() {
        let fingerOrigin = {};
        let fingerPos = {};

        this.canv.addEventListener("touchstart", (ev) =>{
            
            var rect = ev.target.getBoundingClientRect();
            console.log("con: " + (ev.touches[0].clientX - rect.left));
            fingerPos = {
                x: ev.touches[0].clientX - rect.left,
                y: ev.touches[0].clientY - rect.top
            }
            fingerOrigin = fingerPos;
        });

        this.canv.addEventListener("touchmove", (ev) =>{
            this.moving = true;
            var rect = ev.target.getBoundingClientRect();
            console.log("con2: " + (ev.touches[0].clientX - rect.left));
            fingerPos = {
                x: ev.touches[0].clientX - rect.left,
                y: ev.touches[0].clientY - rect.top
            }
            if(this.currentlySelectedPoint!=-1) {
                let estimatedLabelSize = (this.canv.offsetHeight/4.5);
                let graphSize = this.canv.offsetHeight - estimatedLabelSize;
                let pixelsToGraphRatio = (this.findBiggestPoint()-this.findSmallestPoint())/graphSize;
                let pointValue = ((fingerOrigin.y - fingerPos.y) * pixelsToGraphRatio) + this.currentPointOrigin;
                if(this.currentlySelectedPoint != 0 && this.currentlySelectedPoint != this.points.length-1) {
                    if(pointValue>=0) {
                        console.log("point" + pointValue + "big" + this.findBiggestPoint());
                        if(pointValue<=this.findBiggestPoint()) {
                            this.points[this.currentlySelectedPoint] = pointValue;
                        } else {
                            this.points[this.currentlySelectedPoint] = this.findBiggestPoint();
                        }
                    } else {
                        this.points[this.currentlySelectedPoint] = 0;
                    }
                }
                console.log(pointValue);
            }
            this.updatePoints();
        });

        this.canv.addEventListener("touchend", (ev) =>{
            this.currentlySelectedPoint = -1;
            this.moving = false;
        });
    }

    noScroll() {
        window.scrollTo(0, 0);
    }

    getElement() {
        return this.canv;
    }

    placeElement(destinationElement) {
        destinationElement.appendChild(this.getElement());
    }

    createPresetSelector() {
        let presets = [new OptionSelector.OptionSelectorNode("Linear", "linear", {myFunction: this.basicGraphFunctions.linear}),
                       new OptionSelector.OptionSelectorNode("Exponential Decay", "exponentialDecay", {myFunction: this.basicGraphFunctions.exponentialDecay})
                    ];
        let optionSelector = new OptionSelector.Selector([presets, new OptionSelector.OptionSelectorConfig()]);
        return optionSelector;
    }
    createChart() {

        let chart = new Chart(this.canv, {
            // The type of chart we want to create
            type: 'line',
        
            // The data for our dataset
            data: {
                labels: this.allDates,
                datasets: [{
                    label: 'My First dataset',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: this.points,
                    pointRadius: 5,
                    pointHitRadius: 15
                }]
            },
        
            // Configuration options go here
            options: {
                tooltips: {
                    enabled: false,
                    custom: (tooltip) => {
                        if(tooltip.dataPoints != null && !this.moving) {
                            this.currentlySelectedPoint = tooltip.dataPoints[0].index;
                            this.currentPointOrigin = this.points[this.currentlySelectedPoint];
                        }
                    }
                },
                legend: {
                    display: false
                },
                aspectRatio: 1.5,
                maintainAspectRatio: false
            }
        });
        this.canv.style.overflow = "hidden";
        this.canv.style.scroll = "none";

        return chart;
    }

    calculateDates() {
       let startDateObj = new Date(this.dateRange.startDate + "T00:00:00");
       let endDateObj = new Date(this.dateRange.endDate + "T00:00:00");
       let newestDate = new Date(startDateObj.getTime());
       let datesForPoints = [];
       while(newestDate.getTime() <= endDateObj.getTime()) {
           datesForPoints.push(this.formatDate(newestDate.getTime()));
           newestDate = new Date(newestDate.getTime());
           newestDate.setDate(newestDate.getDate() + daysInAWeek);
       }
       return datesForPoints;
    }

    formatDate(date) {
        var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        return [year, month, day].join('-');
    }

    calculateDefaultPoints() {
        let arr = [];
        arr.push(this.doseRange.startDose);
        for(var i = 0; i < this.allDates.length-2; i++) {
            arr.push(0);
        }
        arr.push(this.doseRange.endDose);
        return arr;
    }

    findDateIndex(date) {
        for(var i = 0; i < this.allDates.length; i++) {
            if(date==this.allDates[i]) {
                return i;
            }
        }
    }

    updatePoints() {
        this.chart.data.datasets.forEach((dataset) => {
            dataset.data = this.points;
        });
        console.log(this.points);
        this.chart.update();
    }

    findBiggestPoint() {
        let biggest = 0;
        this.points.forEach(element => {
            if(element > biggest) {
                biggest = element;
            }
        });
        return biggest;
    }

    findSmallestPoint() {
        let smallest = Number.MAX_SAFE_INTEGER;
        this.points.forEach(element => {
            if(element < smallest) {
                smallest = element;
            }
        });
        return smallest;
    }

    followFunction(myFunction) {
        //myFunction should be a function with one argument
        for(var i = 0; i < this.points.length; i++) {
            this.points[i] = myFunction(i);
        }
        this.updatePoints();
    }
}