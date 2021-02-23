import chalk from 'chalk';

import { brightness, backlight, flags } from './config';
import { calcBrightnessToBacklight, calcBacklightToBrighness } from './utilsCalc';
import {
  log,
  logInferredBrightnessLow,
  logInferredBrightnessHigh,
  logInferredBacklightLow,
  logInferredBacklightHigh,
  logInferredDefaults,
  logInvalidInput,
  logValueTooLow,
  logValueTooHigh
} from './logging';

/**
 * Uses numeric value to infer 'brightness' or 'backlight'.
 * Return calculed values 'brightness' or 'backlight', based on inference.
 * @param {number} input - User input, already determined to be numeric.
 */
export const getNumericValues = (input) => {
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
 * @param {string} [input] - User input always enters as type string.
 * @param {object} [inputFlags] - User supplied flags.
 */
export const getParsedInput = (input) => {
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

export const getFlagValue = (flagKey, flagValue, flagTarget) => {
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
export const getParsedFlags = (inputFlags) => {
  // HANDLE inputFlags ===================================================== //

  const validFlags = Object.keys(flags);
  const inputFlagsValid = {};

  if (inputFlags) {
    for (const flag of Object.keys(inputFlags)) {
      let flagValue = inputFlags[flag];
      const isValidFlag = validFlags.includes(flag);
      if (isValidFlag) {
        if (flag === 'brightness') flagValue = getFlagValue(flag, flagValue, brightness);
        if (flag === 'backlight') flagValue = getFlagValue(flag, flagValue, backlight);
        inputFlagsValid[flag] = Number(flagValue[flag]);
      }
    }
  }

  return {
    brightness: inputFlagsValid.brightness || brightness.default,
    backlight: inputFlagsValid.backlight || backlight.default,
  };
};
