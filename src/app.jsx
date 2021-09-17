import React, { Component } from "react";

import * as moment from "moment";
import axios from "axios";
import XLSX from "xlsx";
import SimpleBar from "simplebar-react";
import stickybits from "stickybits";

import RefundRow from "./RefundRow.jsx";

class App extends Component {
  constructor() {
    super();
    this.state = {
      jsonHeaders: [],
      jsonData: [],
      refundData: [],
      filter: "ALL",
      filterTicket: "ALL",
      filterObj: [],
      refundFilter: [],
      refundList: [],
      sortType: "asc",
      jsonCardHeaders: [],
      jsonCardData: [],
      cardData: [],
      cardFilter: [],
      cardList: []
    };
    this.setFilter = this.setFilter.bind(this);
    this.setTicketFilter = this.setTicketFilter.bind(this);
    this.setSort = this.setSort.bind(this);
  }

  setFilter(val) {
    this.setState({ filter: val });
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
      var jsonHeadersTemp = [];

      e.setState({ jsonData: json });

      //traverseEntireWorkBook
      for (var key in workbookData) {
        //value in cell
        var val = workbookData[key].w;

        var str = key.match(/[a-z]+|[^a-z]+/gi);

        if (str[1] === "1") {
          jsonHeadersTemp.push(val);
          //e.state.jsonHeaders[key[0]] = val; ///.replace(/ /g,"_").replace(":", "");
        }
        //console.log(val + ":" + str);
      }

      e.setState({ refundList: refundTypes });
      e.setState({ jsonHeaders: jsonHeadersTemp });
      console.log(e.state.jsonData.length);

      e.setSort("asc");
    });

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

      var cardTypes = [];

      e.setState({ jsonCardData: json });

      //traverseEntireWorkBook
      for (var key in workbookData) {
        //value in cell
        var val = workbookData[key].w;

        var str = key.match(/[a-z]+|[^a-z]+/gi);

        if (str[0] === "D" && str[1] != 1) {
          var payments = val.split("\n");

          for (var i = 0; i < payments.length; i++) {
            var paymentVal = payments[i].trim();

            if (!(cardTypes.indexOf(paymentVal) > -1) && paymentVal != "") {
              cardTypes.push(paymentVal);
            }
          }
        }

        if (val) {
          if (str[1] === "1") {
            e.state.jsonCardHeaders[key[0]] = val; ///.replace(/ /g,"_").replace(":", "");
          }
          //console.log(val + ":" + str);
        }
      }

      e.setState({ cardList: cardTypes });

      console.log(e.state.jsonCardHeaders);
      console.log(e.state.cardList);
      console.log(e.state.jsonCardData.length);
    });

    stickybits(".product-sticky-container");
  }

  render() {
    const jsonHeaders = this.state.jsonHeaders;
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
                <div className="airlinePartLabel">Accepted Payments</div>
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

            <div className="apReset">
              <i className="far fa-window-close"></i>
              Reset All
            </div>
          </div>
        </div>

        <div className="airlinePartsResultsTitle">Search Results</div>

        <div className="airlinePartsTable">
          <div
            className=""
            style={{ maxWidth: "1170px", margin: "0 auto", overflow: "hidden" }}
          >
            <div className="row no-gutters">
              {this.state.filter &&
                this.state.filterTicket &&
                this.state.jsonCardData.length &&
                this.state.jsonData.map((data, i) => {
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

                  for (
                    let index = 0;
                    index < e.state.jsonCardData.length;
                    index++
                  ) {
                    if (
                      e.state.jsonCardData[index]["Airline Code"].indexOf(
                        data["Numeric Code"]
                      ) > 0
                    ) {
                      cardRow = e.state.jsonCardData[index];
                    }
                  }

                  return (
                    <div key={i} className={"col-lg-12 " + className}>
                      <RefundRow
                        data={data}
                        cardData={cardRow}
                        filters="filter"
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <div className="legaleseContainer">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <small>
                  <strong>Disclaimer</strong>: This page is updated based on
                  information ARC receives from individual airlines and global
                  distribution systems. It may not be comprehensive and is
                  subject to change without notice. For specific airline
                  policies and guidelines, please visit the airline’s website or
                  contact the airline directly. ARC uses reasonable care in
                  compiling and presenting the hyperlinks, but ARC gives no
                  guarantee, representation, or warranty that the content behind
                  any of the hyperlinks is complete, accurate, error- or
                  virus-free, or up to date. The information contained behind
                  any hyperlink may not be the sole source of information from
                  the airline and may not include all fare rules/ticketing
                  rules. ARC recommends travel agents take care to read all
                  information published by the airline and all rules for the
                  fares being booked, ticketed and/or refunded.
                </small>
              </div>
            </div>
          </div>
        </div>

        <div id="agencyResources" className="agencyResources">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <h2>Agency Resources</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <h3>Chargeback FAQs</h3>
                <p>
                  The industry is seeing a significant increase in service- and
                  refund-related disputes compared to the typical fraud-related
                  chargebacks. These FAQs serve as a resource for “Terms and
                  Conditions” related disputes, which need to be managed
                  differently.
                </p>
                <a
                  target="_blank"
                  href="https://www2.arccorp.com/globalassets/refunds/covid-19-chargeback-dispute-management-faqs.pdf"
                  className="ctaBtn"
                >
                  View FAQs
                </a>
              </div>
              <div className="col-lg-6">
                <h3>ARC Pay Dispute FAQs</h3>
                <p>
                  During this challenging time, agencies may be experiencing an
                  influx of ARC Pay disputes. Here are the steps agencies need
                  to take to proactively address and respond to ARC Pay
                  transaction disputes and chargebacks.
                </p>
                <a
                  target="_blank"
                  href="https://www2.arccorp.com/globalassets/refunds/arc-pay-dispute-information-and-faqs.pdf"
                  className="ctaBtn"
                >
                  View FAQs
                </a>
              </div>
            </div>
            <div className="row" style={{ marginTop: "30px" }}>
              <div className="col-lg-6">
                <h3>Cash Settlement FAQs</h3>
                <p>
                  Due to the state of the global travel community, travel
                  agencies are facing a level of refunds that is outpacing new
                  sales. These FAQs detail the changes ARC has made to ensure
                  the integrity of its core settlement functions.
                </p>
                <a
                  target="_blank"
                  href="https://www2.arccorp.com/globalassets/email/ARC-Cash-Settlement-Travel-Agency-FAQs-Effective-PED-2020-11-08.pdf"
                  className="ctaBtn"
                >
                  View FAQs
                </a>
              </div>
              <div className="col-lg-6">
                <h3>Recommendations for Managing Airline Schedule Changes</h3>
                <p>
                  These new guidelines from ARC’s Debit Memo Working Group aim
                  to help airlines, travel agencies and GDSs manage airline
                  schedule changes more effectively.
                </p>
                <a
                  target="_blank"
                  href="https://www2.arccorp.com/globalassets/support--training/debit-memo-working-group/recommendations-for-managing-airline-schedule-changes.pdf"
                  className="ctaBtn"
                >
                  Download PDF
                </a>
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
