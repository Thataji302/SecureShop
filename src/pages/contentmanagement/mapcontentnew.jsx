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
import React, { useState, useEffect, useContext } from "react";
import Footer from "../../components/dashboard/footer";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import { useHistory, Link, Redirect } from "react-router-dom";
import * as Config from "../../constants/Config";
import tmdbApi from "../../api/tmdbApi";
import { CategoryFieldSet, verifyMappedData } from "../../utils/reducer";
import ContentCheck from './contentCheck';
import SweetAlert from 'react-bootstrap-sweetalert';
import Select from 'react-select';
import moment from "moment";
import axios from 'axios';
import { contentContext } from "../../context/contentContext";
let { lambda, country, appname } = window.app;

const MapContent = (props) => {
    const history = useHistory();
    console.log('assets', props.location);
    const { fileName } = props.location.state;
    const [assets, setAssets] = useState(props.location.state.assets);
    const [filesData, setFilesData] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [sheetKeys, setSheetKeys] = useState([]);
    const [catogoryFields, setcatogoryFields] = useState([]);
    const [errors, setErrors] = useState({});
    const [usedKeys, setUsedKeys] = useState([]);
    const [data, setData] = useState({});
    const [mappedData, setMappedData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [contentFlag, setContentFlag] = useState(false);
    const [defaultmapped, setDefaultMapped] = useState(['check']);
    const [displaymessage, setDisplayMessage] = useState(false);
    let allKeys = [];
    const [selectedcategories, setSelectedCategories] = useState([]);
    const [success, setSuccess] = useState(false);
    const [flag, setFlag] = useState(false);
    const { route, setRoute, setCurrentPage, currentPageNew, setRowsPerPage, usePrevious, setActiveMenuId ,GetTimeActivity} = useContext(contentContext);

    const prevRoute = usePrevious(route)
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
            setCurrentPage(1)
            setRowsPerPage(15)
        }
    }, [prevRoute]);
    useEffect(() => {
        setRoute("content")
        setActiveMenuId(200001)
        assets.forEach(function (item, index) {
            allKeys.push(Object.keys(item));
        });
        let newArr = [].concat(...allKeys);
        newArr = Array.from(new Set(newArr));
        newArr = newArr.sort();

        setSheetKeys(newArr)
        //    const k =newArr.map((eachItem)=>{return { label:eachItem , value:eachItem}})
        //    setSheetKeys(k);
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
    const getCategoryFieldSet = (newArr) => {
        GetTimeActivity()
        CategoryFieldSet(newArr).then((data) => {
            if (data.statusCode == 200) {
                console.log(data.result, "--- api result")
                let result = data.result;

                const uniqueArray = Object.values(result.reduce((acc, obj) => {
                    if (obj.mandatory && (!acc[obj.name] || !acc[obj.name].mandatory)) {
                        acc[obj.name] = obj;
                    } else if (!acc[obj.name]) {
                        acc[obj.name] = obj;
                    }
                    return acc;
                }, {}));
                let newAssets = mappedData;
                console.log("uniqueArray", uniqueArray);
                setcatogoryFields(uniqueArray)
                let defaultItems = [];
                let usedKey = [];
                uniqueArray?.forEach((item, index) => {
                    console.log("item", item.name)
                    {
                        sheetKeys?.forEach((dropitem, key) => {
                            if (item.name.toLowerCase() === dropitem.toLowerCase()) {
                                console.log("item", item)
                                defaultItems.push(dropitem.toLowerCase());
                                uniqueArray[index].mappedKey = dropitem;
                                usedKey.indexOf(dropitem) === -1 ? usedKey.push(dropitem) : console.log('nothing');

                                assets.forEach(function (asset, index) {
                                    if (asset[dropitem])
                                        newAssets[index][dropitem.toLowerCase()] = asset[dropitem];

                                });

                            }
                        }
                        )
                    }



                }
                )
                setUsedKeys(usedKey);
                setDefaultMapped(defaultItems)
                setMappedData(newAssets);
                console.log("newAssets", newAssets)
                console.log("sheetKeys", sheetKeys);
            }
        }).catch((error) => {
            console.log(error);
        })
    }


    const handlecategory = (e) => {
        GetTimeActivity()
        let newAssets = mappedData;

        if (!!errors['category']) {
            let error = Object.assign({}, errors);
            delete error['category'];
            setErrors(error);
        }
        let Categories = [];
        let usedKey = [];
        usedKey.indexOf(e.target.value) === -1 ? usedKey.push(e.target.value) : console.log('nothing');
        setUsedKeys(usedKey);
        assets.forEach(function (asset, index) {
            asset[e.target.value] && Categories.indexOf(asset[e.target.value]) === -1 ? Categories.push(asset[e.target.value]) : console.log("This item already exists");
            console.log("newAssets[index]", newAssets[index])
            if (newAssets[index]) {
                if (asset[e.target.value]) {
                    newAssets[index]['category'] = asset['category'];
                }
            } else {
                if (asset['category']) {
                    newAssets.push({ ['category']: asset['category'] })
                } else {
                    newAssets.push({ ['category']: asset[e.target.value] })
                }
            }
            // setUsedKeys([]);
        });
        setMappedData(newAssets);
        console.log('Categories', Categories);
        Categories = Categories.map(function (e) {
            if (e) {
                // console.log("tt",typeof(e));
                // let single = e.split(",")
                // console.log("tt",single,typeof(single));
                return e.toUpperCase()
            }
        });
        const splitValuesArray = [];

        Categories.forEach(str => {
            const splitValues = str.split(', ');
            splitValuesArray.push(...splitValues);
        });
        const uniqueArray = [...new Set(splitValuesArray)];
        setSelectedCategories(uniqueArray);
        setAllCategories(Categories)
        getCategoryFieldSet(uniqueArray)



    }

    const handleContentid = (e) => {
        GetTimeActivity()
        let newAssets = mappedData;

        // console.log("eeeee",e.target.value)
        let contentid = [];
        let usedKey = [];
        console.log("usedKey.indexOf(e.target.value)", usedKey.indexOf(e.target.value))
        usedKey.indexOf(e.target.value) === -1 ? usedKey.push(e.target.value) : console.log('nothing');
        console.log("usedKey", usedKey)
        setUsedKeys(usedKey);
        assets.forEach(function (asset, index) {
            // asset[e.target.value] && contentid.indexOf(asset[e.target.value]) === -1 ? contentid.push(asset[e.target.value]) : console.log("This item already exists");
            // console.log("newAssets[index]", newAssets[index])

            // if (newAssets[index]) {
            //     if (asset[e.target.value]) {
            //         newAssets[index]['contentid'] = asset['contentid'];
            //     }
            // } else {
            //     if (asset['contentid']) {
            //         newAssets.push({ ['contentid']: asset['contentid'] })
            //     }
            //     //  else {
            //     //     newAssets.push({ ['contentid']: asset[e.target.value] })
            //     // }
            // }
            // setUsedKeys([]);


            //  console.log("index",newAssets[index],"value",asset[e.target.value]);
            if (usedKey.length === 1 && usedKey[0] === "") {
                delete newAssets[index]["contentid"];
                setContentFlag(false)

            } else {
                setContentFlag(true)
                if (newAssets[index]) {
                    if (asset[e.target.value]) {
                        newAssets[index]["contentid"] = asset[e.target.value];
                    }
                } else {
                    if (asset[e.target.value]) {
                        newAssets.push({ ["contentid"]: asset[e.target.value] })
                    }
                }
            }

        });

        //console.log("newAssets.contentid",newAssets);

        setMappedData(newAssets);
    }
    const handleChange = (e, item, index) => {
        let newAssets = mappedData;
        let newcatogoryFields = catogoryFields;
        if ((item.name === "landscapeimage") || (item.name === "portraitimage")) {
            delete errors["landscapeimage"];
            delete errors["portraitimage"];

        }
        if (!!errors[item.name]) {
            let error = Object.assign({}, errors);
            delete error[item.name];
            setErrors(error);
        }
        setFlag(true)
        let usedKey = usedKeys;

        const indexofKey = usedKey.indexOf(catogoryFields[index].mappedKey);
        indexofKey === -1 ? usedKey.push(e.target.value) : indexofKey > -1 ? usedKey.splice(indexofKey, 1) : console.log('nothing');
        usedKey.indexOf(e.target.value) === -1 ? usedKey.push(e.target.value) : console.log('nothing');
        setUsedKeys(usedKey);
        setSheetKeys([...sheetKeys])

        newcatogoryFields[index].mappedKey = e.target.value;
        assets.forEach(function (asset, index) {
            if (asset[item.mappedKey] === undefined && item.mappedKey === "") {
                delete newAssets[index][item.name]
            } else {
                if (newAssets[index]) {
                    if (asset[e.target.value] === undefined) {
                        delete newAssets[index][item.name]
                    }
                    if (asset[e.target.value]) {
                        newAssets[index][item.name] = asset[e.target.value];
                    }
                } else {
                    if (asset[e.target.value]) {
                        newAssets.push({ [item.name]: asset[e.target.value] })
                    }
                }
            }
        });
        setMappedData(newAssets);
        setcatogoryFields(newcatogoryFields)
    }
    const DataImport = async () => {
        GetTimeActivity()
        setIsLoading(true);
        try {
            const response = await tmdbApi.mapImport({
                "contents": mappedData,
            });
            console.log(response);

            if (response.statusCode === 200) {
                // if (response.result == "Invalid token or Expired") {
                //     setShowSessionPopupup(true)
                // } else {
                setSuccess(true);

                setData(response.result.data);
                setIsLoading(false);
                //  }
            }

        } catch {
            console.log("error");
            setIsLoading(false);
            setDisplayMessage(true)
        }
    }
    const mapSubmit = (e) => {
        GetTimeActivity()

        const isValid = validate();

        console.log("isValid", isValid)

        if (isValid) {
            DataImport();
        }



    }
    const validate = (e, item) => {
        let formIsValid = true;
        let error = { ...errors };
        console.log('allCategories', allCategories);
        if (allCategories.length == 0) {
            error['category'] = "Category is required";
            formIsValid = false;
        }
        catogoryFields.forEach(function (item) {

            if (item.mandatory && item.name != 'item' && item.name != 'category' && 
            // item.name != 'landscapeimage' && item.name != 'portraitimage' &&
             (!item.mappedKey || item.mappedKey == "" || item.mappedKey == undefined)) {
                error[item.name] = item.name + " is required";
                formIsValid = false;
            }
        })

        if (contentFlag === false) {
            catogoryFields.forEach(function (item, i) {
                if ((item.name === "landscapeimage" && catogoryFields[i].mappedKey != undefined) || (item.name === "portraitimage" && catogoryFields[i].mappedKey != undefined)) {
                    console.log("Came2")
                    delete error["landscapeimage"];
                    delete error["portraitimage"];


                }

            })
        } else{
            delete error["landscapeimage"];
            delete error["portraitimage"];
        }
        console.log("formIsValid", formIsValid);
        console.log("errors", Object.keys(error).length);
        console.log('error', error);
        console.log("contentFlag", contentFlag)
        if (Object.keys(error).length === 0) {
            formIsValid = true;
        }
        setErrors(error);
        return formIsValid;
    }
   

    function onConfirm() {
        GetTimeActivity()
        setDisplayMessage(false)
    };


    return (
        <>
            {success && <><Header /><Sidebar /></>}
            <div id="layout-wrapper">
                {success ? <div className="map-upload"><ContentCheck data={data} /></div> :

                    <><header id="page-topbar" className="map-header">
                        <div className="d-flex">
                            <h1>MAP CONTENT</h1>
                            {/* <a className="btn"><span  className="material-icons-outlined">close</span></a> */}
                            <div>
                                <a onClick={(e) => { history.push("/contentupload"); }} className="btn btn-primary">BACK</a>
                            </div>
                        </div>
                    </header><div className="user-management content-management map-content">

                            <div className="page-content">
                                <div className="container-fluid">
                                    <div className="map-content-block">
                                        <div className="map-content-data">
                                            <div className="map-category-block">
                                                <h6>MAP CATEGORY</h6>
                                                <div className="map-category-field">
                                                    <div className="label">
                                                        <label htmlFor="example-text-input" className="col-form-label">Category</label>
                                                    </div>
                                                    <div className="input-field">
                                                        <span className="material-icons-outlined">settings_ethernet</span>
                                                        <select onChange={(e) => handlecategory(e)} className="form-select" aria-label="Default select example">
                                                            <option>Select</option>
                                                            {sheetKeys?.map((sheetItem, key) => {
                                                                // if (sheetItem != "clientname")
                                                                return (
                                                                    <option key={key} value={sheetItem}>{sheetItem}</option>
                                                                );
                                                            }
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>
                                                {errors['category'] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors['category']}</span>}

                                                <div className="map-category-field">
                                                    <div className="label">
                                                        <label htmlFor="example-text-input" className="col-form-label">ContentId</label>
                                                    </div>
                                                    <div className="input-field">
                                                        <span className="material-icons-outlined">settings_ethernet</span>
                                                        <select onChange={(e) => handleContentid(e)} className="form-select" aria-label="Default select example">
                                                            <option value="">Select</option>
                                                            {sheetKeys?.map((sheetItem, key) => {
                                                                // if (sheetItem != "clientname")
                                                                return (
                                                                    <option key={key} value={sheetItem}>{sheetItem}</option>
                                                                );
                                                            }
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="map-items-block">
                                                <div className="map-items-header">
                                                    <p>MAP ITEMS</p>
                                                    <p className="mandatory-items"><span>*</span>Mandatory Items</p>
                                                </div>
                                                <div className="map-items-body">
                                                    <div className="map-body-header">
                                                        <div className="col-md-7">
                                                            <p>Default Items</p>
                                                        </div>
                                                        <div className="col-md-5">
                                                            <p>Column Title</p>
                                                        </div>
                                                    </div>
                                                    {catogoryFields?.map((item, key) => {
                                                        if (item.name != "category")
                                                            return (
                                                                <div className="map-category-block" key={key}>
                                                                    <div className="map-category-field">
                                                                        <div className="label">
                                                                            <label htmlFor="example-text-input" className="col-form-label">{item.name}{(contentFlag === true && item.name === "landscapeimage") || (contentFlag === true && item.name === "portraitimage") ? null : item.mandatory ? <span style={{ color: "red" }}>*</span> : null}</label>
                                                                        </div>
                                                                        <div className="input-field">
                                                                            <span className="material-icons-outlined">settings_ethernet</span>
                                                                            {defaultmapped.includes(item.name?.toLowerCase()) ?

                                                                                <select onChange={(e) => handleChange(e, item, key)} value={flag === true ? mappedData[item.name] : catogoryFields[key].mappedKey} className="form-select" aria-label="Default select example">

                                                                                    <option value="">Select Metadata</option>
                                                                                    {sheetKeys?.map((sheetItem, key1) => {
                                                                                        if (sheetItem != "category")
                                                                                            return (
                                                                                                <option key={key1} value={sheetItem} disabled={usedKeys.includes(sheetItem)}>{sheetItem}</option>
                                                                                            );
                                                                                    }
                                                                                    )}
                                                                                </select>
                                                                                : <select onChange={(e) => handleChange(e, item, key)} className="form-select" aria-label="Default select example">

                                                                                    <option value="">Select Metadata</option>
                                                                                    {sheetKeys?.map((sheetItem, key) => {
                                                                                        if (sheetItem != "category")
                                                                                            return (
                                                                                                <option key={key} value={sheetItem} disabled={usedKeys.includes(sheetItem)}>{sheetItem}</option>
                                                                                            );
                                                                                    }
                                                                                    )}
                                                                                </select>}
                                                                        </div>
                                                                        {/* {defaultmapped && defaultmapped.length > 0 && defaultmapped?.map((defitem, key) => {
                                                                            return (
                                                                                <>
                                                                                    {defitem === item.name ? <div className="input-field">
                                                                                        <span className="material-icons-outlined">settings_ethernet</span>
                                                                                        <select onChange={(e) => handleChange(e, item, key)} className="form-select" value={item.name} aria-label="Default select example">

                                                                                            <option>Select Metadata</option>
                                                                                            {sheetKeys?.map((sheetItem, key) => {
                                                                                                if (sheetItem != "category")
                                                                                                    return (
                                                                                                        <option key={key} value={sheetItem} disabled={usedKeys.includes(sheetItem)}>{sheetItem}</option>
                                                                                                    );
                                                                                            }
                                                                                            )}
                                                                                        </select>
                                                                                    </div> : }</>
                                                                            );
                                                                        }
                                                                        )} */}


                                                                        {/* {!defaultmapped.includes(item.name) && 
                                                                          <div className="input-field">
                                                                                <span className="material-icons-outlined">settings_ethernet</span>
                                                                                <select onChange={(e) => handleChange(e, item, key)} className="form-select" aria-label="Default select example">

                                                                                    <option>Select Metadata</option>
                                                                                    {sheetKeys?.map((sheetItem, key) => {
                                                                                        if (sheetItem != "category")
                                                                                            return (
                                                                                                <option key={key} value={sheetItem} disabled={usedKeys.includes(sheetItem)}>{sheetItem}</option>
                                                                                            );
                                                                                    }
                                                                                    )}
                                                                                </select>
                                                                            </div>} */}

                                                                    </div>
                                                                    {errors[item.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors[item.name]}</span>}

                                                                </div>
                                                            );
                                                    }
                                                    )}
                                                    {catogoryFields.length == 0 && <div className="default-wrapper">
                                                        <div className="icon-block">
                                                            <span className="material-icons-outlined">settings_ethernet</span>
                                                        </div>
                                                        <h5>Map Category to get started</h5>
                                                    </div>}
                                                </div>
                                            </div>

                                            <div className="map-btn">
                                                <a onClick={(e) => { mapSubmit(e); }} className="btn btn-primary">{isLoading ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}map & upload</a>
                                            </div>

                                        </div>




                                        <div className="table-data">
                                            <div className="col-12">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="table-data-header">
                                                            <h1>{fileName}</h1>
                                                            {/* <a href="javascript:void(0);" className="btn btn-primary disable-btn">DONE AND UPLOAD</a> */}

                                                        </div>

                                                        <div className="table-responsive import-table">
                                                            <table className="table align-middle table-nowrap table-check table-bordered">
                                                                <thead className="table-light">
                                                                    <tr>
                                                                        {sheetKeys?.map((item, key) => {
                                                                            if (item != "clientname") {
                                                                                return (
                                                                                    <th key={key} className={"align-middle " + (usedKeys.includes(item) ? "map-color" : '')}>{item}</th>
                                                                                );
                                                                            }
                                                                        }
                                                                        )}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {assets?.map((item, key) => {
                                                                        return (
                                                                            <tr key={key}>
                                                                                {sheetKeys?.map((keyName, index) => {
                                                                                    if (keyName != "clientname") {
                                                                                        return (
                                                                                            keyName == "featured" ? <td key={index}>{JSON.stringify(item[keyName])}</td> : (keyName == "synopsis" || keyName == "cast") ? <td key={index}><div className="synopsis">{item[keyName]}</div></td> : <td key={index}>{item[keyName]}</td>
                                                                                        );
                                                                                    }
                                                                                }
                                                                                )}



                                                                            </tr>);
                                                                    }
                                                                    )}

                                                                </tbody>
                                                            </table>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>






                                </div>
                            </div>



                        </div></>
                }
            </div>
            <SweetAlert show={displaymessage}
                custom
                confirmBtnText="ok"
                confirmBtnBsStyle="primary"
                title={"Something went wrong. Please retry again"}
                onConfirm={e => onConfirm()}
            >
            </SweetAlert>
        </>
    );
};

export default MapContent;
