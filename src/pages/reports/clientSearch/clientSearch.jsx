/***
**Module Name: clientsearch
 **File Name :  clientsearch.js
 **Project :    Orasi Media
 **Copyright(c) : X Platform Consulting.
 **Organization : Peafowl Inc
 **author :  chandrasekhar
 **author :  Hari
 **license :
 **version :  1.0.0
 **Created on :
 **Created on: Dec 29 2022
 **Last modified on: Dec 29 2022
 **Description : contains clientsearch table details.
 ***/
import React, { useState, useEffect, useContext } from "react";
import Footer from "../../../components/dashboard/footer";
import Header from "../../../components/dashboard/header";
import Sidebar from "../../../components/dashboard/sidebar";
import tmdbApi from "../../../api/tmdbApi";
import { useHistory, Link } from "react-router-dom";
import SweetAlert from 'react-bootstrap-sweetalert';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from "moment";
import Loader from "../../../components/loader";
import SessionPopup from "../../SessionPopup"
import TableLoader from "../../../components/tableLoader";
import { contentContext } from "../../../context/contentContext";
import DataTable from 'react-data-table-component';
import ViewClientSearchDynamic from "./viewClientSearchDynamic";
import Tooltip from '@mui/material/Tooltip'

let { appname, lambda } = window.app;


const ClientSearch = () => {
    const history = useHistory();
    const location = useLocation();
    // const [toggle, setToggle] = useState(false);
    const [content, setContent] = useState("");

    const [num, setNum] = useState();
    const [viewClientSearch, setViewClientSearch] = useState({});
    const [click, setClick] = useState(false);

    const [flag, setFlag] = useState(false);


    // const [isLoading, setIsLoading] = useState(false);
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);

    const [fromdate, setFromDate] = useState(""); 
    const [rangeError, setRangeError] = useState(false); 
    const [todate, setToDate] = useState("");

    const { searchedFlag, setSearchedFlag, isLoading, setIsLoading, sortTableAlpha, arrow, userData, sortTableByDate, clientsearch, setClientSearch, currentPage, setcurrentPage, data, setData, rowsPerPage, setRowsPerPage, currentPageNew, setCurrentPage, route, setRoute, usePrevious, setActiveMenuObj, setActiveMenuId , GetTimeActivity} = useContext(contentContext)

    const validateObj = userData && userData.permissions && userData.permissions.length > 0 && userData.permissions.filter(eachItem => eachItem.menu == "Reports")
    const subValDashboard = validateObj && validateObj[0] && validateObj[0].submenus && validateObj[0].submenus[0] && validateObj[0].submenus[0].dashboard
    // console.log('subValDashboard obj',subValDashboard)
    const { state } = useLocation();
    const { search } = state || {};


    const prevRoute = usePrevious(route)
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
            setCurrentPage(1)
            setRowsPerPage(15)
            setSearchedFlag(false);
            setClientSearch("")
        }
    }, [prevRoute]);
    //  console.log('prevRoute--->',prevRoute)
    //  console.log('currentRoute--->',route)
    const keyForRerender = `${rowsPerPage}_${data.length}`;
    const columns = [

        {
            name: 'Name',
            selector: row => row?.clientname ?? "",
            sortable: true,
        },
        {
            name: 'Type',
            selector: row => row?.type === "BOTH" ? row?.showmycontent === true ? "SELLER" : "BUYER" : row?.type,
            sortable: true,
        },
        {
            name: 'Company Name',
            selector: row => row.companyname ? row.companyname : "",
            sortable: true,
        },
        {
            name: 'Searched on',
            selector: row => row?.created ? new Date(row.created).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
            }) : '',
            // selector: row =>  moment(row.created).utc().format("DD-MMM-YYYY HH:mm"),

            sortable: true,
        },
        {
            name: 'Login time',
            selector: row => row?.login_time ? new Date(row.login_time).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            }) : '',
            //    selector: row => moment(row.login_time).utc().format("DD-MMM-YYYY HH:mm"),
            sortable: true,
        },
        {
            name: 'Asset Total',
            selector: row => row.assetTotal ? row.assetTotal : "",
            sortable: true,
        },

        {
            name: <>{subValDashboard && subValDashboard.view && subValDashboard.view.display === true && 'Actions'}</>,
            cell: (props) =>
                //   {
                subValDashboard && subValDashboard.view && subValDashboard.view.display === true &&
                <div className="d-flex">

                    <a onClick={(e) => handleClientSearchView(e, props._id)} className={`${subValDashboard && subValDashboard.view && subValDashboard.view.enable === false ? 'pe-none' : ''} text-success action-button`}><i className="mdi mdi-eye font-size-18"></i></a>

                </div>
            //  }
            ,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const handlePageChange = (page) => {
        GetTimeActivity()   
        setCurrentPage(page);
    };

    const handlePerRowsChange = (newPerPage) => {
        GetTimeActivity()   
        setRowsPerPage(newPerPage);
    };

    const handleClientSearchView = (e, id) => {
        GetTimeActivity()   
        console.log('id', id)
        // console.log('data',data)
        for (let key in data) {

            if (data.hasOwnProperty(key) && data[key]._id === id) {
                // console.log("data id", id);
                setViewClientSearch(data[key]);
                console.log("data-->", data[key]);
                setClick(true);

            }
        }
    };


    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        setRoute("clientsearch")
        setActiveMenuId(300050)
        setActiveMenuObj({
            "Client Management": false,
            "Reports": true
        })

        userActivity();
    }, []);
    const userActivity = () => {

        let path = window.location.pathname.split("/");
        const pageName = path[path.length - 1];
        var presentTime = moment();
        let payload;

        payload = {
            "userid": localStorage.getItem("userId"),
            "pagename": pageName,
            "pageurl": window.location.href,
            "starttime": presentTime,
            "useragent": JSON.parse(localStorage.getItem("loc"))

        };


        const previousId = localStorage.getItem("previousid");
        const urlLink = lambda + '/useractivity?appname=' + appname + (previousId ? "&previousid=" + previousId : "");


        axios({
            method: 'POST',
            url: urlLink,
            data: payload
        })
            .then(function (response) {
                if (response.data.statusCode === 200) {
                    localStorage.setItem("previousid", response.data.result)
                }
            });
    }
    useEffect(() => {


        console.log("trueeeeeeeeee", searchedFlag);
        if (searchedFlag) {

            handleSearch();
        } else {
            console.log("called get all deals")
            getClientSearch();
        }

    }, [searchedFlag]);


    const getClientSearch = async (e) => {
        GetTimeActivity()   
        setIsLoading(true)
        const token = localStorage.getItem("token")
        axios({
            method: 'POST',
            url: lambda + '/clientSearch?appname=' + appname + "&token=" + token + "&userid=" + localStorage.getItem("userId"),
        })
            .then(function (response) {
                console.log("response", response);
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setData(response.data.result.result);
                    setContent(response.data.result);
                    setIsLoading(false);
                    setClientSearch("");
                    setSearchedFlag(false);
                }

            });

    }





    const validate = () => {
        GetTimeActivity()   
        let flag = true
        if (fromdate && todate) {
            if (new Date(fromdate) > new Date(todate)) {
                setRangeError(true)
                flag = false;
            } else {
                setRangeError(false)
            }
        }
        return flag
    }

    const handleSearch = (e, flagggg) => {
        GetTimeActivity()   
        const valid = validate()
        if(valid){
         setIsLoading(true)

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const urlLink = lambda + '/clientSearch?appname=' + appname +
            (fromdate ? `&searchedFrom=${fromdate}` : "") +
            (todate ? `&searchedTo=${todate}` : "") +
            (clientsearch ? `&search=${clientsearch}` : "") +
            `&token=${token}` +
            `&userid=${userId}`;
        axios({
            method: 'POST',
            url: urlLink,
        })
            .then(function (response) {
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    console.log("response", response);
                    setCurrentPage(1)
                    setData(response.data.result.result);
                    setContent(response.data.result);
                    setIsLoading(false)
                }
            });
        }
        else{

        }
    }

    const handleChange = (e) => {
        GetTimeActivity()   
        setClientSearch(e.target.value)
    }


    const handleKeypress = (e) => {
        //it triggers by pressing the enter key
        GetTimeActivity()   
        if ((e.key === "Enter")) {
            setTimeout(function () {
                handleSearch();
            }, 1000);
        }
    };

    const clearSearch = () => {
        GetTimeActivity()   
        setClientSearch("");
        getClientSearch();
        setcurrentPage(1);
        setToDate("");
        setRangeError(false);
        setFromDate("")
    }

    const customNoRecords = () => {
        return (

            <div className="empty-state-body empty-record"  >
                <div className="empty-state__message">
                    <span className="material-icons">summarize</span>
                    <p className="form-check font-size-16">No clients were found for the searched keyword</p>
                </div> </div>
        )
    }

    return (
        <>
            {showSessionPopupup && <SessionPopup />}
            <div id="layout-wrapper">
                <Header />
                <Sidebar />
                {click ? (<ViewClientSearchDynamic data={viewClientSearch} click={click} setClick={setClick} />) :
                    <div className="main-content user-management clients clients-search">

                        <div className="page-content">
                            <div className="container-fluid">



                                <div className="row mb-4 breadcrumb">
                                    <div className="col-lg-12">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <h4 className="mb-2 card-title">Client Search</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row table-data">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="row mb-2">
                                                    <div className="col-sm-4">

                                                    </div>
                                                    <div className="col-sm-8">

                                                        <div className="search-box mb-2 d-inline-block">
                                                            <div className="position-relative">
                                                                <input type="text" className="form-control" placeholder="Search name or type" value={clientsearch} onChange={(e) => handleChange(e)} onKeyPress={handleKeypress} />
                                                            
                                                                <div className="input-daterange input-group" id="datepicker6" data-date-format="dd M, yyyy" data-date-autoclose="true" data-provide="datepicker" data-date-container='#datepicker6'>

                                                                    <Tooltip title="From Date" placement="top">
                                                                        <input type="date" className="form-control date-input" name="availableFrom" placeholder="From Date" value={fromdate} onChange={(e) => {setFromDate(e.target.value);setRangeError(false)}} max={new Date().toISOString().split('T')[0]} />
                                                                    </Tooltip>


                                                                    <Tooltip title="To Date"   placement="top">
                                                                    <input type="date" className="form-control date-input" name="availableTo" placeholder="To Date" value={todate} onChange={(e) => {setToDate(e.target.value);setRangeError(false)}} max={new Date().toISOString().split('T')[0]} />
                                                                    </Tooltip>
                                                                 
                                                                </div>
                                                                <button className="fill_btn" onClick={(e) => handleSearch(e, "normalsearch")}><span className="material-icons search-icon"
                                                                >search</span></button>
                                                                 

                                                            </div>
                                                          
                                                            <div className="dataTables_length" id="datatable_length">
                                                                <button className="fill_btn" onClick={clearSearch}><span className="material-icons-outlined">sync</span>Reset</button>
                                                            </div>


                                                        </div>
                                                       
                                                        <div className="text-sm-end">
                                                        {rangeError && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>To date cannot be earlier than From date</span>}
                                                        </div>
                                                    </div>
                                                </div>

                                                < DataTable key={keyForRerender}
                                                    // title=""
                                                    columns={columns}
                                                    // className="table align-middle table-nowrap table-check"
                                                    keyField='_id'
                                                    data={data}
                                                    direction="auto"
                                                    highlightOnHover
                                                    fixedHeaderScrollHeight="300px"
                                                    pagination
                                                    responsive
                                                    persistTableHead
                                                    // selectableRowsVisibleOnly
                                                    striped
                                                    // selectableRowsHighlight
                                                    // selectableRows
                                                    subHeaderAlign="right"
                                                    defaultSortField="name"
                                                    subHeaderWra
                                                    noDataComponent={customNoRecords()}
                                                    paginationTotalRows={data.length}
                                                    onChangeRowsPerPage={handlePerRowsChange}
                                                    onChangePage={handlePageChange}
                                                    paginationPerPage={rowsPerPage}
                                                    paginationDefaultPage={currentPageNew}
                                                    paginationRowsPerPageOptions={[15, 25, 50, 75, 100]}

                                                    paginationComponentOptions={{
                                                        rowsPerPageText: 'Per page:',
                                                        rangeSeparatorText: 'of',
                                                        noRowsPerPage: false,
                                                        selectAllRowsItem: false,
                                                        selectAllRowsItemText: 'All',
                                                    }}

                                                    progressPending={isLoading}
                                                    progressComponent={<TableLoader />}
                                                />

                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>



                        <Footer />

                    </div>
                }
            </div>
        </>
    );
};

export default ClientSearch;
