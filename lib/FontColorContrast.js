/**
 * Analyses the color (normally used in the background) and retrieves what color (black or white) has a better contrast.
 * @param cssColor The CSS named color string. The list of colors is defined as a TypeScript type to help the usage.
 * @param threshold Contrast threshold to control the resulting font color, float values from 0 to 1. Default is 0.5.
 * @example fontColorContrast('beige')
 * @example fontColorContrast('darkcyan', 0.3)
 * @returns {( '#ffffff'|'#000000')} hex color
 */
export function fontColorContrastFromCssColor(cssColor, threshold = 0.5) {
  return fontColorContrast(cssColor, threshold);
}

/**
 * Analyses the color (normally used in the background) and retrieves what color (black or white) has a better contrast.
 * @param hex The hex color string must be a valid hexadecimal color number to work correctly. Works with or without '#', with 3 or 6 color chars. Any other length or an invalid hex character will be ignored. A space is allowed between the hash symbol and the number.
 * @param threshold Contrast threshold to control the resulting font color, float values from 0 to 1. Default is 0.5.
 * @example fontColorContrast('00FFDD') === fontColorContrast('0FD') === fontColorContrast('#00FFDD') === fontColorContrast('#0FD') === fontColorContrast('# 00FFDD') === fontColorContrast('# 0FD')
 * @returns {( '#ffffff'|'#000000')} hex color
 */
export function fontColorContrastFromHexString(hex, threshold = 0.5) {
  return fontColorContrast(hex, threshold);
}

/**
 * Analyses the color (normally used in the background) and retrieves what color (black or white) has a better contrast.
 * @param hex The hex color number must be an integer between 0 and 0xffffff (16777215).
 * @param threshold Contrast threshold to control the resulting font color, float values from 0 to 1. Default is 0.5.
 * @example fontColorContrast(0XF3DC56) === fontColorContrast(15981654)
 * @returns {( '#ffffff'|'#000000')} hex color
 */
export function fontColorContrastFromHexNumber(hex, threshold = 0.5) {
  return fontColorContrast(hex, threshold);
}

/**
 * Analyses the color (normally used in the background) and retrieves what color (black or white) has a better contrast.
 * @param red The red portion of the color. Must be an integer between 0 and 255.
 * @param green The green portion of the color. Must be an integer between 0 and 255.
 * @param blue The blue portion of the color. Must be an integer between 0 and 255.
 * @param threshold Contrast threshold to control the resulting font color, float values from 0 to 1. Default is 0.5.
 * @example fontColorContrast(0, 243, 216) === fontColorContrast(0x0, 0xF3, 0xd8).
 * @returns {( '#ffffff'|'#000000')} hex color
 */
export function fontColorContrastFromRGB(red, green, blue, threshold = 0.5) {
  return fontColorContrast(red, green, blue, threshold);
}

/**
 * Analyses the color (normally used in the background) and retrieves what color (black or white) has a better contrast.
 * @param rgbArray Array with red, green and blue. Each value must be an integer between 0 and 255.
 * @param threshold Contrast threshold to control the resulting font color, float values from 0 to 1. Default is 0.5.
 * @example fontColorContrast(fontColorContrast([0, 243, 216]) === fontColorContrast([0x0, 0xF3, 0xd8])
 * @returns {( '#ffffff'|'#000000')} hex color
 */
export function fontColorContrastFromRGBArray(rgbArray, threshold = 0.5) {
  return fontColorContrast(rgbArray, threshold);
}

/**
 * Sets the #params in the instance
 * @param hexColorOrRedOrArray One of the options: hex color number, hex color string, named CSS color, array with red, green and blue or string or the red portion of the color
 * @param greenOrThreshold The green portion of the color or the contrast threshold to control the resulting font color
 * @param blue The blue portion of the color
 * @param threshold Contrast threshold to control the resulting font color
 * @example fontColorContrast(0XF3DC56) === fontColorContrast(15981654)
 * @returns {( '#ffffff'|'#000000')} hex color
 */
export function fontColorContrast(hexColorOrRedOrArray, greenOrThreshold = 0, blue = 0, threshold = 0.5) {
  const fcc = new FontColorContrast(hexColorOrRedOrArray, greenOrThreshold, blue, threshold);
  return fcc.getColor();
}

// =========================================================================
// ===========================================================================


/*! *****************************************************************************
MIT License

Copyright (c) 2021 Eduardo Russo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
***************************************************************************** */

const NumberType = {
  COLOR: 0xff,
  RGB: 0xffffff,
  THRESHOLD: 1,
};

class FontColorContrast {
  red = 0;
  green = 0;
  blue = 0;

  #hexColorOrRedOrArray;
  #greenOrThreshold = 0;
  #blue = 0;
  #threshold = 0;

  /**
   * Contrast threshold to control the resulting font color, float values from 0 to 1. Default is 0.5
   */
  threshold = 0.5;

  /**
   * Sets the #params in the instance
   * @param { string | number | number[] | CssColor} hexColorOrRedOrArray One of the options: hex color number, hex color string, named CSS color, array with red, green and blue or string or the red portion of the color
   * @param {number=0} greenOrThreshold The green portion of the color or the contrast threshold to control the resulting font color
   * @param {number=0} blue The blue portion of the color
   * @param {threshold=0.5} threshold Contrast threshold to control the resulting font color
   */
  constructor(hexColorOrRedOrArray, greenOrThreshold, blue, threshold) {
    this.#hexColorOrRedOrArray = hexColorOrRedOrArray;
    this.#greenOrThreshold = greenOrThreshold;
    this.#blue = blue;
    this.#threshold = threshold;
  }

  /**
   * Analyses the color (normally used in the background) and retrieves what color (black or white) has a better contrast.
   * @returns The best contrast between black and white
   */
  getColor() {
    if (this.isRgb()) {
      this.setColorsFromRgbNumbers();
    } else if (this.isHexString()) {
      this.setColorsFromHexString();
    } else if (this.isNumber()) {
      this.setColorsFromNumber();
    } else if (this.isArray()) {
      this.setColorsFromArray();
    } else {
      return "#ffffff";
    }

    return this.contrastFromHSP();
  }

  /**
   * Checks if the color is set as RGB on each param
   * @returns True if color is set as RGB on each param
   */
  isRgb() {
    return (
      FontColorContrast.isValidNumber(this.#hexColorOrRedOrArray, NumberType.COLOR) &&
      FontColorContrast.isValidNumber(this.#greenOrThreshold, NumberType.COLOR) &&
      FontColorContrast.isValidNumber(this.#blue, NumberType.COLOR) &&
      FontColorContrast.isValidNumber(this.#threshold, NumberType.THRESHOLD)
    );
  }

  /**
   * Checks if color is set on the first param as a hex string and removes the hash of it
   * @returns True if color is a hex string
   */
  isHexString() {
    const [cleanString, hexNum] = this.getCleanStringAndHexNum();

    if (
      FontColorContrast.isValidNumber(hexNum, NumberType.RGB) &&
      FontColorContrast.isValidNumber(this.#greenOrThreshold, NumberType.THRESHOLD) &&
      FontColorContrast.isNotSet(this.#blue) &&
      FontColorContrast.isNotSet(this.#threshold)
    ) {
      this.#hexColorOrRedOrArray = cleanString;
      return true;
    }
    return false;
  }

  /**
   * Checks if color is set on the first param as a number
   * @returns True if color is a valid RGB nunbernumber
   */
  isNumber() {
    return (
      FontColorContrast.isValidNumber(this.#hexColorOrRedOrArray, NumberType.RGB) &&
      FontColorContrast.isValidNumber(this.#greenOrThreshold, NumberType.THRESHOLD) &&
      FontColorContrast.isNotSet(this.#blue) &&
      FontColorContrast.isNotSet(this.#threshold)
    );
  }

  /**
   * Checks if color is set as an RGB array
   * @returns True if color is set as an RGB array
   */
  isArray() {
    return (
      Array.isArray(this.#hexColorOrRedOrArray) &&
      this.#hexColorOrRedOrArray.length === 3 &&
      FontColorContrast.isValidNumber(this.#hexColorOrRedOrArray[0], NumberType.COLOR) &&
      FontColorContrast.isValidNumber(this.#hexColorOrRedOrArray[1], NumberType.COLOR) &&
      FontColorContrast.isValidNumber(this.#hexColorOrRedOrArray[2], NumberType.COLOR) &&
      FontColorContrast.isValidNumber(this.#greenOrThreshold, NumberType.THRESHOLD) &&
      FontColorContrast.isNotSet(this.#blue) &&
      FontColorContrast.isNotSet(this.#threshold)
    );
  }

  /**
   * Converts a color array or separated in RGB to the respective RGB values
   * @example All these examples produces the same value
   * arrayOrRgbToRGB(0, 0xcc, 153)
   * arrayOrRgbToRGB(0x0, 0xcc, 153)
   * arrayOrRgbToRGB(0, 204, 0x99)
   */
  setColorsFromRgbNumbers() {
    this.red = this.#hexColorOrRedOrArray;
    this.green = this.#greenOrThreshold;
    this.blue = this.#blue;
    this.setThreshold(this.#threshold);
  }

  /**
   * Converts a color array or separated in RGB to the respective RGB values
   * @param this.#hexColorOrRedOrArray The RGB array
   * @param threshold The threshold
   * @example All these examples produces the same value
   * arrayOrRgbToRGB([0, 0xcc, 153])
   * arrayOrRgbToRGB([0x0, 0xcc, 153])
   * arrayOrRgbToRGB([0, 204, 0x99])
   */
  setColorsFromArray() {
    this.red = this.#hexColorOrRedOrArray[0];
    this.green = this.#hexColorOrRedOrArray[1];
    this.blue = this.#hexColorOrRedOrArray[2];
    this.setThreshold(this.#greenOrThreshold);
  }

  /**
   * Converts a ColorIntensity string or number, with all possibilities (e.g. '#009', '009', '#000099', '000099', 153, 0x00099) to the respective RGB values
   * @param hexColor The color string or number
   * @param threshold The threshold
   * @example All these examples produces the same value
   * hexColorToRGB('#0C9')
   * hexColorToRGB('0C9')
   * hexColorToRGB('#00CC99')
   * hexColorToRGB('00cc99')
   * hexColorToRGB(52377)
   * hexColorToRGB(0x00Cc99)
   */
  setColorsFromHexString() {
    switch (this.#hexColorOrRedOrArray?.length) {
      // Color has one char for each color, so they must be repeated
      case 3:
        this.red = parseInt(this.#hexColorOrRedOrArray[0].repeat(2), 16);
        this.green = parseInt(this.#hexColorOrRedOrArray[1].repeat(2), 16);
        this.blue = parseInt(this.#hexColorOrRedOrArray[2].repeat(2), 16);
        break;
      // All chars are filled, so no transformation is needed
      default:
        this.red = parseInt(this.#hexColorOrRedOrArray.substring(0, 2), 16);
        this.green = parseInt(this.#hexColorOrRedOrArray.substring(2, 4), 16);
        this.blue = parseInt(this.#hexColorOrRedOrArray.substring(4, 6), 16);
        break;
    }
    this.setThreshold(this.#greenOrThreshold);
  }

  /**
   * Converts the RGB number and sets the respective RGB values.
   */
  setColorsFromNumber() {
    /*
     * The RGB color has 24 bits (8 bits per color).
     * This function uses binary operations for better performance, but can be tricky to understand. A 24 bits color could be represented as RRRRRRRR GGGGGGGG BBBBBBBB (the first 8 bits are red, the middle 8 bits are green and the last 8 bits are blue).
     * To get each color we perform some RIGHT SHIFT and AND operations.
     * Gets the first 8 bits of the color by shifting it 16 bits
     * RIGHT SHIFT operation (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Right_shift)
     * AND operation (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND)
     */

    // To get red, we shift the 24 bits number 16 bits to the right, leaving the number only with the leftmost 8 bits (RRRRRRRR)
    this.red = this.#hexColorOrRedOrArray >> 16;
    // To get green, the middle 8 bits, we shift it by 8 bits (removing all blue bits - RRRRRRRR GGGGGGGG) and use an AND operation with "0b0000000011111111 = 0xff" to get only the rightmost bits (GGGGGGGG)
    this.green = (this.#hexColorOrRedOrArray >> 8) & 0xff;
    // To get blue we use an AND operation with "0b000000000000000011111111 = 0xff" to get only the rightmost bits (BBBBBBBB)
    this.blue = this.#hexColorOrRedOrArray & 0xff;
    this.setThreshold(this.#greenOrThreshold);
  }

  /**
   * Sets the threshold to the passed value (if valid - less than or equal 1) or the dafault (0.5)
   * @param {number} threshold The passed threshold or undefined if not passed
   */
  setThreshold(threshold) {
    this.threshold = threshold || this.threshold;
  }

  /**
   * Verifies if a number is a valid color number (numberType = NumberType.COLOR = 0xff) or a valid RGB (numberType = NumberType.RGB = 0xffffff) or a valid threshold (numberType = NumberType.THRESHOLD = 1)
   * @param {number} num The number to be checked
   * @param {NumberType} numberType The type of number to be chacked that defines maximum value of the number (default = NumberType.COLOR = 0xff)
   * @returns {boolean} True if the number is valid
   */
  static isValidNumber(num, numberType) {
    if (numberType === NumberType.THRESHOLD && (num === undefined || num === null)) return true;
    return (
      typeof num === "number" &&
      ((numberType !== NumberType.THRESHOLD && Number.isInteger(num)) || numberType === NumberType.THRESHOLD) &&
      num !== undefined &&
      num !== null &&
      num >= 0 &&
      num <= numberType
    );
  }

  /**
   * Verifies if a string is a valig string to be used as a color and if true, returns the correspondent hex number
   * @returns Array with an empty string and false if the string is invalid or an array with the clean string and the converted string number]
   * @returns {['', false]|[string, number]}
   */
  getCleanStringAndHexNum() {
    if (typeof this.#hexColorOrRedOrArray !== "string") return ["", false];

    const cleanRegEx = /(#|\s)/gi;

    const namedColor = cssNamedColors.find((color) => color.name === this.#hexColorOrRedOrArray);

    if (namedColor) {
      this.#hexColorOrRedOrArray = namedColor.hex.replace(cleanRegEx, "");
    }
    const cleanString = this.#hexColorOrRedOrArray.replace(cleanRegEx, "");
    if (cleanString.length !== 3 && cleanString.length !== 6) return ["", false];

    const hexNum = Number("0x" + cleanString);

    return [cleanString, hexNum];
  }

  /**
   * Verifies if a value is not set
   * @param value The value that should be undefined or null
   * @returns True if the value is not set
   * @returns {boolean}
   */
  static isNotSet(value) {
    return value === undefined || value === null;
  }

  /**
   * Calculates the best color (black or white) to contrast with the passed RGB color using the algorithm from https://alienryderflex.com/hsp.html
   * @returns Black or White depending on the best possible contrast
   * @return {'#000000'|'#ffffff'}
   */
  contrastFromHSP() {
    const pRed = 0.299;
    const pGreen = 0.587;
    const pBlue = 0.114;

    const contrast = Math.sqrt(
      pRed * (this.red / 255) ** 2 + pGreen * (this.green / 255) ** 2 + pBlue * (this.blue / 255) ** 2
    );

    return contrast > this.threshold ? "#000000" : "#ffffff";
  }
}

// =================================================================

const cssNamedColors = [
  {
    name: "aliceblue",
    hex: "#f0f8ff",
  },
  {
    name: "antiquewhite",
    hex: "#faebd7",
  },
  {
    name: "aqua",
    hex: "#00ffff",
  },
  {
    name: "aquamarine",
    hex: "#7fffd4",
  },
  {
    name: "azure",
    hex: "#f0ffff",
  },
  {
    name: "beige",
    hex: "#f5f5dc",
  },
  {
    name: "bisque",
    hex: "#ffe4c4",
  },
  {
    name: "black",
    hex: "#000000",
  },
  {
    name: "blanchedalmond",
    hex: "#ffebcd",
  },
  {
    name: "blue",
    hex: "#0000ff",
  },
  {
    name: "blueviolet",
    hex: "#8a2be2",
  },
  {
    name: "brown",
    hex: "#a52a2a",
  },
  {
    name: "burlywood",
    hex: "#deb887",
  },
  {
    name: "cadetblue",
    hex: "#5f9ea0",
  },
  {
    name: "chartreuse",
    hex: "#7fff00",
  },
  {
    name: "chocolate",
    hex: "#d2691e",
  },
  {
    name: "coral",
    hex: "#ff7f50",
  },
  {
    name: "cornflowerblue",
    hex: "#6495ed",
  },
  {
    name: "cornsilk",
    hex: "#fff8dc",
  },
  {
    name: "crimson",
    hex: "#dc143c",
  },
  {
    name: "cyan",
    hex: "#00ffff",
  },
  {
    name: "darkblue",
    hex: "#00008b",
  },
  {
    name: "darkcyan",
    hex: "#008b8b",
  },
  {
    name: "darkgoldenrod",
    hex: "#b8860b",
  },
  {
    name: "darkgray",
    hex: "#a9a9a9",
  },
  {
    name: "darkgreen",
    hex: "#006400",
  },
  {
    name: "darkgrey",
    hex: "#a9a9a9",
  },
  {
    name: "darkkhaki",
    hex: "#bdb76b",
  },
  {
    name: "darkmagenta",
    hex: "#8b008b",
  },
  {
    name: "darkolivegreen",
    hex: "#556b2f",
  },
  {
    name: "darkorange",
    hex: "#ff8c00",
  },
  {
    name: "darkorchid",
    hex: "#9932cc",
  },
  {
    name: "darkred",
    hex: "#8b0000",
  },
  {
    name: "darksalmon",
    hex: "#e9967a",
  },
  {
    name: "darkseagreen",
    hex: "#8fbc8f",
  },
  {
    name: "darkslateblue",
    hex: "#483d8b",
  },
  {
    name: "darkslategray",
    hex: "#2f4f4f",
  },
  {
    name: "darkslategrey",
    hex: "#2f4f4f",
  },
  {
    name: "darkturquoise",
    hex: "#00ced1",
  },
  {
    name: "darkviolet",
    hex: "#9400d3",
  },
  {
    name: "deeppink",
    hex: "#ff1493",
  },
  {
    name: "deepskyblue",
    hex: "#00bfff",
  },
  {
    name: "dimgray",
    hex: "#696969",
  },
  {
    name: "dimgrey",
    hex: "#696969",
  },
  {
    name: "dodgerblue",
    hex: "#1e90ff",
  },
  {
    name: "firebrick",
    hex: "#b22222",
  },
  {
    name: "floralwhite",
    hex: "#fffaf0",
  },
  {
    name: "forestgreen",
    hex: "#228b22",
  },
  {
    name: "fuchsia",
    hex: "#ff00ff",
  },
  {
    name: "gainsboro",
    hex: "#dcdcdc",
  },
  {
    name: "ghostwhite",
    hex: "#f8f8ff",
  },
  {
    name: "gold",
    hex: "#ffd700",
  },
  {
    name: "goldenrod",
    hex: "#daa520",
  },
  {
    name: "gray",
    hex: "#808080",
  },
  {
    name: "green",
    hex: "#008000",
  },
  {
    name: "greenyellow",
    hex: "#adff2f",
  },
  {
    name: "grey",
    hex: "#808080",
  },
  {
    name: "honeydew",
    hex: "#f0fff0",
  },
  {
    name: "hotpink",
    hex: "#ff69b4",
  },
  {
    name: "indianred",
    hex: "#cd5c5c",
  },
  {
    name: "indigo",
    hex: "#4b0082",
  },
  {
    name: "ivory",
    hex: "#fffff0",
  },
  {
    name: "khaki",
    hex: "#f0e68c",
  },
  {
    name: "lavender",
    hex: "#e6e6fa",
  },
  {
    name: "lavenderblush",
    hex: "#fff0f5",
  },
  {
    name: "lawngreen",
    hex: "#7cfc00",
  },
  {
    name: "lemonchiffon",
    hex: "#fffacd",
  },
  {
    name: "lightblue",
    hex: "#add8e6",
  },
  {
    name: "lightcoral",
    hex: "#f08080",
  },
  {
    name: "lightcyan",
    hex: "#e0ffff",
  },
  {
    name: "lightgoldenrodyellow",
    hex: "#fafad2",
  },
  {
    name: "lightgray",
    hex: "#d3d3d3",
  },
  {
    name: "lightgreen",
    hex: "#90ee90",
  },
  {
    name: "lightgrey",
    hex: "#d3d3d3",
  },
  {
    name: "lightpink",
    hex: "#ffb6c1",
  },
  {
    name: "lightsalmon",
    hex: "#ffa07a",
  },
  {
    name: "lightseagreen",
    hex: "#20b2aa",
  },
  {
    name: "lightskyblue",
    hex: "#87cefa",
  },
  {
    name: "lightslategray",
    hex: "#778899",
  },
  {
    name: "lightslategrey",
    hex: "#778899",
  },
  {
    name: "lightsteelblue",
    hex: "#b0c4de",
  },
  {
    name: "lightyellow",
    hex: "#ffffe0",
  },
  {
    name: "lime",
    hex: "#00ff00",
  },
  {
    name: "limegreen",
    hex: "#32cd32",
  },
  {
    name: "linen",
    hex: "#faf0e6",
  },
  {
    name: "magenta",
    hex: "#ff00ff",
  },
  {
    name: "maroon",
    hex: "#800000",
  },
  {
    name: "mediumaquamarine",
    hex: "#66cdaa",
  },
  {
    name: "mediumblue",
    hex: "#0000cd",
  },
  {
    name: "mediumorchid",
    hex: "#ba55d3",
  },
  {
    name: "mediumpurple",
    hex: "#9370db",
  },
  {
    name: "mediumseagreen",
    hex: "#3cb371",
  },
  {
    name: "mediumslateblue",
    hex: "#7b68ee",
  },
  {
    name: "mediumspringgreen",
    hex: "#00fa9a",
  },
  {
    name: "mediumturquoise",
    hex: "#48d1cc",
  },
  {
    name: "mediumvioletred",
    hex: "#c71585",
  },
  {
    name: "midnightblue",
    hex: "#191970",
  },
  {
    name: "mintcream",
    hex: "#f5fffa",
  },
  {
    name: "mistyrose",
    hex: "#ffe4e1",
  },
  {
    name: "moccasin",
    hex: "#ffe4b5",
  },
  {
    name: "navajowhite",
    hex: "#ffdead",
  },
  {
    name: "navy",
    hex: "#000080",
  },
  {
    name: "oldlace",
    hex: "#fdf5e6",
  },
  {
    name: "olive",
    hex: "#808000",
  },
  {
    name: "olivedrab",
    hex: "#6b8e23",
  },
  {
    name: "orange",
    hex: "#ffa500",
  },
  {
    name: "orangered",
    hex: "#ff4500",
  },
  {
    name: "orchid",
    hex: "#da70d6",
  },
  {
    name: "palegoldenrod",
    hex: "#eee8aa",
  },
  {
    name: "palegreen",
    hex: "#98fb98",
  },
  {
    name: "paleturquoise",
    hex: "#afeeee",
  },
  {
    name: "palevioletred",
    hex: "#db7093",
  },
  {
    name: "papayawhip",
    hex: "#ffefd5",
  },
  {
    name: "peachpuff",
    hex: "#ffdab9",
  },
  {
    name: "peru",
    hex: "#cd853f",
  },
  {
    name: "pink",
    hex: "#ffc0cb",
  },
  {
    name: "plum",
    hex: "#dda0dd",
  },
  {
    name: "powderblue",
    hex: "#b0e0e6",
  },
  {
    name: "purple",
    hex: "#800080",
  },
  {
    name: "red",
    hex: "#ff0000",
  },
  {
    name: "rosybrown",
    hex: "#bc8f8f",
  },
  {
    name: "royalblue",
    hex: "#4169e1",
  },
  {
    name: "saddlebrown",
    hex: "#8b4513",
  },
  {
    name: "salmon",
    hex: "#fa8072",
  },
  {
    name: "sandybrown",
    hex: "#f4a460",
  },
  {
    name: "seagreen",
    hex: "#2e8b57",
  },
  {
    name: "seashell",
    hex: "#fff5ee",
  },
  {
    name: "sienna",
    hex: "#a0522d",
  },
  {
    name: "silver",
    hex: "#c0c0c0",
  },
  {
    name: "skyblue",
    hex: "#87ceeb",
  },
  {
    name: "slateblue",
    hex: "#6a5acd",
  },
  {
    name: "slategray",
    hex: "#708090",
  },
  {
    name: "slategrey",
    hex: "#708090",
  },
  {
    name: "snow",
    hex: "#fffafa",
  },
  {
    name: "springgreen",
    hex: "#00ff7f",
  },
  {
    name: "steelblue",
    hex: "#4682b4",
  },
  {
    name: "tan",
    hex: "#d2b48c",
  },
  {
    name: "teal",
    hex: "#008080",
  },
  {
    name: "thistle",
    hex: "#d8bfd8",
  },
  {
    name: "tomato",
    hex: "#ff6347",
  },
  {
    name: "turquoise",
    hex: "#40e0d0",
  },
  {
    name: "violet",
    hex: "#ee82ee",
  },
  {
    name: "wheat",
    hex: "#f5deb3",
  },
  {
    name: "white",
    hex: "#ffffff",
  },
  {
    name: "whitesmoke",
    hex: "#f5f5f5",
  },
  {
    name: "yellow",
    hex: "#ffff00",
  },
  {
    name: "yellowgreen",
    hex: "#9acd32",
  },
  {
    name: "rebeccapurple",
    hex: "#663399",
  },
];
