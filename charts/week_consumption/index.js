window.onload = function () {
    let max = 0;
    const format = 'dd HH:mm:ss';
    const startTime = moment(result[0].data[0].time);
    const endTime = moment(result[0].data[result[0].data.length - 1].time);
    const ctx = document.getElementById('canvas').getContext('2d');
    const config = {
        type: 'line',
        data: {
            labels: result[0].data.map(item => moment(item.time).format(format)),
            datasets: result.map((user, index) => ({
                label: `HH${index + 1}`,
                backgroundColor: Object.keys(window.chartColors)[index],
                borderColor: Object.keys(window.chartColors)[index],
                data: user.data.map(item => {
                    if (item.value > max) max = item.value;
                    return item.value
                }),
                fill: false,
                pointBackgroundColor: 'rgba(0,0,0,0)',
                pointBorderColor: 'rgba(0,0,0,0)',
                borderWidth: 2,
            })),
        },
        options: {
            responsive: true,
            title: {
                fontSize: 25,
                display: true,
                text: 'One week of load for five households (15min frequency)'
            },
            tooltips: {
                enabled: false,
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        fontSize: 20,
                        display: true,
                        labelString: `Day (${startTime.format('dd.MMMM yyyy')}, ${startTime.format(format)} - ${endTime.format(format)} CET)`,
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
                        labelString: 'W (average power over 15 minutes)'
                    },
                    ticks: {
                        min: 0,
                        fontSize: 14,
                        stepSize: 1000,
                    }
                }]
            }
        }
    };
    window.myLine = new Chart(ctx, config);
};