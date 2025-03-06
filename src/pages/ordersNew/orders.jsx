/***
**Module Name: not found
 **File Name :  notfound.js
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
 **Description : contains page not found details.
 ***/
import React, { useState, useContext, useEffect } from "react";
import * as Config from "../../constants/Config";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import { contentContext } from "../../context/contentContext";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import DataTable from "react-data-table-component";
import TableLoader from "../../components/tableLoader";
import SessionPopup from "../SessionPopup";
import moment from "moment";
import Modal from 'react-bootstrap/Modal';
import Footer from "../../components/dashboard/footer";
let { lambda, appname } = window.app;
const Orders = () => {
    const [productData, setProductData] = useState([]);
    const [progress, setProgress] = useState([])
    const [deliver, setDeliver] = useState([]);
    const [isDelete, setIsdelete] = useState(false);
    const [deleteId, setDeleteId] = useState("");
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const {
        userData,
        setActiveMenuId,
        rowsPerPage,
        setRowsPerPage,
        currentPageNew,
        setCurrentPage,
        route,
        setRoute,
        usePrevious,
        isLoading,
        setIsLoading,
        GetTimeActivity,
        searchedFlag,
        setSearchedFlag,
        workshopsearch,
        setWorkshopSearch,
        data,
        setData,
        selctionOrder, setSelectionOrder
    } = useContext(contentContext);

    const validateObj = userData && userData.permissions && userData.permissions.length > 0 && userData.permissions.filter(eachItem => eachItem.menu == "Orders")
    const subValDashboard = validateObj && validateObj[0] && validateObj[0].dashboard

    const history = useHistory();

    const handlePageChange = (page) => {
        GetTimeActivity();
        setCurrentPage(page);
    };
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        setRoute("orders")
        setActiveMenuId(200001)
        getOrders()
        userActivity()
    }, []);

    const userActivity = () => {
        let path = window.location.pathname.split("/");
        const pageName = path[path.length - 1];
        var presentTime = moment();
        let payload;

        payload = {
            "userid": localStorage.getItem("userId"),
            "pagename": "ORDERS",
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



    const getOrders = (item) => {
        setIsLoading(true);
        // let payload = item === "all-type" || item === "" ? {} : { departments: item }
        axios
            .post(
                lambda +
                "/orders?appname=" +
                appname +
                "&userid=" +
                localStorage.getItem("userId") +
                "&token=" +
                localStorage.getItem("token")
            )
            .then((response) => {
                const colorData = response.data.result.data.filter((item) => (item.status === "NEW") || (item.status === "APPROVED") || (item.status === "ARCHIVE"))
                const inprogress = response.data.result.data.filter((item) => (item.status === "INPROGRESS") || (item.status === "CUTTINGSTARTED") || (item.status === "CUTTINGCOMPLETED") || (item.status === "SEWINGSTARTED") || (item.status === "SEWINGCOMPLETED"))
                const deliver = response.data.result.data.filter((item) => (item.status === "DELIVERYSTARTED") || (item.status === "DELIVERYCOMPLETED"))

                if (response?.data?.result === "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setProductData(colorData);
                    console.log("result---->", response.data.result)
                    setProgress(inprogress);
                    setDeliver(deliver)
                    console.log('progress---->', progress)
                    setIsLoading(false);

                }

            })
            .catch((error) => {
                console.log("Error" + error);
            });
    };


    const columns = [
        {
            name: "#Order ID",
            selector: (row) => row.ordernumber,
        },

        {
            name: "Total Items",
            selector: (row) => row.overallquantity,
        },
        {
            name: "Created Date",
            selector: (row) => row?.created ? moment(row?.created).format('MMM-DD-YYYY HH:mm:ss') : "",
        },
        {
            name: "Member Name",
            selector: (row) => row?.name,
        },

        {
            name: "Price ($)",
            selector: (row) => {
                const price = row.overallprice;
                return Number.isInteger(price) ? `${price}.00` : price;
            }
        },
        {
            name: "Order Type",
            selector: (row) => row.ordertype?.substring(0, 3)?.toUpperCase() + ' ' + row.ordertype?.substring(3)?.toUpperCase()
        },
        {
            name: "Status",
            selector: (row) => row.status === "NEW" ? "PENDING APPROVAL" : row.status

        },

        {
            name: "ACTIONS",
            cell: (row) => (
                <div className="d-flex justify-content-between">
                    <a onClick={(e) => handleViewOrder(e, row.orderid,)}

                        className="text-success action-button"
                    >
                        <i className="mdi mdi-eye font-size-18"></i>
                    </a>
                    {subValDashboard && subValDashboard.edit && subValDashboard.edit.display === true &&
                        <a onClick={(e) => handleEditOrder(e, row.orderid, row.ordertype, row.status)}

                            className="text-success action-button"
                        >
                            <i className="mdi mdi-pencil font-size-18"></i>
                        </a>
                    }
                    {subValDashboard && subValDashboard.delete && subValDashboard.delete.display === true &&
                        <>{row.status != "NEW" ? null : (
                            <a onClick={(e) => handleDeleteOrder(e, row.orderid)}

                                className="text-success action-button"
                            >
                                <i className="mdi mdi-delete font-size-18"></i>
                            </a>
                        )}</>
                    }
                </div>
            ),
        },
    ];

    const customNoRecords = () => {
        return (
            <div className="empty-state-body empty-record">
                <div className="empty-state__message">
                    <span class="material-icons">
                        local_shipping
                    </span>
                    <p className="form-check font-size-16">
                        No Orders were found
                    </p>
                </div>{" "}
            </div>
        );
    };
    const handleDeleteOrder = (e, id) => {
        setIsdelete(true)
        setDeleteId(id);
    }
    const handleDelete = (e,) => {
        setIsLoading(true)
        axios.delete(lambda + '/deleteorder?appname=' + appname + '&orderid=' + deleteId + '&userid=' + localStorage.getItem("userId") + '&token=' + localStorage.getItem("token"))
            .then(response => {
                if (response.data.result === "deleted successfully") {
                    getOrders();
                    setIsdelete(false)
                    setIsLoading(false)
                } else {
                    setShowSessionPopupup(true)
                }

            })
            .catch(error => {
                console.log('Error' + error);
            });
    }
    const handlePerRowsChange = (newPerPage) => {
        GetTimeActivity();
        setRowsPerPage(newPerPage);
    };
    const handleClick = (item) => {
        setSelectionOrder(item)
        localStorage.setItem("order", item)
        history.push("/createorder")
    }
    const handleViewOrder = (e, id,) => {
        history.push("/vieworder/" + id);
        // localStorage.setItem("order", type)
        // setSelectionOrder(type)
    }
    const handleEditOrder = (e, id, type, status) => {
        setSelectionOrder(type)
        localStorage.setItem("order", type)


        if ((status === "APPROVED") || (status === "INPROGRESS") || (status === "CUTTINGSTARTED") || (status === "CUTTINGCOMPLETED") || (status === "SEWINGSTARTED") || (status === "SEWINGCOMPLETED") || (status === "DELIVERYSTARTED") || (status === "DELIVERYCOMPLETED")) {
            history.push("/vieworder/" + id);
        } else {
            history.push("/editorder/" + id);
        }

        console.log("status---->", status)
    }
    const onCancel = () => {
        setIsdelete(false);

    }
    console.log("progess", progress)
    // console.log("value---->", value)

    return (
        <>
         {showSessionPopupup && <SessionPopup />}

            <div id="layout-wrapper">
                <Header />
                <Sidebar />
                <div className="main-content">
                    <div className="page-content user-management order_list">
                        <div className="container-fluid">
                            <div className="row mb-4 breadcrumb">
                                <div className="col-lg-12">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1">
                                            <h6 className="mb-2 card-title">Orders</h6>
                                        </div>
                                        <div>
                                            {subValDashboard && subValDashboard.add && subValDashboard.add.display === true &&
                                                <div className="dropdown">
                                                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                        create order
                                                        <span className="material-icons-outlined">expand_more</span>
                                                    </button>
                                                    <ul className="dropdown-menu">
                                                        <li><button className="dropdown-item" href="#" onClick={() => handleClick("spacovers")}>spa covers</button></li>

                                                    </ul>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <ul className="nav nav-tabs nav-tabs-custom nav-justified" role="tablist">
                                                <li className="nav-item">
                                                    <a className="nav-link active" data-bs-toggle="tab" href="#new" role="tab">
                                                        <i className="d-block material-symbols-outlined me-1"> package_2 </i>
                                                        <span className="d-none d-sm-block">New Orders</span>
                                                    </a>

                                                </li>
                                                <li className="nav-item">
                                                    <a className="nav-link" data-bs-toggle="tab" href="#progress" role="tab">
                                                        <i className="d-block material-symbols-outlined me-1"> timelapse </i>
                                                        <span className="d-none d-sm-block">InProgress</span>
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className="nav-link" data-bs-toggle="tab" href="#ready" role="tab">
                                                        <i className="d-block material-symbols-outlined me-1"> local_shipping </i>
                                                        <span className="d-none d-sm-block">Ready for Delivery</span>
                                                    </a>
                                                </li>
                                            </ul>
                                            <div className="tab-content p-3 text-muted">
                                                <div className="tab-pane active new_orders" id="new" role="tabpanel">
                                                    <h6 className=" card-title my-1">New Orders</h6>
                                                    <>
                                                        <div className="row table-data">
                                                            <div className="container-fluid">
                                                                <div className="row mb-4 breadcrumb">
                                                                    <div className="col-lg-12">
                                                                        <DataTable
                                                                            // title=""
                                                                            columns={columns}
                                                                            //className="table align-middle table-nowrap table-check"

                                                                            data={productData}
                                                                            keyField='_id'
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
                                                                            paginationTotalRows={productData.length}
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
                                                    </>

                                                </div>
                                                <div className="tab-pane in_progress" id="progress" role="tabpanel">
                                                    <h6 className=" card-title my-1">Orders Inprogress</h6>

                                                    <>
                                                        <div className="container-fluid">
                                                            <div className="row mb-4 breadcrumb">
                                                                <div className="col-lg-12">
                                                                    <DataTable
                                                                        // title=""
                                                                        columns={columns}
                                                                        //className="table align-middle table-nowrap table-check"

                                                                        data={progress}
                                                                        keyField='_id'
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
                                                                        paginationTotalRows={progress.length}
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
                                                    </>
                                                </div>
                                                <div className="tab-pane ready_delivery" id="ready" role="tabpanel">

                                                    <h6 className=" card-title my-1">Orders Ready</h6>
                                                    <>
                                                        <div className="container-fluid">
                                                            <div className="row mb-4 breadcrumb">
                                                                <div className="col-lg-12">
                                                                    <DataTable
                                                                        // title=""
                                                                        columns={columns}
                                                                        //className="table align-middle table-nowrap table-check"

                                                                        data={deliver}
                                                                        keyField='_id'
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
                                                                        paginationTotalRows={deliver.length}
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
                                                    </>
                                                </div>
                                            </div>
                                        </div>
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
                                <button className="fill_btn yellow-gradient" data-bs-toggle="modal" data-bs-target="#recommendModal" onClick={e => handleDelete()}> {isLoading ? (<img src="https://spacovers.imgix.net/spacoversdev/common/images/rotate_right.svg" className="loading-icon" />) : null}Yes, Delete</button>
                            </div>
                        </div>
                    </div>

                </Modal>
            </div>
        </>
    );
};
export default Orders;