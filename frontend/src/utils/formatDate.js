function formatDate(date) {
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
}

export default formatDate;