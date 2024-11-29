const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js'); // To parse XML from rbxmx files

async function parseDirectory(directoryPath, currentDepth = 0, maxDepth = Infinity) {
  let allScriptsContent = '';
  try {
    const items = await fs.promises.readdir(directoryPath, { withFileTypes: true });
    console.log(`Reading directory: ${directoryPath}`); // Log the directory being read

    for (const item of items) {
      const itemPath = path.join(directoryPath, item.name);
      console.log(`Processing item: ${itemPath}`); // Log the current item

      if (item.isDirectory() && currentDepth < maxDepth) {
        allScriptsContent += await parseDirectory(itemPath, currentDepth + 1, maxDepth);
      } else if (item.isFile() && isValidScript(item.name)) {
        console.log(`Reading file: ${itemPath}`); // Log the file being read
        allScriptsContent += await readScript(itemPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory "${directoryPath}": ${error.message}`);
  }

  return allScriptsContent;
}

function isValidScript(fileName) {
  return (
    fileName.endsWith('.lua') ||
    fileName.toLowerCase().includes('localscript') ||
    fileName.endsWith('.rbxmx')
  );
}

async function readScript(filePath) {
  if (filePath.endsWith('.rbxmx')) {
    return await readRbxmxFile(filePath);
  }

  try {
    return await fs.promises.readFile(filePath, 'utf-8') + '\n';
  } catch (error) {
    console.error(`Error reading file "${filePath}": ${error.message}`);
    return ''; // Return empty content if read fails
  }
}

async function readRbxmxFile(filePath) {
    try {
      // Step 1: Read the raw XML content
      const xmlContent = await fs.promises.readFile(filePath, 'utf-8');
  
      // Step 2: Parse the XML content
      const parser = new xml2js.Parser();
  
      return new Promise((resolve, reject) => {
        parser.parseString(xmlContent, (err, result) => {
          if (err) {
            console.error(`Error parsing XML in file "${filePath}": ${err.message}`);
            return reject('');
          }
  
          let scriptsContent = '';
  
          // Recursive function to extract scripts from nested items
          function extractScriptsFromItems(items, currentPath) {
            if (!items) return;
  
            for (const item of items) {
              let scriptLocation = currentPath;
  
              // Append current item's name to the path
              if (item.Properties && item.Properties[0] && item.Properties[0].string) {
                const nameProperty = item.Properties[0].string.find(
                  (prop) => prop.$ && prop.$.name === 'Name'
                );
                if (nameProperty && nameProperty._) {
                  scriptLocation += `/${nameProperty._}`;
                }
              }
  
              if (
                item.$ &&
                (item.$.class === 'Script' ||
                  item.$.class === 'LocalScript' ||
                  item.$.class === 'ModuleScript') &&
                item.Properties
              ) {
                // Extract the script name (default to "Unknown" if not found)
                let scriptName = 'Unknown';
  
                if (item.Properties[0] && item.Properties[0].string) {
                  const nameProperty = item.Properties[0].string.find(
                    (prop) => prop.$ && prop.$.name === 'Name'
                  );
                  if (nameProperty && nameProperty._) {
                    scriptName = nameProperty._;
                  }
                }
  
                // Extract the script content (either "Source" or "ProtectedString")
                let scriptContent = '';
  
                if (item.Properties[0]) {
                  // Extract ProtectedString property named "Source"
                  if (item.Properties[0].ProtectedString) {
                    const protectedStringProperty = item.Properties[0].ProtectedString.find(
                      (prop) => prop.$ && prop.$.name === 'Source'
                    );
                    if (protectedStringProperty && protectedStringProperty._) {
                      scriptContent = protectedStringProperty._;
                    }
                  }
  
                  // Extract normal string property named "Source" if no ProtectedString found
                  if (!scriptContent && item.Properties[0].string) {
                    const sourceProperty = item.Properties[0].string.find(
                      (prop) => prop.$ && prop.$.name === 'Source'
                    );
                    if (sourceProperty && sourceProperty._) {
                      scriptContent = sourceProperty._;
                    }
                  }
                }
  
                // Append the script name, location, and content to scriptsContent
                scriptsContent += `\n=== ${item.$.class}: ${scriptName} ===\n`;
                scriptsContent += `Location: ${scriptLocation}\n\n${scriptContent}\n`;
              }
  
              // If the item has children, call the function recursively
              if (item.Item) {
                extractScriptsFromItems(item.Item, scriptLocation);
              }
            }
          }
  
          // Start extracting scripts from the top-level items
          if (result && result.roblox && result.roblox.Item) {
            extractScriptsFromItems(result.roblox.Item, path.basename(filePath));
          }
  
          // Log the final extracted content to verify
          console.log('Final Extracted Scripts Content:', scriptsContent);
  
          resolve(scriptsContent);
        });
      });
    } catch (error) {
      console.error(`Error reading .rbxmx file "${filePath}": ${error.message}`);
      return ''; // Return empty content if read fails
    }
  }
  
  
module.exports = parseDirectory;
