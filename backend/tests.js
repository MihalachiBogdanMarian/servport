import tf from "@tensorflow/tfjs";
// import tfjsnode from "@tensorflow/tfjs-node";
import { spawn } from "child_process";
import colors from "colors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import connectDB from "./config/db.js";
import Request from "./models/Request.js";
import Service from "./models/Service.js";
import User from "./models/User.js";

dotenv.config();

connectDB();

tf;
// tfjsnode;
spawn;
path;
mongoose;
colors;
Request;
Service;
User;

/* REMOVE USER */
// const user = await User.findById("606f6f17942e3d17dc505ac7");
// await user.remove();

/* CHANGE REVIEWS OF A SERVICE USING UPDATEONE */
// const service = await Service.findById("606f6f17942e3d17dc505bfa").populate("reviews");
// await service.updateOne({
//     reviews: [{ title: "A", comment: "a", rating: 5, user: "606f6f17942e3d17dc505ac9" }, ...service.reviews],
// });

/* CHANGE REVIEWS OF A SERVICE USING SAVE */
// const service = await Service.findById("606f6f17942e3d17dc505bfa").populate("reviews");
// service.reviews.unshift({ title: "A", comment: "a", rating: 5, user: "606f6f17942e3d17dc505ac5" });
// await service.save();

/* CALL PYTHON SCRIPT */
const logOutput = (name) => (message) => console.log(`[${name}] ${message}`);

function run() {
    return new Promise((resolve, reject) => {
        // const process = spawn("python", [
        //     path.join(path.resolve(path.dirname("")), "/datascience/nlp/sentiment_analysis.py"),
        //     "Perfect service!",
        // ]);
        const process = spawn("python", [
            path.join(path.resolve(path.dirname("")), "/datascience/clustering/knn.py"),
            "60841adf5a226330888f7070",
        ]);

        const out = [];
        process.stdout.on("data", (data) => {
            out.push(data.toString());
            logOutput("stdout")(data);
        });

        const err = [];
        process.stderr.on("data", (data) => {
            err.push(data.toString());
            logOutput("stderr")(data);
        });

        process.on("exit", (code, signal) => {
            logOutput("exit")(`${code} (${signal})`);
            if (code !== 0) {
                reject(new Error(err.join("\n")));
                return;
            }
            try {
                console.log(out);
                resolve(JSON.parse(out[0]));
            } catch (e) {
                reject(e);
            }
        });
    });
}

(async() => {
    try {
        const output = await run();
        logOutput("main")(output);
        process.exit(0);
    } catch (e) {
        console.error("Error during script execution ", e.stack);
        process.exit(1);
    }
})();

/* LOAD KERAS MODEL AND PREDICT */
// let model;
// (async() => {
//     try {
//         model = await tf.loadLayersModel("file://../datascience/nlp/sentiment_analysis_model_js/model.json");
//     } catch (error) {
//         console.error(error);
//     }
// })();

// const sentence = "Horrible product, simply awful!";

// let prediction;
// (async() => {
//     prediction = await model.predict(sentence);
// })();
// console.log(prediction);