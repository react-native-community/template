#!/usr/bin/env node

const path = require("path");

// ANSI escape codes for colors and formatting
const reset = "\x1b[0m";
const cyan = "\x1b[36m";
const bold = "\x1b[1m";

function printInitScript() {
  const projectDir = path.resolve();

  const instructions = `
    ${cyan}Run instructions for ${bold}visionOS${reset}${cyan}:${reset}
    • cd "${projectDir}/visionos"

    • Install Cocoapods
      • bundle install # you need to run this only once in your project.
      • bundle exec pod install
      • cd ..
      
    • npx react-native run-visionos
    `;

  console.log(instructions);
}

printInitScript();
