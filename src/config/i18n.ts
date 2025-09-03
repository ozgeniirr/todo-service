import i18n from "i18n";
import path from "path";



i18n.configure({
    locales: ["en", "tr"],
    directory: path.join(__dirname, "../../locales"),
    defaultLocale:"tr",
    queryParameter:"lang",
    cookie:"lang",
    objectNotation:true
});

export default i18n;