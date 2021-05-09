import dotenv from "dotenv";
import callPythonScript from "../utils/callPythonScript.js";
import { logOutput } from "../utils/utilities.js";
import ErrorResponse from "./errorResponse.js";

dotenv.config();

const sentimentAnalysis = async(reviewComment, next) => {
    try {
        const response = await callPythonScript(process.env.PATH_TO_SENTIMENT_ANALYSIS_PY, [reviewComment]);
        logOutput("main")(response);
        return response.sentiment;
    } catch (error) {
        return next(new ErrorResponse("Problem computing sentiment for review", 500));
    }
};

export default sentimentAnalysis;