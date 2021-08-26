import React, { Component } from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import Tile from "@softhread/components/cjs/ui/Tile";
import Tag from "@softhread/components/cjs/ui/Tag";
import Menu from "@softhread/components/cjs/ui/Menu";
import MenuItem from "@softhread/components/cjs/ui/MenuItem";
import Button from "@softhread/components/cjs/ui/Button";
import SearchBox from "@softhread/components/cjs/ui/SearchBox";
import Dropdown from "@softhread/components/cjs/ui/Dropdown";
import DataTable from "@softhread/components/cjs/ui/DataTable";
import { FaPlus, FaSync } from "react-icons/fa";
import "./_dashboard.scss";
import { API } from "aws-amplify";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
      trials: [],
      trialTags: [],
      queryMade: false,
      queriedTrials: [],
      regInstitutions: [],
      loading: true,
    };
  }

  async componentDidMount() {
    //When consturcting page query API to get all currently registered trials
    const apiName = process.env.REACT_APP_API_NAME;
    let path = "/irb/trials";
    const myInit = {
      queryStringParameters: {},
    };
    await API.get(apiName, path, myInit)
      .then((response) => {
        this.setState({ trials: response.trials });
      })
      .catch((error) => {
        console.log(error.response);
      });

    //Convert all trial status into appropriate Tags and save in state
    await this.state.trials.map(
      (trial, i) => (trial.status = this.convertToTag(i))
    );

    //Convert all Date objects to simple easy to read form
    await this.state.trials.map(
      (trial, i) => (trial.startDate = this.convertStartDate(i), trial.endDate = this.convertEndDate(i))
    );

    //Query all institutions currently tied to trials
    path = "/irb/trials/institutions";
    await API.get(apiName, path, myInit)
      .then((response) => {
        this.setState({ regInstitutions: response });
      })
      .catch((error) => {
        console.log(error.response);
      });
    this.setState({ loading: false });
    this.forceUpdate();
  }

  convertToTag(trialIndex) {
    //TO be removed
    if (this.state.trials[trialIndex].status === "PLACEHOLDER") {
      return (
        <Tag fill="faded" color="purple">
          PLACEHOLDER
        </Tag>
      );
    }
    if (this.state.trials[trialIndex].status === "inactive") {
      return (
        <Tag fill="faded" color="red">
          Paused
        </Tag>
      );
    }
    if (this.state.trials[trialIndex].status === "Approved" || "approved" || "active") {
      return (
        <Tag fill="faded" color="green">
          Approved
        </Tag>
      );
    }
    if (this.state.trials[trialIndex].status === "Paused" || "paused") {
      return (
        <Tag fill="faded" color="yellow">
          Paused
        </Tag>
      );
    }
    if (this.state.trials[trialIndex].status === "Completed" || "completed") {
      return (
        <Tag fill="faded" color="gray">
          Completed
        </Tag>
      );
    }
    if (this.state.trials[trialIndex].status === "Revoked" || "revoked") {
      return (
        <Tag fill="faded" color="red">
          Revoked
        </Tag>
      );
    }
    if (this.state.trials[trialIndex].status === "Restored" || "restored") {
      return (
        <Tag fill="faded" color="blue">
          Restored
        </Tag>
      );
    }
    else {
      return(
        <Tag fill="faded" color="blue">
          Restored
        </Tag>
      );
    }
  }

  convertStartDate(trialIndex) {
    const dateParts = this.state.trials[trialIndex].startDate.split("T")[0].split('-');
    const date = dateParts[1]+'/'+dateParts[2]+'/'+dateParts[0];
    return date;
  }
  convertEndDate(trialIndex) {
    const dateParts = this.state.trials[trialIndex].endDate.split("T")[0].split('-');
    const date = dateParts[1]+'/'+dateParts[2]+'/'+dateParts[0];
    return date;
  }

  queryByStatus(trials, event) {
    let queriedTrials = [];
    if (event.text === "All") {
      queriedTrials = trials;
    } else {
      trials.map((trial) => {
        if (trial.status.props.children === event.text) {
          queriedTrials.push(trial);
        } else {
        }
      });
    }
    this.setState({ queriedTrials, queryMade: true });
    return;
  }

  queryByInstitution(trials, event) {
    let queriedTrials = [];
    if (event.value === "All") {
      queriedTrials = trials;
    } else {
      trials.map((trial) => {
        if (trial.primaryInstitution === event.text) {
          queriedTrials.push(trial);
        } else {
        }
      });
    }
    this.setState({ queriedTrials, queryMade: true });
    return;
  }

  queryByTitle(trials, event) {
    let queriedTrials = [];

    trials.map((trial) => {
      if (trial.title.includes(event.value)) {
        queriedTrials.push(trial);
      } else {
      }
    });
    this.setState({ queriedTrials, queryMade: true });
    return;
  }

  refreshTrials() {
    this.setState({ queryMade: false });
  }

  render() {
    const items = [
      {
        text: "All",
        value: "all",
      },
      {
        text: "Approved",
        value: "approved",
      },
      {
        text: "Paused",
        value: "paused",
      },
      {
        text: "Completed",
        value: "completed",
      },
      {
        text: "Revoked",
        value: "revoked",
      },
      {
        text: "Restored",
        value: "restored",
      },
    ];

    let institutions = [
      {
        text: "All",
        value: "All",
      },
    ];
    this.state.regInstitutions.map((institution) => {
      //if (institution !== "PLACEHOLDER") {
      institutions.push({
        text: institution,
        value: institution,
      });
      //}
    });

    const headers = [
      {
        key: "studyNumber",
        label: "STUDY ID",
      },
      {
        key: "title",
        label: "TITLE",
      },
      {
        key: "primaryInstitution",
        label: "INSTITUTION",
      },
      {
        key: "startDate",
        label: "START DATE",
      },
      {
        key: "endDate",
        label: "END DATE",
      },
      {
        key: "status",
        label: "STATUS",
      },
    ];

    const trials = this.state.trials;

    let displayTrials = trials.slice(0, 10);
    if (this.state.queryMade === true) {
      displayTrials = this.state.queriedTrials;
    }

    return (
      <div className="dashboard">
        <PageLayout>
          <div className="dashboard__outter-dash-wrapper">
            <div className="dashboard__menu-wrapper">
              <Menu>
                <MenuItem to="#" active>
                  All Studies
                </MenuItem>
              </Menu>
              <Button
                icon={FaPlus}
                kind="primary"
                size="small"
                onClick={() => this.props.history.push("/new-trial")}
              >
                Create New Trial
              </Button>
            </div>
            <Tile>
              <div className="dashboard__inner-dash-wrapper">
                <Tile>
                  <div className="dashboard__row2">
                    <div className="dashboard__search-box">
                      <SearchBox
                        placeholder="Search by Trial Title"
                        onChange={(e) => this.queryByTitle(trials, e)}
                      />
                    </div>
                    <div className="dashboard__dropdowns">
                      <div className="dashboard__refresh">
                        <Button
                          icon={FaSync}
                          onClick={() => this.refreshTrials()}
                        />
                      </div>
                      <div className="dashboard__dropdown2">
                        <Dropdown
                          placeholder="Status"
                          options={items}
                          rounded
                          onSelect={(e) => this.queryByStatus(trials, e)}
                        />
                      </div>
                      <div className="dashboard__dropdown1">
                        <Dropdown
                          placeholder="Institution"
                          options={institutions}
                          rounded
                          onSelect={(e) => this.queryByInstitution(trials, e)}
                        />
                      </div>
                    </div>
                  </div>

                  {this.state.showMore ? (
                    <div className="dashboard__data-table">
                      <DataTable
                        rows={trials}
                        headers={headers}
                        onClickFunctions={this.state.trials.map((trial2) => {
                          return () =>
                            this.props.history.push(
                              `/trial-info/${trial2.studyNumber}`
                            );
                        })}
                      />

                      <Button
                        kind="primary"
                        outline
                        onClick={() => this.setState({ showMore: false })}
                      >
                        Show Less
                      </Button>
                    </div>
                  ) : (
                    <div className="dashboard__data-table">
                      <DataTable
                        rows={displayTrials}
                        headers={headers}
                        onClickFunctions={displayTrials.map((trial) => {
                          return () =>
                            this.props.history.push(
                              `/trial-info/${trial.studyNumber}`
                            );
                        })}
                      />
                      <Button
                        kind="primary"
                        outline
                        onClick={() => this.setState({ showMore: true })}
                      >
                        Show More
                      </Button>
                    </div>
                  )}
                </Tile>
              </div>
            </Tile>
          </div>
        </PageLayout>
      </div>
    );
  }
}

export default Dashboard;
