var stopwords = require('./stopwords-all.json');

var storedDates = [];
var mLineCount = 0;
var mLineDict = {};
var mRecent = '';

var verifyMessage = function(date, time, prev, txt) {
  // First, check to confirm date is a date
  const dateType = new Date(date)
  if (isNaN(dateType) === true) {
    return false;
  }

  // Second, check if the time is valid
  const timeType = new Date(`${date} ${time}`);

  if (isNaN(timeType) === true) {
    return false;
  }

  // Check to confirm this message is either the last messages date, or in the future
  if (prev[0] !== undefined) { // undefined will be true if there is no previous message, or if above isn't true message
    const prevDate = new Date(`${prev[0]} ${prev[1]}`);
    if (timeType.getTime() >= prevDate.getTime()) {
      /**
        StoredDates stores the last 3 passing dates,
        this is to check the current date with at least 3 other dates,
        if the current date is LESS THAN one of the dates, the loop will return false,
        this is because if it's less that means the message was made before any of the storedDates
      **/

      for (var checkT = 0; checkT < storedDates.length; checkT++) {
        if (timeType.getTime() < storedDates[checkT]) {
          return false;
        }
      }
      if (storedDates.length >= 3) {
        storedDates = [];
      }
      storedDates.push(timeType.getTime())
      return true;
    } else if (isNaN(new Date(prev[0])) == true) { // Makes sure the previous date is actually a valid date
      return true;
    } else {
      return false; // Change to false if .. ??? - Add here
    }
  } else {
    return true;
  }

}

var analyze = function(txt, type='whatsapp') { // Whatsapp is default as it is the only supported, future will have more supported types
  storedDates = []; // Resets global vars, as does the next few vars
  mLineCount = 0;
  mLineDict = {};
  mRecent = '';

  if (type === 'whatsapp') {
    var dates = [];
    var times = [];
    var names = [];
    var text = [];
    var placeMulti = {};
    var placeNew = {};

    var newTypes = {
      newText: [],
      newDates: [],
      newNames: [],
      newTimes: []
    }

    var heldText = [];
    // Put txt in an array and split by newline
    txt = txt.split('\n');
    for (var parseLine = 0; parseLine < txt.length; parseLine++) {
      // Get the dates, split by the first ',' \ i.e,(3/31/16|,|) \
      dates.push(txt[parseLine].split(',')[0])
      // Get the time, get indexOf first ',' and first '-'
      times.push(txt[parseLine].substring(txt[parseLine].indexOf(',') + 1, txt[parseLine].indexOf('-')));

      // Get the name (screen name) after the '-' and before ':' (second occurrence)
      names.push(txt[parseLine].substring(txt[parseLine].indexOf('-') + 2, txt[parseLine].indexOf(':', txt[parseLine].indexOf(':') + 1))); // +2 as there is always a space after the '-'

      // Get the text after the second occurrence of (':')
      text.push(txt[parseLine].substring(txt[parseLine].indexOf(':', txt[parseLine].indexOf(':') + 1) + 2));

      if (verifyMessage(dates[parseLine], times[parseLine], [dates[parseLine - 1], times[parseLine -1]], text[parseLine]) === false) {

        mLineCount += 1;
        mLineDict[parseLine] = txt[parseLine]
        heldText.push(txt[parseLine]);

        if (parseLine === mRecent + 1) {
          placeNew[parseLine - 1] = mLineDict[mRecent] + mLineDict[parseLine];
        }

        mRecent = parseLine;
      } else {
        if (heldText.length > 0) {
            //console.log(`Add ${heldText.join(' ')} to ${newTypes.newText[parseLine - (heldText.length + 1)]}`)
            var placeLevel = parseLine - (heldText.length + 1)
            placeMulti[heldText.join(' ')] = placeLevel
        }

        newTypes.newText.push(text[parseLine]);
        newTypes.newDates.push(dates[parseLine]);
        newTypes.newNames.push(names[parseLine]);
        newTypes.newTimes.push(times[parseLine]);

        heldText = [];
      }
    }

    txt = [];
    for (var combineAll = 0; combineAll < newTypes.newText.length; combineAll++) {
      txt.push(newTypes.newText[combineAll]);
    }

    for (var combineMulti = 0; combineMulti < Object.keys(placeNew).length; combineMulti++) {
      var multiKeys = Object.keys(placeNew)
      newTypes.newText[multiKeys[combineMulti] - mLineCount] = placeNew[multiKeys[combineMulti]]

    }

    return graphIt(newTypes);
  }
}

/* Type of data to grab;
  - Total messages (Both), - End
  - day streak
  - Media sent (Each) - x
  - Most active (day/month/year/hour),

  - Messages per day, - Done
  - Messages per month, - Done
  - Messages per year, - Done
  - Media sent (Both) - Done
  - Total messages (Each), - Done
  - Total words (Both), - Done
  - Total words (Each), - Done
  - Most used words - Done
  - Time since started - Done
*/

function graphIt(whatsapp_Obj) {
  // If the whatsapp_obj is empty, it's most likely because the format of the inputted file is incorrect
  var checkObj = 0;
  for (var checkIfObjEmpty of Object.values(whatsapp_Obj)) {
    if (checkIfObjEmpty.length > 0) {
      break
    } else {
      checkObj++;
    }
  }

  if (checkObj === Object.keys(whatsapp_Obj).length) {
    return 'no_support'
  }


  var data = {
    avgTotal: ''
  }
  var usersOf = new Set(whatsapp_Obj.newNames);
  usersOf = Array.from(usersOf);

  var usersMessages = {};
  var usersWords = {};
  var usersAverage = {};
  var mediaCount = 0;

  for (var users_ of usersOf) {
    usersMessages[users_] = []
    usersWords[users_] = {};
    usersAverage[users_] = {'Months': {}}
  }


  var getData = {
    getAvgSum() {
      // 1. Avg messages per day
      var avgPerDay = {};
      var avgPerWeek = {};
      var avgPerMonth = {};
      var avgPerYear = {};
      var avgSum = [];
      var dayCount = [];
      var currentWeek = '';
      var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const aSum = (x, y) => x + y;

      for (var x = 0; x < whatsapp_Obj.newDates.length; x++) {
        var nDate = new Date(whatsapp_Obj.newDates[x]);
        if (avgPerDay[whatsapp_Obj.newDates[x]] >= 0) {
          avgPerDay[whatsapp_Obj.newDates[x]] += 1;
        } else {
          avgPerDay[whatsapp_Obj.newDates[x]] = 1;
        }

          if (currentWeek === '' || nDate.getDay() == 0) {
            currentWeek = whatsapp_Obj.newDates[x]
          }

          dayCount.push(nDate.getDay())
          if (avgPerWeek[currentWeek] >= 0) {
            avgPerWeek[currentWeek] += 1;
          } else {
            avgPerWeek[currentWeek] = 1
          }

        // Get the average per month, this doesn't care about year, only month
        if (avgPerMonth[nDate.getMonth() + `_${nDate.getUTCFullYear()}`] >= 0) {
          avgPerMonth[nDate.getMonth() + `_${nDate.getUTCFullYear()}`] += 1;
        } else {
          avgPerMonth[nDate.getMonth() + `_${nDate.getUTCFullYear()}`] = 1;
        }

        if (avgPerYear[nDate.getUTCFullYear()] >= 0) {
          avgPerYear[nDate.getUTCFullYear()] += 1;
        } else {
          avgPerYear[nDate.getUTCFullYear()] = 1;
        }

        if (usersAverage[whatsapp_Obj.newNames[x]]['Months'][nDate.getMonth()] >= 0) {
          usersAverage[whatsapp_Obj.newNames[x]]['Months'][nDate.getMonth()] += 1;
        } else {
          usersAverage[whatsapp_Obj.newNames[x]]['Months'][nDate.getMonth()] = 1;
        }
      }

      // Grab avg from avgPerDay values
      for (var getValues in avgPerDay) {
        avgSum.push(avgPerDay[getValues])
      }
      data.avgTotal = Math.floor(avgSum.reduce(aSum) / avgSum.length); // Avg per day (???)

      // Return all the average types
      return {'average_month': [months, avgPerMonth], 'average_per': usersAverage, 'average_day': avgPerDay, 'average_year': avgPerYear, 'average_week': avgPerWeek}
    },

    getWords() {
      var wordDict = {}
      var wordCount = 0;
      var topWord = {};

      // This for loop grabs the sentences that were parsed, and splits them by a space " " then puts them in an object to count each word
      for (var getSentences = 0; getSentences < whatsapp_Obj.newText.length; getSentences++) {
        usersMessages[whatsapp_Obj.newNames[getSentences]].push(whatsapp_Obj.newText[getSentences])
        if (whatsapp_Obj.newText[getSentences].toLowerCase() === '<media omitted>') {
            mediaCount += 1;
        }
        var splitSentence = whatsapp_Obj.newText[getSentences].split(' ')
        for (var getWords_ = 0; getWords_ < splitSentence.length; getWords_++ ) {
          wordCount++;
          if (stopwords.stop.includes(splitSentence[getWords_].toLowerCase()) !== true && whatsapp_Obj.newText[getSentences].toLowerCase() !== '<media omitted>' && splitSentence[getWords_].length > 0) {
            var t = whatsapp_Obj.newNames[getSentences] // current user who 'owns' this word
            var w = splitSentence[getWords_]; // the current word
            if (wordDict[splitSentence[getWords_]] >= 0) {
              wordDict[splitSentence[getWords_]] += 1;
            } else {
              wordDict[splitSentence[getWords_]] = 1;
            }


            // if usersWords[t][w] has a key/value relationship
            if (usersWords[t][w] > 0) {
              // If the current user doesn't have an object/array yet
              if (Object.keys(topWord).includes(t) !== true) {
                topWord[t] = [0, 0]; // 0, 0 are placeholder nums
              } else {
                if (topWord[t][1] < usersWords[t][w]) { // Survival of the fittest, if one word count is greater than the other, replace that word
                  topWord[t] = [w, usersWords[t][w]]
                }
              }
              usersWords[t][w] += 1;
            } else {
              usersWords[t][w] = 1;
            }
          }
        }
      }

      var wordArr = [];

      for (var y in wordDict) {
        wordArr.push([y, wordDict[y]])
      }

      wordArr.sort(function(a, b) {
        return a[1] - b[1];
      });

      return [wordArr.reverse(), wordCount, topWord]

    },

    getTimeSince() {
      var date1 = new Date(whatsapp_Obj.newDates[0]).getTime();
      var date2 = new Date(whatsapp_Obj.newDates[whatsapp_Obj.newDates.length - 1]).getTime();

      var totalMil = date2 - date1;
      var times = {};

      times['Milliseconds'] = totalMil;
      times['Seconds'] = totalMil / 1000;
      times['Minutes'] =  times.Seconds / 60;
      times['Hours'] = times.Minutes / 60;
      times['Days'] = Math.floor(times.Hours / 24);
      times['Weeks'] = Math.floor(times.Days / 7);
      times['Months'] = Math.floor(times.Weeks / 4);
      times['Years'] = Math.floor(times.Days / 365);

      return times;
    }
  }

  var getTheWords = getData.getWords();
  var messageTotalCount = 0;

  for (var getTotalMessages of Object.keys(usersMessages)) {
    messageTotalCount += usersMessages[getTotalMessages].length;
  }

  const mainData = {
    'average': getData.getAvgSum(),
    'mostWords': getTheWords[0],
    'wordCount': getTheWords[1],
    'timeSince': getData.getTimeSince(),
    'users': usersOf,
    'usersMessagesTotal': usersMessages,
    'userMessagesTotal': messageTotalCount,
    'usersWordsTotal': usersWords,
    'topWordsEach': getTheWords[2],
    'mediaCount': mediaCount
  }

  return mainData;
}

export {analyze}
