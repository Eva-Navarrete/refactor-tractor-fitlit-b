class Hydration {
  constructor(hydrationData) {
    this.hydrationData = hydrationData;
  }
  calculateAverageOunces(id) {
    let perDayUserHydration = this.hydrationData.filter((data) => id === data.userID);
    return perDayUserHydration.reduce((sumSoFar, data) => {
      return sumSoFar += data.numOunces;
    }, 0) / perDayUserHydration.length;
  }
  calculateDailyOunces(id, date) {
    let findOuncesByDate = this.hydrationData.find((data) => id === data.userID && date === data.date);
    return findOuncesByDate.numOunces;
  }
// calculate current date on pageload?!

  // calculate current date by sorting, store in constor

  calculateFirstWeekOunces(userRepo, id) {
    return userRepo.getFirstWeek(id, this.hydrationData).map((data) => `${data.date}: ${data.numOunces}`);
  }

  // make an array of 7 days prior to the current date store in consturctore

  calculateRandomWeekOunces(date, id, userRepo) {
    return userRepo.getWeekFromDate(date, id, this.hydrationData).map((data) => `${data.date}: ${data.numOunces}`);
  }
}


export default Hydration;
