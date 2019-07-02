import Transliteration, {TransliterationConvertTypes} from "../transliteration/Transliteration";
import UrlValidate from "./UrlValidate";

let inputurl: HTMLInputElement = <HTMLInputElement>document.getElementById('test-inp-url');
Transliteration.liveChangeAll('kc-url-field', TransliterationConvertTypes.ru_en, {
    changeAfterConvert(str: string): string {
        return UrlValidate.validateSymbol(str);
    },
    changeFinalString(str: string): string {
        return UrlValidate.validate(str);
    }
});