const fs = require('fs');
const process = require('process');

function filterFailedAssertions(data, address) {
  const failedAssertions = {};

  const actRulesAssertions = data[address]["modules"]["act-rules"]["assertions"];
  for (const assertionId in actRulesAssertions) {
    if (actRulesAssertions[assertionId]["metadata"]["outcome"] === "failed") {
      const assertion = actRulesAssertions[assertionId];
      const filteredResults = assertion["results"].filter(
        (result) => result["verdict"] === "failed"
      );
      failedAssertions[assertionId] = {
        ...assertion,
        "results": filteredResults,
      };
    }
  }

  return {
    [address]: {
      "type": data[address]["type"],
      "modules": {
        "act-rules": {
          "type": data[address]["modules"]["act-rules"]["type"],
          "metadata": data[address]["modules"]["act-rules"]["metadata"],
          "assertions": failedAssertions,
        },
      },
    },
  };
}

function processAllAddresses(data) {
  const result = {};
  for (const address in data) {
    Object.assign(result, filterFailedAssertions(data, address));
  }
  return result;
}

function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Please provide a file path as an argument.');
    process.exit(1);
  }

  fs.readFile(filePath, 'utf8', (err, fileContents) => {
    if (err) {
      console.error(`Error reading file from disk: ${err}`);
      process.exit(1);
    }

    try {
      const data = JSON.parse(fileContents);
      const result = processAllAddresses(data);
      const outputFilePath = 'failed-test.json';

      fs.writeFile(outputFilePath, JSON.stringify(result, null, 2), (err) => {
        if (err) {
          console.error(`Error writing failed-test.json: ${err}`);
        } else {
          console.log(`Filtered results have been saved to ${outputFilePath}`);
        }
      });

    } catch (error) {
      console.error(`Error processing JSON data: ${error}`);
    }
  });
}

main();