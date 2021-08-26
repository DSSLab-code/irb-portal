import React, { Component } from "react";
import Hero from "@softhread/components/cjs/ui/Hero";
import Button from "@softhread/components/cjs/ui/Button";
import Dropdown from "@softhread/components/cjs/ui/Dropdown";
import Tile from "@softhread/components/cjs/ui/Tile";
import Tabs from "@softhread/components/cjs/ui/Tabs";
import Tab from "@softhread/components/cjs/ui/Tab";
import Tag from "@softhread/components/cjs/ui/Tag";
import File from "@softhread/components/cjs/ui/File";
import DataTable from "@softhread/components/cjs/ui/DataTable";
import Modal from "@softhread/components/cjs/ui/Modal";
import { FaArrowLeft } from "react-icons/fa";
import { API, Storage } from "aws-amplify";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { FaFileDownload } from "react-icons/fa";

class TrialInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditModal: false,
      trials: undefined,
      trial: undefined,
      trialId: undefined,
      newStatus: undefined,
      participants: [],
    };
  }
  async componentDidMount() {
    //When consturcting page query API to get all currently registered trials
    const apiName = process.env.REACT_APP_API_NAME;
    let path = "/irb/trials";
    let myInit = {
      queryStringParameters: {},
    };

    await API.get(apiName, path, myInit)
      .then((response) => {
        this.setState({ trials: response.trials });
      })
      .catch((error) => {
        console.log(error.response);
      });

    path = "/irb/trials/" + this.state.trial.id + "/participants";
    myInit = {
      queryStringParameters: {},
    };
    console.log(path);
    await API.get(apiName, path, myInit)
      .then((response) => {
        console.log(response);
        this.setState({ participants: response.participantList.participants });
      })
      .catch((error) => {
        console.log(error.response);
      });

    this.forceUpdate();
  }

  async changeTrialStatus() {
    console.log(this.state.newStatus);
    console.log(this.state.trial.id);
    const apiName = process.env.REACT_APP_API_NAME;
    //Post to API with appropriate patient and trial information
    const path = "/irb/trials/" + this.state.trial.id + "/status";
    console.log(path);
    const date = new Date(Date.now());
    const myInit = {
      headers: {
        //Need to sort out why this API POST request isn't working and what headers need to be specified
      },
      body: {
        status: this.state.newStatus,
      },
    };
    //API call to get trial info
    const req = await API.post(apiName, path, myInit)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response);
      });
    this.setState({ showEditModal: false });
    this.forceUpdate();
    return;
  }

  async downloadConsentFile() {
    //Call API in order to get Blob object containing pdf
    const result = await Storage.get(this.state.trial.consentTemplateRef, {
      level: "public",
      download: true,
    });
    let blob = new Blob([result.Body], { type: "application/pdf" });
    //Create pdf URL from blob object
    let url = window.URL.createObjectURL(blob);

    //Get exisiting Bytes in pdf document and load to PDFDocument Object
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
    let pdfDoc = await PDFDocument.load(existingPdfBytes);

    //Modify Document and add watermark
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    //Save PDF (Returns Uint8Array)
    const pdfBytes = await pdfDoc.save();

    //Attempt to save to File object (Clears but the final document is corrupted)
    var bytes = new Uint8Array(pdfBytes);
    blob = new Blob([bytes], { type: "application/pdf" });
    url = URL.createObjectURL(blob);

    var link = document.createElement("a");
    link.href = url;
    link.download = this.state.trial.consentTemplateRef;
    link.click();
  }
  convertDate(initDate) {
    const datePieces = initDate.split("T")[0].split("-");
    const newDate = datePieces[1] + "/" + datePieces[2] + "/" + datePieces[0];
    return newDate;
  }
  render() {
    const items = [
      {
        text: "Active",
        value: "active",
      },
      {
        text: "Inactive",
        value: "inactive",
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

    let trials = undefined;
    const trialId = window.location.pathname.split("/").pop();
    let trial = {
      id: "",
      name: "",
      status: "",
      startDate: "",
      endDate: "",
      primaryInvestigator: "",
      secondaryInvestigator: "",
      institution: "",
      secondaryInstitution: "",
    };

    if (this.state.trials) {
      trials = this.state.trials;
      trials.map((trialInfo) => {
        if (trialInfo.studyNumber === trialId) {
          const startDate = this.convertDate(trialInfo.startDate);
          const endDate = this.convertDate(trialInfo.endDate);
          trial = {
            id: trialInfo.studyNumber,
            name: trialInfo.title,
            status: trialInfo.status,
            startDate: startDate,
            endDate: endDate,
            primaryInvestigator: trialInfo.primaryInvestigator,
            secondaryInvestigator: trialInfo.secondaryInvestigator,
            institution: trialInfo.primaryInstitution,
            secondaryInstitution: trialInfo.secondaryInstitution,
            consentTemplateRef: trialInfo.consentTemplateRef,
          };
          if (!this.state.trial) {
            this.setState({ trial: trial });
          }
        } else {
        }
      });
    }

    const headers = [
      {
        key: "id",
        label: "PARTICIPANT ID",
      },
      {
        key: "statusTag",
        label: "CONSENT STATUS",
      },
    ];

    let participants = [];

    this.state.participants.map((participant) => {
      participants.push({
        id: participant,
        name: "John Smith",
        email: "john.smith@gmail.com",
        status: "approved",
        statusTag: (
          <Tag fill="faded" color="green">
            Approved
          </Tag>
        ),
      });
    });
    /*
    participants = [
      {
        id: "1001",
        name: "John Smith",
        email: "john.smith@gmail.com",
        status: "approved",
        statusTag: (
          <Tag fill="faded" color="green">
            Approved
          </Tag>
        ),
      },
    ];
    console.log(participants);
    */

    const renderBasicInfo = () => {
      return (
        <div className="trial-info__basic-info">
          <h3>Basic Information</h3>
          <div className="trial-info__basic-info-content-wrapper">
            <div className="trial-info__basic-info-tile">
              <Tile>
                <div className="trial-info__data-row">
                  <div className="trial-info__data-col1">
                    <div className="trial-info__data-element">
                      <p>TRIAL ID</p>
                      <p className="trial-info__data">{trial.id}</p>
                    </div>
                    <div className="trial-info__data-element">
                      <p>START DATE</p>
                      <p className="trial-info__data">{trial.startDate}</p>
                    </div>
                    <div className="trial-info__data-element">
                      <p>PRIMARY INVESTIGATOR</p>
                      <p className="trial-info__data">
                        {trial.primaryInvestigator}
                      </p>
                    </div>
                    <div className="trial-info__data-element">
                      <p>INSTITUTION</p>
                      <p className="trial-info__data">{trial.institution}</p>
                    </div>
                    <div className="trial-info__data-element">
                      <p>TRIAL STATUS</p>
                      {trial.status === "PLACEHOLDER" && (
                        <Tag fill="faded" color="purple">
                          PLACEHOLDER
                        </Tag>
                      )}
                      {trial.status === "Approved" && (
                        <Tag fill="faded" color="green">
                          Approved
                        </Tag>
                      )}
                      {trial.status === "Paused" && (
                        <Tag fill="faded" color="yellow">
                          Paused
                        </Tag>
                      )}
                      {trial.status === "Completed" && (
                        <Tag fill="faded" color="gray">
                          Completed
                        </Tag>
                      )}
                      {trial.status === "Revoked" && (
                        <Tag fill="faded" color="red">
                          Revoked
                        </Tag>
                      )}
                      {trial.status === "Restored" && (
                        <Tag fill="faded" color="blue">
                          Restored
                        </Tag>
                      )}
                    </div>
                  </div>

                  <div className="trial-info__data-col2">
                    <div className="trial-info__data-element">
                      <p>TRIAL NAME</p>
                      <p className="trial-info__data">{trial.name}</p>
                    </div>
                    <div className="trial-info__data-element">
                      <p>END DATE</p>
                      <p className="trial-info__data">{trial.endDate}</p>
                    </div>
                    <div className="trial-info__data-element">
                      <p>SECONDARY INVESTIGATOR</p>
                      <p className="trial-info__data">
                        {trial.secondaryInvestigator}
                      </p>
                    </div>
                    <div className="trial-info__data-element">
                      <p>SECONDARY INSTITUTION</p>
                      <p className="trial-info__data">
                        {trial.secondaryInstitution}
                      </p>
                    </div>
                  </div>
                </div>
              </Tile>
            </div>
            <div className="trial-info__documents">
              <p>Documents</p>
              {this.state.trial && (
                <div className="trial-info__consent-download-button">
                  <Button
                    icon={FaFileDownload}
                    onClick={() => this.downloadConsentFile()}
                  >
                    Download {this.state.trial.consentTemplateRef}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    };

    const renderConsentList = () => {
      return (
        <div className="trial-info__basic-info">
          <div className="trial-info__consent-list-title">
            <h3>Consent List</h3>
          </div>
          {this.state.participants.length == 0 ? (
            <p className='trial-info__no-participants-text'>There are currently no participants attached to this trial.</p>
          ) : (
            <div className="trial-info__data-table">
              <DataTable rows={participants} headers={headers} />
            </div>
          )}
        </div>
      );
    };

    const renderEventLog = () => {
      return (
        <div className="trial-info__basic-info">
          <div className="trial-info__participants-title">
            <h3>Adverse Event Log</h3>
          </div>
        </div>
      );
    };
    return (
      <div className="trial-info">
        <Hero kind="primary">
          <h1>{trial.name}</h1>
        </Hero>
        <div className="trial-info__outer-wrapper">
          <div className="trial-info__inner-wrapper">
            <div className="trial-info__buttons">
              <div className="trial-info__to-dash">
                <Button
                  icon={FaArrowLeft}
                  kind="secondary"
                  onClick={() => this.props.history.push("/")}
                >
                  Back to Dashboard
                </Button>
              </div>
              <div className="trial-info__add-buttons">
                <Button onClick={() => this.setState({ showEditModal: true })}>
                  Edit Status
                </Button>
              </div>
            </div>
            <div className="trial-info__content">
              <Tile>
                <div className="trial-info__tabs">
                  <Tabs selectedIndex={0}>
                    <Tab id="basic-information" label="Basic Information">
                      {renderBasicInfo()}
                    </Tab>
                    <Tab id="consent-list" label="Consent List">
                      {renderConsentList()}
                    </Tab>
                    <Tab id="event-log" label="Adverse Event Log">
                      {renderEventLog()}
                    </Tab>
                  </Tabs>
                </div>
                <Modal open={this.state.showEditModal}>
                  <div className="trial-info__edit-modal-content">
                    <h5>Edit Trial Status</h5>
                  </div>
                  <div className="trial-info__modal-dropdown-wrapper">
                    <Dropdown
                      placeholder="Status"
                      options={items}
                      rounded
                      onSelect={(e) => this.setState({ newStatus: e.value })}
                    />
                  </div>
                  <div className="trial-info__edit-modal-buttons">
                    <Button
                      kind="danger"
                      outline
                      onClick={() => this.setState({ showEditModal: false })}
                    >
                      Cancel
                    </Button>
                    <Button
                      kind="primary"
                      onClick={() => this.changeTrialStatus()}
                    >
                      Update Trial Status
                    </Button>
                  </div>
                </Modal>
              </Tile>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TrialInfo;
