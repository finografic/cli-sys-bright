# @finografic/sys-cli-bright

**Ubuntu custom system settings via the CLI: display brightness + backlight**

## Install

```sh
$ npm install --global @finografic/sys-bright
```

## Notes

- Changing backlight value requires write access to (Ubuntu) system file:
 `/sys/class/backlight/intel_backlight/brightness`
- `bright` therefore prompts user password for one-time permission to write to this file.
- The only content of this system file is a single numeric value for the backlight setting.

## Usage

```sh
 
  USAGE:
    $ bright {value}

  POSSIBLE VALUES:
    {string} min | max | low | high | default
    {number} 0.4 - 1.3        # infers brightness value
    {number} > 2 AND <= 5273  # infers backlight value
    
  EXAMPLES:
    $ bright min
    # { brightness: 0.4, backlight: 600 }
    $ bright max
    # { brightness: 1.3, backlight: 5273 }
    $ bright 0.8 
    # { brightness: 0.8, backlight: 2510, inferredSetting: "brightness" }
    $ bright 3000
    # { brightness: 0.61, backlight: 3000, inferredSetting: "backlight" }

```
