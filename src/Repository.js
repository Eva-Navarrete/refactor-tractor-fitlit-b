import dayjs from 'dayjs';

class Repository {
  constructor(data) {
    this.data = data;
  }

  getDailyData(id, date) {
    const information = this.data.find((info) => {
      return info.userID === id && info.date === date;
    });
    return information;
  }

  getSevenDates(date) {
    const week = [];

    for (let i = 0; i < 7; i++) {
      week.push(dayjs(date).subtract(i, 'day').format('YYYY/MM/DD'));
    }

    return week;
  }

  getWeeklyData(id, date) {
    const week = this.getSevenDates(date);
    const userData = this.data.filter((info) => info.userID === id);

    const weekOfData = week.map((day) => {
      const rightDay = userData.find((piece) => piece.date === day);
      return rightDay;
    });
    return weekOfData;
  }

  getAvg(property, id) {
    let dataCollection = this.data;

    if (id) {
      dataCollection = this.data.filter((item) => item.userID === id);
    }

    const total = dataCollection
      .map((item) => item[property])
      .reduce((sum, value) => (sum += value));

    return Number((total / dataCollection.length).toFixed(1));
  }

  getMostRecentDate() {
    const days = this.data.map((item) => item.date);
    const maxDate = days.reduce((mostRecent, current) => {
      if (dayjs(mostRecent).isBefore(dayjs(current))) {
        mostRecent = current;
      }
      return mostRecent;
    }, days[0]);

    return maxDate;
  }
}

export default Repository;
