const {execSync} = require('child_process');
const semver = require('semver');

function run(version) {
  return execSync(`./bumpedTemplateVersion.sh ${version}`, { cwd: 'scripts', stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
}

describe('bumpTemplateVersion.sh', () => {

  it('nightlies stay the same', () => {
    expect(run('0.75.0-nightly-20240606-4324f0874')).toEqual('0.75.0-nightly-20240606-4324f0874');
  });

  it('release candidates appended with a sha', () => {
    expect(run('0.74.0-rc.3')).toMatch(/0\.74\.0-rc\.3-.+/);
  });

  it('assumed it is the first version when no matching MAJOR.MINOR', () => {
    const versionShouldNeverExist = '1111.0.1';
    expect(run(versionShouldNeverExist)).toEqual('1111.0.0');
  });

  it('bumps the patch if a version of the template already exists', async () => {
    // This sucks I know:
    const {version} = await fetch('https://registry.npmjs.com/@react-native-community/template/latest').then(resp => resp.json());
    const {major, minor, patch} = semver.parse(version);
    expect(run(`${major}.${minor}.${patch}`)).toEqual(`${major}.${minor}.${patch+1}`);
  });

});
