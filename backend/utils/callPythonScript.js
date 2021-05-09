import { spawn } from "child_process";
import path from "path";
import { logOutput } from "../utils/utilities.js";

function callPythonScript(pathToPythonScript, params) {
    return new Promise((resolve, reject) => {
        const process = spawn("python", [path.join(path.resolve(path.dirname("")), pathToPythonScript), ...params]);

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

export default callPythonScript;