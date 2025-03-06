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
import { useHistory, Link } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import tmdbApi from "../../api/tmdbApi";
import Select from 'react-select';
import SessionPopup from "../SessionPopup"
import axios from "axios";
import moment from "moment";
import Modal from 'react-bootstrap/Modal';
import { contentContext } from "../../context/contentContext";
import TableLoader from "../../components/tableLoader";
import DataTable from 'react-data-table-component';

let { appname, lambda } = window.app;

const BlockBuyer = () => {
    const history = useHistory();

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
    const [isdelete, setIsDelete] = useState(false);
    const [unblockdata, setUnBlockData] = useState({});
    const [btnLoader, setbtnLoader] = useState(false);


    // const [isLoading, setIsLoading] = useState(false);
    const { isLoading, setIsLoading, userData, rowsPerPage, setRowsPerPage, currentPageNew, setCurrentPage, route, setRoute, usePrevious , setActiveMenuId,GetTimeActivity} = useContext(contentContext);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = (newPerPage) => {
        setRowsPerPage(newPerPage);
    };


    const validateObj = userData && userData.permissions && userData.permissions.length > 0 && userData.permissions.filter(eachItem => eachItem.menu == "Block Buyer")
    const subValDashboard = validateObj && validateObj[0] && validateObj[0].dashboard

    //console.log('subValDashboard && subValDashboard.view && subValDashboard.view.display === true', //subValDashboard && subValDashboard.view && subValDashboard.view.display === true)

   

    const prevRoute = usePrevious(route)
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
            setCurrentPage(1)
            setRowsPerPage(15)
        }
    }, [prevRoute]);
    const keyForRerender = `${rowsPerPage}_${sellerdetails.length}`;
    useEffect(() => {
        setRoute("blockbuyer")
        setActiveMenuId(200008)
        getBlockBuyersData();
        getSellers();
        getBuyers();
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
    const columns = [

        {
            name: 'SELLER',
            selector: row =>  row?.company?.companyname ?? "",
            sortable: true,
        },
        {
            name: 'BLOCKED BUYER',
            // selector: row => row.blockedCompanies && row.blockedCompanies.length > 0 && row.blockedCompanies.map(function (subItem, j) {
                  
                    
            //     return (

            //       <>{row.blockedCompanies.length - 1 === j ? subItem.companyname : subItem.companyname + ", "}</>

                
            //     )
            // }),
            selector : row => row.blockedCompanies && row.blockedCompanies.length > 0
            ? row.blockedCompanies.map(subItem => subItem.companyname).join(', ')
            : '',
          
            sortable: true,
        },
        {
            name: 'CREATED ON',
            selector: row => row?.created ? new Date(row.created).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            }) :"",
            sortable: true,
        },
        {
            name: 'UPDATED ON',
            selector: row => row?.update ? new Date(row?.update).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            }) :"",
            sortable: true,
        },


        {
            name: <>{subValDashboard && subValDashboard.edit && subValDashboard.edit.display === true && 'Actions'}</>,
            cell: (props) =>
                <div className="d-flex">
                    {subValDashboard && subValDashboard.edit && subValDashboard.edit.display === true &&
                        <a className={`${subValDashboard && subValDashboard.edit && subValDashboard.edit.enable === false ? 'pe-none' : ''} text-danger action-button`} onClick={(e) => handleEdit(e, props, "clicked")}><i className="mdi mdi-pencil font-size-18"></i></a>}

                    {/* <a onClick={(e) => handleEdit(e, props, "clicked")} className="text-success action-button"><i className="mdi mdi-pencil font-size-18"></i></a> */}
                    {/* <a onClick={(e) => handleDeleteClick(e, props)} className="text-danger action-button"><i className="mdi mdi-delete font-size-18 text-danger"></i></a> */}
                </div>
            ,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const getBlockBuyersData = async () => {
        GetTimeActivity()   
        try {
            setIsLoading(true)
            const response = await tmdbApi.GetBlockBuyers({});
            if (response.result == "Invalid token or Expired") {
                setShowSessionPopupup(true)
            } else {


                setSellerDetails(response.result)
                setIsLoading(false)
                // let arr = [];
                // response.result.map((eachItem) => {
                //     //  console.log("arrrrrrr",eachItem)
                //     arr.push(eachItem.blockedBuyers);
                // })
                // console.log("arrrrrrr", arr)
                // setBlockBuyer(arr)
            }
        } catch {
            console.log("error");
            setIsLoading(false)
        }
    };

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
        const token = localStorage.getItem("token")
        const userid = localStorage.getItem("userId")
        axios({

            method: 'GET',
            url: lambda + "/blockCompanyList?appname=" + appname + "&token=" + token + '&userid=' + userid,

        })
            .then(function (response) {
                if (response.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    let result = response.data.result.data;

                    setBuyers(result)
                }

            });

    };
    const handleChange = (e) => {
        if (!!error[e.target.name]) {
            let Error = Object.assign({}, error);
            delete Error[e.target.name];
            setError(Error);

        }
        getSellers();
        if (e.target.name === "companyname") {

            for (let key in sellers) {

                if (sellers.hasOwnProperty(key) && sellers[key].companyname === e.target.value) {
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
        if (!!error[key]) {
            let Error = Object.assign({}, error);
            delete Error[key];
            setError(Error);

        }

        setBlockData({ ...blockData, [key]: selected });
        setBuyersData({ ...buyersdata, [key]: selected })


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






    function onConfirm() {
        GetTimeActivity()   
        setSuccess(false);

    };



    const handleEdit = (e, item, key) => {
        GetTimeActivity()   
        // console.log("item", item)
        // setBlockData(item)
        // getBuyers(item.clientid);
        // handlePrepareObj(item.buyers)
        // setError({...error, buyers: "" ,seller:""})

        // if (key) {
        //     setFlag(true)
        // }
        history.push({
            pathname: "/editblockbuyer",
            state: { item: item }
        });

    }








    const handleFocusBuyers = () => {
        if (blockData.seller === "" || blockData.seller === undefined) {
            setError({ ...error, seller: "please select seller" })
        }
    }

    const handleAddBlock = () => {
        GetTimeActivity()   
        history.push("/addblockbuyer");
    }

    const handleSearch = () => {
        GetTimeActivity()   
        let companyname = blockData.companyname ? [blockData.companyname] : ""
        setIsLoading(true)
        let arr = [];
        if (blockData.blockcompanyname) {
            blockData.blockcompanyname.map((eachItem) => {
                arr.push(eachItem.label);
            })
        }


        let payload = {
            "companyname": companyname,
            "blockcompanyname": arr
        }
        const token = localStorage.getItem("token")
        if (payload.companyname === "") {
            delete payload["companyname"];
        }
        if (payload.blockcompanyname.length <= 0) {
            delete payload["blockcompanyname"];
        }
        const userid = localStorage.getItem("userId")
        axios({

            method: 'POST',
            url: lambda + '/getblockCompanies?appname=' + appname + "&token=" + token+ '&userid=' + userid,
            data: payload,
        })
            .then(function (response) {
                //  console.log("search res",response)
                setSellerDetails(response.data.result)
                setIsLoading(false)

            });
    }

    const clearSearch = () => {
        setBlockData({ ...blockData, companyname: "", blockcompanyname: "",companyid:""})
        getBlockBuyersData();
        GetTimeActivity()   
    }

    console.log("blockData",blockData)

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
                                            <h4 className="mb-2 card-title">BLOCK BUYER</h4>

                                        </div>
                                        <div>
                                        {subValDashboard && subValDashboard.edit && subValDashboard.edit.display === true &&
                        <a className={`${subValDashboard && subValDashboard.edit && subValDashboard.edit.enable === false ? 'pe-none' : ''} btn btn-primary`} onClick={handleAddBlock}>ADD BLOCK BUYER</a>}

                                            {/* <button className="btn btn-primary" onClick={handleAddBlock}>ADD BLOCK BUYER</button> */}
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="create-user-block content_edit block_buyer">

                                <div className="form-block">







                                    {/* <div className="row">
                                        <div className="col-md-4 seller-col-width">
                                            <div className="input-field">
                                              

                                                <select className="form-select" name="companyname" value={blockData.companyname} onChange={handleChange} placeholder="Select Type">
                                                    <option>Select Seller</option>
                                                   
                                                    {sellers && sellers.length > 0 && sellers.map((task, i) => {

                                                        return (
                                                            <option key={i} value={task.companyname}>{task.companyname}</option>
                                                        );
                                                    }
                                                    )}
                                                </select>



                                            </div>
                                        </div>

                                        <div className="col-md-4 seller-col-width">
                                            <div className="input-field">


                                                <Select isMulti={true}
                                                    placeholder='Select Buyers'
                                                    isClearable={true}
                                                    isSearchable={buyers && buyers.length > 1 ? true : false}
                                                    onFocus={handleFocusBuyers}
                                                    onChange={(e) => handleChangeMultiSelect(e, "blockcompanyname")}

                                                    options={buyers && buyers.map((eachItem) => { return { value: eachItem.companyid, label: eachItem.companyname  } })}

                                                    value={blockData && blockData.blockcompanyname && blockData.blockcompanyname.length > 0 && blockData.blockcompanyname?.map((eachItem) => { return { value: eachItem.value, label: eachItem.label, buyerid: eachItem.buyerid } })}
                                                />

                                            </div>
                                        </div>
                                        <div className="col-md-3 btn-col-width">

                                            <button className="btn btn-primary btn-block btn-sm float-none " onClick={handleSearch} type="submit" >Search</button>


                                            <button className="fill_btn" onClick={clearSearch}><span className="material-icons-outlined">sync</span>Reset</button>
                                        </div>
                                    </div> */}

                                <div className="row">
                                    <div className="col-md-4">
                                    </div>
                                    <div className="col-md-8 search_section">
                                              
                                                <select className="form-select" name="companyname" value={blockData.companyname} onChange={handleChange} placeholder="Select Type">
                                                    <option>Select Seller</option>
                                                   
                                                    {sellers && sellers.length > 0 && sellers.map((task, i) => {
                                                        return (
                                                            <option key={i} value={task.companyname}>{task.companyname}</option>
                                                        );
                                                    }
                                                    )}
                                                </select>
                                                    <Select isMulti={true}
                                                    placeholder='Select Buyers'
                                                    isClearable={true}
                                                    isSearchable={buyers && buyers.length > 1 ? true : false}
                                                    onFocus={handleFocusBuyers}
                                                    onChange={(e) => handleChangeMultiSelect(e, "blockcompanyname")}
                                                    options={buyers && buyers.map((eachItem) => { return { value: eachItem.companyid, label: eachItem.companyname  } })}
                                                    value={blockData && blockData.blockcompanyname && blockData.blockcompanyname.length > 0 && blockData.blockcompanyname?.map((eachItem) => { return { value: eachItem.value, label: eachItem.label, buyerid: eachItem.buyerid } })}
                                                />
                                            <button className="fill_btn" onClick={handleSearch} type="submit" ><span className="material-icons search-icon">search</span></button>
                                            <button className="reset_btn" onClick={clearSearch}><span className="material-icons-outlined">sync</span>Reset</button>
                                    </div>
                                </div>





                                      < DataTable  key={keyForRerender}
                                        // title=""
                                        columns={columns}
                                        // className="table align-middle table-nowrap table-check"
                                        keyField='_id'
                                        data={sellerdetails}
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
                                        paginationTotalRows={sellerdetails.length}
                                        onChangeRowsPerPage={handlePerRowsChange}
                                        onChangePage={handlePageChange}
                                        paginationPerPage={rowsPerPage}
                                        paginationDefaultPage={currentPageNew}
                                                paginationRowsPerPageOptions={[15,25,50,75,100]}

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
                        onConfirm={e => setUpdate(false)}
                    >
                    </SweetAlert>
                    <SweetAlert show={isdelete}
                        custom
                        confirmBtnText="ok"
                        confirmBtnBsStyle="primary"
                        title={"Deleted Successfully"}
                        onConfirm={e => setIsDelete(false)}
                    >
                    </SweetAlert>



                    <Footer />
                </div>
            </div>
        </>
    );
};

export default BlockBuyer;
