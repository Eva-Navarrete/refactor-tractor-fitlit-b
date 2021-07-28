import './css/base.scss';
import './css/styles.scss';

import './images/person walking on path.jpg';
import './images/The Rock.jpg';

/////////// These need to be replaced by APIcalls
import userData from './data/users';
import hydrationData from './data/hydration';
import sleepData from './data/sleep';
import activityData from './data/activity';

import User from './User';
import Activity from './Activity';
import Hydration from './Hydration';
import Sleep from './Sleep';
import UserRepo from './User-repo';
////////////

// Which ones are actually necessary?
var sidebarName = document.getElementById('sidebarName');
var stepGoalCard = document.getElementById('stepGoalCard');
var headerText = document.getElementById('headerText');
var userAddress = document.getElementById('userAddress');
var userEmail = document.getElementById('userEmail');
var userStridelength = document.getElementById('userStridelength');
var friendList = document.getElementById('friendList');
var hydrationToday = document.getElementById('hydrationToday');
var hydrationAverage = document.getElementById('hydrationAverage');
var hydrationThisWeek = document.getElementById('hydrationThisWeek');
var hydrationEarlierWeek = document.getElementById('hydrationEarlierWeek');
var historicalWeek = document.querySelectorAll('.historicalWeek');
var sleepToday = document.getElementById('sleepToday');
var sleepQualityToday = document.getElementById('sleepQualityToday');
var avUserSleepQuality = document.getElementById('avUserSleepQuality');
var sleepThisWeek = document.getElementById('sleepThisWeek');
var sleepEarlierWeek = document.getElementById('sleepEarlierWeek');
var friendChallengeListToday = document.getElementById(
  'friendChallengeListToday'
);
var friendChallengeListHistory = document.getElementById(
  'friendChallengeListHistory'
);
var bigWinner = document.getElementById('bigWinner');
var userStepsToday = document.getElementById('userStepsToday');
var avgStepsToday = document.getElementById('avgStepsToday');
var userStairsToday = document.getElementById('userStairsToday');
var avgStairsToday = document.getElementById('avgStairsToday');
var userMinutesToday = document.getElementById('userMinutesToday');
var avgMinutesToday = document.getElementById('avgMinutesToday');
var userStepsThisWeek = document.getElementById('userStepsThisWeek');
var userStairsThisWeek = document.getElementById('userStairsThisWeek');
var userMinutesThisWeek = document.getElementById('userMinutesThisWeek');
var bestUserSteps = document.getElementById('bestUserSteps');
var streakList = document.getElementById('streakList');
var streakListMinutes = document.getElementById('streakListMinutes');

//This function instantiates all the repo classes and DOM manipulation
function startApp() {
  //this function is called at end of scripts file
  let userList = []; // a list of user instances
  instantiateUsers(userList); // instanciation of users
  let userRepo = new UserRepo(userList); // All instantiations should live together
  let hydrationRepo = new Hydration(hydrationData);
  let sleepRepo = new Sleep(sleepData);
  let activityRepo = new Activity(activityData);
  let currentUserID = randomizeId(); // choices random user
  let currentUser = getUserById(currentUserID, userRepo); // user object

  let today = makeToday(userRepo, currentUserID, hydrationData); // Here they are only finding the today based on hydrationData!
  let randomHistory = makeRandomDate(userRepo, currentUserID, hydrationData);

  historicalWeek.forEach((instance) =>
    instance.insertAdjacentHTML('afterBegin', `Week of ${randomHistory}`)
  );
  renderSidebar(currentUser, userRepo);
  addHydrationInfo(currentUserID, hydrationRepo, today, userRepo, randomHistory);
  renderSleep(currentUserID, sleepRepo, today, userRepo, randomHistory);
  let winnerNow = makeWinnerID(activityRepo, currentUser, today, userRepo);
  renderActivity(
    currentUserID,
    activityRepo,
    today,
    userRepo,
    randomHistory,
    currentUser,
    winnerNow
  );
  renderFriendGame(
    currentUserID,
    activityRepo,
    userRepo,
    today,
    randomHistory,
    currentUser
  );
}

// instantiates an array of user class objects
function instantiateUsers(array) { // REFACTOR!!
  userData.forEach(function (dataItem) {
    let user = new User(dataItem);
    array.push(user);

  });
}

// Function that picks user to display
function randomizeId() {
  return Math.floor(Math.random() * 50);
}

//gets specific user (might be redundant to a method call)
function getUserById(id, listRepo) {
  return listRepo.getDataFromID(id);
}

const renderPage() => {










}

//DOM Manipulation Functions
function renderSidebar(user, userStorage) {
  sidebarName.innerText = user.name;
  headerText.innerText = `${user.getFirstName()}'s Activity Tracker`;
  stepGoalCard.innerText = `Your daily step goal is ${user.dailyStepGoal}.`;
  avStepGoalCard.innerText = `The average daily step goal is ${userStorage.calculateAverageStepGoal()}`;
  userAddress.innerText = user.address;
  userEmail.innerText = user.email;
  userStridelength.innerText = `Your stridelength is ${user.strideLength} meters.`;
  friendList.insertAdjacentHTML(
    'afterBegin',
    renderFriendList(user, userStorage)
  );
}




function renderFriendList(user, userStorage) { // this is rendered inside of renderSidebar
  return user // return is happening prior to the function? No... Return is holding the function
    .getFriendsNames(userStorage)
    .map(
      (friendName) => `<li class='historical-list-listItem'>${friendName}</li>`
    )
    .join('');
}

function makeWinnerID(activityInfo, user, dateString, userStorage) { // NOT DOM MANI
  return activityInfo.getWinnerId(user, dateString, userStorage);
}

function makeToday(userStorage, id, dataSet) { // NOT DOM
  let sortedArray = userStorage.makeSortedUserArray(id, dataSet);
  return sortedArray[0].date;
}

function makeRandomDate(userStorage, id, dataSet) { // NOT DOM
  var sortedArray = userStorage.makeSortedUserArray(id, dataSet); // using a method on the userStorage?
  return sortedArray[Math.floor(Math.random() * sortedArray.length + 1)].date;
}

function addHydrationInfo( // Dom manipulation
  id,
  hydrationInfo,
  dateString,
  userStorage,
  laterDateString
) {
  hydrationToday.insertAdjacentHTML(
    'afterBegin',
    `<p>You drank</p><p><span class="number">${hydrationInfo.calculateDailyOunces(
      id,
      dateString
    )}</span></p><p>oz water today.</p>`
  );
  hydrationAverage.insertAdjacentHTML(
    'afterBegin',
    `<p>Your average water intake is</p><p><span class="number">${hydrationInfo.calculateAverageOunces(
      id
    )}</span></p> <p>oz per day.</p>`
  );
  hydrationThisWeek.insertAdjacentHTML(
    'afterBegin',
    makeHydrationHTML(
      id,
      hydrationInfo,
      userStorage,
      hydrationInfo.calculateFirstWeekOunces(userStorage, id)
    )
  );
  hydrationEarlierWeek.insertAdjacentHTML(
    'afterBegin',
    makeHydrationHTML(
      id,
      hydrationInfo,
      userStorage,
      hydrationInfo.calculateRandomWeekOunces(laterDateString, id, userStorage)
    )
  );
}

function makeHydrationHTML(id, hydrationInfo, userStorage, method) { // dom monipulation
  return method
    .map(
      (drinkData) =>
        `<li class="historical-list-listItem">On ${drinkData}oz</li>`
    )
    .join('');
}

function renderSleep(id, sleepInfo, dateString, userStorage, laterDateString) { //
  sleepToday.insertAdjacentHTML(
    'afterBegin',
    `<p>You slept</p> <p><span class="number">${sleepInfo.calculateDailySleep(
      id,
      dateString
    )}</span></p> <p>hours today.</p>`
  );
  sleepQualityToday.insertAdjacentHTML(
    'afterBegin',
    `<p>Your sleep quality was</p> <p><span class="number">${sleepInfo.calculateDailySleepQuality(
      id,
      dateString
    )}</span></p><p>out of 5.</p>`
  );
  avUserSleepQuality.insertAdjacentHTML(
    'afterBegin',
    `<p>The average user's sleep quality is</p> <p><span class="number">${
      Math.round(sleepInfo.calculateAllUserSleepQuality() * 100) / 100
    }</span></p><p>out of 5.</p>`
  );
  sleepThisWeek.insertAdjacentHTML(
    'afterBegin',
    makeSleepHTML(
      id,
      sleepInfo,
      userStorage,
      sleepInfo.calculateWeekSleep(dateString, id, userStorage)
    )
  );
  sleepEarlierWeek.insertAdjacentHTML(
    'afterBegin',
    makeSleepHTML(
      id,
      sleepInfo,
      userStorage,
      sleepInfo.calculateWeekSleep(laterDateString, id, userStorage)
    )
  );
}

function makeSleepHTML(id, sleepInfo, userStorage, method) {
  return method
    .map(
      (sleepData) =>
        `<li class="historical-list-listItem">On ${sleepData} hours</li>`
    )
    .join('');
}

function makeSleepQualityHTML(id, sleepInfo, userStorage, method) {
  return method
    .map(
      (sleepQualityData) =>
        `<li class="historical-list-listItem">On ${sleepQualityData}/5 quality of sleep</li>`
    )
    .join('');
}

function renderActivity(
  id,
  activityInfo,
  dateString,
  userStorage,
  laterDateString,
  user,
  winnerId
) {
  userStairsToday.insertAdjacentHTML(
    'afterBegin',
    `<p>Stair Count:</p><p>You</><p><span class="number">${activityInfo.userDataForToday(
      id,
      dateString,
      userStorage,
      'flightsOfStairs'
    )}</span></p>`
  );
  avgStairsToday.insertAdjacentHTML(
    'afterBegin',
    `<p>Stair Count: </p><p>All Users</p><p><span class="number">${activityInfo.getAllUserAverageForDay(
      dateString,
      userStorage,
      'flightsOfStairs'
    )}</span></p>`
  );
  userStepsToday.insertAdjacentHTML(
    'afterBegin',
    `<p>Step Count:</p><p>You</p><p><span class="number">${activityInfo.userDataForToday(
      id,
      dateString,
      userStorage,
      'numSteps'
    )}</span></p>`
  );
  avgStepsToday.insertAdjacentHTML(
    'afterBegin',
    `<p>Step Count:</p><p>All Users</p><p><span class="number">${activityInfo.getAllUserAverageForDay(
      dateString,
      userStorage,
      'numSteps'
    )}</span></p>`
  );
  userMinutesToday.insertAdjacentHTML(
    'afterBegin',
    `<p>Active Minutes:</p><p>You</p><p><span class="number">${activityInfo.userDataForToday(
      id,
      dateString,
      userStorage,
      'minutesActive'
    )}</span></p>`
  );
  avgMinutesToday.insertAdjacentHTML(
    'afterBegin',
    `<p>Active Minutes:</p><p>All Users</p><p><span class="number">${activityInfo.getAllUserAverageForDay(
      dateString,
      userStorage,
      'minutesActive'
    )}</span></p>`
  );
  userStepsThisWeek.insertAdjacentHTML(
    'afterBegin',
    makeStepsHTML(
      id,
      activityInfo,
      userStorage,
      activityInfo.userDataForWeek(id, dateString, userStorage, 'numSteps')
    )
  );
  userStairsThisWeek.insertAdjacentHTML(
    'afterBegin',
    makeStairsHTML(
      id,
      activityInfo,
      userStorage,
      activityInfo.userDataForWeek(
        id,
        dateString,
        userStorage,
        'flightsOfStairs'
      )
    )
  );
  userMinutesThisWeek.insertAdjacentHTML(
    'afterBegin',
    renderMinutes(
      id,
      activityInfo,
      userStorage,
      activityInfo.userDataForWeek(id, dateString, userStorage, 'minutesActive')
    )
  );
  bestUserSteps.insertAdjacentHTML(
    'afterBegin',
    makeStepsHTML(
      user,
      activityInfo,
      userStorage,
      activityInfo.userDataForWeek(
        winnerId,
        dateString,
        userStorage,
        'numSteps'
      )
    )
  );
}

function makeStepsHTML(id, activityInfo, userStorage, method) {
  return method
    .map(
      (activityData) =>
        `<li class="historical-list-listItem">On ${activityData} steps</li>`
    )
    .join('');
}

function makeStairsHTML(id, activityInfo, userStorage, method) {
  return method
    .map(
      (data) => `<li class="historical-list-listItem">On ${data} flights</li>`
    )
    .join('');
}

function renderMinutes(id, activityInfo, userStorage, method) { // invoked inside of renderActivity function
  return method
    .map(
      (data) => `<li class="historical-list-listItem">On ${data} minutes</li>`
    )
    .join('');
}

function renderFriendGame( // Dom Manipulation
  id,
  activityInfo,
  userStorage,
  dateString,
  laterDateString,
  user
) {
  friendChallengeListToday.insertAdjacentHTML(
    'afterBegin',
    makeFriendChallengeHTML(
      id,
      activityInfo,
      userStorage,
      activityInfo.showChallengeListAndWinner(user, dateString, userStorage)
    )
  );
  streakList.insertAdjacentHTML(
    'afterBegin',
    makeStepStreakHTML(
      id,
      activityInfo,
      userStorage,
      activityInfo.getStreak(userStorage, id, 'numSteps')
    )
  );
  streakListMinutes.insertAdjacentHTML(
    'afterBegin',
    makeStepStreakHTML(
      id,
      activityInfo,
      userStorage,
      activityInfo.getStreak(userStorage, id, 'minutesActive')
    )
  );
  friendChallengeListHistory.insertAdjacentHTML(
    'afterBegin',
    makeFriendChallengeHTML(
      id,
      activityInfo,
      userStorage,
      activityInfo.showChallengeListAndWinner(user, dateString, userStorage)
    )
  );
  bigWinner.insertAdjacentHTML(
    'afterBegin',
    `THIS WEEK'S WINNER! ${activityInfo.showcaseWinner(
      user,
      dateString,
      userStorage
    )} steps`
  );
}

function makeFriendChallengeHTML(id, activityInfo, userStorage, method) {
  return method
    .map(
      (friendChallengeData) =>
        `<li class="historical-list-listItem">Your friend ${friendChallengeData} average steps.</li>`
    )
    .join('');
}

function makeStepStreakHTML(id, activityInfo, userStorage, method) {
  return method
    .map(
      (streakData) => `<li class="historical-list-listItem">${streakData}!</li>`
    )
    .join('');
}

startApp();
/// Dom Updates Starts Here
// MEDIA QUERIES Here
// Move necessary to DOMupdates file
