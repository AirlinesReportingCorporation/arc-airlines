import React, { Component } from "react";

import * as moment from "moment";
import axios from "axios";
import XLSX from "xlsx";
import SimpleBar from "simplebar-react";
import stickybits from "stickybits";
import RefundRow from "./RefundRow.jsx";

function findIndexArr(arr, key, val) {
  if (arr) {
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      if (arr[i][key]) {
        if (arr[i][key].indexOf(val) > -1) {
          return element;
        }
      }
    }
  }
  return false;
}
class App extends Component {
  constructor() {
    super();
    this.state = {
      jsonData: [],
      doc141: [],
      refundData: [],
      filter: "ALL",
      filterTicket: "ALL",
      filterObj: [],
      refundFilter: [],
      sortType: "asc",
      jsonCardHeaders: [],
      jsonCardData: [],
      cardData: [],
      cardFilter: [],
      activePayments: [],
      completeLoad: false,
      dataRows: <div></div>
    };

    this.setFilter = this.setFilter.bind(this);
    this.setTicketFilter = this.setTicketFilter.bind(this);
    this.setSort = this.setSort.bind(this);
    this.toggleActivePayments = this.toggleActivePayments.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.completeLoadFunc = this.completeLoadFunc.bind(this);
    this.renderRows = this.renderRows.bind(this);
  }

  resetFilters() {
    this.setState({ activePayments: [] });
    var x = document.getElementsByClassName("cardType");
    for (var i = 0; i < x.length; i++) {
      x[i].checked = false;
    }

    this.setState({ filter: "ALL" });
    this.setState({ filterTicket: "ALL" });
    this.setSort("asc");
  }

  completeLoadFunc() {
    this.setState({ completeLoad: true });
  }

  setFilter(val) {
    this.setState({ filter: val });
  }

  toggleActivePayments(val) {
    var e = this;
    //find if in array
    var inArray = false;
    var inArrayIndex = 0;

    for (let i = 0; i < e.state.activePayments.length; i++) {
      const element = e.state.activePayments[i];

      //if in array get index
      if (val == element) {
        inArrayIndex = i;
        inArray = true;
      }
    }

    //if in array, splice from index
    if (inArray) {
      var currentPayments = e.state.activePayments;
      currentPayments.splice(inArrayIndex, 1);
      e.setState({
        activePayments: currentPayments
      });
    }
    //if not in array add to array
    else if (!inArray) {
      var currentPayments = e.state.activePayments;
      currentPayments.push(val);
      e.setState({ activePayments: currentPayments });
    }

    console.log(e.state.activePayments);
  }

  setTicketFilter(val) {
    this.setState({ filterTicket: val });
  }

  setSort(val) {
    var jsonData1 = this.state.jsonData;

    if (val == "asc") {
      jsonData1.sort(propComparator("Name", 1));
    } else if (val == "code") {
      jsonData1.sort(propComparator("Numeric Code", 1));
    } else if (val == "recent") {
      jsonData1.sort(
        propComparator("Refund or Ticket Validity Information Last Updated", 1)
      );
    }

    console.log(jsonData1);

    console.log(val);

    this.setState({ sortType: val });

    this.setState({ jsonData: jsonData1 });
  }

  componentDidMount() {
    var e = this;
    //https://www2.arccorp.com/globalassets/support--training/agency-support/credit-refund-acceptance/cc-acceptance-chart.xlsx
    const refundcall = new Promise((resolve, reject) => {
      axios({
        method: "get",
        url:
          "https://www2.arccorp.com/globalassets/refunds/refunds.xlsx?" +
          new Date().toLocaleString(),
        responseType: "arraybuffer"
      }).then(function(response) {
        console.log("===== Refunds Chart Loaded ===== ");
        var data = new Uint8Array(response.data);
        var workbook = XLSX.read(data, { type: "array" });

        var workbookData = workbook["Sheets"]["ParticipatingCarriers"];

        //console.log(workbookData);

        var json = XLSX.utils.sheet_to_json(workbookData, { raw: false });

        var refundTypes = [];

        e.setState({ jsonData: json });

        //traverseEntireWorkBook
        for (var key in workbookData) {
          //value in cell
          var val = workbookData[key].w;

          var str = key.match(/[a-z]+|[^a-z]+/gi);

          //console.log(val + ":" + str);
        }

        e.setSort("asc");
        resolve(true);
      });
    });

    const doc141call = new Promise((resolve, reject) => {
      axios({
        method: "get",
        url:
          "https://www2.arccorp.com/globalassets/forms/ops/doc141.xlsx?" +
          new Date().toLocaleString(),
        responseType: "arraybuffer"
      }).then(function(response) {
        console.log("===== Doc141 Chart Loaded ===== ");
        var data = new Uint8Array(response.data);
        var workbook = XLSX.read(data, { type: "array" });

        var workbookData = workbook["Sheets"]["ET Matrix"];

        //console.log(workbookData);

        var json = XLSX.utils.sheet_to_json(workbookData, {
          raw: false,
          range: 1
        });

        e.setState({ doc141: json });
        resolve(true);
      });
    });

    const cchartcall = new Promise((resolve, reject) => {
      axios({
        method: "get",
        url:
          "https://www2.arccorp.com/globalassets/support--training/agency-support/credit-card-acceptance/cchart.xlsx?" +
          new Date().toLocaleString(),
        responseType: "arraybuffer"
      }).then(function(response) {
        console.log("===== CC Chart Loaded =====");
        var data = new Uint8Array(response.data);
        var workbook = XLSX.read(data, { type: "array" });

        var workbookData = workbook["Sheets"]["CC Acceptance Chart"];

        var json = XLSX.utils.sheet_to_json(workbookData);

        e.setState({ jsonCardData: json });
        resolve(true);
      });
    });

    Promise.all([refundcall, doc141call, cchartcall])
      .then(values => {
        e.completeLoadFunc();
      })
      .catch(error => {
        console.error(error.message);
      });

    stickybits(".product-sticky-container");
  }

  renderRows() {
    var e = this;
    if (e.state.completeLoad) {
      var refundRowHTML = this.state.jsonData.map((data, i) => {
        var comboTruth = false;
        var refundShow = false;
        var ticketShow = false;

        var className = "hide";

        var filter = this.state.filter;
        var filterTicket = this.state.filterTicket;

        if (filter == "ALL") {
          refundShow = true;
        } else if (data["Refunds"].indexOf(this.state.filter) > -1) {
          refundShow = true;
        }

        if (filterTicket == "ALL") {
          ticketShow = true;
        } else if (
          filterTicket == "13 Months" &&
          data["Ticket Validity"] == "13 Months"
        ) {
          ticketShow = true;
        } else if (
          filterTicket == "> 13 Months" &&
          data["Ticket Validity"] != "13 Months"
        ) {
          ticketShow = true;
        }

        className = refundShow && ticketShow ? "show" : "hide";

        var cardRow = "";
        //get cardData row that matches this

        for (let index = 0; index < e.state.jsonCardData.length; index++) {
          if (
            e.state.jsonCardData[index]["Airline Code"].indexOf(
              data["Numeric Code"]
            ) > 0
          ) {
            cardRow = e.state.jsonCardData[index];
          }
        }

        var doc141Row = findIndexArr(
          e.state.doc141,
          " Numeric",
          data["Numeric Code"]
        );

        var paymentFilterData = e.state.activePayments
          ? e.state.activePayments
          : "all";

        return (
          <div key={i} className={"col-lg-12 " + className}>
            <RefundRow
              data={data}
              cardData={cardRow}
              doc141Data={doc141Row}
              paymentFilterList={paymentFilterData}
              filters="filter"
            />
          </div>
        );
      });

      return refundRowHTML;
    } else {
      return (
        <div className={"loading"}>
          <div className="loading-icon">
            <i className="fas fa-circle-notch fa-spin"></i>
          </div>
        </div>
      );
    }
  }

  render() {
    var filter = this.state.filter;
    var cardData = this.state.jsonCardData;
    var e = this;

    return (
      <div className="airlinePartPage">
        <div className="product-sticky-container" style={{ zIndex: "12" }}>
          <div className="product-sticky-inner">
            <div className="product-sticky-nav">
              <div className="product-sticky-brand d-flex align-items-center">
                <div
                  className="product-sticky-title"
                  style={{ lineHeight: "20px" }}
                >
                  Participating Airlines
                </div>
              </div>
              <div className="product-sticky-links d-flex align-items-center">
                <a href="#overview" className="product-sticky-link">
                  Download Files
                </a>
                <a href="#resources" className="product-sticky-link">
                  Resources
                </a>
              </div>
              <div className="product-sticky-menu d-flex align-items-center">
                <a
                  href="https://www2.arccorp.com/about-us/contact-us/"
                  className="product-sticky-link-right"
                >
                  Contact Us <i className="fas fa-chevron-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="airlinePartJumboContainer">
          <div className="airlinePartJumbo">
            <h1>Participating Airline Information</h1>
            <p>
              <strong>Refunds & Processing Validity</strong>: ARC aims to make
              it as easy as possible for travel agencies and airlines to manage
              refunds. Use the filters below to view airline refund policies and
              processing validity. (Processing validity refers to the period of
              time that refunds and exchanges can be processed through ARC’s
              settlement system, IAR. Before processing any refund or exchange,
              agents should review the ticket’s fare rules, as well as any
              ticket validity extension that may have been offered by the
              airline.)
            </p>
            <p>
              <strong>NDC/Direct Connect</strong>: Use the filters below to view
              airlines participating in NDC/Direct Connect, which gives agencies
              direct access to fares.
            </p>
            <p style={{ marginBottom: "45px" }}>
              <strong>Accepted Payment</strong>: Each airline determines which
              forms of payment to accept and then works with the Global
              Distribution Systems and ARC to support those payments. If you
              have any questions about payment acceptance through ARC, please
              contact the Payment Services team at{" "}
              <a href="mailto:CreditCardServices@arccorp.com">
                CreditCardServices@arccorp.com
              </a>
              .
            </p>

            <p style={{ lineHeight: "16px" }}>
              <small>
                <strong>Please note:</strong> This page is updated based on
                information ARC receives from the participating airlines. It may
                not be comprehensive and is subject to change. For specific
                airline policies and guidelines, please visit the airline’s
                website or contact the airline directly. ARC gives no guarantee
                that the content behind hyperlinks is complete, accurate, error-
                or virus-free, or up to date. ARC recommends travel agents take
                care to read all information published by the airline and all
                rules for the fares being booked and/or ticketed.
              </small>
            </p>
          </div>
        </div>

        <div className="airlinePartFilter">
          <div className="airlinePartFilterTop">
            <div className="row">
              <div className="col-lg-2">
                <div className="airlinePartLabel">Sort By</div>
                <div className="airlinePartFilterGroup">
                  <div
                    onClick={this.setSort.bind(this, "asc")}
                    className={
                      "airlinePartFilterItem" +
                      (this.state.sortType == "asc" ? " active" : "")
                    }
                  >
                    <i className="fas fa-caret-right"></i>
                    Airline Name
                  </div>
                  <div
                    onClick={this.setSort.bind(this, "code")}
                    className={
                      "airlinePartFilterItem" +
                      (this.state.sortType == "code" ? " active" : "")
                    }
                  >
                    <i className="fas fa-caret-right"></i>
                    Airline Code
                  </div>
                  <div
                    onClick={this.setSort.bind(this, "recent")}
                    className={
                      "airlinePartFilterItem" +
                      (this.state.sortType == "recent" ? " active" : "")
                    }
                  >
                    <i className="fas fa-caret-right"></i>
                    Recent Changes
                  </div>
                </div>
              </div>
              <div className="col-lg-2">
                <div className="airlinePartLabel">Refunds</div>
                <div className="airlinePartFilterGroup">
                  <div
                    onClick={this.setFilter.bind(this, "ALL")}
                    className={
                      "airlinePartFilterItem" +
                      (this.state.filter == "ALL" ? " active" : "")
                    }
                  >
                    <i className="fas fa-caret-right"></i>
                    All
                  </div>
                  <div
                    onClick={this.setFilter.bind(this, "Via GDS")}
                    className={
                      "airlinePartFilterItem" +
                      (this.state.filter == "Via GDS" ? " active" : "")
                    }
                  >
                    <i className="fas fa-caret-right"></i>
                    Via GDS
                  </div>
                  <div
                    onClick={this.setFilter.bind(this, "Via GDS (Reinstated)")}
                    className={
                      "airlinePartFilterItem" +
                      (this.state.filter == "Via GDS (Reinstated)"
                        ? " active"
                        : "")
                    }
                  >
                    <i className="fas fa-caret-right"></i>
                    Via GDS (Reinstated)
                  </div>
                  <div
                    onClick={this.setFilter.bind(this, "Managing Directly")}
                    className={
                      "airlinePartFilterItem" +
                      (this.state.filter.indexOf("Managing Directly") > -1
                        ? " active"
                        : "")
                    }
                  >
                    <i className="fas fa-caret-right"></i>
                    Managing Directly
                  </div>
                </div>
              </div>
              <div className="col-lg-2">
                <div className="airlinePartLabel">Processing Validty</div>
                <div className="airlinePartFilterGroup">
                  <div
                    onClick={this.setTicketFilter.bind(this, "ALL")}
                    className={
                      "airlinePartFilterItem" +
                      (this.state.filterTicket == "ALL" ? " active" : "")
                    }
                  >
                    <i className="fas fa-caret-right"></i>
                    All
                  </div>
                  <div
                    onClick={this.setTicketFilter.bind(this, "13 Months")}
                    className={
                      "airlinePartFilterItem" +
                      (this.state.filterTicket == "13 Months" ? " active" : "")
                    }
                  >
                    <i className="fas fa-caret-right"></i>
                    13 Months
                  </div>
                  <div
                    onClick={this.setTicketFilter.bind(this, "> 13 Months")}
                    className={
                      "airlinePartFilterItem" +
                      (this.state.filterTicket == "> 13 Months"
                        ? " active"
                        : "")
                    }
                  >
                    <i className="fas fa-caret-right"></i>> 13 Months
                  </div>
                </div>
              </div>
              <div className="col-lg-2">
                <div className="airlinePartLabel">NDC/Direct Connect</div>
                <div className="airlinePartFilterGroup">
                  <div className="airlinePartFilterItem active">
                    <i className="fas fa-caret-right"></i> All
                  </div>
                  <div className="airlinePartFilterItem">
                    <i className="fas fa-caret-right"></i> Yes
                  </div>
                  <div className="airlinePartFilterItem">
                    <i className="fas fa-caret-right"></i> No
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="airlinePartLabel" style={{ marginLeft: "0" }}>
                  Accepted Payments
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="airlinePartFilterItem">
                      <label htmlFor="card-0">
                        <input
                          className="cardType"
                          name="card-0"
                          id="card-0"
                          type="checkbox"
                          onClick={this.toggleActivePayments.bind(this, "AX")}
                        />
                        American Express (AX)
                      </label>
                    </div>
                    <div className="airlinePartFilterItem">
                      <label htmlFor="card-2">
                        <input
                          className="cardType"
                          name="card-2"
                          id="card-2"
                          type="checkbox"
                          onClick={this.toggleActivePayments.bind(this, "CA")}
                        />
                        Mastercard (CA)
                      </label>
                    </div>
                    <div className="airlinePartFilterItem">
                      <label htmlFor="card-1">
                        <input
                          className="cardType"
                          name="card-1"
                          id="card-1"
                          type="checkbox"
                          onClick={this.toggleActivePayments.bind(this, "UATP")}
                        />
                        UATP (TP)
                      </label>
                    </div>
                    <div className="airlinePartFilterItem">
                      <label htmlFor="card-3">
                        <input
                          className="cardType"
                          name="card-3"
                          id="card-3"
                          type="checkbox"
                          onClick={this.toggleActivePayments.bind(this, "VI")}
                        />
                        Visa (VI)
                      </label>
                    </div>
                    <div className="airlinePartFilterItem">
                      <label htmlFor="card-4">
                        <input
                          className="cardType"
                          name="card-4"
                          id="card-4"
                          type="checkbox"
                          onClick={this.toggleActivePayments.bind(this, "DC")}
                        />
                        Diners Club Int'l (DC)
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="airlinePartFilterItem">
                      <label htmlFor="card-5">
                        <input
                          className="cardType"
                          name="card-5"
                          id="card-5"
                          type="checkbox"
                          onClick={this.toggleActivePayments.bind(this, "DS")}
                        />
                        Discover (DS)
                      </label>
                    </div>
                    <div className="airlinePartFilterItem">
                      <label htmlFor="card-6">
                        <input
                          className="cardType"
                          name="card-6"
                          id="card-6"
                          type="checkbox"
                          onClick={this.toggleActivePayments.bind(this, "JCB")}
                        />
                        JCB (JC)
                      </label>
                    </div>
                    <div className="airlinePartFilterItem">
                      <label htmlFor="card-7">
                        <input
                          className="cardType"
                          name="card-7"
                          id="card-7"
                          type="checkbox"
                          onClick={this.toggleActivePayments.bind(
                            this,
                            "PayPal"
                          )}
                        />
                        PayPal (TP)
                      </label>
                    </div>
                    <div className="airlinePartFilterItem">
                      <label htmlFor="card-8">
                        <input
                          className="cardType"
                          name="card-8"
                          id="card-8"
                          type="checkbox"
                          onClick={this.toggleActivePayments.bind(
                            this,
                            "UnionPay"
                          )}
                        />
                        UnionPay (UP)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="airlinePartFilterBottom"
            style={{ paddingBottom: "0" }}
          >
            <div className="apSearch">
              <input type="text" placeholder="Search Airlines" />
              <div className="icon-search"></div>
            </div>

            <div className="apReset" onClick={this.resetFilters}>
              <i className="far fa-window-close"></i>
              Reset All
            </div>
          </div>
        </div>

        <div className="airlinePartsResultsTitle">Search Results</div>

        <div className={"loading" + this.state.completeLoad ? "hide" : "show"}>
          <div className="loading-icon">
            <i className="fas fa-circle-notch fa-spin"></i>
          </div>
        </div>

        <div
          className={
            "airlinePartsTable" + this.state.completeLoad ? "show" : "hide"
          }
        >
          <div
            className=""
            style={{ maxWidth: "1170px", margin: "0 auto", overflow: "hidden" }}
          >
            <div className="row no-gutters">{this.renderRows()}</div>
          </div>
        </div>

        <div id="resources" className="box-icon text-center">
          <div className="container">
            <div className="row">
              <div className="col-lg-4">
                <div className="box-icon-item">
                  <img
                    src="https://www2.arccorp.com/globalassets/products--participation/arc-travel-demand/atd-product-sheet.jpg"
                    alt=""
                  />
                  <div className="box-icon-header">Lorem Ipsum</div>
                  <div className="box-icon-copy">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Dolore fuga vero porro numquam voluptate voluptatum iste,
                    beatae quisquam distinctio tempora corporis, possimus rerum
                    libero asperiores explicabo mollitia est voluptates sit!
                  </div>
                  <a target="_blank" href="#" className="link-download">
                    Download
                    <i className="fas fa-chevron-down"></i>
                  </a>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="box-icon-item">
                  <img
                    src="https://www2.arccorp.com/globalassets/products--participation/arc-travel-demand/atd-product-sheet.jpg"
                    alt=""
                  />
                  <div className="box-icon-header">Lorem Ipsum</div>
                  <div className="box-icon-copy">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Dolore fuga vero porro numquam voluptate voluptatum iste,
                    beatae quisquam distinctio tempora corporis, possimus rerum
                    libero asperiores explicabo mollitia est voluptates sit!
                  </div>
                  <a target="_blank" href="#" className="link-download">
                    Download
                    <i className="fas fa-chevron-down"></i>
                  </a>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="box-icon-item">
                  <img
                    src="https://www2.arccorp.com/globalassets/products--participation/arc-travel-demand/atd-product-sheet.jpg"
                    alt=""
                  />
                  <div className="box-icon-header">Lorem Ipsum</div>
                  <div className="box-icon-copy">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Dolore fuga vero porro numquam voluptate voluptatum iste,
                    beatae quisquam distinctio tempora corporis, possimus rerum
                    libero asperiores explicabo mollitia est voluptates sit!
                  </div>
                  <a target="_blank" href="#" className="link-download">
                    Download
                    <i className="fas fa-chevron-down"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function propComparator(val, inverse) {
  return function(a, b) {
    if (val == "Name" || val == "Numeric Code") {
      var x = a[val].toString().toLowerCase();
      var y = b[val].toString().toLowerCase();

      if (x < y) {
        return -1 * inverse;
      }
      if (x > y) {
        return 1 * inverse;
      }
    }

    if (val == "Refund or Ticket Validity Information Last Updated") {
      var x = a[val]
        ? parseInt(moment(a[val].replace(/-/g, " ")).format("YYYYMMDD"))
        : 1;
      var y = b[val]
        ? parseInt(moment(b[val].replace(/-/g, " ")).format("YYYYMMDD"))
        : 1;

      if (x < y) {
        console.log("before");
        return 1;
      }
      if (x > y) {
        console.log("after");
        return -1;
      }
    }

    return 0;
  };
}

export default App;
