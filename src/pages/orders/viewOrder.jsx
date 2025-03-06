/***
**Module Name: content dashboard
 **File Name :  contentmanage.js
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
 **Description : contains content mamnagement details.
 ***/
import React, { useState, useEffect, useContext, useRef } from "react";


import Footer from "../../components/dashboard/footer";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import tmdbApi from "../../api/tmdbApi";
import { useHistory, Link, useLocation } from "react-router-dom";
import axios from 'axios';
import $ from "jquery";
import SweetAlert from 'react-bootstrap-sweetalert';
import { useReactToPrint } from 'react-to-print';
import Button from 'react-bootstrap/Button';
import moment from "moment";
import Modal from 'react-bootstrap/Modal';
import TableLoader from "../../components/tableLoader";
import SessionPopup from "../SessionPopup"
import { useParams } from 'react-router-dom';
import Loader from "../../components/loader";
import Dropdown from 'react-bootstrap/Dropdown';
import DataTable from 'react-data-table-component';

import { contentContext } from "../../context/contentContext";
let { lambda, appname } = window.app





const ViewOrder = () => {
    const history = useHistory();
    let { id } = useParams();

    const [items, setItems] = useState("");
    const [orderInfo, setOrderInfo] = useState("");
    const [image, setImg] = useState('');
    const [itemsView, setItemsView] = useState({});
    const [popup, setPopup] = useState(false);

    const { searchedFlag, setSearchedFlag, selctionOrder, setSelectionOrder, sortTableAlpha, arrow, sortTableByDate, contentsearch, setContentSearch, searchPayload, setSearchPayload, contentAdvCount, setContentAdvCount, currentPage, setSelectedOptions, setMultiSelectFields, setActiveFieldsObj, setSelectedOptionsClientName, data, setData, rowsPerPage, setRowsPerPage, currentPageNew, setCurrentPage, route, setRoute, usePrevious, isLoading, setIsLoading, setActiveMenuId, pay, setPay } = useContext(contentContext)





    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        setSelectionOrder(localStorage.getItem("order"))
        getOrder()
        setActiveMenuId(200001)
        setRoute("orders")
        getOrderItems()
        userActivity();
    }, []);
    const userActivity = () => {
        let path = window.location.pathname.split("/");
        const pageName = path[path.length - 1];
        var presentTime = moment();
        let payload;

        payload = {
            "userid": localStorage.getItem("userId"),
            "pagename": "VIEWORDERS",
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

    const columns = [

        {
            name: 'Image',
            cell: (props) => <img src={
                image + props?.productspecification?.productimage + "?auto=compress,format&width=40"} alt='Image' />,
            sortable: false,
        },
        {
            name: 'item',
            selector: row => row?.productspecification?.productname ?? "",
            sortable: true,
        },
        {
            name: 'Color',
            selector: row => row && row.productspecification && row.productspecification.covercolor,
            sortable: true,
        },
        {
            name: 'Cover Fold',
            selector: row => row && row.productspecification && row.productspecification.coverfold,
            sortable: true,
        },
        {
            name: 'Tie Downs',
            selector: row => row && row.productspecification && row.productspecification.tiedown,
            sortable: true,
        },
        {
            name: 'Tie Downs Loc',
            selector: row => row && row.productspecification && row.productspecification.tiedownlocation,
            sortable: true,
        },
        {
            name: 'Cover Skirt Length',
            selector: row => row && row.productspecification && row.productspecification.coverskritlength,
            sortable: true,
        },
        {
            name: 'Cover Skirt Options',
            selector: row => row && row.productspecification && row.productspecification.skirtoption,
            sortable: true,
        },

        {
            name: 'Actions',
            cell: (props) =>


                <div className="d-flex" >
                    <a
                        onClick={e => handleViewItem(e, props.itemid)}
                        className="text-success action-button"><i className="mdi mdi-eye font-size-18"></i></a>


                </div>

            ,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];



    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = (newPerPage) => {
        setRowsPerPage(newPerPage);
    };

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





    const customNoRecords = () => {
        return (

            <div className="empty-state-body empty-record"  >
                <div className="empty-state__message">
                    <span className="material-icons">summarize</span>
                    <p className="form-check font-size-16">No content was found for the searched keyword</p>
                </div> </div>
        )
    }
    const handleBack = () => {
        history.push("/orders")
    }
    const getOrder = async () => {
        setIsLoading(true)
        const token = localStorage.getItem("token")
        const userid = localStorage.getItem("userId")

        axios({
            method: 'GET',
            url: lambda + '/order?appname=' + appname + "&token=" + token + "&userid=" + userid + "&orderid=" + id,
        })
            .then(function (response) {
                console.log("response", response)
                if (response.data.result == "Invalid token or Expired") {
                    //  setShowSessionPopupup(true)

                } else {
                    setOrderInfo(response.data.result[0])
                    setIsLoading(false)
                }
            });
    };
    const getOrderItems = async () => {
        setIsLoading(true)
        const token = localStorage.getItem("token")
        const userid = localStorage.getItem("userId")

        axios({
            method: 'POST',
            url: lambda + '/items?appname=' + appname + "&token=" + token + "&userid=" + userid + "&orderid=" + id,
        })
            .then(function (response) {
                console.log("response", response)
                if (response.data.result === "Invalid token or Expired") {
                    //  setShowSessionPopupup(true)

                } else {
                    setItems(response.data.result.data)
                    console.log("result----->", response.data.result.data)
                    //   setOrderInfo(response.data.result.data[0])
                    setIsLoading(false)
                }
            });
    };

    console.log("order", orderInfo)

    const handleViewItem = (e, item) => {
        const token = localStorage.getItem("token")
        const userid = localStorage.getItem("userId")

        axios({
            method: 'get',
            url: lambda + '/item?appname=' + appname + "&token=" + token + "&userid=" + userid + "&itemid=" + item,
        })
            .then(function (response) {
                console.log("response", response)
                if (response.data.result === "Invalid token or Expired") {
                    //  setShowSessionPopupup(true)

                } else {
                    let result = response.data.result[0]
                    // $("#qrImg").attr("src", 'https://api.qrserver.com/v1/create-qr-code/?data=' + "https://development.d2bexra7zdcqo3.amplifyapp.com/item/" + result.itemid + "/" + result.status);
                    setItemsView(response.data.result[0]);
                    setPopup(true)

                }
            });

    }

    const PrintContent = React.forwardRef((props, ref) => {
        useEffect(() => {
            // Your jQuery code here
            $(ref.current).find("#qrImg").attr("src", 'https://api.qrserver.com/v1/create-qr-code/?data=' + "https://develop.spacovers.com/item/" + itemsView.itemid + "/" + itemsView.status);
        }, [ref]);
        return (
            <div ref={ref} className="print-content access-denied order_specification order_spe_print" style={{ padding: "30px" }}>
                {/* <div className="modal-body enquiry-form">
                    <img src="https://spacovers.imgix.net/spacoversdev/admin/theme/images/logo-dark.png" />
                    <div className="details_block">
                        <div className="block_left">
                            <div className="input-field">
                                <label className="form-label form-label">delaler</label>
                                <p>{itemsView?.name}</p>
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Size</label>
                                <p>{itemsView?.productspecification?.dimensionA + "’" + " " + itemsView?.productspecification?.dimensionB + "”"}</p>
                            </div>

                            <div className="input-field">
                                <label className="form-label form-label">Color</label>
                                <p>{itemsView?.productspecification?.covercolor}</p>
                            </div>
                        </div>
                        <div className="block_right">
                            <div className="input-field">
                                <label className="form-label form-label">Radius</label>
                                <p>{itemsView?.productspecification?.radius}</p>
                            </div>

                        </div>
                    </div>
                    <div className="details_block tie_downs">
                        <div className="block_left">
                            <div className="input-field">
                                <label className="form-label form-label">Plastic<br /># of tie downs</label>
                                <p>{itemsView?.productspecification?.tiedown}</p>
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Connector</label>
                                <p>0</p>
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Velcro</label>
                                <p>--</p>
                            </div>
                        </div>
                        <div className="block_right">
                            <div className="input-field">
                                <h6>{itemsView?.productspecification?.tiedownlocation}</h6>
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Cut Flap</label>
                                <p>{parseInt(itemsView?.productspecification?.coverskritlength) * 2 + 1}</p>
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Flaps</label>
                                <p>{itemsView?.productspecification?.coverskritlength}</p>
                            </div>
                        </div>
                    </div>
                    <div className="details_block connected">
                        <div className="block_left">
                            <div className="input-field">
                                <h6>{itemsView?.productspecification?.skirtoption}</h6>
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Tie Downs</label>
                                <p>{itemsView?.productspecification?.tiedown}</p>
                            </div>
                        </div>
                        <div className="block_right">
                            <div className="input-field">
                                <h6>{itemsView?.productspecification?.skirtoption}</h6>
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Cut T/D</label>
                                <p>{parseInt(itemsView?.productspecification?.tiedown) * 2 + 1}</p>
                            </div>
                        </div>
                    </div>
                    <div className="details_block foam_density">
                        <h6>Foam Density</h6>
                        <div className="dbl">
                            <div className="input-field">
                                <label className="form-label form-label">Dbl</label>
                                {itemsView?.productspecification?.foamdensity ===
                                    "#2lbs Foam +$55" &&
                                    <p>{itemsView?.productspecification?.foamdensity}</p>
                                }
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Plastic</label>
                                {itemsView?.productspecification?.foamdensity ===
                                    ".25 Standard" &&
                                    <p>{itemsView?.productspecification?.foamdensity}</p>
                                }
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Webbing</label>
                                {itemsView?.productspecification?.foamdensity ===
                                    "5-2.5+$55" &&
                                    <p>{itemsView?.productspecification?.foamdensity}</p>
                                }
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">6”- 4”</label>
                                {itemsView?.productspecification?.foamdensity ===
                                    "6-4 +$100" &&
                                    <p>{itemsView?.productspecification?.foamdensity}</p>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="qr_block">
                        <img src="https://spacovers.imgix.net/spacoversdev/admin/theme/images/qr-code.png" className="qrImg" id="qrImg" />
                    </div>
                    <div className="details_block customer_location">
                        <div className="input-field">
                            <label className="form-label form-label">Customer / Location</label>
                            <p>{itemsView && itemsView?.deliveryaddress && (itemsView?.deliveryaddress?.address1 + "," + itemsView.deliveryaddress.address2 + "," + itemsView.deliveryaddress.state + "," + itemsView.deliveryaddress.pincode)}</p>
                        </div>
                        <div className="input-field">
                            <label className="form-label form-label">Date</label>
                            <p>{moment(itemsView?.created).format('MMM-DD-YYYY')}</p>
                        </div>
                    </div>
                </div> */}
                <div className="modal-body enquiry-form">
                    <div className="po_block">
                        <img src="https://spacovers.imgix.net/spacoversdev/admin/theme/images/logo-dark.png" />
                        <div className="po_details">
                            <p>PO #</p>
                            <h6>{itemsView?.productspecification?.ponumber}</h6>
                        </div>
                        <p className="date">{moment(itemsView?.created).format('MMM-DD-YYYY')}</p>
                    </div>
                    <div className="details_block">
                        <div className="block_left">
                            <div className="input-field">
                                <label class="form-label form-label">dealer</label>
                                <p>{itemsView?.name}</p>
                            </div>
                            <div className="input-field">
                                <label class="form-label form-label">Size</label>
                                <p>{itemsView?.productspecification?.dimensionA + "’" + " " + itemsView?.productspecification?.dimensionB + "”"}</p>
                            </div>
                            <div className="input-field">
                                <label class="form-label form-label">Radius</label>
                                <p>{itemsView?.productspecification?.radius}</p>
                            </div>
                            <div className="input-field mb-0">
                                <label class="form-label form-label">Color</label>
                                <p>{itemsView?.productspecification?.covercolor}</p>
                            </div>
                        </div>
                        <div className="block_right">
                        </div>
                    </div>
                    <div className="handle_block">
                        <div className="handle_corner">
                            <div className="measurement">
                                <span>{itemsView?.productspecification?.tiedown}</span>
                                <p>Plastic<br></br># of tie downs</p>
                            </div>
                            <div className="measurement">
                                <span>{parseInt(itemsView?.productspecification?.coverskritlength) * 2 + 1}</span>
                                <p>Cut Flap</p>
                            </div>
                        </div>
                        <div className="handle_corner">
                            <div className="measurement">
                                <span>0</span>
                                <p>Connector</p>
                            </div>
                            <div className="measurement">
                                <span>{itemsView?.productspecification?.coverskritlength}</span>
                                <p>Flaps</p>
                            </div>
                        </div>
                        <div className="handle_corner">
                            <div className="measurement">
                                <span>--</span>
                                <p>Velcro</p>
                            </div>
                            <div className="measurement">
                                <span className="material-icons-outlined">check_circle</span>
                                <p>{itemsView?.productspecification?.skirtoption}</p>
                            </div>
                        </div>
                        <div className="handle_corner">
                            <div className="measurement">
                                <span className="material-icons-outlined">check_circle</span>
                                <p>{itemsView?.productspecification?.tiedownlocation}</p>
                            </div>
                            <div className="measurement">
                                <span>{itemsView?.productspecification?.tiedown}</span>
                                <p>Tie Downs</p>
                            </div>
                        </div>
                        <div className="handle_corner">
                            <div className="measurement">
                                <span>{parseInt(itemsView?.productspecification?.tiedown) * 2 + 1}</span>
                                <p>Cut T/D</p>
                            </div>
                        </div>
                    </div>
                    <table>
                            <tbody>
                                <tr>
                                    {itemsView && itemsView?.productspecification && itemsView?.productspecification?.upgrades && itemsView?.productspecification?.upgrades?.map((eachItem, key) => {
                                        return (
                                    <td key={key}><p><span className="material-icons-outlined">check_circle</span>{eachItem}</p></td>
                                 
                                        )

                                    })}
                                </tr>
                            </tbody>
                        </table>
                    <div className="customer_location">
                        <div className="qr_block">
                            <img src="https://spacovers.imgix.net/spacoversdev/admin/theme/images/qr-code.png" className="qrImg" id="qrImg" />
                        </div>
                        <div className="input-field">
                            <div className="foam_density"><div className="measurement"><p>Foam density: {itemsView?.productspecification?.foamdensity}</p></div></div>
                            <label className="form-label form-label">Customer / Location</label>
                            <p>{itemsView && itemsView?.deliveryaddress && (itemsView?.deliveryaddress?.address1 + "," + itemsView.deliveryaddress.address2 + "," + itemsView.deliveryaddress.state + "," + itemsView.deliveryaddress.pincode)}</p>
                        </div>
                    </div>

                </div>

            </div>
        )
    });

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const componentRef1 = useRef();
    const handlePrint1 = useReactToPrint({
        content: () => componentRef1.current,
    });
    const PageContent = ({ data }) => {
        const [qrSrc, setQrSrc] = useState('');
        useEffect(() => {
            const imageUrl = 'https://api.qrserver.com/v1/create-qr-code/?data=' +
                `https://develop.spacovers.com/item/${data.itemid}/${data.status}`;
            setQrSrc(imageUrl);
        }, [data.itemid, data.status]);



        return (
            <div style={{ pageBreakAfter: 'always' }}>

                <div className="print-content access-denied order_specification order_spe_print" style={{ padding: "30px" }}>
                    <div className="modal-body enquiry-form">
                        <div className="po_block">
                            <img src="https://spacovers.imgix.net/spacoversdev/admin/theme/images/logo-dark.png" />
                            <div className="po_details">
                                <p>PO #</p>
                                <h6>{data?.productspecification?.ponumber}</h6>
                            </div>
                            <p className="date">{moment(data?.created).format('MMM-DD-YYYY')}</p>
                        </div>
                        <div className="details_block">
                            <div className="block_left">
                                <div className="input-field">
                                    <label class="form-label form-label">dealer</label>
                                    <p>{data?.name}</p>
                                </div>
                                <div className="input-field">
                                    <label class="form-label form-label">Size</label>
                                    <p>{data?.productspecification?.dimensionA + "’" + " " + data?.productspecification?.dimensionB + "”"}</p>
                                </div>

                            </div>
                            <div className="block_right">
                                <div className="input-field">
                                    <label class="form-label form-label">Radius</label>
                                    <p>{data?.productspecification?.radius}</p>
                                </div>
                                <div className="input-field mb-0">
                                    <label class="form-label form-label">Color</label>
                                    <p>{data?.productspecification?.covercolor}</p>
                                </div>
                            </div>
                        </div>
                        <div className="handle_block">
                            <div className="handle_corner">
                                <div className="measurement">
                                    <span>{data?.productspecification?.tiedown}</span>
                                    <p>Plastic<br></br># of tie downs</p>
                                </div>
                                <div className="measurement">
                                    <span>{parseInt(data?.productspecification?.coverskritlength) * 2 + 1}</span>
                                    <p>Cut Flap</p>
                                </div>
                            </div>
                            <div className="handle_corner">
                                <div className="measurement">
                                    <span>0</span>
                                    <p>Connector</p>
                                </div>
                                <div className="measurement">
                                    <span>{data?.productspecification?.coverskritlength}</span>
                                    <p>Flaps</p>
                                </div>
                            </div>
                            <div className="handle_corner">
                                <div className="measurement">
                                    <span>--</span>
                                    <p>Velcro</p>
                                </div>
                                <div className="measurement">
                                    <span className="material-icons-outlined">check_circle</span>
                                    <p>{data?.productspecification?.skirtoption}</p>
                                </div>
                            </div>
                            <div className="handle_corner">
                                <div className="measurement">
                                    <span className="material-icons-outlined">check_circle</span>
                                    <p>{data?.productspecification?.tiedownlocation}</p>
                                </div>
                                <div className="measurement">
                                    <span>{data?.productspecification?.tiedown}</span>
                                    <p>Tie Downs</p>
                                </div>
                            </div>
                            <div className="handle_corner">
                                <div className="measurement">
                                    <span>{parseInt(data?.productspecification?.tiedown) * 2 + 1}</span>
                                    <p>Cut T/D</p>
                                </div>
                            </div>
                        </div>
                        {/* <div className="row handle_corner webbing">
                        {data && data?.productspecification && data?.productspecification?.upgrades && data?.productspecification?.upgrades?.map((eachItem, key) => {
                            return (
                            <div key={key} className="col-md-4">
                                <div className="measurement">
                                    <span className="material-icons-outlined">check_circle</span>
                                    <p>{eachItem}</p>
                                </div>
                            </div>
                              )

                            })}

                        </div> */}
                        <table>
                            <tbody>
                                <tr>
                                    {data && data?.productspecification && data?.productspecification?.upgrades && data?.productspecification?.upgrades?.map((eachItem, key) => {
                                        return (
                                    <td key={key}><p><span className="material-icons-outlined">check_circle</span>{eachItem}</p></td>
                                 
                                        )

                                    })}
                                </tr>
                            </tbody>
                        </table>
                        <div className="customer_location">
                            <div className="qr_block">
                                <img src={qrSrc} className="qrImg" id="qrImg" />
                            </div>
                            <div className="input-field">
                                <div className="foam_density"><div className="measurement"><p>Foam density: {data?.productspecification?.foamdensity}</p></div></div>
                                <label className="form-label form-label">Customer / Location</label>
                                <p>{data && data?.deliveryaddress && (data?.deliveryaddress?.address1 + "," + data.deliveryaddress.address2 + "," + data.deliveryaddress.state + "," + data.deliveryaddress.pincode)}</p>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        );
    };

    console.log("selectionOrder--->", selctionOrder, componentRef)
    console.log("items--->", items)
    // $("#qrImg").attr("src", 'https://api.qrserver.com/v1/create-qr-code/?data=' + "https://development.d2bexra7zdcqo3.amplifyapp.com/item/" + itemsView.itemid + "/" + itemsView.status);
    return (
        <>
            <div id="layout-wrapper">
                <Header />
                <Sidebar />

                {isLoading ? <Loader /> :

                    <div className="main-content user-management content-management export create_orders view_orders">

                        <div className="page-content">
                            <div className="container-fluid">



                                <div className="row mb-4 breadcrumb">
                                    <div className="col-lg-12">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <h4 className="mb-2 card-title"> Order #</h4>

                                            </div>
                                            <div className="d-flex align-items-center print_block">
                                                {orderInfo.status != "NEW" &&

                                                    <>
                                                        {/* <a className="btn btn-primary me-2" onClick={handlePrint}><span className="material-icons">print</span>Bulk print</a><div style={{ display: 'none' }}>
                                                        <PrintContent ref={componentRef} />
                                                    </div> */}
                                                        <a className="btn btn-primary me-2" onClick={handlePrint1}><span className="material-icons">print</span>Bulk print</a>
                                                        <div className='print-only' ref={componentRef1}>
                                                            {items && items.map((data) => (
                                                                <PageContent data={data} />
                                                            ))}
                                                        </div>
                                                    </>

                                                }
                                                <a onClick={handleBack} className="btn btn-primary ">back</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row table-data " >
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-body">

                                                <div className="shippingsection order_address">
                                                    <div className="d-flex align col-md-3">
                                                        <div className="flex-shrink-0 me-3">
                                                            <div className="avatar-xs">
                                                                <div className="avatar-title rounded-circle bg-light text-primary">
                                                                    <span className="material-icons-outlined">person</span>
                                                                </div>

                                                            </div>

                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <h5 className="font-size-14 mb-1 mt-1">Wholesaler Name</h5>
                                                            <p className="text-muted">{orderInfo?.name}</p>
                                                        </div>
                                                    </div>


                                                    <div className="d-flex col-md-4">
                                                        <div className="flex-shrink-0 me-3">
                                                            <div className="avatar-xs">
                                                                <div className="avatar-title rounded-circle bg-light text-primary">
                                                                    <span className="material-icons-outlined">
                                                                        location_on
                                                                    </span>
                                                                </div>

                                                            </div>


                                                        </div>



                                                        <div className="flex-grow-1 ">
                                                            <h5 className="font-size-14 mb-1 mt-1">Billing Address</h5>
                                                            <p className="text-muted">{
                                                                orderInfo && orderInfo?.billingaddress && (orderInfo?.billingaddress?.address1 + "," + " " + orderInfo.billingaddress.address2 + "," + " " + orderInfo.billingaddress.state + "," + " " + orderInfo.billingaddress.pincode)

                                                            }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex col-md-4">
                                                        <div className="flex-shrink-0 me-3">
                                                            <div className="avatar-xs">
                                                                <div className="avatar-title rounded-circle bg-light text-primary">
                                                                    <span className="material-icons-outlined">
                                                                        local_shipping
                                                                    </span>
                                                                </div>

                                                            </div>

                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <h5 className="font-size-14 mb-1 mt-1">Shipping Address</h5>
                                                            <p className="text-muted">{orderInfo && orderInfo?.deliveryaddress && (orderInfo?.deliveryaddress?.address1 + "," + " " + orderInfo.deliveryaddress.address2 + "," + " " + orderInfo.deliveryaddress.state + "," + " " + orderInfo.deliveryaddress.pincode)}
                                                            </p>
                                                        </div>
                                                    </div>


                                                    {/* <div className="d-flex align">

                                                    <div className="flex-grow-1">
                                                        {orderInfo.status != "NEW" &&
                                                            <div className="d-flex justify-content-end align-items-center print">
                                                                <a className="btn" onClick={handlePrint}><span className="material-icons">print</span>print</a>
                                                                <div style={{ display: 'none' }}>
                                                                    <PrintContent ref={componentRef} />
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                </div> */}

                                                </div>
                                                {items.length <= 0 ? "" :




                                                    <div className="workshopdetails sewers_details">
                                                        <h5>WORKSHOP DETAILS</h5>
                                                        <div className="shippingsection">
                                                            <div className="row">
                                                                <div className="d-flex col-md-4 align-items-center">
                                                                    <h5 className="font-size-14 mb-1 mt-1">workshop Name</h5>
                                                                    <p className="text-muted">{orderInfo && orderInfo.workshopinfo && orderInfo.workshopinfo[0]?.workshopname}</p>
                                                                </div>
                                                                {/* <div className="d-flex col-md-4 align-items-center">
                                                                    <h5 className="font-size-14 mb-1 mt-1">Cutting User Name</h5>
                                                                    <p className="text-muted">{orderInfo && orderInfo.cuttinginfo && orderInfo.cuttinginfo[0]?.cuttingusername}</p>
                                                                </div>
                                                            </div>
                                                            <h5 className="mb-1">Sewers</h5>
                                                            <div class="sewers_block"> */}
                                                                {orderInfo && orderInfo.sewinginfo && orderInfo.sewinginfo.length > 0 && orderInfo.sewinginfo.map((item, i) => {
                                                                    return (

                                                                        <>

                                                                            <div key={i} class="sewers_name d-flex align-items-center justify-content-between">
                                                                                <p className="text-muted">{item.sewingusername}</p>
                                                                                <p className="text-muted">{item.sewingQuantity}</p>
                                                                            </div>




                                                                        </>

                                                                    );
                                                                })}
                                                            </div>


                                                        </div>
                                                    </div>}

                                                {items.length <= 0 ? null : <>
                                                    {/* {selctionOrder && selctionOrder === "spacovers" ? */}
                                                    <>< DataTable
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

                                                        defaultSortField="name"
                                                        subHeaderWrap
                                                        noDataComponent={customNoRecords()}
                                                        paginationTotalRows={items.length}
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
                                                        // sortFunction={customSort}
                                                        progressPending={isLoading}
                                                        progressComponent={<TableLoader />}
                                                    /> </>
                                                    {/* :
                                                        <div className="row view_orders_row" >
                                                            {items && items.map(function (item, i) {
                                                                return (
                                                                    <div className="col-md-2">

                                                                        <div className="card">
                                                                            <div className="card-body">
                                                                                <div className="product-img position-relative">
                                                                                    <img onClick={e => handleViewItem(e, item.itemid)}

                                                                                        name="productshape"
                                                                                        src={`${image}${item && item?.productimage}`}
                                                                                        alt=""
                                                                                        className="img-fluid mx-auto d-block"
                                                                                    />
                                                                                </div>
                                                                                <div className="mt-4 text-center product-descptn">
                                                                                    <h5 className="mb-3 text-truncate product-title"><a href="javascript: void(0);" className="text-dark">{item.productname} </a></h5>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </div>)
                                                            })}
                                                          

                                                        </div>
                                                    } */}



                                                </>}



                                            </div>
                                        </div>
                                    </div>
                                </div>



                            </div>

                        </div>


                        <Modal className="access-denied order_specification" show={popup}>

                            <div className="modal-body enquiry-form">
                                <button className="close-btn" onClick={e => setPopup(false)}><span className="material-icons">close</span></button>
                                <h5 className="mt-0">ORDER ID : <span>{itemsView.ordernumber}</span></h5>
                                <div className="order_details">
                                    <div className="order_item">
                                        <h5 className="font-size-14 mt-0">Selected Product</h5>
                                        <div className="shape_image">
                                            <img src={image + itemsView?.productspecification?.productimage} alt="" className="img-fluid d-block" />
                                            <p>{itemsView?.productspecification?.productname}</p>
                                        </div>
                                        {/* <h5 className="font-size-14">scan qr code</h5>
                                        <div className="shape_image">
                                            <img  className="qrImg" id="qrImg" />
                                        </div> */}
                                    </div>

                                    <div className="order_description">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                {/* <div className="flex-shrink-0 me-3">
                                                        <div className="avatar-xs">
                                                            <div className="avatar-title rounded-circle bg-light text-primary">
                                                                <span className="material-icons-outlined"> person</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h5 className="font-size-14 mb-1 mt-1">Customer Name</h5>
                                                        <p className="text-muted">{itemsView.customername}</p>

                                                    </div> */}
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0 me-3">
                                                    <div className="avatar-xs">
                                                        <div className="avatar-title rounded-circle bg-light text-primary">
                                                            <span className="material-icons-outlined"> local_shipping</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <h5 className="font-size-14 mb-1 mt-1">Order Date</h5>
                                                    <p className="text-muted">{new Date(itemsView?.created).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: 'numeric',
                                                        minute: 'numeric',
                                                    })}</p>


                                                </div>
                                            </div>
                                        </div>
                                        <h5 className="product_title">Product Specifications</h5>
                                        <div className="table-responsive">

                                            <table className="table table-striped mb-0">
                                                <tbody>
                                                    <tr>
                                                        <td >Cover  Color</td>
                                                        <td >{itemsView && itemsView.productspecification && itemsView.productspecification.covercolor}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Cover Fold</td>
                                                        <td>{itemsView && itemsView.productspecification && itemsView.productspecification.coverfold}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Tie Downs</td>
                                                        <td>{itemsView && itemsView.productspecification && itemsView.productspecification.tiedown}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Tie Down Locations</td>
                                                        <td>{itemsView && itemsView.productspecification && itemsView.productspecification.tiedownlocation}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Cover Skirt Length</td>
                                                        <td>{itemsView && itemsView.productspecification && itemsView.productspecification.coverskritlength}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Skirt Options</td>
                                                        <td>{itemsView && itemsView.productspecification && itemsView.productspecification.skirtoption}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Foam Density</td>
                                                        <td>{itemsView && itemsView.productspecification && itemsView.productspecification.foamdensity}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Upgrades</td>
                                                        <td>{itemsView && itemsView.productspecification && itemsView.productspecification.upgrades}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Dimension A</td>
                                                        <td>{itemsView && itemsView.productspecification && itemsView.productspecification.dimensionA}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Dimension B</td>
                                                        <td>{itemsView && itemsView.productspecification && itemsView.productspecification.dimensionB}</td>
                                                    </tr><tr>
                                                        <td>Radius</td>
                                                        <td>{itemsView && itemsView.productspecification && itemsView.productspecification.radius}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Additional Instructions</td>
                                                        <td>{itemsView && itemsView.productspecification && itemsView.productspecification.additionalinstructions}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="d-flex justify-content-end align-items-center print">
                                            <a className="btn" onClick={handlePrint}><span className="material-icons">print</span>print</a>
                                            <div style={{ display: 'none' }}>
                                                <PrintContent ref={componentRef} />
                                            </div>
                                            {/* <a href="#" className="btn"><span className="material-icons">print</span>print</a> */}
                                            {/* <img src="https://spacovers.imgix.net/spacoversdev/admin/theme/images/barcode.jpg?auto=compress,format" alt="" className="img-fluid d-block" /> */}
                                        </div>

                                    </div>



                                </div>


                            </div>

                        </Modal>
                        <Footer />
                    </div>}



            </div>
        </>
    );
};

export default ViewOrder;