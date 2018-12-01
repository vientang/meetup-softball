//main function to call when merging data. Uses two arrays, existing data and entered data,
//and creates new array that includes new calculated stats.
function mergeStats(exisitingData, enteredData){
    //creating new array with map method, which adds or updates data with element.(item)
 const updatedData = enteredData.map(element => {
     const hits = getHits(element["1b"], element["2b"], element["3b"], element.hr);
     element.hits = hits;
     const atBats = getAtBats(hits, element["o"])
     element.ab = atBats;
     return element;

 });
 return updatedData;
}
//Derive hits from user entered data to use in other functions
function getHits(singles, doubles, triples, homeRuns){
    if (
        typeof singles !== 'number'||
        typeof doubles !== 'number'||
        typeof triples !== 'number'||
        typeof homeRuns !== 'number') {
            return Error('Inputs for getHits need to be integers');
        }
   return singles + doubles + triples + homeRuns;
  }
  

function getAtBats(hits, outs){
    if (typeof hits !== 'number'|| typeof outs !== 'number') {
        return Error('Inputs for getAtBats need to be integers');
    }
    return hits + outs;
}

function getTotalBases(singles, doubles, triples, homeRuns){
    if (
        typeof singles !== 'number'||
        typeof doubles !== 'number'||
        typeof triples !== 'number'||
        typeof homeRuns !== 'number') {
            return Error('Inputs for getTotalBases need to be integers');
        }
   return singles + (doubles * 2) + (triples * 3) + (homeRuns * 4);
  }

function getRunsCreated(hits, walks, caughtStealing, totalBases, stolenBases, atBats){
    return ((hits + walks - caughtStealing) * (totalBases + (stolenBases * .55)) / (atBats + walks));
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
console.log('test', mergeStats([], test)[0].hits);
