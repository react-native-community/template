const {execSync} = require('child_process');
const {run, println, output} = require('./utils');
const semver = require('semver');

const isReleaseCandidate = /-rc\.\d+/;
const isNightly = /-nightly-/;

// What this does:
// 1. Take the version of react, use the MAJOR.MINOR
// - /nightly/ -> MAJOR.MINOR.PATCH-nightly-YYYYNN-HASH
// - /-rc.N/   -> MAJOR.MINOR.PATCH-rc.N-HASH
// - ELSE: continue
// 2. Look for the latest version of the template with that MAJOR.MINOR
// - No version -> then set to MAJOR.MINOR.0
// - MAJOR.MINOR.PATCH -> MAJOR.MINOR.PATCH+1

function main(version) {
  if (version == null) {
    println('USAGE: bumpTemplateVersion.js <react native version>');
    process.exit(1);
  }

  println(`🔍 Figuring out what type release '${version}' is.`);

  if (isReleaseCandidate.test(version)) {
    println('✅ Release Candidate');
    // Append a sha, so if we need to re-release for a RC we don't conflict:
    // 0.75.0-rc.1-<sha>
    console.log(`${version}-${run('git rev-parse --short HEAD')}`);
    process.exit(0);
  }

  if (isNightly.test(version)) {
    println('✅ Nightly Candidate');
    // Once a day, we're not going to get conflicts using the given nightly tag
    console.log(version);
    process.exit(0);
  }

  // Find current version of template that matches this version of react-native.
  if (semver.valid(version)) {
    const {major, minor, patch} = semver.parse(version);
    const majorMinor = `${major}.${minor}`;
    try {
      const latest= JSON.parse(run(`npm show --json @react-native-community/template@^${majorMinor}`)).pop();

      if (!latest.version) {
        console.log(`${majorMinor}.0`);
        process.exit(0);
      }

      const c = semver.parse(latest.version);

      console.log(`${c.major}.${c.minor}.${c.patch + 1}`);
      process.exit(0);
    } catch (e) {
      println(e);
      // Unpublished
      console.log(`${majorMinor}.0`);
      process.exit(0);
    }
  }

  println('🔥 Unknown type of release version');
  process.exit(1);
}

main(process.argv[2]);
