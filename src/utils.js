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
  logSummary
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
