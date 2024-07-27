// If there is no license, return an empty string
function renderLicenseBadge(short) {
  const imgBadge = `https://img.shields.io/badge/License:-${short.replaceAll(" ", "_").replaceAll("-", "_")}-red`;
  return imgBadge;
}

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
      return { url: data.html_url, short: data.spdx_id, desc: data.description };
    })
    .catch((error) => {
      console.error(`Unable to connect to github APIs. Error: ${error}`);
      throw error;
    });
}

// If there is no license => IF THERE IS NO LICENSE this function will never be called
function renderLicenseSection(license) {
  return renderLicenseLink(license)
    .then((value) => {
      const imgValue = renderLicenseBadge(value.short);
      return { Badge: `[![License:](${imgValue})](${value.url})`, Desc: value.desc };
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
      throw err;
    });
}

// recieve the input data from the user and the array containing license info
function generateMarkdown(input, licenseKey) {
  // if there is a license, redirect to renderlicense functions
  if (licenseKey && licenseKey.Key) {
    return renderLicenseSection(licenseKey)
      .then((data) => {
        return generateMarkdownBody(input, data);
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
        return "";
      });
  }
  // there is no license so we only pass the input
  else {
    // make sure to return a promise so the calling function can use then on the return value
    return Promise.resolve(generateMarkdownBody(input));
  }
}

// create and return a template string with the data passed via input parameter
function generateMarkdownBody(input, licenseData) {
  //inTitle inDecription inInstall inUsage licenseData (license) inContribute inTesting inUser inEmail
  let strMD = `# ${input.inTitle}`;
  if (licenseData) strMD += `           ${licenseData.Badge}\n`;
  strMD += `## Table of Contents\n`;
  strMD += `- [Description](#description)\n`;
  strMD += `- [Installation](#installation-instructions)\n`;
  strMD += `- [Usage](#usage-information)\n`;
  strMD += `- [Contributing](#contribution-guidelines)\n`;
  strMD += `- [Testing](#test-instructions)\n`;
  if (licenseData) strMD += `- [License](#license-info)\n`;
  strMD += `- [Contact Me](#questions)\n`;
  strMD += `## Description\n ${input.inDecription}\n`;
  strMD += `## Installation Instructions\n ${input.inInstall}\n`;
  strMD += `## Usage Information\n ${input.inUsage}\n`;
  strMD += `## Contribution Guidelines\n ${input.inContribute}\n`;
  strMD += `## Test Instructions\n ${input.inTesting}\n`;
  if (licenseData) strMD += `## License Info\n ${licenseData.Desc}\n`;
  strMD += `## Questions\n Contact me @ GitHub: [${input.inUser}](https://github.com/${input.inUser}) or Email: ${input.inEmail}`;
  return strMD;
}
//
module.exports = generateMarkdown;
