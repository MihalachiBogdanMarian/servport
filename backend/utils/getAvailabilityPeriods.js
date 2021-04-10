const breakTimes = {
    "6h": 60,
    "6hS": 60,
    "4h": 45,
    "4hS": 45,
    "3h": 30,
    "3hS": 30,
    "2h": 20,
    "2hS": 20,
    "1h": 20,
    "1hS": 20,
    "30min": 15,
    "30minS": 15,
};
const numIntermediaryIntervals = {
    "6h": 2,
    "6hS": 2,
    "4h": 3,
    "4hS": 3,
    "3h": 4,
    "3hS": 4,
    "2h": 6,
    "2hS": 6,
    "1h": 10,
    "1hS": 10,
    "30min": 20,
    "30minS": 20,
};

const getAvailabilityPeriods = (serviceCategory) => {
    const displayAvailabilityPeriods = (availabilityPeriods) => {
        availabilityPeriods.forEach((availabilityPeriod) =>
            console.log({
                startTime: formatDate(availabilityPeriod.startTime),
                endTime: formatDate(availabilityPeriod.endTime),
            })
        );
    };

    const generateAvailabilityPeriods = (rule) => {
        const getNumWeekDaysBetweenDates = (weekDay, startDate, endDate) => {
            let weekDayNum = 0;
            switch (weekDay) {
                case "Monday":
                    weekDayNum = 1;
                    break;
                case "Tuesday":
                    weekDayNum = 2;
                    break;
                case "Wednesday":
                    weekDayNum = 3;
                    break;
                case "Thursday":
                    weekDayNum = 4;
                    break;
                case "Friday":
                    weekDayNum = 5;
                    break;
                case "Saturday":
                    weekDayNum = 6;
                    break;
                default:
                    break;
            }
            let numWeekDays = 0;
            for (let i = new Date(startDate); i <= endDate; i.setDate(i.getDate() + 1)) {
                if (i.getDay() === weekDayNum) numWeekDays++;
            }
            return numWeekDays;
        };
        const getNextWorkDay = (date, rule) => {
            let day = date.getDay();
            let add = 1;
            if (!rule.includes("S"))
                if (day === 5) add = 3;
            if (day === 6) add = 2;
            date.setDate(date.getDate() + add);
            date.setHours(0);
            date.setMinutes(0, 0, 0);
            return date;
        };

        let availabilityPeriods = [];

        const addAvailabilityPeriods = (rule, firstWorkDayAfterToday, numIntervals, intervalDistance) => {
            const startHour = Math.floor(Math.random() * 2) === 1 ? 7 : 8;
            for (let i = 0; i < numIntervals; i++) {
                if (i === 0) {
                    startTime = new Date(firstWorkDayAfterToday);
                } else {
                    startTime = new Date(endTime);
                    startTime.setMinutes(startTime.getMinutes() + 1);

                    if (!rule.includes("S")) {
                        if (startTime.getDay() === 6) startTime.setDate(startTime.getDate() + 2);
                    }
                    if (startTime.getDay() === 0) startTime.setDate(startTime.getDate() + 1);
                }

                endTime = new Date(startTime);
                endTime.setDate(endTime.getDate() + intervalDistance);
                endTime.setMinutes(endTime.getMinutes() - 1);
                if (!rule.includes("S")) {
                    let oldEndTime = new Date(endTime);
                    if (oldEndTime.getDay() === 0 || oldEndTime.getDay() === 6) oldEndTime.setDate(oldEndTime.getDate() + 1);
                    endTime.setDate(endTime.getDate() + getNumWeekDaysBetweenDates("Saturday", startTime, endTime));
                    endTime.setDate(endTime.getDate() + getNumWeekDaysBetweenDates("Saturday", oldEndTime, endTime));
                    oldEndTime = new Date(endTime);
                    if (oldEndTime.getDay() === 0 || oldEndTime.getDay() === 6) oldEndTime.setDate(oldEndTime.getDate() + 1);
                    endTime.setDate(endTime.getDate() + getNumWeekDaysBetweenDates("Sunday", startTime, endTime));
                    endTime.setDate(endTime.getDate() + getNumWeekDaysBetweenDates("Sunday", oldEndTime, endTime));
                } else {
                    let oldEndTime = new Date(endTime);
                    if (oldEndTime.getDay() === 0) oldEndTime.setDate(oldEndTime.getDate() + 1);
                    endTime.setDate(endTime.getDate() + getNumWeekDaysBetweenDates("Sunday", startTime, endTime));
                    endTime.setDate(endTime.getDate() + getNumWeekDaysBetweenDates("Sunday", oldEndTime, endTime));
                }

                if (rule.includes("h") || rule.includes("min")) {
                    startTime.setHours(startHour);
                    let intermediaryEndTime;
                    for (let j = 0; j < numIntermediaryIntervals[rule]; j++) {
                        if (j !== 0) {
                            startTime = intermediaryEndTime;
                        }
                        intermediaryEndTime = new Date(startTime);

                        if (rule.includes("h")) {
                            intermediaryEndTime.setHours(intermediaryEndTime.getHours() + parseInt(rule.split("h")[0]));
                        } else {
                            intermediaryEndTime.setMinutes(intermediaryEndTime.getMinutes() + parseInt(rule.split("min")[0]));
                        }
                        availabilityPeriods = [
                            ...availabilityPeriods,
                            {
                                startTime,
                                endTime: new Date(intermediaryEndTime),
                            },
                        ];
                        intermediaryEndTime.setMinutes(intermediaryEndTime.getMinutes() + breakTimes[rule]);
                    }
                } else {
                    availabilityPeriods = [
                        ...availabilityPeriods,
                        {
                            startTime,
                            endTime,
                        },
                    ];
                }
            }
        };

        const today = new Date(Date.now());
        let firstWorkDayAfterToday = getNextWorkDay(new Date(today), rule);
        firstWorkDayAfterToday.setDate(firstWorkDayAfterToday.getDate() + 30);
        if (firstWorkDayAfterToday.getDay() === 6) firstWorkDayAfterToday.setDate(firstWorkDayAfterToday.getDate() + 2);
        if (firstWorkDayAfterToday.getDay() === 0) firstWorkDayAfterToday.setDate(firstWorkDayAfterToday.getDate() + 1);

        let endTime = firstWorkDayAfterToday;
        let startTime = endTime;

        switch (rule) {
            case "6mS": // 6 months
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 1, 168);
                break;
            case "3mS": // 3 months
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 1, 84);
                break;
            case "1mS": // one month
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 1, 28);
                break;
            case "2wS": // two weeks
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 2, 14);
                break;
            case "1wS": // one week
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 4, 7);
                break;
            case "4d": // 4 days
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 7, 4);
                break;
            case "4dS": // 4 days + working on Saturday
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 7, 4);
                break;
            case "3d": // 3 days
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 10, 3);
                break;
            case "3dS": // 3 days + working on Saturday
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 10, 3);
                break;
            case "2d": // 2 days
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 15, 2);
                break;
            case "2dS": // 2 days + working on Saturday
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 15, 2);
                break;
            case "1d": // 1 day
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 30, 1);
                break;
            case "1dS": // 1 day + working on Saturday
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 30, 1);
                break;
            case "6h": // 6 hours
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 30, 1);
                break;
            case "6hS": // 6 hours + working on Saturday
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 30, 1);
                break;
            case "4h": // 4 hours
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 30, 1);
                break;
            case "4hS": // 4 hours + working on Saturday
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 30, 1);
                break;
            case "3h": // 3 hours
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 30, 1);
                break;
            case "3hS": // 3 hours + working on Saturday
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 30, 1);
                break;
            case "2h": // 2 hours
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 30, 1);
                break;
            case "2hS": // 2 hours + working on Saturday
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 30, 1);
                break;
            case "1h": // 1 hour
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 30, 1);
                break;
            case "1hS": // 1 hour + working on Saturday
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 30, 1);
                break;
            case "30min": // 30 minutes
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 30, 1);
                break;
            case "30minS": // 30 minutes + working on Saturday
                addAvailabilityPeriods(rule, firstWorkDayAfterToday, 30, 1);
                break;
            default:
                break;
        }

        return availabilityPeriods;
    };

    let availabilityPeriods;
    let possibleRules = [];

    switch (serviceCategory) {
        case "Services>Repairs: PC, Electronics, Home Appliances":
            possibleRules = ["1h", "1hS", "2h", "2hS", "3h", "3hS", "4h", "4hS", "6h", "6hS", "1d", "1dS"];
            availabilityPeriods = generateAvailabilityPeriods(possibleRules[(Math.random() * possibleRules.length) | 0]);
            break;
        case "Services>Craftsmen&Builders>Sanitary, Thermal, AC Installations":
            possibleRules = ["1d", "1dS", "2d", "2dS", "3d", "3dS", "4d", "4dS", "1wS"];
            availabilityPeriods = generateAvailabilityPeriods(possibleRules[(Math.random() * possibleRules.length) | 0]);
            break;
        case "Services>Craftsmen&Builders>Constructions":
            possibleRules = ["1mS", "3mS", "6mS"];
            availabilityPeriods = generateAvailabilityPeriods(possibleRules[(Math.random() * possibleRules.length) | 0]);
            break;
        case "Services>Craftsmen&Builders>Roofs":
            possibleRules = ["2wS", "1mS", "3mS"];
            availabilityPeriods = generateAvailabilityPeriods(possibleRules[(Math.random() * possibleRules.length) | 0]);
            break;
        case "Services>Craftsmen&Builders>Interior Design":
            possibleRules = ["1d", "1dS", "2d", "2dS", "3d", "3dS", "4d", "4dS", "1wS"];
            availabilityPeriods = generateAvailabilityPeriods(possibleRules[(Math.random() * possibleRules.length) | 0]);
            break;
        case "Services>Auto&Transportation>Car Services":
            possibleRules = ["6h", "6hS", "1d", "1dS", "2d", "2dS", "3d", "3dS", "4d", "4dS"];
            availabilityPeriods = generateAvailabilityPeriods(possibleRules[(Math.random() * possibleRules.length) | 0]);
            break;
        case "Services>Auto&Transportation>Transport Services":
            possibleRules = ["1h", "1hS", "2h", "2hS", "3h", "3hS", "4h", "4hS", "6h", "6hS", "1d", "1dS"];
            availabilityPeriods = generateAvailabilityPeriods(possibleRules[(Math.random() * possibleRules.length) | 0]);
            break;
        case "Services>Events>Photo&Video":
            possibleRules = [
                "1h",
                "1hS",
                "2h",
                "2hS",
                "3h",
                "3hS",
                "4h",
                "4hS",
                "6h",
                "6hS",
                "1d",
                "1dS",
                "2d",
                "2dS",
                "3d",
                "3dS",
            ];
            availabilityPeriods = generateAvailabilityPeriods(possibleRules[(Math.random() * possibleRules.length) | 0]);
            break;
        case "Services>Events>Floral Arrangements&Decorations":
            possibleRules = ["3h", "3hS", "4h", "4hS", "6h", "6hS", "1d", "1dS"];
            availabilityPeriods = generateAvailabilityPeriods(possibleRules[(Math.random() * possibleRules.length) | 0]);
            break;
        case "Services>Private Lessons":
            possibleRules = ["1d", "1dS", "2d", "2dS", "3d", "3dS", "4d", "4dS"];
            availabilityPeriods = generateAvailabilityPeriods(possibleRules[(Math.random() * possibleRules.length) | 0]);
            break;
        case "Services>Cleaning":
            possibleRules = ["30min", "30minS", "1h", "1hS", "2h", "2hS", "3h", "3hS", "4h", "4hS", "6h", "6hS", "1d", "1dS"];
            availabilityPeriods = generateAvailabilityPeriods(possibleRules[(Math.random() * possibleRules.length) | 0]);
            break;
        default:
            break;
    }

    return availabilityPeriods;
};

export default getAvailabilityPeriods;