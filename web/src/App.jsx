import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const languages = {
    "am-ET": "Amharic",
    "ar-SA": "Arabic",
    "be-BY": "Belarusian",
    "bem-ZM": "Bemba",
    "bi-VU": "Bislama",
    "bjs-BB": "Bajan",
    "bn-IN": "Bengali",
    "bo-CN": "Tibetan",
    "br-FR": "Breton",
    "bs-BA": "Bosnian",
    "ca-ES": "Catalan",
    "cop-EG": "Coptic",
    "cs-CZ": "Czech",
    "cy-GB": "Welsh",
    "da-DK": "Danish",
    "dz-BT": "Dzongkha",
    "de-DE": "German",
    "dv-MV": "Maldivian",
    "el-GR": "Greek",
    "en-GB": "English",
    "es-ES": "Spanish",
    "et-EE": "Estonian",
    "eu-ES": "Basque",
    "fa-IR": "Persian",
    "fi-FI": "Finnish",
    "fn-FNG": "Fanagalo",
    "fo-FO": "Faroese",
    "fr-FR": "French",
    "gl-ES": "Galician",
    "gu-IN": "Gujarati",
    "ha-NE": "Hausa",
    "he-IL": "Hebrew",
    "hi-IN": "Hindi",
    "hr-HR": "Croatian",
    "hu-HU": "Hungarian",
    "id-ID": "Indonesian",
    "is-IS": "Icelandic",
    "it-IT": "Italian",
    "ja-JP": "Japanese",
    "kk-KZ": "Kazakh",
    "km-KM": "Khmer",
    "kn-IN": "Kannada",
    "ko-KR": "Korean",
    "ku-TR": "Kurdish",
    "ky-KG": "Kyrgyz",
    "la-VA": "Latin",
    "lo-LA": "Lao",
    "lv-LV": "Latvian",
    "men-SL": "Mende",
    "mg-MG": "Malagasy",
    "mi-NZ": "Maori",
    "ms-MY": "Malay",
    "mt-MT": "Maltese",
    "my-MM": "Burmese",
    "ne-NP": "Nepali",
    "niu-NU": "Niuean",
    "nl-NL": "Dutch",
    "no-NO": "Norwegian",
    "ny-MW": "Nyanja",
    "ur-PK": "Urdu",
    "pau-PW": "Palauan",
    "pa-IN": "Punjabi",
    "ps-PK": "Pashto",
    "pis-SB": "Pijin",
    "pl-PL": "Polish",
    "pt-PT": "Portuguese",
    "rn-BI": "Kirundi",
    "ro-RO": "Romanian",
    "ru-RU": "Russian",
    "sg-CF": "Sango",
    "si-LK": "Sinhala",
    "sk-SK": "Slovak",
    "sm-WS": "Samoan",
    "sn-ZW": "Shona",
    "so-SO": "Somali",
    "sq-AL": "Albanian",
    "sr-RS": "Serbian",
    "sv-SE": "Swedish",
    "sw-SZ": "Swahili",
    "ta-LK": "Tamil",
    "te-IN": "Telugu",
    "tet-TL": "Tetum",
    "tg-TJ": "Tajik",
    "th-TH": "Thai",
    "ti-TI": "Tigrinya",
    "tk-TM": "Turkmen",
    "tl-PH": "Tagalog",
    "tn-BW": "Tswana",
    "to-TO": "Tongan",
    "tr-TR": "Turkish",
    "uk-UA": "Ukrainian",
    "uz-UZ": "Uzbek",
    "vi-VN": "Vietnamese",
    "wo-SN": "Wolof",
    "xh-ZA": "Xhosa",
    "yi-YD": "Yiddish",
    "zu-ZA": "Zulu",
  };

  const [firstLanguage, setFirstLanguage] = useState("en-GB");
  const [secondLanguage, setSecondLanguage] = useState("hi-IN");
  useEffect(() => {
    const storedFrom = localStorage.getItem("translateFrom");
    const storedTo = localStorage.getItem("translateTo");

    if (storedFrom) setFirstLanguage(storedFrom);
    if (storedTo) setSecondLanguage(storedTo);
  }, []);

  const handleFirstLanguageChange = (event) => {
    setFirstLanguage(event.target.value);
    localStorage.setItem("translateFrom", event.target.value);
  };

  const handleSecondLanguageChange = (event) => {
    setSecondLanguage(event.target.value);
    localStorage.setItem("translateTo", event.target.value);
  };

  const onclick = async () => {
    try {
      let [tab] = await chrome.tabs.query({ active: true });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (firstLang, secondLang) => {
          document
            .querySelectorAll("span._ao3e.selectable-text.copyable-text")
            .forEach((message) => {
              if (!message.parentElement.querySelector(".translated-text")) {
                const translatedTextContainer = document.createElement("div");
                translatedTextContainer.className = "translated-text";
                translatedTextContainer.style.margin = "5px";
                translatedTextContainer.style.fontStyle = "italic";
                translatedTextContainer.style.color = "gray";

                message.parentElement.appendChild(translatedTextContainer);
                const originalText = message.innerText;

                fetch(
                  `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
                    originalText
                  )}&langpair=${firstLang}|${secondLang}`
                )
                  .then((response) => {
                    if (!response.ok)
                      throw new Error("Network response was not ok");
                    return response.json();
                  })
                  .then((dataJson) => {
                    const translatedText = dataJson.responseData.translatedText;
                    translatedTextContainer.innerText = `Translated: ${translatedText}`;
                  })
                  .catch((error) => {
                    console.error("Error translating:", error);
                    translatedTextContainer.innerText =
                      "Failed to translate the message.";
                  });
              }
            });
        },
        args: [firstLanguage, secondLanguage],
      });
    } catch (error) {
      console.error("Error executing script: ", error);
    }
  };

  return (
    <div>
      <h3>WhatsApp Translator</h3>

      <div>
        <select value={firstLanguage} onChange={handleFirstLanguageChange}>
          {Object.entries(languages).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>

        <span style={{ margin: "5px", font: "bold" }}>To</span>

        <select value={secondLanguage} onChange={handleSecondLanguageChange}>
          {Object.entries(languages).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => onclick()}
        style={{
          backgroundColor: "lightgreen",
          color: "green",
          margin: "5px",
          padding: "4px 20px",
          boxShadow: "1px solid black",
          borderRadius: "5px",
        }}
      >
        Ok
      </button>
    </div>
  );
}
export default App;
