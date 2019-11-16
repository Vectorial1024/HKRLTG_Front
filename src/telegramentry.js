var TelegramEntry = /** @class */ (function () {
    function TelegramEntry(rawEntry) {
        this.timestamp = +rawEntry.timestamp;
        this.redditID = rawEntry.reddit_id;
        this.author = rawEntry.author;
        this.text = rawEntry.text;
    }
    TelegramEntry.prototype.generateExemplaryRow = function () {
        return "<tr><td>Sample Entry @ Month/Day/Year, Time-In-Day, local time<br>Post content<br>Reddit Live link</td></tr>";
    };
    TelegramEntry.prototype.generateTableRow = function () {
        var resultString = "<tr><td>";
        var redditLiveEndpoint = "https://www.reddit.com/live/133sixros7tu5/updates/";
        // Processing
        // Date first:
        resultString += "Entry @ " + new Date(this.timestamp * 1000).toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" });
        resultString += ", local time<br>";
        // Content first
        resultString += this.text;
        resultString += "<br>Reddit Live link: ";
        var redditLink = redditLiveEndpoint + this.redditID;
        resultString += "<a href='" + redditLink + "' target='_blank'>" + this.redditID + "</a>";
        //resultString += "</p>";
        // Output
        resultString += "</td></tr>";
        //console.log(resultString);
        return resultString;
    };
    return TelegramEntry;
}());
function getProperTableHeading() {
    var heading = "<tr><th>Relevant posts</th></tr>";
    return heading;
}
