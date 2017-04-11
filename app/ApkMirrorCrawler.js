import Crawler from "./Crawler";
import * as XPath from "xpath";
import * as fs from "fs";

export default class ApkMirrorCrawler {
    constructor(outputFilePath) {
        this.outputFilePath = outputFilePath;
    }

    crawlPage(pageId) {
        Crawler.crawl(`http://www.apkmirror.com/page/${pageId}/`, body => {
            XPath.select("//div[contains(@id, 'primary')]//div[contains(@class, 'listWidget')]", body, node => {
                this.handleWidget(node.toString(), app => {
                    fs.appendFile(this.outputFilePath, this.toCsv(app), this.appendFileErrorHandler);
                });
            });
        });
    };

    appendFileErrorHandler(error) {
        if (error === null) {
            return;
        }

        console.error(error);
    };

    toCsv(object) {
        let csv = "";

        for (let i in object) {
            if (object.hasOwnProperty(i)) {
                if (csv.length !== 0) {
                    csv += ",";
                }

                csv += `"${object[i]}"`;
            }
        }

        return csv + "\n";
    };

    handleWidget(listWidget, callback) {
        let date = "";

        XPath.select("//h5[contains(@class, 'widgetHeader')]", listWidget, node => {
            date = node.firstChild.data;
        });

        XPath.select("//div[contains(@class, 'appRow')]//a[contains(@class, 'fontBlack')]", listWidget, node => {
            const href = node.getAttribute('href');

            this.handlePage(href, (data) => {
                callback({
                    name: node.firstChild.data,
                    date: date,
                    minApi: data['minApi'],
                    targetApi: data['targetApi']
                });
            });
        });
    };

    handlePage(page, callback) {
        Crawler.crawl(`http://www.apkmirror.com${page}`, body => {
            const data = {};

            XPath.select("//div[contains(@title, 'Android version')]/following-sibling::div/div", body, node => {
                if (node === null || node.firstChild === null || node.firstChild.data === null) {
                    return;
                }

                const text = node.firstChild.data;

                if (text.startsWith("Min")) {
                    const regex = /API ([^)]*)/.exec(text);

                    if (regex !== null && regex.length === 2) {
                        data['minApi'] = regex[1];
                    }
                } else if (text.startsWith("Target")) {
                    const regex = /API ([^)]*)/.exec(text);

                    if (regex !== null && regex.length === 2) {
                        data['targetApi'] = regex[1];
                    }
                } else {
                    console.error(`Invalid div at handlePage: ${text}`);
                }
            });

            if (data['minApi'] === undefined || data['targetApi'] === undefined) {
                return;
            }

            callback(data);
        });
    };
}