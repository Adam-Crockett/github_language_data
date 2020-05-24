import { gql } from 'apollo-boost';
import 'apollo-client';

class QueryBuilder {
  languageName: string;
  monthDates: string[];
  fragNames: string[];
  constructor(languageName: string, monthDates: string[]) {
    this.languageName = languageName;
    this.monthDates = monthDates;
    this.fragNames = [
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
      'eleven',
      'twelve',
    ];
  }

  gqlBuilder() {
    let mainQuery: string = `{`;
    for (let i: number = 0; i < this.fragNames.length; i += 1) {
      mainQuery =
        mainQuery +
        this.fragBuilder(
          this.fragNames[i],
          this.languageName,
          this.monthDates[i]
        );
    }
    mainQuery = mainQuery + `}`;
    return gql`
      ${mainQuery}
    `;
  }

  fragBuilder = (fragName: string, language: string, month: string) => {
    return `${fragName}: search(query:"language:${language}, created:${month}", type:REPOSITORY){repositoryCount}`;
  };
}

export default QueryBuilder;
