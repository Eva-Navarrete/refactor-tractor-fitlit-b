import { expect } from 'chai';
import Repository from '../src/Repository';
import { repoTestData } from '../src/data/test-data';

describe('Repository', () => {
  let repo;

  beforeEach(() => {
    repo = new Repository(repoTestData);
  });

  it('should be a function', () => {
    expect(Repository).to.be.a('function');
  });

  it('should be an instance of Repository class', () => {
    expect(repo).to.be.instanceOf(Repository);
  });

  it('should contain a array of data', () => {
    expect(repo.data[0]).to.deep.equal({
      userID: 1,
      date: '2019/06/15',
      pandasSnuggled: 57,
      minutesWasted: 140,
      coffesDrunk: 6,
    });
  });

  it('should be able to return an object by id and date', () => {
    const testDay = repo.getDailyData(1, '2019/06/16');

    expect(testDay).to.deep.equal({
      userID: 1,
      date: '2019/06/16',
      pandasSnuggled: 45,
      minutesWasted: 140,
      coffesDrunk: 1,
    });
  });

  it('should be able to return 7 consecutive objects by date and id', () => {
    const testWeek = repo.getWeeklyData(2, '2019/06/23');

    expect(testWeek.length).to.equal(7);
    expect(testWeek[0]).to.deep.equal({
      userID: 2,
      date: '2019/06/17',
      pandasSnuggled: 35,
      minutesWasted: 140,
      coffesDrunk: 1,
    });
  });

  it('should be able to calculate averages', () => {
    const testAvgPandas = repo.getAvg('pandasSnuggled', 1);

    expect(testAvgPandas).to.equal(37); //double check and round
  });

  it('should be able to calculate the average for a different property', () => {
    const testAllCoffeesAvg = repo.getAvg('coffeesDrunk');

    expect(testAllCoffeesAvg).to.equal(3); //double check and round
  });
});
