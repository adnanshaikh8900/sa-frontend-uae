import moment from "moment";
import { data } from "screens/Language/index";
import LocalizedStrings from "react-localization";
import { selectOptionsFactory, selectCurrencyFactory } from 'utils';


const language = window["localStorage"].getItem("language");
const strings = new LocalizedStrings(data);
strings.setLanguage(language ?? 'en');


export const getCurrencyDropdown = (list) => {
    const newList = list ? selectCurrencyFactory.renderOptions(
        'currencyName',
        'currencyCode',
        list,
        strings.Currency
    ) : []
    return newList;
};

export const getCountryDropdown = (list) => {
    const newList = list ? selectOptionsFactory.renderOptions(
        'countryName',
        'countryCode',
        list,
        'Country',
    ) : []
    return newList;
};

