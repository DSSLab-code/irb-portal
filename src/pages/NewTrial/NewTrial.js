import React, { Component } from "react";
import Hero from "@softhread/components/cjs/ui/Hero";
import Button from "@softhread/components/cjs/ui/Button";
import Select from "@softhread/components/cjs/ui/Select";
import TextInput from "@softhread/components/cjs/ui/TextInput";
import TextArea from "@softhread/components/cjs/ui/TextArea";
import Tile from "@softhread/components/cjs/ui/Tile";
import FileUpload from "@softhread/components/cjs/ui/FileUpload";
import { FaArrowLeft, FaPlus, FaMinus } from "react-icons/fa";
import { API, Storage } from "aws-amplify";

class NewTrial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studyNumber: "",
      studyTitle: "",
      startDate: "",
      endDate: "",
      primaryInvestigator: "",
      secondaryInvestigator: "",
      primaryInstitution: "",
      secondaryInstitution: "",
      consentTemplateRef: "",
      status: "",
      description: "",
      consentTemplateRef: "",
      file: null,
      hasSecondaryInvestigator: false,
      hasSecondaryInstitution: false,
    };
  }

  convertToDateObj(date) {
    const dateParts = date.split("/");
    const month = dateParts[0]-1; //Subtract one due to how indexing worksa in date object
    const day = dateParts[1];
    const year = dateParts[2];
    return new Date(year, month, day);
  }

  async handleSubmit(event) {
    const startDate = this.convertToDateObj(this.state.startDate);
    const endDate = this.convertToDateObj(this.state.endDate);
    const apiName = process.env.REACT_APP_API_NAME;
    const path = "/irb/trials/register";
    const myInit = {
      body: {
        irbNumber: "004",
        studyNumber: this.state.studyNumber,
        title: this.state.studyTitle,
        description: this.state.description,
        startDate: startDate,
        endDate: endDate,
        primaryInvestigator: this.state.primaryInvestigator,
        secondaryInvestigator: this.state.secondaryInvestigator,
        primaryInstitution: this.state.primaryInstitution,
        secondaryInstitution: this.state.secondaryInstitution,
        status: this.state.status,
        consentTemplateRef: this.state.consentTemplateRef,
      },
    };
    let files = [];
    files.push(this.state.file);

    uploadFiles(files);

    API.post(apiName, path, myInit)
      .then((response) => {
        console.log(response);
        alert("SUCCESS: Trial created and commited to the blockchain.");
      })
      .catch((error) => {
        console.log(error.response);
        alert(
          "ERROR: Trial failed to be created and commited to the blockchain."
        );
      });
    event.preventDefault();
  }

  render() {
    return (
      <div className="new-trial">
        <Hero kind="primary">
          <h1>Create New Trial</h1>
        </Hero>
        <div className="new-trial__outer-wrapper">
          <div className="new-trial__inner-wrapper">
            <div className="new-trial__buttons">
              <div className="new-trial__to-dash">
                <Button
                  icon={FaArrowLeft}
                  kind="secondary"
                  onClick={() => this.props.history.push("/")}
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
            <form onSubmit={this.handleSubmit}>
              <div className="new-trial__content">
                <Tile>
                  <div className="new-trial__basic-info">
                    <h3>Basic Information</h3>

                    <TextInput
                      id="default-input"
                      kind="text"
                      labelText="StudyNumber"
                      placeholder="Enter Study Number"
                      value={this.state.studyNumber}
                      onChange={(e) => this.setState({ studyNumber: e.value })}
                    />

                    <TextInput
                      id="default-input"
                      kind="text"
                      labelText="Trial Title"
                      placeholder="Enter Study Title"
                      value={this.state.studyTitle}
                      onChange={(e) => this.setState({ studyTitle: e.value })}
                    />
                    <TextArea
                      labelText="Trial Description"
                      value={this.state.description}
                      onChange={(e) => this.setState({ description: e.value })}
                    />
                    <div className="new-trial__dates">
                      <TextInput
                        id="default-input"
                        kind="text"
                        labelText="Start Date"
                        placeholder="MM/DD/YYYY"
                        value={this.state.startDate}
                        onChange={(e) => this.setState({ startDate: e.value })}
                      />
                      <TextInput
                        id="default-input"
                        kind="text"
                        labelText="End Date"
                        placeholder="MM/DD/YYYY"
                        value={this.state.endDate}
                        onChange={(e) => this.setState({ endDate: e.value })}
                      />
                    </div>
                    <TextInput
                      id="default-input"
                      kind="text"
                      labelText="Primary Investigator"
                      placeholder="Who is the primary investigator?"
                      value={this.state.primaryInvestigator}
                      onChange={(e) =>
                        this.setState({ primaryInvestigator: e.value })
                      }
                    />
                    {this.state.hasSecondaryInvestigator ? (
                      <div className="new-trial__secondary">
                        <TextInput
                          id="default-input"
                          kind="text"
                          labelText="Secondary Investigator"
                          placeholder="Who is the secondary investigator?"
                          value={this.state.secondaryInvestigator}
                          onChange={(e) =>
                            this.setState({ secondaryInvestigator: e.value })
                          }
                        />
                        <div className="new-trial__add">
                          <Button
                            icon={FaMinus}
                            size="small"
                            outline
                            onClick={() =>
                              this.setState({
                                hasSecondaryInvestigator: false,
                                secondaryInvestigator: "",
                              })
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="new-trial__add">
                        <Button
                          icon={FaPlus}
                          size="small"
                          outline
                          onClick={() =>
                            this.setState({ hasSecondaryInvestigator: true })
                          }
                        />
                        <a>Add Secondary Investigator</a>
                      </div>
                    )}

                    <TextInput
                      id="default-input"
                      kind="text"
                      labelText="Institution"
                      placeholder="Where is the trial being conducted?"
                      value={this.state.primaryInstitution}
                      onChange={(e) =>
                        this.setState({ primaryInstitution: e.value })
                      }
                    />

                    {this.state.hasSecondaryInstitution ? (
                      <div className="new-trial__secondary">
                        <TextInput
                          id="default-input"
                          kind="text"
                          labelText="Secondary Institution"
                          placeholder="Add an additional institution involed with the trial."
                          value={this.state.secondaryInstitution}
                          onChange={(e) =>
                            this.setState({ secondaryInstitution: e.value })
                          }
                        />
                        <div className="new-trial__add">
                          <Button
                            icon={FaMinus}
                            size="small"
                            outline
                            onClick={() =>
                              this.setState({
                                hasSecondaryInstitution: false,
                                secondaryInvestigator: "",
                              })
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="new-trial__add">
                        <Button
                          icon={FaPlus}
                          size="small"
                          outline
                          onClick={() =>
                            this.setState({ hasSecondaryInstitution: true })
                          }
                        />
                        <a>Add Secondary Institution</a>
                      </div>
                    )}

                    <h3>Trial Status</h3>
                    <Select
                      header="Trial Status"
                      labelText="Select Trial Status"
                      value={this.state.status}
                      onChange={(e) => this.setState({ status: e.value })}
                    >
                      <option>Approved</option>
                      <option>Paused</option>
                      <option>Completed</option>
                      <option>Revoked</option>
                      <option>Restored</option>
                    </Select>
                    <FileUpload

                      fileTypes={['.pdf', '.jpg']}
                      maxFileSize="500KB"
                      title="Approved Consent"
                      onDropFunction={(e) =>
                        this.setState({ consentTemplateRef: e.path, file: e })
                      }
                    />
                    <div className="new-trial__save-button">
                      <Button onClick={(e) => this.handleSubmit(e)}>
                        Save Trial
                      </Button>
                    </div>
                  </div>
                </Tile>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

async function uploadFiles(files) {
  const fileReader = new FileReader();

  const file = files[0];
  let key = null;
  console.log(file.name);
  try {
    key = await Storage.put(file.name, file, {
      level: "public",
      progressCallback(progress) {
        console.log(`uploaded: ${progress.loaded}/${progress.total}`);
      },
    });
  } catch (error) {
    console.log("error uploading file: ", error);
  }

  console.log(key);
}

export default NewTrial;

async function saveTrial(files) {
  // TODO: save rest of form
  await uploadFiles(files);
}
