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
import SweetAlert from 'react-bootstrap-sweetalert';
import TableLoader from "../../components/tableLoader";
import SessionPopup from "../SessionPopup"
import Modal from 'react-bootstrap/Modal';
import moment from "moment";
import $ from "jquery";
import { useReactToPrint } from 'react-to-print';
import Loader from "../../components/loader";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import Footer from "../../components/dashboard/footer";
import GoogleMap from "../googlemap";

let { lambda, appname } = window.app;


const EditOrder = () => {
    let { id } = useParams();
    const [checkStatus, setCheckStatus] = useState(false);
    const [currentActive, setCurrentActive] = useState(1);
    const [createOrder, setCreateOrder] = useState({ productspecification: { quantity: 0 } })
    const [user, setUser] = useState("");
    const inputRef = useRef(null);
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
    const [invalidContent, setInvalidContent] = useState(false);
    const [image, setImg] = useState("");
    const [custid, setCustId] = useState(0);
    const [price, setPrice] = useState(0);
    const [customerObj, setCustomerObj] = useState([])
    const [customerInfo, setCustomerInfo] = useState([])
    const [success, setSuccess] = useState(false);
    const [editCustomer, setEditCustomer] = useState(false);
    const [showError, setShowError] = useState(false);
    const [custError, setCustError] = useState("");
    const [customerselectedObj, setCustomerSelectedObj] = useState({})
    const history = useHistory();
    const [btnLoader, setBtnLoader] = useState(false);
    const [places, setPlaces] = useState([]);
    const [edit, setEdit] = useState(false);
    const [option, setOption] = useState(false);
    const [deleteid, setDeleteId] = useState("");
    const [isdelete, setIsDelete] = useState(false);
    const [searchInput, setSearchInput] = useState('');
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
    const [saved, setSaved] = useState(false);
    const { searchedFlag, setSearchedFlag, setUserSearch, isLoading, setIsLoading, userData, sortTableAlpha, arrow, setSelectedOptions, data, setData, rowsPerPage, setRowsPerPage, currentPageNew, setCurrentPage, lookUpType, setlookUpType, lookupsearch, setLookupSearch, route, setRoute, usePrevious, sortedColumn, setSortedColumn, sortDirection, setSortDirection, setActiveMenuId, GetTimeActivity, selctionOrder, setSelectionOrder } = useContext(contentContext);


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
        getOrder();
        getWorkshops();
        userActivity();

    }, []);

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
                    <span className="material-icons">summarize</span>
                    <p className="form-check font-size-16">
                        No customers were found
                    </p>
                </div>
            </div>
        );
    };
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
            }
        });
        setOption(true)
    };

    const userActivity = () => {
        let path = window.location.pathname.split("/");
        const pageName = path[path.length - 1];
        var presentTime = moment();
        let payload;

        payload = {
            "userid": localStorage.getItem("userId"),
            "pagename": "EDITORDERS",
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
                    const cuttingUsers = result.filter((item) => item.department === 'Cutting' && item.type === "CUTTING");
                    setCuttingUsers(cuttingUsers)
                    const sewingUsers = result.filter((item) => item.department === 'Sewing' && item.type === "SEWING");
                    setSewingUsers(sewingUsers)

                }
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
    console.log("workshopinfo", workshopinfo)


    const addHtmlCodeCutting = () => {
        const isValid = formvalidationCutting(cuttingCounter - 1)

        if (isValid) {


            setCuttingCounter(cuttingCounter + 1);

        }
    };

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
                            {cuttingUsers && cuttingUsers.length > 0 && cuttingUsers.map((task, i) => {
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

            const sumOfValues = cuttinginfo.reduce((acc, obj) => {
                const valueAsNumber = parseFloat(obj.cuttingQuantity) || 0;
                return acc + valueAsNumber;
            }, 0);

            if (e.target.value) {
                var total = sumOfValues + parseInt(e.target.value)
            } else {
                var total = 0;
            }
            if (total <= parseInt(createOrder.productspecification.quantity)) {
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
                            {sewingUsers && sewingUsers.length > 0 && sewingUsers.map((task, i) => {
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
        if (e.target.name === "sewingQuantity") {
            const sumOfValues = sewinginfo.reduce((acc, obj) => {
                const valueAsNumber = parseFloat(obj.sewingQuantity) || 0;
                return acc + valueAsNumber;
            }, 0);
            if (e.target.value) {
                var total = sumOfValues + parseInt(e.target.value)
            } else {
                var total = 0;
            }
            console.log("total--->", total)
            if (total <= parseInt(createOrder.productspecification.quantity)) {
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
        const sumOfValues = sewinginfo.reduce((acc, obj) => {
            const valueAsNumber = parseFloat(obj.sewingQuantity) || 0;
            return acc + valueAsNumber;
        }, 0);
        if (sumOfValues < parseInt(createOrder.productspecification.quantity)) {
            return true;
        } else {
            return false;
        }
    }
    const handleCheckCutting = () => {
        const sumOfValues = cuttinginfo.reduce((acc, obj) => {
            const valueAsNumber = parseFloat(obj.cuttingQuantity) || 0;
            return acc + valueAsNumber;
        }, 0);
        if (sumOfValues < parseInt(createOrder.productspecification.quantity)) {
            return true;
        } else {
            return false;
        }
    }
    console.log("sewinginfo", sewinginfo);

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

    const handleSearchInputChange = (event) => {
        setCustError("")
        if (edit) {
            if (option === false) {
                setCustomerObj({ ...customerObj, customeraddress: event.target.value })
            } else {
                setCustomerObj({ ...customerObj, customeraddress: places[0]?.formatted_address })
            }
        }
        setSearchInput(event.target.value);

    };

    console.log("palces", places)
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
                setTabActive({ ...tmpTabActive, tab0: true, tab1: true });

            }
        }
        else if (num === 4) {
            let isValid;
            if (selctionOrder === "spacovers")
                isValid = formvalidationReview();
            else
                isValid = formvalidationReview2();
            let tab2 = false;
            if (isValid) {
                setCurrentActive(4);
                setTabActive({ ...tmpTabActive, tab0: true, tab1: true, tab2: true });
                tab2 = true;

            }
            //  setTabActive({ ...tmpTabActive, tab2: tab2,tab0:tab0,tab1:tab1 });

        }
        else if (num === 5) {
            setCurrentActive(5)
            setTabActive({ ...tmpTabActive, tab0: true, tab1: true, tab2: true, tab3: true });

        }


    };

    const handleDelete = (e, id) => {
        setDeleteId(id);
        setIsDelete(true);
    }

    function onCancel() {
        setIsDelete(false);
    }

    const handleDeleteCustomer = (e) => {
        console.log("id", id);
        const newArray = customerInfo.filter(obj => obj.id !== deleteid);
        setCustomerInfo(newArray);
        setIsDelete(false);
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
        if (!createOrder.productspecification?.tiedownlocation || createOrder.productspecification?.tiedownlocation === "") {
            errors.tiedownlocation = "Please select tiedownlocation"

            formIsValid = false;
        }
        if (createOrder.productspecification?.tiedownlocation === "Custom") {
            if (!createOrder.productspecification?.tiedownlocationlength || createOrder.productspecification?.tiedownlocationlength === "") {
                errors.tiedownlocationlength = "Please select tiedownlocation length"
                formIsValid = false;
            }
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

        if (!createOrder.productspecification?.quantity || createOrder.productspecification?.quantity === "") {
            errors.quantity = "Enter quantity"

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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!createOrder.wholesalername || createOrder.wholesalername.trim() === "") {
            errors.wholesalername = " Please select Wholesaler Name";
            setTimeout(function () { setOrderErrors("") }, 3000);
            formIsValid = false;
        }
        if (!createOrder.emailid || createOrder.emailid.trim() === "") {
            errors.emailid = "Please Enter Email";
            setTimeout(function () { setOrderErrors("") }, 3000);
            formIsValid = false;
          } else if (!emailRegex.test(createOrder.emailid.trim())) {
            errors.emailid = "Please Enter a Valid Email";
            setTimeout(function () { setOrderErrors("") }, 3000);
            formIsValid = false;
          }
        if (!createOrder.billingaddress?.address1 || createOrder.billingaddress?.address1.trim() === "") {
            errors.address1 = "Please Enter address";

            formIsValid = false;
        }
        if (!createOrder.billingaddress?.address2 || createOrder.billingaddress?.address2.trim() === "") {
            errors.address2 = "Please Enter address2";
            formIsValid = false;
        }
        if (!createOrder.billingaddress?.state || createOrder.billingaddress?.state.trim() === "") {
            errors.state = "Please select state";

            formIsValid = false;
        }
        if (!createOrder.billingaddress?.pincode || createOrder.billingaddress?.pincode.trim() === "") {
            errors.pincode = "Please select pincode";

            formIsValid = false;
        }
        if (!createOrder.deliveryaddress?.address1 || createOrder.deliveryaddress?.address1.trim() === "") {
            errors.deliveryaddress1 = "Please select address1";

            formIsValid = false;
        }
        if (!createOrder.deliveryaddress?.address2 || createOrder.deliveryaddress?.address2.trim() === "") {
            errors.deliveryaddress2 = "Please select address2";

            formIsValid = false;
        }
        if (!createOrder.deliveryaddress?.state || createOrder.deliveryaddress?.state.trim() === "") {
            errors.deliverystate = "Please select state";

            formIsValid = false;
        }
        if (!createOrder.deliveryaddress?.pincode || createOrder.deliveryaddress?.pincode.trim() === "") {
            errors.deliverypincode = "Please select pincode";

            formIsValid = false;
        }
        setTabActive({ ...tmpTabActive, tab0: tab0 });
        setOrderErrors(errors);

        return formIsValid;
    };


    const formvalidationSave = () => {
        let formIsValid = true;
        const errors = {};

        if (workshopinfo && workshopinfo.length <= 0) {
            errors.workshop = "Please select Workshop Station";
            formIsValid = false;
        }
        const sumOfValues = cuttinginfo.reduce((acc, obj) => {
            const valueAsNumber = parseFloat(obj.cuttingQuantity) || 0;
            return acc + valueAsNumber;
        }, 0);

        console.log("sumOfValues", sumOfValues);
        if (sumOfValues === parseInt(createOrder.productspecification.quantity)) {

        } else {
            errors.cuttingQuantity = "Please Enter correct quantity";
            formIsValid = false;
        }
        const totalSumOfValues = sewinginfo.reduce((acc, obj) => {
            const valueAsNumber = parseFloat(obj.sewingQuantity) || 0;
            return acc + valueAsNumber;
        }, 0);
        console.log("totalSumOfValues", totalSumOfValues);
        if (totalSumOfValues === parseInt(createOrder.productspecification.quantity)) {

        } else {
            errors.sewingQuantity = "Please Enter correct quantity";
            formIsValid = false;
        }
        console.log("product------->", typeof (parseInt(createOrder.productspecification.quantity)))
        if (cuttinginfo && cuttinginfo.length <= 0) {
            errors.cutting = "Please select Cutting Station";
            formIsValid = false;
        }
        if (sewinginfo && sewinginfo.length <= 0) {
            errors.sewing = "Please select Sewing Station";
            formIsValid = false;
        }

        const doesKeyExist = cuttinginfo.some((item) => item.hasOwnProperty("cuttingusername"));
        if (doesKeyExist === false) {
            errors.cutting = "Please select Cutting Station";
            formIsValid = false;
        }

        const doesKeyExist1 = sewinginfo.some((item) => item.hasOwnProperty("sewingusername"));
        if (doesKeyExist1 === false) {
            errors.sewing = "Please select Sewing Station";
            formIsValid = false;
        }

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
        let tmpTabActive = { ...tabActive };
        let price = item.price * createOrder?.productspecification?.quantity
        setCreateOrder({ ...createOrder, productname: item.productname, sku: item.sku, productimage: item.images[0].path, totalprice: price ,dimensionimage: item && item.images && item.images[1] ? item.images[1].path : "" });
        setPrice(item.price)
        setCurrentActive(3);
        setTabActive({ ...tmpTabActive, tab1: true });


    }
    const formvalidationReview2 = () => {
        let formIsValid = true;
        const errors = {};
        // if (!createOrder.productspecification?.additionalinstructions || createOrder.productspecification?.additionalinstructions === "") {
        //     errors.additionalinstructions = "Enter additionalinstructions"

        //     formIsValid = false;
        // }
        if (!createOrder.productspecification?.quantity || createOrder.productspecification?.quantity === "") {
            errors.quantity = "Enter quantity"

            formIsValid = false;
        }
        setOrderErrors(errors);

        return formIsValid;
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
    const handleOrderCreate = (e, value) => {
        console.log("val", value)
        let isValid;
        if (value === "inUpdate") {
            isValid = formvalidation();
            console.log("if excuted")

        } else if (value === "save") {
            isValid = formvalidationSave();
        } else if (value === "approve") {
            if (selctionOrder === "spacovers") {
                isValid = formvalidationSave();
            } else {
                isValid = checkCustomer();
            }
        } else {
            console.log("else excuted")
            isValid = checkCustomer();
        }
        console.log("isValid", isValid)
        if (isValid) {
            setBtnLoader(true)

            let addObj
            if (value === "save" || value === "approve") {
                addObj = { ...createOrder, customerinfo: customerInfo, ordertype: selctionOrder, orderstatus: "offline", workshopinfo: workshopinfo, cuttinginfo: cuttinginfo, sewinginfo: sewinginfo }
            } else {
                addObj = { ...createOrder, customerinfo: customerInfo, ordertype: selctionOrder, orderstatus: "offline" }
            }
            let urlLink;
            if (value === "approve") {
                if (selctionOrder !== "spacovers") {
                    urlLink = lambda + "/updateorder?appname=" + appname + "&token=" + localStorage.getItem("token") + "&userid=" + localStorage.getItem("userId") + '&orderid=' + id + "&statusUpdate=DELIVERYSTARTED"
                } else {
                    urlLink = lambda + "/updateorder?appname=" + appname + "&token=" + localStorage.getItem("token") + "&userid=" + localStorage.getItem("userId") + '&orderid=' + id + "&approved=approved"
                }
            } else {
                urlLink = lambda + "/updateorder?appname=" + appname + "&token=" + localStorage.getItem("token") + "&userid=" + localStorage.getItem("userId") + '&orderid=' + id
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
                            setBtnLoader(false)
                            if (value === "approve") {
                                setApprove(true)
                            } else if (value === "save") {
                                setSaved(true)
                            } else {
                                setSuccess(true)
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
    function onConfirm() {
        setSuccess(false);
        // history.push("/orders")
    };
    function onConfirm1() {
        setShowError(false);
    };




    const handleChangeCustomer = (e) => {
        setCustError("")
        if (e.target.name === "quantitypercustomer") {
            const numericValue = e.target.value.replace(/\D/g, '');
            setCustomerObj({ ...customerObj, [e.target.name]: numericValue })
        } else {
            setCustomerObj({ ...customerObj, [e.target.name]: e.target.value })
        }
    }
    const handleAddCustomer = (e) => {


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
            setCustError("Product quantity and customers total quantity is mismatched")
            setTimeout(function () { setCustError("") }, 3000);
        } else {
            const newId = customerInfo.length + 1;
            const newObject = { id: newId, customername: customerObj.customername, customeraddress: places[0].formatted_address, quantitypercustomer: customerObj.quantitypercustomer, };
            setCustomerInfo(prevState => [...prevState, newObject]);
            setCustomerObj({ ...customerObj, customername: "", customeraddress: "", quantitypercustomer: "" })
            // setSearchInput("");
            setPlaces([])
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        }
    }
    const getOrder = (e) => {
        GetTimeActivity()
        setIsLoading(true)
        axios.get(lambda + '/order?appname=' + appname + '&userId=' + localStorage.getItem('userId') + '&token=' + localStorage.getItem('token') + '&orderid=' + id)
            .then(function (response) {
                console.log("response---->", response.data.result[0]);
                if (response.data.result === "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                }
                else {
                    if (response.data.result.length > 0) {
                        let result = response?.data?.result[0]
                        setCreateOrder(response.data.result[0]);
                        setCustomerInfo(response?.data?.result[0]?.customerinfo
                        );
                        if (result?.sewinginfo && result?.sewinginfo.length > 0) {
                            setSewingInfo(result?.sewinginfo);
                            setSewingCounter(result?.sewinginfo.length)
                        }
                        if (result?.cuttinginfo && result?.cuttinginfo.length > 0) {
                            setCuttingInfo(result?.cuttinginfo);
                            setCuttingCounter(result?.cuttinginfo.length)
                        }
                        if (result?.workshopinfo && result?.workshopinfo.length > 0) {
                            setWorkshopInfo(result?.workshopinfo);
                        }
                        if (response?.data?.result[0]?.workshopinfo) {
                            const filteredArray = response?.data?.result[0]?.workshopinfo.map((item) => item.workshopid);
                            getUsers(filteredArray)
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
    const handleEditCustomer = (e, id) => {
        setEdit(true)
        setCustId(id)
        setEditCustomer(true);
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
            setTimeout(function () { setCustError("") }, 3000);

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
                                return customerObj;
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


    const handleChange = (e) => {
        if (!!orderErrors[e.target.name]) {
            let error = Object.assign({}, orderErrors);
            delete error[e.target.name];
            setOrderErrors(error);

        }
        const numericValue = e.target.value.replace(/\D/g, '');
        if (e.target.name === "wholesalername") {
            setCreateOrder({ ...createOrder, [e.target.name]: e.target.value });

        }
       
        if (e.target.name === "type") {
            if (id) {
                setCheckStatus(true);
            }
            setCreateOrder({
                ...createOrder,
                [e.target.name]: e.target.value,
            });
            // getWholesaler(type)
        }
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
                                    } else if (e.target.name === "ponumber") {
                                        setCreateOrder({
                                            ...createOrder,
                                            productspecification: {
                                                ...createOrder.productspecification,
                                                ponumber: numericValue,
                                            },
                                        })
                                    } else
                                        if (e.target.name === "covercolor") {
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
                                        else if (e.target.name === "tiedownlocation") {
                                            if (e.target.value === "Custom") {

                                                setCreateOrder({
                                                    ...createOrder,
                                                    productspecification: {
                                                        ...createOrder.productspecification,
                                                        tiedownlocation: e.target.value,
                                                    },
                                                });
                                            } else {
                                                if (createOrder && createOrder.productspecification && createOrder.productspecification.tiedownlocationlength) {
                                                    // Use delete to remove the key and its value
                                                    delete createOrder.productspecification.tiedownlocationlength;
                                                    delete orderErrors["tiedownlocationlength"]
                                                }
                                                setCreateOrder({
                                                    ...createOrder,
                                                    productspecification: {
                                                        ...createOrder.productspecification,
                                                        tiedownlocation: e.target.value,
                                                    },
                                                });

                                            }
                                        }
                                        else if (e.target.name === "tiedownlocationlength") {
                                            setCreateOrder({
                                                ...createOrder,
                                                productspecification: {
                                                    ...createOrder.productspecification,
                                                    tiedownlocationlength: e.target.value,
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
    console.log("cc------>", createOrder)
    console.log("cobj------>", customerObj)



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
                if (response.data.result === "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {

                    setProduct(response.data.result.data)
                    console.log("pp------>", response.data.result.data)

                    setIsLoading(false);
                    // setLookupSearch("");

                }
            });
    }
    const getWholesaler = (e) => {
        GetTimeActivity()
        setIsLoading(true)
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/customers?appname=' + appname + "&token=" + token + "&status=ACTIVE",
        })
            .then(function (response) {
                console.log("response", response);
                if (response.data.result === "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setUser(response.data.result);
                    //  setData(response.data.result.data);
                    setIsLoading(false);
                    setUserSearch("");
                    setSearchedFlag(false);
                    const arrOfObj = response.data.result.data.map((item) => {
                        return { value: item.name, label: item.name, phonenumber: item.phonenumber,  emailid: item.emailid, customeraddress: item.customeraddress, billingaddress: item.billingaddress };
                    });
                    setData(arrOfObj);
                }
            });
    }
    const handleSetData = (selected) => {
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

    const handleCheckBox = (e) => {
        setCheckBox(e.target.checked);
        if (e.target.checked === true) {
            delete orderErrors.billingaddress1;
            delete orderErrors.billingaddress2;
            delete orderErrors.billingstate;
            delete orderErrors.billingpincode;
            setCreateOrder({
                ...createOrder,
                deliveryaddress: {
                    ...createOrder.deliveryaddress,
                    address1: createOrder.billingaddress.address1,
                    address2: createOrder.billingaddress.address2,
                    state: createOrder.billingaddress.state,
                    pincode: createOrder.billingaddress.pincode,
                },

            });
        } else {
            setCreateOrder({
                ...createOrder,
                deliveryaddress: {
                    ...createOrder.deliveryaddress,
                    address1: "",
                    address2: "",
                    state: "",
                    pincode: "",
                },

            });
        }

    };
    //  const handleIncrement = (e) => {
    //      console.log(createOrder?.productspecification?.quantity, price)
    //      const newCreateOrder = { ...createOrder };

    //      const newSpecifications = { ...newCreateOrder.productspecification };
    //      newSpecifications.quantity = parseInt(createOrder?.productspecification?.quantity) + 1;


    //      newCreateOrder.totalprice = (parseInt(createOrder?.productspecification?.quantity) + 1) * price;


    //      newCreateOrder.productspecification = newSpecifications;
    //      setCreateOrder(newCreateOrder);


    //  }

    //  const handleDecrement = (e) => {
    //      setCreateOrder({
    //          ...createOrder,
    //          productspecification: {
    //              ...createOrder.productspecification,
    //              quantity: parseInt(createOrder?.productspecification?.quantity) - 1,
    //          },
    //          totalprice: (parseInt(createOrder?.productspecification?.quantity) - 1) * price
    //      });
    //  }

    const manageTab = (tab) => {
        let cls = "";
        if (tabActive[`tab${tab - 1}`]) {
            cls = "done";
        }
        return `${cls} ${currentActive === tab ? 'current' : 'disabled'}`;
    }


    return (
        <>
            <div id="layout-wrapper">
                <Header />
                <Sidebar />
                <div className="main-content">
                    {isLoading ?
                        <Loader />
                        :
                        <div className="page-content create_orders user-management">
                            <div className="container-fluid">
                                <div className="row mb-2">
                                    <div className="col-lg-12">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <h4 className="mb-0 card-title">Edit Orders</h4>
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
                                    {Object.keys(createOrder).length > 0 || (id === undefined) ?
                                        <>
                                            <div className="col-xl-12">

                                                <div className="card orders_card">
                                                    <div className="card-body">

                                                        <div id="basic-example" role="application" className="wizard clearfi create-user">
                                                            <div className="steps clearfix">
                                                                <ul role="tablist">

                                                                    <>
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
                                                                        <li role="tab" className={manageTab(4)} aria-disabled={currentActive !== 4}>
                                                                            <a id="basic-example-t-3" aria-controls="basic-example-p-3" onClick={() => handleClick(4)}>
                                                                                <span className="number">4</span>Review and Confirm
                                                                            </a>
                                                                        </li>
                                                                        {(userData.type === "ADMIN" || userData.type === "SUPERVISIOR") ? <li role="tab" className={manageTab(5)} aria-disabled={currentActive !== 5}>
                                                                            <a id="basic-example-t-3" aria-controls="basic-example-p-3" onClick={() => handleClick(5)}>
                                                                                <span className="number">5</span>Approve
                                                                            </a>
                                                                        </li> : ""}

                                                                    </>

                                                                </ul>
                                                            </div>
                                                            <div className="content clearfix create-user-block">


                                                                {createOrder.status === "INPROGRESS" ? (
                                                                    <>
                                                                        <h3 id="basic-example-h-0" tabindex="-1" className={`title ${currentActive === 1 ? 'current' : ''}`}>Wholesaler Details</h3>
                                                                        <section id="basic-example-p-0" role="tabpanel" aria-labelledby="basic-example-h-0" className="body current" aria-hidden="false" style={{ display: currentActive === 1 ? 'block' : 'none' }}>

                                                                            <div className="row">
                                                                            <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label">Select Type</label>
                                                                        <select name="type" value={createOrder.type} className="colorselect capitalize form-control form-select" onChange={(e) => handleChange(e)}
                                                                        >
                                                                            <option value="">Select type</option>
                                                                            <option value="Wholesaler">Wholesaler</option>
                                                                            <option value="Retailer">Retailer</option>
                                                                            <option value="Customer">Customer</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3 input-field">
                                                                                        <label className="form-label form-label">Wholesaler Name</label>
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
                                                                                            placeholder='wholesaler Name'
                                                                                            name="wholesalername"
                                                                                            onChange={(e) => handleSetData(e)}
                                                                                            options={data}
                                                                                            value={createOrder ? { label: createOrder.wholesalername, value: createOrder.wholesalername } : []}
                                                                                            isDisabled={true}
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
                                                                                        <input id="email" name="wholesalerphonenumber" type="tel" placeholder="Whole Saler Phone Number" className="form-control form-control" aria-invalid="false" value={createOrder.wholesalerphonenumber} maxLength="10" onChange={(e) => handleChange(e)} />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3 input-field">
                                                                                        <label className="form-label form-label">Email Id</label>
                                                                                        <input id="email" name="emailid" type="emailid" placeholder="emailid" className="form-control form-control" aria-invalid="false" value={createOrder.emailid} onChange={(e) => handleChange(e)}  />
                                                                                        <span className="errormsg" style={{
                                                                                            fontWeight: 'bold',
                                                                                            color: 'red',
                                                                                        }}>{orderErrors.emailid}</span>
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
                                                                                        <input id="email" name="address1" type="text" placeholder="Address 1" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.billingaddress && createOrder.billingaddress.address1} onChange={(e) => handleChange(e)} />
                                                                                        <span className="errormsg" style={{
                                                                                            fontWeight: 'bold',
                                                                                            color: 'red',
                                                                                        }}>{orderErrors.address1}</span>

                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3 input-field">
                                                                                        <label className="form-label form-label">Address 2</label>
                                                                                        <input id="email" name="address2" type="text" placeholder="Address 2" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.billingaddress && createOrder.billingaddress.address2} onChange={(e) => handleChange(e)} />
                                                                                        <span className="errormsg" style={{
                                                                                            fontWeight: 'bold',
                                                                                            color: 'red',
                                                                                        }}>{orderErrors.address2}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3 input-field">
                                                                                        <label className="form-label form-label">State</label>

                                                                                        <select name="state" className="form-select" aria-label="Default select example" value={createOrder && createOrder.billingaddress && createOrder.billingaddress.state} onChange={(e) => handleChange(e)}>
                                                                                            <option value="">Select state</option>
                                                                                            {lookup?.map?.((item, i) => {
                                                                                                return (
                                                                                                    <option key={i} value={item.name}>{item.name}</option>
                                                                                                )
                                                                                            })}
                                                                                        </select>
                                                                                        <span className="errormsg" style={{
                                                                                            fontWeight: 'bold',
                                                                                            color: 'red',
                                                                                        }}>{orderErrors.state}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3 input-field">
                                                                                        <label className="form-label form-label">ZIP Code</label>
                                                                                        <input id="email" name="pincode" type="text" placeholder="Zip Code" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.billingaddress && createOrder.billingaddress.pincode} onChange={(e) => handleChange(e)} />
                                                                                        <span className="errormsg" style={{
                                                                                            fontWeight: 'bold',
                                                                                            color: 'red',
                                                                                        }}>{orderErrors.pincdoe}</span>

                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {/* <div className="d-flex align-items-center mt-3 mb-2">
                                                                                 <h5 className="font-size-14">Delivery Address</h5>
                                                                                 <div className="d-flex justify-content-center align-items-center ms-4"> <label className="switch"><input type="checkbox"
                                                                                     id="flexCheckDefault"
                                                                                     name="checkboxinput"
                                                                                     onClick={(e) => handleCheckBox(e)} /><span className="slider round" disabled ></span></label>
                                                                                     <p>Same as Billing Address</p>
                                                                                 </div>
                                                                             </div> */}
                                                                            <div className="row">
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3 input-field">
                                                                                        <label className="form-label form-label">Address 1</label>
                                                                                        <input id="email" name="deliveryaddress1" type="text" placeholder="Address 1" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.deliveryaddress && createOrder.deliveryaddress.address1} onChange={(e) => handleChange(e)} />
                                                                                        <span className="errormsg" style={{
                                                                                            fontWeight: 'bold',
                                                                                            color: 'red',
                                                                                        }}>{orderErrors.deliveryaddress1}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3 input-field">
                                                                                        <label className="form-label form-label">Address 2</label>
                                                                                        <input id="email" name="deliveryaddress2" type="text" placeholder="Address 2" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.deliveryaddress && createOrder.deliveryaddress.address2} onChange={(e) => handleChange(e)} />
                                                                                        <span className="errormsg" style={{
                                                                                            fontWeight: 'bold',
                                                                                            color: 'red',
                                                                                        }}>{orderErrors.deliveryaddress2}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3 input-field">
                                                                                        <label className="form-label form-label">State</label>
                                                                                        <select name="deliverystate" className="form-select" aria-label="Default select example" value={createOrder && createOrder.deliveryaddress && createOrder.deliveryaddress.state} onChange={(e) => handleChange(e)}>
                                                                                            <option value="">Select state</option>
                                                                                            {lookup?.map?.((item, i) => {
                                                                                                return (
                                                                                                    <option key={i} value={item.name}>{item.name}</option>
                                                                                                )
                                                                                            })}
                                                                                        </select>
                                                                                        <span className="errormsg" style={{
                                                                                            fontWeight: 'bold',
                                                                                            color: 'red',
                                                                                        }}>{orderErrors.deliverystate}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3 input-field">
                                                                                        <label className="form-label form-label">ZIP Code</label>
                                                                                        <input id="email" name="deliverypincode" type="text" placeholder="Zip Code" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.deliveryaddress && createOrder.deliveryaddress.pincode} onChange={(e) => handleChange(e)} />
                                                                                        <span className="errormsg" style={{
                                                                                            fontWeight: 'bold',
                                                                                            color: 'red',
                                                                                        }}>{orderErrors.deliverypincode}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            <div className="row">
                                                                                <div className="col-md-12 d-flex">

                                                                                    <button className="btn btn-primary" onClick={(e) => handleOrderCreate(e, "inUpdate")}>
                                                                                        Update
                                                                                    </button>





                                                                                    {/* {msg ? <span className="errormsg" style={{
                                                                               fontWeight: 'bold',
                                                                               color: 'green',
                                                                           }}>{msg}</span> : ""
                                                                           } */}
                                                                                </div>
                                                                            </div>

                                                                        </section>
                                                                    </>

                                                                ) : (
                                                                    <>
                                                                        <h3 id="basic-example-h-0" tabindex="-1" className={`title ${currentActive === 1 ? 'current' : ''}`}>Wholesalaer Details</h3>
                                                                        <section id="basic-example-p-0" role="tabpanel" aria-labelledby="basic-example-h-0" className="body current" aria-hidden="false" style={{ display: currentActive === 1 ? 'block' : 'none' }}>

                                                                            <div className="row">
                                                                            <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label">Select Type</label>
                                                                        <select name="type" value={createOrder.type} className="colorselect capitalize form-control form-select" onChange={(e) => handleChange(e)} disabled
                                                                        >
                                                                            <option value="">Select type</option>
                                                                            <option value="Wholesaler">Wholesaler</option>
                                                                            <option value="Retailer">Retailer</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3 input-field">
                                                                                        <label className="form-label form-label">Wholesaler Name</label>


                                                                                        <Select isMulti={false}
                                                                                            classNamePrefix="select wholesaler"
                                                                                            placeholder='wholesaler Name'
                                                                                            name="wholesalername"
                                                                                            onChange={(e) => handleSetData(e)}
                                                                                            options={data}
                                                                                            value={createOrder ? { label: createOrder.wholesalername, value: createOrder.wholesalername } : []}
                                                                                            isDisabled={true}
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
                                                                                        <input id="email" name="wholesalerphonenumber" type="tel" placeholder="Whole Saler Phone Number" className="form-control form-control" aria-invalid="false" value={createOrder.wholesalerphonenumber} maxLength="10" onChange={handleChange} />
                                                                                        
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3 input-field">
                                                                                        <label className="form-label form-label">Email Id</label>
                                                                                        <input id="email" name="emailid" type="emailid" placeholder="emailid" className="form-control form-control" aria-invalid="false" value={createOrder.emailid} onChange={(e) => handleChange(e)}  />
                                                                                        <span className="errormsg" style={{
                                                                                            fontWeight: 'bold',
                                                                                            color: 'red',
                                                                                        }}>{orderErrors.emailid}</span>
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
                                                                                        <input id="email" name="address1" type="text" placeholder="Address 1" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.billingaddress && createOrder.billingaddress.address1} onChange={handleChange} />
                                                                                        <span className="errormsg" style={{
                                                                                            fontWeight: 'bold',
                                                                                            color: 'red',
                                                                                        }}>{orderErrors.address1}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3 input-field">
                                                                                        <label className="form-label form-label">Address 2</label>
                                                                                        <input id="email" name="address2" type="text" placeholder="Address 2" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.billingaddress && createOrder.billingaddress.address2} onChange={handleChange} />
                                                                                        <span className="errormsg" style={{
                                                                                            fontWeight: 'bold',
                                                                                            color: 'red',
                                                                                        }}>{orderErrors.address2}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3 input-field">
                                                                                        <label className="form-label form-label">State</label>

                                                                                        <select name="state" className="form-select" aria-label="Default select example" value={createOrder && createOrder.billingaddress && createOrder.billingaddress.state} onChange={handleChange}>
                                                                                            <option value="">Select state</option>
                                                                                            {lookup
                                                                                                ?.filter?.((lookupData) => lookupData.type === "state")
                                                                                                .map?.((lookupData) => {
                                                                                                    return (
                                                                                                        <option value={lookupData.name}>{lookupData.name}</option>
                                                                                                    )
                                                                                                })}
                                                                                        </select>
                                                                                        <span className="errormsg" style={{
                                                                                            fontWeight: 'bold',
                                                                                            color: 'red',
                                                                                        }}>{orderErrors.state}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3 input-field">
                                                                                        <label className="form-label form-label">ZIP Code</label>
                                                                                        <input id="email" name="pincode" type="text" placeholder="ZIP Code" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.billingaddress && createOrder.billingaddress.pincode} onChange={handleChange} />
                                                                                        <span className="errormsg" style={{
                                                                                            fontWeight: 'bold',
                                                                                            color: 'red',
                                                                                        }}>{orderErrors.pinecode}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="d-flex align-items-center mt-3 mb-2">
                                                                                <h5 className="font-size-14">Delivery Address</h5>
                                                                                {/* <div className="d-flex justify-content-center align-items-center ms-4"> <label className="switch"><input type="checkbox"
                                                                                     id="flexCheckDefault"
                                                                                     name="checkboxinput"
                                                                                     onClick={(e) => handleCheckBox(e)} /><span className="slider round" disabled ></span></label>
                                                                                     <p>Same as Billing Address</p>
                                                                                 </div> */}
                                                                            </div>
                                                                            <div className="row">
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3 input-field">
                                                                                        <label className="form-label form-label">Address 1</label>
                                                                                        <input id="email" name="deliveryaddress1" type="text" placeholder="Address 1" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.deliveryaddress && createOrder.deliveryaddress.address1} onChange={handleChange} />
                                                                                        <span className="errormsg" style={{
                                                                                            fontWeight: 'bold',
                                                                                            color: 'red',
                                                                                        }}>{orderErrors.deliveryaddress1}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3 input-field">
                                                                                        <label className="form-label form-label">Address 2</label>
                                                                                        <input id="email" name="deliveryaddress2" type="text" placeholder="Address 2" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.deliveryaddress && createOrder.deliveryaddress.address2} onChange={handleChange} />
                                                                                        <span className="errormsg" style={{
                                                                                            fontWeight: 'bold',
                                                                                            color: 'red',
                                                                                        }}>{orderErrors.deliveryaddress2}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3 input-field">
                                                                                        <label className="form-label form-label">State</label>
                                                                                        <select name="deliverystate" className="form-select" aria-label="Default select example" value={createOrder && createOrder.deliveryaddress && createOrder.deliveryaddress.state} onChange={handleChange}>
                                                                                            <option value="">Select state</option>
                                                                                            {lookup
                                                                                                ?.filter?.((lookupData) => lookupData.type === "state")
                                                                                                .map?.((lookupData) => {
                                                                                                    return (
                                                                                                        <option value={lookupData.name}>{lookupData.name}</option>
                                                                                                    )
                                                                                                })}
                                                                                        </select>
                                                                                        <span className="errormsg" style={{
                                                                                            fontWeight: 'bold',
                                                                                            color: 'red',
                                                                                        }}>{orderErrors.deliverystate}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3 input-field">
                                                                                        <label className="form-label form-label">ZIP Code</label>
                                                                                        <input id="email" name="deliverypincode" type="text" placeholder="ZIP Code" className="form-control form-control" aria-invalid="false" value={createOrder && createOrder.deliveryaddress && createOrder.deliveryaddress.pincode} onChange={handleChange} />
                                                                                        <span className="errormsg" style={{
                                                                                            fontWeight: 'bold',
                                                                                            color: 'red',
                                                                                        }}>{orderErrors.deliverypincode}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            <div className="row">
                                                                                <div className="col-md-12 d-flex">
                                                                                    <button className="btn btn-primary" onClick={(e) => handleCreateOrder(e)}>
                                                                                        Next
                                                                                    </button>



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

                                                                                                <div className={item.productname === createOrder.productname ? "card selected" : "card"}>
                                                                                                    <div className="card-body">
                                                                                                        <div className="product-img position-relative">
                                                                                                            <img onClick={(e) => handleNext2(e, item)}
                                                                                                                name="productshape" value={createOrder.productshape}
                                                                                                                src={`${image}${item && item?.images && item?.images[0]?.path}`}
                                                                                                                alt=""
                                                                                                                className="img-fluid mx-auto d-block"
                                                                                                            // className={`img-fluid mx-auto d-block ${createOrder.productshape === item?.id ? 'selected' : ''}`}
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
                                                                                                <label className="form-label form-label col-md-2">Customer P.O Number</label>
                                                                                                <input id="email" name="ponumber" type="tel" placeholder="Enter Value" className="form-control form-control col-md-10" aria-invalid="false" onChange={(e) => handleChange(e)} value={createOrder && createOrder.productspecification && createOrder.productspecification.ponumber} />
                                                                                                {/* <span className="errormsg" style={{
                                                                                    fontWeight: 'bold',
                                                                                    color: 'red',
                                                                                }}>{orderErrors.tiedown}</span> */}
                                                                                            </div>
                                                                                            <div className="d-flex mb-3 input-field align-items-center">
                                                                                                <label className="form-label form-label col-md-2">Cover  Color<span className="required">*</span></label>

                                                                                                <select className="form-select" name="covercolor" onChange={handleChange} value={createOrder && createOrder.productspecification && createOrder.productspecification.covercolor}>
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
                                                                                                <select className="form-select" name="coverfold" value={createOrder && createOrder.productspecification && createOrder.productspecification.coverfold} onChange={handleChange}>
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
                                                                                                <input id="email" name="tiedown" type="text" placeholder="Enter Value" className="form-control form-control col-md-10" aria-invalid="false" onChange={handleChange} value={createOrder && createOrder.productspecification && createOrder.productspecification.tiedown} />
                                                                                                <span className="errormsg" style={{
                                                                                                    fontWeight: 'bold',
                                                                                                    color: 'red',
                                                                                                }}>{orderErrors.tiedown}</span>
                                                                                            </div>

                                                                                            <div className="d-flex mb-3 input-field align-items-center">
                                                                                                <label className="form-label form-label col-md-2">Tie Down Locations<span className="required">*</span></label>
                                                                                                <select className="form-select" name="tiedownlocation" onChange={handleChange} value={createOrder && createOrder.productspecification && createOrder.productspecification.tiedownlocation}>
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
                                                                                                }}>{orderErrors.tiedownlocation}</span>
                                                                                            </div>
                                                                                            {createOrder && createOrder.productspecification && createOrder.productspecification.tiedownlocation === "Custom" && <div className="d-flex mb-3 input-field align-items-center">
                                                                                                <label className="form-label form-label col-md-2">Tie Down Locations Length</label>
                                                                                                <input id="email" name="tiedownlocationlength" type="text" placeholder="Enter Length inches" className="form-control form-control col-md-10" aria-invalid="false" onChange={(e) => handleChange(e)} value={createOrder && createOrder.productspecification && createOrder.productspecification.tiedownlocationlength} />
                                                                                                <span className="errormsg" style={{
                                                                                                    fontWeight: 'bold',
                                                                                                    color: 'red',
                                                                                                }}>{orderErrors.tiedownlocationlength}</span>
                                                                                            </div>}

                                                                                            <div className="d-flex mb-3 input-field align-items-center">
                                                                                                <label className="form-label form-label col-md-2">Cover Skirt Length<span className="required">*</span></label>
                                                                                                <input id="email" name="coverskritlength" type="text" placeholder="Enter Length inches" className="form-control form-control col-md-10" aria-invalid="false" onChange={handleChange} value={createOrder && createOrder.productspecification && createOrder.productspecification.coverskritlength} />
                                                                                                <span className="errormsg" style={{
                                                                                                    fontWeight: 'bold',
                                                                                                    color: 'red',
                                                                                                }}>{orderErrors.coverskritlength}</span>
                                                                                            </div>

                                                                                            <div className="d-flex mb-3 input-field align-items-center">
                                                                                                <label className="form-label form-label col-md-2">Skirt Options<span className="required">*</span></label>
                                                                                                <select className="form-select" name='skirtoption' onChange={handleChange} value={createOrder && createOrder.productspecification && createOrder.productspecification.skirtoption}>
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
                                                                                                <select className="form-select" name="foamdensity" onChange={handleChange} value={createOrder && createOrder.productspecification && createOrder.productspecification.foamdensity}>
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
                                                                                                <select className="form-select" name="upgrades" onChange={handleChange} value={createOrder && createOrder.productspecification && createOrder.productspecification.upgrades}>
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
                                                                                                <input id="email" name="dimensionA" type="text" placeholder="Enter Value" className="form-control form-control col-md-10" aria-invalid="false" onChange={handleChange} value={createOrder && createOrder.productspecification && createOrder.productspecification.dimensionA} />
                                                                                                <span className="errormsg" style={{
                                                                                                    fontWeight: 'bold',
                                                                                                    color: 'red',
                                                                                                }}>{orderErrors.dimensionA}</span>
                                                                                            </div>

                                                                                            <div className="d-flex mb-3 input-field align-items-center">
                                                                                                <label className="form-label form-label col-md-2">Dimension B<span className="required">*</span></label>
                                                                                                <input id="email" name="dimensionB" type="text" placeholder="Enter Value" className="form-control form-control col-md-10" aria-invalid="false" onChange={handleChange} value={createOrder && createOrder.productspecification && createOrder.productspecification.dimensionB} />
                                                                                                <span className="errormsg" style={{
                                                                                                    fontWeight: 'bold',
                                                                                                    color: 'red',
                                                                                                }}>{orderErrors.dimensionB}</span>
                                                                                            </div>

                                                                                            <div className="d-flex mb-3 input-field align-items-center">
                                                                                                <label className="form-label form-label col-md-2">Radius<span className="required">*</span></label>
                                                                                                <input id="email" name="radius" type="text" placeholder="Enter Value" className="form-control form-control col-md-10" aria-invalid="false" onChange={handleChange} value={createOrder && createOrder.productspecification && createOrder.productspecification.radius} />
                                                                                                <span className="errormsg" style={{
                                                                                                    fontWeight: 'bold',
                                                                                                    color: 'red',
                                                                                                }}>{orderErrors.radius}</span>
                                                                                            </div>

                                                                                            <div className="d-flex mb-3 input-field align-items-center">
                                                                                                <label className="form-label form-label col-md-2">Quantity<span className="required">*</span></label>
                                                                                                <div className="input-group  bootstrap-touchspin bootstrap-touchspin-injected">
                                                                                                    {/* <button className="btn bootstrap-touchspin-up " type="button" onClick={handleDecrement}>-</button> */}
                                                                                                    <input type="tel" maxLength="3" name="quantity" className="form-control" onChange={handleChange} value={createOrder && createOrder.productspecification && createOrder.productspecification.quantity} />
                                                                                                    <span className="errormsg" style={{
                                                                                                        fontWeight: 'bold',
                                                                                                        color: 'red',
                                                                                                    }}>{orderErrors.quantity}</span>
                                                                                                    {/* <button className="btn bootstrap-touchspin-down " type="button" onClick={(e) => handleIncrement(e, createOrder.productspecification.quantity + 1)}>+</button> */}
                                                                                                </div>

                                                                                            </div>

                                                                                            <div className="d-flex mb-3 input-field align-items-center">
                                                                                                <label className="form-label form-label col-md-2">Additional Instructions</label>
                                                                                                <textarea className="form-control" name='additionalinstructions' id="exampleFormControlTextarea1" placeholder="Add additional Instructions" rows="3" onChange={handleChange} value={createOrder && createOrder.productspecification && createOrder.productspecification.additionalinstructions}></textarea>
                                                                                                <span className="errormsg" style={{
                                                                                                    fontWeight: 'bold',
                                                                                                    color: 'red',
                                                                                                }}>{orderErrors.additionalinstructions}</span>
                                                                                            </div>

                                                                                            <div className="d-flex mb-3 input-field align-items-center">
                                                                                                <div className="col-md-2"></div>
                                                                                                <div className="col-md-10">
                                                                                                    <a className="btn btn-primary" onClick={(e) => handleOrderReview(e)}>Create and Done</a>
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
                                                                                        <div className="Bodybox">
                                                                                            <div className="Leftsidebox">
                                                                                                <h6>Selected Item</h6>
                                                                                                <img src={image + createOrder.productimage} alt="" height="180pt" width="190pt" />
                                                                                            </div>
                                                                                            <div className="rightsidebox">
                                                                                                <div className="rightsideboxone">
                                                                                                    <h6>Customer Details</h6>
                                                                                                    <div className="d-flex spac">
                                                                                                        <div className="flex-shrink-0 me-3">
                                                                                                            <div className="avataricon">
                                                                                                                <div className="avatar-titleicon rounded-circle bg-light text-primary">
                                                                                                                    <span className="material-icons-outlined">person</span>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div className="flex-grow-1">
                                                                                                            <h5 className="font-size-14 mb-1 mt-1">Wholesaler</h5>
                                                                                                            <p className="Textlight">{createOrder.wholesalername}</p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="d-flex spac">
                                                                                                        <div className="flex-shrink-0 me-3">
                                                                                                            <div className="avataricon">
                                                                                                                <div className="avatar-titleicon rounded-circle bg-light text-primary">
                                                                                                                    <span className="material-icons-outlined">local_shipping</span>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div className="flex-grow-1">
                                                                                                            <h5 className="font-size-14 mb-1 mt-1">Shipping Address</h5>
                                                                                                            <p className="Textlight">{createOrder && createOrder?.deliveryaddress && (createOrder?.deliveryaddress?.address1 + "," + createOrder.deliveryaddress.address2 + "," + createOrder.deliveryaddress.state + "," + createOrder.deliveryaddress.pincode)}</p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="d-flex mb-3 input-field align-items-center">
                                                                                                    <div class="rightsideboxtwo">
                                                                                                        <div class="Textone"><h6>Quantity</h6>
                                                                                                            <div className="input-group  bootstrap-touchspin bootstrap-touchspin-injected">
                                                                                                                <input type="tel" maxLength="2" name="quantity" className="form-control" onChange={(e) => handleChange(e)} value={createOrder && createOrder.productspecification && createOrder.productspecification.quantity} />
                                                                                                                <span className="errormsg" style={{
                                                                                                                    fontWeight: 'bold',
                                                                                                                    color: 'red',
                                                                                                                }}>{orderErrors.quantity}</span>
                                                                                                            </div>
                                                                                                            <h6>Price</h6>
                                                                                                        </div>
                                                                                                        <div class="Texttwo">
                                                                                                            <p className="text-muted">$ {createOrder.totalprice}</p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>


                                                                                        <label className="text-style mt-3">Additional Instructions</label>
                                                                                        <textarea className="form-control" name='additionalinstructions' id="exampleFormControlTextarea1" placeholder="Add additional Instructions" rows="3" onChange={(e) => handleChange(e)} value={createOrder && createOrder.productspecification && createOrder.productspecification.additionalinstructions}></textarea>
                                                                                        {/* <span className="errormsg" style={{
                                                                                             fontWeight: 'bold',
                                                                                             color: 'red',
                                                                                         }}>{orderErrors.additionalinstructions}</span> */}
                                                                                        <a className="btn btn-primary" onClick={(e) => handleOrderReview2(e)}>Create and Done</a>


                                                                                    </div>
                                                                                </>}

                                                                        </section>


                                                                        <h3 id="basic-example-h-3" tabindex="-1" className={`title ${currentActive === 4 ? 'current' : ''}`}>Review and Confirm </h3>
                                                                        <section id="basic-example-p-3" role="tabpanel" aria-labelledby="basic-example-h-3" className="body current Review" aria-hidden="true" style={{ display: currentActive === 4 ? 'block' : 'none' }}>
                                                                            <div id="textbox">
                                                                                <p className="alignleft">Spacover-{createOrder.productname}</p>
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
                                                                                                <input type="text" name="customername" className="form-control" onChange={(e) => handleChangeCustomer(e)}
                                                                                                    value={customerObj.customername}
                                                                                                />
                                                                                            </td>
                                                                                            <td className="col2"> <input
                                                                                                id="search-input"
                                                                                                className="form-control"
                                                                                                ref={inputRef}
                                                                                                autocomplete="off"
                                                                                                type="text"
                                                                                                placeholder="Search for a location..."
                                                                                                value={edit ? customerObj.customeraddress : null}
                                                                                                onChange={handleSearchInputChange}
                                                                                            /></td>
                                                                                            <td className="col3"><input type="tel" maxLength="3" name="quantitypercustomer" id="quantity" onChange={(e) => handleChangeCustomer(e)} value={customerObj.quantitypercustomer} /></td>
                                                                                            <td className="col4">{editCustomer ? <button className="btn btn-primary customerbtn" onClick={(e) => handleUpdateCustomer(e)}>Update Customer</button> : <button className="btn btn-primary customerbtn" onClick={(e) => handleAddCustomer(e)}>Add Customer</button>}</td>

                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                                <span className="errormsg" style={{
                                                                                    fontWeight: 'bold',
                                                                                    color: 'red',
                                                                                    textAlign: "right"
                                                                                }}>{custError}</span>

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
                                                                                    <a className="btn btn-primary" onClick={(e) => handleOrderCreate(e, "update")}>{btnLoader ? (<img src="https://spacovers.imgix.net/spacoversdev/common/images/rotate_right.svg" className="loading-icon" />) : null}Confirm and Update</a>
                                                                                </div>
                                                                            </div>
                                                                        </section>


                                                                        {userData.type === "ADMIN" ? <>
                                                                            <h3 id="basic-example-h-3" tabindex="-1" className={`title ${currentActive === 5 ? 'current' : ''}`}>Approve </h3>
                                                                            <section id="basic-example-p-3" role="tabpanel" aria-labelledby="basic-example-h-3" className="body current Approve" aria-hidden="true" style={{ display: currentActive === 5 ? 'block' : 'none' }}>


                                                                                <div id="dynamicContentContainer">{generateDynamicContent()}</div>
                                                                                <span className="errormsg" style={{
                                                                                    fontWeight: 'bold',
                                                                                    color: 'red',
                                                                                }}>{orderErrors.workshop}</span>

                                                                                <hr />

                                                                                <div id="dynamicContentContainer">{generateDynamicContentCutting()}</div>
                                                                                {/* {handleCheckCutting() && createOrder.status === "NEW" && cuttingUsers && cuttingUsers.length > 0 ? <a class="btn btn-primary" onClick={addHtmlCodeCutting}>Add</a> : <button className="btn btn-primary" disabled>Add</button>} */}


                                                                                <span className="errormsg" style={{
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
                                                                                }}>{orderErrors.cuttingQuantity}</span>

                                                                                <hr></hr>
                                                                                <div id="dynamicContentContainer">{generateDynamicContentSewing()}</div>
                                                                                {handleCheckSewing() && createOrder.status === "NEW" && sewingUsers && sewingUsers.length > 0 ? <a class="btn btn-primary" onClick={addHtmlCodeSewing}>Add</a> : <button className="btn btn-primary" disabled>Add</button>}


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
                                                                                <hr></hr>

                                                                                <div className="d-flex mb-6 input-field align-items-center button_group">
                                                                                    {selctionOrder === "spacovers" && createOrder.status === "NEW" ?

                                                                                        <a className="btn btn-primary" onClick={(e) => handleOrderCreate(e, "save")}>Save</a> : ""
                                                                                    }

                                                                                    {createOrder.status === "NEW" ?
                                                                                        <a className="btn btn-primary" onClick={(e) => handleOrderCreate(e, "approve")}>Approve</a> : <a className="btn btn-primary" style={{ opacity: "0.5" }}>Approved</a>}


                                                                                    {createOrder.status === "NEW" && <a className="btn btn-primary" onClick={handleResetApproveTab}>Reset</a>}



                                                                                    {createOrder.status === "APPROVED" &&
                                                                                        <><a className="btn btn-primary" onClick={handlePrint}><span className="material-icons">print</span>print</a><div style={{ display: 'none' }}>
                                                                                            <PrintContent ref={componentRef} />
                                                                                        </div></>
                                                                                    }



                                                                                </div>
                                                                            </section>


                                                                        </> : null}

                                                                    </>
                                                                )}





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

                                            </div></> : <div className="form-block">
                                            <div className="tab-content p-3 text-muted">
                                                <div className="tab-pane active show" id="home1" role="tabpanel">
                                                    <Loader />
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                                {/* <!--end row--> */}

                            </div>
                            {/* <!-- container-fluid --> */}
                        </div>
                    }
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
                <Footer />
                <SweetAlert show={success}
                    custom
                    confirmBtnText="ok"
                    confirmBtnBsStyle="primary"
                    title={"Order Updated successfully"}
                    onConfirm={e => onConfirm()}
                />
                <SweetAlert show={showError}
                    custom
                    confirmBtnText="ok"
                    confirmBtnBsStyle="primary"
                    title={"Please Add Customers As per Quantity"}
                    onConfirm={e => onConfirm1()}
                />
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

export default EditOrder;







