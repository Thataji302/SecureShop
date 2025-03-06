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
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';
import Modal from 'react-bootstrap/Modal';
import moment from "moment";
import SessionPopup from "../SessionPopup"
import Loader from "../../components/loader";
import TableLoader from "../../components/tableLoader";
import { contentContext } from "../../context/contentContext";
import DataTable from 'react-data-table-component';

let { lambda, appname } = window.app;


const AllDeals = () => {
    const history = useHistory();
    const { state } = useLocation();
    const { search } = state || {};
    // const [toggle, setToggle] = useState(false);
    const [deals, setDeals] = useState("");
    const [perpage, setPerpage] = useState(10);
    const [success, setSuccess] = useState(false);
    const [loaderEnable, setLoaderEnable] = useState(false);
    // const [data, setData] = useState([]);

    //const [currentPage, setcurrentPage] = useState(1);

    const [dealsmsg, setDealsMsg] = useState("");

    // const [isLoading, setIsLoading] = useState(false);
    const [flag, setFlag] = useState(false);
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);


    // const [paginationnumber, setPagintionNumber] = useState({});

    const [popup, setShowPopup] = useState(false);

    const handleClosePopup = () => setShowPopup(false);
    const [sortDirection, setSortDirection] = useState('asc');
    const [arrowdir, setArrowDir] = useState('down');
    const [num, setNum] = useState();

    const {searchedFlag, setSearchedFlag, isLoading, setIsLoading, sortTableAlpha, arrow, sortTableByDate, userData, dealsearch, setDealSearch, dealsadvSearch, setDealsAdvSearch, currentPage, setcurrentPage, data, setData, rowsPerPage, setRowsPerPage, currentPageNew, setCurrentPage, route, setRoute, usePrevious, setActiveMenuId, GetTimeActivity } = useContext(contentContext)


    const prevRoute = usePrevious(route)
    const validateObj = userData && userData.permissions && userData.permissions.length > 0 && userData.permissions.filter(eachItem => eachItem.menu == "Deal Management")
    const subValDashboard = validateObj && validateObj[0] && validateObj[0].dashboard
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
            setCurrentPage(1)
            setRowsPerPage(15)
            setDealsAdvSearch({})
            setSearchedFlag(false);
            setDealSearch("")
            
        }
        console.log("prevRoute",prevRoute,route);
       
    }, [prevRoute]);
    const keyForRerender = `${rowsPerPage}_${data.length}`;
    //  console.log('prevRoute--->',prevRoute)
    //  console.log('currentRoute--->',route)

    const columns = [

        {
            name: 'Name',
            selector: row => row?.clientname ?? "",
            sortable: true,
        },
        {
            name: 'Type',
            cell: (props) => <button type="button" className="btn btn-primary btn-sm btn-rounded " data-bs-toggle="modal" data-bs-target=".orderdetailsModal">
                {props.clienttype === "BUYER" ? <span className="material-icons-outlined text-primary"> local_mall</span> : props.clienttype === "SELLER" ? <span className="material-icons-outlined text-danger"> storefront</span> : <span className="material-icons-outlined text-success"> group </span>}
                {props.clienttype}
            </button>,
            sortable: false,
        },
        {
            name: 'Enquired On',
            // selector: row => moment(row.created).utc().format("DD-MMM-YYYY HH:mm"),
            selector: row => row.created != undefined ? new Date(row.created).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            }):'',
            sortable: true,
        },
        {
            name: 'Followed On',
            // selector: row => moment(row.updated).utc().format("DD-MMM-YYYY HH:mm"),
            selector: row => row.updated != undefined ?  new Date(row.updated).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            }) :'',
            sortable: true,
        },
        {
            name: 'Comments',
            selector: row => row?.comments ?? '',
            // cell: (props) => <div className="text-elipsis">{props.comments}</div>,
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
                //   {
                subValDashboard && subValDashboard.view && subValDashboard.view.display === true &&

                <div className="d-flex">
                    {subValDashboard && subValDashboard.view && subValDashboard.view.display === true &&
                        <a onClick={e => handleViewDeal(e, props.enquiryid)} className={`${subValDashboard && subValDashboard.view && subValDashboard.view.enable === false ? 'pe-none' : ''} text-success action-button`}><i className="mdi mdi-eye font-size-18"></i></a>}
                    {subValDashboard && subValDashboard.edit && subValDashboard.edit.display === true &&
                        <a onClick={e => handleEditDeal(e, props.enquiryid)} className={`${subValDashboard && subValDashboard.edit && subValDashboard.edit.enable === false ? 'pe-none' : ''} text-danger action-button`}><i className="mdi mdi-pencil font-size-18"></i></a>}
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






    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        setActiveMenuId(200003)
        setRoute("deal")

        // console.log("trueeeeeeeeee",searchedFlag);
        // if (searchedFlag) { 
        //     console.log("came") 
        //     handleSearch();
        // } else {
        //     console.log("called get all deals") 
        //     getAllDeals();
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
            getAllDeals();
        }

    }, [searchedFlag]);


    const getAllDeals = async () => {
        GetTimeActivity() 
        setIsLoading(true)
        const token = localStorage.getItem("token")

      
        const linkUrl = `${lambda}/clientenquiry?appname=${appname}&userid=${localStorage.getItem("userId")}&token=${token}`;

        axios({
            method: 'POST',
            url: linkUrl,
        })
            .then(function (response) {
                // console.log("resssss", response)
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setData(response.data.result.data);
                    setDeals(response.data.result);
                    setIsLoading(false);
                    setDealSearch("");
                    setSearchedFlag(false);
                }
            });

    };






    const handleEditDeal = (e, id) => {
        GetTimeActivity() 
        history.push("/editdeals/" + id);
    }

    const handleViewDeal = (e, id) => {
        GetTimeActivity() 
        history.push("/viewdeals/" + id);
    }

    const handleSearch = (e, flagggg) => {
        GetTimeActivity() 

        setLoaderEnable(true)

        // if (flagggg) {
        //     setCurrentPage(1);
        // }
       if(flagggg === "normalsearch" || flagggg === "click"){
            setSearchedFlag(true)
       }

        setFlag(true)
        if (dealsearch === "" && dealsadvSearch.length <= 0) {
            getAllDeals();
        }
        else {
            if (flagggg === "normalsearch") {
                setIsLoading(true)
            }
            const token = localStorage.getItem("token")
            let urlLink;
            if (dealsearch) {
                urlLink = lambda + '/clientenquiry?appname=' + appname + "&userid=" + localStorage.getItem("userId") + "&search=" + dealsearch + "&token=" + token
            } else {
                urlLink = lambda + '/clientenquiry?appname=' + appname + "&userid=" + localStorage.getItem("userId") + "&token=" + token
            }
            axios({
                method: 'POST',
                url: urlLink,
                data: dealsadvSearch,
            })
                .then(function (response) {
                    if (response.data.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                        setShowPopup(false)
                        setLoaderEnable(false)
                    } else {
                        // console.log("response", response);
                        setDeals(response.data.result);
                        setData(response.data.result.data);
                        setIsLoading(false)
                        setShowPopup(false)
                        setLoaderEnable(false);
                        if (flagggg === "click") {
                            setDealSearch("")
                        }
                    }
                });
        }
    }

    const handleChange = (e) => {
        // console.log(e.target.value)
        if (e.target.value === "") {
            // getAllDeals();
            setFlag(false)
        }
        setDealSearch(e.target.value)
    }

    function onConfirm() {
        GetTimeActivity() 
        setSuccess(false);
        setDealSearch("")
    };
    const handleAddDeal = (e) => {
        GetTimeActivity() 
        history.push("/createdeal")
    }
    const clearSearch = () => {
        GetTimeActivity() 
        setDealSearch("");
        getAllDeals();
        setDealsAdvSearch({})
        setcurrentPage(1);
        setSearchedFlag(false)
        localStorage.removeItem("deals")
    }
    const clearAdvSearch = () => {
        GetTimeActivity() 
        setDealsAdvSearch({ ...dealsadvSearch, clientname: "", clienttype: "", created: "", updated: "", status: "", comments: "" })
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

    const handleAdvChange = (e) => {
        GetTimeActivity() 
        setDealsAdvSearch({ ...dealsadvSearch, [e.target.name]: e.target.value });
    }
    const customNoRecords = () => {
        return (

            <div className="empty-state-body empty-record"  >
                <div className="empty-state__message">
                    <span className="material-icons">summarize</span>
                    <p className="form-check font-size-16">No deals were found for the searched keyword</p>
                </div> </div>
        )
    }

    const customNoRecordsMessage = () => {
        return (

            <div className="empty-state-body empty-record"  >
                <div className="empty-state__message">
                    <span className="material-icons">summarize</span>
                    <p className="form-check font-size-16">No deals were found</p>
                </div> </div>
        )
    }

    // console.log("deals", data[0]?.message)

    return (
        <>
            {showSessionPopupup && <SessionPopup />}
            <div id="layout-wrapper">
                <Header />
                <Sidebar />

                <div className="main-content user-management clients deals">

                    <div className="page-content">
                        <div className="container-fluid">



                            <div className="row mb-4 breadcrumb">
                                <div className="col-lg-12">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1">
                                            <h4 className="mb-2 card-title">All Deals</h4>

                                        </div>
                                        {subValDashboard && subValDashboard.add && subValDashboard.add.display === true &&
                                            <div>
                                                <button onClick={handleAddDeal} className="btn btn-primary" disabled={subValDashboard && subValDashboard.add && subValDashboard.add.enable === false}>add Deal</button>
                                            </div>
                                        }
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
                                                                <input type="text" className="form-control" value={dealsearch}
                                                                    onChange={(e) => handleChange(e)}
                                                                    placeholder="Search by Name" onKeyPress={handleKeypress} />
                                                                <button onClick={(e) => handleSearch(e,"normalsearch")} className="fill_btn"><span className="material-icons search-icon">search</span></button>
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

                                                {data[0]?.message === "ContentEnquiry Data not available" ? customNoRecordsMessage() :

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
                                                    paginationTotalRows={data && data.length}
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

                                                }

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
                                            <label className="col-form-label">NAME</label>
                                            <input className="form-control" placeholder="Enter Name" type="text" name="clientname"
                                                value={dealsadvSearch.clientname} onChange={(e) => handleAdvChange(e)}
                                                id="example-text-input" />

                                        </div>
                                    </div>



                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">Type</label>

                                            <select className="form-select" name="clienttype"
                                                value={dealsadvSearch.clienttype} onChange={(e) => handleAdvChange(e)}
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
                                            <label className="col-form-label">ENQUIRED ON</label>
                                            <input id="rights1" name="created" placeholder="dd-mm-yyyy" type="date" className="form-control"
                                                value={dealsadvSearch.created} onChange={(e) => handleAdvChange(e)} max={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                    </div>


                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">FOLLOWED ON</label>
                                            <input id="rights1" name="updated" placeholder="dd-mm-yyyy" type="date" className="form-control"
                                                value={dealsadvSearch.updated} onChange={(e) => handleAdvChange(e)} max={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">comments</label>
                                            <input className="form-control" placeholder="Enter Comments" type="text" name="comments"
                                                value={dealsadvSearch.comments} onChange={(e) => handleAdvChange(e)}
                                                id="example-text-input" />

                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">Status</label>

                                            <select className="form-select" name="status"
                                                value={dealsadvSearch.status} onChange={(e) => handleAdvChange(e)}
                                            >
                                                <option value="">Select Status</option>
                                                <option value="NEW">NEW</option>
                                                <option value="INPROGRESS">INPROGRESS</option>
                                                <option value="PARTIALLY CLOSED">PARTIALLY CLOSED</option>
                                                <option value="CLOSED">CLOSED</option>
                                                <option value="SUCCESSFULLY CLOSED">SUCCESSFULLY CLOSED</option>
                                            </select>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>

                            <div className="adv_footer">
                                <button className="fill_btn yellow-gradient reset-btn" onClick={clearAdvSearch}><span className="material-icons-outlined">sync</span>Reset</button>

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

export default AllDeals;
