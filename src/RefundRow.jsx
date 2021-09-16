import React, { Component, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class RefundRow extends Component {
  constructor() {
    super();
    this.state = {
      toggle: false,
      modalShow: false
    };

    this.clickToggle = this.clickToggle.bind(this);
    this.setModalShow = this.setModalShow.bind(this);
  }

  setModalShow(val) {
    if (this.state.modalShow == false) {
      this.setState({ modalShow: true });
    } else {
      this.setState({ modalShow: false });
    }
  }

  clickToggle() {
    if (this.state.toggle == false) {
      this.setState({ toggle: true });
    } else {
      this.setState({ toggle: false });
    }
  }

  render() {
    var data = this.props.data;
    var filter = this.props.filters;

    var refundClass = "refundRegular";

    if (
      data["Refunds"].indexOf("Managing Directly") > -1 ||
      data["Instructions 1"] ||
      data["Instructions 2"] ||
      data["Instructions 3"]
    ) {
      refundClass = "refundDownload";
    }

    var restrictionsTitle = data["Restrictions Link Title 1"];

    //if there's a link but no title
    if (
      (data["Restrictions Link Title 1"] == "" ||
        data["Restrictions Link Title 1"] == undefined) &&
      data["Restrictions Link URL 1"] !== "" &&
      data["Restrictions Link URL 1"] !== undefined
    ) {
      retrictionsTitle = "Link";
    }

    return (
      <div>
        <MyVerticallyCenteredModal
          show={this.state.modalShow}
          onHide={this.setModalShow.bind(this, false)}
        />
        <div
          className={"airlinePartRow" + (this.state.toggle ? " active" : "")}
        >
          <div className="airlinePartRowTop">
            <div className="airlinePartRowStart">
              <div className="d-flex align-items-center">
                <div className="">
                  <div className="apDesignator">{data["Designator"]}</div>
                </div>
                <div className="">
                  <div className="apCode">{data["Numeric Code"]}</div>
                </div>
                <div className="">
                  <div className="airlinePartName">{data["Name"]}</div>
                </div>
                {(data[
                  "Refund or Ticket Validity Information Last Updated"
                ] && (
                  <div className="ml-auto">
                    <span className="apUpdated">
                      <span>Latest Updates:</span>
                      {
                        data[
                          "Refund or Ticket Validity Information Last Updated"
                        ]
                      }
                    </span>
                  </div>
                )) || (
                  <div className="ml-auto">
                    <div className="apUpdated">
                      <span>Latest Updates:</span> January 1, 2021
                    </div>
                  </div>
                )}
                <div>
                  <div>
                    <div
                      onClick={this.setModalShow.bind(this, true)}
                      className="apProfile"
                    >
                      Airline Profile <i className="fas fa-chevron-right"></i>
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <div className="apExpand" onClick={this.clickToggle}>
                      <i
                        className={
                          "fas" + (this.state.toggle ? " fa-minus" : " fa-plus")
                        }
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={
                "airlinePartRowInfo" +
                (this.state.toggle ? " show animated slideInDown" : "")
              }
            >
              <div className="row no-gutters">
                <div className="col">
                  <div className="apSection apSectionMargin">
                    <div className="apSectionTop">
                      <div className="d-flex align-items-center">
                        <h3>Refunds</h3>
                        {(data[
                          "Refund or Ticket Validity Information Last Updated"
                        ] && (
                          <div className="mr-1">
                            <span className="apUpdated">
                              <span>Updated:</span>
                              {
                                data[
                                  "Refund or Ticket Validity Information Last Updated"
                                ]
                              }
                            </span>
                          </div>
                        )) || (
                          <div className="mr-1">
                            <div className="apUpdated">
                              <span>Updated:</span> January 1, 2021
                            </div>
                          </div>
                        )}

                        <div className="ml-auto">
                          <img
                            data-tip=""
                            data-for="refund"
                            src="https://www2.arccorp.com/globalassets/about-us/our-data/redesign/tooltip.png"
                            alt="Help"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="apSectionBottom">
                      <div className="row">
                        {data["Phone"] && (
                          <div className="col-lg-5">
                            <div className="apDataLabel">Phone</div>
                            <div className="apDataText">{data["Phone"]}</div>
                          </div>
                        )}

                        <div className="col-lg-7">
                          <div className="apRefundsBtn">{data["Refunds"]}</div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-12">
                          {data["Email"] && (
                            <div>
                              <div className="apDataLabel">Email</div>
                              <a href={"mailto:" + data["Email"]}>
                                {data["Email"]}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="row">
                        {(data["Instructions 1"] ||
                          data["Instructions 2"] ||
                          data["Instructions 3"]) && (
                          <div className="col-lg-12">
                            <div className="apDataLabel">Instructions</div>
                            {data["Instructions 1"] && (
                              <div className="apDataText">
                                {data["Instructions 1"]
                                  .split(" ")
                                  .map((item, i) => {
                                    if (item.indexOf("http") > -1) {
                                      item = (
                                        <a href={item} target="_blank">
                                          Click here
                                        </a>
                                      );
                                    }
                                    return <span key={i}>{item} </span>;
                                  })}
                              </div>
                            )}

                            {data["Instructions 2"] && (
                              <div className="apDataText">
                                {data["Instructions 2"]
                                  .split(" ")
                                  .map((item, i) => {
                                    if (item.indexOf("http") > -1) {
                                      item = (
                                        <a href={item} target="_blank">
                                          Click here
                                        </a>
                                      );
                                    }
                                    return <span key={i}>{item} </span>;
                                  })}
                              </div>
                            )}

                            {data["Instructions 3"] && (
                              <div className="apDataText">
                                {data["Instructions 3"]
                                  .split(" ")
                                  .map((item, i) => {
                                    if (item.indexOf("http") > -1) {
                                      item = (
                                        <a href={item} target="_blank">
                                          Click here
                                        </a>
                                      );
                                    }
                                    return <span key={i}>{item} </span>;
                                  })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="apSection">
                    <div className="apSectionTop">
                      <div className="d-flex align-items-center">
                        <h3>Processing Validity</h3>

                        <div className="ml-auto">
                          <img
                            data-tip=""
                            data-for="refund"
                            src="https://www2.arccorp.com/globalassets/about-us/our-data/redesign/tooltip.png"
                            alt="Help"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="apSectionBottom">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="d-flex align-items-center">
                            <div className="apProcessing">
                              {data["Ticket Validity"].replace("Months", "")}
                            </div>
                            <div className="apProcessingText">Months</div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {data["Restrictions Link Title 1"] &&
                          data["Restrictions Link URL 1"] && (
                            <div className="col-lg-12">
                              <div className="apDataLabel">Restriction</div>
                              <div className="apDataText">
                                <p>
                                  {" "}
                                  {data["Restrictions Text"] && (
                                    <div>{data["Restrictions Text"]}</div>
                                  )}
                                  <a
                                    target="_blank"
                                    href={data["Restrictions Link URL 1"]}
                                  >
                                    {data["Restrictions Link Title 1"]}
                                  </a>
                                </p>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="apSection apSectionMargin">
                    <div className="apSectionTop apSectionBorderNone">
                      <div className="d-flex align-items-center">
                        <h3>EDIFACT Support</h3>
                        <div className="ml-auto">
                          <img
                            data-tip=""
                            data-for="refund"
                            src="https://www2.arccorp.com/globalassets/about-us/our-data/redesign/tooltip.png"
                            alt="Help"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="apSectionBottom">
                      <div className="row apEdiBorder">
                        <div className="col-lg-6">
                          <div className="apEdiItem">
                            <div className="apEdiCir"></div>
                            <div className="apEdiLabel">
                              <sup>1</sup>IAR ET VOID
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="apEdiItem">
                            <div className="apEdiCir"></div>
                            <div className="apEdiLabel">
                              <sup>1</sup>IAR ET VOID
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row apEdiBorder">
                        <div className="col-lg-6">
                          <div className="apEdiItem">
                            <div className="apEdiCir"></div>
                            <div className="apEdiLabel">
                              <sup>1</sup>IAR ET VOID
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="apEdiItem">
                            <div className="apEdiCir"></div>
                            <div className="apEdiLabel">
                              <sup>1</sup>IAR ET VOID
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="apEdiItem">
                            <div className="apEdiCir"></div>
                            <div className="apEdiLabel">
                              <sup>1</sup>IAR ET VOID
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="apEdiItem">
                            <div className="apEdiCirRed"></div>
                            <div className="apEdiLabel">
                              <sup>1</sup>IAR ET VOID
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="apEdiSup">
                        <sup>1</sup>An Electronic Settlement Authorization Code
                        (ESAC) is provided by 1all ticketing Airlines and is
                        required for voids and refunds.
                      </div>

                      <div className="apEdiLegend">
                        <div className="apEdiCir"></div>
                        <div
                          className="apEdiLabel"
                          style={{ marginRight: "10px" }}
                        >
                          Supports
                        </div>
                        <div className="apEdiCirRed"></div>
                        <div className="apEdiLabel">Does Not Support</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="apSection apPaymentSection">
                <div className="apSectionTop">
                  <div className="d-flex align-items-center">
                    <h3>Accepted Payments</h3>
                    <div className="ml-auto">
                      <img
                        data-tip=""
                        data-for="refund"
                        src="https://www2.arccorp.com/globalassets/about-us/our-data/redesign/tooltip.png"
                        alt="Help"
                      />
                    </div>
                  </div>
                </div>
                <div className="apSectionBottom">
                  <div className="apPaymentLabels">
                    <div className="apPaymentLabel active">Cash</div>
                    <div className="apPaymentLabel">American Express (AX)</div>
                    <div className="apPaymentLabel">Diners Club Int'l (DC)</div>
                    <div className="apPaymentLabel">Discover Card (DS)</div>
                    <div className="apPaymentLabel">JCB (JC)</div>
                    <div className="apPaymentLabel">Mastercard (CA)</div>
                    <div className="apPaymentLabel">PayPal (TP)</div>
                    <div className="apPaymentLabel">UATP (UP)</div>
                    <div className="apPaymentLabel">UnionPay (UP)</div>
                    <div className="apPaymentLabel">VISA (VI)</div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="apDataLabel">Restriction</div>
                      <div className="apDataText">
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit.
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div className="apDataLabel">Exception</div>
                      <div className="apDataText">
                        Enim quis ab qui numquam assumenda sit dignissimos
                        corrupti, vero est nam quae eligendi incidunt deleniti
                        impedit accusamus, sapiente ea. Earum, ab.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="apInfo">
                <div className="apInfoContainer">
                  <div className="row align-items-center">
                    <div className="col">
                      <div className="d-flex align-items-center justify-center">
                        <img
                          src="https://www2.arccorp.com/globalassets/refunds/ap-calendar-icon.png"
                          alt=""
                          className="apInfoIcon"
                        />
                        <div className="apInfoLabel">General Concurrence</div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex align-items-center justify-center">
                        <img
                          src="https://www2.arccorp.com/globalassets/refunds/ap-check-icon.png"
                          alt=""
                          className="apInfoIcon apInfoCheck"
                        />
                        <div className="apInfoLabel apNDClabel">
                          NDC / Direct Connect
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex align-items-center">
                        <img
                          src="https://www2.arccorp.com/globalassets/refunds/ap-info-icon.png"
                          alt=""
                          className="apInfoIcon apInfoPolicy"
                        />
                        <a className="apInfoLabel apInfoLink">
                          Airline Policy{" "}
                          <i className="fas fa-chevron-right"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "none" }} className="airlinePartRowBottom">
            <div className="container-fluid">
              <div className="row no-gutters align-items-center">
                <div className="col-3">
                  <div className="airlinePartLabel">Refunds</div>
                  {data["Website"]}
                  <div
                    onClick={
                      refundClass == "refundDownload"
                        ? this.clickToggle
                        : function() {
                            console.log("");
                          }
                    }
                    className={"refundPolicy" + " " + refundClass}
                  >
                    {data["Refunds"]}
                    {refundClass == "refundDownload" && (
                      <i className="fas fa-arrow-down"></i>
                    )}
                  </div>
                </div>
                <div className="col-3">
                  <span className="airlinePartLabel">Processing Validity:</span>

                  {(data["Restrictions Link Title 1"] ||
                    data["Restrictions Link URL 1"]) && (
                    <div
                      onClick={
                        refundClass == "refundDownload"
                          ? this.clickToggle
                          : function() {
                              console.log("");
                            }
                      }
                      className={"refundPolicy" + " " + refundClass}
                    >
                      Restrictions
                      {refundClass == "refundDownload" && (
                        <i className="fas fa-arrow-down"></i>
                      )}
                    </div>
                  )}
                </div>
                {(data["Phone"] || data["Email"]) && (
                  <div className="col-6">
                    <a onClick={this.clickToggle}>
                      View Additional Information
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={"airlinePartRowInfo" + ""}>
            <div className="container-fluid">
              <div className="row no-gutters">
                {(data["Instructions 1"] ||
                  data["Instructions 2"] ||
                  data["Instructions 3"]) && (
                  <div className="col-6">
                    <div className="airlinePartLabel">Instructions</div>
                    {data["Instructions 1"] && (
                      <div className="instructionsContainer">
                        {data["Instructions 1"].split(" ").map((item, i) => {
                          if (item.indexOf("http") > -1) {
                            item = (
                              <a href={item} target="_blank">
                                Click here
                              </a>
                            );
                          }
                          return <span key={i}>{item} </span>;
                        })}
                      </div>
                    )}

                    {data["Instructions 2"] && (
                      <div className="instructionsContainer">
                        {data["Instructions 2"].split(" ").map((item, i) => {
                          if (item.indexOf("http") > -1) {
                            item = (
                              <a href={item} target="_blank">
                                Click here
                              </a>
                            );
                          }
                          return <span key={i}>{item} </span>;
                        })}
                      </div>
                    )}

                    {data["Instructions 3"] && (
                      <div className="instructionsContainer">
                        {data["Instructions 3"].split(" ").map((item, i) => {
                          if (item.indexOf("http") > -1) {
                            item = (
                              <a href={item} target="_blank">
                                Click here
                              </a>
                            );
                          }
                          return <span key={i}>{item} </span>;
                        })}
                      </div>
                    )}
                  </div>
                )}
                {(data["Phone"] || data["Email"]) && (
                  <div className="col-6">
                    {data["Phone"] && (
                      <div>
                        <span className="airlinePartLabel">Phone:</span>
                        {data["Phone"]}
                      </div>
                    )}

                    {data["Email"] && (
                      <div>
                        <span className="airlinePartLabel">Email:</span>
                        <a href={"mailto:" + data["Email"]}>{data["Email"]}</a>
                      </div>
                    )}
                  </div>
                )}

                {data["Restrictions Link Title 1"] &&
                  data["Restrictions Link URL 1"] && (
                    <div className="col-6">
                      <div className="airlinePartLabel">Restrictions</div>
                      <div className="instructionsContainer">
                        <p>
                          {" "}
                          {data["Restrictions Text"] && (
                            <div>{data["Restrictions Text"]}</div>
                          )}
                          <a
                            target="_blank"
                            href={data["Restrictions Link URL 1"]}
                          >
                            {data["Restrictions Link Title 1"]}
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RefundRow;
