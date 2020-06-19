# VTTColorSettings

Adds color picker as settings option in Foundry VTT to use as library for module developers.

## Preview

![Preview](https://i.imgur.com/k3F43B4.gif)

&nbsp;

## Usage

Copy colorSetting.js into your project, make sure colorSettings.js and vanilla-picker.mjs are in the same folder.

To make a new color setting, make a new `ColorSetting` object:

```javascript
import ColorSetting from "./colorSetting.js"

//                  module        key             options
new ColorSetting("myModule", "myColorSetting", {
    name: "My Color Setting",      // The name of the setting in the settings menu
    label: "Color Picker",         // The text label used in the button
    restricted: false,             // Restrict this setting to gamemaster only?
    defaultColor: "#000000ff",     // The default color of the setting
    scope: "client"                // The scope of the setting
})
```
_Note:_ You need to have your Module/System built in `esmodules` way for `import` to work.

This creates a new setting that you can read with:

```javascript
game.settings.get("myModule", "myColorSetting") // Returns color code, eg: "#000000ff"
```

## Changelog

Check the [Changelog](https://github.com/ardittristan/VTTColorSettings/blob/master/CHANGELOG.md)
