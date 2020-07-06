# VTTColorSettings

Adds color picker as settings option in Foundry VTT to use as library for module developers.

## Preview

![Preview](https://i.imgur.com/k3F43B4.gif)

&nbsp;

## Usage

Install the `lib - Color Settings` (this) module.

*Optional:*  
Add a tester to your module that checks if color settings is installed and notifies the user if it isn't:

```javascript
Hooks.once('ready', () => {
    try{window.Ardittristan.ColorSetting.tester} catch {
        ui.notifications.notify('Please make sure you have the "lib - ColorSettings" module installed', "error", {permanent: true});
    }
});
```

To make a new color setting, make a new `ColorSetting` object:

```javascript
//                                     module        key             options
new window.Ardittristan.ColorSetting("myModule", "myColorSetting", {
    name: "My Color Setting",      // The name of the setting in the settings menu
    hint: "Click on the button",   // A description of the registered setting and its behavior
    label: "Color Picker",         // The text label used in the button
    restricted: false,             // Restrict this setting to gamemaster only?
    defaultColor: "#000000ff",     // The default color of the setting
    scope: "client",               // The scope of the setting
    onChange: (value) => {}        // A callback function which triggers when the setting is changed
})
```

This creates a new setting that you can read with:

```javascript
game.settings.get("myModule", "myColorSetting") // Returns color code, eg: "#000000ff"
```

## Changelog

Check the [Changelog](https://github.com/ardittristan/VTTColorSettings/blob/master/CHANGELOG.md)

## Libraries used

1. [vanilla-picker](https://github.com/Sphinxxxx/vanilla-picker)
2. [html2canvas](https://github.com/niklasvh/html2canvas)
