import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CountryService {
  constructor(private http: HttpClient) {}

  getAllCurrencies() {
    return Promise.resolve(this.getCurrencies());
  }
  getAllCountries() {
    return Promise.resolve(this.getCountries());
  }
  getCountries() {
    return [
      {
        name: "Republic of Moldova",
        cca2: "MD",
      },
      {
        name: "United States of America",
        cca2: "US",
      },
      {
        name: "Department of Mayotte",
        cca2: "YT",
      },
      {
        name: "Republic of Nauru",
        cca2: "NR",
      },
      {
        name: "Republic of Mozambique",
        cca2: "MZ",
      },
      {
        name: "Federative Republic of Brazil",
        cca2: "BR",
      },
      {
        name: "Republic of Cabo Verde",
        cca2: "CV",
      },
      {
        name: "Republic of Equatorial Guinea",
        cca2: "GQ",
      },
      {
        name: "Republic of Albania",
        cca2: "AL",
      },
      {
        name: "Virgin Islands of the United States",
        cca2: "VI",
      },
      {
        name: "Niue",
        cca2: "NU",
      },
      {
        name: "Republic of Palau",
        cca2: "PW",
      },
      {
        name: "Federal Republic of Nigeria",
        cca2: "NG",
      },
      {
        name: "Virgin Islands",
        cca2: "VG",
      },
      {
        name: "Republic of the Gambia",
        cca2: "GM",
      },
      {
        name: "Federal Republic of Somalia",
        cca2: "SO",
      },
      {
        name: "Republic of Yemen",
        cca2: "YE",
      },
      {
        name: "Malaysia",
        cca2: "MY",
      },
      {
        name: "Commonwealth of Dominica",
        cca2: "DM",
      },
      {
        name: "United Kingdom of Great Britain and Northern Ireland",
        cca2: "GB",
      },
      {
        name: "Republic of Madagascar",
        cca2: "MG",
      },
      {
        name: "Sahrawi Arab Democratic Republic",
        cca2: "EH",
      },
      {
        name: "Republic of Cyprus",
        cca2: "CY",
      },
      {
        name: "Antigua and Barbuda",
        cca2: "AG",
      },
      {
        name: "Republic of Ireland",
        cca2: "IE",
      },
      {
        name: "Republic of Paraguay",
        cca2: "PY",
      },
      {
        name: "Democratic Socialist Republic of Sri Lanka",
        cca2: "LK",
      },
      {
        name: "Republic of South Africa",
        cca2: "ZA",
      },
      {
        name: "State of Kuwait",
        cca2: "KW",
      },
      {
        name: "People's Democratic Republic of Algeria",
        cca2: "DZ",
      },
      {
        name: "Republic of Croatia",
        cca2: "HR",
      },
      {
        name: "Martinique",
        cca2: "MQ",
      },
      {
        name: "Republic of Sierra Leone",
        cca2: "SL",
      },
      {
        name: "Commonwealth of the Northern Mariana Islands",
        cca2: "MP",
      },
      {
        name: "Republic of Rwanda",
        cca2: "RW",
      },
      {
        name: "Syrian Arab Republic",
        cca2: "SY",
      },
      {
        name: "Saint Vincent and the Grenadines",
        cca2: "VC",
      },
      {
        name: "Republic of Kosovo",
        cca2: "XK",
      },
      {
        name: "Saint Lucia",
        cca2: "LC",
      },
      {
        name: "Republic of Honduras",
        cca2: "HN",
      },
      {
        name: "Hashemite Kingdom of Jordan",
        cca2: "JO",
      },
      {
        name: "Tuvalu",
        cca2: "TV",
      },
      {
        name: "Federal Democratic Republic of Nepal",
        cca2: "NP",
      },
      {
        name: "Republic of Liberia",
        cca2: "LR",
      },
      {
        name: "Heard Island and McDonald Islands",
        cca2: "HM",
      },
      {
        name: "Republic of Austria",
        cca2: "AT",
      },
      {
        name: "Bailiwick of Guernsey",
        cca2: "GG",
      },
      {
        name: "Central African Republic",
        cca2: "CF",
      },
      {
        name: "Islamic Republic of Mauritania",
        cca2: "MR",
      },
      {
        name: "Republic of Djibouti",
        cca2: "DJ",
      },
      {
        name: "Republic of Fiji",
        cca2: "FJ",
      },
      {
        name: "Kingdom of Norway",
        cca2: "NO",
      },
      {
        name: "Republic of Latvia",
        cca2: "LV",
      },
      {
        name: "Falkland Islands",
        cca2: "FK",
      },
      {
        name: "Republic of Kazakhstan",
        cca2: "KZ",
      },
      {
        name: "Åland Islands",
        cca2: "AX",
      },
      {
        name: "Turkmenistan",
        cca2: "TM",
      },
      {
        name: "Territory of the Cocos (Keeling) Islands",
        cca2: "CC",
      },
      {
        name: "Republic of Bulgaria",
        cca2: "BG",
      },
      {
        name: "Tokelau",
        cca2: "TK",
      },
      {
        name: "New Caledonia",
        cca2: "NC",
      },
      {
        name: "Barbados",
        cca2: "BB",
      },
      {
        name: "Democratic Republic of São Tomé and Príncipe",
        cca2: "ST",
      },
      {
        name: "Antarctica",
        cca2: "AQ",
      },
      {
        name: "Nation of Brunei, Abode of Peace",
        cca2: "BN",
      },
      {
        name: "Kingdom of Bhutan",
        cca2: "BT",
      },
      {
        name: "Republic of Cameroon",
        cca2: "CM",
      },
      {
        name: "Argentine Republic",
        cca2: "AR",
      },
      {
        name: "Republic of Azerbaijan",
        cca2: "AZ",
      },
      {
        name: "United Mexican States",
        cca2: "MX",
      },
      {
        name: "Kingdom of Morocco",
        cca2: "MA",
      },
      {
        name: "Republic of Guatemala",
        cca2: "GT",
      },
      {
        name: "Republic of Kenya",
        cca2: "KE",
      },
      {
        name: "Republic of Malta",
        cca2: "MT",
      },
      {
        name: "Czech Republic",
        cca2: "CZ",
      },
      {
        name: "Gibraltar",
        cca2: "GI",
      },
      {
        name: "Aruba",
        cca2: "AW",
      },
      {
        name: "Collectivity of Saint Barthélemy",
        cca2: "BL",
      },
      {
        name: "Principality of Monaco",
        cca2: "MC",
      },
      {
        name: "United Arab Emirates",
        cca2: "AE",
      },
      {
        name: "Republic of South Sudan",
        cca2: "SS",
      },
      {
        name: "Commonwealth of Puerto Rico",
        cca2: "PR",
      },
      {
        name: "Republic of El Salvador",
        cca2: "SV",
      },
      {
        name: "French Republic",
        cca2: "FR",
      },
      {
        name: "Republic of Niger",
        cca2: "NE",
      },
      {
        name: "Republic of Côte d'Ivoire",
        cca2: "CI",
      },
      {
        name: "South Georgia and the South Sandwich Islands",
        cca2: "GS",
      },
      {
        name: "Republic of Botswana",
        cca2: "BW",
      },
      {
        name: "British Indian Ocean Territory",
        cca2: "IO",
      },
      {
        name: "Republic of Uzbekistan",
        cca2: "UZ",
      },
      {
        name: "Tunisian Republic",
        cca2: "TN",
      },
      {
        name: "Hong Kong Special Administrative Region of the People's Republic of China",
        cca2: "HK",
      },
      {
        name: "Republic of North Macedonia",
        cca2: "MK",
      },
      {
        name: "Republic of Suriname",
        cca2: "SR",
      },
      {
        name: "Kingdom of Belgium",
        cca2: "BE",
      },
      {
        name: "American Samoa",
        cca2: "AS",
      },
      {
        name: "Solomon Islands",
        cca2: "SB",
      },
      {
        name: "Ukraine",
        cca2: "UA",
      },
      {
        name: "Republic of Finland",
        cca2: "FI",
      },
      {
        name: "Burkina Faso",
        cca2: "BF",
      },
      {
        name: "Bosnia and Herzegovina",
        cca2: "BA",
      },
      {
        name: "Islamic Republic of Iran",
        cca2: "IR",
      },
      {
        name: "Republic of Cuba",
        cca2: "CU",
      },
      {
        name: "State of Eritrea",
        cca2: "ER",
      },
      {
        name: "Slovak Republic",
        cca2: "SK",
      },
      {
        name: "Republic of Lithuania",
        cca2: "LT",
      },
      {
        name: "Saint Martin",
        cca2: "MF",
      },
      {
        name: "Pitcairn Group of Islands",
        cca2: "PN",
      },
      {
        name: "Republic of Guinea-Bissau",
        cca2: "GW",
      },
      {
        name: "Montserrat",
        cca2: "MS",
      },
      {
        name: "Republic of Turkey",
        cca2: "TR",
      },
      {
        name: "Republic of the Philippines",
        cca2: "PH",
      },
      {
        name: "Republic of Vanuatu",
        cca2: "VU",
      },
      {
        name: "Plurinational State of Bolivia",
        cca2: "BO",
      },
      {
        name: "Federation of Saint Christopher and Nevis",
        cca2: "KN",
      },
      {
        name: "Romania",
        cca2: "RO",
      },
      {
        name: "Kingdom of Cambodia",
        cca2: "KH",
      },
      {
        name: "Republic of Zimbabwe",
        cca2: "ZW",
      },
      {
        name: "Bailiwick of Jersey",
        cca2: "JE",
      },
      {
        name: "Kyrgyz Republic",
        cca2: "KG",
      },
      {
        name: "Bonaire, Sint Eustatius and Saba",
        cca2: "BQ",
      },
      {
        name: "Co-operative Republic of Guyana",
        cca2: "GY",
      },
      {
        name: "United States Minor Outlying Islands",
        cca2: "UM",
      },
      {
        name: "Republic of Armenia",
        cca2: "AM",
      },
      {
        name: "Lebanese Republic",
        cca2: "LB",
      },
      {
        name: "Montenegro",
        cca2: "ME",
      },
      {
        name: "Greenland",
        cca2: "GL",
      },
      {
        name: "Independent State of Papua New Guinea",
        cca2: "PG",
      },
      {
        name: "Republic of Zambia",
        cca2: "ZM",
      },
      {
        name: "Republic of Trinidad and Tobago",
        cca2: "TT",
      },
      {
        name: "Territory of the French Southern and Antarctic Lands",
        cca2: "TF",
      },
      {
        name: "Republic of Peru",
        cca2: "PE",
      },
      {
        name: "Kingdom of Sweden",
        cca2: "SE",
      },
      {
        name: "Republic of the Sudan",
        cca2: "SD",
      },
      {
        name: "Saint Pierre and Miquelon",
        cca2: "PM",
      },
      {
        name: "Sultanate of Oman",
        cca2: "OM",
      },
      {
        name: "Republic of India",
        cca2: "IN",
      },
      {
        name: "Republic of China (Taiwan)",
        cca2: "TW",
      },
      {
        name: "Mongolia",
        cca2: "MN",
      },
      {
        name: "Republic of Senegal",
        cca2: "SN",
      },
      {
        name: "United Republic of Tanzania",
        cca2: "TZ",
      },
      {
        name: "Canada",
        cca2: "CA",
      },
      {
        name: "Republic of Costa Rica",
        cca2: "CR",
      },
      {
        name: "People's Republic of China",
        cca2: "CN",
      },
      {
        name: "Republic of Colombia",
        cca2: "CO",
      },
      {
        name: "Republic of the Union of Myanmar",
        cca2: "MM",
      },
      {
        name: "Russian Federation",
        cca2: "RU",
      },
      {
        name: "Democratic People's Republic of Korea",
        cca2: "KP",
      },
      {
        name: "Cayman Islands",
        cca2: "KY",
      },
      {
        name: "Bouvet Island",
        cca2: "BV",
      },
      {
        name: "Republic of Belarus",
        cca2: "BY",
      },
      {
        name: "Portuguese Republic",
        cca2: "PT",
      },
      {
        name: "Kingdom of Eswatini",
        cca2: "SZ",
      },
      {
        name: "Republic of Poland",
        cca2: "PL",
      },
      {
        name: "Swiss Confederation",
        cca2: "CH",
      },
      {
        name: "Republic of the Congo",
        cca2: "CG",
      },
      {
        name: "Bolivarian Republic of Venezuela",
        cca2: "VE",
      },
      {
        name: "Republic of Panama",
        cca2: "PA",
      },
      {
        name: "Kingdom of the Netherlands",
        cca2: "NL",
      },
      {
        name: "Independent State of Samoa",
        cca2: "WS",
      },
      {
        name: "Kingdom of Denmark",
        cca2: "DK",
      },
      {
        name: "Grand Duchy of Luxembourg",
        cca2: "LU",
      },
      {
        name: "Faroe Islands",
        cca2: "FO",
      },
      {
        name: "Republic of Slovenia",
        cca2: "SI",
      },
      {
        name: "Togolese Republic",
        cca2: "TG",
      },
      {
        name: "Kingdom of Thailand",
        cca2: "TH",
      },
      {
        name: "Territory of the Wallis and Futuna Islands",
        cca2: "WF",
      },
      {
        name: "Commonwealth of the Bahamas",
        cca2: "BS",
      },
      {
        name: "Kingdom of Tonga",
        cca2: "TO",
      },
      {
        name: "Hellenic Republic",
        cca2: "GR",
      },
      {
        name: "Republic of San Marino",
        cca2: "SM",
      },
      {
        name: "Réunion Island",
        cca2: "RE",
      },
      {
        name: "Vatican City State",
        cca2: "VA",
      },
      {
        name: "Republic of Burundi",
        cca2: "BI",
      },
      {
        name: "Kingdom of Bahrain",
        cca2: "BH",
      },
      {
        name: "Republic of the Marshall Islands",
        cca2: "MH",
      },
      {
        name: "Turks and Caicos Islands",
        cca2: "TC",
      },
      {
        name: "Isle of Man",
        cca2: "IM",
      },
      {
        name: "Republic of Haiti",
        cca2: "HT",
      },
      {
        name: "Islamic Republic of Afghanistan",
        cca2: "AF",
      },
      {
        name: "State of Israel",
        cca2: "IL",
      },
      {
        name: "State of Libya",
        cca2: "LY",
      },
      {
        name: "Oriental Republic of Uruguay",
        cca2: "UY",
      },
      {
        name: "Territory of Norfolk Island",
        cca2: "NF",
      },
      {
        name: "Republic of Nicaragua",
        cca2: "NI",
      },
      {
        name: "Cook Islands",
        cca2: "CK",
      },
      {
        name: "Lao People's Democratic Republic",
        cca2: "LA",
      },
      {
        name: "Territory of Christmas Island",
        cca2: "CX",
      },
      {
        name: "Saint Helena, Ascension and Tristan da Cunha",
        cca2: "SH",
      },
      {
        name: "Anguilla",
        cca2: "AI",
      },
      {
        name: "Federated States of Micronesia",
        cca2: "FM",
      },
      {
        name: "Federal Republic of Germany",
        cca2: "DE",
      },
      {
        name: "Guam",
        cca2: "GU",
      },
      {
        name: "Independent and Sovereign Republic of Kiribati",
        cca2: "KI",
      },
      {
        name: "Sint Maarten",
        cca2: "SX",
      },
      {
        name: "Kingdom of Spain",
        cca2: "ES",
      },
      {
        name: "Jamaica",
        cca2: "JM",
      },
      {
        name: "State of Palestine",
        cca2: "PS",
      },
      {
        name: "Guiana",
        cca2: "GF",
      },
      {
        name: "Principality of Andorra",
        cca2: "AD",
      },
      {
        name: "Republic of Chile",
        cca2: "CL",
      },
      {
        name: "Kingdom of Lesotho",
        cca2: "LS",
      },
      {
        name: "Commonwealth of Australia",
        cca2: "AU",
      },
      {
        name: "Grenada",
        cca2: "GD",
      },
      {
        name: "Republic of Ghana",
        cca2: "GH",
      },
      {
        name: "Republic of Seychelles",
        cca2: "SC",
      },
      {
        name: "Republic of Angola",
        cca2: "AO",
      },
      {
        name: "Bermuda",
        cca2: "BM",
      },
      {
        name: "Islamic Republic of Pakistan",
        cca2: "PK",
      },
      {
        name: "Republic of Mali",
        cca2: "ML",
      },
      {
        name: "Kingdom of Saudi Arabia",
        cca2: "SA",
      },
      {
        name: "Country of Curaçao",
        cca2: "CW",
      },
      {
        name: "Republic of Korea",
        cca2: "KR",
      },
      {
        name: "Federal Democratic Republic of Ethiopia",
        cca2: "ET",
      },
      {
        name: "Guadeloupe",
        cca2: "GP",
      },
      {
        name: "People's Republic of Bangladesh",
        cca2: "BD",
      },
      {
        name: "New Zealand",
        cca2: "NZ",
      },
      {
        name: "Union of the Comoros",
        cca2: "KM",
      },
      {
        name: "Belize",
        cca2: "BZ",
      },
      {
        name: "Republic of Uganda",
        cca2: "UG",
      },
      {
        name: "Republic of Singapore",
        cca2: "SG",
      },
      {
        name: "Principality of Liechtenstein",
        cca2: "LI",
      },
      {
        name: "Hungary",
        cca2: "HU",
      },
      {
        name: "Iceland",
        cca2: "IS",
      },
      {
        name: "Republic of Tajikistan",
        cca2: "TJ",
      },
      {
        name: "Republic of Namibia",
        cca2: "NA",
      },
      {
        name: "Democratic Republic of Timor-Leste",
        cca2: "TL",
      },
      {
        name: "Arab Republic of Egypt",
        cca2: "EG",
      },
      {
        name: "Republic of Serbia",
        cca2: "RS",
      },
      {
        name: "Republic of Mauritius",
        cca2: "MU",
      },
      {
        name: "Macao Special Administrative Region of the People's Republic of China",
        cca2: "MO",
      },
      {
        name: "French Polynesia",
        cca2: "PF",
      },
      {
        name: "Republic of the Maldives",
        cca2: "MV",
      },
      {
        name: "Republic of Indonesia",
        cca2: "ID",
      },
      {
        name: "Democratic Republic of the Congo",
        cca2: "CD",
      },
      {
        name: "Republic of Estonia",
        cca2: "EE",
      },
      {
        name: "Socialist Republic of Vietnam",
        cca2: "VN",
      },
      {
        name: "Italian Republic",
        cca2: "IT",
      },
      {
        name: "Republic of Guinea",
        cca2: "GN",
      },
      {
        name: "Republic of Chad",
        cca2: "TD",
      },
      {
        name: "Republic of Ecuador",
        cca2: "EC",
      },
      {
        name: "Georgia",
        cca2: "GE",
      },
      {
        name: "Republic of Malawi",
        cca2: "MW",
      },
      {
        name: "Republic of Iraq",
        cca2: "IQ",
      },
      {
        name: "Svalbard og Jan Mayen",
        cca2: "SJ",
      },
      {
        name: "Republic of Benin",
        cca2: "BJ",
      },
      {
        name: "Japan",
        cca2: "JP",
      },
      {
        name: "Dominican Republic",
        cca2: "DO",
      },
      {
        name: "State of Qatar",
        cca2: "QA",
      },
      {
        name: "Gabonese Republic",
        cca2: "GA",
      },
    ];
  }
  getCurrencies() {
    return [
      "BIF",
      "CVE",
      "KMF",
      "CDF",
      "DJF",
      "ERN",
      "GNF",
      "LSL",
      "LYD",
      "MWK",
      "SLL",
      "SZL",
      "TJS",
      "TOP",
      "XPF",
      "XOF",
      "XAF",
      "WST",
      "VUV",
      "UGX",
      "TZS",
      "RWF",
      "PGK",
      "MVR",
      "MOP",
      "MMK",
      "MDL",
      "HTG",
      "GMD",
      "GEL",
      "ETB",
      "BTN",
      "BDT",
      "AOA",
      "AED",
      "MGA",
      "GHS",
      "TMT",
      "DZD",
      "MAD",
      "KWD",
      "TND",
      "RUB",
      "AZN",
      "BGN",
      "UZS",
      "KZT",
      "KGS",
      "RSD",
      "MKD",
      "PLN",
      "TTD",
      "PEN",
      "SOS",
      "IDR",
      "MYR",
      "DOP",
      "BRL",
      "ZAR",
      "GTQ",
      "BYN",
      "BWP",
      "TWD",
      "MZN",
      "ALL",
      "RON",
      "HNL",
      "KES",
      "SEK",
      "NOK",
      "ISK",
      "DKK",
      "HRK",
      "BAM",
      "CZK",
      "JOD",
      "JMD",
      "PYG",
      "AWG",
      "ANG",
      "HUF",
      "CHF",
      "NIO",
      "BZD",
      "VEF",
      "PAB",
      "YER",
      "SAR",
      "QAR",
      "OMR",
      "SCR",
      "PKR",
      "NPR",
      "MUR",
      "LKR",
      "UAH",
      "PHP",
      "MNT",
      "LAK",
      "EUR",
      "VND",
      "ILS",
      "KRW",
      "NGN",
      "CRC",
      "KHR",
      "THB",
      "AFN",
      "JPY",
      "CNY",
      "FKP",
      "SHP",
      "GIP",
      "LBP",
      "GBP",
      "EGP",
      "UYU",
      "BOB",
      "USD",
      "BMD",
      "SBD",
      "XCD",
      "SGD",
      "NZD",
      "MXN",
      "LRD",
      "KYD",
      "HKD",
      "GYD",
      "FJD",
      "COP",
      "CLP",
      "CAD",
      "BSD",
      "BND",
      "BBD",
      "AUD",
      "ARS",
      "NAD",
      "SRD",
      "BHD",
      "AMD",
      "TRY",
      "INR",
      "IQD",
      "ZMW",
    ];
  }
}
