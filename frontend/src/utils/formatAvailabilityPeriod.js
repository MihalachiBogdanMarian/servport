const formatAvailabilityPeriod = (startDate, endDate) => {
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
    };
    return (
        new Intl.DateTimeFormat("en-US", options).format(new Date(startDate)) +
        " - " +
        new Intl.DateTimeFormat("en-US", options).format(new Date(endDate))
    );
};

export default formatAvailabilityPeriod;