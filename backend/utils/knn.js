import dotenv from "dotenv";
import callPythonScript from "../utils/callPythonScript.js";
import { logOutput } from "../utils/utilities.js";
import ErrorResponse from "./errorResponse.js";

dotenv.config();

const knn = async(serviceId, next) => {
    try {
        const response = await callPythonScript(process.env.PATH_TO_KNN_PY, [serviceId]);
        logOutput("main")(response);
    } catch (error) {
        return next(new ErrorResponse("Problem assigning cluster labels to the service", 500));
    }
};

export default knn;