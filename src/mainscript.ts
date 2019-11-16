function initializeCurrentTimeInput()
{
    let nowVanilla = new Date();
    (document.getElementsByName('toStampDate')[0] as HTMLInputElement).valueAsDate = nowVanilla;
    let hours = nowVanilla.getUTCHours();
    let minutes = nowVanilla.getUTCMinutes();
    hours = (hours + 8) % 24;
    let properTime = hours + ":" + minutes;
    (document.getElementsByName('toStampTime')[0] as HTMLInputElement).value = properTime;
    console.log(properTime)
}

function getFromTimestamp(): number
{
    let rawDate = (document.getElementsByName("fromStampDate")[0] as HTMLInputElement).value;
    let rawTime = (document.getElementsByName("fromStampTime")[0] as HTMLInputElement).value;
    // Have to divide by 1000 to convert the value from milliseconds to seconds
    return new Date(rawDate + "T" + rawTime).valueOf() / 1000;
}

function getToTimeStamp(): number
{
    let rawDate = (document.getElementsByName("toStampDate")[0] as HTMLInputElement).value;
    let rawTime = (document.getElementsByName("toStampTime")[0] as HTMLInputElement).value;
    // Have to divide by 1000 to convert the value from milliseconds to seconds
    return new Date(rawDate + "T" + rawTime).valueOf() / 1000;
}

function conductSearch(printingLocation: HTMLDivElement)
{
    printingLocation.innerHTML = "Contacting server...";

    let trueFromStamp = getFromTimestamp();
    let trueToStamp = getToTimeStamp();

    if (trueToStamp < trueFromStamp)
    {
        // Swap whenever it goes negative
        let temp = trueFromStamp;
        trueToStamp = trueFromStamp;
        trueFromStamp = temp;

        // Also update the input stuff.
    }

    // Generate HTTP endpoint URL
    let apiEndpoint = "https://redditlive.norrisng.ca/api/get_posts?";
    let callingURL = apiEndpoint + "from=" + trueFromStamp + "&to=" + trueToStamp;

    makeHttpRequest(callingURL)
    .then(response =>
    {
        // Successfully obtained Reddit-TG entries.
        parseAndPrintJSON(response, printingLocation);
    })
    .catch(error =>
    {
        // Could not obtain!
        printingLocation.innerHTML = "Could not obtain Reddit-Telegram entries from server:<br>" + error;
    });
}

function parseAndPrintJSON(rawJSON: string, printingLocation: HTMLDivElement)
{
    let rawEntries: Array<TelegramEntryRaw> = JSON.parse(rawJSON);
    let resultantEntries = new Array<TelegramEntry>();
    for (let i = 0; i < rawEntries.length; i++)
    {
        resultantEntries.push(new TelegramEntry(rawEntries[i]));
    }
    //alert(resultantEntries.length);

    printingLocation.innerHTML = "";

    // Print the results to the element specified by the parameter
    let resultTable = "<table>";
    // Row header preparation
    //resultTable += getProperTableHeading();
    if (resultantEntries.length == 0)
    {
        printingLocation.innerHTML = "(Empty)";
        return;
    }
    printingLocation.innerHTML = "Obtained " + resultantEntries.length + " entries.<br>";
    resultTable += resultantEntries[0].generateExemplaryRow();

    for (let i = 0; i < resultantEntries.length; i++)
    {
        let currentEntry: TelegramEntry = resultantEntries[i];
        resultTable += currentEntry.generateTableRow();
    }
    resultTable += "</table>";
    printingLocation.innerHTML += resultTable;
}