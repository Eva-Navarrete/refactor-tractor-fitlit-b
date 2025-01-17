import {
  userRepo,
  hydrationRepo,
  activityRepo,
  sleepRepo,
  currentUser,
  currentUserID,
  today,
  randomHistory,
  winnerNow,
} from '../src/scripts';

//Query Selectors
let userName = document.getElementById('userName');
let stepGoalCard = document.getElementById('stepGoalCard');
let headerText = document.getElementById('headerText');
let userAddress = document.getElementById('userAddress');
let userEmail = document.getElementById('userEmail');
let userStridelength = document.getElementById('userStridelength');
let friendList = document.getElementById('friendList');
let hydrationToday = document.getElementById('hydrationToday');
let hydrationAverage = document.getElementById('hydrationAverage');
let hydrationThisWeek = document.getElementById('hydrationThisWeek');
let hydrationEarlierWeek = document.getElementById('hydrationEarlierWeek');
let historicalWeek = document.querySelectorAll('.historicalWeek');
let sleepToday = document.getElementById('sleepToday');
let sleepQualityToday = document.getElementById('sleepQualityToday');
let avUserSleepQuality = document.getElementById('avUserSleepQuality');
let sleepThisWeek = document.getElementById('sleepThisWeek');
let sleepEarlierWeek = document.getElementById('sleepEarlierWeek');
let friendChallengeListToday = document.getElementById(
  'friendChallengeListToday'
);
let friendChallengeListHistory = document.getElementById(
  'friendChallengeListHistory'
);
let bigWinner = document.getElementById('bigWinner');
let userStepsToday = document.getElementById('userStepsToday');
let avgStepsToday = document.getElementById('avgStepsToday');
let userStairsToday = document.getElementById('userStairsToday');
let avgStairsToday = document.getElementById('avgStairsToday');
let userMinutesToday = document.getElementById('userMinutesToday');
let avgMinutesToday = document.getElementById('avgMinutesToday');
let userStepsThisWeek = document.getElementById('userStepsThisWeek');
let userStairsThisWeek = document.getElementById('userStairsThisWeek');
let userMinutesThisWeek = document.getElementById('userMinutesThisWeek');
let bestUserSteps = document.getElementById('bestUserSteps');
let streakList = document.getElementById('streakList');
let streakListMinutes = document.getElementById('streakListMinutes');

// QUERY SELECTION FOR FORMS:

function renderSidebar(user, userStorage) {
  userName.innerText = user.name;
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

function renderFriendList(user, userStorage) {
  // this is rendered inside of renderSidebar
  return user // return is happening prior to the function? No... Return is holding the function
    .getFriendsNames(userStorage)
    .map(
      (friendName) => `<li class='historical-list-listItem'>${friendName}</li>`
    )
    .join('');
}

export function renderSleep(
  id,
  sleepInfo,
  dateString,
  userStorage,
  laterDateString
) {
  //
  sleepToday.innerHTML = `<p>You slept</p> <p><span class="number">${sleepInfo.calculateDailySleep(
    id,
    dateString
  )}</span></p> <p>hours today.</p>`;
  sleepQualityToday.innerHTML = `<p>Your sleep quality was</p> <p><span class="number">${sleepInfo.calculateDailySleepQuality(
    id,
    dateString
  )}</span></p><p>out of 5.</p>`;
  avUserSleepQuality.innerHTML = `<p>The average user's sleep quality is</p> <p><span class="number">${
    Math.round(sleepInfo.calculateAllUserSleepQuality() * 100) / 100
  }</span></p><p>out of 5.</p>`;
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

export function renderHydration( // Dom manipulation
  id,
  hydrationInfo,
  dateString,
  userStorage,
  laterDateString
) {
  console.log('>>>>>hydration', hydrationInfo, dateString);
  hydrationToday.innerHTML = `<p>You drank</p><p><span class="number">${hydrationInfo.calculateDailyOunces(
    id,
    dateString
  )}</span></p><p>oz water today.</p>`;
  hydrationAverage.innerHTML = `<p>Your average water intake is</p><p><span class="number">${hydrationInfo.getAvg(
    'numOunces',
    id
  )}</span></p> <p>oz per day.</p>`;
  hydrationThisWeek.insertAdjacentHTML(
    'afterBegin',
    renderHydrationHTML(
      id,
      hydrationInfo,
      userStorage,
      hydrationInfo.calculateWeekOunces(id, dateString)
    )
  );
  hydrationEarlierWeek.insertAdjacentHTML(
    'afterBegin',
    renderHydrationHTML(
      id,
      hydrationInfo,
      userStorage,
      hydrationInfo.calculateWeekOunces(id, laterDateString)
    )
  );
}

function renderHydrationHTML(id, hydrationInfo, userStorage, method) {
  return method
    .map(
      (drinkData) =>
        `<li class="historical-list-listItem">On ${drinkData}oz</li>`
    )
    .join('');
}

export function renderActivity(
  id,
  activityInfo,
  dateString,
  userStorage,
  user,
  winnerId
) {
  userStairsToday.innerHTML = `<p>Stair Count:</p><p>You</><p><span class="number">${activityInfo.userDataForToday(
    id,
    dateString,
    userStorage,
    'flightsOfStairs'
  )}</span></p>`;
  avgStairsToday.innerHTML = `<p>Stair Count: </p><p>All Users</p><p><span class="number">${activityInfo.getAllUserAverageForDay(
    dateString,
    userStorage,
    'flightsOfStairs'
  )}</span></p>`;
  userStepsToday.innerHTML = `<p>Step Count:</p><p>You</p><p><span class="number">${activityInfo.userDataForToday(
    id,
    dateString,
    userStorage,
    'numSteps'
  )}</span></p>`;
  avgStepsToday.innerHTML = `<p>Step Count:</p><p>All Users</p><p><span class="number">${activityInfo.getAllUserAverageForDay(
    dateString,
    userStorage,
    'numSteps'
  )}</span></p>`;
  userMinutesToday.innerHTML = `<p>Active Minutes:</p><p>You</p><p><span class="number">${activityInfo.userDataForToday(
    id,
    dateString,
    userStorage,
    'minutesActive'
  )}</span></p>`;
  avgMinutesToday.innerHTML = `<p>Active Minutes:</p><p>All Users</p><p><span class="number">${activityInfo.getAllUserAverageForDay(
    dateString,
    userStorage,
    'minutesActive'
  )}</span></p>`;
  userStepsThisWeek.insertAdjacentHTML(
    'afterBegin',
    renderStepsHTML(
      activityInfo.userDataForWeek(id, dateString, userStorage, 'numSteps')
    )
  );
  userStairsThisWeek.insertAdjacentHTML(
    'afterBegin',
    renderStairsHTML(
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
      activityInfo.userDataForWeek(id, dateString, userStorage, 'minutesActive')
    )
  );
  bestUserSteps.insertAdjacentHTML(
    'afterBegin',
    renderStepsHTML(
      activityInfo.userDataForWeek(
        winnerId,
        dateString,
        userStorage,
        'numSteps'
      )
    )
  );
}

function renderStepsHTML(method) {
  return method
    .map(
      (activityData) =>
        `<li class="historical-list-listItem">On ${activityData} steps</li>`
    )
    .join('');
}

function renderStairsHTML(method) {
  return method
    .map(
      (data) => `<li class="historical-list-listItem">On ${data} flights</li>`
    )
    .join('');
}

function renderMinutes(method) {
  return method
    .map(
      (data) => `<li class="historical-list-listItem">On ${data} minutes</li>`
    )
    .join('');
}

function renderFriendHTML(id, activityInfo, userStorage, method) {
  return method
    .map(
      (friendChallengeData) =>
        `<li class="historical-list-listItem">Your friend ${friendChallengeData} average steps.</li>`
    )
    .join('');
}

function renderFriendGame(id, activityInfo, userStorage, dateString, user) {
  friendChallengeListToday.insertAdjacentHTML(
    'afterBegin',
    renderFriendHTML(
      id,
      activityInfo,
      userStorage,
      activityInfo.showChallengeListAndWinner(user, dateString, userStorage)
    )
  );
  streakList.insertAdjacentHTML(
    'afterBegin',
    renderStreakHTML(activityInfo.getStreak(userStorage, id, 'numSteps'))
  );
  streakListMinutes.insertAdjacentHTML(
    'afterBegin',
    renderStreakHTML(activityInfo.getStreak(userStorage, id, 'minutesActive'))
  );
  friendChallengeListHistory.insertAdjacentHTML(
    'afterBegin',
    renderFriendHTML(
      id,
      activityInfo,
      userStorage,
      activityInfo.showChallengeListAndWinner(user, dateString, userStorage)
    )
  );

  function renderStreakHTML(method) {
    return method
      .map(
        (streakData) =>
          `<li class="historical-list-listItem">${streakData}!</li>`
      )
      .join('');
  }

  bigWinner.insertAdjacentHTML(
    'afterBegin',
    `THIS WEEK'S WINNER! ${activityInfo.showcaseWinner(
      user,
      dateString,
      userStorage
    )} steps`
  );
}

const renderHistoricalWeek = () => {
  return historicalWeek.forEach((instance) =>
    instance.insertAdjacentHTML('afterBegin', `Week of ${randomHistory}`)
  );
};

export const renderPage = () => {
  renderSidebar(currentUser, userRepo);
  renderSleep(currentUserID, sleepRepo, today, userRepo, randomHistory);
  renderHydration(currentUserID, hydrationRepo, today, userRepo, randomHistory);
  renderActivity(
    currentUserID,
    activityRepo,
    today,
    userRepo,
    currentUser,
    winnerNow
  );
  renderFriendGame(currentUserID, activityRepo, userRepo, today, currentUser);
  renderHistoricalWeek();
  console.log('connected');
};
