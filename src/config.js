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

meow(`
  ${chalk.cyan.bold('USAGE:')}
    $ bright ${chalk.cyan('{value}')}

  ${chalk.cyan.bold('POSSIBLE VALUES:')}
    ${chalk.cyan('{string}')} min | max | low | high | default
    ${chalk.cyan('{number}')} ${brightness.min} - ${brightness.max} ${chalk.grey.bold('(infers brightness value)')}
    ${chalk.cyan('{number}')} > ${brightness.trigger} AND <= ${backlight.max} ${chalk.grey.bold(
  '(infers backlight value)'
)}
      
  ${chalk.cyan.bold('EXAMPLES:')}
    $ bright min
    ${chalk.grey.bold('{ brightness: 0.4, backlight: 600 }')}
    $ bright max
    ${chalk.grey.bold('{ brightness: 1.3, backlight: 5273 }')}
    $ bright 0.8 
    ${chalk.grey.bold('{ brightness: 0.8, backlight: 2510, inferredSetting: "brightness" }')}
    $ bright 3000
    ${chalk.grey.bold('{ brightness: 0.61, backlight: 3000, inferredSetting: "backlight" }')}

`);
