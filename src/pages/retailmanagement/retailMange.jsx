/***
**Module Name: retailmanagement
 **File Name :  retailmange.js
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
 **Description : contains retailmanagement details.
 ***/
import React, { useState, useEffect, useContext } from "react";


import Footer from "../../components/dashboard/footer";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import { useHistory, Link, useLocation } from "react-router-dom";
import axios from 'axios';
import tmdbApi from "../../api/tmdbApi";
import moment from "moment";

import SweetAlert from 'react-bootstrap-sweetalert';
import * as Config from "../../constants/Config";
import Loader from "../../components/loader";
import Modal from 'react-bootstrap/Modal';
import { contentContext } from "../../context/contentContext";
import SessionPopup from "../../pages/SessionPopup"
import TableLoader from "../../components/tableLoader";
import DataTable from 'react-data-table-component';

let { lambda, appname } = window.app

const RetailManagement = () => {
    const history = useHistory();
    const { state } = useLocation();
    const { search } = state || {};
    const [toggle, setToggle] = useState(false);
    // const [retailsData, setRetailsData] = useState([]);
    // const [userdata, setUserData] = useState([]);
    const [retail, setRetail] = useState("");

    // const [perpage, setPerpage] = useState(10);
    // const [arrow, setArrow] = useState(0);
    const [perpage, setPerpage] = useState(10);
    const [image, setImg] = useState('');
    // const [currentPage, setcurrentPage] = useState(1);
    const [itemsPerPage, setitemsPerPage] = useState(10);

    const [pageNumberLimit, setpageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setminPageNumberLimit] = useState(0);
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);

    const [arrowdir, setArrowDir] = useState('down');
    const [num, setNum] = useState();
    // const [sortDirection, setSortDirection] = useState('asc');

    let id = localStorage.getItem("userId");

    const [flag, setFlag] = useState(false);
    const [isDelete, setIsdelete] = useState(false);
    const [deleteId, setDeleteId] = useState("");
    // const [isLoading, setIsLoading] = useState(false); 
    const { searchedFlag, setSearchedFlag, isLoading, setIsLoading, userData, setUserData, activeMenuObj, setActiveMenuObj, sortTableAlpha, arrow, retailsearch, setRetailSearch, currentPage, setcurrentPage, retailsData, setRetailsData, rowsPerPage, setRowsPerPage, currentPageNew, setCurrentPage, route, setRoute, usePrevious, setActiveMenuId, GetTimeActivity } = useContext(contentContext)
    const validateObj = userData && userData.permissions && userData.permissions?.length > 0 && userData.permissions.filter(eachItem => eachItem.menu == "Retails")
    const subValDashboard = validateObj && validateObj[0] && validateObj[0].dashboard
    // console.log('validate obj', validateObj)

    const prevRoute = usePrevious(route)
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
            setCurrentPage(1)
            setRowsPerPage(15)
            setSearchedFlag(false);
            setRetailSearch("")
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
    const keyForRerender = `${rowsPerPage}_${retailsData?.length}`;
    const columns = [

        {
            name: 'Name',
            selector: row => row?.name ?? "",
            sortable: true,
        },
        {
            name: 'User Type',
            selector: row => row?.type ?? "",
            sortable: true,
        },
        {
            name: 'Email id',
            selector: row => row?.emailid ?? "",
            sortable: true,
        },
        {
            name: 'Phone Number',
            selector: row => row?.phone ?? "",
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
                subValDashboard && subValDashboard.view && subValDashboard.edit && (subValDashboard.view.display === true || subValDashboard.edit.display === true) &&
                <div className="d-flex">
                    {subValDashboard && subValDashboard.view && subValDashboard.view.display === true &&
                        <a onClick={e => handleViewRetail(e, props.userid)}
                            className={`${subValDashboard && subValDashboard.view && subValDashboard.view.enable === false ? 'pe-none' : ''} text-success action-button`}><i
                                className="mdi mdi-eye font-size-18"></i></a>}
                    {subValDashboard && subValDashboard.edit && subValDashboard.edit.display === true && <>
                        {props.userid === id ? <a
                            className={`${subValDashboard && subValDashboard.edit && subValDashboard.edit.enable === false ? 'pe-none' : ''} text-danger action-button`}><i
                                className="mdi mdi-pencil font-size-18"></i></a> : <a onClick={e => handleEditRetail(e, props.userid)}
                                    className={`${subValDashboard && subValDashboard.edit && subValDashboard.edit.enable === false ? 'pe-none' : ''} text-danger action-button`}><i
                                        className="mdi mdi-pencil font-size-18"></i></a>}</>}
                    {subValDashboard && subValDashboard.edit && subValDashboard.edit.display === true && <>
                        {props.status === "ARCHIVE" ? <a style={{ opacity: "0.5" }} className="text-danger action-button"><i
                            className="mdi mdi-delete font-size-18"></i></a> : <a onClick={e => handleDeleteRetail(e, props.userid)}
                                className={`${subValDashboard && subValDashboard.edit && subValDashboard.edit.enable === false ? 'pe-none' : ''} text-danger action-button`}><i
                                    className="mdi mdi-delete font-size-18"></i></a>}</>}
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
    const handleDeleteRetail = (e, id) => {
        setIsdelete(true)
        setDeleteId(id);
    }
    const handleDelete = (e) => {
        setIsLoading(true)
        axios.delete(lambda + '/deleteretail?appname=' + appname + '&retailid=' + deleteId + '&token=' + localStorage.getItem("token"))
            .then(response => {
                if (response.data.result === "deleted successfully") {
                    Retail();
                    setIsdelete(false)
                    setIsLoading(false)
                }

            })
            .catch(error => {
                console.log('Error' + error);
            });
    }
    const onCancel = () => {
        setIsdelete(false);

    }

    useEffect(() => {
        setRoute("retail")
        GetUserData();
        setActiveMenuId(200007)
        userActivity();
    }, []);
    const userActivity = () => {
        let path = window.location.pathname.split("/");
        const pageName = path[path.length - 1];
        var presentTime = moment();
        let payload;

        payload = {
            "userid": localStorage.getItem("userId"),
            "pagename": "USERMANAGE",
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
    const GetUserData = async () => {
        GetTimeActivity()
        try {

            const response = await tmdbApi.getUserData({});

            if (response?.data?.result === "Invalid token or Expired") {
                setShowSessionPopupup(true)
            } else {
                setUserData(response.result[0]);
                localStorage.setItem("ClientName", response.result[0].name)
                localStorage.setItem("ClientType", response.result[0].type)
                let userArr = response.result[0].permissions

                const obj = userArr.reduce((acc, item) => {
                    if (item.submenus) acc[item.menu] = false;
                    return acc;
                }, {});
                // console.log('objjjjjjjj--->',obj)
                // setActiveMenuObj(obj)

                console.log('response.result[0]', response.result[0])
            }

        } catch {
            console.log("error");
        }
    };


    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }

    }, []);

    useEffect(() => {


        console.log("trueeeeeeeeee", searchedFlag);
        if (searchedFlag) {
            console.log("came")
            handleSearch();
        } else {
            console.log("called get all deals")
            Retail();
        }

    }, [searchedFlag]);

    const PageLoad = (e) => {
        const pagevalue = e.target.value;
        //setPerpage(pagevalue);
        setitemsPerPage(pagevalue);
        setcurrentPage(1);
        setmaxPageNumberLimit(5);
        setminPageNumberLimit(0);

    }


    const Retail = (e) => {
        GetTimeActivity()
        setIsLoading(true)
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/retails?appname=' + appname + "&token=" + token,
        })
            .then(function (response) {
                console.log("response", response);
                if (response.data.result === "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setRetail(response.data.result);
                    setRetailsData(response.data.result.data);
                    setIsLoading(false);
                    setRetailSearch("");
                    setSearchedFlag(false);
                }
            });
    }





    const handleSearch = (e, flagggg) => {
        GetTimeActivity()
        if (flagggg) {
            setcurrentPage(1);
        }
        setmaxPageNumberLimit(5);
        setminPageNumberLimit(0);
        if (flagggg === "normalsearch") {
            setSearchedFlag(true)
        }
        setFlag(true)
        if (retailsearch?.trim() === "") {
            Retail();
        }
        else {
            setIsLoading(true)
            const token = localStorage.getItem("token")
            axios({
                method: 'POST',
                url: lambda + '/users?appname=' + appname + "&search=" + retailsearch + "&token=" + token,
            })
                .then(function (response) {
                    if (response.data.result === "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {
                        console.log("response", response);
                        setRetail(response.data.result);
                        setRetailsData(response.data.result.data);
                        setIsLoading(false)
                    }
                });
        }
    }

    const handleChange = (e) => {
        if (e.target.value === "") {
            //   Retail();
            setFlag(false)
        }
        setRetailSearch(e.target.value)
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
    const handleAddRetail = (e) => {
        GetTimeActivity()
        history.push("/addretail");
    }

    const handleEditRetail = (e, id) => {
        GetTimeActivity()
        history.push("/editretail/" + id);
    }
    const handleViewRetail = (e, id) => {
        GetTimeActivity()
        history.push("/viewretail/" + id);
    }

    const clearSearch = () => {
        GetTimeActivity()
        setRetailSearch("");
        Retail();
        setcurrentPage(1);
    }

    const customNoRecords = () => {
        return (

            <div className="empty-state-body empty-record"  >
                <div className="empty-state__message">
                    <span class="material-icons">people</span>
                    <p className="form-check font-size-16">No retails were found for the searched keyword</p>
                </div> </div>
        )
    }
    // console.log("showSessionPopupup",showSessionPopupup)
    return (
        <>
            {showSessionPopupup && <SessionPopup />}
            <div id="layout-wrapper">
                <Header />
                <Sidebar />

                {/* Start right Content here  */}

                <div className="main-content user-management spacovers_users">

                    <div className="page-content">
                        <div className="container-fluid">



                            <div className="row mb-4 breadcrumb">
                                <div className="col-lg-12">
                                    <div className="d-flex align-items-center">

                                        <div className="flex-grow-1">
                                            <h4 className="mb-2 card-title">users</h4>

                                        </div>
                                        {subValDashboard && subValDashboard.add && subValDashboard.add.display === true &&
                                            <div>
                                                <button className="btn btn-primary" onClick={handleAddRetail} disabled={subValDashboard && subValDashboard.Add && subValDashboard.Add.enable === false}>ADD USER</button>
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
                                                    {/* <button type="button"
                                                         className="btn btn-success btn-rounded waves-effect waves-light mb-2 me-2">DELETE</button> */}
                                                </div>
                                                <div className="col-sm-8">
                                                    <div className="search-box mb-2 d-inline-block">
                                                        <div className="position-relative">
                                                            <input type="text" className="form-control" value={retailsearch} onChange={(e) => handleChange(e)} placeholder="Search by Name or Email" onKeyPress={handleKeypress} />
                                                            <button className="fill_btn" onClick={(e) => handleSearch(e, "normalsearch")}><span className="material-icons search-icon">search</span></button>
                                                        </div>
                                                        <div className="dataTables_length" id="datatable_length">
                                                            <button className="fill_btn" onClick={clearSearch}><span className="material-icons-outlined">sync</span>Reset</button>
                                                        </div>




                                                    </div>
                                                    <div className="text-sm-end">

                                                    </div>
                                                </div>
                                            </div>

                                            <DataTable key={keyForRerender}
                                                // title=""
                                                columns={columns}
                                                // className="table align-middle table-nowrap table-check"
                                                keyField='_id'
                                                data={retailsData}
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
                                                paginationTotalRows={retailsData?.length}
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
                    <Modal className="access-denied" show={isDelete}>

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

                    </Modal>

                </div>



            </div>
        </>
    );
};

export default RetailManagement;