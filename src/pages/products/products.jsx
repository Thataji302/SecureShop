/***
**Module Name: products
 **File Name :  products.js
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
 **Description : contains products table details.
 ***/
 import React, { useState, useEffect, useContext } from "react";


 import Footer from "../../components/dashboard/footer";
 import Header from "../../components/dashboard/header";
 import Sidebar from "../../components/dashboard/sidebar";
 import tmdbApi from "../../api/tmdbApi";
 import moment from "moment";
 
 import { useHistory, Link, useLocation } from "react-router-dom";
 import axios from 'axios';
 import SweetAlert from 'react-bootstrap-sweetalert';
 import * as Config from "../../constants/Config";
 import TableLoader from "../../components/tableLoader";
 import { contentContext } from "../../context/contentContext";
 import SessionPopup from "../SessionPopup"
 import DataTable from 'react-data-table-component';
 import Loader from "../../components/loader";
 
 let { lambda, appname } = window.app;
 
 
 
 const Products = () => {
     const history = useHistory();
     const { state } = useLocation();
     const { search } = state || {};
     const [lookup, setLookUp] = useState("");
 
     // const [data, setData] = useState([]);
 
     const [dummy, setDummy] = useState([]);
 
 
     // const [lookUpType, setlookUpType] = useState("");
 
     const [num, setNum] = useState();
 
     const [view, setView] = useState(true);
     const [image, setImg] = useState("");
     const [flag, setFlag] = useState(false);
     const [removeLoad, setRemoveLoad] = useState(false)
     const [visibleItems, setVisibleItems] = useState(12);
     // const [isLoading, setIsLoading] = useState(false);
     const [totalproducts, setTotalProducts] = useState(0);
     const [showSessionPopupup, setShowSessionPopupup] = useState(false);
 
     // const [route, setRoute] = useState("lookup");
 
     let count = 0;
 
     const { searchedFlag, setSearchedFlag, isLoading, setIsLoading, userData, sortTableAlpha, arrow, setSelectedOptions, data, setData, rowsPerPage, setRowsPerPage, currentPageNew, setCurrentPage, lookUpType, setlookUpType, lookupsearch, setLookupSearch, route, setRoute, usePrevious, sortedColumn, setSortedColumn, sortDirection, setSortDirection, setActiveMenuId, GetTimeActivity, productsearch, setProductSearch } = useContext(contentContext);
 
 
 
 
 
     const validateObj = userData && userData.permissions && userData.permissions.length > 0 && userData.permissions.filter(eachItem => eachItem.menu == "Lookups")
     const subValDashboard = validateObj && validateObj[0] && validateObj[0].dashboard
 
 
 
     const prevRoute = usePrevious(route)
     const keyForRerender = `${rowsPerPage}_${data.length}`;
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
         if (rowsPerPage != undefined) {
             handlePerRowsChange(rowsPerPage)
         }
     }, [rowsPerPage]);
     const location = useLocation();
 
     const handlePageChange = (page) => {
         setCurrentPage(page);
     };
 
     const handlePerRowsChange = (newPerPage) => {
         setRowsPerPage(newPerPage);
     };
 
     const handleSort = (column, direction) => {
 
         const columnKey = column.name.toLowerCase();
 
         setSortedColumn(columnKey);
         setSortDirection(direction);
 
         setData((prevData) => {
             const sorted = [...prevData];
 
             sorted.sort((a, b) => {
                 if (direction === 'asc') {
                     return a[columnKey] - b[columnKey];
                 } else {
                     return b[columnKey] - a[columnKey];
                 }
             });
 
             return sorted;
         });
     };
     const columns = [
        {
            name: 'Image',
            cell: (props) => <img src={
                 props && props?.images && image + props?.images[0]?.path + "?auto=compress,format&width=40"} alt='Image' />,
            sortable: false,
        },
        {
            name: 'item',
            selector: row => row?.productname ?? "",
            sortable: true,
        },
        //  {
        //      name: 'Item',
        //      // cell: (props) => <img src={props.images[0]} width={60} alt='Image' />,
        //      selector: row => row?.productname ?? "",
        //      sortable: true,
        //  },
         {
             name: 'Category',
             selector: row => row?.producttype ?? "",
             sortable: true,
         },
         {
             name: 'Price (USD)',
             selector: row => row?.price ?? "",
             sortable: true,
         },
         {
             name: 'SKU',
             selector: row => row?.sku ?? "",
             sortable: true,
         },
        //  {
        //      name: 'Count',
        //      selector: row => row?.count ?? "",
        //      sortable: true,
        //  },
         {
             name: 'Status',
             // cell: (props) => <img src={props.image} width={60} alt='Image' />,
             selector: row => row?.status ?? "",
             sortable: true,
 
         },
 
         {
             name: <>{(subValDashboard && subValDashboard.view && subValDashboard.view.display === true) || (subValDashboard && subValDashboard.edit && subValDashboard.edit.display === true) ? 'Actions' : null}</>,
             // cell: (props) => <button onClick={(e) => handleButtonClick(e, props)}>Action</button>,
             cell: (props) =>
                 // {
                 subValDashboard && subValDashboard.view && subValDashboard.edit && (subValDashboard.view.display === true || subValDashboard.edit.display === true) &&
 
                 <div className="d-flex">
                     {subValDashboard && subValDashboard.view && subValDashboard.view.display === true &&
 
                         <a
                         onClick={e => handleViewProduct(e, props.productid)}
                             className={`${subValDashboard && subValDashboard.view && subValDashboard.view.enable === false ? 'pe-none' : ''} text-success action-button`}><i className="mdi mdi-eye font-size-18"></i></a>}
                     {subValDashboard && subValDashboard.edit && subValDashboard.edit.display === true &&
                         <a
                             onClick={e => handleEditProduct(e, props.productid)}
                             className={`${subValDashboard && subValDashboard.edit && subValDashboard.edit.enable === false ? 'pe-none' : ''} text-danger action-button`}><i className="mdi mdi-pencil font-size-18"></i></a>
 
                     }
                 </div>
             // }
             ,
             ignoreRowClick: true,
             allowOverflow: true,
             button: true,
         },
     ];
 
 
     useEffect(() => {
         setRoute("products")
         setActiveMenuId(200003)
         if (!localStorage.getItem("token")) {
             history.push("/");
         }
         GetProducts();
         setSelectedOptions([])
         userActivity()
     }, []);
 
 
     const userActivity = () => {
         let path = window.location.pathname.split("/");
         const pageName = path[path.length - 1];
         var presentTime = moment();
         let payload;
 
         payload = {
             "userid": localStorage.getItem("userId"),
             "pagename":" PRODUCTS",
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
 
     const GetProducts = async (e) => {
         GetTimeActivity();
 
         setIsLoading(true)
 
         const token = localStorage.getItem("token");
         const linkUrl = `${lambda}/products?appname=${appname}${productsearch ? `&search=${productsearch}` : ""}&token=${token}&userid=${localStorage.getItem("userId")}`;
 
         axios({
             method: 'POST',
             url: linkUrl,
         })
             .then(function (response) {
                 if (response?.data?.result === "Invalid token or Expired") {
                     setShowSessionPopupup(true)
                 } else {
                    let result = response.data.result.data
                     setData(response.data.result.data);
                     setTotalProducts(result.length);
                     setIsLoading(false)
 
 
                 }
             });
     }
 
     const searchhandle = (e) => {
         //it triggers by pressing the enter key
         // GetTimeActivity();
         e.preventDefault()
         GetProducts();
     };
     const handleLoadMore = () => {
         if (visibleItems >= data.length) {
             setRemoveLoad(true)
         }
         setVisibleItems(prevVisibleItems => prevVisibleItems + 12);
     };
     const clearSearch = (e) => {
         e.preventDefault()
         setProductSearch("");
         clearProducts();
         setCurrentPage(1);
         setRowsPerPage(15);
     }
     const clearProducts = async (e) => {
         GetTimeActivity();
 
         setIsLoading(true)
 
         const token = localStorage.getItem("token");
         const linkUrl = `${lambda}/products?appname=${appname}&token=${token}&userid=${localStorage.getItem("userId")}`;
 
         axios({
             method: 'POST',
             url: linkUrl,
         })
             .then(function (response) {
                 if (response.data.result == "Invalid token or Expired") {
                     setShowSessionPopupup(true)
                 } else {
 
                     setData(response.data.result.data);
                     setIsLoading(false)
 
 
                 }
             });
     }
 
 
 
 
 
     const handleChange = (e) => {
         GetTimeActivity()
         setProductSearch(e.target.value);
     }
 
 
 
 
     const handleKeypress = (e) => {
         //it triggers by pressing the enter key
         GetTimeActivity();
         if ((e.key === "Enter")) {
             setTimeout(function () {
                 // handleSearch();
                 GetProducts();
             }, 1000);
         }
     };
 
 
     const customNoRecords = () => {
         return (
 
             <div className="empty-state-body empty-record"  >
                 <div className="empty-state__message">
                     <span className="material-icons">summarize</span>
                     <p className="form-check font-size-16">No products were found for the searched keyword</p>
                 </div> </div>
         )
     }
 
     const handleAddproduct = () => {
         history.push("/addproduct")
     }
     const handleEditProduct = (e, id) => {
         history.push("/editproduct/" + id);
     }
     const handleViewProduct = (e, id) => {
        history.push("/viewproduct/" + id);
    }
    console.log("total",totalproducts,visibleItems)
     return (
         <>
             {showSessionPopupup && <SessionPopup />}
             <div id="layout-wrapper">
                 <Header />
                 <Sidebar />
 
 
 
                 {isLoading ?
                     <Loader />
                     :
                     <div className="main-content user-management content-management export lookups products">
 
                         <div className="page-content">
                             <div className="container-fluid">
 
 
 
                                 <div className="row mb-4 breadcrumb">
                                     <div className="col-lg-12">
                                         <div className="d-flex align-items-center">
                                             <div className="d-flex align-items-center flex-grow-1 page-title-sec">
                                                 <h6 className="mb-2 card-title">Products</h6>
 
                                                 <button onClick={handleAddproduct} className="btn btn-info btn-primary ms-3 rounded-4 px-3  py-2 btn-sm"><span>+&nbsp;</span>CREATE</button>
 
                                             </div>
 
 
                                             <div className="page-actions">
                                                 <form className="mt-4 mt-sm-0 float-sm-end d-sm-flex align-items-center">
                                                     <div className="search-box me-2">
                                                         <div className="position-relative">
                                                             <input type="text" className="form-control border-0" value={productsearch} onChange={(e) => handleChange(e)} placeholder="Search by Product Name" />
                                                             <button className="fill_btn" onClick={(e) => searchhandle(e)}><span className="material-icons search-icon">search</span></button>
                                                         </div>
                                                         <div className="position-relative">
                                                             <button className="fill_btn" onClick={(e) => clearSearch(e)}><span className="material-icons-outlined">sync</span>Reset</button>
                                                         </div>
                                                     </div>
                                                     <ul className="nav nav-pills product-view-nav justify-content-end mt-3 mt-sm-0">
 
                                                         <li className="nav-item" onClick={(e) => setView(true)}>
                                                             <a className={view ? "nav-link active" : "nav-link"} ><i className="bx bx-grid-alt"></i></a>
                                                         </li>
 
                                                         <li className="nav-item" onClick={(e) => setView(false)}>
                                                             <a className={view ? "nav-link" : "nav-link active"}><i className="bx bx-list-ul"></i></a>
                                                         </li>
                                                     </ul>
                                                 </form>
                                             </div>
 
 
                                         </div>
                                     </div>
                                 </div>
 
                                 {view ?
                                     <div className="row">
                                         {data.length > 0 ? (data && data.length > 0 && data.slice(0, visibleItems).map(function (item, i) {
                                             return (<div className="col-xl-3 col-sm-6">
                                                 <div className="card">
                                                     <div className="card-body">
                                                         <div className="product-img position-relative">
 
                                                             <img onClick={e => handleEditProduct(e, item.productid)} src={`${image}${item && item?.images && item?.images[0]?.path}`} alt="" className="img-fluid mx-auto d-block" />
                                                         </div>
                                                         <div className="mt-4 text-center product-descptn">
                                                             <h5 className="mb-3 text-truncate product-title"><a href="javascript: void(0);" className="text-dark">{item.productname} </a></h5>
                                                             <h5 className="my-0 product-price"> <b>${item.price}</b></h5>
                                                         </div>
                                                     </div>
                                                 </div>
                                             </div>)
                                         })) : (<div>
                                             <div className="empty-state-body empty-record">
                                                 <div className="empty-state__message">
                                                     <span className="material-icons">summarize</span>
                                                     <p className="form-check font-size-16">
                                                         No products were found for the searched keyword
                                                     </p>
                                                 </div>{" "}
                                             </div>
                                         </div>)}
                                         <div>
                                             {(data && data.length > 12 && totalproducts > visibleItems) &&
                                                 <div className="load_more">
                                                     <button onClick={handleLoadMore}>LoadMore</button>
                                                 </div>
                                             }
                                         </div>
 
 
                                     </div>
 
                                     :
 
                                     <div className="row table-data">
                                         <div className="col-12">
                                             <div className="card">
                                                 <div className="card-body">
 
 
 
                                                     < DataTable key={keyForRerender}
                                                         // title=""
 
                                                         columns={columns}
                                                         // className="table align-middle table-nowrap table-check"
                                                         keyField='_id'
                                                         data={data}
                                                         onSort={handleSort}
                                                         direction="auto"
                                                         highlightOnHover
                                                         // sortedColumn={sortedColumn}
                                                         // sortDirection={sortDirection}
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
                                 }
 
 
                             </div>
                         </div>
 
 
                         <Footer />
                     </div>}
 
 
 
             </div>
         </>
     );
 };
 
 export default Products;