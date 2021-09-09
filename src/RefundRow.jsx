import React, { Component } from "react";

class RefundRow extends Component {
  constructor() {
    super();
    this.state = {
      toggle: false
    };

    this.clickToggle = this.clickToggle.bind(this);
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
      <div className={"airlinePartRow" + (this.state.toggle ? " active" : "")}>
        <div className="airlinePartRowTop">
          <div className="">
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
              {(data["Refund or Ticket Validity Information Last Updated"] && (
                <div className="ml-auto">
                  <span className="apUpdated">
                    <span>Latest Updates:</span>
                    {data["Refund or Ticket Validity Information Last Updated"]}
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
                  <div className="apProfile">
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
              "airlinePartRowInfo" + (this.state.toggle ? " show" : "")
            }
          >
            <div className="row">
              <div className="col">
                <div className="apSection">
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
                <div className="apSection">
                  <div className="apSectionTop">
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
                  <div className="apSectionBottom"></div>
                </div>
              </div>
            </div>

            <div className="apPaymentSection">
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
            </div>
          
            <div className="apSection apInfo">
              asdf
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
                  <a onClick={this.clickToggle}>View Additional Information</a>
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
    );
  }
}

export default RefundRow;
