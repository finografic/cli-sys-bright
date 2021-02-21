import chalk from 'chalk';
import sudo from 'sudo-prompt';
import updateNotifier from 'update-notifier';
import { brightness, backlight, sysFileBrightness, cli, flags } from './config';
import { getNumericValues } from './utils';
import {
  log,
  logValueTooLow,
  logValueTooHigh,
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
  // const arg = argv[2]; // ONLY ACCEPT *SINGLE* ARGUMENT. USE FIRST ARG, IGNORE REST.
  const inputArg = cli.input[0]; // ONLY ACCEPT *SINGLE* ARGUMENT. USE FIRST ARG, IGNORE REST.
  const inputFlags = Object.keys(cli.flags).length ? cli.flags : null;

  const getFlagValue = (flagKey, flagValue, flagTarget) => {
    switch (true) {
      case isNaN(flagValue) && Object.keys(flagTarget).includes(flagValue):
        return {
          [flagKey]: flagTarget[flagValue],
        };
      case isNaN(flagValue) && !Object.keys(flagTarget).includes(flagValue):
        log(chalk.red(`Flag value ${chalk.bold(flagValue)} is invalid`));
        logInferredDefaults();
        return {
          [flagKey]: flagTarget.default,
        };
      case flagValue < flagTarget.min:
        logValueTooLow(flagKey);
        return {
          [flagKey]: flagTarget.min,
        };
      case flagValue > flagTarget.max:
        logValueTooHigh(flagKey);
        return {
          [flagKey]: flagTarget.max,
        };
      default:
        return {
          [flagKey]: flagValue,
        };
    }
  };

  /**
   * Determine if user input is a predefined default, numeric, or other.
   * @param {string} [input] - User input always enters as type string.
   * @param {object} [inputFlags] - User supplied flags.
   */
  const getParsedFlags = (inputFlags) => {
    // HANDLE inputFlags ===================================================== //

    const validFlags = Object.keys(flags);
    const inputFlagsValid = {};

    if (inputFlags) {
      for (const flag of Object.keys(inputFlags)) {
        log('FLAG >>> ', flag);
        let flagValue = inputFlags[flag];
        log('FLAG VALUE >>> ', flagValue);
        const isValidFlag = validFlags.includes(flag);
        log('FLAG VALID >>> ', isValidFlag);
        if (isValidFlag) {
          if (flag === 'brightness') flagValue = getFlagValue(flag, flagValue, brightness);
          if (flag === 'backlight') flagValue = getFlagValue(flag, flagValue, backlight);

          log('FLAG VALUE PARSED >>> ', flagValue);
          /*
          if (flag === 'brightness') {
            if (isNaN(flagValue)) flagValue = brightness[flagValue] || brightness.default;
          }*/

          /*
          if (isNaN(flagValue)) {
            if (flag === 'brightness') flagValue = brightness[flagValue];
            if (flag === 'backlight') flagValue = backlight[flagValue];
          } else {
            if (flag === 'brightness')
              flagValue = flagValue < brightness.min || flagValue > brightness.max ? brightness.default : flagValue;
            if (flag === 'backlight')
              flagValue = flagValue < backlight.min || flagValue > backlight.max ? backlight.default : flagValue;
          }
          */
          inputFlagsValid[flag] = Number(flagValue);
        } else {
          log(chalk.red(`Flag ${chalk.bold(flag)} is invalid`));
        }
      }
    }

    return {
      brightness: inputFlagsValid.brightness || brightness.default,
      backlight: inputFlagsValid.backlight || backlight.default,
    };

    /*
    if (input && inputFlags) {
      log(chalk.red.bold('Too many arguments! First arg will be used; flags will be ignored.'));
    } else if ((!input || input !== undefined) && Object.entries(inputFlagsValid).length) {
      // return inputFlagsValid;

      const brightnessFlagValue = inputFlagsValid.brightness || brightness.default;

      return {
        brightness: inputFlagsValid.brightness || brightness.default,
        backlight: inputFlagsValid.backlight || backlight.default,
      };
    }
    */
  };

  /**
   * Determine if user input is a predefined default, numeric, or other.
   * @param {string} [input] - User input always enters as type string.
   * @param {object} [inputFlags] - User supplied flags.
   */
  const getParsedInput = (input) => {
    // HANDLE input ===================================================== //

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

  // ============================================================== //

  let parsedValues;
  if (inputArg && inputFlags) {
    log(chalk.red.bold('Too many arguments! First arg will be used; flags will be ignored.'));
    parsedValues = getParsedInput(inputArg);
  } else if (inputFlags) {
    console.log('FLAGS PRESENT !! ', inputFlags);
    parsedValues = getParsedFlags(inputFlags);
  } else {
    parsedValues = getParsedInput(inputArg);
  }

  // const parsedInput = getParsedInput(inputArg, inputFlags);
  // brightness.setting = parsedValues.brightness;
  // backlight.setting = parsedValues.backlight;
  log(chalk.bold.grey('PARSED INPUT:'), parsedValues);

  // ============================================================== //
  // EXECUTE CHANGES VIA BASH

  const cmdBacklight = `echo ${backlight.setting} | tee ${sysFileBrightness}`;
  const cmdBrightness = `xrandr --output eDP-1-1 --brightness ${brightness.setting}`;

  logSummary({ backlight, brightness });
  // EXECUTE !! SET BACKLIGHT
  /*
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
  */
}
