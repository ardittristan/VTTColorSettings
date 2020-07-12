# VTTColorSettings

Adds color picker as settings option and form option in Foundry VTT to use as library for module developers.

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

&nbsp;

### Setting

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

&nbsp;

### Form

To add a color picker to a html form, add `is="colorpicker-input"` to a text input field. If you want it to be a permanently open color picker you can give it the id `permanent`

Example:

```html
<input type="text" name="clickable" is="colorpicker-input">
<input type="text" name="alwaysOn" is="colorpicker-input" id="permanent">
```

When the user clicks the OK button, it puts the color code in the text field in hex8 form (eg: `#123456ff`)

_A form color picker does not require a `window.Ardittristan.ColorSetting` object since it just outputs to the text input box._

## Changelog

Check the [Changelog](https://github.com/ardittristan/VTTColorSettings/blob/master/CHANGELOG.md)

## Libraries used

1. [vanilla-picker](https://github.com/Sphinxxxx/vanilla-picker)
2. [html2canvas](https://github.com/niklasvh/html2canvas)
