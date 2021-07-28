const fetchedUserData = fetch('http://localhost:3001/api/v1/users')
.then(response => response.json())
.catch(err => console.log(err));

const fetchedSleepData = fetch('http://localhost:3001/api/v1/sleep')
.then(response => response.json())
.catch(err => console.log(err));

const fetchedActivityData = fetch('http://localhost:3001/api/v1/activity')
.then(response => response.json())
.catch(err => console.log(err));

const fetchedHydrationData = fetch('http://localhost:3001/api/v1/hydration')
.then(response => response.json())
.catch(err => console.log(err));

 export const promise = Promise.all([fetchedUserData, fetchedSleepData, fetchedActivityData, fetchedHydrationData]);
