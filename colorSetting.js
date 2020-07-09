// https://github.com/ardittristan/VTTColorSettings

import Picker from "./vanilla-picker.min.mjs";
import html2canvas from './html2canvas.esm.min.js';

var pickerShown = {};
var data = {};

function runInit() {
    console.log("ColorSettings | initializing");

    // monkeypatch the onclick event of settings to allow for more settings types
    SettingsConfig.prototype._onClickSubmenu = function (event) {
        event.preventDefault();
        const menu = game.settings.menus.get(event.currentTarget.dataset.key);
        if (!menu) return ui.notifications.error("No submenu found for the provided key");
        try {
            const app = new menu.type();
            return app.render(true);
        } catch {
            const app = new menu.type(event);
            return app.render(true);
        }
    };
}

function registerInitVar() {
    if (window.Ardittristan.initialColorSettingRun != undefined) {
        return;
    }
    window.Ardittristan.initialColorSettingRun = false;
}

function registerClass() {
    if (window.Ardittristan.ColorSetting) {
        return;
    }
    window.Ardittristan.ColorSetting = ColorSetting;
}




export default class ColorSetting {
    /**
     * @param  {String} module    The namespace under which the setting/menu is registered
     * @param  {String} key       The key name for the setting under the namespace module
     * @param  {{name: String, label: String, restricted: Boolean, defaultColor: String, scope: String, onChange: function(String)}} options   Configuration for setting data
     * @example
     * // Add a setting with a color picker
     * new ColorSetting("myModule", "myColorSetting", {
     *   name: "My Color Setting",      // The name of the setting in the settings menu
     *   hint: "Click on the button",   // A description of the registered setting and its behavior
     *   label: "Color Picker",         // The text label used in the button
     *   restricted: false,             // Restrict this setting to gamemaster only?
     *   defaultColor: "#000000ff",     // The default color of the setting
     *   scope: "client",               // The scope of the setting
     *   onChange: (value) => {}        // A callback function which triggers when the setting is changed
     * })
     */
    constructor(module, key, options = {}) {
        if (!window.Ardittristan.initialColorSettingRun) { runInit(); window.Ardittristan.initialColorSettingRun = true; }
        this.defaultOptions = {
            hint: undefined,
            name: "",
            label: "Color Picker",
            restricted: false,
            defaultColor: "#000000ff",
            scope: "client",
            onChange: undefined
        };
        this.options = { ...this.defaultOptions, ...options };
        this.module = module;
        this.key = key;

        data[`${this.module}.${this.key}`] = [this.module, this.key, this.options.label];

        game.settings.registerMenu(this.module, this.key, {
            hint: this.options.hint,
            name: this.options.name,
            label: this.options.label,
            icon: 'fas fa-tint',
            type: SettingsForm,
            restricted: this.options.restricted
        });

        // add onchange capability
        this.settingsOptions = {
            scope: this.options.scope,
            config: false,
            default: this.options.defaultColor,
            type: String
        };
        if (this.options.onChange != undefined) {
            this.settingsOptions = { ...this.settingsOptions, ...{ onChange: this.options.onChange } };
        }

        game.settings.register(this.module, this.key, this.settingsOptions);

        _settingsWatcher(this.module, this.key);

        pickerShown[`${this.module}.${this.key}`] = false;
    }
}




class SettingsForm extends FormApplication {
    constructor(event) {
        super();
        this.settings = data[event.currentTarget.dataset.key];
        this.module = this.settings[0];
        this.key = this.settings[1];
        this.label = this.settings[2];
        this.picker = new Picker();
        this._getEyeDropper = this._getEyeDropper.bind(this);
    }

    async render() {
        let x = document.querySelectorAll("div.settings-list div.form-group.submenu button");
        for (let element of x) {
            try {
                if (element.dataset.key.includes(`${this.module}.${this.key}`)) {
                    if (this._showPicker(element)) {
                        this.picker._domCancel.textContent = " Eye Dropper";
                        this.picker._domCancel.style.paddingBottom = 0;
                        this.picker._domCancel.style.paddingTop = 0;
                        this.picker._domCancel.onclick = () => {
                            setTimeout(() => {
                                document.addEventListener("click", this._getEyeDropper, true);
                            }, 50);
                        };
                        jQuery(this.picker.domElement).find("div.picker_cancel").each(function () {
                            if (this.firstChild.firstChild.textContent === " Eye Dropper") {
                                let faIcon = document.createElement("i");
                                faIcon.className = "fas fa-eye-dropper";
                                this.firstChild.prepend(faIcon);
                            }
                        });
                    }
                }
            } catch { }
        }
    }
    /**
     * @param  {Element} element
     */
    _showPicker(element) {
        if (pickerShown[`${this.module}.${this.key}`]) {
            let x = document.querySelectorAll("div.settings-list div.form-group.submenu button");
            for (let pickerElement of x) {
                try {
                    if (pickerElement.dataset.key.includes(`${this.module}.${this.key}`)) {
                        pickerElement.parentElement.removeChild(pickerElement.nextElementSibling);
                        this.picker.destroy();
                        pickerShown[`${this.module}.${this.key}`] = false;
                        element.style.maxWidth = "100%";
                    }
                } catch { }
            }
            return false;
        } else {
            pickerShown[`${this.module}.${this.key}`] = true;
            this.picker.setOptions({
                parent: element.parentElement,
                popup: false,
                color: game.settings.get(this.module, this.key),
                cancelButton: true,
                onDone: (color) => {
                    this.picker.destroy();
                    pickerShown[`${this.module}.${this.key}`] = false;
                    game.settings.set(this.module, this.key, color.hex);
                    element.style.backgroundColor = color.hex;
                    element.style.color = getTextColor(color.hex);
                    element.style.maxWidth = "100%";
                }
            });
            /** @type {HTMLElement} */
            let pickerElement = this.picker.domElement;
            if (pickerElement.parentElement.getElementsByClassName('notes')) {
                jQuery(pickerElement).insertAfter(element);
            }
            this.picker.show();

            element.style.maxWidth = `${this.label.length * 1.25 + 4.5}%`;
            return true;
        }
    }

    async _getEyeDropper(event) {
        let _this = this;
        event.preventDefault();
        event.stopPropagation();
        document.removeEventListener("click", this._getEyeDropper, true);
        html2canvas(document.body).then(function (canvas) {
            let x = event.pageX,
                y = event.pageY,
                ctx = canvas.getContext('2d');

            const color = [ctx.getImageData(x, y, 1, 1).data[0], ctx.getImageData(x, y, 1, 1).data[1], ctx.getImageData(x, y, 1, 1).data[2], ctx.getImageData(x, y, 1, 1).data[3] / 255];
            _this.picker.setColor(color);
        });
    }
}




class colorPickerInput extends HTMLInputElement {
    constructor(...args) {
        super(...args);
        // this.value = text in input box
        this.picker = undefined;
        this.working = false;
        this._getEyeDropper = this._getEyeDropper.bind(this);
        this._makePicker = this._makePicker.bind(this);
        let _this = this;
        if (this.id === "permanent") {
            if (!_this.working) {
                this._makePicker("picker_inline");
            }
        }
        else {
            this.addEventListener("focusin", () => {
                if (!_this.working) {
                    this._makePicker("picker_popin");
                }
            });

            this.addEventListener("focusout", () => {
                setTimeout(() => {
                    if (!_this.working) {
                        _this.picker.destroy();
                    }
                }, 100);
            });
        }
    }

    _makePicker(pickerClass) {
        this.picker = new Picker();
        this.picker.setOptions({
            popup: false,
            parent: this.parentElement,
            cancelButton: true,
            onDone: (color) => {
                this.value = color.hex;
            }
        });
        if (this.picker._domCancel) {
            this.picker._domCancel.textContent = " Eye Dropper";
            this.picker._domCancel.style.paddingBottom = 0;
            this.picker._domCancel.style.paddingTop = 0;
            this.picker._domCancel.onclick = () => {
                this.working = true;
                setTimeout(() => {
                    document.addEventListener("click", this._getEyeDropper, true);
                }, 50);
            };
        }

        if (this.value != undefined && this.value.length != 0 && this.value.startsWith("#") && this.value.match(/[^A-Fa-f0-9#]+/g) != null) {
            this.picker.setColor(this.value, true);
        }
        jQuery(this.picker.domElement).insertAfter(this).addClass(pickerClass);

        jQuery(this.picker.domElement).find("div.picker_cancel").each(function () {
            if (this.firstChild.firstChild.textContent === " Eye Dropper") {
                let faIcon = document.createElement("i");
                faIcon.className = "fas fa-eye-dropper";
                this.firstChild.prepend(faIcon);
            }
        });
    }

    async _getEyeDropper(event) {
        let _this = this;
        event.preventDefault();
        event.stopPropagation();
        document.removeEventListener("click", this._getEyeDropper, true);
        html2canvas(document.body).then(function (canvas) {
            let x = event.pageX,
                y = event.pageY,
                ctx = canvas.getContext('2d');

            const color = [ctx.getImageData(x, y, 1, 1).data[0], ctx.getImageData(x, y, 1, 1).data[1], ctx.getImageData(x, y, 1, 1).data[2], ctx.getImageData(x, y, 1, 1).data[3] / 255];
            _this.picker.setColor(color);
            _this.focus();
            setTimeout(() => {
                _this.working = false;
            }, 50);
        });
    }
};

customElements.define('colorpicker-input', colorPickerInput, {
    extends: 'input'
});




// settings formatting watcher
async function _settingsWatcher(module, key) {
    Hooks.on('renderSettingsConfig', () => {
        pickerShown = {};
        var x = document.querySelectorAll("div.settings-list div.form-group.submenu button");
        for (let element of x) {
            try {
                if (element.dataset.key.includes(`${module}.${key}`)) {
                    const color = game.settings.get(module, key);
                    element.style.backgroundColor = color;
                    element.style.color = getTextColor(color);
                }
            } catch { }
        }
    });
}

// Hex to rgba
function _convertHexUnitTo256(hexStr) { return parseInt(hexStr.repeat(2 / hexStr.length), 16); }

/**
 * turn hex rgba into rgba string
 * @param {String} hex 8 long hex value in string form, eg: "#123456ff"
 * @returns Array of rgba[r, g, b, a]
 */
export function hexToRGBA(hex) {
    const hexArr = hex.slice(1).match(new RegExp(".{2}", "g"));
    const [r, g, b, a] = hexArr.map(_convertHexUnitTo256);
    return [r, g, b, Math.round((a / 256 + Number.EPSILON) * 100) / 100];
}

/**
 * makes text white or black according to background color
 * @param {String} rgbaHex 8 long hex value in string form, eg: "#123456ff"
 * @returns {String} "black" or "white"
 */
export function getTextColor(rgbaHex) {
    const rgba = hexToRGBA(rgbaHex);
    const brightness = Math.round((
        (rgba[0] * 299) +
        (rgba[1] * 587) +
        (rgba[2] * 114)
    ) / 1000);
    if (rgba[3] > 0.5) {
        return (brightness > 125) ? 'black' : 'white';
    } else {
        return 'black';
    }
}

window.Ardittristan = window.Ardittristan || {};
registerClass();
registerInitVar();
