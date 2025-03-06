/***
**Module Name: Company details
 **File Name :  Company.js
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
 **Description : contains compant tables details.
 ***/

import React, { useState, useEffect, useContext } from "react";


import Footer from "../../../components/dashboard/footer";
import Header from "../../../components/dashboard/header";
import Sidebar from "../../../components/dashboard/sidebar";
import tmdbApi from "../../../api/tmdbApi";
import { useHistory, Link, useLocation } from "react-router-dom";
import moment from "moment";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';
import { contentContext } from "../../../context/contentContext";
import SessionPopup from "../../SessionPopup"
import DataTable from 'react-data-table-component';
import TableLoader from "../../../components/tableLoader";
let { lambda, appname } = window.app;



const Company = () => {
    const history = useHistory();
    const { state } = useLocation();
    const { search } = state || {};
    // const [toggle, setToggle] = useState(false);
    const [content, setContent] = useState("");
    const [success, setSuccess] = useState(false);
    // const [data, setData] = useState([]);
    const [itemsPerPage, setitemsPerPage] = useState(10);

    const [pageNumberLimit, setpageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setminPageNumberLimit] = useState(0);
    const [loaderEnable, setLoaderEnable] = useState(false);

    const [flag, setFlag] = useState(false);

    const handleClosePopup = () => setShowPopup(false);

    const [arrowdir, setArrowDir] = useState('down');
    const [num, setNum] = useState();
    const [sortDirection, setSortDirection] = useState('asc');


    const [popup, setShowPopup] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const {searchedFlag, setSearchedFlag, isLoading, setIsLoading, sortTableAlpha, arrow, sortTableByDate, userData, companysearch, setCompanySearch, companyadvSearch, setCompanyAdvSearch, currentPage, setcurrentPage,   data, setData, rowsPerPage, setRowsPerPage, currentPageNew, setCurrentPage, route, setRoute, usePrevious ,setActiveMenuId, setActiveMenuObj,  GetTimeActivity} = useContext(contentContext)

    const validateObj = userData && userData.permissions && userData.permissions.length > 0 && userData.permissions.filter(eachItem => eachItem.menu == "Client Management")
    const subValDashboard = validateObj && validateObj[0] && validateObj[0].submenus && validateObj[0].submenus[1] && validateObj[0].submenus[1].dashboard
    
    const columns = [

        {
            name: 'Company Name',
            selector: row => row?.companyname ?? "",
            sortable: true,
        },
        {
            name: 'Email id',
            selector: row => row?.emailid ?? "",
            sortable: true,
        },
        {
            name: 'Phone number',
            selector: row => row?.phone ?? "",
            sortable: true,
        },
        {
            name: 'Company type',
            selector: row => row?.companytype ?? "",
            sortable: true,
        },
        {
            name: 'Entity',
            selector: row => row?.entity ?? "",
            sortable: true,
        },
        {
            name: 'Content type',
            selector: row => row?.contenttype ?? "",
            sortable: true,
        },
        {
            name: 'Account manager',
            selector: row => row?.accountmanager ?? "",
            sortable: true,
        },
        {
            name: 'Created on',
            selector: row => row?.created ? new Date(row?.created).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            }): "",
            sortable: true,
        },

        {
            name: <>{(subValDashboard && subValDashboard.view && subValDashboard.view.display === true) || (subValDashboard && subValDashboard.edit && subValDashboard.edit.display === true) ? 'Actions' : null}</>,
            cell: (props) =>
                //  {subValDashboard && subValDashboard.view && subValDashboard.edit && (subValDashboard.view.display === true || subValDashboard.edit.display === true) &&
                <div className="d-flex">
                    {subValDashboard && subValDashboard.view && subValDashboard.view.display === true &&
                        <a onClick={e => handleViewCompany(e, props.companyid)} className={`${subValDashboard && subValDashboard.view && subValDashboard.view.enable === false ? 'pe-none' : ''} text-success action-button`}><i className="mdi mdi-eye font-size-18"></i></a>}
                    {subValDashboard && subValDashboard.edit && subValDashboard.edit.display === true &&
                        <a onClick={e => handleEditCompany(e, props.companyid)} className={`${subValDashboard && subValDashboard.edit && subValDashboard.edit.enable === false ? 'pe-none' : ''} text-danger action-button`}><i className="mdi mdi-pencil font-size-18"></i></a>}
                </div>
            //  }
            ,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];
    const prevRoute = usePrevious(route)
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
            setCurrentPage(1)
            setRowsPerPage(15)
            setCompanyAdvSearch({})
            setSearchedFlag(false);
            setCompanySearch("");
        }
    }, [prevRoute]);
    const keyForRerender = `${rowsPerPage}_${data.length}`;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = (newPerPage) => {
        setRowsPerPage(newPerPage);
    };


    const handleShowPopup = () => {
        setShowPopup(true);
    };


   


 



    useEffect(() => {

        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        setRoute("company")
        setActiveMenuId(300002)
        setActiveMenuObj({
            "Client Management": true,
            "Reports": false
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
      

        console.log("trueeeeeeeeee",searchedFlag);
        if (searchedFlag) { 
            console.log("came") 
            handleSearch();
        } else {
            console.log("called get all deals") 
            Companies();
        }

    }, [searchedFlag]);

    const Companies = async (e) => {
        GetTimeActivity()   
        const token = localStorage.getItem("token")
        const userid = localStorage.getItem("userId")

        //  setcurrentPage(1);
        setIsLoading(true);
        axios({
            method: 'POST',
            url: lambda + '/companies?appname=' + appname + "&token=" + token + "&userid=" + userid,
        })
            .then(function (response) {
                // console.log("response", response.data.result.data);
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setData(response.data.result.data);
                    setContent(response.data.result)
                    setIsLoading(false);
                    setCompanySearch("");
                    setSearchedFlag(false);
                }
            });
    }




    const handleAdd = () => {
        GetTimeActivity()   
        history.push("/addcompany")
    }
    const handleSearch = (e, flagggg) => {
        GetTimeActivity()   
        setLoaderEnable(true)

        if(flagggg === "normalsearch" || flagggg === "click"){
            setSearchedFlag(true)
       }

        if (flagggg === "" || flagggg === undefined) {
            setIsLoading(true)
        }
        setFlag(true)
        if (companysearch === "" && companyadvSearch.length <= 0) {
            Companies();
        }
        else {
            if (flagggg === "normalsearch") {
                setIsLoading(true)
            }
            const token = localStorage.getItem("token")
            const userid = localStorage.getItem("userId")

            let urlLink;
            if (companysearch) {
                urlLink = lambda + '/companies?appname=' + appname + "&search=" + companysearch + "&token=" + token + "&userid=" + userid
            } else {
                urlLink = lambda + '/companies?appname=' + appname + "&token=" + token + "&userid=" + userid
            }
            axios({
                method: 'POST',
                url: urlLink,
                data: companyadvSearch,
            })
                .then(function (response) {
                    if (response.data.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                        setIsLoading(false)
                        setShowPopup(false)
                    } else {
                        // console.log("response", response);
                        setData(response.data.result.data);
                        setContent(response.data.result);
                        setIsLoading(false);
                        setShowPopup(false)
                        setLoaderEnable(false);
                        if (flagggg === "click") {
                            setCompanySearch("")
                        }
                    }
                });
        }
    }
    function onConfirm() {
        GetTimeActivity()   
        setSuccess(false);

    };
    const handleChange = (e) => {
        if (e.target.value === "") {
            //Companies();
            setFlag(false)
        }
        setCompanySearch(e.target.value)
    }

    const handleEditCompany = (e, id) => {
        GetTimeActivity()   
        history.push("/editcompany/" + id);
    }
    const handleViewCompany = (e, id) => {
        GetTimeActivity()   
        history.push("/viewcompany/" + id);
    }
    const handleKeypress = (e) => {
        GetTimeActivity()   
        //it triggers by pressing the enter key

        if ((e.key === "Enter")) {
            setTimeout(function () {
                handleSearch();
            }, 100);
        }
    };

    const clearSearch = () => {
        GetTimeActivity()   
        setCompanySearch("");
        Companies();
        setCompanyAdvSearch({})
        setcurrentPage(1);
    }
    const clearadvSearch = () => {
        GetTimeActivity()   
        setCompanyAdvSearch({ ...companyadvSearch,companyname:"",emailid:"",phone:"",companytype:"",entity:"",contenttype:"",accountmanager:"",created:"",status:"" })
    }
    const handleAdvChange = (e) => {
          GetTimeActivity()   
        setCompanyAdvSearch({ ...companyadvSearch, [e.target.name]: e.target.value });
    }

    const customNoRecords = () => {
        return(
            
            <div className="empty-state-body empty-record"  >
                <div className="empty-state__message">
                    <span className="material-icons">summarize</span>
                    <p className="form-check font-size-16">No companies were found with the searched keyword</p>
                </div> </div>
        )
    }
 
   
    // console.log("companyadvSearch", companyadvSearch);
    return (
        <>
            {showSessionPopupup && <SessionPopup />}
            <div id="layout-wrapper">
                <Header />
                <Sidebar />

                <div className="main-content user-management clients company">

                    <div className="page-content">
                        <div className="container-fluid">



                            <div className="row mb-4 breadcrumb">
                                <div className="col-lg-12">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1">
                                            <h4 className="mb-2 card-title">Company</h4>
                                            {/* <p className="menu-path">Client Management / <b>Company</b></p> */}
                                        </div>
                                        {subValDashboard && subValDashboard.add && subValDashboard.add.display === true &&
                                            <div>
                                                <button onClick={handleAdd} className="btn btn-primary" disabled={subValDashboard && subValDashboard.add && subValDashboard.add.enable === false}>ADD COMPANY</button>
                                            </div>}
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
                                                            <input type="text" className="form-control" value={companysearch} onChange={(e) => handleChange(e)} onKeyPress={handleKeypress} placeholder="Search by Name or Email" />
                                                            <button className="fill_btn" onClick={(e) => handleSearch(e,"normalsearch")}><span className="material-icons search-icon">search</span></button>
                                                        </div>
                                                        <div className="dataTables_length" id="datatable_length">
                                                            <button className="fill_btn" onClick={handleShowPopup}>Advanced Search</button>
                                                        </div>
                                                        <div className="dataTables_length" id="datatable_length">
                                                            <button className="fill_btn" onClick={clearSearch}><span className="material-icons-outlined">sync</span>Reset</button>
                                                        </div>

                                                    </div>
                                                    <div className="text-sm-end">

                                                    </div>
                                                </div>
                                            </div>

                                                  < DataTable  key={keyForRerender}
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
                                                paginationRowsPerPageOptions={[15,25,50,75,100]}
                                          
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
                    <SweetAlert show={success}
                        custom
                        confirmBtnText="ok"
                        confirmBtnBsStyle="primary"
                        title={"No Results Found"}
                        onConfirm={e => onConfirm()}
                    >
                    </SweetAlert>
                    <Modal className="advance-search search-popup" show={popup} onHide={handleClosePopup} backdrop="static">
                        <Modal.Header closeButton>
                            <Modal.Title>Advanced Search</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">COMPANY NAME</label>
                                            <input className="form-control" placeholder="Enter Name" type="text" name="companyname"
                                                value={companyadvSearch.companyname} onChange={(e) => handleAdvChange(e)}
                                                id="example-text-input" />

                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">EMAIL ID</label>
                                            <input className="form-control" placeholder="Enter email id" name="emailid" type="email"
                                                value={companyadvSearch.emailid} onChange={(e) => handleAdvChange(e)}
                                                id="example-email-input" />



                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">PHONE NUMBER</label>
                                            <div className="country-code">
                                                <input className="form-control" type="tel" name="phone" placeholder="Enter Phone Number"
                                                    value={companyadvSearch.phone} onChange={(e) => handleAdvChange(e)}
                                                    maxLength="10" id="example-tel-input" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">COMPANY Type</label>

                                            <select className="form-select" name="companytype"
                                                value={companyadvSearch.companytype} onChange={(e) => handleAdvChange(e)}
                                            >
                                                <option value="">Select Type</option>
                                                <option>ONLINE</option>
                                                <option>OFFLINE</option>

                                            </select>

                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">entity</label>

                                            <select className="form-select" name="entity"
                                                value={companyadvSearch.entity} onChange={(e) => handleAdvChange(e)}
                                            >
                                                <option value="">Select Entity</option>
                                                <option>INDIVIDUAL</option>
                                                <option>COMPANY</option>

                                            </select>

                                        </div>
                                    </div>




                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">Content Type</label>

                                            <select className="form-select" name="contenttype"
                                                value={companyadvSearch.contenttype} onChange={(e) => handleAdvChange(e)}
                                            >
                                                <option value="">Select content type</option>
                                                <option>OWNER</option>
                                                <option>DISTRIBUTOR</option>
                                                <option>OWNER & DISTRIBUTOR</option>
                                                <option>BUYER</option>
                                                <option>AGENT</option>
                                                <option>OTHER</option>
                                            </select>

                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">Account Manager</label>
                                            <input className="form-control" placeholder="Enter Name" type="text" name="accountmanager"
                                                value={companyadvSearch.accountmanager} onChange={(e) => handleAdvChange(e)}
                                                id="example-text-input" />

                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">Created On</label>
                                            <input id="rights1" name="created" placeholder="dd-mm-yyyy" type="date" className="form-control" value={companyadvSearch.created} onChange={(e) => handleAdvChange(e)} max={new Date().toISOString().split('T')[0]}/>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">Status</label>

                                            <select className="form-select" name="status"
                                                value={companyadvSearch.status} onChange={(e) => handleAdvChange(e)}
                                            >
                                                <option value="">Select Status</option>
                                                <option value="INACTIVE">Inactive</option>
                                                <option value="ACTIVE">Active</option>
                                            </select>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="adv_footer">
                                <button className="fill_btn yellow-gradient reset-btn" onClick={clearadvSearch}><span className="material-icons-outlined">sync</span>Reset</button>

                                <button
                                    onClick={(e) => handleSearch(e, "click")}
                                // className={`fill_btn yellow-gradient float-end ${Object.keys(searchPayload).length == 0 ? "disable" : ""}`} disabled={Object.keys(searchPayload).length == 0} 
                                >
                                    {loaderEnable ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}  SEARCH
                                </button>

                                <div className="clearfix"></div>
                            </div>
                        </Modal.Footer>
                    </Modal>

                    <Footer />
                </div>

            </div>
        </>
    );
};

export default Company;
