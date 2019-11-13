class TelegramEntry
{
    timestamp: string;
    redditID: string;
    author: string;
    text: string;

    constructor(rawEntry: TelegramEntryRaw)
    {
        this.timestamp = rawEntry.timestamp;
        this.redditID = rawEntry.reddit_id;
        this.author = rawEntry.author;
        this.text = rawEntry.text;
    }

    generateTableRow(): string
    {
        let resultString = "<tr><td>";

        // Processing
        //resultString += "<p>";
        // ID info
        resultString += this.redditID;
        resultString += "<br>"
        resultString += this.text;
        //resultString += "</p>";

        // Output
        resultString += "</td></tr>";

        console.log(resultString);
        return resultString;
    }
}

function getProperTableHeading(): string
{
    let heading = "<tr><th>Relevant posts</th></tr>";
    return heading;
}