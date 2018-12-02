//main function to call when merging data. Uses two arrays, existing data and entered data,
//and creates new array that includes new calculated stats.
function mergeStats(exisitingData, enteredData){
    //creating new array with map method, which adds or updates data with element.(item)
 const updatedData = enteredData.map(element => {
     const hits = getHits(Number(element["1b"]), Number(element["2b"]), Number(element["3b"]), Number(element.hr));
     element.h = hits;
     const atBats = getAtBats(hits, Number(element["o"]));
     element.ab = atBats;
     const totalBases = getTotalBases(Number(element["1b"]), Number(element["2b"]), Number(element["3b"]), Number(element.hr));
     element.tb = totalBases;
     const runsCreated = getRunsCreated(hits, Number(element["bb"]), Number(element["cs"]), totalBases, Number(element["sb"]), atBats);
     element.rc = runsCreated;
     return element;

 });
 return updatedData;
}
//data type validation. Only number inputs are valid
/*function isNumber(arr){
    for (var i = 0; i < arr.length; i++) {
        if (typeof (arr[i])!== 'number') {
            return false; 
        }
    }
   return true;
}*/
//Derive hits from user entered data to use in other functions
function getHits(singles, doubles, triples, homeRuns){
   return (singles + doubles + triples + homeRuns).toString();
}
  

function getAtBats(hits, outs){
    return (hits + outs).toString();
}

function getTotalBases(singles, doubles, triples, homeRuns){
    return (singles + (doubles * 2) + (triples * 3) + (homeRuns * 4)).toString();
}

function getRunsCreated(hits, walks, caughtStealing, totalBases, stolenBases, atBats){
    return (((hits + walks - caughtStealing) * (totalBases + (stolenBases * .55)) / (atBats + walks))).toString();
}


const test = [{
 player: 'Mike',
 gameId: '',
 o: '',
 "1b": '',
 "2b": '',
 "3b": '',
 hr: '',
 rbi: '',
 r: '',
 bb: '',
 k: '',
 sb: '',
 cs: '',
 ab: '',
}];
console.log('test', mergeStats([], test)[0].h);
