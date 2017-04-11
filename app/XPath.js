import * as xpath from "xpath";
import {DOMParser} from "xmldom";

export default class XPath {
    static toDocument(xmlString) {
        return new DOMParser({
            errorHandler: {}
        }).parseFromString(xmlString);
    }

    static select(xPath, xmlString, handler) {
        const document = XPath.toDocument(xmlString);

        xpath.select(xPath, document)
            .forEach(value => handler(value));
    }
}