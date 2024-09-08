
function run(cmd) {
  return execSync(cmd, 'utf8').toString().trim();
}
module.exports.run = run;

function println(str) {
  process.stderr.write(str + '\n');
}
module.exports.println = println;

function output(str) {
  process.stdout.write(str);
}
module.exports.output = output;
