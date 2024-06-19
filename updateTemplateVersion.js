import { readFile, writeFile } from "fs";

/**
 * Function to get the Nightly version of the package, similar to the one used in React Native.
 * Version will look as follows:
 * `0.75.0-nightly-20241010-abcd1234`
 */
function getNightlyVersion(originalVersion) {
  const version = originalVersion.split("-")[0];
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  // Get the sha fromt he current commit on github actions
  const sha = process.env.GITHUB_SHA.slice(0, 7);
  return `${version}-nightly-${year}${month}${day}-${sha}`;
}

if (!process.argv[2]) {
  console.error("Please provide a version to update the template to.");
  process.exit(1);
}
const targetVersion = process.argv[2];

// We first update version of the template we're about to publish.
readFile("package.json", "utf8", (err, data) => {
  if (err) throw err;
  const packageJson = JSON.parse(data);
  if (targetVersion === "nightly") {
    packageJson.version = getNightlyVersion(packageJson.version);
  } else {
    packageJson.version = targetVersion;
  }
  const updatedData = JSON.stringify(packageJson, null, 2);
  writeFile("package.json", updatedData, "utf8", (err) => {
    if (err) throw err;
    console.log(`Template version updated to ${packageJson.version}`);
  });
});

// And then we update the version of the dependencies in the template.
// To be `nightly` as well.
readFile("template/package.json", "utf8", (err, data) => {
  if (err) throw err;
  const packageJson = JSON.parse(data);
  packageJson.dependencies["react-native"] = targetVersion;
  Object.keys(packageJson.devDependencies).forEach((key) => {
    if (key.startsWith("@react-native")) {
      packageJson.devDependencies[key] = targetVersion;
    }
  });
  const updatedData = JSON.stringify(packageJson, null, 2);
  writeFile("template/package.json", updatedData, "utf8", (err) => {
    if (err) throw err;
    console.log(`Project dependencies updated to ${targetVersion}`);
  });
});
