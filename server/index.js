// const express = require("express");
// const bodyParser = require("body-parser");
// const { exec } = require("child_process");
// const path = require("path");

// const app = express();
// const port = 3000;

// let runningProcess = null;
// app.use(bodyParser.json());

// app.post("/activate-venv", (req, res) => {
//   // Command to activate the virtual environment
//   const activateEnvCommand =
//     "call ..\\ultralytics\\venv\\Scripts\\activate.bat";

//   exec(activateEnvCommand, { shell: true }, (error, stdout, stderr) => {
//     if (error) {
//       return res
//         .status(500)
//         .send(`Error activating venv: ${stderr || error.message}`);
//     }
//     console.log(stdout);
//     res.send("Virtual environment activated.");
//   });
// });

// app.post("/detect", (req, res) => {
//   const { mode, filePath } = req.body;

//   // Ensure mode is one of the valid values
//   if (!["webcam", "mobilecam", "image", "video"].includes(mode)) {
//     return res
//       .status(400)
//       .send("Invalid mode. Valid modes are: webcam, mobilecam, image, video.");
//   }

//   let filePathWithQuotes = filePath ? `"${filePath}"` : "";

//   let command = `call ..\\ultralytics\\venv\\Scripts\\activate.bat && python ..\\ultralytics\\crop_detect.py ${mode}`;

//   if (mode === "image" || mode === "video") {
//     if (!filePath) {
//       return res.status(400).send(`File path is required for ${mode} mode.`);
//     }
//     command += ` ${filePathWithQuotes}`;
//   }
//   console.log(`Executing command: ${command}`);

//   // Execute the command
//   runningProcess = exec(command, { shell: true }, (error, stdout, stderr) => {
//     if (error) {
//       return res
//         .status(500)
//         .send(`Error running script: ${stderr || error.message}`);
//     }
//     console.log(stdout);
//     console.log(`Detection started in ${mode} mode.`);
//     res.send(`Detection started in ${mode} mode.`);
//   });
// });

// app.post("/stop", (req, res) => {
//   if (runningProcess) {
//     runningProcess.kill("SIGTERM"); 
//     console.log("Detection script stopped.");
//     runningProcess = null;
//     res.send("Detection script stopped.");
//   } else {
//     res.status(400).send("No running script to stop.");
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running at ${port}`);
// });


// // sdasd