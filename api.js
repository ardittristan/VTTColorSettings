import { getTextColor, hexToRGBA } from "./colorSetting.js";

const API = {
  /**
  * Turn hex rgba into rgba string
  * @param {String} hex 8 long hex value in string form, eg: "#123456ff"
  * @returns Array of rgba[r, g, b, a]
  */
  hexToRGBA: hexToRGBA(hex),

  /**
  * Makes text white or black according to background color
  * @param {String} rgbaHex 8 long hex value in string form, eg: "#123456ff"
  * @returns {String} "black" or "white"
  */
  getTextColor: getTextColor(rgbaHex),

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
  colorPicker(moduleId, settingId, html) {
    const settingInput = html.find(`input[name="${moduleId}.${settingId}"]`);
    if (!settingInput.length) {
      return;
    }
    const settingValue = game.settings.get(moduleId, settingId);

    const colorPickerElement = document.createElement("input");
    colorPickerElement.setAttribute("type", "color");
    colorPickerElement.setAttribute("data-edit", `${moduleId}.${settingId}`);
    colorPickerElement.value = settingValue;

    // Add color picker
    const stringInputElement = html[0].querySelector(`input[name="${moduleId}.${settingId}"]`);
    stringInputElement.classList.add("color");
    stringInputElement.after(colorPickerElement);
  },

  /**
   * Convert a Array of rgba[r, g, b, a] in string format to a hex string
   * @param {String} rgba a Array of rgba[r, g, b, a] as string
   * @param {boolean} forceRemoveAlpha
   * @returns turns the hex string
   */
  RGBAToHexFromString(rgba, forceRemoveAlpha = false) {
    return (
      "#" +
      rgba
        .replace(/^rgba?\(|\s+|\)$/g, "") // Get's rgba / rgb string values
        .split(",") // splits them at ","
        .filter((string, index) => !forceRemoveAlpha || index !== 3)
        .map((string) => parseFloat(string)) // Converts them to numbers
        .map((number, index) => (index === 3 ? Math.round(number * 255) : number)) // Converts alpha to 255 number
        .map((number) => number.toString(16)) // Converts numbers to hex
        .map((string) => (string.length === 1 ? "0" + string : string)) // Adds 0 when length of one number is 1
        .join("")
    ); // Puts the array to together to a string
  },

  /**
   * Convert a Array of rgba[r, g, b, a] in to a hex string
   * @param {*} r
   * @param {*} g
   * @param {*} b
   * @param {*} a
   * @returns the hex string
   */
  RGBAToHex(r, g, b, a) {
    let r2 = r.toString(16);
    let g2 = g.toString(16);
    let b2 = b.toString(16);
    let a2 = Math.round(a * 255).toString(16);

    if (r2.length == 1) {
      r2 = "0" + r2;
    }
    if (g2.length == 1) {
      g2 = "0" + g2;
    }
    if (b2.length == 1) {
      b2 = "0" + b2;
    }
    if (a2.length == 1) {
      a2 = "0" + a2;
    }
    return "#" + r2 + g2 + b2 + a2;
  }
}
export default API;
