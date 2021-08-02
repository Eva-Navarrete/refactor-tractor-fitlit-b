const fetchedUserData = fetch('http://localhost:3001/api/v1/users')
  .then((response) => response.json())
  .catch((err) => console.log(err));

const fetchedSleepData = fetch('http://localhost:3001/api/v1/sleep')
  .then((response) => response.json())
  .catch((err) => console.log(err));

const fetchedActivityData = fetch('http://localhost:3001/api/v1/activity')
  .then((response) => response.json())
  .catch((err) => console.log(err));

export const fetchHydro = () => {
  return fetchedHydrationData;
};

export const fetchedHydrationData = fetch(
  'http://localhost:3001/api/v1/hydration'
)
  .then((response) => response.json())
  .then((message) => {
    console.log('workriing');
    return message;
  })
  .catch((err) => console.log(err));

export const promise = Promise.all([
  fetchedUserData,
  fetchedSleepData,
  fetchedActivityData,
  fetchedHydrationData,
]);

// POST requests
//sleep
export const postHydration = (hydrationObj) => {
  return fetch('http://localhost:3001/api/v1/hydration', {
    method: 'POST',
    body: JSON.stringify(hydrationObj),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
  // .then(json => console.log(json)) // export function from Dom mainuplate and have it run here. Write it inside of domUpdate
  // .catch(err => console.log('NOPE')) // should make an error function
};
export const postSleep = (sleepObj) => {
  return fetch('http://localhost:3001/api/v1/sleep', {
    method: 'POST',
    body: JSON.stringify(sleepObj),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
};
export const postActivity = (activityObj) => {
  return fetch('http://localhost:3001/api/v1/activity', {
    method: 'POST',
    body: JSON.stringify(activityObj),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
};
