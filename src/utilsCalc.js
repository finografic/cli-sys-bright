import chalk from 'chalk';

import { brightness, backlight, sysFileBrightness, cli, flags } from './config';
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
