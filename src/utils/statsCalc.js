//main function to call when merging data. Uses two arrays, existing data and entered data,
//and creates new array that includes new calculated stats.
function mergeStats(exisitingData, enteredData){
    //creating new array with map method, which adds or updates data with element.(item)
 const updatedData = enteredData.map(element => {
     const hits = getHits(Number(element["1b"]), Number(element["2b"]), Number(element["3b"]), Number(element.hr));
     element.h = hits.toString();
     const atBats = getAtBats(hits, Number(element.o));
     element.ab = atBats.toString();
     const totalBases = getTotalBases(Number(element["1b"]), Number(element["2b"]), Number(element["3b"]), Number(element.hr));
     element.tb = totalBases.toString();
     const runsCreated = getRunsCreated(hits, Number(element.bb), Number(element.cs), totalBases, Number(element.sb), atBats);
     element.rc = runsCreated.toString();
     const average = getAverage(hits, atBats);
     element.avg = average.toString();
     const onBasePercentage = getonBasePercentage(hits, Number(element.bb), atBats, Number(element.sac));
     element.obp = onBasePercentage.toString();
     const slugging = getSlugging(totalBases, atBats);
     element.slg = slugging.toString();
     const onBasePlusSlugging = getOPS(onBasePercentage, slugging);
     element.ops = onBasePlusSlugging.toString();
     const weightedOnBaseAverage = getWOBA(Number(element.bb), Number(element["1b"]), Number(element["2b"]), Number(element["3b"]), Number(element.hr), atBats, Number(element.sac));
     element.woba = weightedOnBaseAverage.toString();
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
   return (singles + doubles + triples + homeRuns);
}


function getAtBats(hits, outs){
    return (hits + outs);
}

function getTotalBases(singles, doubles, triples, homeRuns){
    return (singles + (doubles * 2) + (triples * 3) + (homeRuns * 4));
}

function getRunsCreated(hits, walks, caughtStealing, totalBases, stolenBases, atBats){
    return (((hits + walks - caughtStealing) * (totalBases + (stolenBases * .55)) / (atBats + walks)));
}

function getAverage(hits, atBats){
    return (hits / atBats);
}

function getonBasePercentage(hits, walks, atBats, sacrifices){
    return ((hits + walks) / (atBats + walks + sacrifices));
}

function getSlugging(totalBases, atBats){
    return (totalBases / atBats);
}

function getOPS(onBase, slugging){
    return (onBase + slugging);
}

function getWOBA(walks, singles, doubles, triples, homeRuns, atBats, sacrifices){
    return ((.69 * walks + .888 * singles + 1.271 * doubles + 1.616 * triples + 2.101 * homeRuns) / (atBats + walks + sacrifices));
}


/*test object to pass to mergeStats function

const test = [{
 player: 'Mike',
 gameId: '',
 o: '180',
 "1b": '170',
 "2b": '80',
 "3b": '20',
 hr: '8',
 rbi: '',
 r: '',
 bb: '20',
 k: '0',
 sb: '10',
 cs: '2',
 sac: '5',
}];
console.log('test', mergeStats([], test));*/
