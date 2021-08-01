import Repository from './Repository';

class Hydration extends Repository {
  constructor(hydrationData) {
    super(hydrationData);
  }

  calculateDailyOunces(id, date) {
    let findOuncesByDate = this.data.find(
      (data) => id === data.userID && date === data.date
    );
    return findOuncesByDate.numOunces;
  }

  calculateWeekOunces(id, today) {
    return this.getWeeklyData(id, today).map((data) => {
      let shortDate = data.date.split('/').slice(1).join('/');

      return `${shortDate}: ${data.numOunces}`;
    });
  }
}

export default Hydration;
