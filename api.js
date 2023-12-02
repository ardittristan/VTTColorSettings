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
    const rgba = [r, g, b, Math.round((a / 256 + Number.EPSILON) * 100) / 100];
    return {
      r: rgba[0] ?? 255,
      g: rgba[1] ?? 255,
      b: rgba[2] ?? 255,
      a: rgba[3] ?? 255,
    };
  },

  /**
  * Makes text white or black according to background color
  * @param {String} rgbaHex 8 long hex value in string form, eg: "#123456ff"
  * @returns {String} "black" or "white"
  */
  getTextColor(rgbaHex) {
    const rgba = this.hexToRGBA(rgbaHex);
    const brightness = Math.round((
        (rgba.r * 299) +
        (rgba.g * 587) +
        (rgba.b * 114)
    ) / 1000);
    if (rgba.a > 0.5) {
        return (brightness > 125) ? 'black' : 'white';
    } else {
        return 'black';
    }
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
  hexToRGBAString(colorHex, alpha = 0.25) {
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
    return "rgba(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ", " + rgba.a ?? alpha + ")";
  }
}
export default API;
