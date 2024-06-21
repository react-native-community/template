const { execSync } = require('child_process');

const registry = getNpmRegistryUrl();

function getNpmRegistryUrl() {
  try {
    return execSync('npm config get registry').toString().trim();
  } catch {
    return 'https://registry.npmjs.org/';
  }
}

/**
 * Convert an npm tag to a concrete version, for example:
 * - next -> 0.75.0-rc.0
 * - nightly -> 0.75.0-nightly-20240618-5df5ed1a8
 */
async function npmMaterializeVersion(packageName, tagOrVersion) {
  const url = new URL(registry);
  url.pathname = `${packageName}/${tagOrVersion}`;
  const json = await fetch(url).then((resp) => resp.json());
  return json.version;
}

module.exports.npmMaterializeVersion = npmMaterializeVersion;
