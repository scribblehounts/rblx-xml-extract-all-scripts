const fs = require('fs');
const path = require('path');

// Function to write content to a file
async function writeFile(filePath, content) {
  try {
    await fs.promises.writeFile(filePath, content, 'utf-8');
  } catch (error) {
    console.error(`Error writing to file "${filePath}": ${error.message}`);
  }
}

// Function to clear the output directory
function clearOutputDirectory(directoryPath) {
  try {
    if (fs.existsSync(directoryPath)) {
      const files = fs.readdirSync(directoryPath);

      for (const file of files) {
        fs.unlinkSync(path.join(directoryPath, file));
      }
    }
  } catch (error) {
    console.error(`Error clearing output directory "${directoryPath}": ${error.message}`);
  }
}

module.exports = {
  writeFile,
  clearOutputDirectory,
};
