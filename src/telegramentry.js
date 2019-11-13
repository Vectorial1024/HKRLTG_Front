var TelegramEntry = /** @class */ (function () {
    function TelegramEntry(rawEntry) {
        this.timestamp = rawEntry.timestamp;
        this.redditID = rawEntry.reddit_id;
        this.author = rawEntry.author;
        this.text = rawEntry.text;
    }
    TelegramEntry.prototype.generateTableRow = function () {
        var resultString = "<tr><td>";
        // Processing
        //resultString += "<p>";
        // ID info
        resultString += this.redditID;
        resultString += "<br>";
        resultString += this.text;
        //resultString += "</p>";
        // Output
        resultString += "</td></tr>";
        console.log(resultString);
        return resultString;
    };
    return TelegramEntry;
}());
function getProperTableHeading() {
    var heading = "<tr><th>Relevant posts</th></tr>";
    return heading;
}
