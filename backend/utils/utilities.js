const randomSubarray = (array, num = 1) => {
    const result = [];
    for (let i = 0; i < num;) {
        const random = Math.floor(Math.random() * array.length);
        if (result.indexOf(array[random]) !== -1) {
            continue;
        }
        result.push(array[random]);
        i++;
    }
    return result;
};

const logOutput = (name) => (message) => console.log(`[${name}] ${message}`);

const formatDate = (date) => {
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
    };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
};

function areDateIntervalsOverlapping() {
    const dateRangeOverlaps = (date1Start, date1End, date2Start, date2End) => {
        if (!(date1End <= date2Start || date1Start >= date2End)) {
            return true;
        }
        return false;
    };

    var i, j;
    if (arguments.length % 2 !== 0) throw new TypeError("Arguments length must be a multiple of 2");
    for (i = 0; i < arguments.length - 2; i += 2) {
        for (j = i + 2; j < arguments.length; j += 2) {
            if (dateRangeOverlaps(arguments[i], arguments[i + 1], arguments[j], arguments[j + 1])) return true;
        }
    }
    return false;
}

export { randomSubarray, logOutput, formatDate, areDateIntervalsOverlapping };