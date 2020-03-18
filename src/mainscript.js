function initialize() {
    initializeCurrentTimeInput();
}
function initializeCurrentTimeInput() {
    var nowVanilla = new Date();
    document.getElementsByName('toStampDate')[0].valueAsDate = nowVanilla;
    var hours = nowVanilla.getUTCHours();
    var minutes = nowVanilla.getUTCMinutes();
    hours = (hours + 8) % 24;
    // We need to fill in the 0 to make it double-digit
    var properTime = ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2);
    document.getElementsByName('toStampTime')[0].value = properTime;
    console.log(properTime);
    // Also fill in for "on this day" input
    document.getElementsByName('onStampDate')[0].valueAsDate = nowVanilla;
}
function getFromTimestamp() {
    var rawDate = document.getElementsByName("fromStampDate")[0].value;
    var rawTime = document.getElementsByName("fromStampTime")[0].value;
    // Have to divide by 1000 to convert the value from milliseconds to seconds
    return new Date(rawDate + "T" + rawTime).valueOf() / 1000;
}
function getToTimeStamp() {
    var rawDate = document.getElementsByName("toStampDate")[0].value;
    var rawTime = document.getElementsByName("toStampTime")[0].value;
    // Have to divide by 1000 to convert the value from milliseconds to seconds
    return new Date(rawDate + "T" + rawTime).valueOf() / 1000;
}
function startStandardSearch(printingLocation) {
    var trueFromStamp = getFromTimestamp();
    var trueToStamp = getToTimeStamp();
    if (trueToStamp < trueFromStamp) {
        // Swap whenever it goes negative
        var temp = trueFromStamp;
        trueToStamp = trueFromStamp;
        trueFromStamp = temp;
        // Also update the input stuff.
    }
    conductSearch(printingLocation, new Date(trueFromStamp * 1000), new Date(trueToStamp * 1000));
}
function startPastHourSearch(printingLocation, hoursRange) {
    var now = new Date();
    // 1 hour = 3600 seconds
    var timeChange = 3600000 * hoursRange;
    conductSearch(printingLocation, new Date(now.valueOf() - timeChange), now);
}
function startTodaySearch(printingLocation) {
    var now = new Date();
    var todayString = now.toISOString().slice(0, 10);
    var todayBeginning = new Date(todayString);
    conductSearch(printingLocation, todayBeginning, now);
}
function startSpecificDaySearch(printingLocation) {
    /*
    let rawDate = (document.getElementsByName("fromStampDate")[0] as HTMLInputElement).value;
    let rawTime = (document.getElementsByName("fromStampTime")[0] as HTMLInputElement).value;
    // Have to divide by 1000 to convert the value from milliseconds to seconds
    return new Date(rawDate + "T" + rawTime).valueOf() / 1000;
    */
    var specifiedDay_Raw = (document.getElementsByName("onStampDate")[0]).value;
    //console.log(specifiedDay_Raw);
    //console.log(new Date(specifiedDay_Raw).valueOf() / 1000);
    var specifiedDayBegin_Stamp = new Date(specifiedDay_Raw).valueOf();
    //return new Date(specifiedDay_Raw).valueOf() / 1000;
    var millisecondsInOneDay = 86400 * 1000;
    console.log(specifiedDayBegin_Stamp);
    console.log(specifiedDayBegin_Stamp + millisecondsInOneDay);
    conductSearch(printingLocation, new Date(specifiedDayBegin_Stamp), new Date(specifiedDayBegin_Stamp + millisecondsInOneDay));
}
function conductSearch(printingLocation, fromStamp, toStamp) {
    var fromStamp_String = fromStamp.toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" });
    var toStamp_String = toStamp.toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" });
    document.getElementById("searchParams").innerHTML = "Searching posts from " + fromStamp_String + " to " + toStamp_String + ", Hong Kong time.";
    printingLocation.innerHTML = "Contacting server...";
    console.log(fromStamp.valueOf());
    console.log(toStamp.valueOf());
    // Generate HTTP endpoint URL
    var apiEndpoint = "https://redditlive.norrisng.ca/api/get_posts?";
    var callingURL = apiEndpoint + "from=" + Math.floor(fromStamp.valueOf() / 1000) + "&to=" + Math.floor(toStamp.valueOf() / 1000);
    makeHttpRequest(callingURL)
        .then(function (response) {
        // Successfully obtained Reddit-TG entries.
        parseAndPrintJSON(response, printingLocation);
    })["catch"](function (error) {
        // Could not obtain!
        printingLocation.innerHTML = "Could not obtain Reddit-Telegram entries from server:<br>" + error;
    });
}
function parseAndPrintJSON(rawJSON, printingLocation) {
    var rawEntries = JSON.parse(rawJSON);
    var resultantEntries = new Array();
    for (var i = 0; i < rawEntries.length; i++) {
        resultantEntries.push(new TelegramEntry(rawEntries[i]));
    }
    //alert(resultantEntries.length);
    printingLocation.innerHTML = "";
    // Print the results to the element specified by the parameter
    var resultTable = "<table>";
    resultTable = "";
    // Row header preparation
    //resultTable += getProperTableHeading();
    if (resultantEntries.length == 0) {
        printingLocation.innerHTML = "(Empty)";
        return;
    }
    printingLocation.innerHTML = "Obtained " + resultantEntries.length + " entries.<hr>";
    resultTable += resultantEntries[0].generateExemplaryRow();
    for (var i = 0; i < resultantEntries.length; i++) {
        var currentEntry = resultantEntries[i];
        resultTable += currentEntry.generateTableRow();
    }
    //resultTable += "</table>";
    printingLocation.innerHTML += resultTable;
}
