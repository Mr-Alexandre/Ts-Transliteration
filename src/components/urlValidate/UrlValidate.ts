import {globalEventDelegate} from "../../utils/tools";

export default class UrlValidate {

    static RESERVED_CHARACTERS: Array<string> = [
        "`", "!", "@", "\"", "#", "№", "$", "%", "^", "&", "*", "(", ")", "+", "=", "{", "}", "\\[", "\\]", ":", ";", "'", "<", ">", ",", "?", "~", "."
    ];

    static validateSymbol(str: string): string {
        let newStr: string = str.replace(new RegExp(`[${this.RESERVED_CHARACTERS.join('')}]`, 'gm'), '');
        newStr = newStr.replace(/\s/gm, '-');
        return newStr;
    }

    static validate(str: string): string {
        if (str[0] != '/') {
            str = ['/', ...str.split('')].join('');
        }
        return str;
    }

    static checkBaseCodePeriod(char: string): boolean {
        let CharCode: number = char.charCodeAt(0);
        return CharCode >= 32 && CharCode <= 126;
    }

    static liveChange(inputClass: string): void {
        globalEventDelegate('keypress', `.${inputClass}`, (field: HTMLElement, event: KeyboardEvent) => {
            event.preventDefault();
            let input: HTMLInputElement = <HTMLInputElement> field;

            if (this.checkBaseCodePeriod(event.key)) {
                let newSymbol: string = '';
                newSymbol = this.validateSymbol(event.key);
                input.value += newSymbol;
            }
            input.value = this.validate(input.value);
        });
        globalEventDelegate('paste', `.${inputClass}`, (field: HTMLElement, event: ClipboardEvent) => {
            event.preventDefault();
            let input: HTMLInputElement = <HTMLInputElement> field;
            let pasteString: string = event.clipboardData.getData('text');
            let newSymbol: string = '';
            newSymbol = this.validateSymbol(pasteString);
            input.value += this.validateSymbol(newSymbol);
            input.value = this.validate(input.value);
        });
    }
}