# rbxmx Script Exporter

## Overview
This project is a script exporter that extracts Lua and Roblox scripts (e.g., Script, ModuleScript, LocalScript) from `.rbxmx` files within a given input directory and exports them to text files. It handles XML parsing of the `.rbxmx` files and outputs the script names, content, and directory location in a user-friendly way. Additionally, the project automatically splits large output files to ensure content remains manageable.

## Features
- **Recursive Directory Parsing**: Parses all directories within the provided input folder, extracting script files.
- **Supports Multiple Script Types**: Works with `.lua`, `.rbxmx`, and LocalScripts.
- **Script Content Extraction**: Extracts Lua script content, providing clear labels for script names, types, and locations.
- **Output File Splitting**: Automatically splits exported script content into multiple files if the content exceeds 30,000 characters.
- **Automatic Output Cleanup**: Clears all files in the output folder before running a new export to ensure no mixed or outdated data.

## Getting Started

### Prerequisites
- **Node.js**: You need to have Node.js installed. You can download it [here](https://nodejs.org/).
- **NPM**: Comes bundled with Node.js. Ensure you have the latest version.

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/rbxmx-script-exporter.git
   ```
2. Navigate into the directory:
   ```sh
   cd rbxmx-script-exporter
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

### Directory Structure
- **input**: Place your `.rbxmx` files or directories containing scripts here.
- **output**: This is where the exported script files will be saved. Existing content in this directory is automatically deleted each time the script runs.
- **utils**: Contains utility functions (`parseDirectory.js`, `fileHelpers.js`).
- **config.js**: Configuration for specifying input and output paths.

## Usage

### Running the Export Script
To run the export script, use the following command:
```sh
node src/index.js
```

### Configuration
You can configure input and output paths in the `config.js` file:
```js
const path = require('path');

module.exports = {
  inputDir: path.join(__dirname, '../input'), // Adjust to your actual input folder
  outputDir: path.join(__dirname, '../output') // Directory for output files
};
```

### Example Output
When the script runs successfully, you will see multiple files like:
- `export1.txt`
- `export2.txt`

Each file will contain the script names, locations, and content extracted from the `.rbxmx` files in the input directory.

## Project Files
- **`src/index.js`**: The main entry point for the script export functionality.
- **`utils/parseDirectory.js`**: Handles directory traversal and script extraction.
- **`utils/fileHelpers.js`**: Contains helper functions for file operations, including writing output and clearing directories.
- **`config.js`**: Configuration file for specifying paths.

## Notes
- The script will split output into multiple files if the content exceeds 30,000 characters.
- Ensure that the `output` folder is writable, as all the extracted files will be stored there.
- Script names, locations, and content are included for easy readability, particularly aimed at users reviewing extracted data.

## Contributing
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements
- **xml2js**: Used to parse XML content from `.rbxmx` files.