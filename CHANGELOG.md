# Changelog

## 3.0.0

* **Breaking api changes**, now returns a rgba object instead of array.
* updated external libraries

## 2.9.0

* update for V10.

## 2.8.3

* fix issue when user doesn't have permissions to view settings.

## 2.8.0

* add parameter that allows for changing the order of the color settings button.

## 2.7.0

* add colorSettingsInitialized hook for modules with names starting with characters before c.

## 2.6.1

* add change event, thanks again @mouse0270

## 2.6.0

* implement dom event for html inputs, thanks @mouse0270

## 2.5.9

* hotfix.

## 2.5.8

* lib-wrapper update [#16](https://github.com/ardittristan/VTTColorSettings/pull/16)
* update html2canvas to latest.

## 2.5.7

* Make it more clear if color picker is active.

## 2.5.5

* Add spanish translation.

## 2.5.4

* Add pt-BR.

## 2.5.2

* Push compatible core version.

## 2.5.1

* Add optional translation support.

## 2.5.0

* Added stub method of including library.
* Made error notification optional.
* Added compatibility for using libwrapper if found.

## 2.4.1

* Added one-time popup that asks the user if they want to enable colorsettings if it is installed but not enabled (when running as included library).

## 2.4.0

* Deprecated the use of `id="permanent"` in favor of `data-permanent`

***

* Add the option to change the background color of a html element to it's pickers color
* Add button type color picker

## 2.3.6

* Fix misspell causing download break

## 2.3.5

* Fix canvas not being removed after color picker use.

## 2.3.4

* Even hotter fix

## 2.3.3

* Hotfix

## 2.3.2

* Added hook to html picker.

## 2.3.1

* Fix error when library was not installed as module.

## 2.3.0

* Make eye dropper capable of reading from the canvas.
* Fix alpha not working on html elements

## 2.2.7

* Fix module not loading on the forge.

## 2.2.6

* Made it that when included into another module instead of being installed as module, it only runs if the main colorpicker module isn't installed.

## 2.2.5

* Fix html picker closing when the input in it get's focused.

## 2.2.4

* Fix html picker sometimes not updating color value of input field.

## 2.2.3

* fixed mistake that caused html pickers to not get the color value of input.

## 2.2.2

* Added info popup that alpha isn't supported with eye dropper.
* Fixed bug with html color picker textbox parsing.
* Documentation.

## 2.2.1

* Some code cleanup

## 2.2.0

* Added color picker to use in forms.
* Fixed settings not being reset to default when button pressed.
* Fixed issue when one setting name was the same as the beginning of another setting name.
~~Will fix tidyUI styling issues later, it's 4am and I'm tired~~

## 2.1.1

* Forgot to remove some logs.

## 2.1.0

* Added eye dropper tool
* Fixed bug with opening settings while a color picker is already open not resetting opened color pickers.
* Made color picker closable by clicking button again.

## 2.0.0

* Turned library into a module so it doesn't have to be integrated into every module.
* Fixed gigantic color picker when hint text exists.
* Old integrated method still works but is deprecated.

## 1.3.0

* Added hint

*Hopefully I have everything now.*

## 1.2.0

* Added onChange callback

## 1.1.1

* Minified [vanilla-picker](https://github.com/Sphinxxxx/vanilla-picker) library

## 1.1.0

* Added scope

## 1.0.0

* Initial release
