import chalk from 'chalk';
import sudo from 'sudo-prompt';
import updateNotifier from 'update-notifier';
import { brightness, backlight, sysFileBrightness, cli, flags } from './config';
import {
  log,
  logInferredBrightnessLow,
  logInferredBrightnessHigh,
  logInferredBacklightLow,
  logInferredBacklightHigh,
  logInferredDefaults,
  logInvalidInput,
  logSummary
} from './logging';

const pkg = require('../package.json');

updateNotifier({ pkg }).notify();

// MAIN CLI FLOW ========================== //

export async function bright(argv) {
  console.log('CLI ARGV:', argv);

  // const arg = argv[2]; // ONLY ACCEPT *SINGLE* ARGUMENT. USE FIRST ARG, IGNORE REST.
  const inputArg = cli.input[0]; // ONLY ACCEPT *SINGLE* ARGUMENT. USE FIRST ARG, IGNORE REST.
  const inputFlags = Object.keys(cli.flags).length ? cli.flags : null;

  // SET BACKLIGHT -> BRIGHTNESS FACTOR
  const backlightRange = backlight.max - backlight.min;
  const backlightMidRange = backlightRange / 2 + backlight.min;

  const calcBacklightToBrighness = (backlightValue) => {
    const backlightToBrightnessFactor = 0.5 / backlightMidRange;
    let brightnessValue;
    brightnessValue = backlightToBrightnessFactor * (backlightValue + backlight.min);
    brightnessValue = brightnessValue < brightness.min ? brightness.min : brightnessValue;
    return Number(brightnessValue.toFixed(2));
  };

  const calcBrightnessToBacklight = (brightnessValue) => {
    let backlightValue;
    backlightValue = brightnessValue * backlightRange - backlight.min;
    backlightValue = Math.floor(backlightValue * brightnessValue);
    backlightValue = backlightValue < backlight.min ? backlight.min : backlightValue;
    return backlightValue;
  };

  /**
   * Uses numeric value to infer 'brightness' or 'backlight'.
   * Return calculed values 'brightness' or 'backlight', based on inference.
   * @param {number} input - User input, already determined to be numeric.
   */
  const getNumericValues = (input) => {
    switch (true) {
      case input < brightness.min:
        logInferredBrightnessLow();
        return {
          brightness: brightness.min,
          backlight: backlight.min,
          inferredSetting: 'brightness',
        };
      case input >= brightness.min && input < brightness.default:
        return {
          brightness: input,
          backlight: calcBrightnessToBacklight(input),
          inferredSetting: 'brightness',
        };

      case input >= brightness.default && input <= brightness.max:
        return {
          brightness: input,
          backlight: backlight.max,
          inferredSetting: 'brightness',
        };

      case input > brightness.max && input <= brightness.trigger:
        logInferredBrightnessHigh();
        return {
          brightness: brightness.max,
          backlight: backlight.max,
          inferredSetting: 'brightness',
        };
      // INPUT: BACKLIGHT
      case input < backlight.min:
        logInferredBacklightLow();
        return {
          brightness: brightness.min,
          backlight: backlight.min,
          inferredSetting: 'backlight',
        };
      case input >= backlight.min && input <= backlight.max:
        return {
          brightness: calcBacklightToBrighness(input),
          backlight: input,
          inferredSetting: 'backlight',
        };
      case input > backlight.max:
        logInferredBacklightHigh();
        return {
          brightness: brightness.default,
          backlight: backlight.max,
          inferredSetting: 'backlight',
        };
      default:
        logInferredDefaults();
        return {
          brightness: brightness.default,
          backlight: backlight.default,
          inferredSetting: 'backlight',
        };
    }
  };

  /**
   * Determine if user input is a predefined default, numeric, or other.
   * @param {string} input - User input always enters as string.
   */
  const getParsedInput = (input) => {
    if ([
      'min',
      'max',
      'low',
      'high', 
    ].includes(input)) {
      return {
        brightness: brightness[input],
        backlight: backlight[input],
      };
    } else if (!isNaN(Number(input))) {
      return getNumericValues(Number(input));
    } else {
      if (input !== undefined && input !== 'default') logInvalidInput();
      logInferredDefaults();
      return {
        brightness: brightness.default,
        backlight: backlight.default,
        inferredSetting: 'backlight',
      };
    }
  };

  const parsedInput = getParsedInput(inputArg);
  brightness.setting = parsedInput.brightness;
  backlight.setting = parsedInput.backlight;
  log(chalk.bold.grey('PARSED INPUT:'), parsedInput);

  // ============================================================== //
  // EXECUTE CHANGES VIA BASH

  const cmdBacklight = `echo ${backlight.setting} | tee ${sysFileBrightness}`;
  const cmdBrightness = `xrandr --output eDP-1-1 --brightness ${brightness.setting}`;

  if (inputFlags) {
    console.log('CLI FLAGS 2:', Object.keys(flags));
    console.log('cli.flags 2:', cli.flags);
  }

  // EXECUTE !! SET BACKLIGHT
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
