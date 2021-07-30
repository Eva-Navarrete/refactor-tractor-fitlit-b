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

  getWeeklyData(id, date) {
    const week = [];
    let i = 0;

    week.push(date);
    do {
      i++;
      week.push(dayjs(date).subtract(i, 'day').format('YYYY/MM/DD'));
    } while (i < 6);

    const userData = this.data.filter((info) => {
      return info.userID === id;
    });

    const weekOfData = week.map((day) => {
      const rightDay = userData.find((piece) => {
        return piece.date === day;
      });
      return rightDay;
    });
    return weekOfData;
  }
}

export default Repository;

/*  
findSleepWeek (id, date) {
    let sevenDaysData = [];
    let i = 0;

    sevenDaysData.push(date)
    do {
      i++;
      sevenDaysData.push((dayjs(date).subtract(i, 'day').format('YYYY/MM/DD')))
    } while (i < 6);
    
   let returnSleepQuality = this.userSleepData.reduce((acc, userData, index) => {
     userData.userID === id && sevenDaysData.includes(userData.date)
       acc.unshift(userData.hoursSlept)
       return acc
     }, [])
    return returnSleepQuality
  }
  */
