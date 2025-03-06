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
import React, { useState, useContext, useEffect, useRef } from "react";
// import * as Config from "../../constants/Config";
import { useHistory, Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { contentContext } from "../../context/contentContext";
import axios from 'axios';
import DataTable from "react-data-table-component";
import Select from 'react-select';
import Modal from 'react-bootstrap/Modal';
import SweetAlert from 'react-bootstrap-sweetalert';
import Loader from "../../components/loader";
import TableLoader from "../../components/tableLoader";
import tmdbApi from "../../api/tmdbApi";
import Header from "../../components/dashboard/header";
import moment from "moment";
import $ from "jquery";
import * as Config from "../../constants/Config";
import { useReactToPrint } from 'react-to-print';
import Sidebar from "../../components/dashboard/sidebar";
import Footer from "../../components/dashboard/footer";
import GoogleMap from "../googlemap";
import { getCountries } from "libphonenumber-js";

let { lambda, appname } = window.app;


const EditOrder = () => {
    let { id } = useParams();
    const [checkStatus, setCheckStatus] = useState(false);
    const [currentActive, setCurrentActive] = useState(1);
    const [createOrder, setCreateOrder] = useState([])
    const [user, setUser] = useState("");
    const [tabActive, setTabActive] = useState({
        tab0: false,
        tab1: false,
        tab2: false,
        tab3: false
    })
    const [orderErrors, setOrderErrors] = useState({})
    const [checkBoxVal, setCheckBox] = useState(false);
    const [msg, setMsg] = useState("");

    const [lookup, setLookup] = useState("")
    const [product, setProduct] = useState("")
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const [image, setImg] = useState("");
    const [custid, setCustId] = useState(0);
    const [price, setPrice] = useState(0);
    const [customerObj, setCustomerObj] = useState([])
    const [customerInfo, setCustomerInfo] = useState([])
    const [success, setSuccess] = useState(false);

    const [successOrder, setSuccessOrder] = useState(false);
    const [successOrderV1, setSuccessOrderV1] = useState(false);
    const [editCustomer, setEditCustomer] = useState("");
    const [editCustomer1, setEditCustomer1] = useState(false);
    const [showError, setShowError] = useState(false);
    const [custError, setCustError] = useState("");
    const [customerselectedObj, setCustomerSelectedObj] = useState({})
    const history = useHistory();
    const [btnLoader, setBtnLoader] = useState(false);
    const [btnSaveLoader, setBtnSaveLoader] = useState(false);
    const [places, setPlaces] = useState([]);
    const inputRef = useRef(null);
    const [edit, setEdit] = useState(false);
    const [option, setOption] = useState(false);
    const [deleteid, setDeleteId] = useState("");
    const [isdelete, setIsDelete] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [existmsg, setExistMsg] = useState(false);
    const [countries, setCountries] = useState('');
    const [addPopup, setAddPopup] = useState(false);
    const [permission, setPermission] = useState({});
    const [Ismsg, setIsMsg] = useState(false);
    const [UpdateSuccess, setUpdateSuccess] = useState(false);
    const [invalidContent, setInvalidContent] = useState(false);
    const [specification, setSpecification] = useState({});
    const [isImage, setIsImage] = useState(false)
    const [workshopData, setWorkshopData] = useState({});
    const [cuttingUsers, setCuttingUsers] = useState([]);
    const [sewingUsers, setSewingUsers] = useState([]);
    const [workshopinfo, setWorkshopInfo] = useState([]);
    const [counter, setCounter] = useState(1);
    const [cuttingCounter, setCuttingCounter] = useState(1);
    const [cuttinginfo, setCuttingInfo] = useState([]);
    const [sewingCounter, setSewingCounter] = useState(1);
    const [sewinginfo, setSewingInfo] = useState([]);
    const [approved, setApprove] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [productSpecification, setProductSpecifiaction] = useState([]);
    const [customerErrors, setCustomerErrors] = useState({});
    const [viewid, setViewId] = useState("")
    const [popup, setPopup] = useState(false)
    const [saved, setSaved] = useState(false);
    const [resetKey, setResetKey] = useState(0);
    const [showImage, setShowImage] = useState("");
    const [addon, setAddon] = useState([])
    const [data1, setData1] = useState([])
    const [color, setColor] = useState([])
    const { searchedFlag, setSearchedFlag, setUserSearch, isLoading, setIsLoading, userData, sortTableAlpha, arrow, setSelectedOptions, data, setData, rowsPerPage, setRowsPerPage, currentPageNew, setCurrentPage, lookUpType, setlookUpType, lookupsearch, setLookupSearch, route, setRoute, usePrevious, sortedColumn, setSortedColumn, sortDirection, setSortDirection, setActiveMenuId, GetTimeActivity, selctionOrder, setSelectionOrder } = useContext(contentContext);

    console.log("selctionOrder", selctionOrder);
    console.log("getitem", localStorage.getItem("order"))

    const handleImageClick = (e, id) => {
        setViewId(id - 1)
        setIsImage(true);
        console.log("viewiddd", id)
    }

    const onCancelImage = () => {
        setIsImage(false);
    }


    const columns = [

        {
            name: 'Image',
            cell: (props) => <img src={
                image + props.productimage + "?auto=compress,format&width=40"} alt='Image' />,
            sortable: false,

        },
        {
            name: 'item',
            selector: row => row?.productname,
            sortable: true,
        },
        {
            name: 'Dimension Image',
            cell: (props) => <img onClick={(e) => handleImageClick(e, props.id)} src={
                image + props.dimensionimage + "?auto=compress,format&width=100"} alt='Image' />,
            sortable: false,
        },
        {
            name: 'Color',
            selector: row => row && row.covercolor,
            sortable: true,
        },
        {
            name: 'Cover Fold',
            selector: row => row && row.coverfold,
            sortable: true,
        },
        {
            name: 'Tie Downs',
            selector: row => row && row.tiedown,
            sortable: true,
        },
        {
            name: 'Tie Downs Loc',
            selector: row => row && row.tiedownlocation,
            sortable: true,
        },
        {
            name: 'Cover Skirt Length',
            selector: row => row && row.coverskritlength,
            sortable: true,
        },
        {
            name: 'Cover Skirt Options',
            selector: row => row && row.skirtoption,
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: row => row && row.quantity,
            sortable: true,
        },

        {
            name: "ACTIONS",
            cell: (row) => (
                <div className="d-flex justify-content-between">
                    <a
                        onClick={e => handleViewProduct(e, row.id)}
                        className="text-success action-button"><i className="mdi mdi-eye font-size-18"></i></a>
                    <a onClick={(e) => handleEditProduct(e, row.id)}

                        className="text-success action-button"
                    >
                        <i className="mdi mdi-pencil font-size-18"></i>
                    </a>

                    <a onClick={(e) => handleDelete(e, row.id)}

                        className="text-success action-button">
                        <i className="mdi mdi-delete font-size-18"></i>
                    </a>

                </div>
            ),
        },
    ];

    const customNoRecords = () => {
        return (

            <div className="empty-state-body empty-record"  >
                <div className="empty-state__message">
                    <span className="material-icons">summarize</span>
                    <p className="form-check font-size-16">No products were found</p>
                </div> </div>
        )
    }
    useEffect(() => {
        // Load the Google Maps JavaScript API
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCbt0tJTo-ltu5B5xTGurz5GLRCZCEVkF4&libraries=places`;
        script.async = true;
        script.onload = initializeMap;
        document.body.appendChild(script);

        // Clean up the script tag when the component unmounts
        return () => {
            document.body.removeChild(script);
        };
    }, [searchInput && searchInput.length > 3]);
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
    const initializeMap = () => {
        // const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
        //   center: { lat: 37.7749, lng: -122.4194 }, // Default center (San Francisco)
        //   zoom: 12,
        // });

        //setMap(mapInstance);

        const input = document.getElementById('search-input');
        const searchBox = new window.google.maps.places.SearchBox(input);

        // mapInstance.addListener('bounds_changed', () => {
        //   searchBox.setBounds(mapInstance.getBounds());
        // });

        searchBox.addListener('places_changed', () => {
            const newPlaces = searchBox.getPlaces();
            setPlaces(newPlaces);

            if (newPlaces.length > 0) {
                const bounds = new window.google.maps.LatLngBounds();
                newPlaces.forEach(place => {
                    if (place.geometry && place.geometry.location) {
                        bounds.extend(place.geometry.location);
                    }
                });
                // mapInstance.fitBounds(bounds);
            }
        });
        setOption(true)
    };

    const handleSearchInputChange = (event) => {
        setCustError("");
        if (edit) {
            if (option === false) {
                setCustomerObj({ ...customerObj, customeraddress: event.target.value })
            } else {
                setCustomerObj({ ...customerObj, customeraddress: places[0]?.formatted_address })
            }
        }
        setSearchInput(event.target.value);

    };
    console.log("option", option);

    const handleClick = (num) => {
        console.log("number---->", num)
        let tmpTabActive = { ...tabActive };
        if (num === 1) {

            setCurrentActive(1);
        } else if (num === 2) {

            const isValid = formvalidation();
            if (isValid) {
                setCurrentActive(2);
                setTabActive({ ...tmpTabActive, tab0: true });
            }

        } else if (num === 3) {
            setCurrentActive(3)
            setTabActive({ ...tmpTabActive, tab0: true, tab1: true })
        }



    };
    const getCustomer = (e) => {
        GetTimeActivity()
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/customer?appname=' + appname + '&userid=' + localStorage.getItem("userId") + "&token=" + token + "&customerid=" + id,
        })
            .then(function (response) {
                //  console.log("response", response.data.result[0]);
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                }
                else {
                    console.log(response.data);
                    if (response.data.result.length > 0) {
                        setEditCustomer(response.data.result[0]);

                    } else {
                        setInvalidContent(true)
                    }
                }
            });
    }

    const handleSubmit = () => {
        GetTimeActivity()
        setIsLoading(true)

        const token = localStorage.getItem("token")
        let payload = {}
        payload = {
            "emailid": editCustomer.emailid?.trim(),
            //  "address": editCustomer.customeraddress.address1,
            "name": editCustomer.name?.trim(),
            "idc": editCustomer.idc,
            "phonenumber": editCustomer.phonenumber,
            "customeraddress": {
                "address1": editCustomer?.customeraddress?.address1,
                "address2": editCustomer.customeraddress?.address2,
                "state": editCustomer.customeraddress?.state,
                "pincode": editCustomer.customeraddress?.pincode
            },
            "billingaddress": {
                "address1": editCustomer?.billingaddress?.address1,
                "address2": editCustomer.billingaddress?.address2,
                "state": editCustomer.billingaddress?.state,
                "pincode": editCustomer.billingaddress?.pincode
            },
            //  "manager": editCustomer?.manager ? editCustomer?.manager : "",
            //  "permissions": permission,
            "check": editCustomer.check,
            "status": editCustomer.status,
            "type": editCustomer.type
        }

        if (checkStatus === false) {
            delete payload["status"];
            delete payload["userType"];
        }

        console.log('payload', payload);

        axios({
            method: 'POST',
            //  url: lambda + '/user?appname=' + appname + '&userid=' + id + "&token=" + token,
            url: lambda + '/customers?appname=' + appname + '&userid=' + localStorage.getItem("userId") + "&token=" + token + "&customerid=" + id,
            data: payload,
        })
            .then(function (response) {
                if (response) {
                    if (response.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else if (response.data.result == "This ACM assaigned to companies") {
                        setIsMsg(true);
                        setIsLoading(false);
                    } else {
                        getCustomer()
                        setIsLoading(false);
                        setUpdateSuccess(true)
                    }
                }

            });
    }

    const validate = (e) => {
        let formIsValid = true;
        let errors = { ...customerErrors }
        if (editCustomer.name === "" || editCustomer.name === undefined) {
            errors["name"] = "Name is required"
            formIsValid = false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (editCustomer.emailid === "" || editCustomer.emailid === undefined) {
            errors["emailid"] = "Email Id is required";
            formIsValid = false;
        } else if (!emailRegex.test(editCustomer.emailid)) {
            errors["emailid"] = "Please enter a valid email address";
            formIsValid = false;
        }
        if (editCustomer.status === "" || editCustomer.status === undefined || editCustomer.status === "undefined") {
            errors["status"] = "Status is required"
            formIsValid = false;
        }
        if (editCustomer.type === "" || editCustomer.type === undefined || editCustomer.type === "undefined") {
            errors["type"] = "type is required"
            formIsValid = false;
        }
        if (editCustomer.customeraddress?.address1 === undefined || editCustomer.customeraddress?.address1 === "") {
            errors["customeraddress1"] = "Delivery Address1 is required"
            formIsValid = false;
        }
        if (editCustomer.customeraddress?.address2 === undefined || editCustomer.customeraddress?.address2 === "") {
            errors["customeraddress2"] = "Delivery Address2 is required"
            formIsValid = false;
        }
        if (editCustomer.customeraddress?.state === undefined || editCustomer.customeraddress?.state === "") {
            errors["customerstate"] = "Delivery State is required"
            formIsValid = false;
        }
        if (editCustomer.customeraddress?.pincode === undefined || editCustomer.customeraddress?.pincode === "") {
            errors["customerpincode"] = "Delivery Zipcode is required"
            formIsValid = false;
        }
        if (editCustomer.billingaddress?.address1 === undefined || editCustomer.billingaddress?.address1 === "") {
            errors["billingaddress1"] = "Billing Address1 is required"
            formIsValid = false;
        }
        if (editCustomer.billingaddress?.address2 === undefined || editCustomer.billingaddress?.address2 === "") {
            errors["billingaddress2"] = "Billing Address2 is required"
            formIsValid = false;
        }
        if (editCustomer.billingaddress?.state === undefined || editCustomer.billingaddress?.state === "") {
            errors["billingstate"] = "Billing State is required"
            formIsValid = false;
        }
        if (editCustomer.billingaddress?.pincode === undefined || editCustomer.billingaddress?.pincode === "") {
            errors["billingpincode"] = "Billing Zipcode is required"
            formIsValid = false;
        }


        setCustomerErrors(errors)

        return formIsValid;
    }
    const handleUpdate = (e) => {
        GetTimeActivity()
        const isValid = validate();
        console.log("isValid", isValid);
        if (isValid) {
            handleSubmit();
        }
    }

    const handleDelete = (e, id) => {
        setDeleteId(id);
        setIsDelete(true);
    }

    function onCancel() {
        setIsDelete(false);
        setAddPopup(false);
        setEditCustomer("");
        setCustomerErrors("");
        setCountries("")

    }

    const handleDeleteProduct = (e) => {
        console.log("id", id);
        const newArray = productSpecification.filter(obj => obj.id !== deleteid);
        setProductSpecifiaction(newArray);
        setIsDelete(false);
    }
    const formvalidationReview = () => {

        let formIsValid = true;
        const errors = {};
        // if (!specification.covercolor || specification.covercolor === "") {
        //     errors.covercolor = "Please select covercolor"
        //     formIsValid = false;
        // }
        if (!specification.productname || specification.productname === "") {
            errors.productname = "Please select type"
            formIsValid = false;
        }
        // if (!specification.ponumber || specification.ponumber === "") {
        //     errors.ponumber = "Please select ponumber"
        //     formIsValid = false;
        // }
        // if (!specification.coverfold || specification.covercolorfold === "") {
        //     errors.coverfold = "Please select coverfold"
        //     formIsValid = false;
        // }
        // if (!specification.tiedown || specification.tiedown === "" || parseInt(specification.tiedown) === 0) {
        //     errors.tiedown = "Enter tiedown"
        //     formIsValid = false;
        // }
        // if (!specification.tiedownlocation || specification.tiedownlocation === "") {
        //     errors.tiedownlocation = "Please select tiedownloaction"
        //     formIsValid = false;
        // }
        
        // if ((!specification.tiedownlocationlength || specification.tiedownlocationlength === "" || parseInt(specification.tiedownlocationlength) === 0) && specification.tiedownlocation === "Custom") {
        //     errors.tiedownlocationlength = "Please enter tiedownlocationlength";
        //     formIsValid = false;
        // }

        // if (!specification.coverskritlength || specification.coverskritlength === "" || parseInt(specification.coverskritlength) === 0) {
        //     errors.coverskritlength = "Enter coverskritlength"
        //     formIsValid = false;
        // }
        // if (!specification.skirtoption || specification.skirtoption === "") {
        //     errors.skirtoption = "Please select skirtoption"
        //     formIsValid = false;
        // }
        // if (!specification.addon || specification.addon === "") {
        //     errors.addon = "Please select addon"
        //     formIsValid = false;
        // }
        // if (!specification.foamdensity || specification.foamdensity === "") {
        //     errors.foamdensity = "Please select foamdensity"
        //     formIsValid = false;
        // }
        // if (!specification.upgrades || specification.upgrades === "") {
        //     errors.upgrades = "Please select upgrades"
        //     formIsValid = false;
        // }
        // if (!specification.dimensionA || specification.dimensionA === "" || parseInt(specification.dimensionA) === 0) {
        //     errors.dimensionA = "Enter dimensionA"
        //     formIsValid = false;
        // }
        // if (!specification.dimensionB || specification.dimensionB === "" || parseInt(specification.dimensionB) === 0) {
        //     errors.dimensionB = "Enter dimensionB"
        //     formIsValid = false;
        // }
        // if (!specification.radius || specification.radius === "" || parseInt(specification.radius) === 0) {
        //     errors.radius = "Enter radius"
        //     formIsValid = false;
        // }
        // if (!createOrder.productspecification?.additionalinstructions || createOrder.productspecification?.additionalinstructions.trim() === "") {
        //     errors.additionalinstructions = "Enter additional instructions";
        //     formIsValid = false;
        // }
        // if (!specification.quantity || specification.quantity === "" || parseInt(specification.quantity) === 0) {
        //     errors.quantity = "Enter quantity"
        //     formIsValid = false;
        // }
        setOrderErrors(errors);

        return formIsValid;
    }
    const formvalidationReview2 = () => {
        let formIsValid = true;
        const errors = {};
        // if (!createOrder.productspecification?.additionalinstructions || createOrder.productspecification?.additionalinstructions === "") {
        //     errors.additionalinstructions = "Enter additionalinstructions"
        //     setTimeout(function () { setOrderErrors("") }, 3000);
        //     formIsValid = false;
        // }
        if (!createOrder.productspecification?.quantity || createOrder.productspecification?.quantity === "") {
            errors.quantity = "Enter quantity"
            setTimeout(function () { setOrderErrors("") }, 3000);
            formIsValid = false;
        }
        setOrderErrors(errors);

        return formIsValid;
    }

    const formvalidation = () => {
        let formIsValid = true;
        const errors = {};
        let tmpTabActive = { ...tabActive };
        let tab0 = false;

        if (!createOrder.name || createOrder.name.trim() === "") {
            errors.wholesalername = " Please select Wholesaler Name";
            formIsValid = false;
        }
        if (!createOrder.type || createOrder.type.trim() === "") {
            errors.type = " Please select Type";
            formIsValid = false;
        }
        setTabActive({ ...tmpTabActive, tab0: tab0 });
        setOrderErrors(errors);

        return formIsValid;
    };

    const handleBack = () => {
        localStorage.removeItem("order")
        setSelectionOrder("");
        history.push("/orders")
    }

    const handleCreateOrder = () => {
        const isValid = formvalidation();
        console.log("isValid", isValid);
        if (isValid) {
            let tmpTabActive = { ...tabActive };
            setTabActive({ ...tmpTabActive, tab0: true });
            setCurrentActive(2);
        }

    }
    const handleNext2 = (e, item) => {
        console.log("item", item)
        let tmpTabActive = { ...tabActive };
        setCreateOrder({ ...createOrder, productname: item.productname, sku: item.sku, productimage: item.images[0].path, totalprice: item.price, dimensionimage: item && item.images && item.images[1] ? item.images[1].path : "" });
        if (item && item.images && item.images[1]) {
            setShowImage(item.images[1].path)
        }
        setPrice(item.price)
        setCurrentActive(3);
        setTabActive({ ...tmpTabActive, tab1: true });


    }
    const handleOrderReview = () => {
        let tmpTabActive = { ...tabActive };

        const isValid = formvalidationReview();
        if (isValid) {
            setCurrentActive(4);
            setTabActive({ ...tmpTabActive, tab2: true });

        }
    }
    const handleOrderReview2 = () => {
        let tmpTabActive = { ...tabActive };

        const isValid = formvalidationReview2();
        if (isValid) {
            setCurrentActive(4);
            setTabActive({ ...tmpTabActive, tab2: true });

        }
    }
    const checkCustomer = () => {
        const sumOfValues = customerInfo.reduce((acc, obj) => {
            const valueAsNumber = parseFloat(obj.quantitypercustomer) || 0;
            return acc + valueAsNumber;
        }, 0);
        if (customerInfo.length > 0 && parseInt(createOrder?.productspecification?.quantity) === sumOfValues) {
            return true;
        } else {
            return false;
        }
    }
    const formvalidationSave = () => {
        let formIsValid = true;
        const errors = {};
        // const sumOfValues1 = productSpecification.reduce((acc, obj) => {
        //     const valueAsNumber = parseFloat(obj.quantity) || 0;
        //     return acc + valueAsNumber;
        // }, 0);
        if (workshopinfo && workshopinfo.length <= 0) {
            errors.workshop = "Please select Workshop Station";
            formIsValid = false;
        }
        // const sumOfValues = cuttinginfo.reduce((acc, obj) => {
        //     const valueAsNumber = parseFloat(obj.cuttingQuantity) || 0;
        //     return acc + valueAsNumber;
        // }, 0);

        // console.log("sumOfValues", sumOfValues);
        // if (sumOfValues === sumOfValues1) {

        // } else {
        //     errors.cuttingQuantity = "Please Enter correct quantity";
        //     formIsValid = false;
        // }
        // const totalSumOfValues = sewinginfo.reduce((acc, obj) => {
        //     const valueAsNumber = parseFloat(obj.sewingQuantity) || 0;
        //     return acc + valueAsNumber;
        // }, 0);
        // console.log("totalSumOfValues", totalSumOfValues);
        // if (totalSumOfValues === sumOfValues1) {

        // } else {
        //     errors.sewingQuantity = "Please Enter correct quantity";
        //     formIsValid = false;
        // }
        // console.log("product------->", typeof (parseInt(createOrder.productspecification.quantity)))
        // if (cuttinginfo && cuttinginfo.length <= 0) {
        //     errors.cutting = "Please select Cutting Station";
        //     formIsValid = false;
        // }
        // if (sewinginfo && sewinginfo.length <= 0) {
        //     errors.sewing = "Please select Sewing Station";
        //     formIsValid = false;
        // }

        // const doesKeyExist = cuttinginfo.some((item) => item.hasOwnProperty("cuttingusername"));
        // if (doesKeyExist === false) {
        //     errors.cutting = "Please select Cutting Station";
        //     formIsValid = false;
        // }

        // const doesKeyExist1 = sewinginfo.some((item) => item.hasOwnProperty("sewingusername"));
        // if (doesKeyExist1 === false) {
        //     errors.sewing = "Please select Sewing Station";
        //     formIsValid = false;
        // }

        //  let mandatoryFileds = [{ name: 'Cutting Username', key: 'cuttingusername' }]
        //  if (mandatoryFileds) {
        //      mandatoryFileds.forEach(function (item) {

        //          if (
        //              (cuttinginfo[item.key] == "" ||
        //                  cuttinginfo[item.key] == undefined ||
        //                  cuttinginfo[item.key] == "undefined")
        //          ) {
        //              errors["cutting"] = item.name + " is required";
        //              formIsValid = false;
        //          }

        //      });
        //  }


        //  let mandatoryFileds1 = [{ name: 'Sewing Username', key: 'sewingusername' }]
        //  if (mandatoryFileds1) {
        //      mandatoryFileds1.forEach(function (item) {

        //          if (
        //              (sewinginfo[item.key] == "" ||
        //                  sewinginfo[item.key] == undefined ||
        //                  sewinginfo[item.key] == "undefined")
        //          ) {
        //              errors["sewing"] = item.name + " is required";
        //              formIsValid = false;
        //          }

        //      });
        //  }

        setOrderErrors(errors);

        return formIsValid;
    };

    const handleOrderCreate = (e, value) => {
        console.log("val", value)
        let isValid;
        if (value === "inUpdate") {
            // isValid = formvalidation();
            console.log("if excuted")

        } else if (value === "save") {


            isValid = formvalidationSave();
            if (isValid) {
                setBtnSaveLoader(true)
            }


        } else if (value === "approve") {
            if (selctionOrder === "spacovers") {

                isValid = formvalidationSave();
                if (isValid) {
                    setBtnLoader(true)
            }
          
        }
        }
        // console.log("isValid", isValid)
        if (isValid) {
            // setBtnLoader(false)


            let addObj
            if (value === "save" || value === "approve") {
                addObj = { ...createOrder, ordertype: selctionOrder, orderstatus: "offline", workshopinfo: workshopinfo, cuttinginfo: cuttinginfo, sewinginfo: sewinginfo }
            } else {
                const sumOfValues = productSpecification.reduce((acc, obj) => {
                    const valueAsNumber = parseFloat(obj.totalprice) || 0;
                    return acc + valueAsNumber;
                }, 0);
                const sumOfValues1 = productSpecification.reduce((acc, obj) => {
                    const valueAsNumber = parseFloat(obj.quantity) || 0;
                    return acc + valueAsNumber;
                }, 0);
                addObj = { ...createOrder, ordertype: selctionOrder, productspecification: productSpecification, overallquantity: sumOfValues1, overallprice: sumOfValues, orderstatus: "offline" }
            }
            console.log("adddd---->", addObj)
            let urlLink;
            if (value === "approve") {
                if (selctionOrder !== "spacovers") {
                    urlLink = lambda + "/orderupdate?appname=" + appname + "&token=" + localStorage.getItem("token") + "&userid=" + localStorage.getItem("userId") + '&orderid=' + id + "&statusUpdate=DELIVERYSTARTED"
                } else {
                    urlLink = lambda + "/orderupdate?appname=" + appname + "&token=" + localStorage.getItem("token") + "&userid=" + localStorage.getItem("userId") + '&orderid=' + id + "&approved=approved"
                }
            } else {

                urlLink = lambda + "/orderupdate?appname=" + appname + "&token=" + localStorage.getItem("token") + "&userid=" + localStorage.getItem("userId") + '&orderid=' + id
            }
            console.log("addObj", addObj);
            console.log("urlLink", urlLink);

            axios({
                method: 'post',
                url: urlLink,
                data: addObj,
            })
                .then(function (response) {
                    if (response) {
                        console.log("response.result", response)
                        if (response.data.result === "Updated") {

                            getOrder();

                            if (value === "approve") {
                                setApprove(true)
                                setBtnLoader(false)
                            } else if (value === "save") {
                                setSaved(true)
                                setBtnSaveLoader(false)
                            } else {
                                setBtnLoader(false)
                                setUpdateSuccess(true)

                            }

                        }

                    }

                });
        } else {
            if (value === "update") {
                setShowError(true)
            }
        }


    }
    const handleOrderCreate1 = () => {
        // const isValid = formvalidationReview();
        // console.log("isvlid", isValid);

        const sumOfValues = productSpecification.reduce((acc, obj) => {
            const valueAsNumber = parseFloat(obj.totalprice) || 0;
            return acc + valueAsNumber;
        }, 0);
        const sumOfValues1 = productSpecification.reduce((acc, obj) => {
            const valueAsNumber = parseFloat(obj.quantity) || 0;
            return acc + valueAsNumber;
        }, 0);
        console.log("result----->", sumOfValues1)
        setBtnLoader(true)
        let addObj = { ...createOrder, productspecification: productSpecification, overallquantity: sumOfValues1, overallprice: sumOfValues, ordertype: selctionOrder, status: "NEW", orderstatus: "offline" }
        console.log("addObj", addObj);
        const token = localStorage.getItem("token")
        if (productSpecification.length > 0) {
            axios({
                method: 'PUT',
                url: lambda + "/createorder?appname=" + appname + "&token=" + token + "&userid=" + localStorage.getItem("userId"),
                data: addObj,
            })
                .then(function (response) {
                    if (response) {
                        console.log("response.result", response)
                        if (response.data.result === "Order added successfully") {
                            setBtnLoader(false)
                            setSuccess(true)
                        }

                    }

                });
        } else {
            setSuccessOrder(true)
            setBtnLoader(false)
        }





    }

    function onConfirm() {
        setSuccess(false);

        history.push("/orders")
    };
    function onConfirm2() {

        setSuccessOrder(false);

    };
    function onConfirmV1() {
        setSuccessOrderV1(false);
        setAddPopup(false)
        history.push("/createorder")
    }
    function onConfirm1() {
        setShowError(false);
    };


    const userActivity = () => {
        let path = window.location.pathname.split("/");
        const pageName = path[path.length - 1];
        var presentTime = moment();
        let payload;

        payload = {
            "userid": localStorage.getItem("userId"),
            "pagename": "CREATEORDERS",
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

    const handleChangeCustomer = (e) => {
        setCustError("")
        if (e.target.name === "quantitypercustomer") {
            const numericValue = e.target.value.replace(/\D/g, '');
            setCustomerObj({ ...customerObj, [e.target.name]: numericValue })
        } else {
            setCustomerObj({ ...customerObj, [e.target.name]: e.target.value })
        }
    }
    const handleAddCustomer1 = (e) => {
        const sumOfValues = customerInfo.reduce((acc, obj) => {
            const valueAsNumber = parseFloat(obj.quantitypercustomer) || 0;
            return acc + valueAsNumber;
        }, 0);
        let checkVal = createOrder && createOrder.productspecification && createOrder.productspecification.quantity;
        let quantityCheck = sumOfValues + parseInt(customerObj.quantitypercustomer)
        console.log("sumOfValues", quantityCheck, checkVal)
        if (!customerObj.customername || customerObj.customername.trim() === "") {
            setCustError(" Please Enter Customer Name");
        } else if (places && !places.length || inputRef.current.value === "") {
            setCustError(" Please Enter customer Address");
        } else if (!customerObj.quantitypercustomer || customerObj.quantitypercustomer.trim() === "" || parseInt(customerObj.quantitypercustomer.trim()) === 0) {
            setCustError(" Please Enter quantity");

        } else if (quantityCheck > checkVal) {
            setCustError("Product quantity and Customers total quantity is mismatched")
            setTimeout(function () { setCustError("") }, 3000);
        } else {
            const newId = customerInfo.length + 1;
            const newObject = { id: newId, customername: customerObj.customername, customeraddress: places[0].formatted_address, quantitypercustomer: customerObj.quantitypercustomer, };
            setCustomerInfo(prevState => [...prevState, newObject]);
            setCustomerObj({ ...customerObj, customername: "", customeraddress: "", quantitypercustomer: "" })
            setSearchInput("");
            setPlaces([])
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        }


    }

    const handleEditProduct = (e, id) => {
        setEdit(true)
        setCustId(id)
        setEditCustomer1(true);
        const selected = productSpecification.find(obj => obj.id === id);
        setSpecification(selected);
        setOrderErrors("")
        // setCustomerSelectedObj(selected)
        // setCustError("")

    }
    const handleViewProduct = (e, id) => {
        setViewId(id - 1)
        setPopup(true)
        console.log("viewid----->", viewid)
    }
    const handleUpdateProduct = () => {
      
        const updatedProductSpecification = productSpecification.map(obj =>
            obj.id === custid ? { ...obj, ...specification } : obj
        );

        // Update the state with the modified data
        setProductSpecifiaction(updatedProductSpecification);


        // Reset states after updating
        setEdit(false);
        setEditCustomer1(false);
        setCustId(null);
        setSpecification({ ...specification, productname: "", productimage: "", dimension: "", ponumber: "", covercolor: "", coverfold: "", tiedown: "", tiedownlocation: "", coverskritlength: "", skirtoption: "", foamdensity: "", upgrades: [], dimensionA: "", dimensionB: "", quantity: "", radius: "", tiedownlocationlength: "", additionalinstructions: "" });
        // setSpecification({});
        setCustomerSelectedObj({});
        setCustError('');
    };
    // const handleUpdateCustomer = (e) => {
    // const sumOfValues = customerInfo.reduce((acc, obj) => {
    //     const valueAsNumber = parseFloat(obj.quantitypercustomer) || 0;
    //     return acc + valueAsNumber;
    // }, 0);
    // let checkVal = createOrder && createOrder.productspecification && createOrder.productspecification.quantity;
    // let quantityCheck = sumOfValues - parseInt(customerselectedObj.quantitypercustomer) + parseInt(customerObj.quantitypercustomer)
    // console.log("sumOfValues", quantityCheck, checkVal)
    // if (!customerObj.customername || customerObj.customername.trim() === "") {
    //     setCustError(" Please Enter Customer Name");
    // } else if (customerObj.customeraddress === undefined && !places.length) {
    //     setCustError(" Please Enter Customer Address");
    // } else if (!customerObj.quantitypercustomer || customerObj.quantitypercustomer.trim() === "" || parseInt(customerObj.quantitypercustomer.trim()) === 0) {
    //     setCustError(" Please Enter quantity");

    // } else
    //     if (quantityCheck > checkVal) {
    //         setCustError("Product quantity and customers total quantity is mismatched")
    //     } 
    // else {

    // setProductSpecifiaction(prevArray => {
    //     return prevArray.map(obj => {
    //         if (obj.id === custid) {
    // Replace the object with the new one
    // if (places && places[0] && places[0]?.formatted_address) {
    //     return { ...customerObj, customeraddress: places[0].formatted_address };
    // } else {
    // return productSpecification
    // }
    //         }
    //         return obj; // Return unchanged objects
    //     });
    // });
    // setEditCustomer(false);
    // setCustomerObj({ ...customerObj, customername: "", customeraddress: "", quantitypercustomer: "" })
    // //setSearchInput("");
    // setPlaces([])
    // if (inputRef.current) {
    //     inputRef.current.value = '';
    // }
    // setEdit(false);
    // setOption(false)
    // }


    // }
    const generateDynamicContentCutting = () => {
        const dynamicContent = [];
        for (let i = 1; i <= cuttingCounter; i++) {
            dynamicContent.push(

                <div className="row mt-2">
                    {/* {cuttingUsers&&cuttingUsers.length} */}
                    <div className="col-md-4" key={i}>
                        {i === 1 && <label for="username" className="form-label">Cutting Station</label>}
                        {createOrder.status === "NEW" && cuttingUsers && cuttingUsers.length > 0 ? <select name="cuttingusername" onChange={(e) => handleChangeCut(e, i - 1, "cutting")} value={cuttinginfo && cuttinginfo[i - 1]?.cuttingusername} className="form-select col-md-6 for-clear cutting">
                            <option value=""> Select Cutting User</option>
                            {cuttingUsers && cuttingUsers.length > 0 &&cuttingUsers?.filter(task => task.status === "ACTIVE")?.map((task, i) => {
                                const disabledUserIds = sewinginfo.map(entry => entry.userid);
                                return (
                                    <><option key={i} value={task.name} disabled={disabledUserIds.includes(task.userid)}>{task.name}</option></>
                                )
                            }
                            )}

                        </select> : <select name="cuttingusername" onChange={(e) => handleChangeCut(e, i - 1, "cutting")} value={cuttinginfo && cuttinginfo[i - 1]?.cuttingusername} className="form-select col-md-6 for-clear" disabled>
                            <option value=""> Select Cutting User</option>
                            {cuttingUsers && cuttingUsers.length > 0 && cuttingUsers.map((task, i) => {
                                return (
                                    <><option key={i} value={task.name}>{task.name}</option></>
                                )
                            }
                            )}

                        </select>}



                    </div>

                    <div className="col-md-1">
                        {createOrder.status === "NEW" && cuttingUsers && cuttingUsers.length > 0 ?
                            <>
                                {i === 1 && <label for="quantity" className="form-label">Quantity</label>}
                                <input id="quantity" type="tel" name="cuttingQuantity" onChange={(e) => handleChangeCut(e, i - 1)} value={cuttinginfo && cuttinginfo[i - 1]?.cuttingQuantity} className="form-control col-md-3 for-clear cutting" min="1" maxLength="3"></input>
                            </> :
                            <>
                                {i === 1 && <label for="quantity" className="form-label">Quantity</label>}
                                <input id="quantity" type="tel" name="cuttingQuantity" onChange={(e) => handleChangeCut(e, i - 1)} value={cuttinginfo && cuttinginfo[i - 1]?.cuttingQuantity} className="form-control col-md-3 for-clear" min="1" maxLength="3" disabled></input>
                            </>
                        }

                    </div>
                    {createOrder.status === "NEW" ?
                        <>
                            {cuttingCounter > 1 && <div className="col-md-1 dlt_btn">
                                {i === 1 && <label className="form-label">DELETE</label>}
                                <a onClick={(e) => handleDeleteCutting(e, (i - 1))}
                                    className="btn btn-primary"

                                >
                                    <i className="mdi mdi-delete font-size-18"></i>
                                </a></div>}

                        </> : <>
                            {
                                cuttingCounter > 1 && (
                                    <div className="col-md-1 dlt_btn">
                                        {i === 1 && <label className="form-label">DELETE</label>}
                                        <button
                                            onClick={(e) => handleDeleteCutting(e, i - 1)}
                                            className="btn btn-primary"
                                            disabled
                                        >
                                            <i className="mdi mdi-delete font-size-18"></i>
                                        </button>
                                    </div>
                                )
                            }

                        </>}


                </div>
            );
        }
        return dynamicContent;
    };

    const handleDeleteCutting = (e, index) => {
        setCuttingCounter(cuttingCounter - 1)
        console.log("index", index);
        const newArray = cuttinginfo.filter((item, i) => i !== index);
        setCuttingInfo(newArray);
        console.log("newArray", newArray);

        if (newArray && newArray.length <= 0) {
            console.log("came")
            const elements = document.getElementsByClassName('cutting');
            for (let i = 0; i < elements.length; i++) {
                elements[i].value = '';
            }
        }
    }

    console.log("cuttingCounter", cuttingCounter)
    const handleChangeCut = (e, index, key) => {

        if (!!orderErrors[e.target.name]) {
            let error = Object.assign({}, orderErrors);
            delete error[e.target.name];
            setOrderErrors(error);
        }
        if (!!orderErrors[key]) {
            let error = Object.assign({}, orderErrors);
            delete error[key];
            setOrderErrors(error);
        }
        const numericValue = e.target.value.replace(/\D/g, '');
        if (e.target.name === "cuttingusername") {

            setCuttingInfo((prevDataArray) => {
                const updatedArray = [...prevDataArray];
                const item = updatedArray[index] || {};
                for (let key in cuttingUsers) {
                    if (cuttingUsers.hasOwnProperty(key) && cuttingUsers[key].name === e.target.value) {
                        updatedArray[index] = {
                            ...item,
                            [e.target.name]: e.target.value,
                            userid: cuttingUsers[key].userid,
                        };
                    }
                }
                return updatedArray;
            });
        }

        if (e.target.name === "cuttingQuantity") {
            const sumOfValues1 = productSpecification.reduce((acc, obj) => {
                const valueAsNumber = parseFloat(obj.quantity) || 0;
                return acc + valueAsNumber;
            }, 0);

            const sumOfValues = cuttinginfo.reduce((acc, obj) => {
                // Ensure both product specification quantity and cutting quantity have two digits
                const productQuantity = parseFloat(obj.quantity) || 0;


                return acc + productQuantity
            }, 0);

            if (e.target.value) {
                var total = sumOfValues + parseInt(e.target.value)
            } else {
                var total = 0;
            }
            console.log("total", total, sumOfValues1)
            if (total <= sumOfValues1) {
                setCuttingInfo((prevDataArray) => {
                    const updatedArray = [...prevDataArray];
                    const item = updatedArray[index] || {};
                    updatedArray[index] = {
                        ...item,
                        [e.target.name]: numericValue,
                    };
                    return updatedArray;
                });

            } else {

                setShowError(true)
                setCuttingInfo((prevDataArray) => {
                    const updatedArray = [...prevDataArray];
                    const item = updatedArray[index] || {};
                    updatedArray[index] = {
                        ...item,
                        [e.target.name]: "",
                    };
                    return updatedArray;
                });
            }


        }

    }

    const formvalidationSewing = (index) => {
        let formIsValid = true;
        const errors = {};

        const sewingUsername = sewinginfo[index]?.sewingusername;
        const sewingQuantity = sewinginfo[index]?.sewingQuantity;
        if (!sewingUsername || sewingUsername === "") {
            if (!sewingQuantity || sewingQuantity.trim() === "") {

                errors.sewing = "Please Enter username and quantity";
                setTimeout(() => {
                    setOrderErrors({});
                }, 3000);

            } else {

                errors.sewingusername = "Please Enter username";
            }
            formIsValid = false;
        } else if (!sewingQuantity || sewingQuantity.trim() === "") {
            // Only cuttingQuantity is empty
            errors.sewingQuantity = "Please Enter quantity";
            formIsValid = false;
        } else if (sewinginfo[index]?.sewingQuantity === "0") {
            errors.sewingQuantity = "Please Enter quantity greater than 0";
            formIsValid = false;
        }

        setOrderErrors(errors);
        return formIsValid;

    }



    const formvalidationCutting = (index) => {
        let formIsValid = true;
        const errors = {};

        const cuttingUsername = cuttinginfo[index]?.cuttingusername;
        const cuttingQuantity = cuttinginfo[index]?.cuttingQuantity;
        console.log(typeof (cuttinginfo[index]?.cuttingQuantity));

        if (!cuttingUsername || cuttingUsername === "") {
            if (!cuttingQuantity || cuttingQuantity.trim() === "") {
                errors.cutting = "Please Enter username and quantity";

                // Set a timeout to clear the error message after 3000 milliseconds (3 seconds)
                setTimeout(() => {
                    setOrderErrors({});
                }, 3000);
            } else {

                errors.cuttingusername = "Please Enter username";
            }
            formIsValid = false;
        } else if (!cuttingQuantity || cuttingQuantity.trim() === "") {
            // Only cuttingQuantity is empty
            errors.cuttingQuantity = "Please Enter quantity";
            formIsValid = false;
        }
        else if (cuttinginfo[index]?.cuttingQuantity === "0") {
            // Only cuttingQuantity is empty
            errors.cuttingQuantity = "Please Enter quantity greater than 0";
            formIsValid = false;
        }



        setOrderErrors(errors);
        return formIsValid;
    };


    console.log("cuttinginfo", cuttinginfo);


    const addHtmlCodeSewing = () => {

        const isValid = formvalidationSewing(sewingCounter - 1)

        if (isValid) {
            setSewingCounter(sewingCounter + 1);
        }
    };

    const generateDynamicContentSewing = () => {
        const dynamicContent = [];
        for (let i = 1; i <= sewingCounter; i++) {
            dynamicContent.push(
                <div className="row mt-2" key={i}>

                    <div className="col-md-4">
                        {i === 1 && <label for="username" className="form-label">Sewing Station</label>}
                        {createOrder.status === "NEW" && sewingUsers && sewingUsers.length > 0 ? <select name="sewingusername" onChange={(e) => handleChangeSew(e, i - 1, "sewing")} value={sewinginfo && sewinginfo[i - 1]?.sewingusername} className="form-select col-md-6 for-clear sewing">
                            <option value=""> Select Sewing User</option>

                            {sewingUsers  && sewingUsers?.length > 0 &&sewingUsers?.filter(task => task.status === "ACTIVE")?.map((task, i) => {
                                const disabledUserIds = sewinginfo.map(entry => entry.userid);
                                console.log("ttttt", disabledUserIds);
                                return (
                                    
                                    <><option key={i} value={task.name} disabled={disabledUserIds.includes(task.userid)}>{task.name}</option></>
                                )
                            }
                            )}

                        </select> : <select name="sewingusername" onChange={(e) => handleChangeSew(e, i - 1, "sewing")} value={sewinginfo && sewinginfo[i - 1]?.sewingusername} className="form-select col-md-6 for-clear" disabled>
                            <option value=""> Select Sewing User</option>
                            {sewingUsers && sewingUsers.length > 0 && sewingUsers.map((task, i) => {
                                return (
                                    <><option key={i} value={task.name}>{task.name}</option></>
                                )
                            }
                            )}

                        </select>}

                    </div>
                    <div className="col-md-1 ">
                        {createOrder.status === "NEW" && sewingUsers && sewingUsers.length > 0 ?
                            <>
                                {i === 1 && <label for="quantity" className="form-label">Quantity</label>}
                                <input id="quantity" type="tel" name="sewingQuantity" onChange={(e) => handleChangeSew(e, i - 1)} value={sewinginfo && sewinginfo[i - 1]?.sewingQuantity} className="form-control col-md-3 for-clear sewing" maxLength="3"></input>
                            </> : <>
                                {i === 1 && <label for="quantity" className="form-label">Quantity</label>}
                                <input id="quantity" type="tel" name="sewingQuantity" onChange={(e) => handleChangeSew(e, i - 1)} value={sewinginfo && sewinginfo[i - 1]?.sewingQuantity} className="form-control col-md-3 for-clear" maxLength="3" disabled></input>
                            </>}

                    </div>
                    {createOrder.status === "NEW" ?
                        <>
                            {sewingCounter > 1 && <div className="col-md-1 dlt_btn">
                                {i === 1 && <label className="form-label">DELETE</label>}
                                <button onClick={(e) => handleDeleteSewing(e, (i - 1))}
                                    className="btn btn-primary"
                                >
                                    <i className="mdi mdi-delete font-size-18"></i>
                                </button></div>}
                        </> : <>
                            {sewingCounter > 1 && <div className="col-md-1 dlt_btn">
                                {i === 1 && <label className="form-label">DELETE</label>}
                                <button onClick={(e) => handleDeleteSewing(e, (i - 1))}
                                    className="btn btn-primary"
                                    disabled
                                >
                                    <i className="mdi mdi-delete font-size-18"></i>
                                </button></div>}
                        </>}



                </div>
            );
        }
        return dynamicContent;
    };
    const handleDeleteSewing = (e, index) => {
        console.log("index", index);
        const newArray = sewinginfo.filter((item, i) => i !== index);
        setSewingInfo(newArray);
        setSewingCounter(sewingCounter - 1)
        if (newArray && newArray.length <= 0) {
            console.log("came")
            const elements = document.getElementsByClassName('sewing');
            for (let i = 0; i < elements.length; i++) {
                elements[i].value = '';
            }
        }
    }

    const handleChangeSew = (e, index, key) => {

        if (!!orderErrors[e.target.name]) {
            let error = Object.assign({}, orderErrors);
            delete error[e.target.name];
            setOrderErrors(error);
        }
        if (!!orderErrors[key]) {
            let error = Object.assign({}, orderErrors);
            delete error[key];
            setOrderErrors(error);
        }
        const numericValue = e.target.value.replace(/\D/g, '');
        if (e.target.name === "sewingusername") {
            setSewingInfo((prevDataArray) => {
                const updatedArray = [...prevDataArray];
                const item = updatedArray[index] || {};
                for (let key in sewingUsers) {
                    if (sewingUsers.hasOwnProperty(key) && sewingUsers[key].name === e.target.value) {
                        updatedArray[index] = {
                            ...item,
                            [e.target.name]: e.target.value,
                            userid: sewingUsers[key].userid,
                        };
                    }
                }
                return updatedArray;
            });

        }
        console.log("ssss---->", sewinginfo)
        if (e.target.name === "sewingQuantity") {
            const sumOfValues1 = productSpecification.reduce((acc, obj) => {
                const valueAsNumber = parseFloat(obj.quantity) || 0;
                return acc + valueAsNumber;
            }, 0);

            const sumOfValues = sewinginfo.reduce((acc, obj) => {
                // Ensure both product specification quantity and cutting quantity have two digits
                const productQuantity = parseFloat(obj.sewingQuantity) || 0;


                return acc + productQuantity
            }, 0);
            console.log("sumOfValues", sumOfValues);
            if (e.target.value) {
                var total = sumOfValues + parseInt(e.target.value)
            } else {
                var total = 0;
            }
            console.log("total--->", total, sumOfValues1)
            if (total <= sumOfValues1) {
                setSewingInfo((prevDataArray) => {
                    const updatedArray = [...prevDataArray];
                    const item = updatedArray[index] || {};
                    updatedArray[index] = {
                        ...item,
                        [e.target.name]: numericValue,
                    };
                    return updatedArray;
                });

            } else {
                setShowError(true)
                setSewingInfo((prevDataArray) => {
                    const updatedArray = [...prevDataArray];
                    const item = updatedArray[index] || {};
                    updatedArray[index] = {
                        ...item,
                        [e.target.name]: "",
                    };
                    return updatedArray;
                });
            }
        }

    }

    const handleCheckSewing = () => {

        const sumOfValues1 = productSpecification.reduce((acc, obj) => {
            const valueAsNumber = parseFloat(obj.quantity) || 0;
            return acc + valueAsNumber;
        }, 0);

        const sumOfValues = sewinginfo.reduce((acc, obj) => {
            const valueAsNumber = parseFloat(obj.sewingQuantity) || 0;
            return acc + valueAsNumber;
        }, 0);

        if (sumOfValues < sumOfValues1) {
            return true;
        } else {
            return false;
        }

    };


    console.log("customerInfo", customerInfo)
    console.log("createOrder---->", createOrder)

    const getPermissions = (userType) => {
        GetTimeActivity()
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/userPermissions?appname=' + appname + '&type=' + userType + "&token=" + token,
        })
            .then(function (response) {
                console.log("response.data.result.data[0]", response.data.result.data[0])
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setPermission(response.data.result.data[0].permissions)
                }
            });
    }

    const handleChange1 = (e) => {
        console.log('typeeeeeeeeee', e.target.value)
        console.log('nameeeee', e.target.name)
        if (!!customerErrors[e.target.name]) {
            let error = Object.assign({}, customerErrors);
            delete error[e.target.name];
            setCustomerErrors(error);

        }
        if (e.target.name === "address") {
            if (id) {
                setCheckStatus(true);
            }
            getPermissions(e.target.value);
            setEditCustomer({ ...editCustomer, [e.target.name]: e.target.value });

        } else if (e.target.name === "phonenumber") {
            const numericValue = e.target.value.replace(/\D/g, '');
            setEditCustomer({ ...editCustomer, [e.target.name]: numericValue });
        }

        else if (e.target.name === "status") {
            if (id) {
                setCheckStatus(true);
            }
            setEditCustomer({ ...editCustomer, [e.target.name]: e.target.value });
        } else if (e.target.name === "type") {
            // if(id){
            //     setCheckStatus(true);
            // }
            setEditCustomer({ ...editCustomer, [e.target.name]: e.target.value });
        }
        else if (e.target.name === "customeraddress1") {
            console.log("checkBoxVal", checkBoxVal)

            setEditCustomer({
                ...editCustomer,
                customeraddress: {
                    ...editCustomer.customeraddress,
                    address1: e.target.value,
                },
            });

        }
        else if (e.target.name === "customeraddress2") {
            setEditCustomer({
                ...editCustomer,
                customeraddress: {
                    ...editCustomer.customeraddress,
                    address2: e.target.value,
                },
            });
        }
        else if (e.target.name === "customerstate") {
            setEditCustomer({
                ...editCustomer,
                customeraddress: {
                    ...editCustomer.customeraddress,
                    state: e.target.value,


                },
            });
        }
        else if (e.target.name === "customerpincode") {
            const numericValue = e.target.value.replace(/\D/g, '');
            setEditCustomer({
                ...editCustomer,
                customeraddress: {
                    ...editCustomer.customeraddress,
                    pincode: numericValue,


                },
            });
        }
        else if (e.target.name === "billingaddress1") {
            setEditCustomer({
                ...editCustomer,
                billingaddress: {
                    ...editCustomer.billingaddress,
                    address1: e.target.value,
                },
            });
        }
        else if (e.target.name === "billingaddress2") {
            setEditCustomer({
                ...editCustomer,
                billingaddress: {
                    ...editCustomer.billingaddress,
                    address2: e.target.value,
                },
            });
        }
        else if (e.target.name === "billingstate") {
            setEditCustomer({
                ...editCustomer,
                billingaddress: {
                    ...editCustomer.billingaddress,
                    state: e.target.value,


                },
            });
        }
        else if (e.target.name === "billingpincode") {
            const numericValue = e.target.value.replace(/\D/g, '');
            setEditCustomer({
                ...editCustomer,
                billingaddress: {
                    ...editCustomer.billingaddress,
                    pincode: numericValue,


                },
            });
        }


        else {
            setEditCustomer({ ...editCustomer, [e.target.name]: e.target.value });
        }



    }
 
    const handleChange2 = (e) => {
        if (!!orderErrors[e.target.name]) {
            let error = Object.assign({}, orderErrors);
            delete error[e.target.name];
            setOrderErrors(error);

        }
        const numericValue = e.target.value.replace(/\D/g, '');
        if (e.target.name === "ponumber") {
            setSpecification({
                ...specification,
                [e.target.name]: numericValue,

            })
        } else if (e.target.name === "covercolor") {
            setSpecification({
                ...specification,
                covercolor: e.target.value,

            })

        }
        else if (e.target.name === "coverfold") {
            setSpecification({
                ...specification,
                coverfold: e.target.value,

            })
        }
        else if (e.target.name === "tiedown") {


            setSpecification({
                ...specification,
                tiedown: numericValue,
            });
        }
        else if (e.target.name === "tiedownlocation") {
            setSpecification({
                ...specification,
                tiedownlocation: e.target.value,

            })
        }
        else if (e.target.name === "tiedownlocationlength") {
            setSpecification({
                ...specification,
                tiedownlocationlength: numericValue,

            })
        }
        else if (e.target.name === "coverskritlength") {
            setSpecification({
                ...specification,
                coverskritlength: numericValue,

            })
        }
        else if (e.target.name === "skirtoption") {
            setSpecification({
                ...specification,
                skirtoption: e.target.value,

            })
        }
        else if (e.target.name === "foamdensity") {
            setSpecification({
                ...specification,
                foamdensity: e.target.value,

            })
        }
        else if (e.target.name === "addon") {
            setSpecification({
                ...specification,
                addon: e.target.value,

            })
        }
        else if (e.target.name === "upgrades") {
            setSpecification({
                ...specification,
                upgrades: e.target.value,

            })
        }
        else if (e.target.name === "dimensionA") {
            setSpecification({
                ...specification,
                dimensionA: numericValue,

            })

        }

        else if (e.target.name === "dimensionB") {
            setSpecification({
                ...specification,
                dimensionB: numericValue,

            })
        }
        else if (e.target.name === "radius") {
            setSpecification({
                ...specification,
                radius: numericValue,

            })
        }
        else if (e.target.name === "quantity") {

            if ((numericValue === "") || (parseInt(numericValue) === 0)) {
                setSpecification({
                    ...specification,
                    quantity: numericValue,
                    totalprice: parseInt(specification.productprice) * numericValue
                })

            } else {
                setSpecification({
                    ...specification,
                    quantity: numericValue,
                    totalprice: parseInt(specification.productprice) * numericValue

                })
            }
        } else if (e.target.name === "additionalinstructions") {
            setSpecification({
                ...specification,
                additionalinstructions: e.target.value,

            })
        }
    }

    const handleChange = (e) => {
        let type = e.target.value

        console.log("value---->", e.target.value)
        setCreateOrder({ ...createOrder, quantity: 0 })
        // console.log("eeee", e.target.name)
        if (!!orderErrors[e.target.name]) {
            let error = Object.assign({}, orderErrors);
            delete error[e.target.name];
            setOrderErrors(error);

        }
        if (e.target.name === "type") {
            if (id) {
                setCheckStatus(true);
            }
            setCreateOrder({
                ...createOrder,
                [e.target.name]: e.target.value,
            });
            getWholesaler(type)


        }

        setCreateOrder({
            name: "", // Reset the 'name' property
            emailid: "",
            phonenumber: "",
            deliveryaddress: {
                ...createOrder.deliveryaddress,
                address1: "",
                address2: "",
                state: "",
                pincode: ""
            },
            billingaddress: {
                ...createOrder.billingaddress,
                address1: "",
                address2: "",
                state: "",
                pincode: ""
            },
            type: e.target.value
        });
        // if (e.target.name === "wholesalername") {
        //     setCreateOrder({ ...createOrder, [e.target.name]: e.target.value });

        // }

        if (e.target.name === "emailid") {
            setCreateOrder({ ...createOrder, [e.target.name]: e.target.value });

        }
        if (e.target.name === "wholesalerphonenumber") {
            setCreateOrder({ ...createOrder, [e.target.name]: e.target.value });
        }
        if (e.target.name === "address1") {
            setCreateOrder({
                ...createOrder,
                billingaddress: {
                    ...createOrder.billingaddress,
                    address1: e.target.value,
                },
            });
        } else
            if (e.target.name === "address2") {
                setCreateOrder({
                    ...createOrder,
                    billingaddress: {
                        ...createOrder.billingaddress,
                        address2: e.target.value,
                    },
                });
            } else
                if (e.target.name === "state") {
                    setCreateOrder({
                        ...createOrder,
                        billingaddress: {
                            ...createOrder.billingaddress,
                            state: e.target.value,
                        },
                    });
                } else
                    if (e.target.name === "pincode") {
                        setCreateOrder({
                            ...createOrder,
                            billingaddress: {
                                ...createOrder.billingaddress,
                                pincode: e.target.value,
                            },
                        });
                    } else
                        if (e.target.name === "deliveryaddress1") {
                            setCreateOrder({
                                ...createOrder,
                                deliveryaddress: {
                                    ...createOrder.deliveryaddress,
                                    address1: e.target.value,
                                },
                            });
                        } else
                            if (e.target.name === "deliveryaddress2") {
                                setCreateOrder({
                                    ...createOrder,
                                    deliveryaddress: {
                                        ...createOrder.deliveryaddress,
                                        address2: e.target.value,
                                    },
                                });
                            } else
                                if (e.target.name === "deliverystate") {
                                    setCreateOrder({
                                        ...createOrder,
                                        deliveryaddress: {
                                            ...createOrder.deliveryaddress,
                                            state: e.target.value,
                                        },
                                    });
                                } else
                                    if (e.target.name === "deliverypincode") {
                                        setCreateOrder({
                                            ...createOrder,
                                            deliveryaddress: {
                                                ...createOrder.deliveryaddress,
                                                pincode: e.target.value,
                                            },
                                        });
                                    }
        // else if (e.target.name === "additionalinstructions") {
        //     setCreateOrder({
        //         ...createOrder,
        //         productspecification: {
        //             ...createOrder.productspecification,
        //             additionalinstructions: e.target.value,
        //         },
        //     });
        // }
    };
    //  const handleChangeCustomer = (e) => {
    //     if (e.target.name === "customername") {
    //         setCreateOrder({
    //             ...createOrder,
    //             customerinfo: [{
    //                 ...createOrder.customerinfo,
    //                 customername: e.target.value,
    //             }],
    //         });
    //     }
    //  }
    console.log("cc------>", orderErrors)
    console.log("cobj------>", customerObj)
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        if (id) {
            getOrder();
        }
        setSelectionOrder(localStorage.getItem("order"))
        setRoute("orders");
        setActiveMenuId(200001)
        GetLookUp();
        GetProduct();
        getWholesaler();
        getWorkshops();
        userActivity();
    }, []);
    useEffect(() => {
        if (selctionOrder)
            GetProduct();

    }, [selctionOrder]);

    const getWorkshops = () => {
        setIsLoading(true);
        axios
            .post(
                lambda + "/workshops?appname=" + appname + "&userid=" + localStorage.getItem("userId") + "&token=" +
                localStorage.getItem("token"),
            )
            .then((response) => {
                let result = response.data.result.data
                const filteredArray = result.filter(obj => obj.status === 'ACTIVE');
                setWorkshopData(filteredArray);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log("Error" + error);
            });
    };

    const getUsers = (data) => {
        let payload = {
            workshopid: data
        }
        const token = localStorage.getItem("token")
        axios({
            method: 'POST',
            url: lambda + '/users?appname=' + appname + "&token=" + token,
            data: payload
        })
            .then(function (response) {
                console.log("response", response);
                if (response.data.result === "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    //  console.log("updated@@@@",response.data.result.data);
                    let result = response.data.result.data;
                    const cuttingUsers = result.filter((item) => item.type === "CUTTING");
                    setCuttingUsers(cuttingUsers)
                    const sewingUsers = result.filter((item) => item.type === "SEWING");
                    setSewingUsers(sewingUsers)

                }
            });


    }

    const handleChangeWork = (e, index, key) => {
        if (!!orderErrors[key]) {
            let error = Object.assign({}, orderErrors);
            delete error[key];
            setOrderErrors(error);
        }
        // setWorkshopInfo((prevDataArray) => {
        //     const updatedArray = [...prevDataArray];
        //     const item = updatedArray[index] || {};
        //     updatedArray[index] = {
        //       ...item,
        //       [e.target.name]: e.target.value,
        //     };
        //     const filteredArray = updatedArray.map((item) => item.workshopname);
        //     setWorkshopArray(filteredArray)
        //     return updatedArray;
        //   });
        setCuttingInfo([]);
        setSewingInfo([]);
        const elements = document.getElementsByClassName('for-clear');
        for (let i = 0; i < elements.length; i++) {
            elements[i].value = '';
        }
        setWorkshopInfo((prevDataArray) => {
            const updatedArray = [...prevDataArray];
            const item = updatedArray[index] || {};
            if (e.target.name === "workshopname") {
                for (let key in workshopData) {
                    if (workshopData.hasOwnProperty(key) && workshopData[key].name === e.target.value) {

                        updatedArray[index] = {
                            ...item,
                            [e.target.name]: e.target.value,
                            workshopid: workshopData[key].workshopid,
                        };
                    }

                }
            } else {
                updatedArray[index] = {
                    ...item,
                    [e.target.name]: e.target.value,
                };
            }
            const filteredArray = updatedArray.map((item) => item.workshopid);
            getUsers(filteredArray);
            return updatedArray;
        });


    }

    const GetLookUp = async () => {
        GetTimeActivity();
        //  let payload = { type: [type] }

        setIsLoading(true)

        const token = localStorage.getItem("token");
        const linkUrl = `${lambda}/lookups?appname=${appname}${lookupsearch ? `&search=${lookupsearch}` : ""}&token=${token}&userid=${localStorage.getItem("userId")}&status=ACTIVE`;

        axios({
            method: 'POST',
            url: linkUrl,
            //data: payload,
        })
            .then(function (response) {
                if (response?.data?.result === "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    let result = response.data.result.data
                    setLookup(response.data.result.data)
                    const addonData = result.filter(item => item.type ==="upgrades");
                    const addonObj = addonData.map((eachItem) => { return { value: eachItem.name, label: eachItem.name }; })
                    setAddon(addonObj)
                    const colorData = result.filter(item => item.type ==="color");
                    const colorObj = colorData.map((eachItem) => { return { value: eachItem.name, label: eachItem.name }; })
                    setColor(colorObj)
                    setIsLoading(false);
                    // setLookupSearch("");

                }
            });
    }
    const GetProduct = async () => {
        GetTimeActivity();
        //  let payload = { type: [type] }

        setIsLoading(true)

        const token = localStorage.getItem("token");
        const linkUrl = `${lambda}/products?appname=${appname}&token=${token}&userid=${localStorage.getItem("userId")}&status=ACTIVE `;

        axios({
            method: 'POST',
            url: linkUrl,
            //data: payload,
        })
            .then(function (response) {
                if (response?.data?.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {

                    //     setProduct(response.data.result.data)
                    console.log("pp------>", response.data.result.data)
                    let result = response?.data?.result?.data
                    const filterArray = result.filter(option => option.producttype === selctionOrder);
                    console.log("filterArray", filterArray)
                    const productArray = prepareObject(filterArray)
                    setProduct(productArray)
                    setIsLoading(false);
                    // setLookupSearch("");

                }
            });
    }
    const prepareObject = (item) => {
        console.log("item", item)
        const resultArr = item.map((eachItem) => { return { value: eachItem.productname, label: eachItem.productname, image: eachItem.images[0].path, dimensionimage: eachItem.images[1]?.path, productprice: eachItem.price }; })
        return resultArr
    }
    const getOrder = (e) => {
        GetTimeActivity()
        setIsLoading(true)
        axios.get(lambda + '/order?appname=' + appname + '&userId=' + localStorage.getItem('userId') + '&token=' + localStorage.getItem('token') + '&orderid=' + id)
            .then(function (response) {
                console.log("response---->", response.data.result[0]);
                if (response?.data?.result === "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                }
                else {
                    if (response.data.result.length > 0) {
                        let result = response?.data?.result[0]
                        setCreateOrder(result);
                        setProductSpecifiaction(result.productspecification);
                        if (result?.workshopinfo && result?.workshopinfo.length > 0) {
                            setWorkshopInfo(result?.workshopinfo);
                        }

                        setIsLoading(false)

                    } else {
                        setIsLoading(false)
                        setInvalidContent(true)
                    }
                }
                // getPermissions(response.data && response.data.result && response.data.result[0] && response.data.result[0].type)
            });
    }
    const getWholesaler = (type) => {
        GetTimeActivity()
        setIsLoading(true)

        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/customers?appname=' + appname + "&token=" + token + "&status=ACTIVE" + "&type=" + type,
        })
            .then(function (response) {
                console.log("response", response);
                if (response?.data?.result ===
                    "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {

                    setUser(response.data.result);
                    setData(response.data.result.data);
                    console.log("result---->", response.data.result.data)
                    setIsLoading(false);
                    setUserSearch("");
                    setSearchedFlag(false);
                    const arrOfObj = response.data.result.data.map((item) => {
                        return { value: item.name, label: item.name, phonenumber: item.phonenumber, emailid: item.emailid, customeraddress: item.customeraddress, billingaddress: item.billingaddress };
                    });
                    setData(arrOfObj);
                    const arrOfObj1 = response.data.result.data.map((item) => {
                        return { value: item.emailid, label: item.emailid, phonenumber: item.phonenumber, name: item.name, customeraddress: item.customeraddress, billingaddress: item.billingaddress };
                    });
                    setData1(arrOfObj1)
                }
            });
    }
    const handleSetData = (selected, key) => {
        if (!!orderErrors[selected]) {
            let error = Object.assign({}, orderErrors);
            delete error[selected];
            setOrderErrors(error);
        }
        setOrderErrors("")

        console.log("selected", selected)
        // const selectedItem = data.find((item) => item.name === selectedName);
        if(key === "name"){
        setCreateOrder({
            ...createOrder,

            name: selected.value,
            emailid: selected && selected.emailid,
            phonenumber: selected && selected.phonenumber,
            deliveryaddress: {
                ...createOrder.deliveryaddress,
                address1: selected && selected.customeraddress.address1,
                address2: selected && selected.customeraddress.address2,
                state: selected && selected.customeraddress.state,
                pincode: selected && selected.customeraddress.pincode
            },
            billingaddress: {
                ...createOrder.billingaddress,
                address1: selected && selected.billingaddress.address1,
                address2: selected && selected.billingaddress.address2,
                state: selected && selected.billingaddress.state,
                pincode: selected && selected.billingaddress.pincode
            }
        });
    }else{
        setCreateOrder({
            ...createOrder,

            name: selected.name,
            emailid: selected && selected.value,
            phonenumber: selected && selected.phonenumber,
            deliveryaddress: {
                ...createOrder.deliveryaddress,
                address1: selected && selected.customeraddress.address1,
                address2: selected && selected.customeraddress.address2,
                state: selected && selected.customeraddress.state,
                pincode: selected && selected.customeraddress.pincode
            },
            billingaddress: {
                ...createOrder.billingaddress,
                address1: selected && selected.billingaddress.address1,
                address2: selected && selected.billingaddress.address2,
                state: selected && selected.billingaddress.state,
                pincode: selected && selected.billingaddress.pincode
            }
        });

    }
    }
    const handleSetColor = (selected, key) => {
        if (!!orderErrors[selected]) {
            let error = Object.assign({}, orderErrors);
            delete error[selected];
            setOrderErrors(error);
        }
        setOrderErrors("")

        console.log("selected", selected)
        // const selectedItem = data.find((item) => item.name === selectedName);
    
        setSpecification({
            ...specification,
            covercolor: selected.value,

        })
    
    }
    const createcustomer = async () => {
        setIsLoading(true)
        GetTimeActivity()
        let payload = {}
        payload = {
            "emailid": editCustomer.emailid?.trim(),
            //  "address": editCustomer.customeraddress.address1,
            "name": editCustomer.name?.trim(),
            "idc": editCustomer.idc,
            "phonenumber": editCustomer.phonenumber,
            "customeraddress": {
                "address1": editCustomer?.customeraddress?.address1,
                "address2": editCustomer.customeraddress?.address2,
                "state": editCustomer.customeraddress?.state,
                "pincode": editCustomer.customeraddress?.pincode
            },
            "billingaddress": {
                "address1": editCustomer?.billingaddress?.address1,
                "address2": editCustomer.billingaddress?.address2,
                "state": editCustomer.billingaddress?.state,
                "pincode": editCustomer.billingaddress?.pincode
            },
            "check": editCustomer.check,
            "status": editCustomer.status,
            "type": editCustomer.type
        }
        const token = localStorage.getItem("token");
        const userid = localStorage.getItem("userId");
        axios({
            method: 'PUT',
            url: lambda + "/customers?appname=" + appname + "&token=" + token + "&userid=" + userid,
            data: payload,
        })
            .then(function (response) {
                if (response) {
                    console.log("response.result", response)
                    if (response.data.result === "customer already exists") {
                        setExistMsg(true)
                        setIsLoading(false)
                    }
                    else if (response?.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                        setIsLoading(false)
                    }
                    else {
                        setIsLoading(false)
                        setSuccessOrderV1(true);
                    }
                }

            });

    };
    const GetCountries = async () => {
        try {
            console.log(tmdbApi);
            const response = await tmdbApi.getLookUp({
                "type": ["state"],
                "status": "ACTIVE",
            });

            // console.log(response.result);
            if (response?.result?.data === "Invalid token or Expired") {
                setShowSessionPopupup(true)
            } else {
                setCountries(response.result.data);
            }
        } catch {
            console.log("error");
        }
    };
    const handleCheckBox = (e) => {
        setCheckBox(e.target.checked);
        if (e.target.checked === true) {

            delete customerErrors.billingaddress1;
            delete customerErrors.billingaddress2;
            delete customerErrors.billingstate;
            delete customerErrors.billingpincode;
            setEditCustomer({
                ...editCustomer,
                billingaddress: {
                    ...editCustomer.billingaddress,
                    address1: editCustomer.customeraddress.address1,
                    address2: editCustomer.customeraddress.address2,
                    state: editCustomer.customeraddress.state,
                    pincode: editCustomer.customeraddress.pincode,
                },
                check: true

            });
        } else {

            setEditCustomer({
                ...editCustomer,
                billingaddress: {
                    ...editCustomer.billingaddress,
                    address1: "",
                    address2: "",
                    state: "",
                    pincode: "",
                },
                check: false

            });
        }
    };
    // const handleCheckBox = (e) => {
    //     setCheckBox(e.target.checked);
    //     if (e.target.checked === true) {
    //         delete orderErrors.billingaddress1;
    //         delete orderErrors.billingaddress2;
    //         delete orderErrors.billingstate;
    //         delete orderErrors.billingpincode;
    //         setCreateOrder({
    //             ...createOrder,
    //             billingaddress: {
    //                 ...createOrder.billingaddress,
    //                 address1: createOrder.deliveryaddress.address1,
    //                 address2: createOrder.deliveryaddress.address2,
    //                 state: createOrder.deliveryaddress.state,
    //                 pincode: createOrder.deliveryaddress.pincode,
    //             },

    //         });
    //     } else {
    //         setCreateOrder({
    //             ...createOrder,
    //             billingaddress: {
    //                 ...createOrder.billingaddress,
    //                 address1: "",
    //                 address2: "",
    //                 state: "",
    //                 pincode: "",
    //             },

    //         });
    //     }

    // };
    const handleAddCustomer = (e) => {
        GetTimeActivity()
        const isValid = validate();
        if (isValid) {
            createcustomer();
        }
    }
    const PrintContent = React.forwardRef((props, ref) => {
        useEffect(() => {
            // Your jQuery code here
            $(ref.current).find("#qrImg").attr("src", 'https://api.qrserver.com/v1/create-qr-code/?data=' + "https://develop.spacovers.com/item/" + id);
        }, [ref]);
        return (
            <div ref={ref} className="print-content access-denied order_specification order_spe_print" style={{ padding: "30px" }}>
                <div className="modal-body enquiry-form">
                    <img src="https://spacovers.imgix.net/spacoversdev/admin/theme/images/logo-dark.png" />
                    <div className="details_block">
                        <div className="block_left">
                            <div className="input-field">
                                <label class="form-label form-label">delaler</label>
                                <p>{createOrder?.wholesalername}</p>
                            </div>
                            <div className="input-field">
                                <label class="form-label form-label">Size</label>
                                <p>{createOrder?.productspecification?.dimensionA + "’" + " " + createOrder?.productspecification?.dimensionA + "”"}</p>
                            </div>

                            <div className="input-field">
                                <label class="form-label form-label">Color</label>
                                <p>{createOrder?.productspecification?.covercolor}</p>
                            </div>
                        </div>
                        <div className="block_right">
                            <div className="input-field">
                                <label class="form-label form-label">Radius</label>
                                <p>{createOrder?.productspecification?.radius}</p>
                            </div>
                            <div className="input-field">
                                <label class="form-label form-label">Quantity</label>
                                <p>{createOrder?.productspecification?.quantity}</p>
                            </div>
                        </div>
                    </div>
                    <div className="details_block tie_downs">
                        <div className="block_left">
                            <div className="input-field">
                                <label class="form-label form-label">Plastic<br /># of tie downs</label>
                                <p>2</p>
                            </div>
                            <div className="input-field">
                                <label class="form-label form-label">Connector</label>
                                <p>2</p>
                            </div>
                            <div className="input-field">
                                <label class="form-label form-label">Velcro</label>
                                <p>2</p>
                            </div>
                        </div>
                        <div className="block_right">
                            <div className="input-field">
                                <h6>{createOrder?.productspecification?.tiedownlocation}</h6>
                            </div>
                            <div className="input-field">
                                <label class="form-label form-label">Cut Flap</label>
                                <p>12</p>
                            </div>
                            <div className="input-field">
                                <label class="form-label form-label">Flaps</label>
                                <p>12</p>
                            </div>
                        </div>
                    </div>
                    <div className="details_block connected">
                        <div className="block_left">
                            <div className="input-field">
                                <h6>{createOrder?.productspecification?.skirtoption}</h6>
                            </div>
                            <div className="input-field">
                                <label class="form-label form-label">Tie Downs</label>
                                <p>{createOrder?.productspecification?.tiedown}</p>
                            </div>
                        </div>
                        <div className="block_right">
                            <div className="input-field">
                                <h6>Connected / Seperate</h6>
                            </div>
                            <div className="input-field">
                                <label class="form-label form-label">Cut T/D</label>
                                <p>{parseInt(createOrder?.productspecification?.tiedown) * 2 + 1}</p>
                            </div>
                        </div>
                    </div>
                    <div className="details_block foam_density">
                        <h6>Foam Density</h6>
                        <div className="dbl">
                            <div className="input-field">
                                <label class="form-label form-label">Dbl</label>
                                <p>2#</p>
                            </div>
                            <div className="input-field">
                                <label class="form-label form-label">Plastic</label>
                                <p>5”- 2.5”</p>
                            </div>
                            <div className="input-field">
                                <label class="form-label form-label">Webbing</label>
                                <p>4-5-4</p>
                            </div>
                            <div className="input-field">
                                <label class="form-label form-label">6”- 4”</label>
                                <p>12</p>
                            </div>
                        </div>
                    </div>
                    <div className="qr_block">
                        <img src="https://spacovers.imgix.net/spacoversdev/admin/theme/images/qr-code.png" className="qrImg" id="qrImg" />
                    </div>
                    <div className="details_block customer_location">
                        <div className="input-field">
                            <label class="form-label form-label">Customer / Location</label>
                            <p>{createOrder && createOrder?.deliveryaddress && (createOrder?.deliveryaddress?.address1 + "," + createOrder.deliveryaddress.address2 + "," + createOrder.deliveryaddress.state + "," + createOrder.deliveryaddress.pincode)}</p>
                        </div>
                        <div className="input-field">
                            <label class="form-label form-label">Date</label>
                            <p>{moment(createOrder?.created).format('MMM-DD-YYYY')}</p>
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
    const handleResetApproveTab = () => {
        workshopinfo[0].workshopname = ""
        workshopinfo[0].workshopid = ""
        setCuttingInfo([]);
        setSewingInfo([]);
        setCuttingUsers([])
        setSewingUsers([])
        setCounter(1);
        setCuttingCounter(1);
        setSewingCounter(1);
        const elements = document.getElementsByClassName('for-clear');
        for (let i = 0; i < elements.length; i++) {
            elements[i].value = '';
        }
        setOrderErrors({})

    }

    const handleIncrement = (e) => {
        console.log(createOrder?.productspecification?.quantity, price)
        const newCreateOrder = { ...createOrder };

        const newSpecifications = { ...newCreateOrder.productspecification };
        newSpecifications.quantity = parseInt(createOrder?.productspecification?.quantity) + 1;


        newCreateOrder.totalprice = (parseInt(createOrder?.productspecification?.quantity) + 1) * price;


        newCreateOrder.productspecification = newSpecifications;
        setCreateOrder(newCreateOrder);


    }
    const handleMember = () => {
        setAddPopup(true)
        GetCountries();
    }
    const handleDecrement = (e) => {
        setCreateOrder({
            ...createOrder,
            productspecification: {
                ...createOrder.productspecification,
                quantity: parseInt(createOrder?.productspecification?.quantity) - 1,
            },
            totalprice: (parseInt(createOrder?.productspecification?.quantity) - 1) * price
        });
    }
    const generateDynamicContent = () => {
        const dynamicContent = [];
        for (let i = 1; i <= counter; i++) {
            dynamicContent.push(
                <div className="row mt-2" key={i}>

                    <div className="col-md-4">
                        {i === 1 && <label for="username" className="form-label">Workshop</label>}
                        {createOrder.status === "NEW" ?
                            <select name="workshopname" onChange={(e) => handleChangeWork(e, i - 1, "workshop")} value={workshopinfo && workshopinfo[i - 1]?.workshopname} className="form-select col-md-6 clear">
                                <option value=""> Select Workshop</option>
                                {workshopData && workshopData.length > 0 && workshopData.map((task, i) => {
                                    return (
                                        <><option key={i} value={task.name}>{task.name}</option></>
                                    )
                                }
                                )}

                            </select> : <select name="workshopname" onChange={(e) => handleChangeWork(e, i - 1, "workshop")} value={workshopinfo && workshopinfo[i - 1]?.workshopname} className="form-select col-md-6 clear" disabled>
                                <option value=""> Select Workshop</option>
                                {workshopData && workshopData.length > 0 && workshopData.map((task, i) => {
                                    return (
                                        <><option key={i} value={task.name}>{task.name}</option></>
                                    )
                                }
                                )}

                            </select>}

                    </div>
                    {/* <div class="col-md-2">
                         {i === 1 && <label for="quantity" class="form-label">Quantity</label>}
                         <input id="quantity" type="tel" name="workshopQuantity" onChange={(e) => handleChangeWork(e, i - 1)} value={workshopinfo && workshopinfo[i - 1]?.workshopQuantity} class="form-select col-md-3 for-clear" min="1" max="20"></input>
                     </div> */}

                </div>
            );
        }
        return dynamicContent;
    };
    const manageTab = (tab) => {
        let cls = "";
        if (tabActive[`tab${tab - 1}`]) {
            cls = "done";
        }
        return `${cls} ${currentActive === tab ? 'current' : 'disabled'}`;
    }


    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            display: 'flex',
            alignItems: 'center',
        }),
        singleValue: (provided, state) => ({
            ...provided,
            display: 'flex',
            alignItems: 'center',
        }),
    };




    const handleAddProduct = () => {
        const isValid = formvalidationReview()
        const newId = productSpecification.length + 1;
        const newObject = {
            id: newId,
            productname: specification.productname,
            productimage: specification.productimage,
            dimensionimage: specification.dimensionimage,
            productprice: specification.productprice,
            covercolor: specification.covercolor,
            ponumber: specification.ponumber,
            coverfold: specification.coverfold,
            tiedown: specification.tiedown,
            tiedownlocation: specification.tiedownlocation,
            tiedownlocationlength: specification.tiedownlocationlength,
            coverskritlength: specification.coverskritlength,
            skirtoption: specification.skirtoption,
            foamdensity: specification.foamdensity,
            addon: specification.addon,
            upgrades: specification.upgrades,
            dimensionA: specification.dimensionA,
            dimensionB: specification.dimensionB,
            radius: specification.radius,
            quantity: specification.quantity,
            totalprice: specification.totalprice,
            additionalinstructions: specification.additionalinstructions,

        };
        if (isValid) {
            setProductSpecifiaction(prevState => [...prevState, newObject]);
            setResetKey((prevKey) => (prevKey + 1) % 2);
            setSpecification({ ...specification, productname: "", productimage: "", dimension: "", ponumber: "", covercolor: "", coverfold: "", tiedown: "", tiedownlocation: "", coverskritlength: "", skirtoption: "", foamdensity: "", upgrades: [], dimensionA: "", dimensionB: "", quantity: "", radius: "", tiedownlocationlength: "", additionalinstructions: "" });
        }



    };

    console.log("product", productSpecification);
    console.log("order", createOrder);
    const CustomOption = ({ innerProps, label, data }) => (

        <div {...innerProps}>
            <img src={image + data.image} alt="Image" style={{ marginRight: '8px', width: '20px', height: '20px' }} />
            {label}
        </div>
    );

    const CustomSingleValue = ({ innerProps, label, data }) => (
        <div {...innerProps}>
            {data.image &&
                <img src={image + data.image} alt="Image" style={{ marginRight: '8px', width: '20px', height: '20px' }} />}
            {data.label}
        </div>
    );
    const returnArray = (arr) => {
        let arr2 = []
        arr.map((eachItem) => {
            arr2.push(eachItem.value)
        })
        // console.log(arr2)
        return arr2
    }
    const handleChangeMultiSelect1 = (selected, key) => {
        if (!!orderErrors[key]) {
            let error = Object.assign({}, orderErrors);
            delete error[key];
            setOrderErrors(error);

        }
        let selectedArray = returnArray(selected)
        setSpecification({
            ...specification,
            [key]: selectedArray,
        });
    }
    const handleChangeMultiSelect = (selected, key, e) => {
        if (!!orderErrors[key]) {
            let error = Object.assign({}, orderErrors);
            delete error[key];
            setOrderErrors(error);

        }
        console.log("selected", selected)

        setSpecification({
            ...specification,
            [key]: selected ? selected.value : null,
            productimage: selected ? selected.image : null,
            dimensionimage: selected ? selected.dimensionimage : null,
            productprice: selected ? selected.productprice : null,
        });
    }
    const viewproduct = productSpecification[viewid];

    const singleOption = { value: createOrder && createOrder.name, label: createOrder && createOrder.name };
    const singleOption1 = { value: createOrder && createOrder.emailid, label: createOrder && createOrder.emailid };
    const coverColor = { value: specification && specification.covercolor, label: specification && specification.covercolor };
    const productValue = { value: specification && specification.productname, label: specification && specification.productname, image: specification.productimage };
    console.log("places", places)
    console.log("specification", specification)
    return (
        <>
            <div id="layout-wrapper">
                <Header />
                <Sidebar />
                {isLoading ?
                    <Loader />
                    :
                    <div className="main-content user-management content-management export items">

                        <div className="page-content create_orders user-management">
                            <div className="container-fluid">
                                <div className="row mb-2">
                                    <div className="col-lg-12">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <h4 className="mb-0 card-title">{id === undefined ? "Create Orders" : "Edit Orders"}</h4>
                                            </div>
                                            <div>
                                                <button href="javascript:void(0)" className="btn btn-primary" onClick={handleBack}>back</button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!--end col--> */}
                                </div>
                                {/* <!--end row--> */}

                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="card">
                                            <div className="card-body">

                                                <div id="basic-example" role="application" className="wizard clearfi create-user">
                                                    <div className="steps clearfix">
                                                        <ul role="tablist">
                                                            <li role="tab" className={manageTab(1)} aria-disabled={currentActive !== 1} aria-selected={currentActive === 1}>
                                                                <a id="basic-example-t-0" aria-controls="basic-example-p-0" onClick={() => handleClick(1)}>
                                                                    <span className="current-info audible">current step: </span>
                                                                    <span className="number " >1</span>Member Details
                                                                </a>
                                                            </li>
                                                            <li role="tab" className={manageTab(2)} aria-disabled={currentActive !== 2}>
                                                                <a id="basic-example-t-1" aria-controls="basic-example-p-1" onClick={() => handleClick(2)}>
                                                                    <span className="number">2</span>Product Specification
                                                                </a>
                                                            </li>

                                                            {/* <li role="tab" className={manageTab(3)} aria-disabled={currentActive !== 3}>
                                                                 <a id="basic-example-t-2" aria-controls="basic-example-p-2" onClick={() => handleClick(3)}>
                                                                     <span className="number">3</span>Product Specifications
                                                                 </a>
                                                             </li> */}
                                                            {/* <li role="tab" className={manageTab(4)} aria-disabled={currentActive !== 4}>
                                                                 <a id="basic-example-t-3" aria-controls="basic-example-p-3" onClick={() => handleClick(4)}>
                                                                     <span className="number">4</span>Review and Confirm
                                                                 </a>
                                                             </li> */}
                                                            {id === undefined ? null : (userData.type === "ADMIN" || userData.type === "SUPERVISOR") && (
                                                                <li role="tab" className={manageTab(3)} aria-disabled={currentActive !== 3}>
                                                                    <a id="basic-example-t-3" aria-controls="basic-example-p-3" onClick={() => handleClick(3)}>
                                                                        <span className="number">3</span>Approve
                                                                    </a>
                                                                </li>
                                                            )}


                                                        </ul>
                                                    </div>
                                                    <div className="content clearfix create-user-block">

                                                        <h3 id="basic-example-h-0" tabindex="-1" className={`title ${currentActive === 1 ? 'current' : ''}`}>Customer Details</h3>
                                                        <section id="basic-example-p-0" role="tabpanel" aria-labelledby="basic-example-h-0" className="body current" aria-hidden="false" style={{ display: currentActive === 1 ? 'block' : 'none' }}>

                                                            <div className="add_member_btn">
                                                                <button className="btn btn-primary add_member_btn" onClick={(e) => handleMember(e)} disabled={id !== undefined}>
                                                                    <span class="material-icons-outlined">add</span> Add Member
                                                                </button>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label">Select Type</label>

                                                                        <select name="type" value={createOrder.type} className="colorselect capitalize form-control form-select" onChange={(e) => handleChange(e)} disabled={id !== undefined}
                                                                        >
                                                                            <option value="">Select type</option>
                                                                            <option value="Wholesaler">Wholesaler</option>
                                                                            <option value="Retailer">Retailer</option>

                                                                        </select>
                                                                        <span className="errormsg" style={{
                                                                            fontWeight: 'bold',
                                                                            color: 'red',
                                                                        }}>{orderErrors.type}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="mb-3 input-field">

                                                                        <label className="form-label form-label">{createOrder.type} Name</label>
                                                                        {/* <select name="wholesalername" value={createOrder.wholesalername} className="colorselect capitalize form-control form-select" onChange={(e) => {
                                                                          const selectedName = e.target.value;
                                                                          handleSetData(selectedName);
                                                                      }}>
                                                                          <option value="">Select Wholesaler</option>
                                                                          {data.map((item) => {
                                                                              return (
                                                                                  <option value={item.name}>{item.name}</option>
                                                                              )
                                                                          })
  
                                                                          }
                                                                      </select> */}
                                                                        <Select isMulti={false}
                                                                            classNamePrefix="select wholesaler"
                                                                            placeholder={createOrder.hasOwnProperty("type") ? "Select " + createOrder?.type : "Select"}
                                                                            name="name"
                                                                            onChange={(e) => handleSetData(e, "name")}
                                                                            options={data}
                                                                            value={singleOption}
                                                                            isDisabled={id !== undefined || createOrder.type === ""}
                                                                        />
                                                                        <span className="errormsg" style={{
                                                                            fontWeight: 'bold',
                                                                            color: 'red',
                                                                        }}>{orderErrors.wholesalername}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6"></div>
                                                                <div className="col-md-6"><p className="or-divider"><span className="or">or</span></p></div>
                                                                <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label"> Phone Number</label>
                                                                        <input id="email" name="phonenumber" type="tel" placeholder="Whole Saler Phone Number" className="form-control form-control" aria-invalid="false" value={createOrder.phonenumber} maxLength="10" onChange={(e) => handleChange(e)} disabled={id === undefined} />
                                                                    </div>
                                                                </div>
                                                              
                                                                <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label">Email Id</label>
                                                                        {/* <input id="email" name="emailid" type="emailid" placeholder="emailid" className="form-control form-control" aria-invalid="false" value={createOrder.emailid} onChange={(e) => handleChange(e)} disabled={id === undefined} /> */}
                                                                        <Select isMulti={false}
                                                                            classNamePrefix="email od"
                                                                            placeholder={createOrder.hasOwnProperty("type") ? "Select " + createOrder?.type : "Select"}
                                                                            name="email"
                                                                            onChange={(e) => handleSetData(e, "email")}
                                                                            options={data1}
                                                                            value={singleOption1}
                                                                            isDisabled={id !== undefined || createOrder.type === ""}
                                                                        />
                                                                
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex align-items-center mt-3 mb-2">
                                                                <h5 className="font-size-14">Billing Address</h5>
                                                                {/* <div className="d-flex justify-content-center align-items-center ms-4"> <label className="switch"><input type="checkbox"
                                                                  id="flexCheckDefault"
                                                                  name="checkboxinput"
                                                                  onClick={(e) => handleCheckBox(e)} /><span className="slider round" disabled ></span></label>
                                                                  <p>Same as Delivery Address</p>
                                                              </div> */}
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label">Address 1</label>
                                                                        <input id="email" name="address1" type="text" placeholder="Address 1" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.billingaddress && createOrder.billingaddress.address1} onChange={(e) => handleChange(e)} disabled={id === undefined} />

                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label">Address 2</label>
                                                                        <input id="email" name="address2" type="text" placeholder="Address 2" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.billingaddress && createOrder.billingaddress.address2} onChange={(e) => handleChange(e)} disabled={id === undefined} />

                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label">State</label>
                                                                        <input id="email" name="state" type="text" placeholder="Address 2" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.billingaddress && createOrder.billingaddress.state} onChange={(e) => handleChange(e)} disabled={id === undefined} />

                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label">PIN Code</label>
                                                                        <input id="email" name="pincode" type="text" placeholder="PIN Code" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.billingaddress && createOrder.billingaddress.pincode} onChange={(e) => handleChange(e)} disabled={id === undefined} />

                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <h5 className="font-size-14">Delivery Address</h5>
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label">Address 1</label>
                                                                        <input id="email" name="deliveryaddress1" type="text" placeholder="Address 1" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.deliveryaddress && createOrder.deliveryaddress.address1} onChange={(e) => handleChange(e)} disabled={id === undefined} />

                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label">Address 2</label>
                                                                        <input id="email" name="deliveryaddress2" type="text" placeholder="Address 2" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.deliveryaddress && createOrder.deliveryaddress.address2} onChange={(e) => handleChange(e)} disabled={id === undefined} />

                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label">State</label>
                                                                        <input id="email" name="state" type="text" placeholder="Address 2" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.deliveryaddress && createOrder.deliveryaddress.state} onChange={(e) => handleChange(e)} disabled={id === undefined} />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label">PIN Code</label>
                                                                        <input id="email" name="deliverypincode" type="text" placeholder="PIN Code" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.deliveryaddress && createOrder.deliveryaddress.pincode} onChange={(e) => handleChange(e)} disabled={id === undefined} />

                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="row">
                                                                <div className="col-md-12 d-flex">
                                                                    <button className="btn btn-primary" onClick={(e) => handleCreateOrder(e)}>next</button>
                                                                    {/* {msg ? <span className="errormsg" style={{
                                                                             fontWeight: 'bold',
                                                                             color: 'green',
                                                                         }}>{msg}</span> : ""
                                                                         } */}
                                                                </div>
                                                            </div>

                                                        </section>


                                                        <h3 id="basic-example-h-1" tabindex="-1" className={`title ${currentActive === 2 ? 'current' : ''}`}>Select Shape</h3>
                                                        <section id="basic-example-p-1" role="tabpanel" aria-labelledby="basic-example-h-1" className="body order-create" aria-hidden="true" style={{ display: currentActive === 2 ? 'block' : 'none' }}>
                                                            <form>
                                                                <h5 className="font-size-14 mt-0">{createOrder.type} Details</h5>
                                                                <div className="row order_section" >
                                                                    <div className="col-md-3">
                                                                        <div className="mb-3 input-field d-flex align-items-center">
                                                                            <label className="form-label form-label">Wholesaler</label>
                                                                            <p>{createOrder.name}</p>

                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-9">
                                                                        <div className="mb-3 input-field d-flex align-items-center">
                                                                            <label className="form-label form-label">Delivery Address</label>
                                                                            <p>{createOrder && createOrder?.deliveryaddress && (createOrder?.deliveryaddress?.address1 + "," + " " + createOrder.deliveryaddress.address2 + "," + " " + createOrder.deliveryaddress.state + "," + " " + createOrder.deliveryaddress.pincode)}</p>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <h5 className="font-size-14 mt-2">Product Specification</h5>
                                                                <div className="row order_section order_section1" >
                                                                    <div className="col-md-3">
                                                                        <div className="mb-3 input-field">
                                                                            <label className="form-label form-label">Select Shape<span className="required">*</span></label>
                                                                            <Select
                                                                                key={resetKey}
                                                                                options={product}
                                                                                name="productname"
                                                                                styles={customStyles}
                                                                                isSearchable={false}
                                                                                components={{
                                                                                    Option: CustomOption,
                                                                                    SingleValue: CustomSingleValue,
                                                                                }}

                                                                                onChange={(e) => handleChangeMultiSelect(e, "productname")}
                                                                                value={productValue}
                                                                            />
                                                                            <span className="errormsg" style={{
                                                                                fontWeight: 'bold',
                                                                                color: 'red',
                                                                            }}>{orderErrors.productname}</span>

                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <div className="mb-3 input-field">
                                                                            <label className="form-label form-label">p.o number</label>
                                                                            <input id="email" name="ponumber" type="text" placeholder="Enter Value" class="form-control" aria-invalid="false" onChange={(e) => handleChange2(e)} value={specification.ponumber} />
                                                                            {/* <span className="errormsg" style={{
                                                                                fontWeight: 'bold',
                                                                                color: 'red',
                                                                            }}>{orderErrors.ponumber}</span> */}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <div className="mb-3 input-field">
                                                                            <label className="form-label form-label">Cover  Color</label>
                                                                            {/* <select class="form-select" name="covercolor" onChange={(e) => handleChange2(e)} value={specification.covercolor}>
                                                                                <option value="">Select</option>
                                                                                {lookup
                                                                                    ?.filter?.((lookupData) => lookupData.type === "color")
                                                                                    .map?.((lookupData) => (
                                                                                        <option key={lookupData.id} value={lookupData.name}>
                                                                                            {lookupData.name}
                                                                                        </option>
                                                                                    ))}
                                                                            </select> */}
                                                                            <Select isMulti={false}
                                                                            classNamePrefix="select cover color"
                                                                            placeholder="select cover color"
                                                                            name="name"
                                                                            onChange={(e) => handleSetColor(e, "covercolor")}
                                                                            options={color}
                                                                            value={coverColor}
                                                                        />
                                                                            <span className="errormsg" style={{
                                                                                fontWeight: 'bold',
                                                                                color: 'red',
                                                                            }}>{orderErrors.covercolor}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <div className="mb-3 input-field">
                                                                            <label className="form-label form-label">Cover  Fold</label>
                                                                            <select class="form-select" name="coverfold" onChange={(e) => handleChange2(e)} value={specification.coverfold}>
                                                                                <option value="">Select</option>
                                                                                {lookup
                                                                                    ?.filter?.((lookupData) => lookupData.type === "fold")
                                                                                    .map?.((lookupData) => (
                                                                                        <option key={lookupData.id} value={lookupData.name}>
                                                                                            {lookupData.name}
                                                                                        </option>
                                                                                    ))}
                                                                            </select>
                                                                            <span className="errormsg" style={{
                                                                                fontWeight: 'bold',
                                                                                color: 'red',
                                                                            }}>{orderErrors.coverfold}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <div className="mb-3 input-field">
                                                                            <label className="form-label form-label">Tie Downs</label>
                                                                            <input id="email" name="tiedown" type="text" placeholder="Enter Value" class="form-control" aria-invalid="false" onChange={(e) => handleChange2(e)} value={specification.tiedown} />
                                                                            <span className="errormsg" style={{
                                                                                fontWeight: 'bold',
                                                                                color: 'red',
                                                                            }}>{orderErrors.tiedown}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <div className="mb-3 input-field">
                                                                            <label className="form-label form-label">Tie Down Locations</label>
                                                                            <select class="form-select" name="tiedownlocation" value={specification.tiedownlocation} onChange={(e) => handleChange2(e)} >
                                                                                <option value="">Select</option>
                                                                                {lookup
                                                                                    ?.filter?.((lookupData) => lookupData.type === "tiedownlocation")
                                                                                    .map?.((lookupData) => (
                                                                                        <option key={lookupData.id} value={lookupData.name}>
                                                                                            {lookupData.name}
                                                                                        </option>
                                                                                    ))}
                                                                            </select>
                                                                            <span className="errormsg" style={{
                                                                                fontWeight: 'bold',
                                                                                color: 'red',
                                                                            }}>{orderErrors.tiedownlocation}</span>
                                                                        </div>

                                                                    </div>
                                                                    {specification.tiedownlocation === "Custom" && (
                                                                        <div className="col-md-3">
                                                                            <div className="mb-3 input-field">
                                                                                <label className="form-label form-label">
                                                                                    TIE DOWN LOCATION LENGTH
                                                                                </label>
                                                                                <input
                                                                                    id="email"
                                                                                    name="tiedownlocationlength"
                                                                                    type="text"
                                                                                    placeholder="Enter Value"
                                                                                    className="form-control"
                                                                                    aria-invalid="false"
                                                                                    onChange={(e) => handleChange2(e)}
                                                                                    value={specification.tiedownlocationlength}
                                                                                />
                                                                                <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>
                                                                                    {orderErrors.tiedownlocationlength}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    <div className="col-md-3">
                                                                        <div className="mb-3 input-field">
                                                                            <label className="form-label form-label">COVER SKIRT LENGTH</label>
                                                                            <input id="email" name="coverskritlength" type="text" placeholder="Enter Value" class="form-control" aria-invalid="false" onChange={(e) => handleChange2(e)} value={specification.coverskritlength} />
                                                                            <span className="errormsg" style={{
                                                                                fontWeight: 'bold',
                                                                                color: 'red',
                                                                            }}>{orderErrors.coverskritlength}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <div className="mb-3 input-field">
                                                                            <label className="form-label form-label">SKIRT OPTIONS</label>
                                                                            <select class="form-select" name="skirtoption" onChange={(e) => handleChange2(e)} value={specification.skirtoption}>
                                                                                <option value="">Select</option>
                                                                                {lookup
                                                                                    ?.filter?.((lookupData) => lookupData.type === "skritoptions")
                                                                                    .map?.((lookupData) => (
                                                                                        <option key={lookupData.id} value={lookupData.name}>
                                                                                            {lookupData.name}
                                                                                        </option>
                                                                                    ))}
                                                                            </select>
                                                                            <span className="errormsg" style={{
                                                                                fontWeight: 'bold',
                                                                                color: 'red',
                                                                            }}>{orderErrors.skirtoption}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <div className="mb-3 input-field">
                                                                            <label className="form-label form-label">FOAM DENSITY</label>
                                                                            <select class="form-select" name="foamdensity" onChange={(e) => handleChange2(e)} value={specification.foamdensity}>
                                                                                <option value="">Select</option>
                                                                                {lookup
                                                                                    ?.filter?.((lookupData) => lookupData.type === "foamdensity")
                                                                                    .map?.((lookupData) => (
                                                                                        <option key={lookupData.id} value={lookupData.name}>
                                                                                            {lookupData.name}
                                                                                        </option>
                                                                                    ))}
                                                                            </select>
                                                                            <span className="errormsg" style={{
                                                                                fontWeight: 'bold',
                                                                                color: 'red',
                                                                            }}>{orderErrors.foamdensity}</span>
                                                                        </div>
                                                                    </div>
                                                                 
                                                                    <div className="col-md-3">
                                                                        <div className="mb-3 input-field">
                                                                            <label className="form-label form-label">UPGRADES</label>
                                                                            <Select isMulti={true}
                                                        key={resetKey}
                                                        placeholder='Select upgrades'
                                                        className="clear"
                                                        isClearable={true}
                                                        onChange={(e) => handleChangeMultiSelect1(e, "upgrades")}
                                                        options={addon}
                                                        value={specification && specification.upgrades && specification.upgrades.length > 0 && specification.upgrades?.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                    />
                                                                            <span className="errormsg" style={{
                                                                                fontWeight: 'bold',
                                                                                color: 'red',
                                                                            }}>{orderErrors.upgrades}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <div className="mb-3 input-field">
                                                                            <label className="form-label form-label">DIMENSION A</label>
                                                                            <input id="email" name="dimensionA" type="text" placeholder="Enter Value" class="form-control form-control col-md-10" aria-invalid="false" onChange={(e) => handleChange2(e)} value={specification.dimensionA} />
                                                                            <span className="errormsg" style={{
                                                                                fontWeight: 'bold',
                                                                                color: 'red',
                                                                            }}>{orderErrors.dimensionA}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <div className="mb-3 input-field">
                                                                            <label className="form-label form-label">DIMENSION B</label>
                                                                            <input id="email" name="dimensionB" type="text" placeholder="Enter Value" class="form-control form-control col-md-10" aria-invalid="false" onChange={(e) => handleChange2(e)} value={specification.dimensionB} />
                                                                            <span className="errormsg" style={{
                                                                                fontWeight: 'bold',
                                                                                color: 'red',
                                                                            }}>{orderErrors.dimensionB}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <div className="mb-3 input-field">
                                                                            <label className="form-label form-label">RADIUS</label>
                                                                            <input id="email" name="radius" type="text" placeholder="Enter Value" class="form-control form-control col-md-10" aria-invalid="false" onChange={(e) => handleChange2(e)} value={specification.radius} />
                                                                            <span className="errormsg" style={{
                                                                                fontWeight: 'bold',
                                                                                color: 'red',
                                                                            }}>{orderErrors.radius}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <div className="mb-3 input-field">
                                                                            <label className="form-label form-label">QUANTITY</label>
                                                                            <input type="tel" maxlength="3" name="quantity" class="form-control" onChange={(e) => handleChange2(e)} value={specification.quantity} />
                                                                            <span className="errormsg" style={{
                                                                                fontWeight: 'bold',
                                                                                color: 'red',
                                                                            }}>{orderErrors.quantity}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <div className="mb-3 input-field">
                                                                            <label className="form-label form-label">Additional Instructions</label>

                                                                            <textarea className="form-control" type="text" name='additionalinstructions' id="exampleFormControlTextarea1" placeholder="Add additional Instructions" rows="3" onChange={(e) => handleChange2(e)} value={specification.additionalinstructions}></textarea>
                                                                            {/* <span className="errormsg" style={{
                                                                                fontWeight: 'bold',
                                                                                color: 'red',
                                                                            }}>{orderErrors.ponumber}</span> */}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3 add_product">
                                                                        <div className="mb-3 input-field">
                                                                            <label className="form-label form-label">QUANTITY</label>
                                                                            {editCustomer1 ? <button type="button" className="btn btn-primary" onClick={(e) => handleUpdateProduct(e)}>
                                                                                update product
                                                                            </button> : <button type="button" className="btn btn-primary" onClick={() => handleAddProduct()}>
                                                                                add product
                                                                            </button>}

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {productSpecification.length > 0 ? < DataTable
                                                                    // title=""
                                                                    columns={columns}
                                                                    //className="table align-middle table-nowrap table-check"

                                                                    data={productSpecification}
                                                                    keyField='_id'
                                                                    direction="auto"
                                                                    highlightOnHover
                                                                    fixedHeaderScrollHeight="300px"
                                                                    // pagination
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



                                                                    progressPending={isLoading}
                                                                    progressComponent={<TableLoader />}
                                                                /> : customNoRecords()}

                                                                {id === undefined ? <div className="col-md-10">
                                                                    {/* <a className="btn btn-primary" onClick={(e) => handleOrderReview(e)}>Create and Done</a> */}
                                                                    {productSpecification.length > 0 && <a className="btn btn-primary" onClick={(e) => handleOrderCreate1(e)} >{btnLoader ? (<img src="https://spacovers.imgix.net/spacoversdev/common/images/rotate_right.svg" className="loading-icon" />) : null}Create and Done</a>}

                                                                </div> : <div className="col-md-10">
                                                                    {/* <a className="btn btn-primary" onClick={(e) => handleOrderReview(e)}>Create and Done</a> */}
                                                                    <a className="btn btn-primary" onClick={(e) => handleOrderCreate(e, "inUpdate")} >{btnLoader ? (<img src="https://spacovers.imgix.net/spacoversdev/common/images/rotate_right.svg" className="loading-icon" />) : null}Update and Done</a>
                                                                </div>}

                                                            </form>
                                                        </section>

                                                        {/* onClick={(e) => handleOrderCreate(e)} */}
                                                        {/* <h3 id="basic-example-h-2" tabindex="-1" className={`title ${currentActive === 3 ? 'current' : ''}`}>Product Specifications</h3>
                                                         <section id="basic-example-p-2" role="tabpanel" aria-labelledby="basic-example-h-2" className="body current Confirm" aria-hidden="true" style={{ display: currentActive === 3 ? 'block' : 'none' }} >
                                                             {selctionOrder === "spacovers" ?
                                                                 <form>
                                                                     <h5 className="font-size-14 mt-0">Product Specifications</h5>
                                                                     <div className="prdct_spfn">
                                                                         <div className="prdct_spfn_form">
                                                                             <div className="d-flex mb-3 input-field align-items-center">
                                                                                 <label className="form-label form-label col-md-2">P.O Number</label>
                                                                                 <input id="email" name="ponumber" type="tel" placeholder="Enter Value" className="form-control form-control col-md-10" aria-invalid="false" onChange={(e) => handleChange(e)} value={createOrder && createOrder.productspecification && createOrder.productspecification.ponumber} />
                                                                                 <span className="errormsg" style={{
                                                                                      fontWeight: 'bold',
                                                                                      color: 'red',
                                                                                  }}>{orderErrors.tiedown}</span>
                                                                             </div>
                                                                             <div className="d-flex mb-3 input-field align-items-center">
                                                                                 <label className="form-label form-label col-md-2">Cover  Color<span className="required">*</span></label>
 
                                                                                 <select className="form-select" name="covercolor" onChange={(e) => handleChange(e)} value={createOrder && createOrder.productspecification && createOrder.productspecification.covercolor}>
                                                                                     <option value="">Select Color</option>
                                                                                     {lookup
                                                                                         ?.filter?.((lookupData) => lookupData.type === "color")
                                                                                         .map?.((lookupData) => (
                                                                                             <option key={lookupData.id} value={lookupData.name}>
                                                                                                 {lookupData.name}
                                                                                             </option>
                                                                                         ))}
                                                                                 </select>
                                                                                 <span className="errormsg" style={{
                                                                                     fontWeight: 'bold',
                                                                                     color: 'red',
                                                                                 }}>{orderErrors.covercolor}</span>
                                                                             </div>
 
                                                                             <div className="d-flex mb-3 input-field align-items-center">
                                                                                 <label className="form-label form-label col-md-2">Cover Fold<span className="required">*</span></label>
                                                                                 <select className="form-select" name="coverfold" value={createOrder && createOrder.productspecification && createOrder.productspecification.coverfold} onChange={(e) => handleChange(e)}>
                                                                                     <option value="">Select</option>
                                                                                     {lookup
                                                                                         ?.filter?.((lookupData) => lookupData.type === "fold")
                                                                                         .map?.((lookupData) => (
                                                                                             <option key={lookupData.id} value={lookupData.name}>
                                                                                                 {lookupData.name}
                                                                                             </option>
                                                                                         ))}
                                                                                 </select>
                                                                                 <span className="errormsg" style={{
                                                                                     fontWeight: 'bold',
                                                                                     color: 'red',
                                                                                 }}>{orderErrors.coverfold}</span>
                                                                             </div>
 
                                                                             <div className="d-flex mb-3 input-field align-items-center">
                                                                                 <label className="form-label form-label col-md-2">Tie Downs<span className="required">*</span></label>
                                                                                 <input id="email" name="tiedown" type="text" placeholder="Enter Value" className="form-control form-control col-md-10" aria-invalid="false" onChange={(e) => handleChange(e)} value={createOrder && createOrder.productspecification && createOrder.productspecification.tiedown} />
                                                                                 <span className="errormsg" style={{
                                                                                     fontWeight: 'bold',
                                                                                     color: 'red',
                                                                                 }}>{orderErrors.tiedown}</span>
                                                                             </div>
 
                                                                             <div className="d-flex mb-3 input-field align-items-center">
                                                                                 <label className="form-label form-label col-md-2">Tie Down Locations<span className="required">*</span></label>
                                                                                 <select className="form-select" name="tiedownloaction" onChange={(e) => handleChange(e)} value={createOrder && createOrder.productspecification && createOrder.productspecification.tiedownloaction}>
                                                                                     <option value="">Select Locations</option>
                                                                                     {lookup
                                                                                         ?.filter?.((lookupData) => lookupData.type === "tiedownlocation")
                                                                                         .map?.((lookupData) => (
                                                                                             <option key={lookupData.id} value={lookupData.name}>
                                                                                                 {lookupData.name}
                                                                                             </option>
                                                                                         ))}
                                                                                 </select>
                                                                                 <span className="errormsg" style={{
                                                                                     fontWeight: 'bold',
                                                                                     color: 'red',
                                                                                 }}>{orderErrors.tiedownloaction}</span>
                                                                             </div>
 
                                                                             <div className="d-flex mb-3 input-field align-items-center">
                                                                                 <label className="form-label form-label col-md-2">Cover Skirt Length<span className="required">*</span></label>
                                                                                 <input id="email" name="coverskritlength" type="text" placeholder="Enter Length inches" className="form-control form-control col-md-10" aria-invalid="false" onChange={(e) => handleChange(e)} value={createOrder && createOrder.productspecification && createOrder.productspecification.coverskritlength} />
                                                                                 <span className="errormsg" style={{
                                                                                     fontWeight: 'bold',
                                                                                     color: 'red',
                                                                                 }}>{orderErrors.coverskritlength}</span>
                                                                             </div>
 
                                                                             <div className="d-flex mb-3 input-field align-items-center">
                                                                                 <label className="form-label form-label col-md-2">Skirt Options<span className="required">*</span></label>
                                                                                 <select className="form-select" name='skirtoption' onChange={(e) => handleChange(e)} value={createOrder && createOrder.productspecification && createOrder.productspecification.skirtoption}>
                                                                                     <option value="">Select</option>
                                                                                     {lookup
                                                                                         ?.filter?.((lookupData) => lookupData.type === "skritoptions")
                                                                                         .map?.((lookupData) => (
                                                                                             <option key={lookupData.id} value={lookupData.name}>
                                                                                                 {lookupData.name}
                                                                                             </option>
                                                                                         ))}
                                                                                 </select>
                                                                                 <span className="errormsg" style={{
                                                                                     fontWeight: 'bold',
                                                                                     color: 'red',
                                                                                 }}>{orderErrors.skirtoption}</span>
                                                                             </div>
 
                                                                             <div className="d-flex mb-3 input-field align-items-center">
                                                                                 <label className="form-label form-label col-md-2">Foam Density<span className="required">*</span></label>
                                                                                 <select className="form-select" name="foamdensity" onChange={(e) => handleChange(e)} value={createOrder && createOrder.productspecification && createOrder.productspecification.foamdensity}>
                                                                                     <option value="">Select Foam density</option>
                                                                                     {lookup
                                                                                         ?.filter?.((lookupData) => lookupData.type === "foamdensity")
                                                                                         .map?.((lookupData) => (
                                                                                             <option key={lookupData.id} value={lookupData.name}>
                                                                                                 {lookupData.name}
                                                                                             </option>
                                                                                         ))}
                                                                                 </select>
                                                                                 <span className="errormsg" style={{
                                                                                     fontWeight: 'bold',
                                                                                     color: 'red',
                                                                                 }}>{orderErrors.foamdensity}</span>
                                                                             </div>
 
                                                                             <div className="d-flex mb-3 input-field align-items-center">
                                                                                 <label className="form-label form-label col-md-2">Upgrades<span className="required">*</span></label>
                                                                                 <select className="form-select" name="upgrades" onChange={(e) => handleChange(e)} value={createOrder && createOrder.productspecification && createOrder.productspecification.upgrades}>
                                                                                     <option value=""  >Select</option>
                                                                                     {lookup
                                                                                         ?.filter?.((lookupData) => lookupData.type === "upgrades")
                                                                                         .map?.((lookupData) => (
                                                                                             <option key={lookupData.id} value={lookupData.name}>
                                                                                                 {lookupData.name}
                                                                                             </option>
                                                                                         ))}
                                                                                 </select>
                                                                                 <span className="errormsg" style={{
                                                                                     fontWeight: 'bold',
                                                                                     color: 'red',
                                                                                 }}>{orderErrors.upgrades}</span>
                                                                             </div>
 
                                                                             <div className="d-flex mb-3 input-field align-items-center">
                                                                                 <label className="form-label form-label col-md-2">Dimension A<span className="required">*</span></label>
                                                                                 <input id="email" name="dimensionA" type="text" placeholder="Enter Value" className="form-control form-control col-md-10" aria-invalid="false" onChange={(e) => handleChange(e)} value={createOrder && createOrder.productspecification && createOrder.productspecification.dimensionA} />
                                                                                 <span className="errormsg" style={{
                                                                                     fontWeight: 'bold',
                                                                                     color: 'red',
                                                                                 }}>{orderErrors.dimensionA}</span>
                                                                             </div>
 
                                                                             <div className="d-flex mb-3 input-field align-items-center">
                                                                                 <label className="form-label form-label col-md-2">Dimension B<span className="required">*</span></label>
                                                                                 <input id="email" name="dimensionB" type="text" placeholder="Enter Value" className="form-control form-control col-md-10" aria-invalid="false" onChange={(e) => handleChange(e)} value={createOrder && createOrder.productspecification && createOrder.productspecification.dimensionB} />
                                                                                 <span className="errormsg" style={{
                                                                                     fontWeight: 'bold',
                                                                                     color: 'red',
                                                                                 }}>{orderErrors.dimensionB}</span>
                                                                             </div>
 
                                                                             <div className="d-flex mb-3 input-field align-items-center">
                                                                                 <label className="form-label form-label col-md-2">Radius<span className="required">*</span></label>
                                                                                 <input id="email" name="radius" type="text" placeholder="Enter Value" className="form-control form-control col-md-10" aria-invalid="false" onChange={(e) => handleChange(e)} value={createOrder && createOrder.productspecification && createOrder.productspecification.radius} />
                                                                                 <span className="errormsg" style={{
                                                                                     fontWeight: 'bold',
                                                                                     color: 'red',
                                                                                 }}>{orderErrors.radius}</span>
                                                                             </div>
 
                                                                             <div className="d-flex mb-3 input-field align-items-center">
                                                                                 <label className="form-label form-label col-md-2">Quantity<span className="required">*</span></label>
                                                                                 <div className="input-group  bootstrap-touchspin bootstrap-touchspin-injected">
                                                                                     <button className="btn bootstrap-touchspin-up " type="button" onClick={handleDecrement}>-</button>
                                                                                     <input type="tel" maxLength="3" name="quantity" className="form-control" onChange={(e) => handleChange(e)} value={createOrder &&  createOrder.productspecification && createOrder.productspecification.quantity} 
                                                                                     onFocus={() => setCreateOrder({ ...createOrder, productspecification: { ...createOrder.productspecification, quantity: '' } })}
                                                                                      />
 
                                                                                     <button className="btn bootstrap-touchspin-down " type="button" onClick={(e) => handleIncrement(e, createOrder.productspecification.quantity + 1)}>+</button>
                                                                                 </div>
                                                                                 <span className="errormsg" style={{
                                                                                     fontWeight: 'bold',
                                                                                     color: 'red',
                                                                                 }}>{orderErrors.quantity}</span>
                                                                             </div>
 
                                                                             <div className="d-flex mb-3 input-field align-items-center">
                                                                                 <label className="form-label form-label col-md-2">Additional Instructions</label>
                                                                                 <textarea className="form-control" name='additionalinstructions' id="exampleFormControlTextarea1" placeholder="Add additional Instructions" rows="3" onChange={(e) => handleChange(e)} value={createOrder && createOrder.productspecification && createOrder.productspecification.additionalinstructions}></textarea>
                                                                                 <span className="errormsg" style={{
                                                                                      fontWeight: 'bold',
                                                                                      color: 'red',
                                                                                  }}>{orderErrors.additionalinstructions}</span>
                                                                             </div>
 
                                                                             <div className="d-flex mb-3 input-field align-items-center">
                                                                                 <div className="col-md-2"></div>
                                                                                 <div className="col-md-10">
                                                                                     <a className="btn btn-primary" onClick={(e) => handleOrderReview(e)}>Create and Done</a>
                                                                                     <a className="btn btn-primary"  onClick={(e) => handleOrderCreate(e)}>{btnLoader ? (<img src="https://spacovers.imgix.net/spacoversdev/common/images/rotate_right.svg" className="loading-icon" />) : null}Create and Done</a>
                                                                                 </div>
 
                                                                             </div>
 
                                                                         </div>
                                                                         <div className="select_shape">
                                                                             <div className="card">
                                                                                 <div className="card-body">
                                                                                     <ul className="list-group list-group-flush">
                                                                                         <li className="list-group-item mt-0 py-3 pt-0">
                                                                                             <h5 className="font-size-14 mt-0">Selected Shape</h5>
                                                                                             <div className="shape_image">
                                                                                                 {createOrder.dimensionimage ?  <img src={image + createOrder.dimensionimage} alt="" className="img-fluid d-block" /> :<img src={image + createOrder.productimage} alt="" className="img-fluid d-block" />}
                                                                                                 <p>{createOrder.productname}</p>
                                                                                             </div>
                                                                                         </li>
 
 
 
                                                                                         <li className="list-group-item py-3">
                                                                                             <h5 className="font-size-14 mt-0">Wholesaler Details</h5>
                                                                                             <div className="d-flex">
                                                                                                 <div className="flex-shrink-0 me-3">
                                                                                                     <div className="avatar-xs">
                                                                                                         <div className="avatar-title rounded-circle bg-light text-primary">
                                                                                                             <span className="material-icons-outlined"> person</span>
                                                                                                         </div>
                                                                                                     </div>
                                                                                                 </div>
                                                                                                 <div className="flex-grow-1">
                                                                                                     <h5 className="font-size-14 mb-1 mt-1">Wholesaler</h5>
                                                                                                     <p className="text-muted">{createOrder.wholesalername}</p>
 
                                                                                                 </div>
                                                                                             </div>
                                                                                             <div className="d-flex mt-4">
                                                                                                 <div className="flex-shrink-0 me-3">
                                                                                                     <div className="avatar-xs">
                                                                                                         <div className="avatar-title rounded-circle bg-light text-primary">
                                                                                                             <span className="material-icons-outlined"> local_shipping</span>
                                                                                                         </div>
                                                                                                     </div>
                                                                                                 </div>
                                                                                                 <div className="flex-grow-1">
                                                                                                     <h5 className="font-size-14 mb-1 mt-1">Shipping Address</h5>
                                                                                                     <p className="text-muted">{createOrder && createOrder?.deliveryaddress && (createOrder?.deliveryaddress?.address1 + "," + " " + createOrder.deliveryaddress.address2 + "," + " " + createOrder.deliveryaddress.state + "," + " " + createOrder.deliveryaddress.pincode)}</p>
 
                                                                                                 </div>
                                                                                             </div>
                                                                                         </li>
                                                                                         <li className="list-group-item mt-0 py-3 shape_price">
                                                                                             <h5 className="font-size-14 mb-1 mt-1">Price</h5>
                                                                                             <p className="text-muted">$ {createOrder.totalprice}</p>
                                                                                         </li>
 
 
                                                                                     </ul>
                                                                                 </div>
                                                                             </div>
 
                                                                         </div>
                                                                     </div>
 
                                                                 </form> :
                                                                 <>
                                                                     <div className="Bodybox-body">
                                                                         <div class="Bodybox">
                                                                             <div class="Leftsidebox">
                                                                                 <h6>Selected Item</h6>
                                                                                 <img src={image + createOrder.productimage} alt="" height="180pt" width="190pt" />
                                                                             </div>
                                                                             <div class="rightsidebox">
                                                                                 <div class="rightsideboxone">
                                                                                     <h6>Customer Details</h6>
                                                                                     <div class="d-flex spac">
                                                                                         <div class="flex-shrink-0 me-3">
                                                                                             <div class="avataricon">
                                                                                                 <div class="avatar-titleicon rounded-circle bg-light text-primary">
                                                                                                     <span class="material-icons-outlined">person</span>
                                                                                                 </div>
                                                                                             </div>
                                                                                         </div>
                                                                                         <div class="flex-grow-1">
                                                                                             <h5 class="font-size-14 mb-1 mt-1">Wholesaler</h5>
                                                                                             <p class="Textlight">{createOrder.wholesalername}</p>
                                                                                         </div>
                                                                                     </div>
                                                                                     <div class="d-flex spac">
                                                                                         <div class="flex-shrink-0 me-3">
                                                                                             <div class="avataricon">
                                                                                                 <div class="avatar-titleicon rounded-circle bg-light text-primary">
                                                                                                     <span class="material-icons-outlined">local_shipping</span>
                                                                                                 </div>
                                                                                             </div>
                                                                                         </div>
                                                                                         <div class="flex-grow-1">
                                                                                             <h5 class="font-size-14 mb-1 mt-1">Shipping Address</h5>
                                                                                             <p class="Textlight">{createOrder && createOrder?.deliveryaddress && (createOrder?.deliveryaddress?.address1 + "," + createOrder.deliveryaddress.address2 + "," + createOrder.deliveryaddress.state + "," + createOrder.deliveryaddress.pincode)}</p>
                                                                                         </div>
                                                                                     </div>
                                                                                 </div>
                                                                                 <div className="input-field align-items-center">
                                                                                     <div class="rightsideboxtwo d-flex">
                                                                                         <div class="quantity_input">
                                                                                             <h6>Quantity</h6>
                                                                                             <input type="tel" maxLength="3" name="quantity" className="form-control" onChange={(e) => handleChange(e)} value={createOrder && createOrder.productspecification &&  createOrder.productspecification?.quantity}
                                                                                              onFocus={() => setCreateOrder({ ...createOrder, productspecification: { ...createOrder?.productspecification, quantity: '' } })} 
                                                                                              />
                                                                                             <span className="errormsg" style={{
                                                                                                 fontWeight: 'bold',
                                                                                                 color: 'red',
                                                                                             }}>{orderErrors.quantity}</span>
                                                                                         </div>
                                                                                         <div>
                                                                                             <h6>Price</h6>
                                                                                             <p className="text-muted">$ {createOrder.totalprice}</p>
                                                                                         </div>
                                                                                     </div>
                                                                                 </div>
                                                                             </div>
                                                                         </div>
 
 
                                                                         <label class="text-style mt-3">Additional Instructions</label>
                                                                         <textarea className="form-control" name='additionalinstructions' id="exampleFormControlTextarea1" placeholder="Add additional Instructions" rows="3" onChange={(e) => handleChange(e)} value={createOrder && createOrder.productspecification && createOrder.productspecification.additionalinstructions}></textarea>
 
                                                                         <a className="btn btn-primary" onClick={(e) => handleOrderReview2(e)}>Create and Done</a>
                                                                        
                                                                         <a className="btn btn-primary"  onClick={(e) => handleOrderCreate(e)}>{btnLoader ? (<img src="https://spacovers.imgix.net/spacoversdev/common/images/rotate_right.svg" className="loading-icon" />) : null}Create and Done</a>
                                                                     </div>
                                                                 </>}
 
                                                         </section> */}
                                                        {id === undefined ? null :
                                                            userData.type === "ADMIN" ? <>
                                                                <h3 id="basic-example-h-3" tabindex="-1" className={`title ${currentActive === 3 ? 'current' : ''}`}>Approve </h3>
                                                                <section id="basic-example-p-3" role="tabpanel" aria-labelledby="basic-example-h-3" className="body current Approve" aria-hidden="true" style={{ display: currentActive === 3 ? 'block' : 'none' }}>


                                                                    <div id="dynamicContentContainer">{generateDynamicContent()}</div>
                                                                    <span className="errormsg" style={{
                                                                        fontWeight: 'bold',
                                                                        color: 'red',
                                                                    }}>{orderErrors.workshop}</span>

                                                                    <hr />

                                                                    {/* <div id="dynamicContentContainer">{generateDynamicContentCutting()}</div> */}
                                                                    {/* {handleCheckCutting() && createOrder.status === "NEW" && cuttingUsers && cuttingUsers.length > 0 ? <a class="btn btn-primary" onClick={addHtmlCodeCutting}>Add</a> : <button className="btn btn-primary" disabled>Add</button>} */}


                                                                    {/* <span className="errormsg" style={{
                                                                        fontWeight: 'bold',
                                                                        color: 'red',
                                                                        textAlign: "right"
                                                                    }}>{orderErrors.cuttingusername}</span><br />
                                                                    <span className="errormsg" style={{
                                                                        fontWeight: 'bold',
                                                                        color: 'red',
                                                                        textAlign: "right"
                                                                    }}>{orderErrors.cutting}</span><br />
                                                                    <span className="errormsg" style={{
                                                                        fontWeight: 'bold',
                                                                        color: 'red',
                                                                        textAlign: "right"
                                                                    }}>{orderErrors.cuttingQuantity}</span> */}

                                                                    {/* <hr></hr>
                                                                    <div id="dynamicContentContainer">{generateDynamicContentSewing()}</div>
                                                                    {handleCheckSewing() && createOrder.status === "NEW" && sewingUsers && sewingUsers.length > 0 && sewinginfo.length !== sewingUsers.length ? <a class="btn btn-primary" onClick={addHtmlCodeSewing}>Add</a> : <button className="btn btn-primary" disabled>Add</button>}


                                                                    <span className="errormsg" style={{
                                                                        fontWeight: 'bold',
                                                                        color: 'red',
                                                                        textAlign: "right"
                                                                    }}>{orderErrors.sewingusername}</span><br />

                                                                    <span className="errormsg" style={{
                                                                        fontWeight: 'bold',
                                                                        color: 'red',
                                                                        textAlign: "right"
                                                                    }}>{orderErrors.sewingQuantity}</span><br />
                                                                    <span className="errormsg" style={{
                                                                        fontWeight: 'bold',
                                                                        color: 'red',
                                                                        textAlign: "right"
                                                                    }}>{orderErrors.sewing}</span>
                                                                    <hr></hr> */}

                                                                    <div className="d-flex mb-6 input-field align-items-center button_group">
                                                                        {selctionOrder === "spacovers" && createOrder.status === "NEW" ?

                                                                            <a className="btn btn-primary" onClick={(e) => handleOrderCreate(e, "save")}>{btnSaveLoader ? (<img src="https://spacovers.imgix.net/spacoversdev/common/images/rotate_right.svg" className="loading-icon" />) : null}Save</a> : ""
                                                                        }

                                                                        {createOrder.status === "NEW" ?
                                                                            <a className="btn btn-primary" onClick={(e) => handleOrderCreate(e, "approve")}>{btnLoader ? (<img src="https://spacovers.imgix.net/spacoversdev/common/images/rotate_right.svg" className="loading-icon" />) : null}Approve</a> : <a className="btn btn-primary" style={{ opacity: "0.5" }}>Approved</a>}


                                                                        {createOrder.status === "NEW" && <a className="btn btn-primary" onClick={handleResetApproveTab}>Reset</a>}



                                                                        {createOrder.status === "APPROVED" &&
                                                                            <><a className="btn btn-primary" onClick={handlePrint}><span className="material-icons">print</span>print</a><div style={{ display: 'none' }}>
                                                                                <PrintContent ref={componentRef} />
                                                                            </div></>
                                                                        }



                                                                    </div>
                                                                </section>
                                                            </>
                                                                : null
                                                        }





                                                        <h3 id="basic-example-h-3" tabindex="-1" className={`title ${currentActive === 4 ? 'current' : ''}`}>Review and Confirm </h3>
                                                        <section id="basic-example-p-3" role="tabpanel" aria-labelledby="basic-example-h-3" className="body current Review" aria-hidden="true" style={{ display: currentActive === 4 ? 'block' : 'none' }}>
                                                            <div id="textbox">
                                                                <p className="alignleft">{selctionOrder}-{createOrder.productname}</p>
                                                                {/* <p className="alignright">Order ID Spc: 102565586</p> */}
                                                            </div>
                                                            <div className="review-table-block">
                                                                <table className="table">
                                                                    <thead className="bg-light colbgcolor">
                                                                        <tr>
                                                                            <th className="col" style={{ width: "30%" }}>Customer Name</th>
                                                                            <th className="col" style={{ width: "20%" }}>Address</th>
                                                                            <th className="col" style={{ width: "20%" }}>Quantity</th>
                                                                            <th className="col" style={{ width: "10%" }}>Action</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td className="col1">

                                                                                {/* <select name="customername" d="email" className="btn Butto" onChange={(e) => handleChangeCustomer(e)} value={customerObj.customername}>
                                                                          <option value="">select customer</option>
                                                                          <option value="John Hokins">John Hokins</option>
                                                                          <option value="William Dorsey">William Dorsey</option>
                                                                          <option value="Nick Starc">Nick Starc</option>
                                                                      </select> */}
                                                                                <input type="text" name="customername" className="form-control" onChange={(e) => handleChangeCustomer(e)} value={customerObj.customername} />
                                                                            </td>
                                                                            <td class="col2"> <input
                                                                                id="search-input"
                                                                                autocomplete="off"
                                                                                className="form-control"
                                                                                ref={inputRef}
                                                                                type="text"
                                                                                placeholder="Search for a location..."
                                                                                value={edit ? customerObj.customeraddress : null}
                                                                                onChange={handleSearchInputChange}
                                                                            /></td>
                                                                            <td className="col3"><input type="tel" maxLength="3" name="quantitypercustomer" id="quantity" onChange={(e) => handleChangeCustomer(e)} value={customerObj.quantitypercustomer} /></td>
                                                                            <td className="col4">{editCustomer1 ? <button className="btn btn-primary customerbtn" >Update Customer</button> : <button className="btn btn-primary customerbtn" onClick={(e) => handleAddCustomer1(e)}>Add Customer</button>}</td>

                                                                        </tr>
                                                                    </tbody>
                                                                    <span className="errormsg" style={{
                                                                        fontWeight: 'bold',
                                                                        color: 'red',
                                                                        textAlign: "right"
                                                                    }}>{custError}</span>
                                                                </table>


                                                            </div>
                                                            <>

                                                                <div className="container-fluid">
                                                                    <div className="row mb-4 breadcrumb">
                                                                        <div className="col-lg-12">
                                                                            <DataTable
                                                                                // title=""
                                                                                columns={columns}
                                                                                //className="table align-middle table-nowrap table-check"

                                                                                data={customerInfo}
                                                                                keyField='_id'
                                                                                direction="auto"
                                                                                highlightOnHover
                                                                                fixedHeaderScrollHeight="300px"
                                                                                // pagination
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



                                                                                progressPending={isLoading}
                                                                                progressComponent={<TableLoader />}


                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                            <div className="d-flex mb-3 input-field align-items-center">

                                                                <div className="col-md-2">
                                                                    <a className="btn btn-primary" onClick={(e) => handleOrderCreate(e)}>{btnLoader ? (<img src="https://spacovers.imgix.net/spacoversdev/common/images/rotate_right.svg" className="loading-icon" />) : null}Confirm and Done</a>
                                                                </div>
                                                            </div>
                                                        </section>

                                                    </div>
                                                    <div className="actions clearfix">
                                                        <ul role="menu" aria-label="Pagination">
                                                            <li className="disabled" aria-disabled="true"><a href="#previous" role="menuitem">Previous</a></li>
                                                            <li aria-hidden="false" aria-disabled="false"><a href="#next" role="menuitem">Next</a></li>
                                                            <li aria-hidden="true" style={{ display: "none" }}><a href="#finish" role="menuitem">Finish</a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                {/* <!--end row--> */}

                            </div>
                            {/* <!-- container-fluid --> */}
                        </div>
                        {/* <!-- End Page-content --> */}


                        <footer className="footer">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <script>document.write(new Date().getFullYear())</script> © SpaCovers.com
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="text-sm-end d-none d-sm-block">
                                            All Rights Reserved
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>
                }
                <Footer />
                <Modal className="access-denied order_specification lookuppopup add_member_pop" show={addPopup}>

                    <div className="modal-body enquiry-form">
                        {!invalidContent &&

                            <div>
                                <button className="close-btn" onClick={e => onCancel()}><span className="material-icons">close</span></button>
                                <div className="row mb-4 breadcrumb">
                                    <div className="col-lg-12">
                                        <div className="d-flex align-items-center">

                                            <div className="flex-grow-1">
                                                <h4 className="mb-2 card-title">{id === undefined ? "ADD MEMBER" : "EDIT MEMBER"}</h4>
                                                {/* <p className="menu-path"><span>User Management</span> / <b>{id == undefined ? "ADD CUSTOMER" : "EDIT CUSTOMER"}</b></p> */}

                                            </div>

                                        </div>
                                    </div>
                                </div>


                                <div className="create-user-block">
                                    {Object.keys(editCustomer).length > 0 || countries.length > 0 ?

                                        <>
                                            <div className="form-block">
                                                <div className="row">

                                                    <div className="col-md-6">
                                                        <label className="form-label form-label">NAME<span className="required">*</span></label>
                                                        <input id="titlename" name="name" placeholder="Enter Name" type="text" className="form-control form-control" aria-invalid="false" onChange={(e) => handleChange1(e)} value={editCustomer && editCustomer.name} />
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.name}</span>

                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label form-label">CONTACT NUMBER</label>

                                                        <div>
                                                            {/* <select name="idc" value={editCustomer && editCustomer.idc} className="colorselect capitalize" onChange={(e) => handleChange(e)}>
                                                      <option value="">Select</option>
                                                      {/* <option value="91">IND(+91)</option> */}
                                                            {/*  {countries && countries.length > 0 && countries.map((task, i) => {
                                                          return (
                                                              <><option key={i} value={task.alpha3}>{task.alpha3 + task.countrycode}</option></>
                                                          )
                                                      }
                                                      )}
                                                  </select> */}

                                                            <input className="form-control contact-number" type="tel" name="phonenumber" value={editCustomer && editCustomer.phonenumber} placeholder="Enter Phone Number" onChange={(e) => handleChange1(e)} maxLength="10" id="example-tel-input" />
                                                            {/* <span className="errormsg" style={{
                                                      fontWeight: 'bold',
                                                      color: 'red',
                                                  }}>{IdcError}</span>
                                                  <span className="errormsg" style={{
                                                      fontWeight: 'bold',
                                                      color: 'red',
                                                  }}>{phoneError}</span> */}
                                                        </div>

                                                    </div>
                                                    <div className="col-md-6 mt-3">
                                                        <label className="form-label form-label">E-MAIL ID<span className="required">*</span></label>
                                                        <input id="email" name="emailid" placeholder="Enter Your Email" type="email" className="form-control form-control" aria-invalid="false" value={editCustomer && editCustomer.emailid} disabled={id !== undefined} onChange={(e) => handleChange1(e)} />
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.emailid}</span>

                                                    </div>
                                                    <div className="col-md-6 mt-3">
                                                        <label for="exampleFormControlTextarea1" className="form-label">Type<span className="required">*</span></label>
                                                        <select className="form-select" aria-label="Default select example" name="type" onChange={(e) => handleChange1(e)} value={editCustomer && editCustomer.type}>
                                                            <option value="">Select type</option>
                                                            <option value="Wholesaler">Wholesaler</option>
                                                            <option value="Retailer">Retailer</option>

                                                        </select>
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.type}</span>
                                                    </div>
                                                    <div className="col-md-6 mt-3">
                                                        <label for="exampleFormControlTextarea1" className="form-label">Status<span className="required">*</span></label>
                                                        <select className="form-select" aria-label="Default select example" name="status" onChange={(e) => handleChange1(e)} value={editCustomer && editCustomer.status}>
                                                            <option value="">Select status</option>
                                                            <option value="INACTIVE">INACTIVE</option>
                                                            <option value="ACTIVE">ACTIVE</option>
                                                            <option value="ARCHIVE">ARCHIVE</option>

                                                        </select>
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.status}</span>

                                                    </div>


                                                    <h5 className="mt-3">Delivery Address</h5>
                                                    <div className="col-md-6 mt-3">
                                                        <label for="customeraddress1" class="form-label">Address 1<span className="required">*</span></label>
                                                        <textarea class="form-control" id="address1" name="customeraddress1" rows="1" onChange={(e) => handleChange1(e)} value={editCustomer && editCustomer.customeraddress && editCustomer.customeraddress.address1}></textarea>
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.customeraddress1}</span>

                                                    </div>
                                                    <div className="col-md-6 mt-3">
                                                        <label for="customeraddress2" class="form-label">Address 2<span className="required">*</span></label>
                                                        <textarea class="form-control" id="address2" name="customeraddress2" rows="1" onChange={(e) => handleChange1(e)} value={editCustomer && editCustomer.customeraddress && editCustomer.customeraddress.address2}></textarea>
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.customeraddress2}</span>
                                                    </div>


                                                    <div className="col-md-6 mt-3">
                                                        <label for="exampleFormControlTextarea1" class="form-label">State<span className="required">*</span></label>
                                                        <select class="form-select" aria-label="Default select example" name="customerstate" value={editCustomer && editCustomer.customeraddress && editCustomer.customeraddress && editCustomer.customeraddress.state} onChange={(e) => handleChange1(e)}>
                                                            <option value="">Select state</option>
                                                            {countries && countries.length > 0 && countries.map((task, i) => {
                                                                return (
                                                                    <><option key={i} value={task.name}>{task.name}</option></>
                                                                )
                                                            }
                                                            )}
                                                        </select>
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.customerstate}</span>
                                                    </div>
                                                    <div className="col-md-6 mt-3">
                                                        <label htmlFor="customeraddresspincode" class="form-label">Zip Code<span className="required">*</span></label>
                                                        <input type="tel" inputmode="numeric" class="form-control" id="example-tel-input" name="customerpincode" maxLength="6" placeholder="Zip code" onChange={(e) => handleChange1(e)} value={editCustomer && editCustomer.customeraddress && editCustomer.customeraddress.pincode} />
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.customerpincode}</span>
                                                    </div>

                                                    <div className="d-flex">
                                                        <h5 className="mt-3">Billing Address</h5>
                                                        <div class="form-check ms-3 mt-3">
                                                            <input class="form-check-input" type="checkbox" id="flexCheckDefault" name="checkboxinput" onClick={(e) => handleCheckBox(e)} checked={editCustomer.check ? editCustomer.check : checkBoxVal} />
                                                            <label class="form-check-label" for="flexCheckDefault">
                                                                Same as delivery address
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 mt-3">
                                                        <label for="customeraddress1" class="form-label">Address 1<span className="required">*</span></label>
                                                        <textarea class="form-control" id="address1" name="billingaddress1" rows="1" onChange={(e) => handleChange1(e)} value={editCustomer && editCustomer.billingaddress && editCustomer.billingaddress.address1} disabled={editCustomer.check}></textarea>
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.billingaddress1}</span>

                                                    </div>
                                                    <div className="col-md-6 mt-3">
                                                        <label for="customeraddress2" class="form-label">Address 2<span className="required">*</span></label>
                                                        <textarea class="form-control" id="address2" name="billingaddress2" rows="1" onChange={(e) => handleChange1(e)} value={editCustomer && editCustomer.billingaddress && editCustomer.billingaddress.address2} disabled={editCustomer.check}></textarea>
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.billingaddress2}</span>
                                                    </div>
                                                    <div className="col-md-6 mt-3">
                                                        <label for="exampleFormControlTextarea1" class="form-label">State<span className="required">*</span></label>
                                                        <select name="billingstate" class="form-select" aria-label="Default select example" value={editCustomer && editCustomer.billingaddress && editCustomer.billingaddress.state} onChange={(e) => handleChange1(e)} disabled={editCustomer.check}>
                                                            <option value="">Select state</option>
                                                            {countries && countries.length > 0 && countries.map((task, i) => {
                                                                return (
                                                                    <><option key={i} value={task.name}>{task.name}</option></>
                                                                )
                                                            }
                                                            )}
                                                        </select>
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.billingstate}</span>
                                                    </div>
                                                    <div className="col-md-6 mt-3">
                                                        <label htmlFor="exampleFormControlInput1" class="form-label">Zip Code<span className="required">*</span></label>
                                                        <input name="billingpincode" type="tel" maxLength="6" class="form-control" id="exampleFormControlInput1" placeholder="Zip code" onChange={(e) => handleChange1(e)} value={editCustomer && editCustomer.billingaddress && editCustomer.billingaddress.pincode} disabled={editCustomer.check} />
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.billingpincode}</span>
                                                    </div>


                                                </div>

                                            </div>

                                            <div className="row">
                                                <div className="col-md-12 mt-3">
                                                    <button className="btn btn-primary btn-block " type="submit" onClick={e => id == undefined ? handleAddCustomer(e) : handleUpdate(e)}> {id == undefined ? <>{isLoading ? (<img src={image + Config.imgloader + "rotate_right.svg"} className="loading-icon" />) : null} Create</> :
                                                        <>{isLoading ? (<img src={image + Config.imgloader + "rotate_right.svg"} className="loading-icon" />) : null} Update </>}</button>
                                                </div>
                                                {msg ? <span className="errormsg" style={{
                                                    fontWeight: 'bold',
                                                    color: 'green',
                                                }}>{msg}</span> : ""
                                                }
                                            </div>
                                        </> : <div className="form-block">
                                            <div className="tab-content p-3 text-muted">
                                                <div className="tab-pane active show" id="home1" role="tabpanel">
                                                    <Loader />
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <SweetAlert show={successOrderV1}
                                        custom
                                        confirmBtnText="ok"
                                        confirmBtnBsStyle="primary"
                                        title={"Added successfully"}
                                        onConfirm={e => onConfirmV1()}
                                    >
                                    </SweetAlert>

                                    <SweetAlert show={UpdateSuccess}
                                        custom
                                        confirmBtnText="ok"
                                        confirmBtnBsStyle="primary"
                                        title={"Updated successfully"}
                                        onConfirm={e => setUpdateSuccess(false)}
                                    ></SweetAlert>

                                    <SweetAlert show={existmsg}
                                        custom
                                        confirmBtnText="ok"
                                        confirmBtnBsStyle="primary"
                                        title={"Customer Already Exist"}
                                        onConfirm={e => setExistMsg(false)}
                                    >
                                    </SweetAlert>


                                </div>




                            </div>




                        }

                    </div>
                </Modal>

                <SweetAlert show={UpdateSuccess}
                    custom
                    confirmBtnText="ok"
                    confirmBtnBsStyle="primary"
                    title={"Updated successfully"}
                    onConfirm={e => setUpdateSuccess(false)}
                ></SweetAlert>

                <SweetAlert show={success}
                    custom
                    confirmBtnText="ok"
                    confirmBtnBsStyle="primary"
                    title={"Added successfully"}
                    onConfirm={e => onConfirm()}
                >
                </SweetAlert>
                <SweetAlert show={saved}
                    custom
                    confirmBtnText="ok"
                    confirmBtnBsStyle="primary"
                    title={"Order saved successfully"}
                    onConfirm={e => setSaved(false)}
                />
                <SweetAlert show={approved}
                    custom
                    confirmBtnText="ok"
                    confirmBtnBsStyle="primary"
                    title={"Order approved successfully"}
                    onConfirm={e => { setApprove(false); history.push("/orders"); }}
                />
                <SweetAlert show={successOrder}
                    custom
                    confirmBtnText="ok"
                    confirmBtnBsStyle="primary"
                    title={"Please Add Product"}
                    onConfirm={e => onConfirm2()}
                >
                </SweetAlert>
                <SweetAlert show={showError}
                    custom
                    confirmBtnText="ok"
                    confirmBtnBsStyle="primary"
                    title={"Please Add Customers As per Quantity"}
                    onConfirm={e => onConfirm1()}
                />
                <Modal className="access-denied" show={isdelete}>

                    <div className="modal-body enquiry-form">
                        <div className="container">
                            <button className="close-btn" onClick={e => onCancel()}><span className="material-icons">close</span></button>
                            <span className="material-icons access-denied-icon">delete_outline</span>
                            <h3>Delete</h3>
                            <p>This action cannot be undone.</p>
                            <p>Are you sure you want to delete the Delete Customer</p>
                            <div className="popup-footer">
                                <button onClick={handleDeleteProduct} className="fill_btn yellow-gradient" data-bs-toggle="modal" data-bs-target="#recommendModal" >Yes, Delete</button>
                            </div>
                        </div>
                    </div>

                </Modal>
                <Modal className="access-denied order_specification product_specification" show={popup}>
                    <div className="order_details">
                        <div className="modal-body enquiry-form">
                            <button className="close-btn" onClick={e => setPopup(false)}><span className="material-icons">close</span></button>
                            {/* <h5 className="mt-0">ORDER ID : <span>{itemsView.ordernumber}</span></h5> */}
                            {/* <div className="order_details">
        <div className="order_item">
            <h5 className="font-size-14 mt-0">Selected Product</h5>
            <div className="shape_image">
                <img src={image + itemsView.productimage} alt="" className="img-fluid d-block" />
                <p>{itemsView.productname}</p>
            </div> */}
                            {/* <h5 className="font-size-14">scan qr code</h5>
    <div className="shape_image">
        <img src="https://spacovers.imgix.net/spacoversdev/admin/theme/images/qr-code.png" alt="" className="img-fluid d-block"/>
    </div> */}
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
                                        <h5 className="font-size-14 mb-1 mt-1">Product Name</h5>
                                        <p className="text-muted">{viewproduct && viewproduct.productname}</p>

                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0 me-3">
                                        {/* <div className="avatar-xs">
                                        <div className="avatar-title rounded-circle bg-light text-primary">
                                            <span className="material-icons-outlined"> local_shipping</span>
                                        </div>
                                    </div> */}
                                    </div>
                                    {/* <div className="flex-grow-1">
                        <h5 className="font-size-14 mb-1 mt-1">Order Date</h5>
                        <p className="text-muted">{new Date(itemsView?.created).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                        })}</p>


                    </div> */}
                                </div>
                            </div>
                            <h5 className="product_title">Product Specifications</h5>
                            <div className="table-responsive">

                                <table className="table table-striped mb-0">
                                    <tbody>
                                        <tr>
                                            <td >Cover  Color</td>
                                            <td >{viewproduct && viewproduct.covercolor}</td>
                                        </tr>
                                        {viewproduct && viewproduct.ponumber && viewproduct.ponumber.length > 0 && (
                                            <tr>
                                                <td>P O Number</td>
                                                <td>{viewproduct && viewproduct.ponumber}</td>
                                            </tr>
                                        )}

                                        <tr>
                                            <td>Cover Fold</td>
                                            <td>{viewproduct && viewproduct.coverfold}</td>
                                        </tr>
                                        <tr>
                                            <td>Tie Downs</td>
                                            <td>{viewproduct && viewproduct.tiedown}</td>
                                        </tr>
                                        <tr>
                                            <td>Tie Down Locations</td>
                                            <td>{viewproduct && viewproduct.tiedownlocation}</td>
                                        </tr>
                                        {viewproduct && viewproduct.tiedownlocation === "Custom" && (
                                            <tr>
                                                <td>Tie Down Locations Length</td>
                                                <td>{viewproduct.tiedownlocationlength}</td>
                                            </tr>
                                        )}


                                        <tr>
                                            <td>Cover Skirt Length</td>
                                            <td>{viewproduct && viewproduct.coverskritlength}</td>
                                        </tr>
                                        <tr>
                                            <td>Skirt Options</td>
                                            <td>{viewproduct && viewproduct.skirtoption}</td>
                                        </tr>
                                        <tr>
                                            <td>Foam Density</td>
                                            <td>{viewproduct && viewproduct.foamdensity}</td>
                                        </tr>
                                        <tr>
                                            <td>Upgrades</td>
                                            <td>{viewproduct && viewproduct.upgrades}</td>
                                        </tr>
                                        <tr>
                                            <td>Dimension A</td>
                                            <td>{viewproduct && viewproduct.dimensionA}</td>
                                        </tr>
                                        <tr>
                                            <td>Dimension B</td>
                                            <td>{viewproduct && viewproduct.dimensionB}</td>
                                        </tr>
                                        <tr>
                                            <td>Radius</td>
                                            <td>{viewproduct && viewproduct.radius}</td>
                                        </tr>
                                        {viewproduct && viewproduct.additionalinstructions && viewproduct.additionalinstructions.length > 0 && (
                                            <tr>
                                                <td>Additional Instructions</td>
                                                <td>{viewproduct && viewproduct.additionalinstructions}</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td>Quantity</td>
                                            <td>{viewproduct && viewproduct.quantity}</td>
                                        </tr>
                                        {/* <tr>
                            <td>Additional Instructions</td>
                            <td>{itemsView && itemsView.productspecification && itemsView.productspecification.additionalinstructions}</td>
                        </tr> */}
                                    </tbody>
                                </table>
                            </div>
                            <div className="d-flex justify-content-end align-items-center print">
                                {/* <a className="btn" onClick={handlePrint}><span className="material-icons">print</span>print</a>
                                    <div style={{ display: 'none' }}>
                                        <PrintContent ref={componentRef} />
                                    </div> */}
                                {/* <a href="#" className="btn"><span className="material-icons">print</span>print</a> */}
                                {/* <img src="https://spacovers.imgix.net/spacoversdev/admin/theme/images/barcode.jpg?auto=compress,format" alt="" className="img-fluid d-block" /> */}
                            </div>

                        </div>
                    </div>
                </Modal>
                <Modal className="access-denied dimension_popup" show={isImage}>
                    <div className="modal-body enquiry-form" key={productSpecification.id}>
                        <button className="close-btn" onClick={e => onCancelImage()}>
                            <span className="material-icons">close</span>
                        </button>
                        <img
                            src={viewproduct && viewproduct.dimensionimage &&
                                image + viewproduct.dimensionimage + "?auto=compress,format"
                            }
                            alt='Image'
                        />

                    </div>
                </Modal>

            </div >


        </>
    );
};

export default EditOrder;
