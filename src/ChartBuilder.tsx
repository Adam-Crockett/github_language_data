import React from 'react';
import classNames from 'classnames';
import { Line } from 'react-chartjs-2';
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from 'reactstrap';
import LanguageData from './LanguageData';

interface ChartBuilderProps {
  allLangData: Map<string, LanguageData>;
  dataNames: string[];
}

interface ChartBuilderState {
  currentDataName: string;
  chartOptions: any;
  chartButtons: any;
  chartCollection: any;
}

/**
 * Component to create and render buttons and chart of data.
 * Receives a map of all the language data gathered from API.
 */
class ChartBuilder extends React.Component<
  ChartBuilderProps,
  ChartBuilderState
> {
  constructor(props: ChartBuilderProps) {
    super(props);
    this.state = {
      /** Initial language to display on chart.  */
      currentDataName: 'python',
      /** Button builder state. */
      chartButtons: '',
      /** Object literal of all the canvas renders of data. */
      chartCollection: this.createCollection(this.props.allLangData),
      /** Option settings for Line Chart Component. */
      chartOptions: {
        animationEnabled: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        tooltips: {
          backgroundColor: '#f5f5f5',
          titleFontColor: '#333',
          bodyFontColor: '#666',
          bodySpacing: 4,
          xPadding: 12,
          mode: 'nearest',
          intersect: 0,
          position: 'nearest',
        },
        responsive: true,
        scales: {
          yAxes: [
            {
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(29,140,248,0.0)',
                zeroLineColor: 'transparent',
              },
              ticks: {
                maxTicksLimit: 6,
                padding: 20,
                fontColor: '#9a9a9a',
              },
            },
          ],
          xAxes: [
            {
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(29,140,248,0.1)',
                zeroLineColor: 'transparent',
              },
              ticks: {
                padding: 20,
                fontColor: '#9a9a9a',
              },
            },
          ],
        },
      },
    };
  }

  /**
   * Creates the object literal holding all canvas renders of the data.
   */
  createCollection(allData: Map<string, LanguageData>) {
    let collection: any = {};
    allData.forEach((lang) => {
      collection[lang.name] =
        (lang.name, this.setChart(allData.get(lang.name)));
    });
    return collection;
  }

  /**
   * Build each canvas render of the chart data.
   */
  setChart(langData: LanguageData | undefined) {
    if (langData !== undefined) {
      return (canvas: any) => {
        let ctx = canvas.getContext('2d');

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
        gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
        gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors

        return {
          labels: langData.monthList,
          datasets: [
            {
              label: langData.name,
              fill: true,
              backgroundColor: gradientStroke,
              borderColor: '#1f8ef1',
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: '#1f8ef1',
              pointBorderColor: 'rgba(255,255,255,0)',
              pointHoverBackgroundColor: '#1f8ef1',
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: langData.repoData,
            },
          ],
        };
      };
    }
  }

  /**
   * Creates the buttons for each language option.
   */
  buttonBuilder(value: LanguageData | undefined) {
    if (value !== undefined) {
      return (
        <Button
          key={value.name}
          tag='label'
          className={classNames('btn-simple', {
            active: this.state.currentDataName === value.name,
          })}
          color='info'
          id={value.name}
          size='sm'
          onClick={() => {
            this.setState({
              currentDataName: value.name,
            });
          }}
        >
          <input
            defaultChecked
            className='d-none'
            name='options'
            type='radio'
          />
          <span className='d-none d-sm-block d-md-block d-lg-block d-xl-block'>
            {this.capitalizeFirstLetter(value.name)}
          </span>
          <span className='d-block d-sm-none'>
            <i className='tim-icons icon-single-02' />
          </span>
        </Button>
      );
    }
  }

  /** Capitalize first letter of string; for use with language names on buttons. */
  capitalizeFirstLetter(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }


  /** Render the Chart data with buttons. */
  render() {
    return (
      <>
        <div className='content'>
          <Row>
            <Col xs='12'>
              <Card className='card-chart'>
                <CardHeader>
                  <Row>
                    <Col className='text-left' sm='6'>
                      <h5 className='card-category'>
                        Repositories By Language on GitHub
                      </h5>
                      <CardTitle tag='h2'>Monthly Data</CardTitle>
                    </Col>
                    <Col sm='6'>
                      <ButtonGroup
                        className='btn-group-toggle float-right'
                        data-toggle='buttons'
                      >
                        {this.props.dataNames.length === 4 &&
                          this.props.dataNames.map((name) => {
                            return this.buttonBuilder(
                              this.props.allLangData.get(name)
                            );
                          })}
                      </ButtonGroup>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className='chart-area'>
                    <Line
                      data={
                        this.state.chartCollection[this.state.currentDataName]
                      }
                      options={this.state.chartOptions}
                    />
                    {/* <Line ref={ref => this.chartRefernece = ref} data={this.state.chartCollection[this.state.currentDataName]}  options={this.state.chartOptions} /> */}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default ChartBuilder;
