/***
**Module Name: lookup
 **File Name :  lookup.js
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
 **Description : contains lookup table details.
 ***/
 import React, { useState, useEffect, useContext } from "react";


 import Footer from "../../components/dashboard/footer";
 import Header from "../../components/dashboard/header";
 import Sidebar from "../../components/dashboard/sidebar";
 import tmdbApi from "../../api/tmdbApi";
 import { useHistory, Link, useLocation } from "react-router-dom";
 import axios from 'axios';
 import SweetAlert from 'react-bootstrap-sweetalert';
 import * as Config from "../../constants/Config";
 import Loader from "../../components/loader";
 import { contentContext } from "../../context/contentContext";
 import SessionPopup from "../SessionPopup"
 import DataTable from 'react-data-table-component';
 
 let { lambda, appname } = window.app;
 
 
 
 const LookUp = () => {
     const history = useHistory();
     const { state } = useLocation();
     const { search } = state || {};
     const [lookup, setLookUp] = useState("");
 
     const [success, setSuccess] = useState(false);
     const [data, setData] = useState([]);
 
     const [dummy, setDummy] = useState([]);
 
     //const [currentPage, setcurrentPage] = useState(1);
 
 
     const [itemsPerPage, setitemsPerPage] = useState(10);
 
     const [pageNumberLimit, setpageNumberLimit] = useState(5);
     const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
     const [minPageNumberLimit, setminPageNumberLimit] = useState(0);
     const [lookUpType, setlookUpType] = useState("");
     const [sortDirection, setSortDirection] = useState('asc');
     const [arrowdir, setArrowDir] = useState('down');
     const [num, setNum] = useState();
 
 
     const [flag, setFlag] = useState(false);
     const [isLoading, setIsLoading] = useState(false);
 
     const [showSessionPopupup, setShowSessionPopupup] = useState(false);
 
     const [typecount, setTypeCount] = useState(0);
 
     let count = 0;
 
     const { userData, sortTableAlpha, arrow, lookupsearch, setLookupSearch, currentPage, setcurrentPage, setSelectedOptions, setMultiSelectFields, setActiveFieldsObj, setSelectedOptionsClientName, setSearchPayload , setActiveMenuId,GetTimeActivity} = useContext(contentContext);
 
 
 
     const validateObj = userData && userData.permissions && userData.permissions.length > 0 && userData.permissions.filter(eachItem => eachItem.menu == "Lookups")
     const subValDashboard = validateObj && validateObj[0] && validateObj[0].dashboard
     console.log('validate obj', subValDashboard)
 
     const columns = [
         {
            //  cell: (props) => <button onClick={(e) => handleButtonClick(e, props)}>Action</button>,
             cell: (props) => <div className="d-flex">
             {subValDashboard && subValDashboard.view && subValDashboard.view.display === true &&
                 <a className={`${subValDashboard && subValDashboard.view && subValDashboard.view.enable === false ? 'pe-none' : ''} text-success action-button`}><i className="mdi mdi-eye font-size-18"></i></a>}
             {subValDashboard && subValDashboard.edit && subValDashboard.edit.display === true &&
                 <a onClick={e => handleEditLookup(e, props.lookupcode)} className={`${subValDashboard && subValDashboard.edit && subValDashboard.edit.enable === false ? 'pe-none' : ''} text-danger action-button`}><i className="mdi mdi-pencil font-size-18"></i></a>}
         </div>,
             ignoreRowClick: true,
             allowOverflow: true,
             button: true,
         },
         {
             name: 'Title',
             selector: row => row.title,
             sortable: true,
         },
         {
             name: 'Year',
             selector: row => row.year,
             sortable: true,
         },
         {
             name: 'Image',
             cell: (props) => <img src={props.image} width={60} alt='Image' />,
         },
     ];
     const data2 = [
         {
             id: 1,
             title: 'Beetlejuice',
             year: '1988',
             "image": "https://i.ytimg.com/vi/uRXmA10PYM0/maxresdefault.jpg"
         },
         {
             id: 2,
             title: 'Ghostbusters',
             year: '1984',
             "image": "https://i.ytimg.com/vi/uRXmA10PYM0/maxresdefault.jpg"
         },
         {
             id: 14,
             title: 'Beetlejuice',
             year: '1988',
             "image": "https://i.ytimg.com/vi/uRXmA10PYM0/maxresdefault.jpg"
         },
         {
             id: 24,
             title: 'Ghostbusters',
             year: '1984',
             "image": "https://i.ytimg.com/vi/uRXmA10PYM0/maxresdefault.jpg"
         },
         {
             id: 15,
             title: 'Beetlejuice',
             year: '1988',
             "image": "https://i.ytimg.com/vi/uRXmA10PYM0/maxresdefault.jpg"
         },
         {
             id: 25,
             title: 'Ghostbusters',
             year: '1984',
             "image": "https://i.ytimg.com/vi/uRXmA10PYM0/maxresdefault.jpg"
         },
         {
             id: 16,
             title: 'Beetlejuice',
             year: '1988',
             "image": "https://i.ytimg.com/vi/uRXmA10PYM0/maxresdefault.jpg"
         },
         {
             id: 26,
             title: 'Ghostbusters',
             year: '1984',
             "image": "https://i.ytimg.com/vi/uRXmA10PYM0/maxresdefault.jpg"
         },
         {
             id: 17,
             title: 'Beetlejuice',
             year: '1988',
             "image": "https://i.ytimg.com/vi/uRXmA10PYM0/maxresdefault.jpg"
         },
         {
             id: 27,
             title: 'Ghostbusters',
             year: '1984',
             "image": "https://i.ytimg.com/vi/uRXmA10PYM0/maxresdefault.jpg"
         },
         {
             id: 18,
             title: 'Beetlejuice',
             year: '1988',
             "image": "https://i.ytimg.com/vi/uRXmA10PYM0/maxresdefault.jpg"
         },
         {
             id: 28,
             title: 'Ghostbusters',
             year: '1984',
             "image": "https://i.ytimg.com/vi/uRXmA10PYM0/maxresdefault.jpg"
         },
         {
             id: 19,
             title: 'Beetlejuice',
             year: '1988',
             "image": "https://i.ytimg.com/vi/uRXmA10PYM0/maxresdefault.jpg"
         },
         {
             id: 29,
             title: 'Ghostbusters',
             year: '1984',
             "image": "https://i.ytimg.com/vi/uRXmA10PYM0/maxresdefault.jpg"
         },
         {
             id: 10,
             title: 'Beetlejuice',
             year: '1988',
             "image": "https://i.ytimg.com/vi/uRXmA10PYM0/maxresdefault.jpg"
         },
         {
             id: 20,
             title: 'Ghostbusters',
             year: '1984',
             "image": "https://i.ytimg.com/vi/uRXmA10PYM0/maxresdefault.jpg"
         },
         {
             id: 11,
             title: 'Beetlejuice',
             year: '1988',
             "image": "https://i.ytimg.com/vi/uRXmA10PYM0/maxresdefault.jpg"
         },
         {
             id: 21,
             title: 'Ghostbusters',
             year: '1984',
             "image": "https://i.ytimg.com/vi/uRXmA10PYM0/maxresdefault.jpg"
         },
         {
             id: 12,
             title: 'Beetlejuice',
             year: '1988',
             "image": "https://i.ytimg.com/vi/uRXmA10PYM0/maxresdefault.jpg"
         },
         {
             id: 22,
             title: 'Ghostbusters',
             year: '1984',
             "image": "https://i.ytimg.com/vi/uRXmA10PYM0/maxresdefault.jpg"
         },
     ]
 
     const handleClick = (event) => {
         setcurrentPage(Number(event.target.id));
     };
 
 
 
     const pages = [];
     for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
         pages.push(i);
     }
 
     const indexOfLastItem = currentPage * itemsPerPage;
     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
     const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);
 
 
 
     const renderPageNumbers = pages.map((number) => {
         if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
 
             return (
                 <li
                     key={number}
                     id={number}
                     onClick={handleClick}
                     className={currentPage == number ? "active" : null}
                 >
                     {number}
                 </li>
             );
         } else {
             return null;
         }
     });
 
 
     useEffect(() => {
         if (!localStorage.getItem("token")) {
             history.push("/");
         }
         if (search === true) {
             handleSearch();
         } else {
             GetLookUp();
         }
         setSelectedOptions([])
         setMultiSelectFields({ dubbinglanguages: [], typeofrights: [], countryorigin: [], languages: [], typeofrights: [], genre: [], videoquality: [], certificate: [], subtitleslanguages: [], territoriesavailable: [], sport: [], musicgenre: [] })
         setActiveFieldsObj({ CookingshowActive: false, seriesActive: false, SportsActive: false, LiveEventActive: false, MusicActive: false })
         setSelectedOptionsClientName([])
         setSearchPayload({})
     }, []);
 
     useEffect(() => {
         // setcurrentPage(1)
     }, [data]);
 
 
     const GetLookUp = async (e) => {
         console.log("lookUpType", lookUpType);
         let payload = lookUpType === "all-type" || lookUpType === "" ? {} : { type: [lookUpType] }
         setIsLoading(true)
         const token = localStorage.getItem("token");
         const userId = localStorage.getItem("userId");
         const commonParams = `appname=${appname}&assetcount=${itemsPerPage}&pageNumber=${currentPage}&token=${token}&userid=${userId}`;
         const searchParam = lookupsearch && flag ? `&search=${lookupsearch}` : "";
         const linkUrl = `${lambda}/lookups?${commonParams}${searchParam}`;
         
         axios({
             method: 'POST',
             url: linkUrl,
             data: payload,
         })
             .then(function (response) {
                 console.log("res1")
                 if (response?.data?.result === "Invalid token or Expired") {
                     setShowSessionPopupup(true)
                 } else {
                     setData(response.data.result.data);
                     setLookUp(response.data.result);
                     setDummy(response.data.result.data);
                     setIsLoading(false)
                     setLookupSearch("");
                 }
             });
     }
 
 
     const handleLookUpType = async (e) => {
         setlookUpType(e.target.value);
         setcurrentPage(1);
         setmaxPageNumberLimit(5);
         setminPageNumberLimit(0);
 
         let arr1 = [];
         if (e.target.value === "all-type") {
             setData(dummy);
             setTypeCount(0)
         } else {
             dummy.map((item1) => {
                 if (item1.type == e.target.value) {
                     arr1.push(item1)
                 }
             });
 
             setData(arr1);
             setTypeCount(arr1.length);
 
 
         }
 
 
     }
 
 
     const PageLoad = (e) => {
         const pagevalue = e.target.value;
         setitemsPerPage(pagevalue);
         setcurrentPage(1);
 
     }
 
 
 
     const handleNextbtn = () => {
         setcurrentPage(currentPage + 1);
 
         if (currentPage + 1 > maxPageNumberLimit) {
             setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
             setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
         }
         //  handleClick(currentPage + 1);
     };
 
     const handlePrevbtn = () => {
         setcurrentPage(currentPage - 1);
 
         if ((currentPage - 1) % pageNumberLimit == 0) {
             setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
             setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
         }
         //  handleClick(currentPage - 1);
     };
 
     let pageIncrementBtn = null;
     if (pages.length > maxPageNumberLimit) {
         pageIncrementBtn = <li onClick={handleNextbtn}> &hellip; </li>;
     }
 
     let pageDecrementBtn = null;
     if (minPageNumberLimit >= 1) {
         pageDecrementBtn = <li onClick={handlePrevbtn}> &hellip; </li>;
     }
 
     const handleSearch = (e, flagggg) => {
         if (flagggg) {
             setcurrentPage(1);
         }
         setmaxPageNumberLimit(5);
         setminPageNumberLimit(0);
         if (lookupsearch === "") {
             GetLookUp();
         }
         else {
             const token = localStorage.getItem("token")
             setIsLoading(true)
             let lookupobj = lookUpType.length > 0 && lookUpType !== "all-type" ? lookUpType : "";
             axios.post(lambda + '/lookups?appname=' + appname + "&assetcount=" + itemsPerPage + "&pageNumber=" + currentPage + "&search=" + lookupsearch + "&token=" + token + "&userid=" + localStorage.getItem("userId"), {
                 type: lookupobj ? [lookupobj] : ""
             })
                 .then(function (response) {
 
                     console.log("res", response)
                     if (response.result === "No content found" || response.result.length <= 0) {
                         setSuccess(true);
                         setIsLoading(false)
 
                     } else if (response?.data?.result === "Invalid token or Expired") {
                         setShowSessionPopupup(true)
                     } else {
                         console.log("response", response.data.result);
                         setData(response.data.result.data);
                         setLookUp(response.data.result);
                         setIsLoading(false)
                     }
                 });
         }
     }
     function onConfirm() {
         setSuccess(false);
 
     };
     const handleChange = (e) => {
         if (e.target.value === "") {
             GetLookUp();
         }
         setLookupSearch(e.target.value);
         //setcurrentPage(1);
     }
 
     const handleAddLookUp = (e) => {
         history.push("/addlookup");
     }
     const handleEditLookup = (e, id) => {
         history.push("/editlookup/" + id);
     }
 
     const handleKeypress = (e) => {
         //it triggers by pressing the enter key
 
         if ((e.key === "Enter")) {
             setTimeout(function () {
                 handleSearch();
             }, 1000);
         }
     };
 
     const clearSearch = () => {
         setLookupSearch("");
         GetLookUp();
         setcurrentPage(1);
     }
 
     const sortArray = (e, filedname) => {
         if (filedname === "name") {
             setNum(0)
             const sortedData = [...data].sort((a, b) =>
                 sortDirection === 'asc'
                     ? a.name.localeCompare(b.name, undefined, { numeric: true })
                     : b.name.localeCompare(a.name, undefined, { numeric: true })
             );
             setData(sortedData);
             setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
             setArrowDir(arrowdir === 'down' ? 'up' : 'down');
         }
         else if (filedname === "type") {
             setNum(1);
             const sortedData = [...data].sort((a, b) =>
                 sortDirection === 'asc'
                     ? a.type.localeCompare(b.type, undefined, { numeric: true })
                     : b.type.localeCompare(a.type, undefined, { numeric: true })
             );
             setData(sortedData);
             setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
             setArrowDir(arrowdir === 'down' ? 'up' : 'down');
         }
 
         else if (filedname === "status") {
             setNum(2);
             const sortedData = [...data].sort((a, b) =>
                 sortDirection === 'asc'
                     ? a.status.localeCompare(b.status, undefined, { numeric: true })
                     : b.status.localeCompare(a.status, undefined, { numeric: true })
             );
             setData(sortedData);
             setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
             setArrowDir(arrowdir === 'down' ? 'up' : 'down');
         }
 
 
 
     }
     const handleButtonClick = (e, row) => {
         console.log('clicked', e, row);
     };
 
 
     return (
         <>
             {showSessionPopupup && <SessionPopup />}
             <div id="layout-wrapper">
                 <Header />
                 <Sidebar />
                 {isLoading ?
                     <Loader />
                     :
                     <div className="main-content user-management lookups">
 
                         <div className="page-content">
                             <div className="container-fluid">
 
 
 
                                 <div className="row mb-4 breadcrumb">
                                     <div className="col-lg-12">
                                         <div className="d-flex align-items-center">
 
                                             <div className="flex-grow-1">
                                                 <h4 className="mb-2 card-title">lookups</h4>
 
                                             </div>
                                             {subValDashboard && subValDashboard.Add && subValDashboard.Add.display === true &&
                                                 <div>
                                                     <button onClick={handleAddLookUp} className="btn btn-primary" disabled={subValDashboard && subValDashboard.Add && subValDashboard.Add.enable === false}>add lookups</button>
                                                 </div>
                                             }
                                         </div>
                                     </div>
                                 </div>
 
                                 <div className="row table-data">
                                     <div className="col-12">
                                         <div className="card">
                                             <div className="card-body">
                                                 <div className="row mb-2">
                                                     <div className="col-sm-4">
                                                         <select name="Type-search" value={lookUpType} id="dropdown" className="custom-select custom-select-sm form-control form-control-sm form-select form-select-sm" onChange={e => handleLookUpType(e)}>
                                                             <option value="all-type">All Types</option>
                                                             <option value="certificate">Certificate</option>
                                                             <option value="country">Country</option>
                                                             <option value="cuisine">Cuisine</option>
                                                             <option value="genre">Genre</option>
                                                             <option value="language">Language</option>
                                                             <option value="musicgenre">Musicgenre</option>
                                                             <option value="rights">Rights</option>
                                                             <option value="resolution">Resolution</option>
                                                             <option value="sports">Sports</option>
                                                             <option value="territories">Territories</option>
                                                             <option value="videoformat">Video Format</option>
                                                         </select>
                                                     </div>
                                                     <div className="col-sm-8">
                                                         <div className="search-box mb-2 d-inline-block">
                                                             <div className="position-relative">
                                                                 <input type="text" className="form-control" value={lookupsearch} onChange={(e) => handleChange(e)} onKeyPress={handleKeypress} placeholder="Search LookUp" />
                                                                 <button className="fill_btn"><span className="material-icons search-icon" onClick={(e) => handleSearch(e, "click")}>search</span></button>
                                                             </div>
                                                             <div className="dataTables_length" id="datatable_length">
                                                                 <button className="fill_btn" onClick={clearSearch}><span className="material-icons-outlined">sync</span>Reset</button>
                                                             </div>
                                                             <div className="dataTables_length" id="datatable_length">
                                                                 <label>
                                                                     <select name="datatable_length" aria-controls="datatable" placeholder="Per Page" className="custom-select custom-select-sm form-control form-control-sm form-select form-select-sm" onChange={e => PageLoad(e)} value={itemsPerPage}>
                                                                         <option value="10">10</option>
                                                                         <option value="25">25</option>
                                                                         <option value="50">50</option>
                                                                         <option value="100">100</option>
                                                                     </select></label>
                                                             </div>
                                                         </div>
                                                         <div className="text-sm-end">
 
                                                         </div>
                                                     </div>
                                                 </div>
 
                                                 <div className="table-responsive">
                                                     <table className="table align-middle table-nowrap table-check" id="table">
                                                         <thead className="table-light">
                                                             <tr>
 
                                                                 <th className="align-middle" onClick={(e) => sortArray(e, "name")}>Name {arrowdir === "up" && num === 0 ? <span className="material-symbols-outlined">
                                                                     arrow_upward
                                                                 </span> : <span className="material-symbols-outlined">
                                                                     arrow_downward
                                                                 </span>}</th>
 
                                                                 <th className="align-middle" onClick={(e) => sortArray(e, "type")}>TYPE {arrowdir === "up" && num === 1 ? <span className="material-symbols-outlined">
                                                                     arrow_upward
                                                                 </span> : <span className="material-symbols-outlined">
                                                                     arrow_downward
                                                                 </span>}</th>
                                                                 <th className="align-middle" onClick={(e) => sortArray(e, "status")}>status {arrowdir === "up" && num === 1 ? <span className="material-symbols-outlined">
                                                                     arrow_upward
                                                                 </span> : <span className="material-symbols-outlined">
                                                                     arrow_downward
                                                                 </span>}</th>
 
 
                                                                 {subValDashboard && subValDashboard.view && subValDashboard.edit && (subValDashboard.view.display === true || subValDashboard.edit.display === true) &&
                                                                     <th className="align-middle">Actions</th>}
                                                             </tr>
                                                         </thead>
                                                         <tbody>
 
                                                             {currentItems && currentItems.length > 0 && currentItems.map(function (item, i) {
 
                                                                 return (
                                                                     <tr key={i}>
 
                                                                         <td>{item.name}</td>
                                                                         <td>
 
                                                                             <button type="button" className="btn btn-primary btn-sm btn-rounded text-primary" data-bs-toggle="modal" data-bs-target=".orderdetailsModal">
                                                                                 {item.type}
                                                                             </button>
                                                                         </td>
 
                                                                         <td>
                                                                             <span className="badge badge-pill badge-soft-success font-size-12">{item.status}</span>
                                                                         </td>
                                                                         {subValDashboard && subValDashboard.view && subValDashboard.edit && (subValDashboard.view.display === true || subValDashboard.edit.display === true) &&
                                                                             <td>
                                                                                 <div className="d-flex">
                                                                                     {subValDashboard && subValDashboard.view && subValDashboard.view.display === true &&
                                                                                         <a className={`${subValDashboard && subValDashboard.view && subValDashboard.view.enable === false ? 'pe-none' : ''} text-success action-button`}><i className="mdi mdi-eye font-size-18"></i></a>}
                                                                                     {subValDashboard && subValDashboard.edit && subValDashboard.edit.display === true &&
                                                                                         <a onClick={e => handleEditLookup(e, item.lookupcode)} className={`${subValDashboard && subValDashboard.edit && subValDashboard.edit.enable === false ? 'pe-none' : ''} text-danger action-button`}><i className="mdi mdi-pencil font-size-18"></i></a>}
                                                                                 </div>
                                                                             </td>
                                                                         }
                                                                     </tr>
 
                                                                 )
                                                             })}
 
 
                                                         </tbody>
 
                                                     </table>
                                                 </div>
                                                 <div className="row pagination-block">
                                                     <div className="col-md-5">
                                                         <div className="dataTables_info" id="datatable-buttons_info" role="status" aria-live="polite">Showing {lookup.totalCount === 0 ? indexOfFirstItem : indexOfFirstItem + 1} to {(typecount && typecount < indexOfLastItem) ? typecount : lookup.totalCount < indexOfLastItem ? lookup.totalCount : indexOfLastItem} of {typecount ? typecount : lookup.totalCount}  entries</div>
                                                     </div>
                                                     <div className="col-md-7">
                                                         <ul className="pageNumbers pagination pagination-rounded justify-content-end mb-2">
                                                             <li className="arrow-buttons">
                                                                 <button
                                                                     onClick={handlePrevbtn}
                                                                     disabled={currentPage == pages[0] ? true : false}
                                                                 >
                                                                     <span className="material-icons-outlined">chevron_left</span>
                                                                 </button>
                                                             </li>
                                                             {pageDecrementBtn}
                                                             {renderPageNumbers}
                                                             {pageIncrementBtn}
 
                                                             <li className="arrow-buttons">
                                                                 <button
                                                                     onClick={handleNextbtn}
                                                                     disabled={currentPage == pages[pages.length - 1] ? true : false}
                                                                 >
                                                                     <span className="material-icons-outlined">navigate_next</span>
                                                                 </button>
                                                             </li>
                                                         </ul>
                                                     </div>
                                                 </div>
 
                                             </div>
                                               < DataTable 
                                                 title="Movie List - Custom Cells"
                                                 columns={columns}
                                                 data={data2}
                                                 direction="auto"
                                                 fixedHeaderScrollHeight="300px"
                                                 pagination
                                                 responsive
                                                 selectableRows
                                                 subHeaderAlign="right"
                                                 subHeaderWra
                                             />
                                         </div>
                                     </div>
                                 </div>
 
 
                             </div>
                         </div>
 
                         <SweetAlert show={success}
                             custom
                             confirmBtnText="ok"
                             confirmBtnBsStyle="primary"
                             title={"No Results Found"}
                             onConfirm={e => onConfirm()}
                         >
                         </SweetAlert>
                         <Footer />
                     </div>
 
 
                 }
             </div>
         </>
     );
 };
 
 export default LookUp;
 