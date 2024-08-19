/***
**Module Name: client
 **File Name :  client.js
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
 **Description : contains clients table details.
 ***/
import React, { useState, useEffect, useContext } from "react";
import Footer from "../../components/dashboard/footer";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import tmdbApi from "../../api/tmdbApi";
import { useHistory, Link, useLocation } from "react-router-dom";
import moment from "moment";
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import TableLoader from "../../components/tableLoader";

import { contentContext } from "../../context/contentContext";
import * as Config from "../../constants/Config";
import SweetAlert from 'react-bootstrap-sweetalert';
import SessionPopup from "../SessionPopup"
import DataTable from 'react-data-table-component';
let { lambda, country, appname } = window.app;


const Client = () => {
    const history = useHistory();
    const { state } = useLocation();
    const { search } = state || {};
    // const [toggle, setToggle] = useState(false);
    const [content, setContent] = useState("");
    const [perpage, setPerpage] = useState(10);
    const [loaderEnable, setLoaderEnable] = useState(false);
    // const [data, setData] = useState([]);



    const [countries, setCountries] = useState('');
    const [itemsPerPage, setitemsPerPage] = useState(10);

    const [pageNumberLimit, setpageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

    const [flag, setFlag] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);

    const [popup, setShowPopup] = useState(false);
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);

    const handleClosePopup = () => setShowPopup(false);
    const [arrowdir, setArrowDir] = useState('down');
    const [num, setNum] = useState();
    const [sortDirection, setSortDirection] = useState('asc');


    const {searchedFlag, setSearchedFlag, isLoading, setIsLoading, sortTableAlpha, arrow, sortTableByDate, userData, clientmanagesearch, setClientMangeSearch, clientAdvSearch, setClientAdvSearch,   data, setData, rowsPerPage, setRowsPerPage, currentPageNew, setCurrentPage, route,setActiveMenuObj,activeMenuObj, setRoute, usePrevious ,setActiveMenuId,GetTimeActivity} = useContext(contentContext)
    const validateObj = userData && userData.permissions && userData.permissions.length > 0 && userData.permissions.filter(eachItem => eachItem.menu == "Client Management")
    const subValDashboard = validateObj && validateObj[0] && validateObj[0].submenus && validateObj[0].submenus[0] && validateObj[0].submenus[0].dashboard
    const prevRoute = usePrevious(route)
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
            setCurrentPage(1)
            setRowsPerPage(15)
            setClientAdvSearch({})
            setSearchedFlag(false);
            setClientMangeSearch("");
        }
    }, [prevRoute]);
    //  console.log('prevRoute--->',prevRoute)
    //  console.log('currentRoute--->',route)
    const keyForRerender = `${rowsPerPage}_${data.length}`;
    const columns = [

        {
            name: 'Name',
            selector: row => row?.name ?? "",
            sortable: true,
        },
        {
            name: 'Type',
            selector: row => row?.type ?? "",
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row?.personalemail ?? "",
            sortable: true,
        },
        {
            name: 'Phone Number',
            selector: row => row?.personalphone ?? "",
            sortable: true,
        },
        {
            name: 'ACCOUNT MANAGER',
            // selector: row => row && row.companydetails && row.companydetails[0] && row.companydetails[0].accountmanager && row?.companydetails[0]?.accountmanager && row?.companydetails[0]?.accountmanager != undefined && row?.companydetails[0]?.accountmanager != "" ? row?.companydetails[0]?.accountmanager : "",
            selector: row => row?.companydetails?.[0]?.accountmanager ?? '',
 
            sortable: true,
        },
        {
            name: 'Entity',
            selector: row => row?.entity ?? "",
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
            }):"",
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row?.status ?? "",
            sortable: true,
        },

        {
            name: <>{(subValDashboard && subValDashboard.view && subValDashboard.view.display === true) || (subValDashboard && subValDashboard.edit && subValDashboard.edit.display === true) ? 'Actions' : null}</>,
            cell: (props) =>
                //  {
                //      subValDashboard && subValDashboard.view && subValDashboard.edit && (subValDashboard.view.display === true || subValDashboard.edit.display === true) &&
                <div className="d-flex">
                    {subValDashboard && subValDashboard.view && subValDashboard.view.display === true &&
                        <a onClick={e => handleViewClient(e, props.clientid)} className={`${subValDashboard && subValDashboard.view && subValDashboard.view.enable === false ? 'pe-none' : ''} text-success action-button`}><i className="mdi mdi-eye font-size-18"></i></a>}
                    {subValDashboard && subValDashboard.edit && subValDashboard.edit.display === true &&
                        <a onClick={e => handleEditClient(e, props.clientid)} className={`${subValDashboard && subValDashboard.edit && subValDashboard.edit.enable === false ? 'pe-none' : ''} text-danger action-button`}><i className="mdi mdi-pencil font-size-18"></i></a>}
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

    const handleShowPopup = () => {
        GetTimeActivity() 
        setShowPopup(true);
    };

    const handleClick = (event) => {
        GetTimeActivity() 
        setCurrentPage(Number(event.target.id));
    };

  
    // console.log('subValDashboard obj',subValDashboard)
    // const handleEditClient = (e,id) => {  
    //     history.push("/editclient/" + id);
    //  }

    const pages = [];
    for (let i = 1; i <= Math.ceil(content.totalClients / itemsPerPage); i++) {
        pages.push(i);
    }





    useEffect(() => {

        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        setRoute("client")
        setActiveMenuId(300001)
       
        setActiveMenuObj({
            "Client Management": true,
            "Reports": false
        })
        // if (search === true) {
        //     handleSearch();

        // } else {
        //     client();
        //     GetCountries();
        // }
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
            client();
            GetCountries();
        }

    }, [searchedFlag]);
    const GetCountries = async () => {
        try {

            const response = await tmdbApi.getLookUp({
                "type": ["country"],
                 "sortBy": "alpha3",
                "projection":"tiny"
            });


            setCountries(response.result.data);
        } catch {
            console.log("error");
        }
    };

    const client = (e) => {
        GetTimeActivity() 
        let page = 1;
        //  setCurrentPage(1);
        setIsLoading(true);
        const token = localStorage.getItem("token")
        const userid = localStorage.getItem("userId")

        axios({
            method: 'POST',
            url: lambda + '/clients?appname=' + appname + "&token=" + token + "&userid=" + userid,
        })
            .then(function (response) {
                // console.log("response", response.data.result.data);
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setData(response.data.result.data);
                    setContent(response.data.result);
                    setIsLoading(false);
                    setClientMangeSearch("");
                    setSearchedFlag(false);
                }

            });
    }



  
    const handleAdd = () => {
        GetTimeActivity() 
        history.push("/addclient")
    }
    const handleSearch = (e, flagggg) => {
        GetTimeActivity() 
        setLoaderEnable(true)


        setFlag(true)
        if(flagggg === "normalsearch" || flagggg === "click"){
            setSearchedFlag(true)
       }

        if (clientmanagesearch === "" && clientAdvSearch.length <= 0) {
            client();
        }

        else {

            const token = localStorage.getItem("token")
            const userid = localStorage.getItem("userId")
            if (flagggg === "normalsearch") {
                setIsLoading(true)
            } 
            let urlLink;
            if (clientmanagesearch) {
                urlLink = lambda + '/clients?appname=' + appname + "&search=" + clientmanagesearch + "&token=" + token+ "&userid=" + userid
            } else {
                urlLink = lambda + '/clients?appname=' + appname + "&token=" + token + "&userid=" + userid
            }
            axios({
                method: 'POST',
                url: urlLink,
                data: clientAdvSearch,
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
                            setClientMangeSearch("")
                        }
                    }
                });
        }
    }

    const handleChange = (e) => {
        if (e.target.value === "") {
            //client();
            setFlag(false)
        }
        setClientMangeSearch(e.target.value)
    }

    const handleKeypress = (e) => {
        GetTimeActivity() 
        //it triggers by pressing the enter key

        if ((e.key === "Enter")) {
            setTimeout(function () {
                handleSearch();
            }, 1000);
        }
    };


    const handleEditClient = (e, id) => {
        GetTimeActivity() 
        history.push("/editclient/" + id);
    }
    const handleViewClient = (e, id) => {
        GetTimeActivity() 
        history.push("/viewclient/" + id);
    }

    const clearSearch = () => {
        GetTimeActivity() 
        setClientMangeSearch("");
        setClientAdvSearch({})
        client();
    }

    const clearadvSearch = () => {
        GetTimeActivity() 
        setClientAdvSearch({...clientAdvSearch , name:"" ,personalemail:"",idc:"+91",personalphone:"",type:"",entity:"",accountmanager:"",created:"",status:""})
    }
    const handleAdvChange = (e) => {
        GetTimeActivity() 
        setClientAdvSearch({ ...clientAdvSearch, [e.target.name]: e.target.value });
    }


    const customNoRecords = () => {
        return(
            
            <div className="empty-state-body empty-record"  >
                <div className="empty-state__message">
                    <span className="material-icons">summarize</span>
                    <p className="form-check font-size-16">No clients were found for the searched keyword</p>
                </div> </div>
        )
    }
 

    // console.log("current page", currentPageNew);
    return (
        <>
            {showSessionPopupup && <SessionPopup />}
            <div id="layout-wrapper">
                <Header />
                <Sidebar />

                <div className="main-content user-management clients">

                    <div className="page-content">
                        <div className="container-fluid">



                            <div className="row mb-4 breadcrumb">
                                <div className="col-lg-12">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1">
                                            <h4 className="mb-2 card-title">CLIENT MANAGEMENT</h4>
                                            {/* <p className="menu-path">Client Management / <b>Clients</b></p> */}
                                        </div>
                                        {subValDashboard && subValDashboard.add && subValDashboard.add.display === true &&
                                            <div>
                                                <button onClick={handleAdd} className="btn btn-primary" disabled={subValDashboard && subValDashboard.add && subValDashboard.add.enable === false}>ADD CLIENT</button>
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
                                                            <input type="text" className="form-control" value={clientmanagesearch} onChange={(e) => handleChange(e)} onKeyPress={handleKeypress} placeholder="Search by Name or Email" />
                                                            <button className="fill_btn" onClick={(e) => handleSearch(e,"normalsearch")}><span className="material-icons search-icon" >search</span></button>
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

                   
                    <Modal className="advance-search search-popup" show={popup} onHide={handleClosePopup} backdrop="static">
                        <Modal.Header closeButton>
                            <Modal.Title>Advanced Search</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">NAME</label>
                                            <input className="form-control" placeholder="Enter Name" type="text" name="name"
                                                value={clientAdvSearch.name} onChange={(e) => handleAdvChange(e)}
                                                id="example-text-input" />

                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">EMAIL</label>
                                            <input className="form-control contact-number" name="personalemail" type="email" placeholder="Enter Email"
                                                value={clientAdvSearch.personalemail} onChange={(e) => handleAdvChange(e)}
                                                id="example-email-input" />



                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">contact number</label>
                                            <div className="country-code">
                                                <select name="idc" className="colorselect capitalize"
                                                    value={clientAdvSearch.idc} onChange={(e) => handleAdvChange(e)}
                                                >
                                                    <option value="+91">IND(+91)</option>
                                                    {countries && countries.length > 0 && countries.map((task, i) => {
                                                        return (
                                                            <><option key={i} value={task.alpha3}>{task.alpha3 + task.countrycode}</option></>
                                                        )
                                                    }
                                                    )}
                                                </select>

                                                <input className="form-control contact-number" type="tel" name="personalphone" placeholder="Enter Phone Number"
                                                    value={clientAdvSearch.personalphone} onChange={(e) => handleAdvChange(e)}
                                                    maxLength="10" id="example-tel-input" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">Type</label>

                                            <select className="form-select" name="type"
                                                value={clientAdvSearch.type} onChange={(e) => handleAdvChange(e)}
                                            >
                                                <option value="">Select Type</option>
                                                <option>BUYER</option>
                                                <option>SELLER</option>
                                                <option>BOTH</option>
                                            </select>

                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">entity</label>

                                            <select className="form-select" name="entity"
                                                value={clientAdvSearch.entity} onChange={(e) => handleAdvChange(e)}
                                            >
                                                <option value="">Select Entity</option>
                                                <option>INDIVIDUAL</option>
                                                <option>COMPANY</option>

                                            </select>

                                        </div>
                                    </div>




                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">Account Manager</label>
                                            <input className="form-control" placeholder="Enter Name" type="text" name="accountmanager"
                                                value={clientAdvSearch.accountmanager} onChange={(e) => handleAdvChange(e)}
                                                id="example-text-input" />

                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">Created On</label>
                                            <input id="rights1" name="created" placeholder="dd-mm-yyyy" type="date" className="form-control" value={clientAdvSearch.created} onChange={(e) => handleAdvChange(e)} max={new Date().toISOString().split('T')[0]} />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">Status</label>

                                            <select className="form-select" name="status"
                                                value={clientAdvSearch.status} onChange={(e) => handleAdvChange(e)}
                                            >
                                                <option value="">Select Status</option>
                                                <option value="PENDING APPROVAL">Pending Approval</option>
                                                <option value="INACTIVE">Inactive</option>
                                                <option value="ACTIVE">Active</option>
                                                <option value="REJECT">Reject</option>
                                            </select>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="adv_footer">

                            <button className="fill_btn yellow-gradient reset-btn" onClick={clearadvSearch}><span className="material-icons-outlined">sync</span>Reset</button>

                                <button onClick={(e) => handleSearch(e, "click")}
                                // className={`fill_btn yellow-gradient float-end ${Object.keys(searchPayload).length == 0 ? "disable" : ""}`} disabled={Object.keys(searchPayload).length == 0} 
                                >
                                    {loaderEnable ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}   SEARCH
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

export default Client;
