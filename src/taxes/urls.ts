import urlJoin from "url-join";

export const taxSection = "/taxes/";

export const countryListPath = taxSection;
export const countryListUrl = taxSection;

export const countryTaxRatesPath = (code: string, section = taxSection) => urlJoin(section, code);
export const countryTaxRatesUrl = countryTaxRatesPath;
