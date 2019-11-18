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

    generateHTMLForContent(): string
    {
        let result = "<p>";

        // Begin.
        let tempText = this.text;

        // Process embedded pic residue text
        tempText = tempText.replace(/...&&&&.../g, "{Embedded pic}");
        // Convert \_ back into _
        tempText = tempText.replace(/\\_/g, "_");
        // Convert double-returns to paragraph breaks.
        tempText = tempText.replace(/\n\n/g, "</p><p>");

        // Conversion complete.
        result += tempText;

        // Complete.
        result += "</p>";
        return result;
    }

    generateExemplaryRow(): string
    {
        return "Sample Entry @ Month/Day/Year, Time-In-Day, local time<p>Post content</p>Reddit Live link<hr>";
    }

    generateTableRow(): string
    {
        let resultString = "<tr><td>";
        resultString = "";
        const redditLiveEndpoint = "https://www.reddit.com/live/133sixros7tu5/updates/";

        // Processing
        
        // Date first:
        resultString += "Entry @ " + new Date(this.timestamp * 1000).toLocaleString("en-US", {timeZone: "Asia/Hong_Kong"});
        resultString += ", Hong Kong time<br>";

        //console.log(this.generateHTMLForContent())

        // Content first
        resultString += this.generateHTMLForContent();
        resultString += "Reddit Live link: ";
        let redditLink = redditLiveEndpoint + this.redditID;
        resultString += "<a href='" + redditLink + "' target='_blank'>" + this.redditID + "</a>"; 
        
        //resultString += "</p>";

        // Output
        //resultString += "</td></tr>";

        // Separator
        resultString += "<hr>";

        //console.log(resultString);
        return resultString;
    }
}

function getProperTableHeading(): string
{
    let heading = "<tr><th>Relevant posts</th></tr>";
    return heading;
}