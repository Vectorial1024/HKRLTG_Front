function initializeCurrentTimeInput() {
    var nowVanilla = new Date();
    document.getElementsByName('toStampDate')[0].valueAsDate = nowVanilla;
    var hours = nowVanilla.getUTCHours();
    var minutes = nowVanilla.getUTCMinutes();
    hours = (hours + 8) % 24;
    var properTime = hours + ":" + minutes;
    document.getElementsByName('toStampTime')[0].value = properTime;
    console.log(properTime);
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
function conductSearch(printingLocation) {
    printingLocation.innerHTML = "Contacting server...";
    var trueFromStamp = getFromTimestamp();
    var trueToStamp = getToTimeStamp();
    if (trueToStamp < trueFromStamp) {
        // Swap whenever it goes negative
        var temp = trueFromStamp;
        trueToStamp = trueFromStamp;
        trueFromStamp = temp;
        // Also update the input stuff.
    }
    // Generate HTTP endpoint URL
    var apiEndpoint = "https://redditlive.norrisng.ca/api/get_posts?";
    var callingURL = apiEndpoint + "from=" + trueFromStamp + "&to=" + trueToStamp;
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
    // Row header preparation
    //resultTable += getProperTableHeading();
    if (resultantEntries.length == 0) {
        printingLocation.innerHTML = "(Empty)";
        return;
    }
    printingLocation.innerHTML = "Obtained " + resultantEntries.length + " entries.<br>";
    resultTable += resultantEntries[0].generateExemplaryRow();
    for (var i = 0; i < resultantEntries.length; i++) {
        var currentEntry = resultantEntries[i];
        resultTable += currentEntry.generateTableRow();
    }
    resultTable += "</table>";
    printingLocation.innerHTML += resultTable;
}
