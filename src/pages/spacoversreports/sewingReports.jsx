/***
**Module Name: customers
 **File Name :  customers.js
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
 **Description : contains usermanagement details.
 ***/
import React, { useState, useEffect, useContext } from "react";


import Footer from "../../components/dashboard/footer";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import { useHistory, Link, useLocation } from "react-router-dom";
import axios from 'axios';
import tmdbApi from "../../api/tmdbApi";
import moment from "moment";
import Modal from 'react-bootstrap/Modal';
import SweetAlert from 'react-bootstrap-sweetalert';
import * as Config from "../../constants/Config";
import Loader from "../../components/loader";
import { contentContext } from "../../context/contentContext";
import SessionPopup from "../SessionPopup"
import TableLoader from "../../components/tableLoader";
import DataTable from 'react-data-table-component';

let { lambda, appname } = window.app

const SewingReports = () => {
    const history = useHistory();
    const { state } = useLocation();
    const { search } = state || {};
    const [toggle, setToggle] = useState(false);
    // const [data, setData] = useState([]);
    // const [userdata, setUserData] = useState([]);
    const [items, setItems] = useState("");
    const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setminPageNumberLimit] = useState(0);
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [flag, setFlag] = useState(false);
    const [image, setImg] = useState('');
    const [sewingsearch, setSewingSearch] = useState("");
    const [popup, setShowPopup] = useState(false);
    const [loaderEnable, setLoaderEnable] = useState(false);
    let id = localStorage.getItem("userId");
    const handleClosePopup = () => setShowPopup(false);


    // const [isLoading, setIsLoading] = useState(false); 
    const { searchedFlag, setSearchedFlag, isLoading, setIsLoading, userData, setUserData, activeMenuObj, setActiveMenuObj, sortTableAlpha, arrow, usersearch, setUserSearch, itemAdvSearch, setItemAdvSearch, currentPage, setcurrentPage, data, setData, rowsPerPage, setRowsPerPage, currentPageNew, setCurrentPage, route, setRoute, usePrevious, setActiveMenuId, GetTimeActivity } = useContext(contentContext)
    const validateObj = userData && userData.permissions && userData.permissions.length > 0 && userData.permissions.filter(eachItem => eachItem.menu == "Wholesalers")
    const subValDashboard = validateObj && validateObj[0] && validateObj[0].dashboard
    // console.log('validate obj', validateObj)

    const prevRoute = usePrevious(route)
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
            setCurrentPage(1)
            setRowsPerPage(15)
            setSearchedFlag(false);
        }
    }, [prevRoute]);
    useEffect(() => {

        if (window.site === undefined) {
            setTimeout(() => {
                if (window.site && window.site.common && window.site.common.resourcesUrl) {
                    setImg(window.site.common.resourcesUrl)
                }
            }, 1000);
        }
        if (window.site && window.site.common && window.site.common.resourcesUrl) {
            setImg(window.site.common.resourcesUrl)
        }

    }, [window.site]);
    //  console.log('prevRoute--->',prevRoute)
    //  console.log('currentRoute--->',route)

    // const columns = [

    //     {
    //         name: 'Image',
    //         cell: (props) => <img src={
    //             image + props.productimage + "?auto=compress,format&width=40"} alt='Image' />,
    //         sortable: false,
    //     },
    //     {
    //         name: 'item',
    //         selector: row => row?.productname ?? "",
    //         sortable: true,
    //     },
    //     {
    //         name: 'order id',
    //         selector: row => row && row.ordernumber,
    //         sortable: true,
    //     },
    //     {
    //         name: 'Category',
    //         selector: row => row && row.ordertype,
    //         sortable: true,
    //     },
    //     {
    //         name: 'start date',
    //         selector: row => row?.created ? moment(row?.created).format('MMM-DD-YYYY HH:mm:ss') : "",
    //         sortable: true,
    //     },
    //     {
    //         name: 'Wholesalaer',
    //         selector: row => row && row.wholesalername,
    //         sortable: true,
    //     },
    //     {
    //         name: 'customer Name',
    //         selector: row => row && row.customername,
    //         sortable: true,
    //     },
    //     {
    //         name: 'status',
    //         selector: row => row && row.status,
    //         sortable: true,
    //     },

    //     {
    //         name: 'Actions',
    //         cell: (props) =>


    //             <div className="d-flex" >
    //                 <a
    //                     onClick={e => handleViewItem(e, props.itemid)}
    //                     className="text-success action-button"><i className="mdi mdi-eye font-size-18"></i></a>


    //             </div>

    //         ,
    //         ignoreRowClick: true,
    //         allowOverflow: true,
    //         button: true,
    //     },
    // ];

    const columns = [
        {
            name: "#Order ID",
            selector: (row) => row.ordernumber,
        },

        {
            name: 'User Name',
            selector: row => row?.username,
            sortable: true,
        },

        {
            name: 'Fee per item($)',
            selector: row => row?.
                feeperitem,
            sortable: true,
        },
        {
            name: 'Total Items Completed',
            selector: row => row?.itemsCompleted,

            sortable: true,
        },
        {
            name: 'Total Fee($)',
            selector: row => row?.
                totalfee,
            sortable: true,
        },
          {
            name: <>{subValDashboard && subValDashboard.view && subValDashboard.view.display === true && 'Actions'}</>,
            cell: (props) =>
                //   {
                subValDashboard && subValDashboard.view && subValDashboard.view.display === true &&
                <div className="d-flex">
                    <a className={`${subValDashboard && subValDashboard.view && subValDashboard.view.enable === false ? 'pe-none' : ''} text-success action-button`}><i className="mdi mdi-eye font-size-18"></i></a>

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


    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        setRoute("items")
        //  GetItemsData();
        setActiveMenuId(300003)
        userActivity();

    }, []);
    useEffect(() => {


        console.log("trueeeeeeeeee", searchedFlag);
        if (searchedFlag) {
            console.log("came")
            handleSearch();
        } else {
            console.log("called get all deals")
            GetItemsData();
        }

    }, [searchedFlag]);
    const userActivity = () => {
        let path = window.location.pathname.split("/");
        const pageName = path[path.length - 1];
        var presentTime = moment();
        let payload;

        payload = {
            "userid": localStorage.getItem("userId"),
            "pagename": "ITEMS",
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
    const GetItemsData = async () => {
        GetTimeActivity()
        setIsLoading(true)
        axios({
            method: 'POST',
            url: lambda + '/sewingreport?appname=' + appname + "&token=" + localStorage.getItem("token") + "&userid=" + localStorage.getItem("userId"),

        })
            .then(function (response) {
                if (response.data.result === "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    console.log("response", response);
                    setItems(response.data.result.data);

                    console.log("dataaaaaa--->", data)
                    //  console.log("rrrrrr---->",content)
                    setIsLoading(false)
                }
            });
    };


    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }

    }, []);

    const handleViewItem = (e, id) => {
        GetTimeActivity()
        history.push("/viewItem/" + id);
    }

    const handleChange = (e) => {
        if (e.target.value === "") {
            //   User();
            setFlag(false)
        }
        setSewingSearch(e.target.value)
    }
    const handleShowPopup = () => {
        GetTimeActivity()
        setShowPopup(true);
    };

    const customNoRecords = () => {
        return (

            <div className="empty-state-body empty-record"  >
                <div className="empty-state__message">
                    <span className="material-icons">summarize</span>
                    <p className="form-check font-size-16">No items were found </p>
                </div> </div>
        )
    }
    const handleAdvChange = (e) => {
        GetTimeActivity()
        setItemAdvSearch({ ...itemAdvSearch, [e.target.name]: e.target.value });
    }
    const clearSearch = () => {
        GetTimeActivity()
        setSewingSearch("")
        console.log("itemsearch----->", sewingsearch)
        GetItemsData();
        setcurrentPage(1);
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
    function checkAdvObjectProperties(obj) {
        for (const key in obj) {
            if (itemAdvSearch[key].length > 0) {
                return false
            }

        }
        return true; // All key-value pairs exist in the object
    }
    const clearadvSearch = () => {
        GetTimeActivity()
        setItemAdvSearch({ ...itemAdvSearch, productname: "", ordertype: "", createdFrom: "", createdTo: "", wholesalername: "", customername: "", status: "" })
    }
    const handleSearch = (e, flagggg) => {
        GetTimeActivity()
        setLoaderEnable(true)
        if (flagggg === "normalsearch" || flagggg === "click") {
            setSearchedFlag(true)
        }
        setFlag(true)
        if (sewingsearch.trim() === "" && itemAdvSearch.length <= 0) {
            GetItemsData();
        }
        else {
            setIsLoading(true)
            const token = localStorage.getItem("token")
            const userid = localStorage.getItem("userId")
            let urlLink;

            urlLink = `${lambda}/sewingreport?appname=${appname}&token=${token}&userid=${userid}${sewingsearch ? `&search=${sewingsearch}` : ''}`;

            axios({
                method: 'POST',
                url: urlLink,
                data: itemAdvSearch
            })
                .then(function (response) {
                    if (response.data.result === "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                        setShowPopup(false)
                    } else {
                        setLoaderEnable(false)
                        setShowPopup(false)
                        console.log("response", response);
                        setItems(response.data.result.data);
                        setData(response.data.result.data);
                        setIsLoading(false)

                    }
                });
        }
    }
    const getCurrentDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    // console.log("showSessionPopupup",showSessionPopupup)
    console.log("search", itemAdvSearch)
    return (
        <>
            {showSessionPopupup && <SessionPopup />}
            <div id="layout-wrapper">
                <Header />
                <Sidebar />

                {/* Start right Content here  */}

                <div className="main-content user-management clients clients-search contact account-manager-report client_activity_report sewing_report">

                    <div className="page-content">
                        <div className="container-fluid">



                            <div className="row mb-4 breadcrumb">
                                <div className="col-lg-12">
                                    <div className="d-flex align-items-center">

                                        <div className="flex-grow-1">
                                            <h4 className="mb-2 card-title">Sewing Report</h4>

                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="row table-data " >
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-body">
                                            {/* <div className="col-sm-8"> */}
                                            <div className="row mb-2">
                                              <div className="col-sm-4"></div>
                                              <div className="col-sm-8">
                                            <div className="search-box mb-2 d-inline-block">
                                                <div className="position-relative">
                                                    <input type="text" className="form-control" onChange={(e) => handleChange(e)} value={sewingsearch} placeholder="Search by Sewing Name" onKeyPress={handleKeypress} />
                                                    <button className="fill_btn" onClick={(e) => handleSearch(e, "normalsearch")}><span className="material-icons search-icon" >search</span></button>
                                                </div>
                                                {/* <div className="dataTables_length" id="datatable_length">
                                                         <button className="fill_btn" onClick={handleShowPopup}>Advanced Search</button>
                                                     </div> */}
                                                <div className="dataTables_length" id="datatable_length">
                                                    <button className="fill_btn" onClick={clearSearch} ><span className="material-icons-outlined">sync</span>Reset</button>
                                                </div>
                                            </div>
                                              </div>
                                              </div>
                                            {/* </div> */}
                                            <>
                                                < DataTable
                                                    //  key={keyForRerender}
                                                    // title=""
                                                    columns={columns}
                                                    // className="table align-middle table-nowrap table-check"
                                                    keyField='_id'
                                                    data={items}
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
                                                    paginationTotalRows={items.length}
                                                    onChangeRowsPerPage={handlePerRowsChange}
                                                    onChangePage={handlePageChange}
                                                    paginationPerPage={rowsPerPage}
                                                    paginationDefaultPage={currentPageNew}
                                                    paginationRowsPerPageOptions={[15, 25, 50, 75, 100]}
                                                    // sortFunction={customSort}

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



                                            </>


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
                                            <label className="col-form-label">ITEM NAME</label>
                                            <input className="form-control" value={itemAdvSearch.productname} onChange={(e) => handleAdvChange(e)} placeholder="Enter Item Name" type="text" name="productname"

                                                id="example-text-input" />

                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">CATEGORY</label>
                                            <select className="form-select" name="ordertype"
                                                value={itemAdvSearch.ordertype} onChange={(e) => handleAdvChange(e)}
                                            >
                                                <option value="">Select Category</option>
                                                <option value="spacovers">SPA COVERS</option>
                                                <option value="spacoverslifts">SPA COVERSLIFTS</option>
                                                <option value="spaaccessories">SPA ACCESSORIES</option>
                                            </select>



                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label htmlFor="datePicker">Start Date</label>


                                            <input type="date" name="createdFrom" placeholder="startDate" className="form-control" max={getCurrentDate()} onChange={(e) => handleAdvChange(e)} value={itemAdvSearch && itemAdvSearch.createdFrom && moment(new Date(itemAdvSearch.createdFrom)).format('YYYY-MM-DD')} />

                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">END DATE</label>

                                            <input type="date" name="createdTo" placeholder="startDate" className="form-control" max={getCurrentDate()} onChange={(e) => handleAdvChange(e)} value={itemAdvSearch && itemAdvSearch.createdTo && moment(new Date(itemAdvSearch.createdTo)).format('YYYY-MM-DD')} />

                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">WHOLESALER NAME</label>
                                            <input className="form-control" placeholder="Enter Wholesaler Name" value={itemAdvSearch.wholesalername} onChange={(e) => handleAdvChange(e)} type="text" name="wholesalername" id="example-text-input" />

                                        </div>
                                    </div>




                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">CUSTOMER NAME</label>
                                            <input className="form-control" placeholder="Enter Customer Name" onChange={(e) => handleAdvChange(e)} type="text" name="customername"
                                                value={itemAdvSearch.customername}
                                                id="example-text-input" />

                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-field">
                                            <label className="col-form-label">Status</label>

                                            <select className="form-select" name="status"
                                                value={itemAdvSearch.status} onChange={(e) => handleAdvChange(e)}
                                            >
                                                <option value="">Select Status</option>
                                                <option value="APPROVED">Approved</option>
                                                <option value="CUTTINGSTARTED">Cutting Started</option>
                                                <option value="CUTTINGCOMPLETED">Cutting Completed</option>
                                                <option value="SEWINGSTARTED">Sewing Started</option>
                                                <option value="SEWINGCOMPLETED">Sewing Completed</option>
                                                <option value="DELIVERYSTARTED">Delivery Started</option>
                                                <option value="DELIVERYCOMPLETED">Delivery Completed</option>
                                            </select>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="adv_footer">

                                <button onClick={clearadvSearch} className="fill_btn yellow-gradient reset-btn" ><span className="material-icons-outlined">sync</span>Reset</button>

                                <button onClick={(e) => handleSearch(e, "click")}
                                    className={`fill_btn yellow-gradient float-end ${checkAdvObjectProperties(itemAdvSearch) ? "disable" : ""}`} disabled={checkAdvObjectProperties(itemAdvSearch)}
                                >
                                    {loaderEnable ? (<img src="https://spacovers.imgix.net/spacoversdev/common/images/rotate_right.svg" className="loading-icon" />) : null}   SEARCH
                                </button>

                                <div className="clearfix"></div>
                            </div>
                        </Modal.Footer>
                    </Modal>


                    <Footer />
                    {/* <Modal className="access-denied" show={isDelete}>
  
                          <div className="modal-body enquiry-form">
                              <div className="container">
                                  <button className="close-btn" onClick={e => onCancel()}><span className="material-icons">close</span></button>
                                  <span className="material-icons access-denied-icon">delete_outline</span>
                                  <h3>Delete</h3>
                                  <p>This action cannot be undone.</p>
                                  <p>Are you sure you want to unblock ?</p>
                                  <div className="popup-footer">
                                      <button className="fill_btn yellow-gradient" data-bs-toggle="modal" data-bs-target="#recommendModal" onClick={e => handleDelete()}> {isLoading ? (<img src={image + Config.imgloader + "rotate_right.svg"} className="loading-icon" />) : null}Yes, Delete</button>
                                  </div>
                              </div>
                          </div>
  
                      </Modal> */}

                </div>



            </div>
        </>
    );
};

export default SewingReports;
