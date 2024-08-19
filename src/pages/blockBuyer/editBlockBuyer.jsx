/***
 **Module Name: BlockBuyer
 **File Name :  BlockBuyer.js
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
 **Description : contains BlockBuyer details.
 ***/
import React, { useState, useEffect, useContext } from "react";
import Footer from "../../components/dashboard/footer";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import { useHistory, Link, useLocation } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import tmdbApi from "../../api/tmdbApi";
import Select from 'react-select';
import Loader from "../../components/loader";

import SessionPopup from "../SessionPopup"
import axios from "axios";
import moment from "moment";
import Modal from 'react-bootstrap/Modal';
import { contentContext } from "../../context/contentContext";
import TableLoader from "../../components/tableLoader";
import DataTable from 'react-data-table-component';

let { appname, lambda } = window.app;

const EditBlockBuyer = () => {
    const history = useHistory();
    const { state } = useLocation();
    const { item } = state || {};

    const [sellers, setSellers] = useState("");
    const [buyers, setBuyers] = useState("");
    const [buyersdata, setBuyersData] = useState({});
    const [blockData, setBlockData] = useState("");
    const [editBuyer, setEditBuyer] = useState("");
    const [sellerdetails, setSellerDetails] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const [editFlag, setEditFlag] = useState(false);

    const [editBuyerData, setEditBuyerData] = useState("");

    const [Flag, setFlag] = useState(false);
    const [update, setUpdate] = useState(false);
    const [blockdelete, setBlockDelete] = useState(false);
    const [isdelete, setIsDelete] = useState(false);
    const [unblockdata, setUnBlockData] = useState({});


    const [isLoading, setIsLoading] = useState(false);
    const { rowsPerPage, setRowsPerPage, currentPageNew, userData, setCurrentPage, route, setRoute, usePrevious, setActiveMenuId ,GetTimeActivity} = useContext(contentContext);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = (newPerPage) => {
        setRowsPerPage(newPerPage);
    };
console.log('flagggg',Flag)
    const validateObj = userData && userData.permissions && userData.permissions.length > 0 && userData.permissions.filter(eachItem => eachItem.menu == "Block Buyer")
    const subValDashboard = validateObj && validateObj[0] && validateObj[0].dashboard

    console.log("subValDashboard", item)

    useEffect(() => {
        if (item) {
            console.log("itemexcuted",item);
            setBlockData(item)
            getBuyers(item.company.companyid);
            handlePrepareObj(item.blockedCompanies)
            setError({ ...error, buyers: "", seller: "" })
            console.log("item", item)
            setFlag(true);
        }
    }, []);

    const prevRoute = usePrevious(route)
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
            setCurrentPage(1)
            setRowsPerPage(15)
        }
    }, [prevRoute]);
    useEffect(() => {
        setRoute("blockbuyer")
        setActiveMenuId(200008)
        // getBlockBuyersData();
        getSellers();
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
   
    const getSellers = async () => {
        GetTimeActivity()   
        try {
            // console.log(tmdbApi);
            const response = await tmdbApi.GetSellers({});
            // console.log("response", response);
            if (response.result == "Invalid token or Expired") {
                setShowSessionPopupup(true)
            } else {
                if (blockData.buyer) {
                    blockData.buyer.map((eachBuyer) => {
                        const filteredArray = response.result.data.filter((eachItem) => eachItem.clientid != eachBuyer.buyerid);
                        setSellers(filteredArray)
                    })
                } else {
                    setSellers(response.result.data)
                }
            }
        } catch {
            console.log("error");
        }
    };
    const getBuyers = async (id) => {
        GetTimeActivity()   
        try {
            // console.log(tmdbApi);
            const response = await tmdbApi.GetBuyers({ id });
            // console.log("response", response);
            if (response.result == "Invalid token or Expired") {
                setShowSessionPopupup(true)
            } else {
                let result = response.result.data;                
                setBuyers(result)
            }

        } catch {
            console.log("error");
        }
    };
    const handleChange = (e) => {
        if (!!error[e.target.name]) {
            let Error = Object.assign({}, error);
            delete Error[e.target.name];
            setError(Error);

        }
        getSellers();
        if (e.target.name === "seller") {
            let target = e.target.value?.split("/");
            let targetid = target[1];
            let targetname = target[0];
           console.log("e.target",e.target.value)
            for (let key in sellers) {

                if (sellers.hasOwnProperty(key) && sellers[key].companyid.toString() === targetid) {
                    setBlockData({ ...blockData, companyname: sellers[key].companyname, companyid: sellers[key].companyid })
                    getBuyers(sellers[key].companyid);
                }

            }

        }

        else {

            setBlockData({ ...blockData, [e.target.name]: e.target.value });
        }

    }


    const handleChangeMultiSelect = (selected, key) => {
        GetTimeActivity()   
        if (!!error[key]) {
            let Error = Object.assign({}, error);
            delete Error[key];
            setError(Error);

        }

        setBlockData({ ...blockData, [key]: selected });
        setBuyersData({ ...buyersdata, [key]: selected })


    }

    const handleChangeMultiSelect1 = (selected, key) => {
        GetTimeActivity()   
        let newobj = {}
         console.log("selected", selected);
        setEditBuyer({ ...editBuyer, [key]: selected })
        setEditBuyerData({ ...editBuyerData, [key]: selected })
    }



    const customNoRecords = () => {
        return (

            <div className="empty-state-body empty-record"  >
                <div className="empty-state__message">
                    <span className="material-icons">summarize</span>
                    <p className="form-check font-size-16">No records were found for the searched keyword</p>
                </div> </div>
        )
    }

    const handleBlockBuyer = (e) => {
        const isValid = Validate();
        GetTimeActivity()   
        if (isValid) {
            handleBlock();
        }
    }

    const Validate = (e) => {
        let formIsValid = true;


        let Error = { ...error };
        let mandatoryFileds = [{ name: 'buyers', key: 'blockedCompanies' }, { name: 'seller', key: 'companyname' }]
        if (mandatoryFileds) {
            mandatoryFileds.forEach(function (item) {

                if (
                    (blockData[item.key] == "" ||
                        blockData[item.key] == undefined ||
                        blockData[item.key] == "undefined")
                ) {
                    Error[item.key] = item.name + " is required";
                    formIsValid = false;
                }

            });
        }

        if (blockData.companyid === "" || blockData.companyid === undefined) {
            Error["seller"] = "please select seller";
            formIsValid = false;
        }





        // console.log("excuted", formIsValid)
        setError(Error);
        return formIsValid;

    }
    console.log(error)

    const handleBlock = (e) => {
        setIsLoading(true)
        const userid = localStorage.getItem("userId")
        let arr = [];
        blockData.blockedCompanies.map((eachItem) => {
            arr.push({ companyid: eachItem.value, companyname: eachItem.label });
        })


        let payload = {
            "companyid": blockData.companyid,
            "companyname": blockData.companyname,
            "blockedCompanies": arr,
            "createdBy":{ userid: userData.userid, username:  userData.name }
        }

        // console.log("payload", arr);
        const token = localStorage.getItem("token")
        axios({

            method: 'POST',
            url: lambda + '/blockCompanies?appname=' + appname + "&userid=" + userid + "&token=" + token + "&status=block",
            data: payload,
        })
            .then(function (response) {
                payload = {};
                setIsLoading(false)
                setSuccess(true);
                //  getBlockBuyersData();
                setBlockData({ ...blockData, companyid: "", companyname: "", seller: {}, buyers: {} })
                delete blockData["companyname"];
                delete blockData["companyid"];

            });


    }

    function onConfirm() {
        GetTimeActivity()   
        setSuccess(false);
        history.push("/blockbuyer")

    };
    function onConfirm1() {
        GetTimeActivity()   
        setUpdate(false);
        history.push("/blockbuyer")

    };
    function onConfirm2() {
        GetTimeActivity()   
        setIsDelete(false);
        history.push("/blockbuyer")

    };

    const handlePrepareObj = (item) => {
        console.log("item",item);
        const resultArr = item.map((eachItem) => { return { value: eachItem.companyname, label: eachItem.companyname, companyid: eachItem.companyid }; })
        setEditBuyerData({ ...editBuyerData, blockedCompanies: resultArr });
    }

    const handleEdit = (e, item, key) => {
        // console.log("item", item)
        setBlockData(item)
        getBuyers(item.companyid);
        handlePrepareObj(item.buyers)
        setError({ ...error, buyers: "", seller: "" })

        if (key) {
            setFlag(true)
        }
        //  handleChangeMultiSelect(item)

    }

    const handleDeleteClick = (e, item) => {
        GetTimeActivity()   
        setBlockDelete(true);
        setUnBlockData(item)
    }

    function onCancel() {
        GetTimeActivity()   
        setBlockDelete(false)
    }


    const handleDelete = (e, item) => {
        GetTimeActivity()   
        let arr = [];
        // unblockdata.buyers.map((eachItem) => {
        //     arr.push(eachItem.buyerid);
        // })

        let payload = {
            "companyid": unblockdata && unblockdata.company.companyid,
        }

        // console.log("payload", payload);
        const token = localStorage.getItem("token")
        const userid = localStorage.getItem("userId")
        axios({

            method: 'DELETE',
            url: lambda + '/blockCompanies?appname=' + appname + "&userid=" + userid + "&token=" + token,
            data: payload,
        })
            .then(function (response) {
                payload = {};
                // getBlockBuyersData();
                setBlockDelete(false);
                setFlag(false)
                setBlockData({ ...blockData, buyers: {} })
                setIsDelete(true)

            });

    }

    const handleUpdate = (e) => {
        GetTimeActivity()   
        setIsLoading(true)
        const userid = localStorage.getItem("userId")
        let arr = [];
        if (editBuyer.blockedCompanies === undefined) {
            blockData.blockedCompanies.map((eachItem) => {
                arr.push({ companyid: eachItem.companyid, companyname: eachItem.companyname });
            })
        } else {
            editBuyer.blockedCompanies.map((eachItem) => {
                arr.push({ companyid: eachItem.companyid, companyname: eachItem.label });
            })
        }



        let payload = {
            "companyid": blockData.company.companyid,
            "companyname": blockData.company.companyname,
            "blockedCompanies": arr
        }

        // console.log("payoad",payload)
        const token = localStorage.getItem("token")
        axios({

            method: 'POST',
            url: lambda + '/blockCompanies?appname=' + appname + "&userid=" + userid + "&token=" + token,
            data: payload,
        })
            .then(function (response) {
                payload = {};
                setIsLoading(false)
                setUpdate(true);
                // getBlockBuyersData();
                setBlockData({ ...blockData, sellerid: "", buyerid: "", seller: {}, buyers: {}, sellertype: "" })
                delete blockData["seller"];
                delete blockData["sellerid"];
                setEditBuyer({});
                setFlag(false)

            });


    }
    const handleFocusBuyers = () => {
        if (blockData.companyname === "" || blockData.companyname === undefined) {
            setError({ ...error, seller: "please select seller" })
        }
    }

    const handleBack = () => {
        GetTimeActivity()   
        history.push("/blockbuyer");
    }

     console.log("blockData", blockData,editBuyer)
    return (
        <>
            {showSessionPopupup && <SessionPopup />}
            <div id="layout-wrapper">
                <Header />
                <Sidebar />
                <div className="main-content create-user edit-content add-client user-management">

                    <div className="page-content ">
                        <div className="container-fluid">



                            <div className="row mb-4 breadcrumb">
                                <div className="col-lg-12">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1">
                                            <h4 className="mb-2 card-title">{Flag === true ? "EDIT" : "ADD"} BLOCK BUYER</h4>

                                        </div>
                                        <div>
                                            <a onClick={handleBack} className="btn btn-primary">back</a>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="create-user-block content_edit block_buyer edit-block-buyer">

                                <div className="form-block">


                                {(Object.keys(blockData).length > 0 && sellers.length > 0) || Flag === false? 
                                            <>  

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="left_block">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">SELLER</label>
                                                            {Flag === true ? <select className="form-select" name="seller" value={blockData.company.companyname} onChange={handleChange} placeholder="Select Type" disabled>
                                                                <option>Select Type</option>
                                                                
                                                                {sellers && sellers.length > 0 && sellers.map((task, i) => {

                                                                    return (
                                                                        <option key={i} value={task.companyname}>{task.companyname}</option>
                                                                    );
                                                                }
                                                                )}
                                                            </select> :
                                                                <select className="form-select" name="seller" value={blockData.seller} onChange={handleChange} placeholder="Select Type">
                                                                    <option>Select Seller</option>
                                                                    {/* <option>Select</option>
                                                                 <option>Select</option>
                                                                 <option>Select</option> */}
                                                                    {sellers && sellers.length > 0 && sellers.map((task, i) => {

                                                                        return (
                                                                            <option key={i} value={task.companyname+"/" + task.companyid}>{task.companyname}</option>
                                                                        );
                                                                    }
                                                                    )}
                                                                </select>

                                                            }
                                                            {error.seller && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{error.seller}</span>}

                                                        </div>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">BUYER</label>
                                                            {Flag === true ? <Select isMulti={true}
                                                                placeholder='Select Buyers'
                                                                isClearable={true}
                                                                onChange={(e) => handleChangeMultiSelect1(e, "blockedCompanies")}

                                                                options={buyers && buyers.map((eachItem) => { return { value: eachItem.companyname, label: eachItem.companyname ,companyid:eachItem.companyid } })}

                                                                value={editBuyerData && editBuyerData.blockedCompanies && editBuyerData.blockedCompanies.length > 0 && editBuyerData.blockedCompanies?.map((eachItem) => { return { value: eachItem.value, label: eachItem.label, companyid: eachItem.companyid } })}

                                                            /> :
                                                                <Select isMulti={true}
                                                                    placeholder='Select Buyers'
                                                                    isClearable={true}
                                                                    isSearchable={buyers && buyers.length > 1 ? true : false}
                                                                    onFocus={handleFocusBuyers}
                                                                    onChange={(e) => handleChangeMultiSelect(e, "blockedCompanies")}

                                                                    options={buyers && buyers.map((eachItem) => { return { value: eachItem.companyid, label: eachItem.companyname } })}

                                                                    value={blockData && blockData.buyers && blockData.buyers.length > 0 && blockData.buyers?.map((eachItem) => { return { value: eachItem.value, label: eachItem.label, buyerid: eachItem.buyerid } })}
                                                                />
                                                            }
                                                            {/* {error.buyers && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{error.buyers}</span>} */}
                                                            {error.blockedCompanies && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{error.blockedCompanies}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        {Flag === true ? <><button className="btn btn-primary btn-block btn-sm float-none " type="submit" onClick={(e) => handleUpdate(e)}>{isLoading ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}UPDATE</button>

                                                            {/* <button className="btn btn-primary btn-block btn-sm float-none " type="submit" onClick={(e) => handleDeleteClick(e,item)}>DELETE</button> */}

                                                            {subValDashboard && subValDashboard.delete && subValDashboard.delete.display === true &&
                                                                <button className={`${subValDashboard && subValDashboard.delete && subValDashboard.delete.enable === false ? 'pe-none' : ''} btn btn-primary btn-block btn-sm float-none`} type="submit" onClick={(e) => handleDeleteClick(e, item)}>DELETE</button>}

                                                        </>
                                                            :
                                                            <button className="btn btn-primary btn-block btn-sm float-none " type="submit" onClick={(e) => handleBlockBuyer(e)}>{isLoading ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}BLOCK</button>}
                                                    </div>
                                                </div>


                                            </div>

                                        </div>
                                        <div className="col-md-6">

                                        </div>
                                    </div>
                                    </>
                                    : 
                                        <div className="form-block">
                                            <div className="tab-content p-3 text-muted">
                                                <div className="tab-pane active show" id="home1" role="tabpanel">
                                                    <div className="row"><Loader />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                                }



                                </div>

                            </div>


                        </div>
                    </div>
                    <SweetAlert show={success}
                        custom
                        confirmBtnText="ok"
                        confirmBtnBsStyle="primary"
                        title={"Blocked Successfully"}
                        onConfirm={e => onConfirm()}
                    >
                    </SweetAlert>
                    <SweetAlert show={update}
                        custom
                        confirmBtnText="ok"
                        confirmBtnBsStyle="primary"
                        title={"Updated Successfully"}
                        onConfirm={e => onConfirm1()}
                    >
                    </SweetAlert>
                    <SweetAlert show={isdelete}
                        custom
                        confirmBtnText="ok"
                        confirmBtnBsStyle="primary"
                        title={"Deleted Successfully"}
                        onConfirm={e => onConfirm2()}
                    >
                    </SweetAlert>

                    <Modal className="access-denied" show={blockdelete}>

                        <div className="modal-body enquiry-form">
                            <div className="container">
                                <button className="close-btn" onClick={e => onCancel()}><span className="material-icons">close</span></button>
                                <span className="material-icons access-denied-icon">delete_outline</span>
                                <h3>Delete</h3>
                                <p>This action cannot be undone.</p>
                                <p>Are you sure you want to unblock ?</p>
                                <div className="popup-footer">
                                    <button className="fill_btn yellow-gradient" data-bs-toggle="modal" data-bs-target="#recommendModal" onClick={e => handleDelete()}> Yes, Delete</button>
                                </div>
                            </div>
                        </div>

                    </Modal>

                    <Footer />
                </div>
            </div>
        </>
    );
};

export default EditBlockBuyer;
