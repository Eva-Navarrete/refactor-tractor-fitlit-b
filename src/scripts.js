import './css/base.scss';
import './css/styles.scss';

import dayjs from 'dayjs';

import './images/person walking on path.jpg';
import './images/The Rock.jpg';

import { promise, postHydration, fetchedHydrationData } from '../src/apiCalls';

import { renderPage } from '../src/domUpdates';

import User from './User';
import Activity from './Activity';
import Hydration from './Hydration';
import Sleep from './Sleep';
import UserRepo from './User-repo';
import Repository from './Repository';
let hydrationForm = document.getElementById('add-hydration');
let errorMsg = document.getElementById('js-error');


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
  currentUserID = randomizeId()
  invokeFetch();
}


function invokeFetch(){
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

    hydrationForm.addEventListener("submit", (event) => {submitForm(event)})

    renderPage()
  });
}
function reinstantiateHydration() {
  // fetchedHydrationData.then((data) => {
  //   console.log(data.hydrationData.length)
  // hydrationRepo = new Hydration(data.hydrationData);
  // console.log('reinstation', hydrationRepo)
  invokeFetch()
  // renderPage()
// })
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
  const formData = new FormData(event.target)
  const newHydration = {
    userID: currentUserID, // will need helped
    date: dayjs(formData.get("date")).format('YYYY/DD/MM'),
    numOunces: formData.get("numOunces")
  };

  validateInfo(newHydration);
  console.log('inside function', hydrationRepo)
  // reinstantiateHydration() THIS IS FOR GETTING
  // renderPage()
  // postHydration(newHydration);
  event.target.reset()
}

const validateInfo = (obj) => {
  if (obj.date === "Invalid Date"){
    errorMsg.innerText ="Needs valid Date"
    return
  } else {
    // errorMsg.innerText ="No Error"
    console.log(obj.numOunces)
    postHydration(obj)
  }
}

hydrationForm.addEventListener("submit", (event) => {submitForm(event)})
// const water = {"userID":1,"date":"2019/06/15","numOunces":37}
// postHydration(water)
startApp();
