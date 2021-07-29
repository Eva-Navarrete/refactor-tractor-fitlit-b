import './css/base.scss';
import './css/styles.scss';

import './images/person walking on path.jpg';
import './images/The Rock.jpg';

import {
  promise
} from '../src/apiCalls';
import {
  renderPage
} from '../src/domUpdates';


import User from './User';
import Activity from './Activity';
import Hydration from './Hydration';
import Sleep from './Sleep';
import UserRepo from './User-repo';
////////////

// Which ones are actually necessary?
// var sidebarName = document.getElementById('sidebarName');
// var stepGoalCard = document.getElementById('stepGoalCard');
// var headerText = document.getElementById('headerText');
// var userAddress = document.getElementById('userAddress');
// var userEmail = document.getElementById('userEmail');
// var userStridelength = document.getElementById('userStridelength');
// var friendList = document.getElementById('friendList');
// var hydrationToday = document.getElementById('hydrationToday');
// var hydrationAverage = document.getElementById('hydrationAverage');
// var hydrationThisWeek = document.getElementById('hydrationThisWeek');
// var hydrationEarlierWeek = document.getElementById('hydrationEarlierWeek');
// var historicalWeek = document.querySelectorAll('.historicalWeek');
// var sleepToday = document.getElementById('sleepToday');
// var sleepQualityToday = document.getElementById('sleepQualityToday');
// var avUserSleepQuality = document.getElementById('avUserSleepQuality');
// var sleepThisWeek = document.getElementById('sleepThisWeek');
// var sleepEarlierWeek = document.getElementById('sleepEarlierWeek');
// var friendChallengeListToday = document.getElementById(
//   'friendChallengeListToday'
// );
// var friendChallengeListHistory = document.getElementById(
//   'friendChallengeListHistory'
// );
// var bigWinner = document.getElementById('bigWinner');
// var userStepsToday = document.getElementById('userStepsToday');
// var avgStepsToday = document.getElementById('avgStepsToday');
// var userStairsToday = document.getElementById('userStairsToday');
// var avgStairsToday = document.getElementById('avgStairsToday');
// var userMinutesToday = document.getElementById('userMinutesToday');
// var avgMinutesToday = document.getElementById('avgMinutesToday');
// var userStepsThisWeek = document.getElementById('userStepsThisWeek');
// var userStairsThisWeek = document.getElementById('userStairsThisWeek');
// var userMinutesThisWeek = document.getElementById('userMinutesThisWeek');
// var bestUserSteps = document.getElementById('bestUserSteps');
// var streakList = document.getElementById('streakList');
// var streakListMinutes = document.getElementById('streakListMinutes');

// global functions to be used ot export to the dom:
export let userList;
export let userRepo;
export let hydrationRepo;
export let sleepRepo;
export let activityRepo;
export let currentUser;
export let currentUserID;
export let today;
export let randomHistory;
export let winnerNow;

//This function instantiates all the repo classes and DOM manipulation
function startApp() {
  //this function is called at end of scripts file
  promise.then(data => {
    // let userList = [];
    userList = instantiateUsers(data[0].userData);
    userRepo = new UserRepo(userList);
    hydrationRepo = new Hydration(data[3].hydrationData);
    sleepRepo = new Sleep(data[1].sleepData);
    activityRepo = new Activity(data[2].activityData);
    currentUserID = randomizeId();
    currentUser = getUserById(currentUserID, userRepo); // user object
    today = makeToday(userRepo, currentUserID, hydrationRepo.hydrationData);
    randomHistory = makeRandomDate(userRepo, currentUserID, hydrationRepo.hydrationData);
    winnerNow = makeWinnerID(activityRepo, currentUser, today, userRepo);

    renderPage()
  })
}

// instantiates an array of user class objects
function instantiateUsers(array) {
  const users = array.map(dataItem => {
    let user = new User(dataItem);
    return user;
  });
  return users;
}

// Function that picks user to display
function randomizeId() {
  return Math.floor(Math.random() * 50);
}

//gets specific user (might be redundant to a method call)
function getUserById(id, listRepo) {
  return listRepo.getDataFromID(id);
}

function makeWinnerID(activityInfo, user, dateString, userStorage) { // NOT DOM MANI
  return activityInfo.getWinnerId(user, dateString, userStorage);
}

function makeToday(userStorage, id, dataSet) {
  var sortedArray = userStorage.makeSortedUserArray(id, dataSet);
  return sortedArray[0].date;
}

function makeRandomDate(userStorage, id, dataSet) { // NOT DOM
  var sortedArray = userStorage.makeSortedUserArray(id, dataSet); // using a method on the userStorage?
  return sortedArray[Math.floor(Math.random() * sortedArray.length + 1)].date;
}
startApp();
///MAKE SLEEP IS AN UNUSED FUNCTION!
// function makeSleepQualityHTML(id, sleepInfo, userStorage, method) {
//   return method
//     .map(
//       (sleepQualityData) =>
//       `<li class="historical-list-listItem">On ${sleepQualityData}/5 quality of sleep</li>`
//     )
//     .join('');
// };
