import {globalEventDelegate} from '../../utils/tools'

export enum TransliterationConvertTypes {
    "ru_en" = "ru_en",
}

interface TransliterationTypes {
    [key: string]: TransliterationType
}
interface TransliterationType {
    regular: string,
    ascii: Array<number>
    map: TransliterationTypeMaps,
}
interface TransliterationTypeMaps {
    [key: string]: string
}
interface TransliterationConvertOption {
    changeBeforeConvert?(str: string): string,
    changeAfterConvert?(str: string): string,
    changeFinalString?(str: string): string,
}

const MAP_CONVERT_TYPES: TransliterationTypes = {
    "ru_en": {
        "regular": '[а-яА-Я]',
        "ascii": [1040,1103],
        "map": {
            "а": "a", "б": "b", "в": "v", "г": "g", "д": "d",
            "е": "e", "ё": "jo", "ж": "zh", "з": "z", "и": "i",
            "й": "j", "к": "k", "л": "l", "м": "m", "н": "n",
            "о": "o", "п": "p", "р": "r", "с": "s", "т": "t",
            "у": "u", "ф": "f", "х": "h", "ц": "c", "ч": "ch",
            "ш": "sh", "щ": "shh", "ъ": "#", "ы": "y", "ь": "'",
            "э": "je", "ю": "ju", "я": "ja",
            "А": "A", "Б": "B", "В": "V", "Г": "G", "Д": "D",
            "Е": "E", "Ё": "Jo", "Ж": "Zh", "З": "Z", "И": "I",
            "Й": "J", "К": "K", "Л": "L", "М": "M", "Н": "N",
            "О": "O", "П": "P", "Р": "R", "С": "S", "Т": "T",
            "У": "U", "Ф": "F", "Х": "H", "Ц": "C", "Ч": "Ch",
            "Ш": "Sh", "Щ": "Shh", "Ъ": "#", "Ы": "Y", "Ь": "'",
            "Э": "Je", "Ю": "Ju", "Я": "Ja"
        },
    }
};

export default class Transliteration {

    private CLASS_FIELD: string = 'gc-translit-field';

    constructor(classField: string) {
        this.CLASS_FIELD = classField;
    }

    private checkCodePeriod(char: string, exceptions?: Array<number>): boolean {
        let exclusionKeys: Array<string> = ['Enter'];
        if (exclusionKeys.indexOf(char) != -1) {
            return false;
        }
        let CharCode: number = char.charCodeAt(0);
        let exceptionsStatus: boolean = false;
        if (exceptions) {
            exceptionsStatus = CharCode >= exceptions[0] && CharCode <= exceptions[1]
        }
        let baseStatus: boolean = CharCode >= 32 && CharCode <= 126;
        return baseStatus || exceptionsStatus;
    }

    public convert(convertType: TransliterationConvertTypes, str: string, option?: TransliterationConvertOption): string {
        // let expression: RegExp = new RegExp(MAP_CONVERT_TYPES[convertType].regular, 'mg');
        // let mapMatches: Array<string> = Array.from(new Set(str.match(expression)) );
        // for (let i = 0, len = mapMatches.length; i < len; i++) {
        //     str = str.replace(new RegExp(mapMatches[i], 'gm'), MAP_CONVERT_TYPES[convertType].map[mapMatches[i]]);
        // }
        let newStr: string = '';
        if (option && option.changeBeforeConvert) {
            str = option.changeBeforeConvert(newStr);
        }
        for (let i = 0, len = str.length; i < len; i++) {
            if (this.checkCodePeriod(str[i], MAP_CONVERT_TYPES[convertType].ascii)) {
                newStr += MAP_CONVERT_TYPES[convertType].map[str[i]] || str[i];
            }
        }
        if (option && option.changeAfterConvert) {
            newStr = option.changeAfterConvert(newStr);
        }
        return newStr;
    }

    public liveChange(convertType: TransliterationConvertTypes, option?: TransliterationConvertOption): void {
        globalEventDelegate('keypress', `.${this.CLASS_FIELD}`, (field: HTMLElement, event: KeyboardEvent) => {
            event.preventDefault();
            let input: HTMLInputElement = <HTMLInputElement> field;
            if (this.checkCodePeriod(event.key, MAP_CONVERT_TYPES[convertType].ascii) ) {
                let newSymbol: string = this.convert(convertType, event.key, option);
                input.value += newSymbol;
            }

            if (option && option.changeFinalString) {
                input.value = option.changeFinalString(input.value);
            }
        });
        globalEventDelegate('paste', `.${this.CLASS_FIELD}`, (field: HTMLElement, event: ClipboardEvent) => {
            event.preventDefault();
            let input: HTMLInputElement = <HTMLInputElement> field;
            let pasteString: string = event.clipboardData.getData('text');
            input.value += this.convert(convertType, pasteString, option);

            if (option && option.changeFinalString) {
                input.value = option.changeFinalString(input.value);
            }
        });
    }
}