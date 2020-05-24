import React from 'react';
import './static/nucleo-icons.css';
import LanguageData from './LanguageData';
import TimeGather from './TimeGather';
import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import QueryBuilder from './QueryBuilder';
import { DocumentNode } from 'graphql';
import { gql } from 'apollo-boost';
import RingLoader from 'react-spinners/RingLoader';
import ChartBuilder from './ChartBuilder';
import { Row, Card, CardHeader, CardTitle } from 'reactstrap';

interface AppState {
  myToken: string | undefined;
  httpL: string;
  monthList: string[][];
  languageGroup: string[];
  querySet: Map<string, DocumentNode>;
  resultData: Map<string, LanguageData>;
  loading: boolean;
  hasError: boolean;
}

/**
 * Primary App Component. Make API request to GitHub v4 API using graphql.
 */
class App extends React.Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      myToken: undefined,
      httpL: 'https://api.github.com/graphql',
      monthList: TimeGather(),
      languageGroup: ['python', 'javascript', 'java', 'cpp'],
      querySet: new Map<string, DocumentNode>(),
      resultData: new Map<string, LanguageData>(),
      loading: true,
      hasError: false,
    };
  }


  /**
   * On component mount the send query request to API, recive data and create LanguageData.
   */
  componentDidMount() {

    for (let i = 0; i < this.state.languageGroup.length; i += 1) {
      let query = new QueryBuilder(
        this.state.languageGroup[i],
        this.state.monthList[0]
      );
      let newQuery = query.gqlBuilder();
      this.setState({
        querySet: this.state.querySet.set(
          this.state.languageGroup[i],
          newQuery
        ),
      });
        this.createClient()
        .query({
          query: gql`
            ${this.state.querySet.get(this.state.languageGroup[i])}
          `,
        })
        .then((result: any) => {
          /**
           * Try/catch if the data response is successful but not formated correctly.
           */
          try {
            const repoData: number[] = [
              result.data.one.repositoryCount,
              result.data.two.repositoryCount,
              result.data.three.repositoryCount,
              result.data.four.repositoryCount,
              result.data.five.repositoryCount,
              result.data.six.repositoryCount,
              result.data.seven.repositoryCount,
              result.data.eight.repositoryCount,
              result.data.nine.repositoryCount,
              result.data.ten.repositoryCount,
              result.data.eleven.repositoryCount,
              result.data.twelve.repositoryCount,
            ];

            this.setState(
              {
                resultData: this.state.resultData.set(
                  this.state.languageGroup[i],
                  new LanguageData(
                    this.state.languageGroup[i],
                    this.state.monthList[1],
                    //repoData is reversed here for chart rendering
                    repoData.reverse()
                  )
                ),
              },
              () => {
                if (this.state.resultData.size === 4) {
                  this.setState({
                    loading: false,
                  });
                }
              }
            );
            /**
             * Catch if there is an error in the data fetch from API.
             */
          } catch (error) {
            this.setState({
              hasError: true,
              loading: false,
            })
            
          }
          
            
        }).catch((error) => {console.log(error);
        this.setState({
          hasError: true,
          loading: false
        })});
    }
  }

  componentDidCatch() {
    // Display fallback UI
    this.setState({ hasError: true,
    loading: false });
  }

   /**
   * Generate client to use in API query.
   */
  createClient() {
    const httpLink = createHttpLink({
      uri: this.state.httpL,
    });
    const authLink = setContext((_, { headers }) => {
      const token = process.env.REACT_APP_KEY;
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
        },
      };
    });
    const cache = new InMemoryCache();
    
    const client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: cache,
    });
    return client;
  }


  /**
   * Render main view of the page. Send data to ChartBuilder to render chart data once all language data has been queried.
   */
  render() {
    return (
      <div className='wrapper'>
        <div className='main-panel blue'>
          <div className='container'>
            <Row>
              <div className='header'>
              <div className='personal-header'>
                  </div>
              </div>
              <Card className='card-chart'>
                <CardHeader>
                  <CardTitle className='text-center' tag='h3'>
                    <i className='text-info' /> Monthly amount of repositories created
                    on GitHub for several of the most popular languages.
                  </CardTitle>
                  <h5 className='text-center'>The chart shows the past twelve months and updates on the
                    first of the month.</h5>
                </CardHeader>
              </Card>
            </Row>
            <div>
              {this.state.loading === true && (
              <div className='loading-wrapper'>
              <RingLoader loading={this.state.loading} color={'#1d8cf8'} size='100px' />
            </div>)}
            {(this.state.hasError === false && this.state.loading === false) && (
              <ChartBuilder
                allLangData={this.state.resultData}
                dataNames={this.state.languageGroup}
              />
            )}
            {(this.state.hasError === true && this.state.loading === false) && (<div className='text-center'>Unable to retrive data from GitHub, please try again later.</div>)}
            </div>
          </div>
        </div>

        {/* <!--     Fonts and icons     --> */}
        <link
          href='https://fonts.googleapis.com/css?family=Montserrat:400,700,200'
          rel='stylesheet'
        />
        <link
          rel='stylesheet'
          href='https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css'
        />
      </div>
    );
  }
}
export default App;
