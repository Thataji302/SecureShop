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

const Customers = () => {
    const history = useHistory();
    const { state } = useLocation();
    const { search } = state || {};
    const [toggle, setToggle] = useState(false);
    // const [data, setData] = useState([]);
    // const [userdata, setUserData] = useState([]);
    const [user, setUser] = useState("");
    const [isDelete, setIsdelete] = useState(false);
    const [deleteId, setDeleteId] = useState("");

    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const [image, setImg] = useState('');

    let id = localStorage.getItem("userId");

    const [flag, setFlag] = useState(false);

    // const [isLoading, setIsLoading] = useState(false); 
    const { searchedFlag, setSearchedFlag, isLoading, setIsLoading, userData, setUserData, activeMenuObj, setActiveMenuObj, sortTableAlpha, arrow, usersearch, setUserSearch, currentPage, setcurrentPage, data, setData, rowsPerPage, setRowsPerPage, currentPageNew, setCurrentPage, route, setRoute, usePrevious, setActiveMenuId, GetTimeActivity } = useContext(contentContext)
    const validateObj = userData && userData.permissions && userData.permissions.length > 0 && userData.permissions.filter(eachItem => eachItem.menu == "Members")
    const subValDashboard = validateObj && validateObj[0] && validateObj[0].dashboard
    // console.log('validate obj', validateObj)

    const prevRoute = usePrevious(route)
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
            setCurrentPage(1)
            setRowsPerPage(15)
            setSearchedFlag(false);
            setUserSearch("")
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
    const keyForRerender = `${rowsPerPage}_${data.length}`;
    const columns = [

        {
            name: 'Name',
            selector: row => row?.name,
            sortable: true,
        },

        {
            name: 'Email id',
            selector: row => row?.emailid,
            sortable: true,
        },
        {
            name: 'Phone Number',
            selector: row => row?.phonenumber,
            sortable: true,
        },
        {
            name: 'Address',
            selector: row => row?.customeraddress?.state ? row?.customeraddress?.state : "" + "," + row?.customeraddress?.pincode ? row?.customeraddress?.pincode : "",
            sortable: true,
        },
        {
            name: 'Type',
            selector: row => row?.type,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row?.status,
            sortable: true,
        },
      

        {
            name: <>{(subValDashboard && subValDashboard.view && subValDashboard.view.display === true) || (subValDashboard && subValDashboard.edit && subValDashboard.edit.display === true) ? 'Actions' : null}</>,
            cell: (props) =>
                //   {
                subValDashboard && subValDashboard.view && subValDashboard.edit && (subValDashboard.view.display === true || subValDashboard.edit.display === true) &&
                <div className="d-flex">
                    {subValDashboard && subValDashboard.view && subValDashboard.view.display === true &&
                        <a onClick={e => handleViewCustomer(e, props.customerid)}
                            className={`${subValDashboard && subValDashboard.view && subValDashboard.view.enable === false ? 'pe-none' : ''} text-success action-button`}><i
                                className="mdi mdi-eye font-size-18"></i></a>}
                    {subValDashboard && subValDashboard.edit && subValDashboard.edit.display === true && <>
                        {props.userid === id ? <a
                            className={`${subValDashboard && subValDashboard.edit && subValDashboard.edit.enable === false ? 'pe-none' : ''} text-danger action-button`}><i
                                className="mdi mdi-pencil font-size-18"></i></a> : <a onClick={e => handleEditCustomer(e, props.customerid)}
                                    className={`${subValDashboard && subValDashboard.edit && subValDashboard.edit.enable === false ? 'pe-none' : ''} text-danger action-button`}><i
                                        className="mdi mdi-pencil font-size-18"></i></a>}</>}
                    {props.status === "ARCHIVE" ?  <a style={{opacity:"0.5"}} className="text-danger action-button"><i
                                        className="mdi mdi-delete font-size-18"></i></a> : <a className="text-danger action-button" onClick={e => handledeleteCustomer(e, props.customerid)}><i className="mdi mdi-trash-can font-size-18"></i></a>}
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
        setRoute("wholesaler")
        GetUserData();
        setActiveMenuId(200004)
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
    const GetUserData = async () => {
        GetTimeActivity()
        try {

            const response = await tmdbApi.getUserData({});

            if (response.statusCode === 200) {

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
            getCustomers();
        }

    }, [searchedFlag]);




    const getCustomers = (e) => {
        GetTimeActivity()
        setIsLoading(true)
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/customers?appname=' + appname + "&token=" + token,
        })
            .then(function (response) {
                console.log("response", response);
                if (response?.data?.result === "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setUser(response.data.result);
                    setData(response.data.result.data);
                    setIsLoading(false);
                    setUserSearch("");
                    setSearchedFlag(false);
                }
            });
    }





    const handleSearch = (e, flagggg) => {
        GetTimeActivity()
        if (flagggg) {
            setcurrentPage(1);
        }

        if (flagggg === "normalsearch") {
            setSearchedFlag(true)
        }
        setFlag(true)
        if (usersearch === "") {
            getCustomers();
        }
        else {
            setIsLoading(true)
            const token = localStorage.getItem("token")
            axios({
                method: 'GET',
                url: lambda + '/customers?appname=' + appname + "&search=" + usersearch + "&token=" + token,
            })
                .then(function (response) {
                    if (response.data.result === "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {
                        console.log("response", response);
                        setUser(response.data.result);
                        setData(response.data.result.data);
                        setIsLoading(false)
                    }
                });
        }
    }

    const handleChange = (e) => {
        if (e.target.value === "") {
            //   User();
            setFlag(false)
        }
        setUserSearch(e.target.value)
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
    const handleAddCustomer = (e) => {
        GetTimeActivity()
        history.push("/addmember");
    }

    const handleEditCustomer = (e, id) => {
        GetTimeActivity()
        history.push("/editmember/" + id);
    }
    const handleViewCustomer = (e, id) => {
        GetTimeActivity()
        history.push("/viewwholesaler/" + id);
    }
    const handleDelete = (e) => {
        setIsLoading(true)
        axios.delete(lambda + '/deletecustomer?appname=' + appname + '&userid=' + localStorage.getItem("userId") + '&token=' + localStorage.getItem("token") + "&customerid=" + deleteId)
            .then(response => {

                if (response.data.statusCode === 200) {
                    getCustomers();
                    setIsdelete(false)
                    setIsLoading(false)
                }

            })
            .catch(error => {
                console.log('Error' + error);
            });
    }

    const handledeleteCustomer = (e, id) => {
        setDeleteId(id);
        setIsdelete(true)
    }
    const onCancel = () => {
        setIsdelete(false);

    }

    const clearSearch = () => {
        GetTimeActivity()
        setUserSearch("");
        getCustomers();
        setcurrentPage(1);
    }

    const customNoRecords = () => {
        return (

            <div className="empty-state-body empty-record"  >
                <div className="empty-state__message">
                <span class="material-icons">people</span>
                    <p className="form-check font-size-16"> No members were found for the searched keyword</p>
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

                <div className="main-content user-management whole_salers">

                    <div className="page-content">
                        <div className="container-fluid">



                            <div className="row mb-4 breadcrumb">
                                <div className="col-lg-12">
                                    <div className="d-flex align-items-center">

                                        <div className="flex-grow-1">
                                            <h4 className="mb-2 card-title">MEMBERS</h4>

                                        </div>
                                        {subValDashboard && subValDashboard.add && subValDashboard.add.display === true &&
                                            <div>
                                                <button className="btn btn-primary" onClick={handleAddCustomer} disabled={subValDashboard && subValDashboard.Add && subValDashboard.Add.enable === false}>ADD MEMBER</button>
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
                                                            <input type="text" className="form-control" value={usersearch} onChange={(e) => handleChange(e)} placeholder="Search by Name or Email" onKeyPress={handleKeypress} />
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

export default Customers;
