const fs = require("fs");
const { npmMaterializeVersion } = require("./lib/lib.js");

function updateDependencies(pkgJson, update) {
  console.log("Changing package.json dependencies:");

  for (const [pkg, value] of Object.entries(update.dependencies ?? {})) {
    const old = pkgJson.dependencies[pkg];
    if (old) {
      console.log(` - ${pkg}: ${old} → ${value}`);
    } else {
      console.log(` - ${pkg}: ${value}`);
    }
    pkgJson.dependencies[pkg] = value;
  }

  for (const [pkg, value] of Object.entries(update.devDependencies ?? {})) {
    const old = pkgJson.devDependencies[pkg];
    if (old) {
      console.log(` - ${pkg}: ${old} → ${value}`);
    } else {
      console.log(` - ${pkg}: ${value}`);
    }
    pkgJson.devDependencies[pkg] = value;
  }

  return pkgJson;
}

const REACT_NATIVE_SCOPE = "@react-native/";

/**
 * Packages that are scoped under @react-native need a consistent version
 */
function normalizeReactNativeDeps(deps, version) {
  const updated = {};
  for (const key of Object.keys(deps ?? {}).filter((pkg) =>
    pkg.startsWith(REACT_NATIVE_SCOPE),
  )) {
    updated[key] = version;
  }
  return updated;
}

async function main(version) {
  const PKG_JSON_PATH = "template/package.json";
  // Update the react-native dependency if using the new @react-native-community/template.
  // We can figure this out as it ships with react-native@1000.0.0 set to a dummy version.
  let pkgJson = JSON.parse(fs.readFileSync(PKG_JSON_PATH, "utf8"));

  // Materialize a tag to a version.  E.g. next -> 0.75.0-rc.0
  const concreteVersion = await npmMaterializeVersion("react-native", version);
  console.log(
    `Normalizing: react-native@${version} -> react-native@${concreteVersion}`,
  );

  pkgJson = updateDependencies(pkgJson, {
    dependencies: {
      "react-native": concreteVersion,
      ...normalizeReactNativeDeps(pkgJson.dependencies, concreteVersion),
    },
    devDependencies: {
      ...normalizeReactNativeDeps(pkgJson.devDependencies, concreteVersion),
    },
  });

  const updated = JSON.stringify(pkgJson, null, 2);
  console.log(`Writing update package.json to ${PKG_JSON_PATH}:\n\n${updated}`);
  fs.writeFileSync(PKG_JSON_PATH, updated);
}

if (require.main === module) {
  if (process.argv.length < 3) {
    console.log(`USAGE: updateReactNativeVersion.js <version>

Updates 'react-native' and '@react-native/' scoped packages to a common version within
the template.
`);
    process.exit(1);
  }
  main(process.argv.pop()).catch((e) => {
    throw e;
  });
}
