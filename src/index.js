const config = require('./config');
const parseDirectory = require('./utils/parseDirectory');
const { writeFile, clearOutputDirectory } = require('./utils/fileHelpers');

// Function to export scripts to text files
async function exportToText() {
  try {
    // Clear the output directory before exporting new scripts
    clearOutputDirectory(config.outputDir);

    // Await the result of parseDirectory since it's async
    const scriptsContent = await parseDirectory(config.inputDir);

    // Split content if it exceeds the processing limit
    const maxCharacterLimit = 30000;
    let fileIndex = 1;
    let currentContent = '';

    for (let i = 0; i < scriptsContent.length; i++) {
      currentContent += scriptsContent[i];

      if (currentContent.length >= maxCharacterLimit || i === scriptsContent.length - 1) {
        const outputFilePath = `${config.outputDir}/export${fileIndex}.txt`;
        await writeFile(outputFilePath, currentContent);
        console.log(`Successfully exported scripts to: ${outputFilePath}`);
        fileIndex++;
        currentContent = '';
      }
    }
  } catch (error) {
    console.error('Error exporting scripts:', error);
  }
}

// Execute the export
exportToText();
