var TelegramEntry = /** @class */ (function () {
    function TelegramEntry(rawEntry) {
        this.timestamp = +rawEntry.timestamp;
        this.redditID = rawEntry.reddit_id;
        this.author = rawEntry.author;
        this.text = rawEntry.text;
    }
    TelegramEntry.prototype.generateHTMLForContent = function () {
        var result = "<p>";
        // Begin.
        var tempText = this.text;
        // Process embedded pic residue text
        tempText = tempText.replace(/...&&&&.../g, "{Embedded pic}");
        // Convert \_ back into _
        tempText = tempText.replace(/\\_/g, "_");
        // Convert https raw text into clickable links
        tempText = urlifyText(tempText);
        // Convert double-returns to paragraph breaks.
        tempText = tempText.replace(/\n\n/g, "</p><p>");
        // Conversion complete.
        result += tempText;
        // Complete.
        result += "</p>";
        return result;
    };
    TelegramEntry.prototype.generateExemplaryRow = function () {
        return "Sample Entry @ Month/Day/Year, Time-In-Day, local time<p>Post content</p>Reddit Live link<hr>";
    };
    TelegramEntry.prototype.generateTableRow = function () {
        var resultString = "<tr><td>";
        resultString = "";
        var redditLiveEndpoint = "https://www.reddit.com/live/133sixros7tu5/updates/";
        // Processing
        // Date first:
        resultString += "Entry @ " + new Date(this.timestamp * 1000).toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" });
        resultString += ", Hong Kong time<br>";
        //console.log(this.generateHTMLForContent())
        // Content first
        resultString += this.generateHTMLForContent();
        resultString += "Reddit Live link: ";
        var redditLink = redditLiveEndpoint + this.redditID;
        resultString += "<a href='" + redditLink + "' target='_blank'>" + this.redditID + "</a>";
        //resultString += "</p>";
        // Output
        //resultString += "</td></tr>";
        // Separator
        resultString += "<hr>";
        //console.log(resultString);
        return resultString;
    };
    return TelegramEntry;
}());
function getProperTableHeading() {
    var heading = "<tr><th>Relevant posts</th></tr>";
    return heading;
}
/**
 * Recognizes and converts https links to clickable HTML links.
 *
 * The links will have the open-in-new-tab attribute.
 */
function urlifyText(originalText) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return originalText.replace(urlRegex, function (url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
    });
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
}
