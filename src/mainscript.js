function conductSearch(printingLocation) {
    // Call Database API
    var asdf;
    // Break down the data
    // Sample JS object 
    var testentry = {
        timestamp: "Stamp",
        reddit_id: "Identification",
        author: "Author",
        text: "Text"
    };
    // Converting JS object to JSON string 
    var rawArray = [testentry, testentry];
    var gfg = JSON.stringify(rawArray);
    var rawEntries = JSON.parse(gfg);
    var resultantEntries = new Array();
    for (var i = 0; i < rawEntries.length; i++) {
        resultantEntries.push(new TelegramEntry(rawEntries[i]));
    }
    //alert(resultantEntries.length);
    // Print the results to the element specified by the parameter
    var resultTable = "<table>";
    // Row header preparation
    //resultTable += getProperTableHeading();
    for (var i = 0; i < resultantEntries.length; i++) {
        var currentEntry = resultantEntries[i];
        resultTable += currentEntry.generateTableRow();
    }
    resultTable += "</table>";
    console.log(resultTable);
    if (printingLocation != null) {
        printingLocation.innerHTML = resultTable;
    }
    else {
        alert("Misconfiguration: did not specify result display location.");
    }
}
