window.onload = function () {
    let max = 0;
    var ctx = document.getElementById('canvas').getContext('2d');
    var config = {
        type: 'line',
        data: {
            labels: result.map(item => item.date),
            datasets: [{
                label: 'Average Daily Consumption',
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                data: result.map(item => {
                    if (item.value > max) max = item.value;
                    return item.value
                }),
                fill: false,
                pointBackgroundColor: 'rgba(0,0,0,0)',
                pointBorderColor: 'rgba(0,0,0,0)',
                pointHoverBackgroundColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            title: {
                fontSize: 25,
                display: true,
                text: 'Average Daily Consumption Amung All Users'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        fontSize: 20,
                        display: true,
                        labelString: 'Date'
                    },
                    ticks: {
                        fontSize: 14,
                    },
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        fontSize: 20,
                        display: true,
                        labelString: 'KwH'
                    },
                    ticks: {
                        min: 0,
                        stepSize: 5,
                        fontSize: 14,
                        max: Math.round(max + max / 5),
                    }
                }]
            }
        }
    };
    window.myLine = new Chart(ctx, config);
};