import React, { Component, useState } from "react";

import * as moment from "moment";
import axios from "axios";
import XLSX from "xlsx";
import SimpleBar from "simplebar-react";
import stickybits from "stickybits";
import RefundRow from "./RefundRow.jsx";
import SelectSearch, { fuzzySearch } from "react-select-search";

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
      filterNDC: "ALL",
      filterObj: [],
      refundFilter: [],
      sortType: "asc",
      jsonCardHeaders: [],
      jsonCardData: [],
      cardData: [],
      profileData: [],
      cardFilter: [],
      activePayments: [],
      completeLoad: false,
      dataRows: <div></div>,
      searchValue: "",
      allData: [],
    };

    this.setFilter = this.setFilter.bind(this);
    this.setTicketFilter = this.setTicketFilter.bind(this);
    this.setNDCFilter = this.setNDCFilter.bind(this);
    this.setSort = this.setSort.bind(this);
    this.toggleActivePayments = this.toggleActivePayments.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.completeLoadFunc = this.completeLoadFunc.bind(this);
    this.renderRows = this.renderRows.bind(this);
    this.setSearchValue = this.setSearchValue.bind(this);
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
    this.setState({ searchValue: "" });
    this.setState({ filterNDC: "ALL" });

    document.getElementsByClassName("select-search__input").value = "";
  }

  setSearchValue(val) {
    console.log(val);
    this.setState({ searchValue: val });
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
        activePayments: currentPayments,
      });
    }
    //if not in array add to array
    else if (!inArray) {
      var currentPayments = e.state.activePayments;
      currentPayments.push(val);
      e.setState({ activePayments: currentPayments });
    }

    //console.log(e.state.activePayments);
  }

  setTicketFilter(val) {
    this.setState({ filterTicket: val });
  }

  setNDCFilter(val) {
    this.setState({ filterNDC: val });
    //console.log(this.state.filterNDC);
  }

  setSort(val) {
    var jsonData1 = this.state.allData;

    if (val == "asc") {
      jsonData1.sort(propComparator("Airline Name", 1));
    } else if (val == "code") {
      jsonData1.sort(propComparator(" Numeric", 1));
    } else if (val == "recent") {
      jsonData1.sort(propComparator("Last Updated", 1));
    }

    this.setState({ sortType: val });
    this.setState({ allData: jsonData1 });
  }

  componentDidMount() {
    var e = this;

    const profilecall = new Promise((resolve, reject) => {
      axios({
        method: "get",
        url:
          "https://www2.arccorp.com/globalassets/airline-participation/getcarriers.json?" +
          new Date().toLocaleString(),
        responseType: "json",
      }).then(function(response) {
        console.log("===== Profile Chart Loaded ===== ");
        e.setState({ profileData: response.data });
        resolve(true);
      });
    });

    const allDataCall = new Promise((resolve, reject) => {
      axios({
        method: "get",
        url:
          "https://www2.arccorp.com/globalassets/airline-participation/airline-data.xlsx?" +
          new Date().toLocaleString(),
        responseType: "arraybuffer",
      }).then(function(response) {
        console.log("===== All Airline Data Chart Loaded ===== ");
        var data = new Uint8Array(response.data);
        var workbook = XLSX.read(data, { type: "array" });

        var workbookData = workbook["Sheets"]["Airlines"];

        var json = XLSX.utils.sheet_to_json(workbookData, {
          raw: false,
          range: 1,
        });

        e.setState({ allData: json });

        e.setSort("asc");

        resolve(true);
      });
    });

    Promise.all([profilecall, allDataCall])
      .then((values) => {
        e.completeLoadFunc();
      })
      .catch((error) => {
        console.error(error.message);
      });

    stickybits(".product-sticky-container");
  }

  renderRows() {
    var e = this;

    //console.log(this.state.allData);

    if (e.state.completeLoad) {
      var refundRowHTML = this.state.allData.map((data, i) => {
        var comboTruth = false;
        var refundShow = false;
        var ticketShow = false;
        var ndcShow = false;

        var className = "hide";

        var filter = this.state.filter;
        var filterTicket = this.state.filterTicket;
        var filterNDC = this.state.filterNDC;

        if (filter == "ALL") {
          refundShow = true;
        } else if (data["Refunds"]) {
          if (data["Refunds"].indexOf(this.state.filter) > -1) {
            refundShow = true;
          }
        }

        if (filterNDC == "ALL") {
          ndcShow = true;
        } else if (
          filterNDC == "YES" &&
          (data[" Numeric"] === "075" ||
            data[" Numeric"] === "134" ||
            data[" Numeric"] === "125" ||
            data[" Numeric"] === "016" ||
            data["NDC/Direct Connect"] === "Y")
        ) {
          ndcShow = true;
        } else if (filterNDC == "NO") {
          ndcShow = true;

          if (
            data["Numeric Code"] === "075" ||
            data["Numeric Code"] === "134" ||
            data["Numeric Code"] === "125" ||
            data["Numeric Code"] === "016"
          ) {
            ndcShow = false;
          }
        }

        if (filterTicket == "ALL") {
          ticketShow = true;
        } else if (
          filterTicket == "13 Months" &&
          data["Processing Validity"] == "13 Months"
        ) {
          ticketShow = true;
        } else if (
          filterTicket == "> 13 Months" &&
          data["Processing Validity"] != "13 Months"
        ) {
          ticketShow = true;
        }

        //is not a valid airline
        var validAirline = data[" Code"] && data[" Numeric"];

        var curSearchName =
          data[" Code"] +
          "-" +
          data[" Numeric"] +
          "-" +
          data["Airline Name"].replace(/\s/g, "");
        //alldata
        //data["Name"].replace(/\s/g, "");

        className =
          refundShow &&
          ticketShow &&
          ndcShow &&
          validAirline &&
          (e.state.searchValue == curSearchName || e.state.searchValue == "")
            ? "show"
            : "hide";

        var paymentFilterData = e.state.activePayments.length
          ? e.state.activePayments
          : "all";

        //console.log(paymentFilterData);
        //

        return (
          <div key={i} className={"col-lg-12 " + className}>
            <RefundRow
              data={data}
              //cardData={cardRow}
              //doc141Data={doc141Row}
              paymentFilterList={paymentFilterData}
              profileData={this.state.profileData}
              filters="filter"
            />
          </div>
        );
      });

      return refundRowHTML;
    } else {
      return (
        <div
          className={"loading"}
          style={{ marginTop: "70px", marginBottom: "70px" }}
        >
          <div className="loading-icon">
            <i className="fas fa-circle-notch fa-spin"></i>
          </div>
          <div style={{ color: "#aaaaaa" }}>
            Loading Participating Airline Information…
          </div>
        </div>
      );
    }
  }

  render() {
    var filter = this.state.filter;
    //var cardData = this.state.jsonCardData;
    var e = this;

    var searchData = [];

    var searchPicked = "";

    for (let i = 0; i < this.state.allData.length; i++) {
      const element = this.state.allData[i];
      if (element[" Code"] && element[" Numeric"]) {
        searchData.push({
          name:
            element[" Code"] +
            "-" +
            element[" Numeric"] +
            " " +
            element["Airline Name"],
          value:
            element[" Code"] +
            "-" +
            element[" Numeric"] +
            "-" +
            element["Airline Name"].replace(/\s/g, ""),
        });
      }
    }

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
                  Participating Airline Information
                </div>
              </div>
              <div className="product-sticky-links d-flex align-items-center">
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
              More than 240 airlines depend on ARC for ticket settlement
              services with travel agencies and CTDs. Use the filters below to
              sort and view the information you want to see, including:
            </p>

            <p>
              <ul>
                <li>Refund & exchange ticket-processing validity</li>
                <li>EDIFACT support</li>
                <li>Payment acceptance</li>
                <li>NDC/Direct Connect participation</li>
              </ul>
            </p>
          </div>
        </div>

        <div
          class="airlineDownloadContainer"
          style={{ borderTop: "1px solid #d4d4d4" }}
        >
          <div className="airlinePartJumbo">
            <p>
              Download an Excel spreadsheet containing all ARC-participating
              airline information.{" "}
              <a
                className="airlinePartDownloadLink"
                href="https://www2.arccorp.com/globalassets/airline-participation/airline-data.xlsx?125"
              >
                Download
              </a>
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
                <div className="airlinePartLabel">Processing Validity</div>
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
                    <i className="fas fa-caret-left"></i>
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
                    <i className="fas fa-caret-right"></i>
                    {">"} 13 Months
                  </div>
                </div>
              </div>
              <div className="col-lg-2">
                <div className="airlinePartLabel">NDC/Direct Connect</div>
                <div className="airlinePartFilterGroup">
                  <div
                    onClick={this.setNDCFilter.bind(this, "ALL")}
                    className={
                      "airlinePartFilterItem " +
                      (this.state.filterNDC == "ALL" ? " active" : "")
                    }
                  >
                    <i className="fas fa-caret-right"></i> All
                  </div>
                  <div
                    onClick={this.setNDCFilter.bind(this, "YES")}
                    className={
                      "airlinePartFilterItem " +
                      (this.state.filterNDC == "YES" ? " active" : "")
                    }
                  >
                    <i className="fas fa-caret-right"></i> Yes
                  </div>
                  <div
                    onClick={this.setNDCFilter.bind(this, "NO")}
                    className={
                      "airlinePartFilterItem " +
                      (this.state.filterNDC == "NO" ? " active" : "")
                    }
                  >
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
                      <div className="airlinePartFilterItem">
                      <label htmlFor="card-4">
                        <input
                          className="cardType"
                          name="card-4"
                          id="card-4"
                          type="checkbox"
                          onClick={this.toggleActivePayments.bind(this, "Uplift")}
                        />
                        Uplift (TP)
                      </label>
                    </div>
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
                        UnionPay INT'L (UP)
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
                            "Alipay"
                          )}
                        />
                        Alipay (TP)
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
              <SelectSearch
                options={searchData}
                search
                value={this.state.searchValue}
                placeholder="Search airlines"
                onChange={this.setSearchValue.bind(this)}
              />
              <div className="icon-search"></div>
            </div>

            <div className="apReset" onClick={this.resetFilters}>
              <i className="far fa-window-close"></i>
              Reset All
            </div>
          </div>
        </div>

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
          {e.state.completeLoad && (
            <div className="airlinePartsResultsTitle">Search Results</div>
          )}
          <div
            className=""
            style={{ maxWidth: "1170px", margin: "0 auto", overflow: "hidden" }}
          >
            <div className="row no-gutters">{this.renderRows()}</div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <p style={{ lineHeight: "16px" }}>
                <small>
                  <strong>Please note:</strong> This page is updated based on
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
              </p>
            </div>
          </div>
        </div>

        <div>
          <div
            id="resources"
            className="callout-box-container"
            style={{ paddingBottom: "80px" }}
          >
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="callout-box teal airlineBorderRadius">
                    <div
                      className="callout-box-title"
                      style={{
                        maxWidth: "500px",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    >
                      Download an Excel list of all airline information
                    </div>
                    <div
                      className="callout-box-copy"
                      style={{
                        maxWidth: "700px",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    >
                      If you need an Excel spreadsheet that contains all the
                      airline information represented above, select the button
                      below.
                    </div>
                    <a
                      target="_blank"
                      href="https://www2.arccorp.com/globalassets/airline-participation/airline-data.xlsx"
                      className="ctaBtn ctaBtn--white  product-cta"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container" style={{ marginBottom: "80px" }}>
          <div className="row">
            <div className="col-lg-6">
              <img
                className="lazy"
                src="https://www2.arccorp.com/globalassets/refunds/ap-ndc-feature.png"
                alt="Implement NDC with ARC"
              />
              <div className="underphoto-box">
                <h3>Implement NDC with ARC</h3>
                <p>
                  Our secure and cost-effective settlement platform allows
                  airlines to pursue a wide range of distribution strategies.
                </p>
                <a
                  href="https://www2.arccorp.com/products-participation/distribution/"
                  className="link-download"
                >
                  Learn More <i className="fas fa-chevron-right"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <img
                className="lazy"
                src="https://www2.arccorp.com/globalassets/refunds/ap-podcast.png"
                alt="Get Started"
              />
              <div className="underphoto-box">
                <h3>Listen to ARC’s podcast</h3>
                <p
                  style={{
                    maxWidth: "350px",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  ARC Talk explores technology, ingenuity and creativity in air
                  travel.{" "}
                </p>
                <a
                  href="https://www2.arccorp.com/arc-talk-podcast"
                  className="link-download"
                >
                  Listen Now <i className="fas fa-chevron-right"></i>
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
    var validAirline =
      a[" Code"] && a[" Numeric"] && b[" Code"] && b[" Numeric"];
    if ((val == "Airline Name" || val == " Numeric") && validAirline) {
      var x = a[val].toString().toLowerCase();
      var y = b[val].toString().toLowerCase();

      if (x < y) {
        return -1 * inverse;
      }
      if (x > y) {
        return 1 * inverse;
      }
    }

    if (val == "Last Updated") {
      var x = a[val]
        ? parseInt(moment(a[val].replace(/-/g, " ")).format("YYYYMMDD"))
        : 1;
      var y = b[val]
        ? parseInt(moment(b[val].replace(/-/g, " ")).format("YYYYMMDD"))
        : 1;

      if (x < y) {
        //console.log("before");
        return 1;
      }
      if (x > y) {
        //console.log("after");
        return -1;
      }
    }

    return 0;
  };
}

export default App;
