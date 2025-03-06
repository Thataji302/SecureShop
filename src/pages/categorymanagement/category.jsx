/***
**Module Name: client
 **File Name :  client.js
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
 **Description : contains clients table details.
 ***/
import React, { useState, useEffect, useContext } from "react";


import Footer from "../../components/dashboard/footer";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import tmdbApi from "../../api/tmdbApi";
import { useHistory, Link, useLocation } from "react-router-dom";
import axios from 'axios';
import moment from "moment";
import * as Config from "../../constants/Config";
import SweetAlert from 'react-bootstrap-sweetalert';
import Loader from "../../components/loader";
import { contentContext } from "../../context/contentContext";
import TableLoader from "../../components/tableLoader";
import DataTable from 'react-data-table-component';
import SessionPopup from "../SessionPopup"
let { appname, lambda } = window.app;



const Category = () => {
    const history = useHistory();
    const { state } = useLocation();
    const { search } = state || {};
    // const [toggle, setToggle] = useState(false);
    const [content, setContent] = useState("");
    const [perpage, setPerpage] = useState(10);

    const [success, setSuccess] = useState(false);
    // const [data, setData] = useState([]);

    // const [currentPage, setcurrentPage] = useState(1);
    const [flag, setFlag] = useState(false);


    const [showSessionPopupup, setShowSessionPopupup] = useState(false);

    // const [isLoading, setIsLoading] = useState(false);

  
    const { searchedFlag, setSearchedFlag, userData, sortTableAlpha, arrow, categorysearch, setCategorySearch,   data, setData, rowsPerPage, setRowsPerPage, currentPageNew, setCurrentPage, route, setRoute, usePrevious ,isLoading, setIsLoading, setActiveMenuId,GetTimeActivity} = useContext(contentContext)

    const validateObj = userData && userData.permissions && userData.permissions.length > 0 && userData.permissions.filter((eachItem) => { if (eachItem.menu === "Category Management") return [eachItem] })
    const subValDashboard = validateObj && validateObj[0] && validateObj[0].dashboard
    // console.log('validateObj obj', validateObj)
    // console.log('subValDashboard obj', subValDashboard)
    const prevRoute = usePrevious(route)
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
            // console.log('prev route use effect')
            setCurrentPage(1)
            setRowsPerPage(15)
            setSearchedFlag(false);
            setCategorySearch("")
        }
    }, [prevRoute]);
    //  console.log('prevRoute--->',prevRoute)
    //  console.log('currentRoute--->',route)
    //  console.log('currentPageNew--->',currentPageNew)
    const customNoRecords = () => {
        return(
            
            <div className="empty-state-body empty-record"  >
                <div className="empty-state__message">
                    <span className="material-icons">summarize</span>
                    <p className="form-check font-size-16">No categories were found with the searched keyword</p>
                </div> </div>
        )
    }

    const columns = [

        {
            name: 'Name',
            selector: row => row?.name ?? "",
            sortable: true,
        },
        {
            name: 'Image',
            cell: (props) => <img src={props.image + "?auto=compress,format&width=40"} alt='Image' />,
            sortable: false,
        },
        {
            name: 'Status',
            selector: row => row?.status ?? "",
            sortable: true,
        },
        {
            name: 'Order',
            selector: row => row?.order ?? "",
            sortable: true,
        },
        {
            name: <>{(subValDashboard && subValDashboard.view && subValDashboard.view.display === true) || (subValDashboard && subValDashboard.edit && subValDashboard.edit.display === true) ? 'Actions' : null}</>,
            cell: (props) =>
                //   {subValDashboard && subValDashboard.view && subValDashboard.view.display === true &&
               
                    <div className="d-flex">
                        {subValDashboard && subValDashboard.view && subValDashboard.view.display === true  &&
                            <a onClick={(e) => handleViewCategory(e, props.categoryid)} className={`${subValDashboard && subValDashboard.view && subValDashboard.view.enable === false ? 'pe-none' : ''} text-success action-button`}><i className="mdi mdi-eye font-size-18"></i></a>}

                        {subValDashboard && subValDashboard.edit && subValDashboard.edit.display === true  &&
                            <a className={`${subValDashboard && subValDashboard.edit && subValDashboard.edit.enable === false? 'pe-none' : ''} text-danger action-button`} onClick={(e) => handleEditCategory(e, props.categoryid)}><i className="mdi mdi-pencil font-size-18"></i></a>}
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

    const keyForRerender = `${rowsPerPage}_${data.length}`;



    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        setRoute("category")
        setActiveMenuId(200002)
        // if (search === true) {
        //     handleSearch();
        // } else {
        //     CategoryDetails();
        // }
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
    useEffect(() => {
      

        console.log("trueeeeeeeeee",searchedFlag);
        if (searchedFlag) { 
            console.log("came") 
            handleSearch();
        } else {
            console.log("called get all deals") 
            CategoryDetails();
        }

    }, [searchedFlag]);

    const CategoryDetails = async (e) => {
        GetTimeActivity() 
        setIsLoading(true);
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/category?appname=' + appname + "&token=" + token,
        })
            .then(function (response) {
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {

                    // console.log("resss", response);
                    setData(response.data.result.data);
                    setContent(response.data.result)
                    setIsLoading(false);
                    setCategorySearch("");
                    setSearchedFlag(false);
                }
            });
    }




    const handleEditCategory = (e, id) => {
        GetTimeActivity() 
        history.push("/editcategory/" + id);
    }

    const handleViewCategory = (e, id) => {
        GetTimeActivity() 
        history.push("/viewcategory/" + id);
    }
    
    const handleAdd = () => {
        GetTimeActivity() 
        history.push("/addcategory")
    }
    const handleChangeCategory = () => {
        GetTimeActivity() 
        history.push("/changecategoryorder")
    }
    const handleSearch = (e, flagggg) => {
        GetTimeActivity() 
        if(flagggg === "normalsearch"){
            setSearchedFlag(true)
       }
       
        setFlag(true)
        const token = localStorage.getItem("token");
        if (categorysearch === "") {
            CategoryDetails();
        }
        else {
            setIsLoading(true);
            axios({
                method: 'GET',
                url: lambda + '/category?appname=' + appname + "&search=" + categorysearch + "&token=" + token,
            })
                .then(function (response) {
                    if (response.data.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {

                        // console.log("response", response);
                        setCurrentPage(1);
                        setData(response.data.result.data);
                        setContent(response.data.result);
                        setIsLoading(false);
                    }
                });
        }
    }

    function onConfirm() {
        GetTimeActivity() 
        setSuccess(false);
        setCategorySearch("")

    };
    const handleChange = (e) => {
        GetTimeActivity() 
        if (e.target.value === "") {
           // CategoryDetails();
            setFlag(false)
        }
        setCategorySearch(e.target.value);
    }

    // console.log()

    const clearSearch = () => {
        GetTimeActivity() 
        setCurrentPage(1)
        setRowsPerPage(15)
        setCategorySearch("");
        CategoryDetails();
    }

    const handleKeypress = (e) => {
        GetTimeActivity() 
        //it triggers by pressing the enter key

        if ((e.key === "Enter")) {
            setTimeout(function () {
                handleSearch();
            }, 100);
        }
    };

    return (
        <>
            {showSessionPopupup && <SessionPopup />}
            <div id="layout-wrapper">
                <Header />
                <Sidebar />

                <div className="main-content user-management clients category">

                    <div className="page-content">
                        <div className="container-fluid">



                            <div className="row mb-4 breadcrumb">
                                <div className="col-lg-12">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1">
                                            <h4 className="mb-2 card-title">category management</h4>
                                        </div>
                                        {subValDashboard && subValDashboard.add && subValDashboard.add.display === true &&
                                            <div>
                                                <button onClick={handleAdd} className="btn btn-primary" disabled={subValDashboard && subValDashboard.add && subValDashboard.add.enable === false}>ADD CATEGORY</button>
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
                                                <div className="dataTables_length" id="datatable_length">
                                                            <button className="fill_btn" onClick={handleChangeCategory}><span className="material-icons-outlined">layers</span>Arrange Order</button>
                                                        </div>
                                                </div>
                                                <div className="col-sm-8">
                                                    <div className="search-box mb-2 d-inline-block">
                                                        <div className="position-relative">
                                                            <input type="text" className="form-control" placeholder="Search Category Name" onChange={(e) => handleChange(e)} value={categorysearch} onKeyPress={handleKeypress} />
                                                            <button className="fill_btn"
                                                                onClick={(e)=>handleSearch(e,"normalsearch")} ><span className="material-icons search-icon"
                                                                >search</span></button>
                                                        </div>
                                                        <div className="dataTables_length" id="datatable_length">
                                                            <button className="fill_btn" onClick={clearSearch}><span className="material-icons-outlined">sync</span>Reset</button>
                                                        </div>
                                                      
                                                    </div>
                                                    <div className="text-sm-end">

                                                    </div>
                                                </div>
                                            </div>
                                              < DataTable  key={keyForRerender}
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


                        </div>
                    </div>



                    <Footer />
                    <SweetAlert show={success}
                        custom
                        confirmBtnText="ok"
                        confirmBtnBsStyle="primary"
                        title={"No Results Found"}
                        onConfirm={e => onConfirm()}
                    >
                    </SweetAlert>
                </div>

            </div>
        </>
    );
};

export default Category;
