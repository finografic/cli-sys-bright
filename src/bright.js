import chalk from 'chalk';
import sudo from 'sudo-prompt';
import updateNotifier from 'update-notifier';
import { brightness, backlight, sysFileBrightness, cli, flags } from './config';
import { getParsedFlags, getParsedInput } from './utils';
import { log, logSummary } from './logging';

const pkg = require('../package.json');

updateNotifier({ pkg }).notify();

// MAIN CLI FLOW ========================== //

export async function bright() {
  const inputArg = cli.input[0]; // ONLY ACCEPT *SINGLE* ARGUMENT. USE FIRST ARG, IGNORE REST.
  const inputFlags = Object.keys(cli.flags).length ? cli.flags : null;

  // ============================================================== //
  // PARSE ARG AND/OR FLAG INPUT VALUES

  let parsedValues;
  if (inputArg && inputFlags) {
    log(chalk.red.bold('Too many arguments! First arg will be used; flags will be ignored.'), inputArg);
    parsedValues = getParsedInput(inputArg);
    log(chalk.yellow.bold('PARSED'), parsedValues);
  } else if (inputFlags) {
    console.log('FLAGS PRESENT !! ', inputFlags);
    parsedValues = getParsedFlags(inputFlags);
  } else {
    parsedValues = getParsedInput(inputArg);
  }

  brightness.setting = parsedValues.brightness;
  backlight.setting = parsedValues.backlight;
  log(chalk.bold.grey('PARSED INPUT:'), parsedValues);

  // ============================================================== //
  // EXECUTE CHANGES VIA BASH

  const cmdBacklight = `echo ${backlight.setting} | tee ${sysFileBrightness}`;
  const cmdBrightness = `xrandr --output eDP-1-1 --brightness ${brightness.setting}`;

  sudo.exec(cmdBacklight, (error, stdout) => {
    if (error) throw new Error(error);
    const { spawn } = require('child_process');
    // EXECUTE: SET BRIGHTNESS
    spawn(cmdBrightness, {
      stdio: 'inherit',
      shell: true,
    });
    logSummary({ backlight, brightness });
  });
}
