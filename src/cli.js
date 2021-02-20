import chalk from 'chalk';
import sudo from 'sudo-prompt';
import updateNotifier from 'update-notifier';
import { brightness, backlight, sysFileBrightness } from './config';
import {
  logInferredBrightnessLow,
  logInferredBrightnessHigh,
  logInferredBacklightLow,
  logInferredBacklightHigh,
  logInferredDefaults,
  logSummary
} from './logging';

const pkg = require('../package.json');

updateNotifier({ pkg }).notify();

// MAIN CLI FLOW ========================== //

export async function cli(args) {
  args = process.argv.slice(2);

  console.log(args);
  // console.log(argv);

  // SET BACKLIGHT -> BRIGHTNESS FACTOR
  const backlightRange = backlight.max - backlight.min;
  const backlightMidRange = backlightRange / 2 + backlight.min;
  const brightnessRange = brightness.max - brightness.min;
  const brightnessMidRange = brightnessRange + brightness.min;

  const calcBacklightToBrighness = () => {
    const backlightToBrightnessFactor = 0.5 / backlightMidRange;
    let brightnessValue;
    brightnessValue = backlightToBrightnessFactor * (Number(args.value) + backlight.min);
    brightnessValue = brightnessValue < brightness.min ? brightness.min : brightnessValue;
    return Number(brightnessValue.toFixed(2));
  };

  const calcBrightnessToBacklight = () => {
    let backlightValue;
    backlightValue = Number(args.value) * backlightRange - backlight.min;
    backlightValue = Math.floor(backlightValue * Number(args.value));
    backlightValue = backlightValue < backlight.min ? backlight.min : backlightValue;
    return backlightValue;
  };

  const getParsedInput = (input) => {
    switch (true) {
      // BRIGHTNESS + BACKLIGHT SET KEYS
      case input === 'low':
      case input === 'high':
      case input === 'min':
      case input === 'max':
        return {
          brightness: brightness[input],
          backlight: backlight[input],
        };
      // BRIGHTNESS INFERENCES !!
      case input < brightness.min:
        logInferredBrightnessLow();
        return {
          brightness: brightness.min,
          backlight: backlight.min,
          inferredSetting: 'brightness',
        };
      case input >= brightness.min && input < brightness.default:
        return {
          brightness: Number(input),
          backlight: calcBrightnessToBacklight(),
          inferredSetting: 'brightness',
        };

      case input >= brightness.default && input <= brightness.max:
        return {
          brightness: Number(input),
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
          brightness: calcBacklightToBrighness(),
          backlight: Number(input),
          inferredSetting: 'backlight',
        };
      case input > backlight.max:
        console.log(chalk.magenta('CLAUSE 8'));
        logInferredBacklightHigh();
        return {
          brightness: brightness.default,
          backlight: backlight.max,
          inferredSetting: 'backlight',
        };
      // case input === undefined: // NOT NEEDED!
      default:
        logInferredDefaults();
        return {
          brightness: brightness.default,
          backlight: backlight.default,
          inferredSetting: 'backlight',
        };
    }
  };

  const parsedInput = getParsedInput(args[0]);
  brightness.setting = parsedInput.brightness;
  backlight.setting = parsedInput.backlight;
  console.log(chalk.bold.grey('PARSED INPUT:'), parsedInput);

  // ============================================================== //
  // EXECUTE CHANGES VIA BASH

  const cmdBacklight = `echo ${backlight.setting} | tee ${sysFileBrightness}`;
  const cmdBrightness = `xrandr --output eDP-1-1 --brightness ${brightness.setting}`;

  // EXECUTE !! SET BACKLIGHT
  sudo.exec(cmdBacklight, (error, stdout) => {
    if (error) throw new Error(error);
    const { spawn } = require('child_process');
    // EXECUTE: SET BRIGHTNESS
    /*
    spawn(cmdBrightness, {
      stdio: 'inherit',
      shell: true,
    });
    */
    // logSummary({backlight, brightness});
  });

  // *** END *** ======================================= //
}

/*
(async () => {
  if (NODE_ENV === 'development') {
    const startServer = require('./server').startServer;
    await startServer();
  }
  let id = await cliAskBuildNumber();
  // let id = 3820;
  try {
    let AUTOS = await getAutosMainObject(id);
    await handleFailedJobs(AUTOS);
  } catch (err) {
    console.log('err');
    process.exit(1);
  }
  nl();
  process.exit(0);
})();
*/
