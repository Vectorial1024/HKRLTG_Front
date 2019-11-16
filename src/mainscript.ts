function initialize()
{
    initializeCurrentTimeInput();
}

function initializeCurrentTimeInput()
{
    let nowVanilla = new Date();
    (document.getElementsByName('toStampDate')[0] as HTMLInputElement).valueAsDate = nowVanilla;
    let hours = nowVanilla.getUTCHours();
    let minutes = nowVanilla.getUTCMinutes();
    hours = (hours + 8) % 24;
    // We need to fill in the 0 to make it double-digit
    let properTime = ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2);
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

function startStandardSearch(printingLocation: HTMLDivElement)
{
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

    conductSearch(printingLocation, new Date(trueFromStamp * 1000), new Date(trueToStamp * 1000));
}

function startPastHourSearch(printingLocation: HTMLDivElement, hoursRange: number)
{
    let now = new Date();
    // 1 hour = 3600 seconds
    let timeChange = 3600000 * hoursRange;
    conductSearch(printingLocation, new Date(now.valueOf() - timeChange), now);
}

function startTodaySearch(printingLocation: HTMLDivElement)
{
    let now = new Date();
    let todayString = now.toISOString().slice(0, 10);
    let todayBeginning = new Date(todayString);
    conductSearch(printingLocation, todayBeginning, now);
}

function conductSearch(printingLocation: HTMLDivElement, fromStamp: Date, toStamp: Date)
{
    let fromStamp_String = fromStamp.toLocaleString("en-US", {timeZone: "Asia/Hong_Kong"});
    let toStamp_String = toStamp.toLocaleString("en-US", {timeZone: "Asia/Hong_Kong"});
    document.getElementById("searchParams").innerHTML = "Searching posts from " + fromStamp_String + " to " + toStamp_String + ", Hong Kong time.";
    printingLocation.innerHTML = "Contacting server...";

    console.log(fromStamp.valueOf())
    console.log(toStamp.valueOf())

    // Generate HTTP endpoint URL
    let apiEndpoint = "https://redditlive.norrisng.ca/api/get_posts?";
    let callingURL = apiEndpoint + "from=" + Math.floor(fromStamp.valueOf() / 1000) + "&to=" + Math.floor(toStamp.valueOf() / 1000);

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
    resultTable = "";
    // Row header preparation
    //resultTable += getProperTableHeading();
    if (resultantEntries.length == 0)
    {
        printingLocation.innerHTML = "(Empty)";
        return;
    }
    printingLocation.innerHTML = "Obtained " + resultantEntries.length + " entries.<hr>";
    resultTable += resultantEntries[0].generateExemplaryRow();

    for (let i = 0; i < resultantEntries.length; i++)
    {
        let currentEntry: TelegramEntry = resultantEntries[i];
        resultTable += currentEntry.generateTableRow();
    }
    //resultTable += "</table>";
    printingLocation.innerHTML += resultTable;
}