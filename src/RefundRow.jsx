import React, { Component, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";

function findVal(arr, val) {
  if (arr) {
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      if (element.indexOf(val) > -1) {
        return true;
      }
    }
  }
  return false;
}

function urlify(text) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function(url) {
    return '<a href="' + url + '">' + url + "</a>";
  });
}

function findIndex(arr, key, val) {
  if (arr) {
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i][key];
      //console.log(element);
      if (element.indexOf(val) > -1) {
        return i;
      }
    }
  }
  return -1;
}

class RefundRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false,
      modalShow: false,
      filterActive: true,
    };

    this.clickToggle = this.clickToggle.bind(this);
    this.setModalShow = this.setModalShow.bind(this);
  }

  setModalShow(e) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
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

  componentWillMount() {}

  render() {
    var data = this.props.data;
    var cardData = data;
    var doc141Data = data;
    var profileData = data;
    var fullProfileData = data;

    var payments = "";

    if (data["Accepted Payments"]) {
      payments = data["Accepted Payments"].split("\n");
    }

    var paymentFiltered = 0;
    var paymentHide = true;

    var ndcAirline = false;

    if (data["NDC/Direct Connect"]) {
      if (data["NDC/Direct Connect"] === "Y") {
        ndcAirline = true;
      }
    }

    if (this.props.paymentFilterList == "all") {
      paymentHide = false;
    } else if (payments) {
      for (let i = 0; i < payments.length; i++) {
        const all = payments[i];
        for (let j = 0; j < this.props.paymentFilterList.length; j++) {
          const filtered = this.props.paymentFilterList[j];
          if (all.indexOf(filtered) > -1) {
            paymentFiltered++;
          }
        }
      }
      if (this.props.paymentFilterList.length == paymentFiltered) {
        paymentHide = false;
      } else {
        paymentHide = true;
      }
    }

    var refundClass = "refundRegular";

    if (data["Refunds"]) {
      if (
        data["Refunds"].indexOf("Managing Directly") > -1 ||
        data["Refund Instructions"] ||
        data["Instructions 2"] ||
        data["Instructions 3"]
      ) {
        refundClass = "refundDownload";
      }
    }

    var restrictionsTitle = data["Restrictions"];

    //if there's a link but no title
    if (
      (data["Restrictions"] == "" || data["Restrictions"] == undefined) &&
      data["Restrictions Link"] !== "" &&
      data["Restrictions Link"] !== undefined
    ) {
      retrictionsTitle = "Link";
    }

    return (
      <div>
        <div>
          <div
            className={
              "airlinePartRow" +
              (this.state.toggle ? " active" : "") +
              (paymentHide ? " hide" : " ")
            }
          >
            <div className="airlinePartRowTop">
              <div
                className="airlinePartRowStart container-fluid"
                onClick={this.clickToggle}
              >
                <div className="row align-items-center">
                  <div className="col-11">
                    <div className="d-flex flex-column flex-lg-row">
                      <div className="d-flex align-items-center">
                        <div className="apDesignator">{data[" Code"]}</div>
                        <div className="apCode">{data[" Numeric"]}</div>
                      </div>
                      <div className="">
                        <div className="airlinePartName">
                          {data["Airline Name"]}
                        </div>
                      </div>
                      {(data["Latest Updates"] && (
                        <div className="ml-auto apUpdated d-flex align-items-center">
                          <span>Latest Updates: </span>
                          {data["Latest Updates"]}
                        </div>
                      )) || (
                        <div className="ml-auto d-flex align-items-center">
                          <div className="apUpdated">
                            <span>Latest Updates: </span>November 1, 2021
                          </div>
                        </div>
                      )}
                      <div
                        onClick={this.setModalShow}
                        className="apProfile d-flex align-items-center"
                      >
                        Airline Profile <i className="fas fa-chevron-right"></i>
                        <MyVerticallyCenteredModal
                          show={this.state.modalShow}
                          onHide={this.setModalShow}
                          data={profileData}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-1">
                    <div>
                      <div className="apExpand">
                        <div
                          className={
                            this.state.toggle ? "ap-close" : " ap-open"
                          }
                        ></div>
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
                          {(data["Last Updated"] && (
                            <div className="mr-1">
                              <span className="apUpdated">
                                <span>Updated:</span> {data["Last Updated"]}
                              </span>
                            </div>
                          )) || (
                            <div className="mr-1">
                              <div className="apUpdated">
                                <span>Updated:</span> November 1, 2021
                              </div>
                            </div>
                          )}

                          <div className="ml-auto">
                            <div className="airlineTooltip">
                              <img
                                src="https://www2.arccorp.com/globalassets/about-us/our-data/redesign/tooltip.png"
                                alt="Help"
                              />
                              <div className="airlineTooltipText">
                                Refunds are either managed via the GDS or
                                directly.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="apSectionBottom">
                        <div className="row">
                          <div className="col-lg-5">
                            <div className="apDataLabel">Phone</div>
                            <div className="apDataText">
                              {data["Phone"] ? data["Phone"] : "N/A"}
                            </div>
                          </div>

                          <div className="col-lg-7">
                            <div className="apRefundsBtn">
                              {data["Refunds"]}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-12">
                            <div>
                              <div className="apDataLabel">Email</div>
                              {data["Email"] ? (
                                <a href={"mailto:" + data["Email"]}>
                                  {data["Email"]}{" "}
                                </a>
                              ) : (
                                <div className="apDataText">N/A</div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          {data["Refund Instructions"] ||
                          data["Instructions 2"] ||
                          data["Instructions 3"] ? (
                            <div className="col-lg-12">
                              <div className="apDataLabel">Instructions</div>
                              {data["Refund Instructions"] && (
                                <div className="apDataText">
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: urlify(
                                        data["Refund Instructions"]
                                      ),
                                    }}
                                  ></span>
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
                          ) : (
                            <div className="col-lg-12">
                              <div className="apDataLabel">Instructions</div>
                              <div className="apDataText">N/A</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="apSection apSectionValidity">
                      <div className="apSectionTop">
                        <div className="d-flex align-items-center">
                          <h3>Processing Validity</h3>

                          <div className="ml-auto">
                            <div className="airlineTooltip">
                              <img
                                src="https://www2.arccorp.com/globalassets/about-us/our-data/redesign/tooltip.png"
                                alt="Help"
                              />
                              <div className="airlineTooltipText">
                                Processing validity refers to the period that
                                refunds and exchanges can be processed through
                                ARC’s settlement system, IAR. Before processing
                                any refund or exchange, agents should review the
                                ticket’s fare rules, as well as any ticket
                                validity extension that may have been offered by
                                the airline.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="apSectionBottom">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="d-flex align-items-center">
                              <div className="apProcessing">
                                {data["Processing Validity"] &&
                                  data["Processing Validity"].replace(
                                    "Months",
                                    ""
                                  )
                                //alldata
                                //data["Ticket Validity"].replace("Months", "")
                                }
                              </div>
                              <div className="apProcessingText">Months</div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="apDataLabel">Restriction</div>
                            {data["Restrictions"] &&
                            data["Restrictions Link"] ? (
                              <div className="apDataText">
                                <p>
                                  {" "}
                                  {data["Restrictions Text"] && (
                                    <div>
                                      {data["Restrictions Link"] != "" &&
                                      data["Restrictions Text"].indexOf("N/A") >
                                        -1
                                        ? "Link"
                                        : data["Restrictions Text"]}
                                    </div>
                                  )}
                                  <a
                                    target="_blank"
                                    href={data["Restrictions Link"]}
                                  >
                                    {data["Restrictions Link"] != "" &&
                                    data["Restrictions"].indexOf("N/A") > -1
                                      ? "Link"
                                      : data["Restrictions"]}
                                  </a>
                                </p>
                              </div>
                            ) : (
                              <div className="apDataText">N/A</div>
                            )}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-12">
                            {data["Last Updated2"] && data["Last Updated2"] ? (
                              <div className="apDataLabel">
                                <p>Updated {data["Last Updated2"]}</p>
                              </div>
                            ) : (
                              <div className="apDataLabel">
                                Updated November 1, 2021
                              </div>
                            )}
                          </div>
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
                            <div className="airlineTooltip">
                              <img
                                src="https://www2.arccorp.com/globalassets/about-us/our-data/redesign/tooltip.png"
                                alt="Help"
                              />
                              <div className="airlineTooltipText">
                                Electronic Data Interchange for Administration,
                                Commerce and Transport (EDIFACT) standards
                                reflect the messaging capabilities of each
                                airline.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="apSectionBottom">
                        <div className="row apEdiBorder">
                          <div className="col-lg-6">
                            <div className="apEdiItem">
                              <div
                                className={
                                  doc141Data["1IAR \r\nET \r\nVoid"] === "Y"
                                    ? "apEdiCir"
                                    : "apEdiCirRed"
                                }
                              ></div>
                              <div className="apEdiLabel">
                                <sup>1</sup>IAR ET VOID
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="apEdiItem">
                              <div
                                className={
                                  doc141Data["1IAR EMD\r\nVoid"] === "Y"
                                    ? "apEdiCir"
                                    : "apEdiCirRed"
                                }
                              ></div>
                              <div className="apEdiLabel">
                                <sup>1</sup>IAR EMD VOID
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row apEdiBorder">
                          <div className="col-lg-6">
                            <div className="apEdiItem">
                              <div
                                className={
                                  doc141Data["1IAR \r\nET \r\nRefund"] === "Y"
                                    ? "apEdiCir"
                                    : "apEdiCirRed"
                                }
                              ></div>
                              <div className="apEdiLabel">
                                <sup>1</sup>IAR ET Refund
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="apEdiItem">
                              <div
                                className={
                                  doc141Data["1IAR EMD\r\nRefund"] === "Y"
                                    ? "apEdiCir"
                                    : "apEdiCirRed"
                                }
                              ></div>
                              <div className="apEdiLabel">
                                <sup>1</sup>IAR EMD Refund
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row apEdiBorder">
                          <div className="col-lg-6">
                            <div className="apEdiItem">
                              <div
                                className={
                                  doc141Data[" 1IAR ET\r\nCancel Refund"] ===
                                  "Y"
                                    ? "apEdiCir"
                                    : "apEdiCirRed"
                                }
                              ></div>
                              <div className="apEdiLabel">
                                <sup>1</sup>IAR ET Cancel Refund
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="apEdiItem">
                              <div
                                className={
                                  doc141Data[
                                    " \r\n1IAR EMD \r\nCancel Refund"
                                  ] === "Y"
                                    ? "apEdiCir"
                                    : "apEdiCirRed"
                                }
                              ></div>
                              <div className="apEdiLabel">
                                <sup>1</sup>IAR EMD Cancel Refund
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="apEdiItem">
                              <div
                                className={
                                  doc141Data["2Accepts Automated MCOs?"] === "N"
                                    ? "apEdiCirRed"
                                    : "apEdiCir"
                                }
                              ></div>
                              <div className="apEdiLabel">
                                Accepts Automated MCOs
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="apEdiSup">
                          <sup>1</sup>An Electronic Settlement Authorization
                          Code (ESAC) is provided by all ticketing Airlines and
                          is required for voids and refunds.
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
                        <div className="airlineTooltip">
                          <img
                            src="https://www2.arccorp.com/globalassets/about-us/our-data/redesign/tooltip.png"
                            alt="Help"
                          />
                          <div className="airlineTooltipText">
                            Payments accepted by the airline are shown in bright
                            green text. Payment options in gray are not
                            accepted. Each airline determines which forms of
                            payment to accept and then works with the Global
                            Distribution Systems and ARC to support those
                            payments. If you have any questions about payment
                            acceptance through ARC, please contact the Payment
                            Services team at{" "}
                            <a href="mailto:CreditCardServices@arccorp.com">
                              CreditCardServices@arccorp.com
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="apSectionBottom">
                    <div className="apPaymentLabels">
                      <div className="apPaymentLabel active">Cash</div>
                      <div
                        className={
                          findVal(payments, "AX")
                            ? "apPaymentLabel active"
                            : "apPaymentLabel"
                        }
                      >
                        American Express (AX)
                      </div>
                      <div
                        className={
                          findVal(payments, "DC")
                            ? "apPaymentLabel active"
                            : "apPaymentLabel"
                        }
                      >
                        Diners Club Int'l (DC)
                      </div>
                      <div
                        className={
                          findVal(payments, "DS")
                            ? "apPaymentLabel active"
                            : "apPaymentLabel"
                        }
                      >
                        Discover Card (DS)
                      </div>
                      <div
                        className={
                          findVal(payments, "JC")
                            ? "apPaymentLabel active"
                            : "apPaymentLabel"
                        }
                      >
                        JCB (JC)
                      </div>
                      <div
                        className={
                          findVal(payments, "CA")
                            ? "apPaymentLabel active"
                            : "apPaymentLabel"
                        }
                      >
                        Mastercard (CA)
                      </div>
                      <div
                        className={
                          findVal(payments, "PayPal")
                            ? "apPaymentLabel active"
                            : "apPaymentLabel"
                        }
                      >
                        PayPal (TP)
                      </div>
                      <div
                        className={
                          findVal(payments, "UATP")
                            ? "apPaymentLabel active"
                            : "apPaymentLabel"
                        }
                      >
                        UATP (TP)
                      </div>
                      <div
                        className={
                          findVal(payments, "UnionPay")
                            ? "apPaymentLabel active"
                            : "apPaymentLabel"
                        }
                      >
                        UnionPay INT'L (UP)
                      </div>
                      <div
                        className={
                          findVal(payments, "VI")
                            ? "apPaymentLabel active"
                            : "apPaymentLabel"
                        }
                      >
                        VISA (VI)
                      </div>
                      <div
                        className={
                          findVal(payments, "Alipay")
                            ? "apPaymentLabel active"
                            : "apPaymentLabel"
                        }
                      >
                        Alipay (TP)
                      </div>
                      <div
                        className={
                          findVal(payments, "Uplift")
                            ? "apPaymentLabel active"
                            : "apPaymentLabel"
                        }
                      >
                        Uplift (TP)
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4">
                        <div className="apDataLabel">Restriction</div>
                        {data["Restriction"] ? (
                          <div className="apDataText">
                            {data["Restriction"]}
                          </div>
                        ) : (
                          <div className="apDataText">N/A</div>
                        )}
                      </div>

                      <div className="col-lg-8">
                        <div className="apDataLabel">Exception</div>
                        {typeof cardData["Exception"] != "undefined" ? (
                          <div className="apDataText">
                            {cardData["Exception"]}
                          </div>
                        ) : (
                          <div className="apDataText">N/A</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="apInfo">
                  <div className="apInfoContainer">
                    <div className="row align-items-center">
                      {data["Appointment Type"] && (
                        <div className="col-4 col-lg-4">
                          <div className="d-flex align-items-center justify-center">
                            <img
                              src="https://www2.arccorp.com/globalassets/refunds/ap-appointment.png"
                              alt=""
                              className="apInfoIcon"
                            />
                            <div className="apInfoLabel">
                              {data["Appointment Type"]}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="col-4 col-lg-4">
                        <div className="d-flex align-items-center justify-center">
                          {ndcAirline ? (
                            <img
                              src="https://www2.arccorp.com/globalassets/refunds/ap-check-icon.png"
                              alt=""
                              className="apInfoIcon apInfoCheck"
                            />
                          ) : (
                            <img
                              src="https://www2.arccorp.com/globalassets/refunds/ap-close-icon.png"
                              alt=""
                              className="apInfoIcon apInfoClose"
                            />
                          )}

                          <div
                            className={
                              +ndcAirline
                                ? "apInfoLabel apNDClabel active"
                                : "apInfoLabel apNDClabel"
                            }
                          >
                            NDC / Direct Connect
                          </div>
                        </div>
                      </div>
                      <div className="col-4 col-lg-4">
                        {fullProfileData["Airline Policy"] ? (
                          <div className="d-flex align-items-center justify-left">
                            <img
                              src="https://www2.arccorp.com/globalassets/refunds/ap-info-icon.png"
                              alt=""
                              className="apInfoIcon apInfoPolicy"
                            />
                            <a
                              href={fullProfileData["Airline Policy"]}
                              target="_blank"
                              className="apInfoLabel apInfoLink"
                            >
                              Airline Policy{" "}
                              <i className="fas fa-chevron-right"></i>
                            </a>
                          </div>
                        ) : (
                          <div className="d-flex align-items-center justify-left">
                            <img
                              src="https://www2.arccorp.com/globalassets/refunds/ap-info-icon.png"
                              alt=""
                              className="apInfoIcon apInfoPolicy gray"
                            />
                            <span className="apInfoLabel apInfoLink gray">
                              Airline Policy
                            </span>
                          </div>
                        )}
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
                    <span className="airlinePartLabel">
                      Processing Validity:
                    </span>

                    {(data["Restrictions"] || data["Restrictions Link"]) && (
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
                  {(data["Refund Instructions"] ||
                    data["Instructions 2"] ||
                    data["Instructions 3"]) && (
                    <div className="col-6">
                      <div className="airlinePartLabel">Instructions</div>
                      {data["Refund Instructions"] && (
                        <div className="instructionsContainer">
                          {data["Refund Instructions"]
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
                          <a href={"mailto:" + data["Email"]}>
                            {data["Email"]}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {data["Restrictions"] && data["Restrictions Link"] && (
                    <div className="col-6">
                      <div className="airlinePartLabel">Restrictions</div>
                      <div className="instructionsContainer">
                        <p>
                          {" "}
                          {data["Restrictions Text"] && (
                            <div>
                              {data["Restrictions Link"] != "" &&
                              data["Restrictions Text"] == "N/A"
                                ? "Link"
                                : data["Restrictions Text"]}
                            </div>
                          )}
                          <a target="_blank" href={data["Restrictions Link"]}>
                            {data["Restrictions"]}
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
      </div>
    );
  }
}

function MyVerticallyCenteredModal(props) {
  var profData = props.data;

  console.log(profData["Additional Instructions"]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.data && <div>{profData["Airline Name"]}</div>}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row modal-row">
          <div className="col-md-6">
            <div className="text-right">
              <strong>Airline Code/Number</strong>
            </div>
          </div>
          <div className="col-md-6">
            {props.data && (
              <div>{profData[" Code"] + "/" + profData[" Numeric"]}</div>
            )}
          </div>
        </div>
        <div className="row modal-row">
          <div className="col-md-6">
            <div className="text-right">
              <strong>Appointment Type</strong>
            </div>
          </div>
          <div className="col-md-6">
            {props.data && <div>{profData["Appointment Type"]}</div>}
          </div>
        </div>
        <div className="row modal-row">
          <div className="col-md-6">
            <div className="text-right">
              <strong>Attention</strong>
            </div>
          </div>
          <div className="col-md-6">
            {props.data && <div>{profData["Attention"]}</div>}
          </div>
        </div>
        <div className="row modal-row">
          <div className="col-md-6">
            <div className="text-right">
              <strong>Address</strong>
            </div>
          </div>
          <div className="col-md-6">
            {props.data && (
              <div
                dangerouslySetInnerHTML={{
                  __html: profData["Address"],
                }}
              ></div>
            )}
          </div>
        </div>
        <div className="row modal-row">
          <div className="col-md-6">
            <div className="text-right">
              <strong>Email</strong>
            </div>
          </div>
          <div className="col-md-6">
            {props.data && (
              <a href={"mailto:" + profData["Email"]}>{profData["Email"]}</a>
            )}
          </div>
        </div>
        <div className="row modal-row">
          <div className="col-md-6">
            <div className="text-right">
              <strong>Website</strong>
            </div>
          </div>
          <div className="col-md-6">
            {props.data && (
              <a href={profData["Website"]} target="_blank">
                {profData["Website"]}
              </a>
            )}
          </div>
        </div>
        {props.data && profData["Additional Instructions"] ? (
          <div className="row modal-row modal-row-instructions">
            <div className="col-md-6">
              <div className="text-right">
                <strong>Additional Airline Instructions</strong>
              </div>
            </div>
            <div className="col-md-6">
              <div className="modal-instructions-body">
                <div
                  dangerouslySetInnerHTML={{
                    __html: profData["Additional Instructions"],
                  }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default RefundRow;
