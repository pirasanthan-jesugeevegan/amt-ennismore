const report = require('multiple-cucumber-html-reporter');
const fs = require('fs-extra');
const path = require('path');

const cucumberJsonDir = path.resolve(process.cwd(), 'cypress/reports');
const cucumberReportFileMap = {};
const cucumberReportMap = {};
const jsonIndentLevel = 2;
const ReportDir = path.resolve(process.cwd(), 'cypress/reports');
const screenshotsDir = './cypress/screenshots';

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

if (!fs.existsSync(cucumberJsonDir)) {
  fs.mkdirSync(cucumberJsonDir);
  console.warn('REPORT CANNOT BE CREATED!');
} else {
  getCucumberReportMaps();
  addScreenshots();
  generateReport();
}
//Mapping cucumber json files from the cucumber-json directory to the features
function getCucumberReportMaps() {
  const files = fs.readdirSync(cucumberJsonDir).filter((file) => {
    return file.indexOf('.json') > -1;
  });
  files.forEach((file) => {
    const json = JSON.parse(fs.readFileSync(path.join(cucumberJsonDir, file)));
    if (!json[0]) {
      return;
    }
    const [feature] = json[0].uri.split('/').reverse();
    cucumberReportFileMap[feature] = file;
    cucumberReportMap[feature] = json;
  });
}

//Adding screenshots to the respective failed test steps in the feature files
function addScreenshots() {
  const prependPathSegment = (pathSegment) => (location) =>
    path.join(pathSegment, location);

  const readdirPreserveRelativePath = (location) =>
    fs.readdirSync(location).map(prependPathSegment(location));

  const readdirRecursive = (location) =>
    readdirPreserveRelativePath(location).reduce(
      (result, currentValue) =>
        fs.statSync(currentValue).isDirectory()
          ? result.concat(readdirRecursive(currentValue))
          : result.concat(currentValue),
      []
    );
  const screenshots = readdirRecursive(path.resolve(screenshotsDir)).filter(
    (file) => {
      return file.indexOf('.png') > -1;
    }
  );

  const featuresList = Array.from(
    new Set(screenshots.map((x) => x.match(/[\w-_.]+\.feature/g)[0]))
  );
  featuresList.forEach((feature) => {
    screenshots.forEach((screenshot) => {
      const regex =
        /(?<=\ --\ ).*?((?=\ \(example\ \#\d+\))|(?=\ \(failed\)))/g;
      const [scenarioName] = screenshot.match(regex);

      const myScenarios = cucumberReportMap[feature][0].elements.filter((e) =>
        scenarioName.includes(e.name)
      );
      if (!myScenarios) {
        return;
      }
      let foundFailedStep = false;
      myScenarios.forEach((myScenario) => {
        if (foundFailedStep) {
          return;
        }
        let myStep;
        if (screenshot.includes('(failed)')) {
          myStep = myScenario.steps.find(
            (step) => step.result.status === 'failed'
          );
        } else {
          myStep = myScenario.steps.find((step) =>
            step.name.includes('screenshot')
          );
        }
        if (!myStep) {
          return;
        }
        const data = fs.readFileSync(path.resolve(screenshot));
        if (data) {
          const base64Image = Buffer.from(data, 'binary').toString('base64');
          if (!myStep.embeddings) {
            myStep.embeddings = [];
            myStep.embeddings.push({
              data: base64Image,
              mime_type: 'image/png',
            });
            foundFailedStep = true;
          }
        }
      });
      //Write JSON with screenshot back to report file.
      fs.writeFileSync(
        path.join(cucumberJsonDir, cucumberReportFileMap[feature]),
        JSON.stringify(cucumberReportMap[feature], null, jsonIndentLevel)
      );
    });
  });
}

function generateReport() {
  if (!fs.existsSync(cucumberJsonDir)) {
    console.warn('REPORT CANNOT BE CREATED!');
  } else {
    fs.readFile('cypress/.run/results.json', function read(err, data) {
      let runInfos = JSON.parse(data);

      report.generate({
        pageTitle: `Amazon | Automation Report`,
        reportName: `Automation Report for Amazon.co.uk Environment`,
        jsonDir: cucumberJsonDir,
        reportPath: ReportDir,
        displayReportTime: true,
        displayDuration: true,
        metadata: {
          browser: {
            name: runInfos.browserName,
            version: runInfos.browserVersion,
          },
          device: 'Virtual Machine',
          platform: {
            name: 'linux',
            version: runInfos.osVersion,
          },
        },
        customData: {
          title: 'Run info',
          data: [
            {
              label: 'Environment',
              value: `Amazon`,
            },
            { label: 'Cypress Version', value: runInfos.cypressVersion },
            { label: 'Test Type', value: 'Regression' },
            {
              label: 'Execution Start Time',
              value: new Date(runInfos.startedTestsAt).toLocaleString(),
            },
            {
              label: 'Execution End Time',
              value: new Date(runInfos.endedTestsAt).toLocaleString(),
            },
          ],
        },
      });
    });
  }
}
