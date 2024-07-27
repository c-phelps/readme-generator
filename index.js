const fs = require("fs");
const inquirer = require("inquirer");
const fetch = require("node-fetch");
const markdown = require("./utils/generateMarkdown");

function writeToFile(fileName, input, licenseKey) {
  // call the generate markdown function passed from from the utils folder
  markdown(input, licenseKey)
    .then((strTextContent) => {
      // the markdown function returns a readme based on the data passed to the function from the user input and fetch requests
      // we then write the data returned to a file or display an error if there is an issue in doing so
      fs.writeFile(fileName, strTextContent, (err) => {
        if (err) {
          console.error("Error writing file:", err);
        }
      });
    })
    .catch((error) => {
      console.error("Error generating markdown content:", error);
    });
}

function createArray(arrLicense) {
  // take our array of license objects and map them to a new array and only save the value used for Name
  // array went from looking like [{Name:val1, Key:val1},{Name:val2, Key:val2}] to [Name1, Name2]
  const arrLicenseNames = arrLicense.map(({ Name }) => Name);
  // TODO: Create an array of questions for user input
  // this array relies on data passed by
  const arrQuestions = [
    {
      type: "input",
      message: "What is the title of your project?",
      name: "inTitle",
    },
    {
      type: "input",
      message: "Enter a description for your project:",
      name: "inDecription",
    },
    { type: "input", message: "Please enter steps required for installation:", name: "inInstall" },
    {
      type: "input",
      message: "Please enter instructions for application usage:",
      name: "inUsage",
    },
    {
      type: "list",
      message: "Please select the license you will be using from the following:",
      name: "inLicense",
      choices: arrLicenseNames, //Use our array of licenses
    },
    { type: "input", message: "Please note any contribution guidelines to the project below:", name: "inContribute" },
    { type: "input", message: "Please note any instructions for testing below:", name: "inTesting" },
    { type: "input", message: "Please enter your github username:", name: "inUser" },
    { type: "input", message: "Please enter your email address:", name: "inEmail" },
  ];
  // pass our array of questions and our array of licenses to the runinquirer function
  runInquirer(arrLicense, arrQuestions);
}

function runInquirer(arrLicense, arrQuestions) {
  inquirer //Run inquirer prompt for each question in the array of questions
    .prompt(arrQuestions)
    .then((response) => {
      const licenseKey = arrLicense.find((val) => val.Name === response.inLicense);
      // create our filename based off the project name
      let fileName = `./READMEs/${response.inTitle.replaceAll(" ", "-")}-README.md`;
      writeToFile(fileName, response, licenseKey);
    });
}

// I wanted a way to retrieve the license lists from githubs API, so I did a bit of research and with the help of xpert
// was able to figure out how to get fetch requests workign using node-fetch, note the syntax is the same as an HTML fetch
// but requires the added node-fetch object initialized above using version 2 (npm i node-fetch@2):
function init() {
  // initialize the array to store license info
  let arrLicenses = [];
  fetch("https://api.github.com/licenses") //fetch the license info from github API
    .then((response) => {
      if (!response.ok) {
        // response no good display error
        console.error(`Error:${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      // data is good lets get the values we want and store in an array of objects
      for (let arr of data) {
        arrLicenses.push({ Name: arr.name, Key: arr.key });
      }
      // push a final value that allows users to select none as their license
      arrLicenses.push({ Name: "None", Key: "" });
      // run our next function to create questions used to prompt the user
      createArray(arrLicenses);
    })
    .catch((error) => {
      console.error(`Unable to connect to github APIs. Error: ${error}`);
    });
}

// Function call to initialize app
init();
