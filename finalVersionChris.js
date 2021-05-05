// Extract subject data into array
function getTableEntriesById(container, selectorTag, prefix) {
    var items = [];
    var entries = document.getElementById(container).getElementsByTagName(selectorTag);
    for(var i=0; i < entries.length; i++){
        if(entries[i].id.lastIndexOf(prefix, 0) === 0){
            items.push(entries[i].innerText);
        }
    }
    return items;
}

var reported = getTableEntriesById("datadiv", "table", "report");

// Clean subject data - i.e. remove unwanted data (teacher, date and class info) as well as whitespace and colons; ensure each package of data is delineated by commas
function cleanArrayData(arr) {
    var items = [];

    for(var i=0; i < arr.length; i++){
        var string = arr[i];
        var newLine = /\n/;
        var results = string.split(newLine);
        results = results.map(str => str.trim());
        results = results.filter(item => item);
        removedResults = results.splice(1, 2);
        var output = results.toString();
        var removeClass = /\s\(Class\d\-\/\d\)|\s\(\d[A-z]*\-\/\d\)/;
        output = output.replace(removeClass, "");
        var colon = /[:]/;
        var results2 = output.split(colon);
        results2 = results2.map(str => str.trim());
        var output2 = results2.toString();
        items.push(output2);
    }
    return items;
}

var reported2 = cleanArrayData(reported);

//loop through array and concatenate all individual student subject data into one string
function collateData(arr) {
    var items = [];
    var prevSubStart = "A";
    var tempString = "";

    for(var i=0; i < arr.length; i++){
        var subStart = arr[i].charAt(0);
        var firstFour = arr[i].substr(0, 4);

        if(subStart >= prevSubStart){
            var newString = ("," + arr[i]);
            tempString = tempString.concat(newString);  
            var prevSubStart = subStart;  
        } else if (firstFour === "Form") { 
            var finishedString = tempString.replace(",", ""); 
            items.push(finishedString); 
            var tempString = "";  
            var prevSubStart = "A";  
        } else { //first letter is smaller than previous one, but first word is not "Form", so this is the first string in a new set
            var finishedString = tempString.replace(",", ""); 
            items.push(finishedString); 
            var newString = ("," + arr[i]); 
            var tempString = newString; 
            var prevSubStart = subStart; 
        }
    }
    items.push(finishedString); 
    return items;
}

var reported3 = collateData(reported2);

// extract tables on page which do not have an id selector and filter out unwanted entries
function getNonIdTableData(container, selectorTag) {
    // get all data from tables that do not have an id tag and push into 'items' array
    var items = [];
    var entries = document.getElementById(container).getElementsByTagName(selectorTag);
    
    for(var i=0; i < entries.length; i++){
        if(entries[i].id === ""){
            items.push(entries[i].innerText);
        }
    }

    // filter out any entry that does not contain the word 'Tutor' and assign to the 'filteredItems' array
    var filteredItems = items.filter(item => {
        return item.includes("Tutor");
    });

    // test the first character of each entry.  If it is a capital letter, then push into the 'sNames' array
    var uCaseChar = /[A-Z]/;
    var sNames = [];

    for(var i=0; i < filteredItems.length; i++){
        var firstChar = filteredItems[i].charAt(0);

        if(uCaseChar.test(firstChar)){
            sNames.push(filteredItems[i]);
        }
    }

    // clean data so that only last and first names are in the string and push into 'studentNames' array
    var studentNames = [];

    for(var i=0; i < sNames.length; i++){
        var string = sNames[i];
        var arr = string.split(/\s/);
        arr = arr.map(str => str.trim());
        var newString = arr[0] + arr[1];
        studentNames.push(newString);
    }

    return studentNames;
}

var noIdData = getNonIdTableData("datadiv", "table");

//loop through both arrays and create new array with each entry containing (noIdData + reported3)
function matchArrays(arr1, arr2){
    if (arr1.length === arr2.length){ // Check that the two arrays contain the same number of entries, else throw an error message
        var items = [];

        for (i=0; i < arr1.length; i++){
            var tempString = arr1[i] + "," + arr2[i];
            items.push(tempString);
        }
    } else {
        alert("Your two arrays are not the same length!");
    }
    return items;
}

var studentData = matchArrays(noIdData, reported3);
console.log(studentData);


