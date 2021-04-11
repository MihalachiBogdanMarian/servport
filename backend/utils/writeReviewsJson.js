import fs from "fs";
import reviewsDataset from "../data/reviewsDataset50000.json";

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

const randomDate = (startDate, endDate, startHour, endHour, startMinute, endMinute) => {
    let date = new Date(+startDate + Math.random() * (endDate - startDate));
    let hour = (startHour + Math.random() * (endHour - startHour)) | 0;
    let minute = (startMinute + Math.random() * (endMinute - startMinute)) | 0;
    date.setHours(hour);
    date.setMinutes(minute);
    return date;
};

const today = new Date(Date.now());
let createdAtStart = getNextWorkDay(new Date(today), "no");
createdAtStart.setDate(createdAtStart.getDate() + 30);
if (createdAtStart.getDay() === 6) createdAtStart.setDate(createdAtStart.getDate() + 2);
if (createdAtStart.getDay() === 0) createdAtStart.setDate(createdAtStart.getDate() + 1);
createdAtStart.setDate(createdAtStart.getDate() + 1);
let createdAtEnd = new Date(createdAtStart);
createdAtEnd.setDate(createdAtEnd.getDate() + 85);
createdAtEnd.setMinutes(createdAtEnd.getMinutes() - 1);

let reviews = [];

for (let i = 0; i < reviewsDataset.length; i++) {
    reviews = [
        ...reviews,
        {
            title: reviewsDataset[i].summary,
            rating: Math.floor(reviewsDataset[i].overall),
            comment: reviewsDataset[i].reviewText,
            createdAt: randomDate(createdAtStart, createdAtEnd, 0, 23, 0, 59),
        },
    ];
}

fs.writeFile("./backend/data/reviews.json", JSON.stringify(reviews), (error) => {
    if (error) throw error;
});