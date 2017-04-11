import * as fs from "fs";
import ApkMirrorCrawler from "./ApkMirrorCrawler";
import config from "./config";

const crawler = new ApkMirrorCrawler(config.outputFilePath);

fs.writeFile(config.outputFilePath, "", crawler.appendFileErrorHandler);

for (let i = config.pageFromNumber; i >= config.pageToNumber; i--) {
    crawler.crawlPage(i);
}
