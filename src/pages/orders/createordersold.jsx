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
import * as Config from "../../constants/Config";

import Sidebar from "../../components/dashboard/sidebar";
import Footer from "../../components/dashboard/footer";
import GoogleMap from "../googlemap";
import { getCountries } from "libphonenumber-js";

let { lambda, appname } = window.app;


const CreateOrders = () => {
    let { id } = useParams();
    const [checkStatus, setCheckStatus] = useState(false);
    const [currentActive, setCurrentActive] = useState(1);
    const [createOrder, setCreateOrder] = useState({ productspecification: { quantity: 0 } })
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
    const[successOrder,setSuccessOrder]=useState(false);
    const [editCustomer, setEditCustomer] = useState("");
    const [editCustomer1, setEditCustomer1] = useState(false);
    const [showError, setShowError] = useState(false);
    const [custError, setCustError] = useState("");
    const [customerselectedObj, setCustomerSelectedObj] = useState({})
    const history = useHistory();
    const [btnLoader, setBtnLoader] = useState(false);
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

    const [customerErrors, setCustomerErrors] = useState({});
    const [showImage, setShowImage] = useState("");

    const { searchedFlag, setSearchedFlag, setUserSearch, isLoading, setIsLoading, userData, sortTableAlpha, arrow, setSelectedOptions, data, setData, rowsPerPage, setRowsPerPage, currentPageNew, setCurrentPage, lookUpType, setlookUpType, lookupsearch, setLookupSearch, route, setRoute, usePrevious, sortedColumn, setSortedColumn, sortDirection, setSortDirection, setActiveMenuId, GetTimeActivity, selctionOrder, setSelectionOrder } = useContext(contentContext);

    console.log("selctionOrder", selctionOrder);
    console.log("getitem", localStorage.getItem("order"))
    const columns = [
        {
            name: "Customer Name",
            selector: (row) => row.customername,
        },

        {
            name: "Address",
            selector: (row) => row.customeraddress,
        },
        {
            name: "Quantity",
            selector: (row) => row.quantitypercustomer,
        },

        {
            name: "ACTIONS",
            cell: (row) => (
                <div className="d-flex justify-content-between">

                    <a onClick={(e) => handleEditCustomer(e, row.id)}

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
            <div className="empty-state-body empty-record">
                <div className="empty-state__message">
                    <span className="material-icons">
                        people
                    </span>
                    <p className="form-check font-size-16">
                        No customers were found
                    </p>
                </div>
            </div>
        );
    };
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
            if (createOrder && createOrder.productname) {
                setCurrentActive(3)
            }
        }
        else if (num === 4) {
            let isValid;
            if (selctionOrder === "spacovers") {
                isValid = formvalidationReview();
            } else {
                isValid = formvalidationReview2();
            }
            let tab2 = false;
            if (isValid) {
                setCurrentActive(4);
                tab2 = true;
            }
            setTabActive({ ...tmpTabActive, tab2: tab2 });

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
        if (editCustomer.emailid === "" || editCustomer.emailid === undefined) {
            errors["emailid"] = "Email Id is required"
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
    }

    const handleDeleteCustomer = (e) => {
        console.log("id", id);
        const newArray = customerInfo.filter(obj => obj.id !== deleteid);
        setCustomerInfo(newArray);
        setIsDelete(false);
    }
    const formvalidationReview = () => {

        let formIsValid = true;
        const errors = {};
        if (!createOrder.productspecification?.covercolor || createOrder.productspecification?.covercolor === "") {
            errors.covercolor = "Please select covercolor"
            formIsValid = false;
        }
        if (!createOrder.productspecification?.coverfold || createOrder.productspecification?.covercolorfold === "") {
            errors.coverfold = "Please select coverfold"
            formIsValid = false;
        }
        if (!createOrder.productspecification?.tiedown || createOrder.productspecification?.tiedown === "") {
            errors.tiedown = "Enter tiedown"
            formIsValid = false;
        }
        if (!createOrder.productspecification?.tiedownloaction || createOrder.productspecification?.tiedownloaction === "") {
            errors.tiedownloaction = "Please select tiedownloaction"
            formIsValid = false;
        }
        if (!createOrder.productspecification?.coverskritlength || createOrder.productspecification?.coverskritlength === "") {
            errors.coverskritlength = "Enter coverskritlength"
            formIsValid = false;
        }
        if (!createOrder.productspecification?.skirtoption || createOrder.productspecification?.skirtoption === "") {
            errors.skirtoption = "Please select skirtoption"
            formIsValid = false;
        }
        if (!createOrder.productspecification?.foamdensity || createOrder.productspecification?.foamdensity === "") {
            errors.foamdensity = "Please select foamdensity"
            formIsValid = false;
        }
        if (!createOrder.productspecification?.upgrades || createOrder.productspecification?.upgrades === "") {
            errors.upgrades = "Please select upgrades"
            formIsValid = false;
        }
        if (!createOrder.productspecification?.dimensionA || createOrder.productspecification?.dimensionA === "") {
            errors.dimensionA = "Enter dimensionA"
            formIsValid = false;
        }
        if (!createOrder.productspecification?.dimensionB || createOrder.productspecification?.dimensionB === "") {
            errors.dimensionB = "Enter dimensionB"
            formIsValid = false;
        }
        if (!createOrder.productspecification?.radius || createOrder.productspecification?.radius === "") {
            errors.radius = "Enter radius"
            formIsValid = false;
        }
        // if (!createOrder.productspecification?.additionalinstructions || createOrder.productspecification?.additionalinstructions.trim() === "") {
        //     errors.additionalinstructions = "Enter additional instructions";
        //     formIsValid = false;
        // }
        if (!createOrder.productspecification?.quantity || createOrder.productspecification?.quantity === "") {
            errors.quantity = "Enter quantity"
            formIsValid = false;
        }
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

        if (!createOrder.wholesalername || createOrder.wholesalername.trim() === "") {
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
        setCreateOrder({ ...createOrder, productname: item.productname, sku: item.sku, productimage: item.images[0].path, totalprice: item.price , dimensionimage: item && item.images && item.images[1] ? item.images[1].path : ""});
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
    const handleOrderCreate = () => {
        const isValid = formvalidationReview();
        console.log("isvlid", isValid);
        
            setBtnLoader(true)
            let addObj = { ...createOrder, customerinfo: customerInfo, ordertype: selctionOrder, status: "NEW", orderstatus: "offline" }
            console.log("addObj", addObj);
            const token = localStorage.getItem("token")
            axios({
                method: 'PUT',
                url: lambda + "/addorder?appname=" + appname + "&token=" + token + "&userid=" + localStorage.getItem("userId"),
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
        


    }
    function onConfirm() {
        setSuccess(false);
        setSuccessOrder(false);
        history.push("/orders")
    };
    function onConfirm2() {
       
        setSuccessOrder(false);
        history.push("/createorder")
    };
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

    const handleEditCustomer = (e, id) => {
        setEdit(true)
        setCustId(id)
        setEditCustomer1(true);
        const selected = customerInfo.find(obj => obj.id === id);
        setCustomerObj(selected);
        setCustomerSelectedObj(selected)
        setCustError("")

    }
    const handleUpdateCustomer = (e) => {
        const sumOfValues = customerInfo.reduce((acc, obj) => {
            const valueAsNumber = parseFloat(obj.quantitypercustomer) || 0;
            return acc + valueAsNumber;
        }, 0);
        let checkVal = createOrder && createOrder.productspecification && createOrder.productspecification.quantity;
        let quantityCheck = sumOfValues - parseInt(customerselectedObj.quantitypercustomer) + parseInt(customerObj.quantitypercustomer)
        console.log("sumOfValues", quantityCheck, checkVal)
        if (!customerObj.customername || customerObj.customername.trim() === "") {
            setCustError(" Please Enter Customer Name");
        } else if (customerObj.customeraddress === undefined && !places.length) {
            setCustError(" Please Enter Customer Address");
        } else if (!customerObj.quantitypercustomer || customerObj.quantitypercustomer.trim() === "" || parseInt(customerObj.quantitypercustomer.trim()) === 0) {
            setCustError(" Please Enter quantity");

        } else
            if (quantityCheck > checkVal) {
                setCustError("Product quantity and customers total quantity is mismatched")
            } else {

                setCustomerInfo(prevArray => {
                    return prevArray.map(obj => {
                        if (obj.id === custid) {
                            // Replace the object with the new one
                            if (places && places[0] && places[0]?.formatted_address) {
                                return { ...customerObj, customeraddress: places[0].formatted_address };
                            } else {
                                return customerObj
                            }
                        }
                        return obj; // Return unchanged objects
                    });
                });
                setEditCustomer(false);
                setCustomerObj({ ...customerObj, customername: "", customeraddress: "", quantitypercustomer: "" })
                //setSearchInput("");
                setPlaces([])
                if (inputRef.current) {
                    inputRef.current.value = '';
                }
                setEdit(false);
                setOption(false)
            }


    }

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
                if (response.data.result === "Invalid token or Expired") {
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


        // if (e.target.name === "wholesalername") {
        //     setCreateOrder({ ...createOrder, [e.target.name]: e.target.value });

        // }
        const numericValue = e.target.value.replace(/\D/g, '');
        if (e.target.name === "ponumber") {
            setCreateOrder({
                ...createOrder,
                productspecification: {
                    ...createOrder.productspecification,
                    ponumber: numericValue,
                },
            })
        } else if (e.target.name === "covercolor") {
            setCreateOrder({
                ...createOrder,
                productspecification: {
                    ...createOrder.productspecification,
                    covercolor: e.target.value,
                },
            });
        }
        else if (e.target.name === "coverfold") {
            setCreateOrder({
                ...createOrder,
                productspecification: {
                    ...createOrder.productspecification,
                    coverfold: e.target.value,
                },
            });
        }
        else if (e.target.name === "tiedown") {


            setCreateOrder({
                ...createOrder,

                productspecification: {
                    ...createOrder.productspecification,
                    tiedown: numericValue,
                },
            });
        }
        else if (e.target.name === "tiedownloaction") {
            setCreateOrder({
                ...createOrder,
                productspecification: {
                    ...createOrder.productspecification,
                    tiedownloaction: e.target.value,
                },
            });
        }
        else if (e.target.name === "coverskritlength") {
            setCreateOrder({
                ...createOrder,
                productspecification: {
                    ...createOrder.productspecification,
                    coverskritlength: numericValue,
                },
            });
        }
        else if (e.target.name === "skirtoption") {
            setCreateOrder({
                ...createOrder,
                productspecification: {
                    ...createOrder.productspecification,
                    skirtoption: e.target.value,
                },
            });
        }
        else if (e.target.name === "foamdensity") {
            setCreateOrder({
                ...createOrder,
                productspecification: {
                    ...createOrder.productspecification,
                    foamdensity: e.target.value,
                },
            });
        }
        else if (e.target.name === "upgrades") {
            setCreateOrder({
                ...createOrder,
                productspecification: {
                    ...createOrder.productspecification,
                    upgrades: e.target.value,
                },
            });
        }
        else if (e.target.name === "dimensionA") {
            setCreateOrder({
                ...createOrder,
                productspecification: {
                    ...createOrder.productspecification,
                    dimensionA: numericValue,
                },
            });
        }

        else if (e.target.name === "dimensionB") {
            setCreateOrder({
                ...createOrder,
                productspecification: {
                    ...createOrder.productspecification,
                    dimensionB: numericValue,
                },
            });
        }
        else if (e.target.name === "radius") {
            setCreateOrder({
                ...createOrder,
                productspecification: {
                    ...createOrder.productspecification,
                    radius: numericValue,
                },
            });
        }
        else if (e.target.name === "quantity") {

            if ((numericValue === "") || (parseInt(numericValue) === 0)) {
                setCreateOrder({
                    ...createOrder,
                    productspecification: {
                        ...createOrder.productspecification,
                        quantity: numericValue,
                    },
                    totalprice: price

                });

            } else {
                setCreateOrder({
                    ...createOrder,
                    productspecification: {
                        ...createOrder.productspecification,
                        quantity: numericValue,
                    },
                    totalprice: parseInt(e.target.value) * price

                });
            }
        }
        else if (e.target.name === "additionalinstructions") {
            setCreateOrder({
                ...createOrder,
                productspecification: {
                    ...createOrder.productspecification,
                    additionalinstructions: e.target.value,
                },
            });
        }
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
        setSelectionOrder(localStorage.getItem("order"))
        setRoute("orders");
        setActiveMenuId(200001)
        GetLookUp();
        GetProduct();
        getWholesaler();
        userActivity();
    }, []);


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
                if (response.data.result === "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {

                    setLookup(response.data.result.data)

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
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {

                    setProduct(response.data.result.data)
                    console.log("pp------>", response.data.result.data)

                    setIsLoading(false);
                    // setLookupSearch("");

                }
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
                if (response.data.result ===
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
                }
            });
    }
    const handleSetData = (selected, key) => {
        if (!!orderErrors[key]) {
            let error = Object.assign({}, orderErrors);
            delete error[key];
            setOrderErrors(error);

        }
        console.log("selected", selected)
        // const selectedItem = data.find((item) => item.name === selectedName);
        setCreateOrder({
            ...createOrder,

            wholesalername: selected.value,
            emailid: selected && selected.emailid,
            wholesalerphonenumber: selected && selected.phonenumber,
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
                    else if (response.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                        setIsLoading(false)
                    }
                    else {
                        setIsLoading(false)
                        setSuccessOrder(true);
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
            if (response.result.data == "Invalid token or Expired") {
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

    const manageTab = (tab) => {
        let cls = "";
        if (tabActive[`tab${tab - 1}`]) {
            cls = "done";
        }
        return `${cls} ${currentActive === tab ? 'current' : 'disabled'}`;
    }

    console.log("places", places)
    return (
        <>
            <div id="layout-wrapper">
                <Header />
                <Sidebar />
                {isLoading ?
                    <Loader />
                    :
                    <div className="main-content">

                        <div className="page-content create_orders user-management">
                            <div className="container-fluid">
                                <div className="row mb-2">
                                    <div className="col-lg-12">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <h4 className="mb-0 card-title">Create Orders</h4>
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
                                                                    <span className="number " >1</span>Wholesaler Details
                                                                </a>
                                                            </li>
                                                            <li role="tab" className={manageTab(2)} aria-disabled={currentActive !== 2}>
                                                                <a id="basic-example-t-1" aria-controls="basic-example-p-1" onClick={() => handleClick(2)}>
                                                                    <span className="number">2</span>{selctionOrder === "spacovers" ? "Select Shape" : "Select Product"}
                                                                </a>
                                                            </li>
                                                            <li role="tab" className={manageTab(3)} aria-disabled={currentActive !== 3}>
                                                                <a id="basic-example-t-2" aria-controls="basic-example-p-2" onClick={() => handleClick(3)}>
                                                                    <span className="number">3</span>Product Specifications
                                                                </a>
                                                            </li>
                                                            {/* <li role="tab" className={manageTab(4)} aria-disabled={currentActive !== 4}>
                                                                <a id="basic-example-t-3" aria-controls="basic-example-p-3" onClick={() => handleClick(4)}>
                                                                    <span className="number">4</span>Review and Confirm
                                                                </a>
                                                            </li> */}
                                                        </ul>
                                                    </div>
                                                    <div className="content clearfix create-user-block">

                                                        <h3 id="basic-example-h-0" tabindex="-1" className={`title ${currentActive === 1 ? 'current' : ''}`}>Customer Details</h3>
                                                        <section id="basic-example-p-0" role="tabpanel" aria-labelledby="basic-example-h-0" className="body current" aria-hidden="false" style={{ display: currentActive === 1 ? 'block' : 'none' }}>
                                                        <div className="add_member_btn">
                                                        <button className="btn btn-primary add_member_btn" onClick={(e) => handleMember(e)}>
                                                            <span class="material-icons-outlined">add</span> Add Member
                                                                        </button>
                                                                        </div>
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label">Select Type</label>
                                                                        <select name="type" value={createOrder.type} className="colorselect capitalize form-control form-select" onChange={(e) => handleChange(e)}
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
                                                                            placeholder={createOrder.hasOwnProperty("type") ? "Select " + createOrder?.type :"Select"}
                                                                            name="wholesaler"
                                                                            onChange={(e) => handleSetData(e, "wholesalername")}
                                                                            options={data}
                                                                        // value={editUser && editUser.companyname && editUser.companyname.length > 0 ? editUser?.companyname?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                                                                        />
                                                                        <span className="errormsg" style={{
                                                                            fontWeight: 'bold',
                                                                            color: 'red',
                                                                        }}>{orderErrors.wholesalername}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label"> Phone Number</label>
                                                                        <input id="email" name="wholesalerphonenumber" type="tel" placeholder="Whole Saler Phone Number" className="form-control form-control" aria-invalid="false" value={createOrder.wholesalerphonenumber} maxLength="10" disabled />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label">Email Id</label>
                                                                        <input id="email" name="emailid" type="emailid" placeholder="emailid" className="form-control form-control" aria-invalid="false" value={createOrder.emailid} disabled />
                                                                        {/* <span className="errormsg" style={{
                                                                                            fontWeight: 'bold',
                                                                                            color: 'red',
                                                                                        }}>{orderErrors.emailid}</span> */}
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
                                                                        <input id="email" name="address1" type="text" placeholder="Address 1" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.billingaddress && createOrder.billingaddress.address1} disabled />

                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label">Address 2</label>
                                                                        <input id="email" name="address2" type="text" placeholder="Address 2" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.billingaddress && createOrder.billingaddress.address2} disabled />

                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label">State</label>
                                                                        <input id="email" name="state" type="text" placeholder="Address 2" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.billingaddress && createOrder.billingaddress.state} disabled />

                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label">PIN Code</label>
                                                                        <input id="email" name="pincode" type="text" placeholder="PIN Code" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.billingaddress && createOrder.billingaddress.pincode} disabled />

                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <h5 className="font-size-14">Delivery Address</h5>
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label">Address 1</label>
                                                                        <input id="email" name="deliveryaddress1" type="text" placeholder="Address 1" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.deliveryaddress && createOrder.deliveryaddress.address1} disabled />

                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label">Address 2</label>
                                                                        <input id="email" name="deliveryaddress2" type="text" placeholder="Address 2" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.deliveryaddress && createOrder.deliveryaddress.address2} disabled />

                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label">State</label>
                                                                        <input id="email" name="state" type="text" placeholder="Address 2" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.deliveryaddress && createOrder.deliveryaddress.state} disabled />

                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label">PIN Code</label>
                                                                        <input id="email" name="deliverypincode" type="text" placeholder="PIN Code" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.deliveryaddress && createOrder.deliveryaddress.pincode} onChange={handleChange} disabled />

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
                                                        <section id="basic-example-p-1" role="tabpanel" aria-labelledby="basic-example-h-1" className="body" aria-hidden="true" style={{ display: currentActive === 2 ? 'block' : 'none' }}>
                                                            <form>
                                                                <h5 className="font-size-14 mt-0">Select {selctionOrder === "spacovers" ? " Shape" : "Product"} to Continue</h5>
                                                                <div className="row" >
                                                                    {product && product.length > 0 && product?.filter?.((lookupData) => lookupData.producttype === selctionOrder).map(function (item, i) {
                                                                        return (
                                                                            <div className="col-md-2">

                                                                                <div className="card">
                                                                                    <div className="card-body">
                                                                                        <div className="product-img position-relative">
                                                                                            <img onClick={(e) => handleNext2(e, item)}
                                                                                                name="productshape" value={createOrder.productshape}
                                                                                                src={`${image}${item && item?.images && item?.images[0]?.path}`}
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
                                                                    {/* */}

                                                                </div>
                                                            </form>
                                                        </section>
                                                        <h3 id="basic-example-h-2" tabindex="-1" className={`title ${currentActive === 3 ? 'current' : ''}`}>Product Specifications</h3>
                                                        <section id="basic-example-p-2" role="tabpanel" aria-labelledby="basic-example-h-2" className="body current Confirm" aria-hidden="true" style={{ display: currentActive === 3 ? 'block' : 'none' }} >
                                                            {selctionOrder === "spacovers" ?
                                                                <form>
                                                                    <h5 className="font-size-14 mt-0">Product Specifications</h5>
                                                                    <div className="prdct_spfn">
                                                                        <div className="prdct_spfn_form">
                                                                            <div className="d-flex mb-3 input-field align-items-center">
                                                                                <label className="form-label form-label col-md-2">P.O Number</label>
                                                                                <input id="email" name="ponumber" type="tel" placeholder="Enter Value" className="form-control form-control col-md-10" aria-invalid="false" onChange={(e) => handleChange(e)} value={createOrder && createOrder.productspecification && createOrder.productspecification.ponumber} />
                                                                                {/* <span className="errormsg" style={{
                                                                                     fontWeight: 'bold',
                                                                                     color: 'red',
                                                                                 }}>{orderErrors.tiedown}</span> */}
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
                                                                                    {/* <button className="btn bootstrap-touchspin-up " type="button" onClick={handleDecrement}>-</button> */}
                                                                                    <input type="tel" maxLength="3" name="quantity" className="form-control" onChange={(e) => handleChange(e)} value={createOrder && createOrder.productspecification.quantity === 0 ? 0 : createOrder.productspecification.quantity} onFocus={() => setCreateOrder({ ...createOrder, productspecification: { ...createOrder.productspecification, quantity: '' } })} />

                                                                                    {/* <button className="btn bootstrap-touchspin-down " type="button" onClick={(e) => handleIncrement(e, createOrder.productspecification.quantity + 1)}>+</button> */}
                                                                                </div>
                                                                                <span className="errormsg" style={{
                                                                                    fontWeight: 'bold',
                                                                                    color: 'red',
                                                                                }}>{orderErrors.quantity}</span>
                                                                            </div>

                                                                            <div className="d-flex mb-3 input-field align-items-center">
                                                                                <label className="form-label form-label col-md-2">Additional Instructions</label>
                                                                                <textarea className="form-control" name='additionalinstructions' id="exampleFormControlTextarea1" placeholder="Add additional Instructions" rows="3" onChange={(e) => handleChange(e)} value={createOrder && createOrder.productspecification && createOrder.productspecification.additionalinstructions}></textarea>
                                                                                {/* <span className="errormsg" style={{
                                                                                     fontWeight: 'bold',
                                                                                     color: 'red',
                                                                                 }}>{orderErrors.additionalinstructions}</span> */}
                                                                            </div>

                                                                            <div className="d-flex mb-3 input-field align-items-center">
                                                                                <div className="col-md-2"></div>
                                                                                <div className="col-md-10">
                                                                                    {/* <a className="btn btn-primary" onClick={(e) => handleOrderReview(e)}>Create and Done</a> */}
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
                                                                                            <input type="tel" maxLength="3" name="quantity" className="form-control" onChange={(e) => handleChange(e)} value={createOrder && createOrder.productspecification.quantity === 0 ? 0 : createOrder.productspecification.quantity} onFocus={() => setCreateOrder({ ...createOrder, productspecification: { ...createOrder.productspecification, quantity: '' } })} />
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

                                                                        {/* <a className="btn btn-primary" onClick={(e) => handleOrderReview2(e)}>Create and Done</a> */}
                                                                       
                                                                        <a className="btn btn-primary"  onClick={(e) => handleOrderCreate(e)}>{btnLoader ? (<img src="https://spacovers.imgix.net/spacoversdev/common/images/rotate_right.svg" className="loading-icon" />) : null}Create and Done</a>
                                                                    </div>
                                                                </>}

                                                        </section>


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
                                                                            <td className="col4">{editCustomer1 ? <button className="btn btn-primary customerbtn" onClick={(e) => handleUpdateCustomer(e)}>Update Customer</button> : <button className="btn btn-primary customerbtn" onClick={(e) => handleAddCustomer1(e)}>Add Customer</button>}</td>

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
                                                <h4 className="mb-2 card-title">{id == undefined ? "ADD MEMBER" : "EDIT MEMBER"}</h4>
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
                <SweetAlert show={successOrder}
                    custom
                    confirmBtnText="ok"
                    confirmBtnBsStyle="primary"
                    title={"Order Added successfully"}
                    onConfirm={e => onConfirm2()}
                />
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
                                <button onClick={handleDeleteCustomer} className="fill_btn yellow-gradient" data-bs-toggle="modal" data-bs-target="#recommendModal" >Yes, Delete</button>
                            </div>
                        </div>
                    </div>

                </Modal>
            </div >


        </>
    );
};

export default CreateOrders;
