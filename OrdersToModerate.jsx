/* eslint-disable  */
import React, { PureComponent } from 'react';
import { Card, CardBody, Col, Button, CardFooter } from 'reactstrap';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { BarChart, Bar, Cell, ResponsiveContainer } from 'recharts';
import TrendingUpIcon from 'mdi-react/TrendingUpIcon';
import { fetchUsingStatusDateProductAndPaginationLimit } from '../../../fetches';
import { ReactComponent as ArrowBack } from '../../../images/arrow_back.svg';
import { ReactComponent as ArrowNext } from '../../../images/arrow_next.svg';
import LoadingIcon from './LoadingIcon';

class OrdersToModerate extends PureComponent {
  static propTypes = {
    changeDataFilter: PropTypes.func.isRequired,
    history: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      data: null,
    };
  }

  componentDidMount() {
    // these 3 lines below limit the order date to orders placed within a month of today
    var today = new Date();
    var thirtyDaysAgo = new Date().setDate(today.getDate() - 30);
    const startDateString = new Date(thirtyDaysAgo).toISOString();

    const endDateString = '';
    const purchasedFrom = '';
    const product = 'personalized';
    const orderStatus = 'on_hold';
    // change pagination limit to allow up to 1000 orders
    const perPage = 1000;

    let access_token = this.getAuthToken();
    // using auth token, request orders from API with status 'on_hold'
    fetchUsingStatusDateProductAndPaginationLimit(
      access_token,
      startDateString,
      endDateString,
      orderStatus,
      product,
      perPage,
    )
      .then(res => res.json())
      .then(response => {
        if (response.data) {
          // this return all orders on hold
          let { data } = response;
          // then set orders in state
          this.setState({ data }, console.log(this.state));
        } else {
          localStorage.removeItem('token');
          return this.props.history.push(`/`);
        }
      });
  }

  // function to get auth token from API
  getAuthToken() {
    let token;
    if (localStorage.getItem('token')) {
      return localStorage.getItem('token');
    } else {
      return this.props.history.push('/');
    }
  }

  sortByNewestOrder = (a, b) =>
    Date.parse(b.created_at) - Date.parse(a.created_at);

  // / function to format an order's placement-date
  getDate = timestamp => {
    const dateArray = new Date(timestamp).toUTCString().split(' ');
    return (
      <div>
        {dateArray[0]} {dateArray[2]} {dateArray[1]} <br />
      </div>
    );
  };

  // function for determining which order / order bar the user has clicked on in the dashboard widget, in order to view its order details
  // the active item is the order that appears as a GREEN bar in the dashboard widget
  getActiveItem = () => {
    if (this.state.data.length != 0) {
      return this.state.data[this.state.activeIndex];
    } else {
      return false;
    }
  };

  // function invoked when a user clicks on a different order in widget
  handleClick = index => {
    this.setState({
      activeIndex: index,
    });
  };

  // function to count how many orders need moderating / how many orders are displayed in widget
  getLength = () => {
    return this.state.data.length;
  };

  // function to calculate how many days overdue an order is
  // based on how overdue an order is, it will appear with a shorter or taller bar in the widget
  getDaysOverdue = x => {
    // calculate number of milliseconds from the order's purchase date till today
    let millisecondsUntilToday =
      new Date().getTime() - new Date(x.created_at).getTime();

    // convert milliseconds to days
    let total_seconds = parseInt(Math.floor(millisecondsUntilToday / 1000));
    let total_minutes = parseInt(Math.floor(total_seconds / 60));
    let total_hours = parseInt(Math.floor(total_minutes / 60));
    let days = parseInt(Math.floor(total_hours / 24));
    console.log('days', days);
    // adding + 1 to "days" count in line below because otherwise...
    // ...an order placed today (aka "zero" days overdue) will have "zero" height to its bar on the widget chart...
    return days + 1;
  };

  redirectToOrderGrid = () => {
    var today = new Date();
    var thirtyDaysAgo = new Date().setDate(today.getDate() - 30);
    const startDateString = new Date(thirtyDaysAgo).toISOString();

    return this.props.history.push(
      `/home/order_hub/grid/+startDate=${startDateString}+product=personalize+orderStatus=on_hold`,
    );
  };

  // function to display each vendor's name
  getVendorName = vendorObj => {
    return vendorObj.vendor;
  };

  handleArrowBack = () => {
    if (this.state.activeIndex > 0) {
      this.setState({ activeIndex: this.state.activeIndex - 1 });
    }
  };

  handleArrowNext = () => {
    if (this.state.activeIndex < this.state.data.length - 1) {
      this.setState({ activeIndex: this.state.activeIndex + 1 });
    }
  };

  getActiveOrderNumber = () => {
    if (this.getActiveItem()) {
      return this.getActiveItem().order_number;
    }
  };

  render() {
    return (
      <Col md={12} xl={4} lg={6} xs={12}>
        {this.state.data != null && this.state.data != [] ? (
          <Card>
            <CardBody className="dashboard__card-widget">
              <div className="card__title">
                <div className="title">
                  <h5 className="bold-text">Orders to Moderate: </h5>
                  <p className="subtext">* this month</p>
                </div>
                <span
                  className="dashboard__total-stat"
                  style={{ color: 'grey' }}
                >
                  {this.getLength()}
                </span>
              </div>
              <div className="dashboard__total">
                <ResponsiveContainer
                  height={50}
                  className="dashboard__chart-container"
                >
                  <BarChart
                    data={this.state.data.slice(0, 15)}
                    width={150}
                    height={40}
                  >
                    <Bar dataKey={this.getDaysOverdue}>
                      {this.state.data.slice(0, 15).map((entry, index) => (
                        <Cell
                          onClick={() => this.handleClick(index)}
                          dataset={index}
                          cursor="pointer"
                          fill={
                            index === this.state.activeIndex
                              ? '#013778'
                              : '#03aef0'
                          }
                          key={`cell-${index}`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="widget-control-arrows__container">
                <ArrowBack
                  width={20}
                  className="widget-arrow arrow-back"
                  onClick={() => this.handleArrowBack()}
                />
                <ArrowNext
                  width={20}
                  className="widget-arrow arrow-next"
                  onClick={() => this.handleArrowNext()}
                />
              </div>
            </CardBody>
            <CardFooter>
              {this.state.data.length != 0 ? (
                <div className="dashboard__footer">
                  <span className="dashboard__total-stat">
                    Purchase Date:
                    <span className="dash-stat">
                      {this.getDate(this.getActiveItem().created_at)}
                    </span>
                  </span>

                  <span className="dashboard__total-stat">
                    Vendors:
                    <span className="dash-stat">
                      {this.getActiveItem().vendors.map(vendorObj => (
                        <div className="vendor-name-stat">
                          {this.getVendorName(vendorObj)}
                        </div>
                      ))}
                    </span>
                  </span>
                </div>
              ) : null}

              {this.getActiveItem() ? (
                <span
                  className="dash-stat link"
                  onClick={() =>
                    this.props.history.push(
                      `/home/order_hub/order_details/${
                        this.getActiveItem().id
                      }`,
                    )
                  }
                >
                  View {this.getActiveOrderNumber()}
                </span>
              ) : null}

              <Button
                size="sm"
                color="info"
                className="view-details"
                onClick={() => this.redirectToOrderGrid()}
              >
                View All
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="loading-icon-container dashboard">
            <LoadingIcon />
          </div>
        )}
      </Col>
    );
  }
}

export default withRouter(OrdersToModerate);
