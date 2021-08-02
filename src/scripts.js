import './css/base.scss';
import './css/styles.scss';

import dayjs from 'dayjs';

import './images/person walking on path.jpg';
import './images/The Rock.jpg';

import {
  promise,
  postHydration,
  postActivity,
  // fetchedHydrationData,
  // fetchHydro,
  postSleep,
} from '../src/apiCalls';

import {
  renderPage,
  renderActivity,
  renderHydration,
  renderSleep,
} from '../src/domUpdates';

import User from './User';
import Activity from './Activity';
import Hydration from './Hydration';
import Sleep from './Sleep';
import UserRepo from './User-repo';
let hydrationForm = document.getElementById('add-hydration');

////////////

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
  currentUserID = randomizeId();
  invokeFetch();
}

function invokeFetch() {
  promise.then((data) => {
    userList = instantiateUsers(data[0].userData);
    userRepo = new UserRepo(userList);
    hydrationRepo = new Hydration(data[3].hydrationData);
    sleepRepo = new Sleep(data[1].sleepData);
    activityRepo = new Activity(data[2].activityData);

    currentUser = getUserById(currentUserID, userRepo); // user object
    today = makeToday(hydrationRepo, currentUserID);
    randomHistory = makeRandomDate(hydrationRepo.data);
    winnerNow = makeWinnerID(activityRepo, currentUser, today, userRepo);
    currentUserID;

    hydrationForm.addEventListener('submit', (event) => {
      submitForm(event);
    });

    renderPage();
  });
}

// instantiates an array of user class objects
function instantiateUsers(array) {
  const users = array.map((dataItem) => {
    let user = new User(dataItem);
    return user;
  });
  return users;
}

// Function that picks user to display
function randomizeId() {
  return Math.floor(Math.random() * 50);
}

function getUserById(id, listRepo) {
  return listRepo.getDataFromID(id);
}

function makeWinnerID(activityInfo, user, dateString, userStorage) {
  return activityInfo.getWinnerId(user, dateString, userStorage);
}

function makeToday(dataSet, id) {
  return dataSet.getMostRecentDate(id);
}

function makeRandomDate(dataSet) {
  const randomDate =
    dataSet[Math.floor(Math.random() * dataSet.length + 1)].date;

  return randomDate;
}

const submitForm = (event) => {
  event.preventDefault();
  event.stopImmediatePropagation();
  const formData = new FormData(event.target);
  console.log('date in form', formData.get('date'));

  const newHydration = {
    userID: currentUserID, // will need helped
    date: dayjs(formData.get('date')).format('YYYY/MM/DD'),
    numOunces: formData.get('numOunces'),
  };

  const newSleep = {
    userID: currentUserID,
    date: dayjs(formData.get('date')).format('YYYY/MM/DD'),
    hoursSlept: formData.get('hoursSlept'),
    sleepQuality: formData.get('sleepQuality'),
  };

  const newActivity = {
    userID: currentUserID,
    date: dayjs(formData.get('date')).format('YYYY/MM/DD'),
    numSteps: formData.get('numSteps'),
    minutesActive: formData.get('minutesActive'),
    flightsOfStairs: formData.get('flightsOfStairs'),
  };

  validateHydration(newHydration);
  validateSleep(newSleep);
  validateActivity(newActivity);
};

const validateHydration = (obj) => {
  if (obj.date === 'Invalid Date') {
    return;
  } else {
    today = obj.date;

    postHydration(obj)
      .then((response) => {
        console.log(response);
        return fetch('http://localhost:3001/api/v1/hydration');
      })
      .then((response) => response.json())
      .then((data) => {
        hydrationRepo = new Hydration(data.hydrationData);
        renderHydration(
          currentUserID,
          hydrationRepo,
          today,
          userRepo,
          randomHistory
        );
        return hydrationRepo;
      })
      .catch((err) => console.log(err));
  }
};

const validateActivity = (obj) => {
  if (obj.date === 'Invalid Date') {
    console.log('invalid Date');
    return;
  } else {
    today = obj.date;
    postActivity(obj)
      .then((response) => {
        console.log(response);
        return fetch('http://localhost:3001/api/v1/activity');
      })
      .then((response) => response.json())
      .then((data) => {
        activityRepo = new Activity(data.activityData);
        renderActivity(
          currentUserID,
          activityRepo,
          today,
          userRepo,
          randomHistory,
          currentUser,
          winnerNow
        );
        return activityRepo;
      })
      .catch((err) => console.log(err));
  }
};

const validateSleep = (obj) => {
  if (obj.date === 'Invalid Date') {
    console.log('invalid Date');
    return;
  } else {
    today = obj.date;
    postSleep(obj)
      .then((response) => {
        console.log(response);
        return fetch('http://localhost:3001/api/v1/sleep');
      })
      .then((response) => response.json())
      .then((data) => {
        sleepRepo = new Sleep(data.sleepData);
        renderSleep(currentUserID, sleepRepo, today, userRepo, randomHistory);

        return sleepRepo;
      })
      .catch((err) => console.log(err));
  }
};

hydrationForm.addEventListener('submit', (event) => {
  submitForm(event);
});

startApp();
