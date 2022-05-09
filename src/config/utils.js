const fs = require("fs");
const path = require("path");

exports.createConfigFile = () => {
  const fileName = "config.js";
  const filePath = path.resolve(__dirname, "..", "public", "js", fileName);
  const currentFileContent = fs.readFileSync(filePath).toString();
  const newFileContent = `export const API_URL = '${process.env.API_URL}'`;

  if (currentFileContent !== newFileContent) {
    fs.writeFile(filePath, newFileContent, () =>
      console.log("Configuration file created")
    );
  }
};
