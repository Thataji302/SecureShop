/***
**Module Name: Header 
 **File Name :  Header.js
 **Project :    Orasi Media
 **Copyright(c) : X Platform Consulting.
 **Organization : Peafowl Inc
 **author :  chandrasekhar
 **author :  Hari
 **license :
 **version :  1.0.0
 **Created on :
 **Created on: Dec 27 2022
 **Last modified on: Dec 27 2022
 **Description : contains header component details.
 ***/
import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import Header from ".././components/header/Header";
import Sidebar from ".././components/dashboard/sidebar";
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from 'axios';
import ReactFileReader from 'react-file-reader';
import * as XLSX from "xlsx";
import moment from "moment";
const csv = require('csvtojson')
// import * as Config from "./../../constants/Config";
let { lambda, appname } = window.app
const menuList = [
    {
        id: '1',
        name: 'travel_explore',
        labelName: 'Search',
        route: "search"
    },
    {
        id: '2',
        name: 'collections_bookmark',
        labelName: 'Properties',
        route: "dashboard"
    },
    {
        id: '3',
        name: 'settings',
        labelName: 'Groups',
        // route: "dashboard"
    },
    // {
    //     id: '10',
    //     name: 'settings',
    //     labelName: 'Playlist'
    // },

]
const Dashboard = (props) => {
    // const { pathname } = useLocation();
    // const headerRef = useRef(null);
    // const [scroll, setScroll] = useState(false);
    const history = useHistory();
    const [formData, setFormData] = useState({})
    const [config, setConfig] = useState({});
    const [activeId, setActiveId] = useState();
    const [importSuccess, setImportSuccess] = useState(false);
    // console.log("props", props.menus);
    // const active = headerNav.findIndex((e) => e.path === pathname);
    useEffect(() => {
        // if (!localStorage.getItem("token")) {
        //     history.push("/");
        // }
        // else if (menuList[1]?.id) {
        //     setActiveId(menuList[1].id)
        // }

    }, []);
    useEffect(() => {
        if (window.site) {
            setConfig(window.site);

        }

    }, [window.site]);
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }else{
          GetPropertyData();
        }

    }, []);
    const GetPropertyData = () => {
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        // let payload = formChange;
        // payload ["userid" ] = userid
        const urlLink = lambda + '/getForm?appname=' + appname + (userid ? "&userId=" + userid : "");
        axios({
            method: 'GET',
            url: urlLink,
        })
            .then(function (response) {
                if (response.data.result) {
                    //history.push("./yellowForm");
                    setFormData(response.data.result && response.data.result)
                }
            });
    }
    const searchClick = () => {
        history.push("/search");
    }
    const savedClick = () => {
        history.push("/dashboard");
    }
    // console.log("propertyData",propertyData)
    const savedProperties = (e, name, state, zipCode) => {
        //  console.log('name',name)
        let nameValue = name + "," + state + "," + zipCode
        console.log('nameValue', nameValue)
        localStorage.setItem("propertyName", nameValue)
        localStorage.setItem("name", name)
        // localStorage.setItem("propertyZipCode", zipCode)
        history.push("/properties");
    }
    let imageCloudfront;
    if (config.common && config.common.imageCloudfront) {
        imageCloudfront = config.common.imageCloudfront;
    }
    const goBack = () => {
        history.goBack();
    }
    const onClickMenu = (e, item) => {
        //setMenu(id);
        console.log('handleActiveMenuObj------------>', item)
        setActiveId(item.id)

        history.push(item.route)
    }
    const createClick = () => {
        history.push("/createForm");
    }

    let scrollInterval; // To store the interval for scrolling
    const wrapper = document.querySelector('.table-wrapper');
    const scrollLeftBtn = document.querySelector('.scroll-left');
    const scrollRightBtn = document.querySelector('.scroll-right');

    // Function to scroll left
    function scrollLeft() {
        clearInterval(scrollInterval); // Clear any previous interval
        scrollInterval = setInterval(() => {
            wrapper.scrollLeft -= 5; // Adjust this value for speed of scrolling left
            if (wrapper.scrollLeft <= 0) { // Stop when it reaches the start
                clearInterval(scrollInterval);
            }
        }, 10);
    }

    // // Function to scroll right
    function scrollRight() {
        clearInterval(scrollInterval); // Clear any previous interval
        scrollInterval = setInterval(() => {
            wrapper.scrollLeft += 5; // Adjust this value for speed of scrolling right
            if (wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth) { // Stop when it reaches the end
                clearInterval(scrollInterval);
            }
        }, 10);
    }

    // // Stop scrolling
    function stopScroll() {
        clearInterval(scrollInterval);
    }

    const handleFiles = (event) => {
        var self = this;
        var file = event[0];
        var fileExt = file && file.name && file.name.split('.').pop();
        var reader = new FileReader();
        reader.onload = function (event) {
            let assetsData;
            let data = event.target.result;
            switch (fileExt) {
                case 'csv':
                    csv({})
                        .fromString(data)
                        .then((csvRow) => {
                            assetsData = csvRow;
                            console.log("csvRow",assetsData)
                            // self.setState({ loader: true, fileType: fileExt });
                            // self.handleDisplay(assetsData)
                        })
                    break;
                case 'xlsx':
                case 'xls':
                    let workbook = XLSX.read(data, { type: "binary" });
                    workbook.SheetNames.forEach(sheet => {
                        assetsData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
                        console.log("XLSX",assetsData)
                        // self.setState({ loader: true, fileType: fileExt });
                        handleDisplay(assetsData)
                    });
                    break;
                case 'json':
                    assetsData = data;
                    console.log("json",assetsData)
                    // self.setState({ loader: true, fileType: fileExt });
                    // self.handleDisplay(assetsData)
                    break;
                   
            }
        };
        if (fileExt == 'json') {
            reader.readAsText(file);
        } else {
            reader.readAsBinaryString(file);
        }
    }
    const handleDisplay = (assetsList) => {
        let importAsset = JSON.stringify(assetsList)
      //  console.log("importAsset", importAsset)
        if (assetsList && assetsList.length > 0) {
            let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        const urlLink = lambda + '/import?appname=' + appname + (userid ? "&userId=" + userid : "");
        axios({
            method: 'POST',
            url: urlLink,
            data: assetsList
        })
            .then(function (response) {
                if (response.data.result) {
                    //history.push("./yellowForm");
                    setFormData(response.data.result && response.data.result)
                    setImportSuccess(true)
                   // GetPropertyData()
                }
            });
        }

    }
    const onConfirm = () => {
        setImportSuccess(false)
        GetPropertyData()
    }
    
    return (
        <div id="layout-wrapper">
        <div className="dashboard">
            <Header />
            <div className="main-content yellow_form">

                <div className="page-content">
                    <div className="container-fluid">
                        <div className="breadcurmb">
                            <div className="title_block">
                                <h5>yellow form</h5>
                                <button className="btn-primary ms-3" onClick={createClick}><span className="material-symbols-outlined">add</span>Create</button>
                            </div>
                            <div className="buttons">
                            <ReactFileReader handleFiles={e => handleFiles(e)} fileTypes={[".xlsx", ".xls", ".csv", ".json"]}>
                                        <button type="button" className="btn-primary" ><span className="material-symbols-outlined">
                                        south_west
                                        </span><span>import</span></button>
                                    </ReactFileReader>
                            {/* <button className=" btn-primary"><span class="material-symbols-outlined">south_west</span>import</button> */}
                            {/* <button className=" btn-primary"><span class="material-symbols-outlined">north_east</span>export</button> */}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-body">
                                        {/* <div>
                                            <button onclick={scrollToColumn(0)}>Scroll to Column 1</button>
                                            <button onclick={scrollToColumn(20)}>Scroll to Column 3</button>
                                            <button onclick={scrollToColumn(30)}>Scroll to Column 5</button>
                                        </div> */}
                                        {formData &&  formData?.length > 0 ?
                                        <div className="table-container">
                                            <button className="scroll-left" onMouseOver={scrollLeft()} onMouseOut={stopScroll()}><span className="material-symbols-outlined">
                                                chevron_left
                                            </span></button>
                                            <div className="table-wrapper">
                                                <table className="table table-bordered" id="myTable">

                                                    <colgroup span="4"></colgroup>
                                                    <colgroup span="6"></colgroup>
                                                    <colgroup span="7"></colgroup>
                                                    <colgroup span="4"></colgroup>
                                                    <colgroup span="4"></colgroup>
                                                    <colgroup span="4"></colgroup>
                                                    <colgroup span="5"></colgroup>
                                                    <colgroup span="3"></colgroup>
                                                    <colgroup span="2"></colgroup>
                                                    <colgroup span="2"></colgroup>
                                                    <colgroup span="2"></colgroup>
                                                    <colgroup span="5"></colgroup>
                                                    <colgroup span="4"></colgroup>
                                                    <colgroup span="2"></colgroup>
                                                    <colgroup span="5"></colgroup>
                                                    <colgroup span="3"></colgroup>
                                                    <colgroup span="5"></colgroup>
                                                    <tr className="title_header">
                                                        <th colspan="4" scope="colgroup">Customer Details</th>
                                                        <th colspan="6" scope="colgroup">Dealer Details</th>
                                                        <th colspan="7" scope="colgroup">Vehicle Details</th>
                                                        <th colspan="4" scope="colgroup">Exchange Details</th>
                                                        <th colspan="4" scope="colgroup">Corporate Details</th>
                                                        <th colspan="4" scope="colgroup">Consumer Details</th>
                                                        <th colspan="5" scope="colgroup">Spl Approval from Tata</th>
                                                        <th colspan="3" scope="colgroup">Accessories 18% Margin</th>
                                                        <th colspan="2" scope="colgroup">Extended Warranty</th>
                                                        <th colspan="2" scope="colgroup">A.M.C/P2P</th>
                                                        <th colspan="2" scope="colgroup">Fastag</th>
                                                        <th colspan="5" scope="colgroup">Finance Company</th>
                                                        <th colspan="4" scope="colgroup">Insurance Company</th>
                                                        <th colspan="2" scope="colgroup">Total dealer & Tml Share</th>
                                                        <th colspan="5" scope="colgroup">Income</th>
                                                        <th colspan="3" scope="colgroup">Net-Income</th>
                                                        <th colspan="5" scope="colgroup">Reciepts Details</th>
                                                    </tr>
                                                    <tr>
                                                        <th scope="col">Doct No</th>
                                                        <th scope="col">Exe. Name</th>
                                                        <th scope="col">Customer Name</th>
                                                        <th scope="col" className="border-right">Phone Number</th>

                                                        <th scope="col">Dealer Invoice date</th>
                                                        <th scope="col">Branch</th>
                                                        <th scope="col">Tml Invoice date</th>
                                                        <th scope="col">Commercial Invoice</th>
                                                        <th scope="col">No of days Stock in hand</th>
                                                        <th scope="col" className="border-right">Dealer Invoice number</th>

                                                        <th scope="col">LOB</th>
                                                        <th scope="col">PPL</th>
                                                        <th scope="col">Model</th>
                                                        <th scope="col">Chassis Number</th>
                                                        <th scope="col">Purchase Price</th>
                                                        <th scope="col">Sale Price</th>
                                                        <th scope="col" className="border-right">Dealer Margin</th>

                                                        <th scope="col">Exchange Offer</th>
                                                        <th scope="col">TML Share</th>
                                                        <th scope="col">Dealer Share</th>
                                                        <th scope="col" className="border-right">Not Pass</th>

                                                        <th scope="col">Corporate Offer</th>
                                                        <th scope="col">TML Share</th>
                                                        <th scope="col">Dealer Share</th>
                                                        <th scope="col" className="border-right">Not Pass</th>

                                                        <th scope="col">Consumer Offer</th>
                                                        <th scope="col">TML Share</th>
                                                        <th scope="col">Dealer Share</th>
                                                        <th scope="col" className="border-right">Not Pass</th>

                                                        <th scope="col">Offer</th>
                                                        <th scope="col">TML Share</th>
                                                        <th scope="col">Dealer Share</th>
                                                        <th scope="col">Not Pass</th>
                                                        <th scope="col" className="border-right">E of Supply</th>

                                                        <th scope="col">Accessories</th>
                                                        <th scope="col">FOC</th>
                                                        <th scope="col" className="border-right">NET</th>

                                                        <th scope="col">E.W</th>
                                                        <th scope="col" className="border-right">Incentive</th>

                                                        <th scope="col">AMC</th>
                                                        <th scope="col" className="border-right">Incentive</th>

                                                        <th scope="col">Fastag</th>
                                                        <th scope="col" className="border-right">Commission</th>

                                                        <th scope="col">Finance</th>
                                                        <th scope="col">Finance amount</th>
                                                        <th scope="col">IN/OUT</th>
                                                        <th scope="col">Dealer commission%</th>
                                                        <th scope="col" className="border-right">Payout</th>

                                                        <th scope="col">Insurance</th>
                                                        <th scope="col">Insurance amount</th>
                                                        <th scope="col">Sub total addition</th>
                                                        <th scope="col" className="border-right">Payout</th>

                                                        <th scope="col">Total TML Share</th>
                                                        <th scope="col" className="border-right">Total Dealer share</th>

                                                        <th scope="col">Total Income</th>
                                                        <th scope="col">Offer not passed to customer</th>
                                                        <th scope="col">Other income as for tally</th>
                                                        <th scope="col">Offers from dealer</th>
                                                        <th scope="col" className="border-right">Net income before tax</th>

                                                        <th scope="col">Tax</th>
                                                        <th scope="col">Net income with dealer margin</th>
                                                        <th scope="col" className="border-right">Remarks</th>
                                                        <th scope="col">On Road</th>
                                                        <th scope="col">Cash</th>
                                                        <th scope="col">Bank</th>
                                                        <th scope="col">D.O</th>
                                                        <th scope="col">Total</th>
                                                        <th scope="col" className="border-right">Balance</th>
                                                        <th scope="col" className="border-right">Created</th>

                                                    </tr>
                                                    {formData &&  formData?.length > 0 && formData?.map((eachItem, key) => {
                                                                    return (
                                                    <tr key={key}>
                                                        <td>{eachItem?.docNo ? eachItem?.docNo : 'N/A'}</td>
                                                        <td>{eachItem?.executiveName ? eachItem?.executiveName : 'N/A'}</td>
                                                        <td>{eachItem?.customerName ? eachItem?.customerName : 'N/A'}</td>
                                                        <td>{eachItem?.phoneNumber ? eachItem?.phoneNumber : 'N/A'}</td>
                                                        <td>{eachItem?.dealerInvoiceDate ? eachItem?.dealerInvoiceDate : 'N/A'}</td>
                                                        <td>{eachItem?.branchName ? eachItem?.branchName : 'N/A'}</td>
                                                        <td>{eachItem?.tmlInvoiceDate ? eachItem?.tmlInvoiceDate : 'N/A'}</td>
                                                        <td>{eachItem?.commercialInvoice ? eachItem?.commercialInvoice : 'N/A'}</td>
                                                        <td>{eachItem?.stock ? eachItem?.stock : 'N/A'}</td>
                                                        <td>{eachItem?.dealerInvNo ? eachItem?.dealerInvNo : 'N/A'}</td>
                                                        <td>{eachItem?.LOB ? eachItem?.LOB : 'N/A'}</td>
                                                        <td>{eachItem?.PPl ? eachItem?.PPl : 'N/A'}</td>
                                                        <td>{eachItem?.modelName ? eachItem?.modelName : 'N/A'}</td>
                                                        <td>{eachItem?.chassisNumber ? eachItem?.chassisNumber : 'N/A'}</td>
                                                        <td>{eachItem?.purchasePrice ? eachItem?.purchasePrice : 'N/A'}</td>
                                                        <td>{eachItem?.salePrice ? eachItem?.salePrice : 'N/A'}</td>
                                                        <td>{eachItem?.dealerMargin ? eachItem?.dealerMargin : 'N/A'}</td>
                                                        <td>{eachItem?.exchangeOffer ? eachItem?.exchangeOffer : 'N/A'}</td>
                                                        <td>{eachItem?.exchangeTmlShare ? eachItem?.exchangeTmlShare : 'N/A'}</td>
                                                        <td>{eachItem?.exchangeDealerShare ? eachItem?.exchangeDealerShare : 'N/A'}</td>
                                                        <td>{eachItem?.exchangeNotPass ? eachItem?.exchangeNotPass : 'N/A'}</td>
                                                        <td>{eachItem?.corporateOffer ? eachItem?.corporateOffer : 'N/A'}</td>
                                                        <td>{eachItem?.corporateTmlShare ? eachItem?.corporateTmlShare : 'N/A'}</td>
                                                        <td>{eachItem?.corporateDealerShare ? eachItem?.corporateDealerShare : 'N/A'}</td>
                                                        <td>{eachItem?.corporateNotPass ? eachItem?.corporateNotPass : 'N/A'}</td>
                                                        <td>{eachItem?.consumerOffer ? eachItem?.consumerOffer : 'N/A'}</td>
                                                        <td>{eachItem?.consumerTmlShare ? eachItem?.consumerTmlShare : 'N/A'}</td>
                                                        <td>{eachItem?.consumerDealerShare ? eachItem?.consumerDealerShare : 'N/A'}</td>
                                                        <td>{eachItem?.consumerNotPass ? eachItem?.consumerNotPass : 'N/A'}</td>
                                                        <td>{eachItem?.splOffer ? eachItem?.splOffer : 'N/A'}</td>
                                                        <td>{eachItem?.splTmlShare ? eachItem?.splTmlShare : 'N/A'}</td>
                                                        <td>{eachItem?.splDealerShare ? eachItem?.splDealerShare : 'N/A'}</td>
                                                        <td>{eachItem?.splNotPass ? eachItem?.splNotPass : 'N/A'}</td>
                                                        <td>{eachItem?.supply ? eachItem?.supply : 'N/A'}</td>
                                                        <td>{eachItem?.accessories ? eachItem?.accessories : 'N/A'}</td>
                                                        <td>{eachItem?.FOC ? eachItem?.FOC : 'N/A'}</td>
                                                        <td>{eachItem?.NET ? eachItem?.NET : 'N/A'}</td>
                                                        <td>{eachItem?.extendedWarranty ? eachItem?.extendedWarranty : 'N/A'}</td>
                                                        <td>{eachItem?.incentive ? eachItem?.incentive : 'N/A'}</td>
                                                        <td>{eachItem?.AMC ? eachItem?.AMC : 'N/A'}</td>
                                                        <td>{eachItem?.amcIncentive ? eachItem?.amcIncentive : 'N/A'}</td>
                                                        <td>{eachItem?.fastagName ? eachItem?.fastagName : 'N/A'}</td>
                                                        <td>{eachItem?.fastagCommission ? eachItem?.fastagCommission : 'N/A'}</td>
                                                        <td>{eachItem?.financeName ? eachItem?.financeName : 'N/A'}</td>
                                                        <td>{eachItem?.financeAmount ? eachItem?.financeAmount : 'N/A'}</td>
                                                        <td>{eachItem?.INOUT ? eachItem?.INOUT : 'N/A'}</td>
                                                        <td>{eachItem?.dealerCommission ? eachItem?.dealerCommission : 'N/A'}</td>
                                                        <td>{eachItem?.financePayout ? eachItem?.financePayout : 'N/A'}</td>
                                                        <td>{eachItem?.insuranceName ? eachItem?.insuranceName : 'N/A'}</td>
                                                        <td>{eachItem?.insuranceAmount ? eachItem?.insuranceAmount : 'N/A'}</td>
                                                        <td>{eachItem?.subTotal ? eachItem?.subTotal : 'N/A'}</td>
                                                        <td>{eachItem?.insurancePayout ? eachItem?.insurancePayout : 'N/A'}</td>
                                                        <td>{eachItem?.totalTmlShare ? eachItem?.totalTmlShare : 'N/A'}</td>
                                                        <td>{eachItem?.totalDealerShare ? eachItem?.totalDealerShare : 'N/A'}</td>
                                                        <td>{eachItem?.totalIncome ? eachItem?.totalIncome : 'N/A'}</td>
                                                        <td>{eachItem?.offerNotPassed ? eachItem?.offerNotPassed : 'N/A'}</td>
                                                        <td>{eachItem?.otherIncome ? eachItem?.otherIncome : 'N/A'}</td>
                                                        <td>{eachItem?.offerFromDealer ? eachItem?.offerFromDealer : 'N/A'}</td>
                                                        <td>{eachItem?.netIncome ? eachItem?.netIncome : 'N/A'}</td>
                                                        <td>{eachItem?.tax ? eachItem?.tax : 'N/A'}</td>
                                                        <td>{eachItem?.netIncomeDealerMargin ? eachItem?.netIncomeDealerMargin : 'N/A'}</td>
                                                        <td>{eachItem?.remarks ? eachItem?.remarks : 'N/A'}</td>
                                                        <td>{eachItem?.onRoad ? eachItem?.onRoad : 'N/A'}</td>
                                                        <td>{eachItem?.cash ? eachItem?.cash : 'N/A'}</td>
                                                        <td>{eachItem?.bank ? eachItem?.bank : 'N/A'}</td>
                                                        <td>{eachItem?.DO ? eachItem?.DO : 'N/A'}</td>
                                                        <td>{eachItem?.total ? eachItem?.total : 'N/A'}</td>
                                                        <td>{eachItem?.balance ? eachItem?.balance : 'N/A'}</td>
                                                        <td>{moment(eachItem?.created).format('DD-MM-YYYY')}</td>

                                                    </tr>
                                                    )

                                                }

                                                )
                                            }
                                                </table>
                                            </div>
                                            <button className="scroll-right" onMouseOver={scrollRight()} onMouseOut={stopScroll()}><span className="material-symbols-outlined">
                                                    chevron_right
                                                    </span></button>
                                        </div>:
                                        <div className="empty_page">
                                        <img src={imageCloudfront + "propertyCalculator/images/dashboard.png"} />
                                        <p>There are no sales list available.<br />Please add sales form.</p>
                                        <a className="btn btn-primary" onClick={createClick}>ADD</a>
                                    </div>}
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
                {importSuccess &&
                            <SweetAlert show={importSuccess}
                                custom
                                confirmBtnText="Ok"
                                confirmBtnBsStyle="primary"
                                title={"Import Added Successfully"}
                                onConfirm={e => onConfirm()}
                            >
                            </SweetAlert>}
                <footer className="footer">
                    <div className="container-fluid">
                        <div className="row">

                            <div className="col-sm-12 text-center">
                                <div className="text-sm-center d-none d-sm-block text-center">
                                    2024 ALL RIGHTS RESERVED MOTOR SALES.
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>

        </div>
         </div>

    );
};

export default Dashboard;
