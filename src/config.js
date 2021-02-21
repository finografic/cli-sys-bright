import meow from 'meow';
import chalk from 'chalk';

export const brightness = {
  default: 1,
  min: 0.4,
  low: 0.6,
  high: 1.1,
  max: 1.3,
  trigger: 2,
  setting: NaN,
};

export const backlight = {
  default: 5273,
  min: 600,
  low: 800,
  high: 5273,
  max: 5273,
  setting: NaN,
};

export const sysFileBrightness = '/sys/class/backlight/intel_backlight/brightness';

// CLI DOCS --help

const $ = chalk.cyan('$');
const docsTitle = (val) => {
  return chalk.cyan.bold(val);
};

const docsValue = (val) => {
  return chalk.green.bold(val);
};
const docsGrey = (val) => {
  return chalk.grey(val);
};

const helpDocs = `
${docsTitle('USAGE:')}
  ${$} bright ${docsValue('{value}')}

${docsTitle('POSSIBLE VALUES:')}
  ${chalk.cyan('{string}')} min | max | low | high | default
  ${chalk.cyan('{number}')} ${brightness.min} - ${brightness.max} \t\t${docsGrey('(infers brightness value)')}
  ${chalk.cyan('{number}')} > ${brightness.trigger} AND <= ${backlight.max} \t${docsGrey('(infers backlight value)')}
    
${docsTitle('EXAMPLES:')}
  ${$} bright ${docsValue('min')}
  ${docsGrey('{ brightness: 0.4, backlight: 600 }')}
  ${$} bright ${docsValue('max')}
  ${docsGrey('{ brightness: 1.3, backlight: 5273 }')}
  ${$} bright ${docsValue('0.8')}
  ${docsGrey('{ brightness: 0.8, backlight: 2510, inferredSetting: "brightness" }')}
  ${$} bright ${docsValue('3000')}
  ${docsGrey('{ brightness: 0.61, backlight: 3000, inferredSetting: "backlight" }')}

`;
meow(helpDocs);
