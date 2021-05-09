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

export { randomSubarray, logOutput };