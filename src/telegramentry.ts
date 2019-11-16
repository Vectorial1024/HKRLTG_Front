class TelegramEntry
{
    timestamp: number;
    redditID: string;
    author: string;
    text: string;

    constructor(rawEntry: TelegramEntryRaw)
    {
        this.timestamp = +rawEntry.timestamp;
        this.redditID = rawEntry.reddit_id;
        this.author = rawEntry.author;
        this.text = rawEntry.text;
    }

    generateExemplaryRow(): string
    {
        return "<tr><td>Sample Entry @ Month/Day/Year, Time-In-Day, local time<br>Post content<br>Reddit Live link</td></tr>";
    }

    generateTableRow(): string
    {
        let resultString = "<tr><td>";
        const redditLiveEndpoint = "https://www.reddit.com/live/133sixros7tu5/updates/";

        // Processing
        
        // Date first:
        resultString += "Entry @ " + new Date(this.timestamp * 1000).toLocaleString("en-US", {timeZone: "Asia/Hong_Kong"});
        resultString += ", local time<br>";

        // Content first
        resultString += this.text;
        resultString += "<br>Reddit Live link: ";
        let redditLink = redditLiveEndpoint + this.redditID;
        resultString += "<a href='" + redditLink + "' target='_blank'>" + this.redditID + "</a>"; 
        
        //resultString += "</p>";

        // Output
        resultString += "</td></tr>";

        //console.log(resultString);
        return resultString;
    }
}

function getProperTableHeading(): string
{
    let heading = "<tr><th>Relevant posts</th></tr>";
    return heading;
}