const fs = require('fs');
const moment = require('moment');
const csv = require('csv-parser');

generateAverageDailyConsumption();
generateHourConsumption();
generateDayConsumption();
generateWeekConsumption();
generateAverageAppliancesConsumption();

function generateAverageDailyConsumption() {
    let lastEnergy = 0;
    const json = {};
    const csvStream = csv();
    const files = fs.readdirSync('./data/daily_data_each_user_in_separate_csv').filter(file => file.includes('csv'));

    csvStream.on('data', function (data) {
        const energy = lastEnergy ? (data.energy - lastEnergy) / 10000000000 : 0;
        if (energy) {
            if (json[data.date]) {
                json[data.date].push(energy);
            } else {
                json[data.date] = [energy];
            }
        }
        lastEnergy = data.energy;
    }).on('end', function () {
        console.log('done');
        var writeStream = fs.createWriteStream('./charts/average_daily_consumption/output.json');
        writeStream.write(JSON.stringify(json));
    }).on('error', function (error) {
        console.log(error);
    });

    files.forEach((file, index) => {
        lastEnergy = 0;

        const readStream = fs.createReadStream(`./data/daily_data_each_user_in_separate_csv/${file}`);
        readStream.pipe(csvStream);
        if (index === files.length - 1)
            mapAverageData();
    });

    function mapAverageData() {
        try {
            var data = require('./charts/average_daily_consumption/output.json');
            const result = Object.keys(data).reduce((acc, item) => {
                const set = {};
                set.date = item;
                set.value = data[item].reduce((a, b) => a + b) / data[item].length;
                acc.push(set);
                return acc;
            }, []);
            var writeStream = fs.createWriteStream('./charts/average_daily_consumption/result.js');

            writeStream.write(`var result = ${JSON.stringify(result.sort(function(a, b) {
                return new Date(a.date) - new Date(b.date);
            }))};`);
        } catch (e) {
            setTimeout(mapAverageData);
        }
    }
}

function generateHourConsumption() {
    const json = [];
    const files = fs.readdirSync('./data/random_users').filter(file => file.includes('csv'));

    function getStream(file) {
        const csvStream = csv();
        const userHourData = { id: file, data: [] };
    
        let beforeTime, afterTime;
    
        csvStream.on('data', function (data) {
            const time = moment(data.date);
            if (!beforeTime) {
                beforeTime = moment(data.date).set({ hours: 11 });
                afterTime = moment(data.date).set({ hours: 12 });
                console.log(beforeTime, afterTime);
            }
    
            if (time.isBetween(beforeTime, afterTime)) {
                userHourData.data.push({
                    value: data.power / 1000,
                    time,
                });
            }
    
            if (time.isAfter(afterTime)) {
                json.push(userHourData);
                const writeStream = fs.createWriteStream('./charts/hour_consumption/result.js');
                writeStream.write(`var result = ${JSON.stringify(json)};`);
                csvStream.destroy();
            }
        }).on('end', function () {
            console.log('done');
        }).on('error', function (error) {
            console.log(error);
        });
    
        return csvStream;
    }

    files.forEach(file => {
        console.log(file);
        readStream = fs.createReadStream(`./data/random_users/${file}`);
        readStream.pipe(getStream(file));
    });
}

function generateDayConsumption() {
    const json = [];
    const files = fs.readdirSync('./data/random_users').filter(file => file.includes('csv'));

    function getStream(file) {
        const csvStream = csv();
        const userHourData = { id: file, data: [] };
    
        let beforeTime, afterTime;
    
        csvStream.on('data', function (data) {
            const time = moment(data.date);
            if (!beforeTime) {
                beforeTime = moment(data.date).startOf('day');
                afterTime = moment(data.date).endOf('day');
                console.log(beforeTime, afterTime);
            }
    
            if (time.isBetween(beforeTime, afterTime) && (!userHourData.data.length || time.diff(userHourData.data[userHourData.data.length - 1].time, 'minutes') > 2)) {
                userHourData.data.push({
                    time,
                    value: data.power / 1000,
                });
            }
    
            if (time.isAfter(afterTime)) {
                json.push(userHourData);
                const writeStream = fs.createWriteStream('./charts/day_consumption/result.js');
                writeStream.write(`var result = ${JSON.stringify(json)};`);
                csvStream.destroy();
            }
        }).on('end', function () {
            console.log('done');
        }).on('error', function (error) {
            console.log(error);
        });
    
        return csvStream;
    }

    files.forEach(file => {
        console.log(file);
        readStream = fs.createReadStream(`./data/random_users/${file}`);
        readStream.pipe(getStream(file));
    });
}

function generateWeekConsumption() {
    const json = [];
    const files = fs.readdirSync('./data/random_users').filter(file => file.includes('csv'));

    function getStream(file) {
        const csvStream = csv();
        const userHourData = { id: file, data: [] };
    
        let beforeTime, afterTime;
    
        csvStream.on('data', function (data) {
            const time = moment(data.date);
            if (!beforeTime) {
                beforeTime = moment(data.date);
                afterTime = moment(data.date).add(7, 'day');
                console.log(beforeTime, afterTime);
            }
    
            if (time.isBetween(beforeTime, afterTime) && (!userHourData.data.length || time.diff(userHourData.data[userHourData.data.length - 1].time, 'minutes') > 14)) {
                userHourData.data.push({
                    time,
                    value: data.power / 1000,
                });
            }
    
            if (time.isAfter(afterTime)) {
                json.push(userHourData);
                const writeStream = fs.createWriteStream('./charts/week_consumption/result.js');
                writeStream.write(`var result = ${JSON.stringify(json)};`);
                csvStream.destroy();
            }
        }).on('end', function () {
            console.log('done');
        }).on('error', function (error) {
            console.log(error);
        });
    
        return csvStream;
    }

    files.forEach(file => {
        console.log(file);
        readStream = fs.createReadStream(`./data/random_users/${file}`);
        readStream.pipe(getStream(file));
    });
}

function generateAverageAppliancesConsumption() {
    const json = {};
    const csvStream = csv();
    const files = fs.readdirSync('./data/disaggregation-data').filter(file => file.includes('csv'));
    const appliancesKeys = ['AlwaysOn', 'DishWasher', 'Dryer', 'FlowWaterHeater', 'Lighting', 'Oven', 'Refrigeration', 'WashingMachine'];

    csvStream.on('data', function (data, i) {
        if (!appliancesKeys.includes(data.applianceType) || !data.usage) return;
        const date = moment.unix(data.startTime).startOf('day').format();
        if (json[data.applianceType]) {
            if (json[data.applianceType][date]) {
                json[data.applianceType][date].push(data.usage);
            } else {
                json[data.applianceType][date] = [data.usage];
            }
        } else {
            json[data.applianceType] = {};
            json[data.applianceType][date] = [data.usage];
        }
    }).on('end', function () {
        var writeStream = fs.createWriteStream('./charts/average_appliances_consumption/output.json');
        writeStream.write(JSON.stringify(json));
    }).on('error', function (error) {
        console.log(error);
    });

    files.forEach((file, index) => {
        lastEnergy = 0;
        const readStream = fs.createReadStream(`./data/disaggregation-data/${file}`);
        readStream.pipe(csvStream);
        if (index === files.length - 1)
            mapAverageData();
    });

    function mapAverageData() {
        try {
            const appliances = require('./charts/average_appliances_consumption/output.json');
            const maxLengthAppliance = Object.keys(appliances).reduce((acc, appliance, index) => {
                if (!acc || Object.keys(appliances[appliance]).length > Object.keys(appliances[acc]).length) acc = appliance;
                return acc;
            }, '');
            const result = Object.keys(appliances).reduce((acc, appliance) => {
                acc[appliance] = Object.keys(appliances[maxLengthAppliance]).reduce((acc, date) => {
                    const set = {};
                    set.date = date;
                    if (appliances[appliance][date]) {
                        const accumlation = appliances[appliance][date].reduce((a, b) => a * 1 + b * 1) || 0;
                        set.value = accumlation || 0;
                    } else {
                        set.value = 0;
                    }
                    acc.push(set);
                    return acc;
                }, []);
                return acc;
            }, {});
            var writeStream = fs.createWriteStream('./charts/average_appliances_consumption/result.js');

            const sorted = Object.keys(result).reduce((acc, appliance) => {
                acc[appliance] = result[appliance].sort(function(a, b) {
                    return new Date(a.date) - new Date(b.date);
                });
                return acc;
            }, {})
            writeStream.write(`var result = ${JSON.stringify(sorted)};`);
        } catch (e) {
            console.log(e);
            setTimeout(mapAverageData);
        }
    }
}
