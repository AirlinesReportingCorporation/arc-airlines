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
      sortType: "asc"
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

      e.setSort("asc");

      //console.log(e.state.jsonHeaders);
      //console.log(e.state.jsonData);
    });

    stickybits(".product-sticky-container");
  }

  render() {
    const jsonHeaders = this.state.jsonHeaders;
    var filter = this.state.filter;
    console.log(moment.utc("6 Mar 17"));
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
                    Airline Name
                  </div>
                  <div
                    onClick={this.setSort.bind(this, "code")}
                    className={
                      "airlinePartFilterItem" +
                      (this.state.sortType == "code" ? " active" : "")
                    }
                  >
                    Airline Code
                  </div>
                  <div
                    onClick={this.setSort.bind(this, "recent")}
                    className={
                      "airlinePartFilterItem" +
                      (this.state.sortType == "recent" ? " active" : "")
                    }
                  >
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
                    All
                  </div>
                  <div
                    onClick={this.setFilter.bind(this, "Via GDS")}
                    className={
                      "airlinePartFilterItem" +
                      (this.state.filter == "Via GDS" ? " active" : "")
                    }
                  >
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
                    All
                  </div>
                  <div
                    onClick={this.setTicketFilter.bind(this, "13 Months")}
                    className={
                      "airlinePartFilterItem" +
                      (this.state.filterTicket == "13 Months" ? " active" : "")
                    }
                  >
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
                    > 13 Months
                  </div>
                </div>
              </div>
              <div className="col-lg-2">
                <div className="airlinePartLabel">NDC/Direct Connect</div>
                <div className="airlinePartFilterGroup">
                  <div className="airlinePartFilterItem">Yes</div>
                  <div className="airlinePartFilterItem">No</div>
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
            <input className="apSearch" type="text" />
            <div className="apReset">
              <i class="far fa-window-close"></i>
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

                  return (
                    <div key={i} className={"col-lg-12 " + className}>
                      <RefundRow data={data} filters="filter" />
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
                  <strong>Disclaimer</strong>: This information is provided for
                  informational purposes only. You shall not, without prior
                  written consent from ARC, sell or resell any data provided, or
                  otherwise disclose, copy, duplicate, publish, or distribute
                  any such data for sale or resale. Unauthorized use of this
                  data is prohibited. ARC endeavors to provide accurate data;
                  however, the data used to compile the statistics may be
                  subject to omissions and errors in reporting, recording and
                  processing. ARC provides no warranties of any kind with
                  respect to the statistics or the data. ARC shall in no way be
                  liable to any party for any damages, costs or expenses, which
                  may arise out of, or in any way be connected with any
                  information furnished by ARC, including the manner or media in
                  which the information is provided, whether or not such
                  information, for any reason whatsoever, is erroneous or
                  incomplete, even if ARC is advised of such possibility. The
                  data, as well as the design, processing, and layout of the
                  data are, and shall remain proprietary to ARC. Provision of
                  this data shall not be construed as granting any express or
                  implied rights, by license or otherwise, to any tangible or
                  intangible property, including, but not necessarily limited
                  to, any operational and sales statistics data or intellectual
                  property, or improvement made, conceived, or acquired prior to
                  after provision of this data.
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
