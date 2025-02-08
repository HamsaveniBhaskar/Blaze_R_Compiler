const { parentPort, workerData } = require("worker_threads");
const { spawnSync } = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");

parentPort.on("message", ({ code, input }) => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "r-"));
    const rFile = path.join(tmpDir, "script.R");

    try {
        fs.writeFileSync(rFile, code);

        // Execute R script
        const execProcess = spawnSync("Rscript", [rFile], {
            input,
            encoding: "utf-8",
            timeout: 2000,
        });

        // Clean up temporary files
        fs.rmSync(tmpDir, { recursive: true, force: true });

        if (execProcess.status !== 0) {
            return parentPort.postMessage({
                error: { fullError: `Runtime Error:\n${execProcess.stderr}` },
            });
        }

        parentPort.postMessage({
            output: execProcess.stdout.trim() || "No output received!",
        });
    } catch (err) {
        parentPort.postMessage({
            error: { fullError: `Server error: ${err.message}` },
        });
    }
});
