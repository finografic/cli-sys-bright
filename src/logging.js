import chalk from 'chalk';

export const log = console.log;

export const logValueTooLow = (target) => {
  log(chalk.red(`Input value for ${chalk.bold(target)} too low.`));
  log(chalk.cyan(`${chalk.bold('MIN')} setting will be used.`));
};

export const logValueTooHigh = (target) => {
  log(chalk.red(`Input value for ${chalk.bold(target)} too hight.`));
  log(chalk.cyan(`${chalk.bold('MAX')} setting will be used.`));
};

export const logInferredBrightnessLow = () => {
  log(chalk.red('Input value too low.'));
  log(chalk.cyan.bold('Brightness input inferred.'));
  log(chalk.cyan(`${chalk.bold('MIN')} setting will be used.`));
};

export const logInferredBrightnessHigh = () => {
  log(chalk.red('Input value too high.'));
  log(chalk.cyan.bold('Brightness input inferred.'));
  log(chalk.cyan(`${chalk.bold('MAX')} setting will be used.`));
};

export const logInferredBacklightLow = () => {
  log(chalk.red('Input value too low.'));
  log(chalk.cyan.bold('Backlight input inferred.'));
  log(chalk.cyan(`${chalk.bold('MIN')} setting will be used.`));
};

export const logInferredBacklightHigh = () => {
  log(chalk.red('Input value too high.'));
  log(chalk.cyan.bold('Backlight input inferred.'));
  log(chalk.cyan(`${chalk.bold('MAX')} setting will be used.`));
};

export const logInferredDefaults = () => {
  log(chalk.cyan(`${chalk.bold('DEFAULT')} settings will be used.`));
};

export const logInvalidInput = () => {
  log(chalk.red('Invalid input value.'));
};

export const logSummary = ({ backlight, brightness }) => {
  const stringMinxMaxBacklight = chalk.bold.grey(`(${backlight.min} - ${backlight.max})`);
  const stringMinxMaxBrightness = chalk.bold.grey(`(${brightness.min} - ${brightness.max})`);
  log(`backlight:  ${chalk.bold.yellow(backlight.setting)} ${stringMinxMaxBacklight}`);
  log(`brightness: ${chalk.bold.yellow(brightness.setting)} ${stringMinxMaxBrightness}`);
};
