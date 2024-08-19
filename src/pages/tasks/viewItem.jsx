/***
 **Module Name: editCategory
 **File Name :  editCategory.js
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
 **Description : contains editCategory details.
 ***/
import React, { useState, useEffect, useRef, useContext } from "react";
import Footer from "../../components/dashboard/footer";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import { useHistory, Link } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router-dom';
import Loader from "../../components/loader";
import SessionPopup from "../SessionPopup";
import $ from "jquery";
import { useReactToPrint } from 'react-to-print';
import moment from "moment";
import { contentContext } from "../../context/contentContext";
let { appname, lambda } = window.app;

const ViewItem = () => {
    const history = useHistory();
    let { id } = useParams();
    const ref = useRef();
    const [add, setAdd] = useState(false);
    const [image, setImg] = useState("");
    const [item, setItem] = useState({});
    const [order, setOrder] = useState({});
    const [showSessionPopupup, setShowSessionPopupup] = useState(false)

    const { route, currentPageNew, setRoute, setCurrentPage, setRowsPerPage, usePrevious, setActiveMenuId, GetTimeActivity, isLoading, setIsLoading } = useContext(contentContext);
    const prevRoute = usePrevious(route)
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
            setCurrentPage(1)
            setRowsPerPage(15)
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

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        setRoute("items")
        setActiveMenuId(200002)
        getItem();
        userActivity();

    }, []);

    // useEffect(() => {
    //     if(item.orderid){
    //         getOrder(item.orderid)
    //     }

    // }, [item.orderid]);


    const userActivity = () => {
        let path = window.location.pathname.split("/");
        const pageName = id != undefined ? path[path.length - 2] : path[path.length - 1];;
        var presentTime = moment();
        let payload;

        payload = {
            "userid": localStorage.getItem("userId"),
            "pagename": "VIEWITEMS",
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

    const getItem = (e) => {
        setIsLoading(true)
        GetTimeActivity()
        const token = localStorage.getItem("token");
        const userid = localStorage.getItem("userId")
        axios({
            method: 'GET',
            url: lambda + '/item?appname=' + appname + '&itemid=' + id + "&token=" + token + "&userid=" + userid,
        })
            .then(function (response) {
                if (response.data.result === "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    console.log("response", response)
                    const result = response.data.result[0];
                    if (response.data.result.length > 0) {
                        // console.log("result---------->", result)
                        setItem(result);
                        setIsLoading(false);
                    }
                    $("#qrImg").attr("src", 'https://api.qrserver.com/v1/create-qr-code/?data=' + "https://develop.spacovers.com/item/" + result.itemid + "/" + result.status);

                }
            });
    }
    const getOrder = (orderid) => {

        GetTimeActivity()
        const token = localStorage.getItem("token");
        const userid = localStorage.getItem("userId")
        axios({
            method: 'GET',
            url: lambda + '/order?appname=' + appname + '&orderid=' + orderid + "&token=" + token + "&userid=" + userid,
        })
            .then(function (response) {
                if (response.data.result === "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    console.log("response", response)
                    const result = response.data.result[0];
                    if (response.data.result.length > 0) {
                        // console.log("result---------->", result)
                        setOrder(result);
                    }
                }
            });
    }
    const handleBack = () => {
        history.push("/items")
    }
    console.log("order", order)

    const PrintContent = React.forwardRef((props, ref) => {
        useEffect(() => {
            // Your jQuery code here
            $(ref.current).find("#qrImg").attr("src", 'https://api.qrserver.com/v1/create-qr-code/?data=' + "https://develop.spacovers.com/item/" + item.itemid + "/" + item.status);
        }, [ref]);

        return (
            <div ref={ref} className="print-content access-denied order_specification order_spe_print">
                <div className="order_specification print_specification" style={{ padding: "30px" }}>
                    {/* <div className="modal-body enquiry-form">
                    <img src="https://spacovers.imgix.net/spacoversdev/admin/theme/images/logo-dark.png" />
                    <div className="details_block">
                        <div className="block_left">
                            <div className="input-field">
                                <label className="form-label form-label">delaler</label>
                                <p>{item?.name}</p>
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Size</label>
                                <p>{item?.productspecification?.dimensionA + "’" + " " + item?.productspecification?.dimensionB + "”"}</p>
                            </div>

                            <div className="input-field">
                                <label className="form-label form-label">Color</label>
                                <p>{item?.productspecification?.covercolor}</p>
                            </div>
                        </div>
                        <div className="block_right">
                            <div className="input-field">
                                <label className="form-label form-label">Radius</label>
                                <p>{item?.productspecification?.radius}</p>
                            </div>
                            
                        </div>
                    </div>
                    <div className="details_block tie_downs">
                        <div className="block_left">
                            <div className="input-field">
                                <label className="form-label form-label">Plastic<br /># of tie downs</label>
                                <p>{item?.productspecification?.tiedown}</p>
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
                                <h6>{item?.productspecification?.tiedownlocation}</h6>
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Cut Flap</label>
                                <p>{parseInt(item?.productspecification?.coverskritlength) * 2 + 1}</p>
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Flaps</label>
                                <p>{item?.productspecification?.coverskritlength}</p>
                            </div>
                        </div>
                    </div>
                    <div className="details_block connected">
                        <div className="block_left">
                            <div className="input-field">
                                <h6>{item?.productspecification?.skirtoption}</h6>
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Tie Downs</label>
                                <p>{item?.productspecification?.tiedown}</p>
                            </div>
                        </div>
                        <div className="block_right">
                            <div className="input-field">
                                <h6>{item?.productspecification?.skirtoption}</h6>
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Cut T/D</label>
                                <p>{parseInt(item?.productspecification?.tiedown) * 2 + 1}</p>
                            </div>
                        </div>
                    </div>
                    <div className="details_block foam_density">
                        <h6>Foam Density</h6>
                        <div className="dbl">
                            <div className="input-field">
                                <label className="form-label form-label">Dbl</label>
                                {item?.productspecification?.foamdensity === 
"#2lbs Foam +$55" &&
                                <p>{item?.productspecification?.foamdensity}</p>
                                } 
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Plastic</label>
                                {item?.productspecification?.foamdensity === 
".25 Standard" &&
                                <p>{item?.productspecification?.foamdensity}</p>
                                 } 
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Webbing</label>
                                {item?.productspecification?.foamdensity === 
"5-2.5+$55" &&
                                <p>{item?.productspecification?.foamdensity}</p>
                                 } 
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">6”- 4”</label>
                                {item?.productspecification?.foamdensity === 
"6-4 +$100" &&
                                <p>{item?.productspecification?.foamdensity}</p>
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
                            <p>{item && item?.deliveryaddress && (item?.deliveryaddress?.address1 + "," + item.deliveryaddress.address2 + "," + item.deliveryaddress.state + "," + item.deliveryaddress.pincode)}</p>
                        </div>
                        <div className="input-field">
                            <label className="form-label form-label">Date</label>
                            <p>{moment(item?.created).format('MMM-DD-YYYY')}</p>
                        </div>
                    </div>
                </div> */}
                    <div className="modal-body enquiry-form">
                        <div className="po_block">
                            <img src="https://spacovers.imgix.net/spacoversdev/admin/theme/images/logo-dark.png" />
                            <div className="po_details">
                                <p>PO #</p>
                                <h6>{item?.productspecification?.ponumber}</h6>
                            </div>
                            <p className="date">{moment(item?.created).format('MMM-DD-YYYY')}</p>
                        </div>
                        <div className="details_block">
                            <div className="block_left">
                                <div className="input-field">
                                    <label class="form-label form-label">dealer</label>
                                    <p>{item?.name}</p>
                                </div>
                                <div className="input-field">
                                    <label class="form-label form-label">Size</label>
                                    <p>{item?.productspecification?.dimensionA + "’" + " " + item?.productspecification?.dimensionB + "”"}</p>
                                </div>
                                <div className="input-field">
                                    <label class="form-label form-label">Radius</label>
                                    <p>{item?.productspecification?.radius}</p>
                                </div>
                                <div className="input-field mb-0">
                                    <label class="form-label form-label">Color</label>
                                    <p>{item?.productspecification?.covercolor}</p>
                                </div>
                            </div>
                            <div className="block_right">
                            </div>
                        </div>
                        <div className="handle_block">
                            <div className="handle_corner">
                                <div className="measurement">
                                    <span>{item?.productspecification?.tiedown}</span>
                                    <p>Plastic<br></br># of tie downs</p>
                                </div>
                                <div className="measurement">
                                    <span>{parseInt(item?.productspecification?.coverskritlength) * 2 + 1}</span>
                                    <p>Cut Flap</p>
                                </div>
                            </div>
                            <div className="handle_corner">
                                <div className="measurement">
                                    <span>0</span>
                                    <p>Connector</p>
                                </div>
                                <div className="measurement">
                                    <span>{item?.productspecification?.coverskritlength}</span>
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
                                    <p>{item?.productspecification?.skirtoption}</p>
                                </div>
                            </div>
                            <div className="handle_corner">
                                <div className="measurement">
                                    <span className="material-icons-outlined">check_circle</span>
                                    <p>{item?.productspecification?.tiedownlocation}</p>
                                </div>
                                <div className="measurement">
                                    <span>{item?.productspecification?.tiedown}</span>
                                    <p>Tie Downs</p>
                                </div>
                            </div>
                            <div className="handle_corner">
                                <div className="measurement">
                                    <span>{parseInt(item?.productspecification?.tiedown) * 2 + 1}</span>
                                    <p>Cut T/D</p>
                                </div>
                            </div>
                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    {item && item?.productspecification && item?.productspecification?.upgrades && item?.productspecification?.upgrades?.map((eachItem, key) => {
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
                                <div className="foam_density"><div className="measurement"><p>Foam density: {item?.productspecification?.foamdensity}</p></div></div>
                                <label className="form-label form-label">Customer / Location</label>
                                <p>{item && item?.deliveryaddress && (item?.deliveryaddress?.address1 + "," + item.deliveryaddress.address2 + "," + item.deliveryaddress.state + "," + item.deliveryaddress.pincode)}</p>
                            </div>
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


    console.log("item", item)

    return (
        <>
            {showSessionPopupup && <SessionPopup />}
            <div id="layout-wrapper">
                <Header />
                <Sidebar />
                {isLoading ? <Loader /> :
                    <div className="main-content create-user edit-content add-client edit-category view_item">

                        <div className="page-content ">
                            <div className="container-fluid">



                                <div className="row mb-4 breadcrumb">
                                    <div className="col-lg-12">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <h4 className="mb-2 card-title">View Item</h4>
                                            </div>
                                            <div><a className="btn btn-primary" onClick={handleBack}>back</a></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="create-user-block content_edit block_buyer">

                                    {/* { Object.keys().length >0 ? 
                                             <>   */}


                                    <div className="row">
                                        <div className="col-md-9 pe-1">
                                            <div className="form-block">
                                                <div className="left_block">
                                                    <div className="order_specification">
                                                        <div className="modal-body enquiry-form">

                                                            <h5 className="mt-0">ORDER ID : <span>{item.ordernumber}</span></h5>
                                                            <div className="order_details">
                                                                <div className="order_item">
                                                                    <h5 className="font-size-14 mt-0">Selected Product</h5>
                                                                    <div className="shape_image">
                                                                        <img src={image + item?.productspecification?.productimage} alt="" className="img-fluid d-block" />
                                                                        <p>{item?.productspecification?.productname}</p>
                                                                    </div>
                                                                    <h5 className="font-size-14">scan qr code</h5>
                                                                    <div className="shape_image">
                                                                        {/* <img src="https://spacovers.imgix.net/spacoversdev/admin/theme/images/qr-code.png" alt="" className="img-fluid d-block" /> */}
                                                                        <img className="qrImg" id="qrImg" />
                                                                    </div>
                                                                </div>

                                                                <div className="order_description">
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <div className="d-flex align-items-center">
                                                                            <div className="flex-shrink-0 me-3">
                                                                                <div className="avatar-xs">
                                                                                    <div className="avatar-title rounded-circle bg-light text-primary">
                                                                                        <span className="material-icons-outlined"> person</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex-grow-1">
                                                                                <h5 className="font-size-14 mb-1 mt-1">Wholesaler Name</h5>
                                                                                <p className="text-muted">{item?.name}</p>

                                                                            </div>
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
                                                                                <p className="text-muted">{new Date(item?.created).toLocaleDateString('en-IN', {
                                                                                    day: 'numeric',
                                                                                    month: 'short',
                                                                                    year: 'numeric',
                                                                                    hour: 'numeric',
                                                                                    minute: 'numeric',
                                                                                })}</p>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {item.ordertype === "spacovers" &&
                                                                        <><h5 className="product_title">Product Specifications</h5><div className="table-responsive">
                                                                            <table className="table table-striped mb-0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td>Cover  Color</td>
                                                                                        <td>{item && item.productspecification && item.productspecification.covercolor}</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>Cover Fold</td>
                                                                                        <td>{item && item.productspecification && item.productspecification.coverfold}</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>Tie Downs</td>
                                                                                        <td>{item && item.productspecification && item.productspecification.tiedown}</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>Tie Down Locations</td>
                                                                                        <td>{item && item.productspecification && item.productspecification.tiedownlocation}</td>
                                                                                    </tr>
                                                                                    {item.productspecification.tiedownlocation === "Custom" &&
                                                                                        <tr>
                                                                                            <td>Tie Down Locations</td>
                                                                                            <td>{item && item.productspecification && item.productspecification.tiedownlocationlength}</td>
                                                                                        </tr>}
                                                                                    <tr>
                                                                                        <td>Cover Skirt Length</td>
                                                                                        <td>{item && item.productspecification && item.productspecification.coverskritlength}</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>Skirt Options</td>
                                                                                        <td>{item && item.productspecification && item.productspecification.skirtoption}</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>Foam Density</td>
                                                                                        <td>{item && item.productspecification && item.productspecification.foamdensity}</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>Upgrades</td>
                                                                                        <td>{item && item.productspecification && item.productspecification.upgrades}</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>Dimension A</td>
                                                                                        <td>{item && item.productspecification && item.productspecification.dimensionA}</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>Dimension B</td>
                                                                                        <td>{item && item.productspecification && item.productspecification.dimensionB}</td>
                                                                                    </tr><tr>
                                                                                        <td>Radius</td>
                                                                                        <td>{item && item.productspecification && item.productspecification.radius}</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>Additional Instructions</td>
                                                                                        <td>{item && item.productspecification && item.productspecification.additionalinstructions}</td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </div></>
                                                                    }
                                                                    <div className="d-flex justify-content-end align-items-center print">
                                                                        {/* <a href="#" className="btn"><span className="material-icons">print</span>print</a> */}
                                                                        <a className="btn" onClick={handlePrint}><span className="material-icons">print</span>print</a>
                                                                        <div style={{ display: 'none' }}>
                                                                            <PrintContent ref={componentRef} />
                                                                        </div>
                                                                        {/* <img src="https://spacovers.imgix.net/spacoversdev/admin/theme/images/barcode.jpg?auto=compress,format" alt="" className="img-fluid d-block" /> */}
                                                                    </div>

                                                                </div>



                                                            </div>


                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3 ps-1 RightDetails">
                                            <div className="form-block">
                                                <h6 class="font-size-14 mb-1 mt-1">Status</h6>
                                                <h6 class="font-size-14 mb-1 mt-1 text-primary">{item.status}</h6>

                                                {/* <h5 class="font-size-14 mb-1 mt-1 material">Materials Used</h5>
                                            <ul class="list-group-item listspace">
                                                <li>Grey Spa Linear used for the bottom</li>
                                                <li>Vynil for top cover:Mahagony</li>
                                                <li>Recacril:Mahagony</li>
                                                <li>Spectaloc 600:Mahagony</li>
                                                <li>Paper material</li>
                                                <li>Red Tape</li>
                                            </ul> */}

                                            </div>
                                        </div>

                                    </div>




                                </div>


                            </div>
                        </div>


                        <Footer />
                        ]
                    </div>}

            </div>
        </>
    );
};

export default ViewItem;
