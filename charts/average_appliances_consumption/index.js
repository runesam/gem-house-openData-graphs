window.onload = function () {
    let max = 0;
    const format = 'DD. MMM yyyy';
    const ctx = document.getElementById('canvas').getContext('2d');
    const maxLengthAppliance = Object.keys(result).reduce((acc, item, index) => {
        if (!acc || result[item].length > result[acc].length) acc = item;
        return acc;
    }, '');
    const config = {
        type: 'line',
        data: {
            labels: result[maxLengthAppliance].map(item => moment(item.date).format(format)),
            datasets: Object.keys(result).map((appliance, index) => ({
                label: appliance,
                backgroundColor: Object.keys(window.chartColors)[index],
                borderColor: Object.keys(window.chartColors)[index],
                data: result[appliance].map(data => {
                    if (data.value > max) max = data.value;
                    return data.value;
                }),
                fill: false,
                pointBackgroundColor: 'rgba(0,0,0,0)',
                pointBorderColor: 'rgba(0,0,0,0)',
                pointHoverBackgroundColor: 'rgba(0,0,0,1)',
                borderWidth: 1,
            })),
        },
        options: {
            responsive: true,
            title: {
                fontSize: 25,
                display: true,
                text: 'Average Appliances Consumption for single User'
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
                        fontSize: 14,
                    }
                }]
            }
        }
    };
    window.myLine = new Chart(ctx, config);
};