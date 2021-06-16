const formatDate = (
    date,
    options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
    }
) => {
    if (date) {
        return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
    } else return undefined;
};

export default formatDate;