import 'dayjs';
import Repository from './Repository';

class UserRepo extends Repository {
  constructor(users) {
    super(users);
    this.users = users;
  }

  getDataFromID(id) {
    let user = this.users.find((user) => id === user.id);
    return user;
  }
  // this retrieves a single user's complete data set
  getDataFromUserID(id, dataSet) {
    return dataSet.filter((userData) => id === userData.userID);
  }

  calculateAverageStepGoal() {
    let totalStepGoal = this.users.reduce((sum, steps) => {
      sum = sum + steps.dailyStepGoal;
      return sum;
    }, 0);
    return totalStepGoal / this.users.length;
  }
  // sorting the arry from least to highest to find the lowest date (ie today) (getToday())
  makeSortedUserArray(id, dataSet) {
    // should be set on each class, not here.
    let selectedID = this.getDataFromUserID(id, dataSet);
    let sortedByDate = selectedID.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    return sortedByDate;
  }

  getToday(id, dataSet) {
    return this.makeSortedUserArray(id, dataSet)[0].date;
  }

  // this function returns the most recent week's worth of data
  getFirstWeek(id, dataSet) {
    return this.makeSortedUserArray(id, dataSet).slice(0, 7);
  }

  // this returns any week of data (is being used with all the different data sets)
  getWeekFromDate(date, id, dataSet) {
    let dateIndex = this.makeSortedUserArray(id, dataSet).indexOf(
      this.makeSortedUserArray(id, dataSet).find(
        (sortedItem) => sortedItem.date === date
      )
    );
    return this.makeSortedUserArray(id, dataSet).slice(
      dateIndex,
      dateIndex + 7
    );
  }

  chooseWeekDataForAllUsers(dataSet, date) {
    return dataSet.filter(function (dataItem) {
      return (
        new Date(date).setDate(new Date(date).getDate() - 7) <=
          new Date(dataItem.date) && new Date(dataItem.date) <= new Date(date)
      );
    });
  }

  chooseDayDataForAllUsers(dataSet, date) {
    return dataSet.filter(function (dataItem) {
      return dataItem.date === date;
    });
  }

  isolateUsernameAndRelevantData(dataSet, date, relevantData, listFromMethod) {
    return listFromMethod.reduce(function (objectSoFar, dataItem) {
      if (!objectSoFar[dataItem.userID]) {
        objectSoFar[dataItem.userID] = [dataItem[relevantData]];
      } else {
        objectSoFar[dataItem.userID].push(dataItem[relevantData]);
      }
      return objectSoFar;
    }, {});
  }

  rankUserIDsbyRelevantDataValue(dataSet, date, relevantData, listFromMethod) {
    let sortedObjectKeys = this.isolateUsernameAndRelevantData(
      dataSet,
      date,
      relevantData,
      listFromMethod
    );
    return Object.keys(sortedObjectKeys).sort(function (b, a) {
      return (
        sortedObjectKeys[a].reduce(function (sumSoFar, sleepQualityValue) {
          sumSoFar += sleepQualityValue;
          return sumSoFar;
        }, 0) /
          sortedObjectKeys[a].length -
        sortedObjectKeys[b].reduce(function (sumSoFar, sleepQualityValue) {
          sumSoFar += sleepQualityValue;
          return sumSoFar;
        }, 0) /
          sortedObjectKeys[b].length
      );
    });
  }

  combineRankedUserIDsAndAveragedData(
    dataSet,
    date,
    relevantData,
    listFromMethod
  ) {
    let sortedObjectKeys = this.isolateUsernameAndRelevantData(
      dataSet,
      date,
      relevantData,
      listFromMethod
    );
    let rankedUsersAndAverages = this.rankUserIDsbyRelevantDataValue(
      dataSet,
      date,
      relevantData,
      listFromMethod
    );
    return rankedUsersAndAverages.map(function (rankedUser) {
      rankedUser = {
        [rankedUser]:
          sortedObjectKeys[rankedUser].reduce(function (
            sumSoFar,
            sleepQualityValue
          ) {
            sumSoFar += sleepQualityValue;
            return sumSoFar;
          },
          0) / sortedObjectKeys[rankedUser].length,
      };
      return rankedUser;
    });
  }
}

export default UserRepo;
