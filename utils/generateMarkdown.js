// TODO: Create a function that returns a license badge based on which license is passed in
// If there is no license, return an empty string
function renderLicenseBadge(short) {
  const imgBadge = `https://img.shields.io/badge/License:-${short.replaceAll(" ", "_").replaceAll("-", "_")}-red`;
  return imgBadge;
}

// TODO: Create a function that returns the license link
// If there is no license => IF THERE IS NO LICENSE this function will never be called
function renderLicenseLink(license) {
  return fetch(`https://api.github.com/licenses/${license.Key}`)
    .then((response) => {
      if (!response.ok) {
        console.error(`Error:${response.statusText}`);
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      return { url: data.html_url, short: data.spdx_id };
    })
    .catch((error) => {
      console.error(`Unable to connect to github APIs. Error: ${error}`);
      throw error;
    });
}

// TODO: Create a function that returns the license section of README
// If there is no license => IF THERE IS NO LICENSE this function will never be called
function renderLicenseSection(license) {
  return renderLicenseLink(license)
    .then((value) => {
      const imgValue = renderLicenseBadge(value.short);
      return `[![License:](${imgValue})](${value.url})`;
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
      throw err;
    });
}

// TODO: Create a function to generate markdown for README
function generateMarkdown(input, licenseKey) {
  // if there is a license, redirect to renderlicense functions
  if (licenseKey.Key) {
    return renderLicenseSection(licenseKey)
      .then((data) => {
        return generateMarkdownBody(input, data);
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
        return "";
      });
  }
  // there is no license so we handle the code execution here
  else {
    return generateMarkdownBody(input);
  }
}

// create and return a template string with the data passed via input parameter
function generateMarkdownBody(input, licenseData) {
  console.log("--------------------");
  //inTitle inDecription inInstall inUsage licenseData (license) inContribute inTesting inUser inEmail
  console.log(input.inTitle); 
  let strMD = `#${inTitle}`
  console.log(licenseData); 
  return "";
}

// THEN a high-quality, professional README.md is generated with the title of my project and sections entitled Description, Table of Contents, Installation,
// Usage, License, Contributing, Tests, and Questions
// WHEN I enter my project title
// THEN this is displayed as the title of the README
// WHEN I enter a description, installation instructions, usage information, contribution guidelines, and test instructions
// THEN this information is added to the sections of the README entitled Description, Installation, Usage, Contributing, and Tests
// WHEN I choose a license for my application from a list of options
// THEN a badge for that license is added near the top of the README and a notice is added to the section of the README entitled License that explains which license the application is covered under
// WHEN I enter my GitHub username
// THEN this is added to the section of the README entitled Questions, with a link to my GitHub profile
// WHEN I enter my email address
// THEN this is added to the section of the README entitled Questions, with instructions on how to reach me with additional questions
// WHEN I click on the links in the Table of Contents
// THEN I am taken to the corresponding section of the README


module.exports = generateMarkdown;
