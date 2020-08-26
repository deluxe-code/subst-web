const daysInAWeek = 7;
export class ScheduleChart {
    canv = document.createElement("canvas");
    chart;
    dateRange = {
        startDate: "2001-05-22",
        endDate: "2001-07-30"
    }
    doseRange = {
        startDose: 5,
        endDose: 2,
        unit: "g"
    }
    allDates = this.calculateDates();
    points = this.calculateDefaultPoints();
    currentlySelectedPoint = -1;
    constructor() {
        this.canv.id="scheduleChart";
        this.chart = this.createChart();
        //this.chart = new Chart(this.canv, chartConfig);
        this.setupEventListeners();
    }

    setupEventListeners() {
        let fingerOrigin = {};
        let fingerPos = {};

        this.canv.addEventListener("touchstart", (ev) =>{
            fingerPos = {
                x: ev.touches[0].clientX,
                y: ev.touches[0].clientY
            }
            fingerOrigin = fingerPos;
        });

        this.canv.addEventListener("touchmove", (ev) =>{
            fingerPos = {
                x: ev.touches[0].clientX,
                y: ev.touches[0].clientY
            }
            if(this.currentlySelectedPoint!=-1) {
                this.points[this.currentlySelectedPoint] = -((fingerPos.y-this.canv.offsetHeight)/33);
                console.log(this.canv.offsetHeight);
            }
            this.updatePoints();
        });

        this.canv.addEventListener("touchend", (ev) =>{
            this.currentlySelectedPoint = -1;
        });
    }
    getElement() {
        return this.canv;
    }

    placeElement(destinationElement) {
        destinationElement.appendChild(this.getElement());
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
                    pointHitRadius: 15
                }]
            },
        
            // Configuration options go here
            options: {
                tooltips: {
                    enabled: false,
                    custom: (tooltip) => {
                        if(tooltip.dataPoints != null) {
                            this.currentlySelectedPoint = tooltip.dataPoints[0].index;
                        }
                    }
                }
            }
        });
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
}