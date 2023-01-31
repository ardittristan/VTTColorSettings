![GitHub All Releases](https://img.shields.io/github/downloads/ardittristan/VTTColorSettings/total)
[![Donate](https://img.shields.io/badge/Donate-PayPal-Green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TF3LJHWV9U7HN)

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
        ui.notifications.notify('Please make sure you have the "lib - ColorSettings" module installed and enabled.', "error");
    }
});
```

<details>

<summary>Using Color Settings as integrated library.</summary>

While it is not recommended to, you can use colorsettings as integrated library in your module. When ran as integrated library, colorsettings only runs if the main colorsettings module isn't enabled/installed.

To install colorsettings as an integrated library, you can import the `colorSettings.js` file, `css` folder and `lib` folder into your project.

Make sure the `css` and `lib` folders are in the same directory as the `colorSettings.js` file.

To make the integrated library work, you'll have to add/merge _(with your own file locations)_:

```json
"esmodules": ["./lib/colorsettings/colorSetting.js"],
"styles": [ "./lib/colorsettings/css/colorpicker.css" ]
```

to your `module.json`.

You'll also have to replace `"colorsettings"` near [this line](https://github.com/ardittristan/VTTColorSettings/blob/master/colorSetting.js#L28) with the name of your own module, otherwise the lib will not function when ran with libwraper

For the settings namespace of the `XXX` module it is usually used use the module name `"XXX"` as the settings namespace.This allows you to avoid modifying the [this line](https://github.com/ardittristan/VTTColorSettings/blob/master/colorSetting.js#L28) mentioned above thanks to the addition of a check that verifies if the namespace belongs to a module and register the lib-wrapper module accordingly without needing to modify or integrate this module into your own.

Please do inform your users in some way that they can install colorsettings as a module so they'll have the latest version of the library instead of the included version in your module.

</details>

<details>

<summary>Using Color Settings with a stub if not used as a mandatory library.</summary>

If you want to inform your users that they can use the color picker but your module also works without the library, you can use the `colorSettingStub.js` file. This will show a popup if the library is detected but not enabled. Or a notification if the library is not detected at all. Both the popup and notification can be disabled by the user via a button or the settings.

You will have to add this to your module.json file for it to work _(with your own file locations)_:

```json
"scripts": ["./lib/colorSettingStub"]
```

</details>

&nbsp;

_If nothing appears when you click the setting button. Try running with the libwrapper module._

### Setting

To make a new color setting, make a new `ColorSetting` object:

```javascript
//                                     module        key             options
new window.Ardittristan.ColorSetting("myModule", "myColorSetting", {
    name: "My Color Setting",           // The name of the setting in the settings menu
    hint: "Click on the button",        // A description of the registered setting and its behavior
    label: "Color Picker",              // The text label used in the button
    restricted: false,                  // Restrict this setting to gamemaster only?
    defaultColor: "#000000ff",          // The default color of the setting
    scope: "client",                    // The scope of the setting
    onChange: (value) => {},            // A callback function which triggers when the setting is changed
    insertAfter: "myModule.mySetting"   // If supplied it will place the setting after the supplied setting
})
```

This creates a new setting that you can read with:

```javascript
game.settings.get("myModule", "myColorSetting") // Returns color code, eg: "#000000ff"
```

&nbsp;

### Form

_A form color picker does not require a `window.Ardittristan.ColorSetting` object since it just outputs to the text input box._

#### Input

To add a color picker to a text field, add `is="colorpicker-input"` to the text field element. If you want the color of the text field to change according to color, you can add the data tag `data-responsive-color` If you want it to be a permanently open color picker you can give it the data tag `data-permanent` (can be combined)

Example:

```html
<input type="text" name="clickable" is="colorpicker-input">
<input type="text" name="alwaysOn" is="colorpicker-input" data-permanent>
<input type="text" name="colored" is="colorpicker-input" data-responsive-color>
```

When the user clicks the OK button, it puts the color code in the text field in hex8 form (eg: `#123456ff`)

#### Button

To add a color picker to a button, add `is="colorpicker-button"` to the button element. If you want the color of the button to change according to color, you can add the data tag `data-responsive-color`

*If you want to get the button value in your form, you should add form="form_id".*

Example:

```html
<button name="clickable" is="colorpicker-button">
<button name="forForm" is="colorpicker-button" form="myFormId">
<button name="colored" is="colorpicker-button" data-responsive-color>
```

When the user clicks the OK button, it puts the color code in the element's value property in hex8 form (eg: `#123456ff`)

## API

```javascript
  /**
  * Turn hex rgba into rgba string
  * @param {String} hex 8 long hex value in string form, eg: "#123456ff"
  * @returns Array of rgba[r, g, b, a]
  */
  game.modules.get("colorsettings").api.hexToRGBA: hexToRGBA(hex) => Array of rgba[r, g, b, a]

  /**
  * Makes text white or black according to background color
  * @param {String} rgbaHex 8 long hex value in string form, eg: "#123456ff"
  * @returns {String} "black" or "white"
  */
  game.modules.get("colorsettings").api.getTextColor: getTextColor(rgbaHex) => String

  /**
   * Little utility to convert a module setting to a simple color picker
   * the method must be launched on the `renderSettingsConfig"`
   * e.g.
   * Hooks.on("renderSettingsConfig", (app, html, data) => {
   *  colorPicker("tidy5e-sheet", "arrowColor", html);
   * });
   *
   * @param {String} moduleId
   * @param {String} settingId
   * @param {HTMLElement} html
   * @returns
   */
  game.modules.get("colorsettings").api.colorPicker(moduleId, settingId, html) => void

  /**
   * Convert a Array of rgba[r, g, b, a] in string format to a hex string
   * @param {String} rgba a Array of rgba[r, g, b, a] as string
   * @param {boolean} forceRemoveAlpha
   * @returns turns the hex string
   */
  game.modules.get("colorsettings").api.RGBAToHexFromString(rgba, forceRemoveAlpha = false) => String

  /**
   * Convert a Array of rgba[r, g, b, a] in to a hex string
   * @param {*} r
   * @param {*} g
   * @param {*} b
   * @param {*} a
   * @returns the hex string
   */
  game.modules.get("colorsettings").api.RGBAToHex(r, g, b, a) => String
```

## Changelog

Check the [Changelog](https://github.com/ardittristan/VTTColorSettings/blob/master/CHANGELOG.md)

## Libraries used

1. [vanilla-picker](https://github.com/Sphinxxxx/vanilla-picker)
2. [html2canvas](https://github.com/niklasvh/html2canvas)
