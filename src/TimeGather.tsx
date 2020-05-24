import moment from 'moment';

function TimeGather() {
  const getMonthList = () => {
    let i: number = 1;
    let monthNumberList: string[] = [];
    let monthNameList: string[] = [];

    while (i < 13) {
      monthNumberList.push(moment().subtract(i, 'months').format('YYYY-MM'));
      monthNameList.push(moment().subtract(i, 'months').format('MMM'));
      i++;
    }
    //Month Name list is reversed here for chart rendering
    return [monthNumberList, monthNameList.reverse()];
  };

  const monthData: string[][] = getMonthList();

  return monthData;
}

export default TimeGather;
