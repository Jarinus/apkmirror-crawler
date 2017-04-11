import {http} from "follow-redirects";

export default class Crawler {
    static crawl(url, handler) {
        console.log(`[Crawler]Crawling: ${url}`);

        http.get(url, response => {
            let body = '';

            response.on("data", function (chunk) {
                body += chunk;
            });

            response.on('end', () => {
                handler(body);
            });
        });
    }
}