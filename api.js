import {fontColorContrast}  from "./lib/FontColorContrast.js"

const API = {
  /**
   * Turn hex rgba into rgba object
   * @param {String} hex 8 long hex value in string form, eg: "#123456ff"
   * @returns object of {r, g, b, a}
   */
  hexToRGBA(hex) {
    const hexArr = hex.slice(1).match(new RegExp(".{2}", "g"));
    const [r, g, b, a] = hexArr.map((hexStr) => {
      return parseInt(hexStr.repeat(2 / hexStr.length), 16);
    });
    const realAlpha = this._isRealNumber(a) ? a : 1;
    const rgba = [r, g, b, Math.round((realAlpha / 256 + Number.EPSILON) * 100) / 100];
    return {
      r: rgba[0] ?? 255,
      g: rgba[1] ?? 255,
      b: rgba[2] ?? 255,
      a: rgba[3] ?? 255,
    };
  },

  /**
   * Makes text white or black according to background color
   * @href https://wunnle.com/dynamic-text-color-based-on-background
   * @href https://stackoverflow.com/questions/54230440/how-to-change-text-color-based-on-rgb-and-rgba-background-color
   * @param {String} rgbaHex 8 long hex value in string form, eg: "#123456ff"
   * @param {number} threshold Contrast threshold to control the resulting font color, float values from 0 to 1. Default is 0.5.
   * @returns {( '#ffffff'|'#000000')} hex color
   */
  getTextColor(rgbaHex, threshold = 0.5) {
    // return game.modules.get("colorsettings").api.getTextColor(rgbaHex);

    const rgba = this.hexToRGBA(rgbaHex);
    // OLD METHOD
    /*
    //const realAlpha = this._isRealNumber(rgba.a) ? rgba.a : 1;
    const brightness = Math.round((rgba.r * 299 + rgba.g * 587 + rgba.b * 114) / 1000);
    // const realAlpha = this._isRealNumber(rgba.a) ? rgba.a : 1;
    if (this._isRealNumber(rgba.a) && rgba.a > 0.5) {
      return brightness > 125 ? "black" : "white";
    } else {
      //return 'black';
      return brightness > 125 ? "black" : "white";
    }
    */
    const hexTextColor = fontColorContrast(rgba.r, rgba.g, rgba.b, threshold);
    return hexTextColor;
  },

  /**
   * Convert a Array of rgba[r, g, b, a] in string format to a hex string
   * @param {String} rgba as string e.g. rgba('xxx','xxx','xxx','xxx')
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
  },

  /**
   * Turn hex rgba into rgba string
   * @href https://stackoverflow.com/questions/19799777/how-to-add-transparency-information-to-a-hex-color-code
   * @href https://stackoverflow.com/questions/21646738/convert-hex-to-rgba
   * @param colorHex
   * @param alpha
   * @return rgba as string e.g. rgba('xxx','xxx','xxx','xxx')
   */
  hexToRGBAString(colorHex, alpha = 1) {
    let rgba = Color.from(colorHex);
    // return "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + alpha + ")";
    if (colorHex.length > 7) {
      rgba = this.hexToRGBA(colorHex);
    } else {
      const colorHex2 = `${colorHex}${Math.floor(alpha * 255)
        .toString(16)
        .padStart(2, "0")}`;
      rgba = this.hexToRGBA(colorHex2);
      // const c = Color.from(colorHex);
      // rgba = c.toRGBA();
    }
    const realAlpha = this._isRealNumber(rgba.a) ? rgba.a : alpha;
    return "rgba(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ", " + realAlpha + ")";
  },

  /**
   * Calculate brightness value by RGB or HEX color.
   * @param color (String) The color value in RGB or HEX (for example: #000000 || #000 || rgb(0,0,0) || rgba(0,0,0,0))
   * @returns (Number) The brightness value (dark) 0 ... 255 (light)
   * @return {number} brigthness
   */
  brightnessByColor(colorHexOrRgb) {
    let color = "" + colorHexOrRgb;
    let isHEX = color.indexOf("#") == 0;
    let isRGB = color.indexOf("rgb") == 0;
    let r = 0;
    let g = 0;
    let b = 0;
    if (isHEX) {
      const rgba = this.hexToRGBA(color);
      r = rgba.r;
      g = rgba.g;
      b = rgba.b;
    }
    if (isRGB) {
      var m = color.match(/(\d+){3}/g);
      if (m) {
        r = m[0];
        g = m[1];
        b = m[2];
      }
    }
    if (typeof r != "undefined") {
      return (r * 299 + g * 587 + b * 114) / 1000;
    } else {
      return undefined;
    }
  },

  _isRealNumber(inNumber) {
    return !isNaN(inNumber) && typeof inNumber === "number" && isFinite(inNumber);
  }
}
export default API;
