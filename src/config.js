

 import meow from 'meow';

  meow(`
  Usage
    $ sys

  Options
    --name  Your name

  Examples
    $ sys --name=Jane
    Hello, Jane
`);

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