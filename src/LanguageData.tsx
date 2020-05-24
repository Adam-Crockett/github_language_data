class LanguageData {
  name: string;
  monthList: string[];
  repoData: number[];

  constructor(
    inputName: string,
    inputMonthList: string[],
    inputRepoData: number[]
  ) {
    this.name = inputName;
    this.monthList = inputMonthList;
    this.repoData = inputRepoData;
  }
}

export default LanguageData;
