/***
 **Module Name: workshops
 **File Name :  workshops.js
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
 **Description : contains workshop dashboard details.
 ***/
import React, { useState, useEffect, useContext } from "react";
import DataTable from "react-data-table-component";
import { useHistory, Link, useLocation } from "react-router-dom";
import axios from "axios";
import Footer from "../../components/dashboard/footer";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import Loader from "../../components/loader";
import { contentContext } from "../../context/contentContext";
import TableLoader from "../../components/tableLoader";
import SessionPopup from "../SessionPopup";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import * as Config from "../../constants/Config";
let { lambda, appname } = window.app;


const WorkShops = () => {
    const history = useHistory();
    const [value, setValue] = useState([]);
    const [isDelete, setIsdelete] = useState(false);
    const [deleteId, setDeleteId] = useState("");
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const [image, setImg] = useState("");
    const [removeLoad, setRemoveLoad] = useState(false)
    const [visibleItems, setVisibleItems] = useState(20);

    const [activeButton, setActiveButton] = useState("grid");
    const [activeBtn, setActiveBtn] = useState('Cutting');
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
    } = useContext(contentContext);
    const prevRoute = usePrevious(route);
    useEffect(() => {
        if (prevRoute !== undefined && prevRoute !== route) {
            setCurrentPage(1);
            setRowsPerPage(15);
            setWorkshopSearch("")
            setSearchedFlag(false);
        }
    }, [prevRoute]);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        setActiveMenuId(200008);
        //getWorkshop();
        setRoute("workshops");
    }, []);

    useEffect(() => {
        GetLookUp();
        userActivity()
    }, []);
    useEffect(() => {
        console.log("trueeeeeeeeee", searchedFlag);
        if (searchedFlag) {
            console.log("came");
            handleSearch();
        } else {
            console.log("called get all deals");
            getWorkshop("Cutting");
        }
    }, [searchedFlag]);
  
    useEffect(() => {
        if (window.site === undefined) {
            setTimeout(() => {
                if (
                    window.site &&
                    window.site.common &&
                    window.site.common.resourcesUrl
                ) {
                    setImg(window.site.common.resourcesUrl);
                }
            }, 1000);
        }
        if (window.site && window.site.common && window.site.common.resourcesUrl) {
            setImg(window.site.common.resourcesUrl);
        }
    }, [window.site]);

    const getWorkshop = (item) => {
        setIsLoading(true);
        let payload = item === "all-type" || item === "" ? {} : { departments: item }
        axios
            .post(
                lambda +
                "/workshops?appname=" +
                appname +
                "&userid=" +
                localStorage.getItem("userId") +
                "&token=" +
                localStorage.getItem("token"), payload
            )
            .then((response) => {
                // const colorData = response.data.result.data.filter((item) => item.departments === "cutting")
                setValue(response.data.result.data);
                setIsLoading(false);

            })
            .catch((error) => {
                console.log("Error" + error);
            });
    };
    const handlePageChange = (page) => {
        GetTimeActivity();
        setCurrentPage(page);
    };
    const handleLoadMore = () => {
        if (visibleItems >= value.length) {
            setRemoveLoad(true)
        }
        setVisibleItems(prevVisibleItems => prevVisibleItems + 20);
    };
    const handlePerRowsChange = (newPerPage) => {
        GetTimeActivity();
        setRowsPerPage(newPerPage);
    };

    const handleEditWorkshop = (e, id) => {
        history.push("/editworkshop/" + id);
    };
    const handleViewWorkshop = (e, id) => {
        history.push("/viewworkshop/" + id);
    };
    const handleAddWorkshop = (e) => {
        history.push("/addworkshop");
    };
    const handleDelete = (e) => {
        setIsLoading(true);
        axios
            .delete(
                lambda +
                "/deleteworkshop?appname=" +
                appname +
                "&userid=" +
                localStorage.getItem("userId") +
                "&token=" +
                localStorage.getItem("token") +
                "&workshopid=" +
                deleteId
            )
            .then((response) => {
                if (response.data.statusCode === 200) {
                    getWorkshop("Cutting");
                    setIsdelete(false);
                    setIsLoading(false);
                }else{
                    if (response?.data?.result === "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                }
                }
            })
            .catch((error) => {
                console.log("Error" + error);
            });
    };

    const handleDeleteWorkshop = (e, id) => {
        setDeleteId(id);
        setIsdelete(true);
    };
    const columns = [
        {
            name: "Name",
            selector: (row) => row.name,
        },

        {
            name: "departments",
            selector: (row) => row.departments,
        },
        {
            name: "Phone Number",
            selector: (row) => row.phonenumber,
        },

        {
            name: "Status",
            selector: (row) => row.status,
        },

        {
            name: "ACTIONS",
            cell: (row) => (
                <div className="d-flex justify-content-between">
                    <a
                        onClick={(e) => handleViewWorkshop(e, row.workshopid)}
                        className="text-success action-button"
                    >
                        <i className="mdi mdi-eye font-size-18"></i>
                    </a>

                    <a
                        onClick={(e) => handleEditWorkshop(e, row.workshopid)}
                        className="text-success action-button"
                    >
                        <i className="mdi mdi-pencil font-size-18"></i>
                    </a>
                    {row.status === "ARCHIVE" ? null : (
                        <a
                            onClick={(e) => handleDeleteWorkshop(e, row.workshopid)}
                            className="text-success action-button"
                        >
                            <i className="mdi mdi-delete font-size-18"></i>
                        </a>
                    )}
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
                        No users were found for the searched keyword
                    </p>
                </div>{" "}
            </div>
        );
    };
    const onCancel = () => {
        setIsdelete(false);
    };

    const handleChange = (e) => {
        setWorkshopSearch(e.target.value);
    };

console.log("workshopsearch",workshopsearch)
    const handleSearch = (e, flagggg) => {
        GetTimeActivity();
        setIsLoading(true);
        if (flagggg === "click") {
            setSearchedFlag(true);
        }
        if (!workshopsearch && workshopsearch.length === 0 && workshopsearch.trim() === "") {
            setValue([])
            setIsLoading(false);
        } else {
            console.log("came to else")
            let obj={
                name:workshopsearch
            }
            const token = localStorage.getItem("token");
            const userid = localStorage.getItem("userId");

            let urlLink =
                lambda +
                "/workshops?appname=" +
                appname +
                "&token=" +
                token +
                "&userid=" +
                userid;

            axios({
                method: "POST",
                url: urlLink,
                data: obj,
            }).then(function (response) {
                if (response?.data?.result === "Invalid token or Expired") {
                    setShowSessionPopupup(true);
                    setIsLoading(false);
                } else {
                    if (workshopsearch && workshopsearch) {
                        setActiveBtn("")
                    }
                    setValue(response.data.result.data);
                    console.log("value----->", value.length)
                    setIsLoading(false);
                }
            });
        }
    };
    const handleReset = () => {
        GetTimeActivity();
        setWorkshopSearch("");
        setSearchedFlag(false);
        setActiveBtn("Cutting")

        getWorkshop('Cutting');
    };
    const userActivity = () => {
        let path = window.location.pathname.split("/");
        // const pageName = id != undefined ? path[path.length - 2] : path[path.length - 1];;
        var presentTime = moment();
        let payload;

        payload = {
            "userid": localStorage.getItem("userId"),
            "pagename": "WORKSHOP",
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
    const GetLookUp = async () => {
        GetTimeActivity();
        //  let payload = { type: [type] }

        setIsLoading(true)

        const token = localStorage.getItem("token");
        const linkUrl = `${lambda}/lookups?appname=${appname}&token=${token}&userid=${localStorage.getItem("userId")}`;

        axios({
            method: 'POST',
            url: linkUrl,
            //data: payload,
        })
            .then(function (response) {
                if (response?.data?.result === "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    let data = response?.data?.result?.data
                    const uniqueData = data?.filter((item) => item.type === "department")
                    setData(uniqueData);

                    console.log('uniqueData', uniqueData)

                    setIsLoading(false);


                }
            });
    }

    const handleToggle = (button) => {
        if (button === "grid") {
            setActiveButton("grid")
        } else if (button === "list") {
            setActiveButton('list')
        }

    }

    const handleClick = (name) => {
        setActiveBtn(name)
        getWorkshop(name)
    }
    return (
        <>
            {showSessionPopupup && <SessionPopup />}
            <div id="layout-wrapper">
                <Header />
                <Sidebar />
                <Modal className="access-denied" show={isDelete}>

                    <div className="modal-body enquiry-form">
                        <div className="container">
                            <button className="close-btn" onClick={e => onCancel()}><span className="material-icons">close</span></button>
                            <span className="material-icons access-denied-icon">delete_outline</span>
                            <h3>Delete</h3>
                            <p>This action cannot be undone.</p>
                            <p>Are you sure you want to delete ?</p>
                            <div className="popup-footer">
                                <button className="fill_btn yellow-gradient" data-bs-toggle="modal" data-bs-target="#recommendModal" onClick={e => handleDelete()}> {isLoading ? (<img src={image + Config.imgloader + "rotate_right.svg"} className="loading-icon" />) : null}Yes, Delete</button>
                            </div>
                        </div>
                    </div>

                </Modal>
                {activeButton === "grid" ? (
                    <>
                        {isLoading ?
                            <> <Loader /></> :
                            <div className="main-content user-management lookups workshops">

                                <div className="page-content">
                                    <div className="container-fluid">



                                        <div className="row mb-4 breadcrumb">
                                            <div className="col-lg-12">
                                                <div className="d-flex align-items-center">

                                                    <div className="d-flex align-items-center flex-grow-1 page-title-sec">
                                                        <h6 className="mb-2 card-title">workshop</h6>


                                                        <button onClick={handleAddWorkshop} className="btn btn-info btn-primary ms-3 rounded-4 px-3  py-2 btn-sm" ><span>+&nbsp;</span>CREATE</button>


                                                    </div>
                                                    <div className="page-actions">
                                                        <div className="mt-4 mt-sm-0 float-sm-end d-sm-flex align-items-center">

                                                            <div className="search-box me-2">
                                                                <div className="position-relative">
                                                                    <input type="text" className="form-control border-0" name="name" placeholder="Search" value={workshopsearch} onChange={(e) => handleChange(e)} />
                                                                    <button className="fill_btn" onClick={(e) => handleSearch(e, "click")}><span className="material-icons search-icon">search</span></button>
                                                                </div>
                                                                <div className="position-relative">
                                                                    <button className="fill_btn" onClick={handleReset}><span className="material-icons-outlined">sync</span>Reset</button>
                                                                </div>
                                                            </div>
                                                            {/* <ul className="nav nav-pills product-view-nav justify-content-end mt-3 mt-sm-0">
                                                                 <li className="nav-item">
                                                                     <a className={`nav-link${activeButton === 'grid' ? ' active' : ''}`} onClick={() => { handleToggle('grid') }} href="#"><i className="bx bx-grid-alt"></i></a>
                                                                 </li>
                                                                 <li className="nav-item">
                                                                     <a className={`nav-link ${activeButton === 'list' ? 'active' : ''}`} onClick={() => handleToggle('list')} href="#"><i className="bx bx-list-ul"></i></a>
                                                                 </li>
                                                             </ul> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row table-data">
                                            <div className="col-12">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="lookup_sort">
                                                            {data.map((item, index) => {
                                                                return (
                                                                    <button key={index} className={`btn btn-info btn-primary rounded-4 ${activeBtn === item.name ? 'outline-button-active' : 'outline-button'}`} onClick={() => handleClick(item.name)} disabled={searchedFlag}>
                                                                        {item.name}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                        <div className="row sort_body">
                                                            {value.length > 0 ? (
                                                                value.slice(0, visibleItems).map((item, index) => (
                                                                    <div className="col-md-3" key={index}>
                                                                        <div className="btn-group">
                                                                            <>
                                                                                <button
                                                                                    type="button"
                                                                                    className={item.status === "INACTIVE" || item.status === "ARCHIVE" ? "btn btn-secondary dropdown-toggle disable" : "btn btn-secondary dropdown-toggle"}
                                                                                    data-bs-toggle="dropdown"
                                                                                    aria-expanded="false"
                                                                                >
                                                                                    {item.name}
                                                                                    <span className="material-icons-outlined">expand_more</span>
                                                                                </button>

                                                                                <ul className="dropdown-menu dropdown-menu-end">
                                                                                    <li>
                                                                                        <button
                                                                                            className="dropdown-item"
                                                                                            type="button"
                                                                                            onClick={(e) => handleEditWorkshop(e, item.workshopid)}
                                                                                        >
                                                                                            <i className="mdi mdi-pencil font-size-18"></i>Edit
                                                                                        </button>
                                                                                    </li>
                                                                                    <li>
                                                                                        <button
                                                                                            className="dropdown-item"
                                                                                            type="button"
                                                                                            onClick={(e) => handleViewWorkshop(e, item.workshopid)}
                                                                                        >
                                                                                            <i className="mdi mdi-eye font-size-18"></i>View
                                                                                        </button>
                                                                                    </li>
                                                                                    {item.status === "ARCHIVE" ? null : (
                                                                                        <li>
                                                                                            <button
                                                                                                className="dropdown-item"
                                                                                                type="button"
                                                                                                onClick={(e) => handleDeleteWorkshop(e, item.workshopid)}
                                                                                            >
                                                                                                <i className="mdi mdi-trash-can font-size-18"></i>Delete
                                                                                            </button>
                                                                                        </li>
                                                                                    )}
                                                                                </ul>
                                                                            </>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div>
                                                                    <div className="empty-state-body empty-record">
                                                                        <div className="empty-state__message">
                                                                            <span className="material-icons">summarize</span>
                                                                            <p className="form-check font-size-16">
                                                                                No workshops were found for the searched keyword
                                                                            </p>
                                                                        </div>{" "}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div>
                                                                {(value && value.length > 20 && removeLoad === false) &&
                                                                    <div className="load_more"> <button onClick={handleLoadMore}>LoadMore</button></div>
                                                                }
                                                            </div>
                                                        </div>


                                                    </div>

                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>


                                <Footer />
                            </div>}</>
                ) : (
                    <div className="main-content user-management">
                        <div className="page-content">

                            <div className="container-fluid">

                                <div className="row mb-4 breadcrumb">
                                    <div className="col-lg-12">
                                        <div className="d-flex align-items-center">
                                            <div className="d-flex flex-grow-1">
                                                <h6 className=" card-title my-1">WorkShops</h6>
                                                <button type="button" onClick={e => handleAddWorkshop(e)} className="btn btn-info ms-3 rounded-4 px-3  py-2 btn-sm" ><span>+&nbsp;</span>CREATE</button>
                                            </div>

                                        </div>
                                        {/* <ul className="nav nav-pills product-view-nav justify-content-end mt-3 mt-sm-0">
                                             <li className="nav-item">
                                                 <a className={`nav-link${activeButton === 'grid' ? ' active' : ''}`} onClick={() => { handleToggle('grid') }} href="#"><i className="bx bx-grid-alt"></i></a>
                                             </li>
                                             <li className="nav-item">
                                                 <a className={`nav-link ${activeButton === 'list' ? 'active' : ''}`} onClick={() => handleToggle('list')} href="#"><i className="bx bx-list-ul"></i></a>
                                             </li>
                                         </ul> */}
                                    </div>
                                </div>
                                <div className="row table-data">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="row mb-2">
                                                    {/* <div className="col-sm-2"> */}
                                                    {/* <button type="button"
                                                               className="btn btn-success btn-rounded waves-effect waves-light mb-2 me-2">DELETE</button> */}
                                                    {/* </div> */}
                                                    <div className="col-sm-12">
                                                        <div className="search-box mb-5 d-inline-block">
                                                            <div className="position-relative">
                                                                <input type="text" name="name" className="form-control" onChange={(e) => handleChange(e)} value={workshopsearch.name} />
                                                                <select className="form-select" name="departments" aria-label="Default select example" onChange={(e) => handleChange(e)} value={workshopsearch.departments}>
                                                                    <option value="">Departments </option>
                                                                    <option value="sewing">sewing</option>
                                                                    <option value="cutting"> cutting</option>

                                                                </select>
                                                                <select className="form-select" name="status" aria-label="Default select example" onChange={(e) => handleChange(e)} value={workshopsearch.status}>
                                                                    <option selected>Status </option>
                                                                    <option value="ACTIVE">ACTIVE</option>
                                                                    <option value="INACTIVE"> INACTIVE</option>

                                                                </select>
                                                                <button className="fill_btn" onClick={(e) => handleSearch(e, "click")}><span className="material-icons search-icon">search</span></button>
                                                            </div>

                                                            <div className="dataTables_length" id="datatable_length">
                                                                <button className="fill_btn" onClick={handleReset}><span className="material-icons-outlined">sync</span>Reset</button>
                                                            </div>

                                                        </div>
                                                        <div className="text-sm-end">
                                                        </div>
                                                    </div>
                                                </div>
                                                <DataTable
                                                    // title=""
                                                    columns={columns}
                                                    //className="table align-middle table-nowrap table-check"

                                                    data={value}
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
                                                    paginationTotalRows={value.length}
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

                    </div>




                )}


            </div >

        </>
    );
};
export default WorkShops;
