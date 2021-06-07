const hasExpired = (expirationDate) => {
    if (new Date(expirationDate) <= new Date(Date.now())) {
        return true;
    } else {
        return false;
    }
};

export default hasExpired;