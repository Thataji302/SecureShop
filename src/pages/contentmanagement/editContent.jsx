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
import React, { useState, useEffect, useContext, useRef } from "react";
import Footer from "../../components/dashboard/footer";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import $ from 'jquery';
import { contentContext } from "../../context/contentContext";
import tmdbApi from "../../api/tmdbApi";
import moment from "moment";
import { getCompanies, getClientcontent, updateContentData, AddContentData, getContentFiles, addClientcontent, addLookup } from "../../utils/reducer";
import PlayerInfo from "../../components/player";
import FileViewer from "../../components/docViewer";
import Modal from 'react-bootstrap/Modal';
import SweetAlert from 'react-bootstrap-sweetalert';
import Loader from "../../components/loader";
import SessionPopup from "../SessionPopup"
let { lambda, appname } = window.app;


const EditContent = () => {
    let { id } = useParams();
    let videoClipcategories = ['TRAILERS',
        'SCREENER',
        'BEHIND THE SCENES',
        'DELETED SCENES',
        'INTERVIEWS',
        'SCRIPTS',
        'EXTRAS']
    const history = useHistory();
    const ref = useRef();
    const [editcontent, setEditContent] = useState({});
    const [contentTitle, setContentTitle] = useState("");
    const [sellerContent, setSellercontent] = useState({});
    const [genreTag, setGenreTag] = useState({});
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedCompanyName, setSelectedCompanyName] = useState([]);
    const [selectedOptionsgenre, setSelectedOptionsgenre] = useState([]);
    const [genreData, setGenreData] = useState({});
    const [lookup, setLookUp] = useState({});
    const [selectedOptionscountryOfOrigin, setSelectedOptionscountryOfOrigin] = useState([]);
    const [countryData, setCountryData] = useState({});
    const [BtnLoader, setBtnLoader] = useState(false);

    const [apiDataCountry, setApiDataCountry] = useState({});
    const { categoryName, Categories, catBasedContentFields ,GetTimeActivity} = useContext(contentContext);
    const [image, setImg] = useState('');
    const [companiesData, setCompaniesData] = useState([]);
    const [sellersData, setSellersData] = useState([]);
    const [filesData, setFilesData] = useState([]);
    const [errors, setErrors] = useState({});
    const [play, setPlay] = useState(false);
    const [playContent, setPlayContent] = useState({});
    const [fileDocName, setFileDocName] = useState("");
    const [sellereErrors, setSellereErrors] = useState({}); 
    const [AgreementErr, setAgreementErr] = useState(false); 
    const [showupdateSeller, setshowupdateSeller] = useState(false);  
    const [showPreview, setShowPreview] = useState(false);  
    const [previewImg, setPreviewImg] = useState("");  
    const [showDoc, setshowDoc] = useState(false);
    const [success, setSuccess] = useState(false); 
    const [subSuccess, setSubSuccess] = useState(false); 
    const [AddSuccess, setAddSuccess] = useState(false);
    const [showAddLookup, setShowAddLookup] = useState(false);
    const [NewLookupValue, setNewLookupValue] = useState('');
    const [lookupType, setLookupType] = useState('');
    const [lookupTypeName, setLookupTypeName] = useState('');
    const [lookupErr, setLookupErr] = useState("");

    const [excededfile, setExcededFile] = useState(false);
    const [videoexcededfile, setVideoExcededFile] = useState(false);
    const [isdelete, setDelete] = useState(false);
    const [isdeleteImage, setIsdeleteImage] = useState(false);
    const [item, setItem] = useState("");

    const [fileCategory, setFileCategory] = useState("");
    const [lookupSuccess, setLookupSuccess] = useState(false); 

    const [fileName, setFileName] = useState("");
    const [showUpload, setShowUpload] = useState(false);
    const [showSubUpload, setShowSubUpload] = useState(false); 
    const [subTitlesData, setSubTitlesData] = useState([]); 
    const [subTitlesFormData, setSubTitlesFormData] = useState([]); 
    const [activeSubTitles, setActiveSubTitles] = useState([]); 
    const [subLoader, SetSubLoader] = useState(''); 
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const [invalidContent, setInvalidContent] = useState(false);

    const [type, setType] = useState(false);
    const [activeTab, setActiveTab] = useState('info');
    const [isValidInfo, setIsValidInfo] = useState(false);
    const [isInfoFormValid, setIsInfoFormValid] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const [uploadType, setUploadType] = useState(''); 
    const [activeTrailerId, setActiveTrailerId] = useState(''); 
    const [activeVideo, setActiveVideo] = useState([]); 
    const [playerSubTitles, setPlayerSubTitles] = useState(''); 

    const [delPopup, setDelPopup] = useState(false);
    const [delSuccess, setDelSuccess] = useState(false);
    const [delSeller, setDelSeller] = useState(false);

    const [uploadsuccess, setUploadSuccess] = useState(false);
    const [isCompExist, setIsCompExist] = useState(false);
    const [isTitleExist, setIsTitleExist] = useState(false);
    // const [includeInputsCat, setIncludeInputsCat] = useState([]); 

    const includeInputsCat = ["SPORTS", "SHORT FILMS", "LIVE EVENTS", "MUSIC", "COOKING SHOWS", "LIFESTYLE", "SERIES & TELENOVELAS", "DOCUMENTARIES", "DOCUSERIES", "KIDS MOVIES", "MOVIES", "KIDS SERIES", "MUSIC", "LIVE EVENTS", "MY CATEGORY"];
    // console.log('catBasedContentFieldscatBasedContentFields',catBasedContentFields)
    const { route, setRoute, setCurrentPage, setRowsPerPage, usePrevious, userData, setActiveMenuId } = useContext(contentContext);
    // let fields = [];
    const prevRoute = usePrevious(route)
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
            setCurrentPage(1)
            setRowsPerPage(15)
        }
    }, [prevRoute]);
    useEffect(() => {
        if(filesData.length>0){
                console.log('filesDatafilesDatafilesData',filesData)
        }
    }, [activeSubTitles]);
    useEffect(() => {
        console.log("excuted");
        if (!(localStorage.getItem("token"))) {
            console.log('tokaen excte');
            history.push("/");
            localStorage.setItem("check", id);
        }
        console.log('content excte');
        setRoute("content")
        setActiveMenuId(200001)
        Categories();

        GetLookUp();
        if (id) {
            getContent();
        }
        console.log('before calling');
        getSubtitles()
        getSellersData();
        if (id) {
            getContentFiles(id).then((data) => {
                console.log("getClientcontent data", data);
                if (data.statusCode == 200) {
                    // console.log(data.result, "---")
                    if (data.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {
                        setFilesData(data.result);
                    }
                }
            }).catch((error) => {
                console.log(error);
            })
        }
        //  renderDynamicCategoryFields();

        userActivity();
    }, []);
    const userActivity = () => {
        let path = window.location.pathname.split("/");
        console.log('ididididididid',id)
        console.log('path',path)
        const pageName = id != undefined ? path[path.length - 2] : path[path.length - 1];;
        var presentTime = moment();
        let payload;
        console.log('pageName',pageName)

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

        // const k = categoryName.map(item => item.value)
        // setIncludeInputsCat(k)

    }, [sellerContent]);
    //  const renderDynamicCategoryFields = () => {

    const k = categoryName.map(eachh => eachh.value)

    // console.log('editcontent?.category', editcontent?.category)

    let selectedCategory = (editcontent?.category === undefined || editcontent?.category.length <= 0) ? k : editcontent?.category
    // console.log('selected catee', selectedCategory)
    const results = catBasedContentFields.filter(({ name: item }) => selectedCategory.includes(item));
    let fields = [];

    const kArr = results.map(eachItem => {
        const kk = Object.keys(eachItem.fields).map(subItem => {

            // Iterate through the original array

            const existingObjectIndex = fields.findIndex(obj => obj.name === eachItem.fields[subItem].name);
            //  console.log('existingObjectIndex',existingObjectIndex,fields)
            // Check if the current object has mandatory: true
            if (eachItem.fields[subItem].mandatory) {
                // If there's an existing object with the same name, replace it with the current object
                if (existingObjectIndex !== -1) {
                    fields[existingObjectIndex] = eachItem.fields[subItem];
                } else {
                    fields.push(eachItem.fields[subItem]);
                }
            } else if (existingObjectIndex === -1) {
                // If the current object has mandatory: false and no existing object with the same name, add it
                fields.push(eachItem.fields[subItem]);
            }


        })

    })

    fields = [...fields].sort((a, b) => a.order - b.order);
    if (editcontent?.category === undefined || editcontent?.category.length <= 0) {
        fields = fields.filter(defaultItem => defaultItem.default === true)
    }
    //  setData(sortedData);
    // console.log('fields====>', fields)
    //  console.log("results fields", fields.length)
    // }
    useEffect(() => {
        // renderDynamicCategoryFields()
    }, [editcontent.category])

    useEffect(() => {

        if (id) {
            if (editcontent.category != undefined) {
                getCompanies(editcontent.category).then((data) => {
                    // console.log("companies data", data);
                    if (data.statusCode == 200) {
                        if (data.result == "Invalid token or Expired") {
                            setShowSessionPopupup(true)
                        } else {
                            setCompaniesData(data.result);
                        }
                    }
                }).catch((error) => {
                    console.log(error);
                });
            }
        }

    }, [editcontent.category]);

    if (id == undefined) {
        var ObjectID = require("bson-objectid");
        var newContentID = new ObjectID().toString();
    }

    // console.log('editcontent',editcontent["category"])
    const getSellersData = (e) => {
        if (id) {
            getClientcontent(id).then((data) => {
                // console.log("getClientcontent data", data);
                if (data.statusCode == 200) {
                    console.log(data.result, "---")
                    if (data.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {
                        setSellersData(data.result);
                    }
                }
            }).catch((error) => {
                console.log(error);
            })
        }
    }
    const saveNext = (e) => {
        GetTimeActivity()
        const isValid = validateMandatoryFields();
        if (isValid) {
            // console.log('asdfasdfasdfasdfasdfasdfasdfkbasdfa sdf asdf asd f')
            setIsInfoFormValid(true)
            setActiveTab("seller")
        }
    }


    const handleField = (item) => {
        GetTimeActivity()
        const itemList = catBasedContentFields.filter((eachItem) => eachItem.fields.some((eachOne) => eachOne.name == item))
        const k = itemList.map(each => each.name)
        let isThere = k.filter(x => editcontent && editcontent['category'] && editcontent['category'].includes(x));
        return isThere.length > 0
    }
    // console.log('delSuccess', delSuccess)
    const imageDeleteFun = (e) => {
        GetTimeActivity()
        // let newContent = Object.assign({}, editcontent);
        // delete newContent[item];
        // setEditContent(newContent)
        const obj = {
            "contentid": id,
            [item]: "",
        }
        updateContentData(id, obj).then((data) => {
            console.log("getClientcontent data", data);
            if (data.statusCode == 200) {
                console.log(data.result, "---")
                if (data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    console.log("image delete");
                    setBtnLoader(false)
                    setDelSuccess(true);
                    setIsdeleteImage(false)
                    //history.push("/contentmanagement");
                    getContent();
                    // setBtnLoader(false);


                }
            }
        }).catch((error) => {
            setBtnLoader(false)
            setBtnLoader(false);
            console.log(error);
        })
    }
    // console.log('error----->',errors)

    const submit = async (e) => {
        GetTimeActivity()
        // e.preventDefault();
        const isValid = validateMandatoryFields();
        // if(isValid) {
        //     setActiveTab("seller")
        // }
        // const isValid = validate();
        //setBtnLoader(true);

        if (isValid) {
            // if (id === undefined) {
            //     const isValidSeller = validateSeller();
            // }
            setBtnLoader(true);

            console.log('form valid', editcontent);
            if (id) {
                updateContentData(id, editcontent).then((data) => {
                    console.log("getClientcontent data", data);
                    if (data.statusCode == 200) {
                        console.log(data.result, "---")
                        if (data.result == "Invalid token or Expired") {
                            setShowSessionPopupup(true)
                        } else if (data.result == "Same title aready exists") {
                            setBtnLoader(false);
                            setIsTitleExist(true)
                        }
                        else if (data.result == "Success") {
                            setSuccess(true);
                            //history.push("/contentmanagement");
                            getContent();
                            if(activeTab === "info")
                            setBtnLoader(false)
                        }
                    }
                }).catch((error) => {
                    setBtnLoader(false);
                    console.log(error);
                })
            } else {
                AddContentData(editcontent).then((data) => {
                    console.log("Add Content data", data);
                    if (data.statusCode == 200) {
                        console.log(data.result, "---")
                        if (data.result == "Invalid token or Expired") {
                            setShowSessionPopupup(true)
                        } else if (data.result == "Same title aready exists") {
                            setBtnLoader(false);
                            setIsTitleExist(true)
                        }
                        else if (data.result == "Success") {
                            setAddSuccess(true);
                            let id = data.result;
                            history.push("/editcontent/" + id);
                            AfterAddgetContent(id);
                            setBtnLoader(false);
                        }
                    }
                }).catch((error) => {
                    setBtnLoader(false);
                    console.log(error);
                })
            }
            // 
            // console.log("loader disable");
        } else {
            console.log('form in valid');
        }
    }
    // console.log('catBasedContentFields-->',catBasedContentFields)
    // console.log('editcontent-->',editcontent)
    const validate = (e) => {
        let formIsValid = true;
        let error = { ...errors };
        let mandatoryFileds = [{ name: 'Title', key: 'title' }, { name: 'Category', key: 'category' }, { name: 'Synopsis', key: 'synopsis' }, { name: 'Genre', key: 'genre' }, { name: 'Duration', key: 'duration' }, { name: 'Cast', key: 'cast' }, { name: 'Number Of Episodes', key: 'noofepisodes' }, { name: 'Number Of Seasons', key: 'noofseasons' }, { name: 'Music Genre', key: 'musicgenre' }, { name: 'Lead Artist', key: 'leadartist' }, { name: 'featured', key: 'featured' }, { name: 'Sport', key: 'sport' }, { name: 'Video Format', key: 'videoformat' },];
        let castRequiredCat = ["MOVIES", "SHORT FILMS", "SERIES & TELENOVELAS", "DOCUMENTARIES", "DOCUSERIES"];
        // 
        console.log('editcontent', editcontent);
        if (mandatoryFileds) {
            mandatoryFileds.forEach(function (item) {
                if (item.key == 'duration' && editcontent['category'] && (editcontent['category'] && editcontent['category'].includes("LINEAR CHANNELS") || editcontent['category'].includes("FORMATS"))) {
                    return
                }
                if (item.key == 'musicgenre' && (editcontent && editcontent['category'] && (editcontent['category'].includes("MUSIC"))) == true) {


                } else if (item.key == 'musicgenre') {
                    return

                }


                if (item.key == 'cast' && editcontent['category'] && castRequiredCat.some(el => editcontent['category'].includes(el))) {

                } else if (item.key == 'cast') {
                    return
                }

                if (item.key == 'thumbnail') {
                    return
                } else if (item.key == 'thumbnail' && editcontent['category'] && (editcontent['category'].includes("FORMATS"))) {

                }

                if (item.key == 'videoformat' && editcontent['category'] && editcontent['category'].length == 1 && (editcontent['category'].includes("FORMATS")) || (editcontent['category'].includes("MOVIES"))) {
                    console.log('videooooooooooooo 1111111111')
                } else if (item.key == 'videoformat') {
                    console.log('videooooooooooooo 2222222222222')

                    return
                }

                if (item.key == 'genre' && editcontent['category'] && (editcontent['category'].includes("COOKING SHOWS") || editcontent['category'].includes("LIFESTYLE") || editcontent['category'].includes("MUSIC") || editcontent['category'].includes("SPORTS") || editcontent['category'].includes("LIVE EVENTS")) == true) {
                    return
                } else if (item.key == 'genre' && editcontent['category'] && (!editcontent['category'].includes("FORMATS") || !editcontent['category'].includes("KIDS SERIES") || !editcontent['category'].includes("DOCUSERIES") || !editcontent['category'].includes("SERIES & TELENOVELAS") || !editcontent['category'].includes("MOVIES") || !editcontent['category'].includes("LINEAR CHANNELS"))) {

                }


                if (item.key == 'sport' && editcontent['category'] && editcontent['category'].includes("SPORTS")) {

                } else if (item.key == 'sport' && editcontent['category'] && editcontent['category'].includes("LIVE EVENTS") && (editcontent["leadartist"] || (editcontent["sport"] && editcontent["sport"].length > 0))) {
                    return
                } else if (item.key == 'sport' && editcontent['category'] && !editcontent['category'].includes("LIVE EVENTS")) {
                    return
                }

                if (item.key == 'leadartist' && editcontent['category'] && editcontent['category'].includes("MUSIC")) {

                } else if (item.key == 'leadartist' && editcontent['category'] && editcontent['category'].includes("LIVE EVENTS") && (editcontent["leadartist"] || (editcontent["sport"] && editcontent["sport"].length > 0))) {
                    return
                } else if (item.key == 'leadartist' && editcontent['category'] && !editcontent['category'].includes("LIVE EVENTS")) {
                    return
                }


                if (item.key == 'noofseasons' && (editcontent && editcontent['category'] && (editcontent['category'].includes("KIDS SERIES") || editcontent['category'].includes("DOCUSERIES") || editcontent['category'].includes("SERIES & TELENOVELAS") || editcontent['category'].includes("COOKING SHOWS") || editcontent['category'].includes("LIFESTYLE"))) == true) {

                } else if (item.key == 'noofseasons') {
                    return
                }
                if (item.key == 'noofepisodes' && (editcontent && editcontent['category'] && (editcontent['category'].includes("KIDS SERIES") || editcontent['category'].includes("DOCUSERIES") || editcontent['category'].includes("SERIES & TELENOVELAS") || editcontent['category'].includes("COOKING SHOWS") || editcontent['category'].includes("LIFESTYLE"))) == true) {


                } else if (item.key == 'noofepisodes') {

                    return



                }


                if (
                    (editcontent[item.key] == "" ||
                        editcontent[item.key] == undefined ||
                        editcontent[item.key] == "undefined")
                ) {

                    error[item.key] = item.name + " is required";
                    formIsValid = false;
                }
            });

        }

        if (editcontent.noofseasons <= 0 || editcontent.noofseasons <= "0") {
            error['noofseasons'] = "Number Of Seasons should be greater than Zero";
            formIsValid = false;
        }
        if (editcontent.noofepisodes <= 0 || editcontent.noofepisodes <= "0") {
            error['noofepisodes'] = "Number Of Episodes should be greater than Zero";

            formIsValid = false;
        }

        if (!editcontent['releasedate'] && !editcontent['releaseyear']) {
            if (editcontent && editcontent['category'] && includeInputsCat.some(el => editcontent['category'].includes(el))) {
                error['releasedate'] = "Release date is required";
                error['releaseyear'] = "Release Year is required";
                formIsValid = false;
            }
        }



        console.log("errors", error);
        setErrors(error);
        return formIsValid;
    };



    // console.log('category fields', categoryName);

    const handleBack = (e) => {
        GetTimeActivity()
        if (id) {
            history.push({
                pathname: "/contentmanagement",
                state: { search: true }
            });
        } else {
            history.push("/contentmanagement")
        }
    }

    const getContent = (e) => {
        GetTimeActivity()
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/contentInfo?appname=' + appname + '&contentid=' + id + "&token=" + token,
        })
            .then(function (response) {
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    let result = response.data.result[0]
                    if (response.data.result.length > 0) {
                        
                        setEditContent({ ...editcontent, ...result });
                        setContentTitle(result.title)


                        const apiCategory = result.category?.map((eachItem) => { return { value: eachItem, label: eachItem }; })
                        setSelectedOptions(apiCategory);

                        const apigenre = result.genre?.map((eachItem) => { return { value: eachItem, label: eachItem }; })
                        setSelectedOptionsgenre(apigenre);

                        const apiCountryofOrigin = result.countryoforigin?.map((eachItem) => { return { value: eachItem, label: eachItem }; })
                        setSelectedOptionscountryOfOrigin(apiCountryofOrigin)
                    } else {
                        setInvalidContent(true)
                    }
                }
            });

    }

    const AfterAddgetContent = (id) => {
        GetTimeActivity()
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            url: lambda + '/contentInfo?appname=' + appname + '&contentid=' + id + "&token=" + token,
        })
            .then(function (response) {
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    let result = response.data.result[0]
                    setEditContent({ ...editcontent, ...result });
                    setContentTitle(result.title)


                    const apiCategory = result.category?.map((eachItem) => { return { value: eachItem, label: eachItem }; })
                    setSelectedOptions(apiCategory);

                    const apigenre = result.genre?.map((eachItem) => { return { value: eachItem, label: eachItem }; })
                    setSelectedOptionsgenre(apigenre);

                    const apiCountryofOrigin = result.countryoforigin?.map((eachItem) => { return { value: eachItem, label: eachItem }; })
                    setSelectedOptionscountryOfOrigin(apiCountryofOrigin)
                }
            });

    }

    const handlesetYear = (date) => {
        const myDate = new Date(date);
        const year = myDate.getFullYear();


    }

    const handleChange = (e) => {
        console.log('e.target.value--->', e.target.value)
        let formvalues = Object.assign({}, editcontent);
        if (!!errors[e.target.name]) {
            let error = Object.assign({}, errors);
            delete error[e.target.name];
            setErrors(error);
        }
        if (e.target.value == "INACTIVE" || e.target.value == "INPROGRESS") {
            let error = Object.assign({}, errors);
            delete error["landscapeimage"];
            delete error["portraitimage"];
            setErrors(error);
        }
        if (e.target.name == 'leadartist') {
            let error = Object.assign({}, errors);
            delete error['sport'];
            delete error['leadartist'];
            setErrors(error);
        }
    
        if (e.target.name == 'releasedate' || e.target.name == 'releaseyear') {
            let error = Object.assign({}, errors);
            delete error['releasedate'];
            delete error['releaseyear'];
            setErrors(error);
        }
        if (e.target.name == 'releaseyear') {
            const inputYear = parseInt(e.target.value);
            const currentYear = new Date().getFullYear();

            if (inputYear >= 1900 && inputYear <= currentYear) {
                let error = Object.assign({}, errors);
                // setEditContent({ ...editcontent, releaseyear: e.target.value });
                formvalues['releaseyear'] = e.target.value 
                delete error['releaseyear'];
                setErrors(error);
            } else {
                let error = Object.assign({}, errors);
                error['releaseyear'] = 'Please enter a year between 1900 and the current year'
                setErrors(error);
            }
        }
        if (e.target.name == "releasedate") {
            let date = moment(new Date(e.target.value)).toISOString();

            console.log('11111111111111111111111111111')
            const inputDate = e.target.value;
            const selectedDate = new Date(inputDate);

            const minDate = new Date('1900-01-01');
            const maxDate = new Date(); // Today's date

            if (selectedDate >= minDate && selectedDate <= maxDate) {
                console.log('222222222222222222222222',e.target.value.slice(0, 4))

                let error = Object.assign({}, errors);
                delete error['releasedate'];
                delete error['releaseyear'];
                setErrors(error);
                formvalues[e.target.name] = date
                formvalues['releaseyear'] = e.target.value.slice(0, 4) 
                // setEditContent({ ...editcontent, [e.target.name]: date, releaseyear: e.target.value.slice(0, 4) });
            } else {
                console.log('333333333333333333333333333333')

                let error = Object.assign({}, errors);
                error['releasedate'] = 'Please select a date between 1900 and today'
                console.log('error',error)

                setErrors(error);
            }



        }
         if (e.target.name == "cast" || e.target.name == "director") {
            var temp = new Array();
            temp = e.target.value && e.target.value.split(",");
            formvalues[e.target.name] = temp
            // setEditContent({ ...editcontent, [e.target.name]: temp });
        } else if(e.target.name ==='IMDBrating'){
            const inputValue = e.target.value;
            const sanitizedValue = inputValue.replace(/[^0-9.]/g, ''); // Remove non-digit and non-decimal point characters
            const floatValue = parseFloat(sanitizedValue); // Parse the sanitized value as a float
            let error = Object.assign({}, errors);
            console.log('IMDBrating', floatValue)
            console.log('sanitizedValue', sanitizedValue)
            console.log('formvalueaass111',formvalues)
            // Update the state with the validated float (or empty string if invalid)
            if (!isNaN(floatValue) || sanitizedValue === '') {
              console.log('IMDBrating---------->', floatValue)
              
              formvalues[e.target.name] = sanitizedValue
            //   setEditContent({ ...editcontent, [e.target.name]: sanitizedValue });
              delete error['IMDBrating'];
            } else {
                console.log('IMDBrating error', error)
              error['IMDBrating'] = 'Please enter a valid float value'
              setErrors(error);
            }
        }
        else{
            console.log('e.target.value222222222--->', e.target.value)
            formvalues[e.target.name] = e.target.value
            console.log('formvaluess',formvalues)
            // setEditContent({ ...editcontent, [e.target.name]: e.target.value });
            setEditContent(formvalues)
        }
        formvalues[e.target.name] = e.target.value
        // const updatedObject = { ...editcontent };
    
        // Iterate through the keys of the object
        for (const key in formvalues) {
          if (formvalues.hasOwnProperty(key)) {
            const value = formvalues[key];
    
            // Check if the value is an empty string, empty array, or undefined
            if (value === '' || (Array.isArray(value) && value.length === 0) || value === undefined) {
              // Delete the key from the object
              delete formvalues[key];
            }
          }
        }
        console.log('formvalues', formvalues)
        setEditContent(formvalues)
    
    }
    // console.log('editcontent', editcontent)



    const returnArray = (arr) => {
        let arr2 = []
        arr.map((eachItem) => {
            arr2.push(eachItem.value)
        })
        // console.log(arr2)
        return arr2
    }

    const handleChangeMultiSelect = (selected, key) => {
        GetTimeActivity()
        let newContent = Object.assign({}, editcontent);
        if (!!errors[key]) {
            let error = Object.assign({}, errors);
            delete error[key];
            setErrors(error);
        }
        if (key == 'category') {
            let selectedArrayNew = returnArray(selected);
            console.log('selectedArrayNew', selectedArrayNew);
            if (!selectedArrayNew.includes("MUSIC")) {
                console.log('1111111111111111111111111111111111111111')
                delete newContent['leadartist'];
                delete newContent['musicgenre'];
                setEditContent(newContent)
            }
            if (!selectedArrayNew.includes("SPORTS")) {
                console.log('2222222222222222222222222222222222222222')

                delete newContent['sport'];
                setEditContent(newContent)
            }
            if (selectedArrayNew.length == 1 && selectedArrayNew.includes("FORMATS")) {
                console.log('3333333333333333333333333333333333333333333')

                delete newContent['subtitleslanguages'];
                setEditContent(newContent)
            }
            if (!selectedArrayNew.includes("SPORTS") && !selectedArrayNew.includes("MUSIC") && !selectedArrayNew.includes("LIVE EVENTS")) {
                // console.log('444444444444444444444444444444444444444444')

                delete newContent['sport'];
                delete newContent['leadartist'];
                delete newContent['musicgenre'];
                // console.log('newContent', newContent); editcontent['category'].includes("LIFESTYLE")
                setEditContent(newContent)
            }
            //  if ((editcontent['category'] && !editcontent['category'].includes("FORMATS") ||
            //      editcontent['category'] && !editcontent['category'].includes("KIDS SERIES") ||
            //      editcontent['category'] && !editcontent['category'].includes("DOCUSERIES") ||
            //      editcontent['category'] && !editcontent['category'].includes("SERIES & TELENOVELAS") ||
            //      editcontent['category'] && !editcontent['category'].includes("COOKING SHOWS") ||
            //      editcontent['category'] && !editcontent['category'].includes("LIFESTYLE") ||
            //      editcontent['category'] && !editcontent['category'].includes("MOVIES") ||
            //      editcontent['category'] && !editcontent['category'].includes("MY CATEGORY")
            //  )) {
            //      delete newContent['genre'];
            //      // console.log('newContent----------->', newContent);
            //      setEditContent(newContent)
            //  }

            //  if ((editcontent['category'] && !editcontent['category'].includes("FORMATS") ||
            //      editcontent['category'] && !editcontent['category'].includes("LIVE EVENTS") ||
            //      editcontent['category'] && !editcontent['category'].includes("MUSIC") ||
            //      editcontent['category'] && !editcontent['category'].includes("SPORTS") ||
            //      editcontent['category'] && !editcontent['category'].includes("KIDS SERIES") ||
            //      editcontent['category'] && !editcontent['category'].includes("DOCUSERIES") ||
            //      editcontent['category'] && !editcontent['category'].includes("DOCUMENTARIES") ||
            //      editcontent['category'] && !editcontent['category'].includes("SERIES & TELENOVELAS") ||
            //      editcontent['category'] && !editcontent['category'].includes("SERIES & TELENOVELAS") ||
            //      editcontent['category'] && !editcontent['category'].includes("LIFESTYLE"))) {
            //      delete newContent['noofepisodes'];
            //      delete newContent['noofseasons'];
            //      // console.log('newContent', newContent);
            //      setEditContent(newContent)
            //  }


            // console.log('returnArray(selected);', returnArray(selected));
            setErrors({});
            getCompanies(selectedArrayNew).then((data) => {
                // console.log("companies data", data);
                if (data.statusCode == 200) {
                    if (data.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {
                        setCompaniesData(data.result);
                    }
                }
            }).catch((error) => {
                console.log(error);
            });
        }
        if (key == 'sport' || key == 'leadartist') {
            console.log('555555555555555555555555555555555555555')
            let error = Object.assign({}, errors);
            delete error['sport'];
            delete error['leadartist'];
            setErrors(error);
        }

        let selectedArray = returnArray(selected);
        setEditContent({ ...newContent, [key]: selectedArray });
    }

    // console.log('edit connentntnet', editcontent);

    const GetLookUp = async (e) => {
        try {
            let arrayType = ["country", "genre", "videoformat", "resolution", "musicgenre", "rights", "cuisine", "sports", "certificate", "language", "territories"];

            const response = await tmdbApi.getLookUp({
                type: arrayType,
                status: 'ACTIVE'
            });
            // console.log('response here', response);
            if (response.statusCode == 200) {
                let arrayType = ["country", "genre", "videoformat", "resolution", "musicgenre", "rights", "cuisine", "sports", "certificate", "language", "territories"];

                let lookupsData = response.result?.data || []

                arrayType.map((eachItem) => {
                    let arr1 = []
                    lookupsData.map((item1) => {
                        if (item1.type == eachItem) {
                            arr1.push(item1.name)
                        }
                    });
                    lookup[eachItem] = arr1
                    setLookUp({ ...lookup });
                })
                //  let arrayType = ["country","genre","videoformat","resolution","musicgenre","rights","cuisine","sports","certificate"];

                const countryObj = lookup.country.map((eachItem) => { return { value: eachItem, label: eachItem }; })
                setCountryData(countryObj)
                const genreObj = lookup.genre.map((eachItem) => { return { value: eachItem, label: eachItem }; })
                setGenreData(genreObj)

            }

        } catch {
            console.log("error");
        }
    }
    const handlePlayer = (e, content) => {
        GetTimeActivity()
        console.log("content", content)
        let inn = content && content.subtitles && content.subtitles.FRENCH
        if (content.filetype === "VIDEO" && content?.video?.m3u8?.proxyUrl) {
            let source = window.site.common.proxiesCloudFront + content?.video?.m3u8?.proxyUrl
            // let subtitlePath = window.site.common.proxiesCloudFront +"/"+ content?.subtitles
            let allSubTitles = content?.subtitles
            const k = allSubTitles?.map(eachItem=>{
                return {...eachItem,path: window.site.common.proxiesCloudFront+"/"+eachItem.path}
            })
            if(content?.subtitles)
            setPlayerSubTitles(k)
         
            setPlayContent(source);
           
            setPlay(true);
            console.log("playercontent", content);
        }
        if (content.filetype === "AUDIO") {
            let source = window.site.common.proxiesCloudFront + content?.video?.m3u8?.proxyUrl
            setPlayContent(source);
            setPlay(true);
            console.log("playercontent", content);
        }
        // if (content.filetype === "VTT"|| content.filetype === "SRT") {
        //     let source = window.site.common.proxiesCloudFront + content?.video?.m3u8?.proxyUrl
        //     let subtitlePath = window.site.common.proxiesCloudFront + content?.sourcepath
        //     setPlayerSubTitles(subtitlePath)
        //     setPlayContent(source);
        //     setPlay(true);
        //     console.log("playercontent", content);
        // }

    }
    const openFileViewer = (e, content) => {
        GetTimeActivity()
        console.log('contenttt item',content)
        let source;
        // if (content.filetype === "JPG") {
        source = window.site.common.resourcesUrl + "/" + content.sourcepath;
        // console.log("source", source)
        // console.log("source", content)
        // } else {
        //     source = window.site.common.proxiesCloudFront + "/" + content.sourcepath;
        //     console.log("source", source)
        // }
        setFileDocName(content.name != "" ? content.name :content.filename)
        setPlayContent(source);
        setType(content.mimetype);
        setshowDoc(true);
        console.log("source content", content);
        console.log("source content",);
    }

    const handleAddFile = (e, item, type) => {
        GetTimeActivity()
        console.log("item", item);
        console.log("type", type);
        setFileCategory(item);
        setUploadType(type);
        setShowUpload(true);
    }
    const deleteSubtitle = (e,item) => {
        GetTimeActivity()
     
       const uuid = item?.uuid
       const token = localStorage.getItem("token")
       const userid = localStorage.getItem("userId")

       SetSubLoader(item?.label)
       axios({
           method: 'POST',
           url: lambda + '/updatecontentfile?appname=' + appname + "&contentfileid=" + activeTrailerId + "&uuid=" + uuid +"&token=" + token + "&userid=" + userid,
       })
           .then(function (response) {
               if (response) {
                   if (response.data.result == "Invalid token or Expired") {
                       setShowSessionPopupup(true)
                   } else {
                       getContentFiles(id).then((data) => {
                           // console.log("getClientcontent data", data);
                           if (data.statusCode == 200) {
                               //  console.log(data.result, "---")
                               if (data.result == "Invalid token or Expired") {
                                   setShowSessionPopupup(true)
                               } else {
                                   setFilesData(data.result);
                                   console.log('data.result--------->',data.result)
                                    const k = data && data.result && data.result.length>0 && data.result.filter(eachItem=>eachItem.contentfileid === activeTrailerId)
                                    
                                    setActiveSubTitles(k && k[0]&& k[0]?.subtitles)
                                   setDelete(false)
                                   SetSubLoader('')
                                   setDelPopup(true)
                               }

                           }
                       }).catch((error) => {
                        SetSubLoader('')
                           setDelete(false)
                           console.log(error);
                       })
                       // setDelete(true);
                   }
               }
           });

    }
    const getSubtitles = () => {
        GetTimeActivity()
      const token = localStorage.getItem("token")
      const userid = localStorage.getItem("userId")

        
        axios({ 
            method: 'POST',
            url: lambda +'/lookups?appname=' + appname+ "&token=" + token + "&userid=" + userid,
            data: {type: ["subtitlelanguage"]}
          })
            .then(function (response) {
              console.log("response", response);
              let data = response && response.data && response.data.result && response.data.result.data && response.data.result.data.length>0 ? response.data.result.data :[]
              if(data.length>0){
                  // Create a new array C
                  let arrayC = [];

                  // Iterate through arrayA
                  for (let itemA of data) {
                      // Check if the item from A is present in B
                      if (!activeSubTitles.some(itemB => itemB.lang === itemA.languagecode)) {
                          // If not present in B, add it to C
                          arrayC.push(itemA);
                      }
                  }
                  
              
                setSubTitlesData(data)
              }
              
            });
    }
    const handleAddSubtitle = (e,item)=>{
        GetTimeActivity()
        getSubtitles()


        // const filteredA = subTitlesData.filter(aObj => !item?.subtitles.some(bObj => bObj.lang === aObj.code))
     
        // console.log('filteredAfilteredAfilteredA',filteredA)

        // setSubTitlesData(filteredA)
        // console.log('itemitemitemitem',item)
        setFileCategory("SUBTITLE");
        setActiveTrailerId(item.contentfileid)
        setActiveSubTitles(item?.subtitles != undefined ? item?.subtitles : [])
        setActiveVideo(item)
        // setShowSubUpload(true);
    }
    // console.log('active trailer',activeSubTitles)

    const handleClose = (e) => {
        GetTimeActivity()
        setShowUpload(false);
        setShowSubUpload(false);
        setFileName("");
        ref.current.value = "";
        setExcededFile(false)
        setVideoExcededFile(false)
    }

    const handleDeleteFile = (e, fileid, type) => {
        GetTimeActivity()
        if (type == 'seller') setDelSeller(true)
        setDelete(true);
        console.log('fileid', fileid)
        setItem(fileid);
    }
    const handleDeleteImage = (e, field) => {
        GetTimeActivity()
        console.log('fileidfileidfileid', field)
        setIsdeleteImage(true);
        setItem(field)

    }
    const onCancelDelete = () => {
        GetTimeActivity()
        setIsdeleteImage(false)
        setItem("")
    }
    const confirmDeleteImage = (e) => {
        GetTimeActivity()
        setBtnLoader(true)
        // let newContent = Object.assign({}, editcontent);
        // delete newContent[item];
        // setEditContent(newContent)
        // console.log('after editcontent', editcontent)
        // setItem("");

        imageDeleteFun()
    }
    // console.log('render editcontent',editcontent)
    const handleDelete = (e) => {
        GetTimeActivity()
        const token = localStorage.getItem("token")
        const userid = localStorage.getItem("userId")

        setBtnLoader(true)
        axios({
            method: 'DELETE',
            url: lambda + '/contentfiles?appname=' + appname + "&contentid=" + id + "&contentfileid=" + item + "&token=" + token + "&userid=" + userid,
        })
            .then(function (response) {
                if (response) {
                    if (response.data.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {
                        getContentFiles(id).then((data) => {
                            // console.log("getClientcontent data", data);
                            if (data.statusCode == 200) {
                                //  console.log(data.result, "---")
                                if (data.result == "Invalid token or Expired") {
                                    setShowSessionPopupup(true)
                                } else {
                                    setFilesData(data.result);
                                    setDelete(false)
                                    setBtnLoader(false)
                                    setDelPopup(true)
                                }

                            }
                        }).catch((error) => {
                            setBtnLoader(false)
                            setDelete(false)
                            console.log(error);
                        })
                        // setDelete(true);
                    }
                }
            });

    }

    const deleteSellerFun = (item) => {
        GetTimeActivity()
        // console.log('clientcontentid',item)
        const token = localStorage.getItem("token")
        const userid = localStorage.getItem("userId")

        setBtnLoader(true)
        axios({
            method: 'DELETE',
            url: lambda + '/clientcontent?appname=' + appname + "&contentid=" + id + "&clientcontentid=" + item.clientcontentid + "&token=" + token + "&userid=" + userid,
        })
            .then(function (response) {
                if (response) {
                    if (response.data.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {

                        console.log('responsseeeeeeeeee', response)
                        getSellersData()
                        setDelete(false)
                        setBtnLoader(false)
                        setDelPopup(true)
                        setDelSeller(false)
                    }
                }
            }).catch((error) => {
                setDelete(false)
                setBtnLoader(false)
                console.log(error);
            });

    }
    // console.log('sellerContent',sellerContent)

    function onCancel() {
        GetTimeActivity()
        setDelete(false)
        setDelSeller(false)
    }

    const ContentFiles = (e) => {
        GetTimeActivity()
        getContentFiles(id).then((data) => {
            console.log("getClientcontent data", data);
            if (data.statusCode == 200) {
                // console.log(data.result, "---")
                if (data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setFilesData(data.result);
                    console.log('data.result--------->',data.result)
                    if(activeTrailerId != "" && activeTrailerId != undefined){
                        const k = data && data.result && data.result.length>0 && data.result.filter(eachItem=>eachItem.contentfileid === activeTrailerId)
                        // console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',k)
                        setActiveSubTitles(k && k[0]&& k[0]?.subtitles)
                    }
                    

                }
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    const uploads3Subtitle = async (e, type) => {
        GetTimeActivity()
        console.log("type---------", type[2]);
        // setBtnLoader(true);
    
       
      
            console.log('upload s3 subtitle')
        setBtnLoader(true)
        var fileData = new FormData();
        var file = e.target.files[0];
         console.log("file", file);
            var uploadFilePath = "";
            var filename = e.target.files[0].name;
            var s3file = e.target.files[0];
            fileData.append(type[1], s3file);
            var bucket;

            var reader = new FileReader();
            reader.readAsDataURL(s3file);
            reader.onload = function (e) {
            
                var ObjectID = require("bson-objectid");
                var fileid = new ObjectID().toString();

                var videoId =  type[1]

                let format = file.name.split(".");
                var fileformat = format[format.length - 1]
                
                const timestamp = Date.now();
               
              
                let extension = fileformat.toUpperCase()
                console.log("type", file.type)
                // var path = "hotfolder/" + id;
            
                    uploadFilePath = appname + "/subtitles/" + videoId+ "/" + fileid + "/" + fileid + "_" + timestamp + "." + fileformat;
                    bucket = window.site.common.proxiesBucket;
              
                var data = { source_bucket: bucket, sourcepath: uploadFilePath }
                const token = localStorage.getItem("token")
                const userid = localStorage.getItem("userId")

                

                axios.post(lambda + '/uploadFiles?appname=' + appname + "&token=" + token + "&userid=" + userid, data, { type: 'application/json' })
                    .then((response) => {
                        if (response.data && response.data.result) {
                            var url = response.data.result;

                            console.log("url", url);
                            axios.put(url, file, {
                                "headers": {
                                    "Content-Type": "multipart/form-data",
                                    "Accept": "/",
                                    "Cache-Control": "no-cache",
                                    "Accept-Encoding": "gzip, deflate",
                                    "Connection": "keep-alive",
                                    "cache-control": "no-cache"
                                }
                            })
                                .then((response) => {
                                    if (response && response.status === 200) {

                                        let imageUploadPath = uploadFilePath;
                                        console.log("parth", imageUploadPath);

                                        const now = new Date();
                                        const year = now.getFullYear();
                                        const month = (now.getMonth() + 1).toString().padStart(2, '0');
                                        const day = now.getDate().toString().padStart(2, '0');
                                        const hours = now.getHours().toString().padStart(2, '0');
                                        const minutes = now.getMinutes().toString().padStart(2, '0');
                                        const seconds = now.getSeconds().toString().padStart(2, '0');

                                        const currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                                            const token = localStorage.getItem("token")
                                            const userid = localStorage.getItem("userId")
                                          
                                            axios({
                                                method: 'POST',
                                                url: lambda + '/updatecontentfile?appname=' + appname + "&userid=" + userid + "&contentfileid="+videoId+"&token=" + token + "&userid=" + userid,
                                                data: {"subtitles":[{createOn: currentDateTime,
                                                    fileType :  extension,
                                                    path :  uploadFilePath,
                                                    label :  subTitlesFormData.label,
                                                    lang : subTitlesFormData.lang,
                                                    uuid: fileid}]},
                                            })

                                                .then(function (response) {
                                                    if (response.data.statusCode === 200) {

                                                        setShowSubUpload(false);

                                                        getContent();
                                                        setSubSuccess(true);
                                                        setFileName("");
                                                        setUploadType("");
                                                    
                                                        setBtnLoader(false)
                                                        ContentFiles();
                                                        setSubTitlesFormData({})


                                                    }
                                                });
                                        


                                    }
                                })
                                .catch((err) => {
                                    console.error.bind(err);
                                })
                        }
                    })
                    .catch((err) => {
                        console.error.bind(err);
                    })

            }
        }

    

    const uploadS3 = async (e, type) => {
        GetTimeActivity()
        console.log("type---------", type[2]);
        // setBtnLoader(true);
    
        setBtnLoader(true)
        var fileData = new FormData();
        var file = e.target.files[0];
        if (fileCategory === "CONTENT_IMAGE" && file.size >= 10000000) {
            setExcededFile(true)
            setBtnLoader(false);
        } else if (fileCategory != "CONTENT_IMAGE" && file.size >= 1200000000) {
            setVideoExcededFile(true);
            setBtnLoader(false);
        } else {
            console.log("file", file);
            var uploadFilePath = "";
            var filename = e.target.files[0].name;
            var s3file = e.target.files[0];
            fileData.append(type[1], s3file);
            var bucket;

            var reader = new FileReader();
            reader.readAsDataURL(s3file);
            reader.onload = function (e) {
                var image = new Image();
                image.src = e.target.result;
                var ObjectID = require("bson-objectid");
                var fileid = new ObjectID().toString();

                var videoId =  type[1]

                let format = file.name.split(".");
                var fileformat = format[format.length - 1]
                console.log('file------>',file)
                console.log('formatttt------>',format)
                console.log('fileformat------>',fileformat)
                const timestamp = Date.now();
                console.log("format", format)
                console.log("fileformat", fileCategory)
                let allowedVideoFiles = ["avi", "divx", "f4v", "flv", "mts", "m2t", "m4v", "mkv", "mov", "mp4", "mpeg", "mpg", "mxf", "r3d", "wmv"]
                let audio = ["aif", "aiff", "m4a", "mp3", "ogg", "wav"]
                let extension;
                if (allowedVideoFiles.includes(fileformat)) {
                    extension = "VIDEO"
                } else if (audio.includes(fileformat)) {
                    extension = "AUDIO"
                } else {
                    extension = fileformat.toUpperCase()
                }


                if (extension === "VIDEO") {
                    bucket = window.site.common.sourceBucket;
                } else if (extension === "AUDIO") {

                    bucket = window.site.common.sourceBucket;
                } else {
                    bucket = window.site.common.resourceBucket;
                }

                console.log("type", file.type)
                var path
                if (fileCategory === "CONTENT_IMAGE") {
                    path = "content/" + id;
                }else{
                    path = "hotfolder/" + id;
                }

                
                uploadFilePath = appname + "/" + path + "/" + fileid + "_" + fileCategory + "_" + timestamp + "." + fileformat;
                if(fileCategory === "SUBTITLE"){
                    uploadFilePath = appname + "/subtitles/" + videoId+ "/" + fileid + "/" + fileid + "_" + timestamp + "." + fileformat;
                    bucket = window.site.common.proxiesBucket;
                }
                // let imagePath = window.site && window.site.common && window.site.common.resourcesUrl;
                var data = { source_bucket: bucket, sourcepath: uploadFilePath }
                const token = localStorage.getItem("token")
                const userid = localStorage.getItem("userId")

                

                axios.post(lambda + '/uploadFiles?appname=' + appname + "&token=" + token + "&userid=" + userid, data, { type: 'application/json' })
                    .then((response) => {
                        if (response.data && response.data.result) {
                            var url = response.data.result;

                            console.log("url", url);
                            axios.put(url, file, {
                                "headers": {
                                    "Content-Type": "multipart/form-data",
                                    "Accept": "/",
                                    "Cache-Control": "no-cache",
                                    "Accept-Encoding": "gzip, deflate",
                                    "Connection": "keep-alive",
                                    "cache-control": "no-cache"
                                }
                            })
                                .then((response) => {
                                    if (response && response.status === 200) {

                                        let imageUploadPath = uploadFilePath;
                                        console.log("parth", imageUploadPath);

                                        const now = new Date();
                                        const year = now.getFullYear();
                                        const month = (now.getMonth() + 1).toString().padStart(2, '0');
                                        const day = now.getDate().toString().padStart(2, '0');
                                        const hours = now.getHours().toString().padStart(2, '0');
                                        const minutes = now.getMinutes().toString().padStart(2, '0');
                                        const seconds = now.getSeconds().toString().padStart(2, '0');

                                        const currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                                        // const current = new Date();
                                        // const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

                                        if (fileCategory === "CONTENT_IMAGE") {
                                            // setBtnLoader(false);



                                            let obj = {}
                                            if (type[2] === "landscape") {
                                                let error = Object.assign({}, errors);
                                                delete error["landscapeimage"];
                                                delete error["portraitimage"];
                                                setErrors(error);
                                                console.log('error', errors)
                                                obj = {
                                                    "landscapeimage": imageUploadPath
                                                }
                                            } else if (type[2] === "portrait") {
                                                let error = Object.assign({}, errors);
                                                delete error["landscapeimage"];
                                                delete error["portraitimage"];
                                                setErrors(error);
                                                console.log('error', errors)
                                                obj = {
                                                    "portraitimage": imageUploadPath
                                                }
                                            } else {

                                                obj = {
                                                    "thumbnail": imageUploadPath
                                                }
                                            }

                                            console.log("obj", obj)
                                            const userid = localStorage.getItem("userId")

                                           
                                            axios({
                                                method: 'POST',
                                                url: lambda + '/updatecontent?appname=' + appname + "&contentid=" + id + "&token=" + token + "&userid=" + userid,
                                                data: obj,
                                            })

                                                .then(function (response) {
                                                    if (response.data.statusCode === 200) {

                                                        setShowUpload(false);

                                                        getContent();
                                                        setUploadSuccess(true);
                                                        setFileName("");
                                                        setUploadType("");
                                                        ref.current.value = "";
                                                        // setBtnLoader(false)


                                                    }
                                                });

                                        } else if(fileCategory === "SUBTITLE"){
                                            const token = localStorage.getItem("token")
                                            const userid = localStorage.getItem("userId")
                                          
                                            axios({
                                                method: 'POST',
                                                url: lambda + '/updatecontentfile?appname=' + appname + "&userid=" + userid + "&contentfileid="+videoId+"&token=" + token + "&userid=" + userid,
                                                data: {"subtitles":[{createOn: currentDateTime,
                                                    fileType :  extension,
                                                    path :  uploadFilePath,
                                                    label :  subTitlesFormData.label,
                                                    lang : subTitlesFormData.lang,
                                                    uuid: fileid}]},
                                            })

                                                .then(function (response) {
                                                    if (response.data.statusCode === 200) {

                                                        setShowSubUpload(false);

                                                        getContent();
                                                        setSubSuccess(true);
                                                        setFileName("");
                                                        setUploadType("");
                                                    
                                                        setBtnLoader(false)
                                                        ContentFiles();
                                                        setSubTitlesFormData({})


                                                    }
                                                });
                                        }else
                                        {

                                            let allowedVideoFiles = ["avi", "divx", "f4v", "flv", "mts", "m2t", "m4v", "mkv", "mov", "mp4", "mpeg", "mpg", "mxf", "r3d", "wmv"]
                                            let audio = ["aif", "aiff", "m4a", "mp3", "ogg", "wav"]
                                            let extension;
                                            if (allowedVideoFiles.includes(fileformat)) {
                                                extension = "VIDEO"
                                            } else if (audio.includes(fileformat)) {
                                                extension = "AUDIO"
                                            } else {
                                                extension = fileformat.toUpperCase()
                                            }
                                            let uploadObj = {};

                                            uploadObj.appname = appname;
                                            uploadObj.contentType = fileCategory;
                                            uploadObj.contentfileid = fileid;
                                            uploadObj.contentid = id;
                                            // uploadObj.created = date.replaceAll("/", "-");
                                            uploadObj.created = currentDateTime;
                                            uploadObj.filename = file.name;

                                            uploadObj.filetype = extension;
                                            uploadObj.mimetype = fileformat;
                                            uploadObj.name = fileName;
                                            uploadObj.sourcepath = imageUploadPath;
                                            uploadObj.createdBy = { userid: localStorage.getItem("userId"), username: localStorage.getItem("ClientName") }
                                            uploadObj.source = "admin";
                                            uploadObj.contentStatus = editcontent.status;
                                            (fileformat == "mp4" ||  fileformat == "mp3" ) ? uploadObj.status = "UPLOADED" : uploadObj.status = "AVAILABLE";
                                            // setBtnLoader(false);
                                            const userid = localStorage.getItem("userId")

                                            axios({
                                                method: 'PUT',
                                                url: lambda + '/contentfiles?appname=' + appname + "&token=" + token + "&userid=" + userid,
                                                data: uploadObj,
                                            })
                                                .then(function (response) {
                                                    if (response) {
                                                        // setBtnLoader(false)
                                                        setShowUpload(false);
                                                        setSuccess(true)
                                                        ContentFiles();

                                                        setFileName("");
                                                        ref.current.value = "";


                                                    }
                                                }) .catch((err) => {
                                                    setBtnLoader(false)
                                                    console.log(err);
                                                });

                                        }



                                    }
                                })
                                .catch((err) => {
                                    console.error.bind(err);
                                })
                        }
                    })
                    .catch((err) => {
                        console.error.bind(err);
                    })

            }
        }

    }

    // console.log("userData",userData)

const previewImage = (e,value)=>{
    GetTimeActivity()
    console.log('valueeeee',value)
    setShowPreview(true)
    setPreviewImg(value)
}
    const filesTab = () => {

        return (
            <div className={`tab-pane ${activeTab == 'files' ? 'active show' : ''}`} role="tabpanel" id="videoclips">
                {id ?

                  <>  <div className="col-md-3 basic-info-img">
                        {/* {id ? <a className="btn btn-primary" onClick={(e) => handleAddFile(e, "CONTENT_IMAGE")}><span className="material-icons">add</span>add</a> : null}
                                             {(image && editcontent.thumbnail) && <img src={image + editcontent.thumbnail + "?auto=compress,format&width=" + cardWidth} /> */}

                        {/* <div className="position-relative">
                                                     {(image && editcontent.thumbnail) && <img src={image + editcontent.thumbnail + "?auto=compress,format&width=" + cardWidth} />}
                                                     <div className="edit-info black-gradient">
                                                         <button className="border-btn_sm" onClick={(e) => handleAddFile(e, "CONTENT_IMAGE")}><i className="mdi mdi-pencil font-size-18"></i></button>
                                                     </div>
                                                 </div> */}

                        <div className="position-relative">
                            <h5 className="font-size-14">portrait image</h5>
                            {/* {(image && editcontent.thumbnail) && <img src={image + editcontent.thumbnail + "?auto=compress,format&width=" + cardWidth} />} */}
                            {(image && editcontent.portraitimage && editcontent.portraitimage != "") ?
                                <img src={image + editcontent.portraitimage + "?auto=compress,format&width=" + cardWidth} /> : <img src={image + "orasi/common/images/img-default.jpg?auto=compress,format&width=" + cardWidth} />}
                            <div className="edit-info black-gradient portrait-btns">
                         
                            {(image && editcontent.portraitimage && editcontent.portraitimage != "") ?   
                            <button className="border-btn_sm portrait team-edit-btn preview-btn" style={{ zIndex: "999" }}
                             onClick={(e) => previewImage(e,image + editcontent.portraitimage)}><i className="mdi mdi-eye font-size-18"></i></button>:
                             null}



                                <button className="border-btn_sm portrait team-edit-btn" style={{ zIndex: "999" }} onClick={(e) => handleAddFile(e, "CONTENT_IMAGE", "portrait")}><i className="mdi mdi-pencil font-size-18"></i></button>

                                {(image && editcontent.landscapeimage != undefined && editcontent.landscapeimage != "" && editcontent.portraitimage != "" && editcontent.portraitimage != undefined) ? <button className="border-btn_sm portrait-delete" onClick={(e) => handleDeleteImage(e, "portraitimage")}><i className="mdi mdi-delete font-size-18"></i></button> : ""}
                            </div>
                        </div>
                        <div className="position-relative">
                            <h5 className="font-size-14">landscape image</h5>
                            {(image && editcontent.landscapeimage && editcontent.landscapeimage != "") ? <img src={image + editcontent.landscapeimage + "?auto=compress,format&width=" + cardWidth} /> : <img src={image + "orasi/common/images/img-default-landscape.jpg?auto=compress,format&width=" + cardWidth} />}
                            <div className="edit-info black-gradient landscape-btns">

                            {(image && editcontent.landscapeimage && editcontent.landscapeimage != "") ? 

                            <button className="border-btn_sm landscape team-edit-btn preview-btn" onClick={(e) => previewImage(e,image + editcontent.landscapeimage)}><i className="mdi mdi-eye font-size-18"></i></button>
                            :null}




                                <button className="border-btn_sm landscape" onClick={(e) => handleAddFile(e, "CONTENT_IMAGE", "landscape")}><i className="mdi mdi-pencil font-size-18"></i></button>

                                {/* <button className="border-btn_sm landscape-delete"><i className="mdi mdi-delete font-size-18"></i></button> */}
                                {(image && editcontent.landscapeimage != undefined && editcontent.landscapeimage != "" && editcontent.portraitimage != "" && editcontent.portraitimage != undefined) ? <button onClick={(e) => handleDeleteImage(e, "landscapeimage")} className="border-btn_sm landscape-delete"><i className="mdi mdi-delete font-size-18"></i></button> : ""}
                            </div>

                        </div>


                    </div><p><span style={{ color: "red", fontSize: "16px" }}>*</span>Please upload image size less than 10MB</p></>
                    : null}
                {videoClipcategories?.map((eachItem, key) => {

                    const items = filesData.filter(item => item.contentType.indexOf(eachItem) !== -1);



                    // if(items && items[0]?.contentType){
                    return (
                        <>

                            {items.length > 0 ?

                                <div className="row" key={key}>

                                    <div className="col-md-3 d-flex align-items-center">
                                        <h5 className="font-size-14">{eachItem}</h5>
                                        {/* <a className="btn btn-primary" onClick={(e) => handleAddFile(e, eachItem)}><span className="material-icons">add</span>add</a> */}
                                        {/* <div className="add-block" onClick={(e) => handleAddFile(e, eachItem)}>
                                             <span className="material-icons-outlined">add</span>
                                             add
                                         </div> */}
                                    </div>
                                    <div className="col-md-9">

                                    </div>
                                    {filesData?.map((item, key) => {


                                        return (
                                            eachItem == item.contentType && <><div className="thumbnail-block">

                                                <span className="material-icons-outlined thumbnail-cls-icon" onClick={(e) => handleDeleteFile(e, item.contentfileid, 'file')}>highlight_off</span>
                                                <div className="asset-card">
                                                    {item.filetype == 'VIDEO' && item.status === "AVAILABLE" && <div className="play-icon">
                                                        <span className="material-icons-outlined">play_circle</span>
                                                    </div>}
                                                    <a className="spinner-class" onClick={(e) => (item.filetype == 'VIDEO') || (item.filetype == 'AUDIO') ? handlePlayer(e, item) : item.filetype != 'AUDIO' ? openFileViewer(e, item) : null}>
                                                        <img src={(editcontent.landscapeimage && image) ? image + editcontent.landscapeimage : (image && editcontent.portraitimage) ? image + editcontent.portraitimage : "https://orasi-dev.imgix.net/orasi/common/images/img-default.jpg"} />
                                                    </a>
                                                    <p style={{ clear: 'both', display: "inline-block", overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.name ? item.name : item.filename}</p>

                                                    {/* <button className="btn btn-primary btn-block btn-sm float-end" type="submit" onClick={(e)=>handleAddSubtitle(e, item)}>add Subtitles</button> */}

                                                    
                                                </div>
                                                <div className="offcanvas offcanvas-end" id="demo">
                                                    <div className="offcanvas-header">

                                                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
                                                    </div>
                                                    <div className="offcanvas-body">
                                                        <div className="thumbnail-block">
                                                            <div className="asset-card">
                                                                <a className="spinner-class">
                                                                <img src={(editcontent.landscapeimage && image) ? image + editcontent.landscapeimage : (image && editcontent.portraitimage) ? image + editcontent.portraitimage : "https://orasi-dev.imgix.net/orasi/common/images/img-default.jpg"} /></a>
                                                                <p>{activeVideo?.name}</p>
                                                            </div>
                                                        </div>
                                                        <div className="mb-3 mt-3 input-field">
                                                            <label className="form-label form-label">language</label>
                                                            <Select isMulti={false}
                                                                placeholder={"Select Language"}
                                                                onChange={(e) => handleSubTitles(e, 'subtitle')}

                                                                options={subTitlesData && activeSubTitles !=undefined && activeSubTitles.length>0 ? subTitlesData.filter(aObj => !activeSubTitles.some(bObj => bObj.lang === aObj.languagecode)).map((eachItem) => { return { value: eachItem.languagecode, label: eachItem.name } }): subTitlesData && subTitlesData.map((eachItem) => { return { value: eachItem.languagecode, label: eachItem.name } })}

                                                                // options={subTitlesData && subTitlesData.map((eachItem) => { return { value: eachItem.code, label: eachItem.name } })}


                                                                value={subTitlesFormData ?{ value: subTitlesFormData.languagecode, label: subTitlesFormData.name }:null}
                                                            />
                                                        </div>

                                                        <div className="mt-0 input-field">
                                                            <label className="form-label form-label">upload</label>
                                                            <div className={`btn-gray ${subTitlesFormData && Object.keys(subTitlesFormData).length>0 ? '':'disable pe-none'}`} >
                                                            <input type="file" name="upload" accept=".vtt, .srt, .ass, .ssa, .ttml" className="udisplay-none" id="upload"
                                                                onChange={e => uploadS3(e, ["1920*1080", activeTrailerId, "subtitles"])}
                                                                onClick={(e) => { e.target.value = ''; }} ref={ref} />

                                                                {BtnLoader ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : <span className="material-icons">upload</span>}Upload file</div>
                                                            {/* {subTitleErr && <p style={{ color: "red", fontSize: "14px" }}>Language Already Exists</p>} */}
                                                           
                                                            </div>
                                                       {activeSubTitles && activeSubTitles.length>0 ?
                                                        <div className="mb-4 mt-4 input-field">
                                                            <label className="form-label form-label">available subtitles</label>
                                                            <div className="d-flex">
                                                                {activeSubTitles && activeSubTitles.length>0 && activeSubTitles.map((eachSubtitle)=>{

                                                                    return(
                                                                        <div className="sub-titles">
                                                                            <p>{eachSubtitle.label}</p>
                                                                            {subLoader === eachSubtitle.label ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) :<span className="material-icons-outlined" style={{cursor:'pointer'}} onClick={(e)=>deleteSubtitle(e,eachSubtitle)}>close</span>}
                                                                        </div>
                                                                    )
                                                                })}
                                                                
                                                            </div>
                                                        </div>:null}

                                                    </div>
                                                </div>
                                                {item.contentType === "TRAILERS" &&
                                                <div className="container-fluid mt-3">
                                                    <button className="btn btn-primary offcanvas-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#demo" onClick={(e)=>handleAddSubtitle(e, item)}>
                                                        <span className="material-icons-outlined">closed_caption</span>
                                                    </button>
                                                </div>}
                                            </div>

                                            </>
                                        )

                                    })}
                                    <div className="add-block" onClick={(e) => handleAddFile(e, eachItem)}>
                                        <span className="material-icons-outlined">add</span>
                                        add
                                    </div>

                                </div>
                                : <div className="row" key={key}>
                                    <div className="col-md-3 d-flex align-items-center">
                                        <h5 className="font-size-14">{eachItem}</h5>

                                        {/* <a className="btn btn-primary" onClick={(e) => handleAddFile(e, eachItem)}><span className="material-icons">add</span>add</a> */}
                                    </div>
                                    <div className="col-md-9">

                                    </div>
                                    {/* <p>No Files Found</p> */}
                                    <div className="add-block" onClick={(e) => handleAddFile(e, eachItem)}>
                                        <span className="material-icons-outlined">add</span>
                                        add
                                    </div>
                                </div>
                            }
                        </>
                    )



                    // }

                })
                }
                {play ?

                    <PlayerInfo source={playContent} play={play} setPlay={setPlay} subtitles={playerSubTitles} />
                    : null
                }
                {showDoc && <FileViewer source={playContent} type={type} close={setshowDoc} name={fileDocName}/>}
            </div>
        )
    }
    const submitNewLookup = (e) => {
        GetTimeActivity()
        let type;
        if (lookupType === "videoquality") {
            type = "videoformat"
        } else {
            type = lookupType
        }
        if (NewLookupValue === "") {
            setLookupErr("Please enter " + lookupType)
            setTimeout(function () { setLookupErr("") }, 3000);
        } else {
            let data = { "type": type, "name": NewLookupValue, "status": "ACTIVE", createdBy: { userid: userData.userid, username: userData.name } };
            console.log('data====>>', data)
            addLookup(data).then((data) => {
                console.log("getClientcontent data", data);
                if (data.statusCode == 200) {
                    // console.log(data.result, "---")
                    if (data.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {
                        GetLookUp();
                        setLookupType('');
                        setShowAddLookup(false);
                        setLookupSuccess(true)
                    }
                }
            }).catch((error) => {
                console.log(error);
            })
        }
    }
    const AddLookUp = () => {
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="mb-3 input-field">
                        <label className="form-label form-label">{lookupTypeName}</label>
                        <input id="email" name="lookupname" placeholder="Enter name" type="text" className="form-control" onChange={(e) => setNewLookupValue(e.target.value)} />
                        {lookupErr != "" && NewLookupValue.length <= 0 && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{lookupErr}</span>}
                        <a onClick={submitNewLookup} className="btn btn-primary">Add</a>
                    </div>
                </div>
            </div>
        )
    }
    const updateSeller = () => {
        return (
            <div className="row">
                <div className="col-md-12">

                    <div className="row">
                        {fields.map(eachfield => {
                            // console.log('eachfield 1111111',eachfield)
                            if ((eachfield.section === 'Seller' && eachfield.section !== undefined) && (eachfield.tab === 'seller' && eachfield.tab !== undefined)) {
                                // console.log('eachfield 2222222',eachfield)
                                // if (eachfield.default === true || eachfield.mandatory === true ) {

                                    // console.log('eachfield 33333333',eachfield)
                                    if (eachfield.inputtype === "multiselectdropdown") {
                                        // console.log('eachfield 4444444',eachfield)
                                        return (



                                            <div className='col-md-6'>
                                                <div className="mb-3 input-field">
                                                    <div className="title-block">
                                                        <label className="form-label form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>

                                                    </div>
                                                  
                                                    <Select isMulti={true}
                                                        placeholder={"Select " + eachfield.display}
                                                        onChange={(e) => handleFilter(e, eachfield.name)}
                                                        options={lookup && lookup[eachfield.lookupvalue] && lookup[eachfield.lookupvalue].map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                        value={sellerContent && Array.isArray(sellerContent[eachfield.name]) && sellerContent[eachfield.name] && sellerContent[eachfield.name]?.map((eachItem) => { return { value: eachItem, label: eachItem } }) }
                                                    />
                                                    {eachfield.mandatory === true && sellereErrors[eachfield.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors[eachfield.name]}</span>}
                                                </div>
                                            </div>)
                                    }
                                    if (eachfield.inputtype === "singledropdown" && eachfield.name == 'clientname') {
                                        return (

                                            <div className='col-md-6'>
                                                <div className="mb-3 input-field">
                                                    <div className="title-block">
                                                        <label className="form-label form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>

                                                    </div>
                                                    {/* <div className="mb-3 input-field">
                                <label className="form-label form-label">Company Name</label>
                                <Select
                                    placeholder='Select Company'
                                    isDisabled={true}
                                    onChange={(e) => handleFilter(e, 'companyid')}
                                    options={companiesData && companiesData.map((eachItem) => { return { value: eachItem.companyid, label: eachItem.companyname } })}
                                    value={{ value: sellerContent.companyid, label: sellerContent.companyname }}
                                />
                                {sellereErrors.companyid && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors.companyid}</span>}
                            </div> */}
                                                    <Select
                                                        placeholder={"Select " + eachfield.display}
                                                        onChange={(e) => handleFilter(e, 'companyid')}
                                                        isDisabled={true}
                                                        options={companiesData && companiesData.map((eachItem) => { return { value: eachItem.companyid, label: eachItem.companyname } })}
                                                       
                                                        value={{ value: sellerContent.companyid, label: sellerContent.companyname }}
                                                    />
                                                    {eachfield.mandatory === true && sellereErrors['companyname'] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors['companyname']}</span>}
                                                </div>
                                            </div>)
                                    }
                                    if (eachfield.inputtype === 'text' || eachfield.inputtype === "number") {
                                        return (
                                            <div className='col-md-6'>
                                                <div className="input-field">
                                                    <label for="example-text-input" className="col-form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>
                                                    <input className="form-control contact-number" type={eachfield.inputtype} name={eachfield.name} value={sellerContent[eachfield.name]} onChange={(e) => handleChange(e)} placeholder={'Enter ' + eachfield.display} id="example-email-input" />
                                                    {eachfield.mandatory === true && sellereErrors[eachfield.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors[eachfield.name]}</span>}
                                                </div>
                                            </div>)
                                    }
                                    if (eachfield.inputtype === "dropdown") {
                                        // console.log('eachfield dropdown',eachfield)
                                        return (
                                            <div className='col-md-6'>
                                                <div className="mb-3 input-field">
                                                    <label className="form-label form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>
                                                    <select className="form-select" placeholder={"Select " + eachfield.display} name={eachfield.name} value={sellerContent[eachfield.name]}
                                                        onChange={(e) => handleChange(e)} >
                                                        <option value="">Select</option>
                                                        <option value="false">False</option>
                                                        <option value="true">True</option>

                                                    </select>
                                                    {eachfield.mandatory === true && sellereErrors[eachfield.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors[eachfield.name]}</span>}


                                                </div>
                                            </div>)
                                    }
                                    if (eachfield.inputtype === "date") {
                                        return (
                                            <div className='col-md-6'>
                                                <div className="mb-3 input-field">
                                                  <label className="form-label form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>

                                                    <input id="email" placeholder={"Select " + eachfield.display} name={eachfield.name} value={sellerContent && sellerContent[eachfield.name] && moment(new Date(sellerContent[eachfield.name])).format('YYYY-MM-DD')} onChange={(e) => handleSellerChange(e)} type="date" className="form-control" max={new Date().toISOString().split('T')[0]}
                                                    />
                                                    {sellereErrors[eachfield.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors[eachfield.name]}</span>}
                                                </div>
                                            </div>)
                                    }
                                    if (eachfield.inputtype === "textarea") {
                                        return (
                                            <div className='col-md-6'>
                                                <div className="mb-3 input-field">
                                                    <label className="form-label form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>
                                                    <textarea id="email" placeholder={"Enter " + eachfield.display} name={eachfield.name} type="text" className="form-control" value={sellerContent[eachfield.name]} onChange={(e) => handleChange(e)} />
                                                    {eachfield.mandatory === true && sellereErrors[eachfield.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors[eachfield.name]}</span>}
                                                </div>
                                            </div>)
                                    }

                                // }

                            }

                        })}



                    </div>

                    {/* <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3 input-field">
                                <label className="form-label form-label">Company Name</label>
                                <Select
                                    placeholder='Select Company'
                                    isDisabled={true}
                                    onChange={(e) => handleFilter(e, 'companyid')}
                                    options={companiesData && companiesData.map((eachItem) => { return { value: eachItem.companyid, label: eachItem.companyname } })}
                                    value={{ value: sellerContent.companyid, label: sellerContent.companyname }}
                                />
                                {sellereErrors.companyid && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors.companyid}</span>}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="mb-3 input-field">
                                <label className="form-label form-label">Languages</label>

                                <Select isMulti={true}
                                    placeholder='Select Languages'
                                    onChange={(e) => handleFilter(e, 'languages')}
                                    options={lookup && lookup.language && lookup.language.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                    value={sellerContent && sellerContent.languages && sellerContent.languages.length > 0 ? sellerContent.languages?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                                />
                                {sellereErrors.languages && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors.languages}</span>}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="mb-3 input-field">
                                <label className="form-label form-label">RIGHTS AVAILABLE</label>
                                <Select isMulti={true}
                                    placeholder='Select Rights'
                                    onChange={(e) => handleFilter(e, 'typeofrights')}
                                    options={lookup && lookup.rights && lookup.rights.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                    value={sellerContent && sellerContent.typeofrights && sellerContent.typeofrights.length > 0 ? sellerContent.typeofrights?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                                />
                                {sellereErrors.typeofrights && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors.typeofrights}</span>}
                            </div>
                        </div>

                        {!(editcontent['category']?.length == 1 && editcontent['category'].includes('FORMATS')) && <><div className="col-md-6">
                            <div className="mb-3 input-field">
                                <label className="form-label form-label">Resolution</label>
                                <Select isMulti={true}
                                    placeholder='Select Resolution'
                                    onChange={(e) => handleFilter(e, 'resolution')}
                                    options={lookup && lookup.resolution && lookup.resolution.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                    value={sellerContent && sellerContent.resolution && sellerContent.resolution.length > 0 ? sellerContent.resolution?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                                />
                            </div>
                        </div>

                            <div className="col-md-6">
                                <div className="mb-3 input-field">
                                    <label className="form-label form-label">Rights Available From Date</label>
                                    <input id="email" name="rightsavailablefromdate" type="date" placeholder="Rights Available From Date" className="form-control" onChange={(e) => handleSellerChange(e)} value={sellerContent && sellerContent.rightsavailablefromdate && moment(new Date(sellerContent.rightsavailablefromdate)).format('YYYY-MM-DD')} />




                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3 input-field">
                                    <label className="form-label form-label">Rights Available To Date</label>
                                    <input id="email" name="rightsavailabletodate" type="date" placeholder="Rights Available To Date" className="form-control" onChange={(e) => handleSellerChange(e)} value={sellerContent && sellerContent.rightsavailabletodate && moment(new Date(sellerContent.rightsavailabletodate)).format('YYYY-MM-DD')} />
                                    {sellereErrors.rightsavailabletodate && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors.rightsavailabletodate}</span>}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3 input-field">
                                    <label className="form-label form-label">Restriction Country</label>
                                    <Select isMulti={true}
                                        placeholder='Select Country'
                                        onChange={(e) => handleFilter(e, 'restrictedcountries')}
                                        options={lookup && lookup.country && lookup.country.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                        value={sellerContent && sellerContent.restrictedcountries && sellerContent.restrictedcountries.length > 0 ? sellerContent.restrictedcountries?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3 input-field">
                                    <label className="form-label form-label">Territories Available</label>


                                    <Select isMulti={true}
                                        placeholder='Select Territories'
                                        onChange={(e) => handleFilter(e, 'territoriesavailable')}
                                        options={lookup && lookup.territories && lookup.territories.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                        value={sellerContent && sellerContent.territoriesavailable && sellerContent.territoriesavailable.length > 0 ? sellerContent.territoriesavailable?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                                    />

                                    {sellereErrors.territoriesavailable && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors.territoriesavailable}</span>}
                                </div>
                            </div>
                        </>}
                        {["MOVIES", "SHORT FILMS", "COOKING SHOWS", "LIFESTYLE", "LINEAR CHANNELS", "SERIES & TELENOVELAS", "DOCUMENTARIES", "DOCUSERIES", "KIDS MOVIES", "KIDS SERIES"].some(el => editcontent['category']?.includes(el)) && <div className="col-md-6">
                            <div className="mb-3 input-field">
                                <label className="form-label form-label">Dubbing Languages</label>
                                <Select isMulti={true}
                                    placeholder='Select Languages'
                                    onChange={(e) => handleFilter(e, 'dubbinglanguages')}
                                    options={lookup && lookup.language && lookup.language.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                    value={sellerContent && sellerContent.dubbinglanguages && sellerContent.dubbinglanguages.length > 0 ? sellerContent.dubbinglanguages?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                                />
                            </div>
                        </div>

                        }


                    </div> */}

                    <div className="row">
                        <div className="col-md-12">
                            <button className="btn btn-primary btn-block btn-sm float-end" type="submit" onClick={submitSeller}>

                                {BtnLoader ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}{sellerContent && sellerContent.clientcontentid ? 'Update' : 'Add'}</button>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
    // console.log('sellereErrors',sellereErrors)
    const onclickAddSeller = () => {
        GetTimeActivity()
        if(!isFormVisible){
        setIsFormVisible(true);
         setSellercontent({});
          setSellereErrors({}) 
        }
    }
    const sellersTab = () => {
        return (<div className={`tab-pane ${activeTab == 'seller' ? 'active show' : ''}`} role="tabpanel">

            <div className="row">
                {(sellersData && sellersData.length > 0 || id != undefined) &&
                    <div>
                        <a onClick={(e) => onclickAddSeller(e) } className="btn btn-primary mb-2" >Add Seller</a>
                    </div>}
             

            </div>
            {(id == undefined || isFormVisible == true) &&
                <div className="row">
                    <div className="col-md-12">

                        <div className="row seller-tab">
                            {fields.map(eachfield => {
                                // console.log('eachfield 1111111',eachfield)
                                if ((eachfield.section === 'Seller' && eachfield.section !== undefined) && (eachfield.tab === 'seller' && eachfield.tab !== undefined)) {
                                    // console.log('eachfield 2222222',eachfield)
                                    // if (eachfield.default === true || eachfield.mandatory === true ) {

                                        // console.log('eachfield 33333333',eachfield)
                                        if (eachfield.inputtype === "multiselectdropdown") {
                                            // console.log('eachfield 4444444',eachfield)
                                            return (

                                           

                                                <div className='col-md-6'>
                                                    <div className="mb-3 input-field">
                                                        <div className="title-block">
                                                            <label className="form-label form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>

                                                        </div>

                                                        <Select isMulti={true}
                                                            placeholder={"Select " + eachfield.display}
                                                            onChange={(e) => handleFilter(e, eachfield.name)}
                                                            options={ lookup && lookup[eachfield.lookupvalue] && lookup[eachfield.lookupvalue].map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                            value={sellerContent && Array.isArray(sellerContent[eachfield.name]) && sellerContent[eachfield.name] ? sellerContent[eachfield.name]?.map((eachItem) => { return { value: eachItem, label: eachItem } }):[]}
                                                        />
                                                        {eachfield.mandatory === true && sellereErrors[eachfield.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors[eachfield.name]}</span>}
                                                    </div>
                                                </div>)
                                        }
                                        if (eachfield.inputtype === "singledropdown" && eachfield.name == 'clientname') {
                                            return (
                                             //     <div className="col-md-6">
                                            //     <div className="mb-3 input-field">
                                            //         <label className="form-label form-label">Company Name<span className="required">*</span></label>
                                            //         <Select placeholder="Select Company"
                                            //             onChange={(e) => handleFilter(e, 'companyid')}
                                            //             id="companyid"
                                            //             options={companiesData && companiesData.map((eachItem) => { return { value: eachItem.companyid, label: eachItem.companyname } })}
                                            //             value={sellerContent && sellerContent.companyid ? { value: sellerContent.companyid, label: sellerContent.companyname } : []}
                                            //         />
                                            //         {sellereErrors.companyname && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors.companyname}</span>}
                                            //     </div>
                                            // </div>
                                                <div className='col-md-6'>
                                                    <div className="mb-3 input-field">
                                                        <div className="title-block">
                                                            <label className="form-label form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>

                                                        </div>

                                                        <Select isMulti={false}
                                                            placeholder={"Select " + eachfield.display}
                                                            onChange={(e) => handleFilter(e, 'companyid')}
                                                            options={companiesData && companiesData.map((eachItem) => { return { value: eachItem.companyid, label: eachItem.companyname,item:eachItem } })}
                                                           
                                                            value={sellerContent && sellerContent[eachfield.name] && Array.isArray(sellerContent[eachfield.name]) && sellerContent[eachfield.name]?.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                        />
                                                        {eachfield.mandatory === true && sellereErrors['companyname'] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors['companyname']}</span>}
                                                    </div>
                                                </div>)
                                        }
                                        if (eachfield.inputtype === 'text' || eachfield.inputtype === "number") {
                                            return (
                                                <div className='col-md-6'>
                                                    <div className="input-field">
                                                        <label for="example-text-input" className="col-form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>
                                                        <input className="form-control contact-number" type={eachfield.inputtype} name={eachfield.name} value={sellerContent[eachfield.name]} onChange={(e) => handleChange(e)} placeholder={'Enter ' + eachfield.display} id="example-email-input" />
                                                        {eachfield.mandatory === true && sellereErrors[eachfield.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors[eachfield.name]}</span>}
                                                    </div>
                                                </div>)
                                        }
                                        if (eachfield.inputtype === "dropdown") {
                                            // console.log('eachfield dropdown',eachfield)
                                            return (
                                                <div className='col-md-6'>
                                                    <div className="mb-3 input-field">
                                                        <label className="form-label form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>
                                                        <select className="form-select" placeholder={"Select " + eachfield.display} name={eachfield.name} value={sellerContent[eachfield.name]}
                                                            onChange={(e) => handleChange(e)} >
                                                            <option value="">Select</option>
                                                            <option value="false">False</option>
                                                            <option value="true">True</option>

                                                        </select>
                                                        {eachfield.mandatory === true && sellereErrors[eachfield.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors[eachfield.name]}</span>}


                                                    </div>
                                                </div>)
                                        }
                                        if (eachfield.inputtype === "date") {
                                            console.log('rightsavailabletodaterightsavailabletodate',eachfield)
                                            return (
                                                <div className='col-md-6'>
                                                    <div className="mb-3 input-field">
                                                        <label className="form-label form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>

                                                        <input id="email" placeholder={"Select " + eachfield.display} name={eachfield.name} value={sellerContent && sellerContent[eachfield.name] && moment(new Date(sellerContent[eachfield.name])).format('YYYY-MM-DD')} onChange={(e) => handleSellerChange(e)} type="date" className="form-control" max={new Date().toISOString().split('T')[0]}
                                                        />
                                                        {sellereErrors[eachfield.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors[eachfield.name]}</span>}
                                                    </div>
                                                </div>)
                                        }
                                        if (eachfield.inputtype === "textarea") {
                                            return (
                                                <div className='col-md-6'>
                                                    <div className="mb-3 input-field">
                                                        <label className="form-label form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>
                                                        <textarea id="email" placeholder={"Enter " + eachfield.display} name={eachfield.name} type="text" className="form-control" value={sellerContent[eachfield.name]} onChange={(e) => handleChange(e)} />
                                                        {eachfield.mandatory === true && sellereErrors[eachfield.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors[eachfield.name]}</span>}
                                                    </div>
                                                </div>)
                                        }

                                    // }

                                }

                            })}
                            {/* <div className="col-md-6">
                                <div className="mb-3 input-field">
                                    <label className="form-label form-label">Company Name<span className="required">*</span></label>
                                    <Select placeholder="Select Company"
                                        onChange={(e) => handleFilter(e, 'companyid')}
                                        id="companyid"
                                        options={companiesData && companiesData.map((eachItem) => { return { value: eachItem.companyid, label: eachItem.companyname } })}
                                        value={sellerContent && sellerContent.companyid ? { value: sellerContent.companyid, label: sellerContent.companyname } : []}
                                    />
                                    {sellereErrors.companyname && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors.companyname}</span>}
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="mb-3 input-field">
                                    <label className="form-label form-label">Languages<span className="required">*</span></label>

                                    <Select isMulti={true}
                                        placeholder='Select Languages'
                                        onChange={(e) => handleFilter(e, 'languages')}
                                        options={lookup && lookup.language && lookup.language.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                        value={sellerContent && sellerContent.languages && sellerContent.languages.length > 0 ? sellerContent.languages?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                                    />
                                    {sellereErrors.languages && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors.languages}</span>}
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="mb-3 input-field">
                                    <label className="form-label form-label">RIGHTS AVAILABLE</label>
                                    <Select isMulti={true}
                                        placeholder='Select Rights'
                                        onChange={(e) => handleFilter(e, 'typeofrights')}
                                        options={lookup && lookup.rights && lookup.rights.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                        value={sellerContent && sellerContent.typeofrights && sellerContent.typeofrights.length > 0 ? sellerContent.typeofrights?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                                    />
                                    {sellereErrors.typeofrights && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors.typeofrights}</span>}
                                </div>
                            </div> */}

                            {/* {!(editcontent['category']?.length == 1 && editcontent['category'].includes('FORMATS')) && <><div className="col-md-6">
                                <div className="mb-3 input-field">
                                    <label className="form-label form-label">Resolution</label>
                                    <Select isMulti={true}
                                        placeholder='Select Resolution'
                                        onChange={(e) => handleFilter(e, 'resolution')}
                                        options={lookup && lookup.resolution && lookup.resolution.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                        value={sellerContent && sellerContent.resolution && sellerContent.resolution.length > 0 ? sellerContent.resolution?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                                    />
                                </div>
                            </div>

                                <div className="col-md-6">
                                    <div className="mb-3 input-field">
                                        <label className="form-label form-label">Rights Available From Date</label>
                                        <input id="email" name="rightsavailablefromdate" type="date" placeholder="Rights Available From Date" className="form-control" onChange={(e) => handleSellerChange(e)} value={sellerContent && sellerContent.rightsavailablefromdate && moment(new Date(sellerContent.rightsavailablefromdate)).format('YYYY-MM-DD')} />




                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3 input-field">
                                        <label className="form-label form-label">Rights Available To Date</label>
                                        <input id="email" name="rightsavailabletodate" type="date" placeholder="Rights Available To Date" className="form-control" onChange={(e) => handleSellerChange(e)} value={sellerContent && sellerContent.rightsavailabletodate && moment(new Date(sellerContent.rightsavailabletodate)).format('YYYY-MM-DD')} />
                                        {sellereErrors.rightsavailabletodate && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors.rightsavailabletodate}</span>}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3 input-field">
                                        <label className="form-label form-label">Restriction Country</label>
                                        <Select isMulti={true}
                                            placeholder='Select Country'
                                            onChange={(e) => handleFilter(e, 'restrictedcountries')}
                                            options={lookup && lookup.country && lookup.country.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                            value={sellerContent && sellerContent.restrictedcountries && sellerContent.restrictedcountries.length > 0 ? sellerContent.restrictedcountries?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3 input-field">
                                        <label className="form-label form-label">Territories Available</label>
                                        
                                        <Select isMulti={true}
                                            placeholder='Select Territories'
                                            onChange={(e) => handleFilter(e, 'territoriesavailable')}
                                            options={lookup && lookup.territories && lookup.territories.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                            value={sellerContent && sellerContent.territoriesavailable && sellerContent.territoriesavailable.length > 0 ? sellerContent.territoriesavailable?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                                        />

                                        {sellereErrors.territoriesavailable && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{sellereErrors.territoriesavailable}</span>}
                                    </div>
                                </div>
                            </>} */}
                            {/* {["MOVIES", "SHORT FILMS", "COOKING SHOWS", "LIFESTYLE", "LINEAR CHANNELS", "SERIES & TELENOVELAS", "DOCUMENTARIES", "DOCUSERIES", "KIDS MOVIES", "KIDS SERIES"].some(el => editcontent['category']?.includes(el)) && <div className="col-md-6">
                                <div className="mb-3 input-field">
                                    <label className="form-label form-label">Dubbing Languages</label>
                                    <Select isMulti={true}
                                        placeholder='Select Languages'
                                        onChange={(e) => handleFilter(e, 'dubbinglanguages')}
                                        options={lookup && lookup.language && lookup.language.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                        value={sellerContent && sellerContent.dubbinglanguages && sellerContent.dubbinglanguages.length > 0 ? sellerContent.dubbinglanguages?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                                    />
                                </div>
                            </div>} */}


                        </div>



                        <div className="row">
                            {/* <div className="col-md-12">
                                <button className="btn btn-primary btn-block btn-sm float-end" type="submit" onClick={submitSeller}>{BtnLoader ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}{sellerContent && sellerContent.clientcontentid ? 'Update' : 'Save & Add'}</button>
                                {isFormVisible && <div>
                        <a onClick={(e) => { setIsFormVisible(false); setSellercontent({}); setSellereErrors({}) }} className="btn btn-danger mb-4">Cancel</a>
                    </div>}
                            </div> */}
                            <div className="add-seller-buttons">
                                <button className="btn btn-primary btn-block btn-sm mb-4" type="submit" onClick={submitSeller}>{BtnLoader ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}{sellerContent && sellerContent.clientcontentid ? 'Update' : 'Save & Add'}</button>
                                {isFormVisible && <div>
                        <a onClick={(e) => { setIsFormVisible(false); setSellercontent({}); setSellereErrors({}) }} className="btn slr-cncl-btn mb-4">Cancel</a>
                    </div>}
                            </div>






                        </div>
                    </div>
                </div>}

            {sellersData?.map((sellerEach, key) => {
                return (
                    <div className="row">
                        <div className="col-md-12">
                        <div className="row seller-tab">
                            {fields.map(eachfield => {
                               
                                if ((eachfield.section === 'Seller' && eachfield.section !== undefined) && (eachfield.tab === 'seller' && eachfield.tab !== undefined)) {
                                 
                                        if (eachfield.inputtype === "multiselectdropdown") {
                                           
                                            return (

                                           

                                                <div className='col-md-6'>
                                                    <div className="mb-3 input-field">
                                                        <div className="title-block">
                                                            <label className="form-label form-label">{eachfield.display}</label>

                                                        </div>

                                                        <Select isMulti={true}
                                                        isDisabled={true}
                                                            placeholder={"Select " + eachfield.display}
                                                          
                                                            options={ lookup && lookup[eachfield.lookupvalue] && lookup[eachfield.lookupvalue].map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                            value={sellerEach && Array.isArray(sellerEach[eachfield.name]) && sellerEach[eachfield.name] ? sellerEach[eachfield.name]?.map((eachItem) => { return { value: eachItem, label: eachItem } }):[]}
                                                        />
                                                        
                                                    </div>
                                                </div>)
                                        }
                                        if (eachfield.inputtype === "singledropdown" && eachfield.name == 'clientname') {
                                            return (
                                         
                                                <div className='col-md-6'>
                                                    <div className="mb-3 input-field">
                                                        <div className="title-block">
                                                            <label className="form-label form-label">{eachfield.display}</label>

                                                        </div>
                                                                        <Select
                                                            isMulti={false}
                                                            isDisabled={true}
                                                            placeholder='Select Company'
                                                          
                                                            options={companiesData && companiesData.map((eachItem) => { return { value: eachItem.companyid, label: eachItem.companyname } })}
                                                            value={{ value: sellerEach.companyid, label: sellerEach.companyname }}
                                                        />
                                                     
                                                        
                                                    </div>
                                                </div>)
                                        }
                                        if (eachfield.inputtype === 'text' || eachfield.inputtype === "number") {
                                            return (
                                                <div className='col-md-6'>
                                                    <div className="input-field">
                                                        <label for="example-text-input" className="col-form-label">{eachfield.display}</label>
                                                        <input className="form-control contact-number" disabled type={eachfield.inputtype} name={eachfield.name} value={sellerEach[eachfield.name]}   id="example-email-input" />
                                                      
                                                    </div>
                                                </div>)
                                        }
                                        if (eachfield.inputtype === "dropdown") {
                                           
                                            return (
                                                <div className='col-md-6'>
                                                    <div className="mb-3 input-field">
                                                        <label className="form-label form-label">{eachfield.display}</label>
                                                        <select className="form-select" name={eachfield.name} value={sellerEach[eachfield.name]}
                                                          >
                                                            <option value="">Select</option>
                                                            <option value="false">False</option>
                                                            <option value="true">True</option>

                                                        </select>
                                                        


                                                    </div>
                                                </div>)
                                        }
                                        if (eachfield.inputtype === "date") {
                                           
                                            return (
                                                <div className='col-md-6'>
                                                    <div className="mb-3 input-field">
                                                        <label className="form-label form-label">{eachfield.display}</label>

                                                        <input id="email"  name={eachfield.name} disabled value={sellerEach && sellerEach[eachfield.name] && moment(new Date(sellerEach[eachfield.name])).format('YYYY-MM-DD')||''} type="date" className="form-control"
                                                        />
                                                     

                                                    </div>
                                                </div>)
                                        }
                                        if (eachfield.inputtype === "textarea") {
                                            return (
                                                <div className='col-md-6'>
                                                    <div className="mb-3 input-field">
                                                        <label className="form-label form-label">{eachfield.display}</label>
                                                        <textarea id="email" name={eachfield.name} type="text" disabled className="form-control" value={sellerEach[eachfield.name]}/>
                                                        
                                                    </div>
                                                </div>)
                                        }

                                  

                                }

                            })}
                         

                        </div>
                            {/* <div className="row seller-tab" >
                                <div className="col-md-6">
                                    <div className="mb-3 input-field" >
                                        <label className="form-label form-label">Company Name</label>
                                        <Select
                                            isMulti={false}
                                            isDisabled={true}
                                            placeholder='Select Company'
                                            onChange={(e) => handleFilter(e, 'companyid')}
                                            options={companiesData && companiesData.map((eachItem) => { return { value: eachItem.companyid, label: eachItem.companyname } })}
                                            value={{ value: eachItem.companyid, label: eachItem.companyname }}
                                        />
                                     
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="mb-3 input-field">
                                        <label className="form-label form-label">Languages</label>

                                        <Select isMulti={true}
                                            isDisabled={true}
                                            placeholder='Select Languages'
                                            onChange={(e) => handleFilter(e, 'languages')}
                                            options={lookup && lookup.language && lookup.language.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                            value={eachItem && eachItem.languages && eachItem.languages.length > 0 ? eachItem.languages?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                                        />
                                       
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="mb-3 input-field">
                                        <label className="form-label form-label">RIGHTS AVAILABLE</label>
                                        <Select isMulti={true}
                                            isDisabled={true}
                                            placeholder='Select Rights'
                                            onChange={(e) => handleFilter(e, 'typeofrights')}
                                            options={lookup && lookup.rights && lookup.rights.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                            value={eachItem && eachItem.typeofrights && eachItem.typeofrights.length > 0 ? eachItem.typeofrights?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                                        />
                                    
                                    </div>
                                </div>

                                {!(editcontent['category']?.length == 1 && editcontent['category'].includes('FORMATS')) && <><div className="col-md-6">
                                    <div className="mb-3 input-field">
                                        <label className="form-label form-label">Resolution</label>
                                        <Select isMulti={true}
                                            isDisabled={true}
                                            placeholder='Select Resolution'
                                            onChange={(e) => handleFilter(e, 'resolution')}
                                            options={lookup && lookup.resolution && lookup.resolution.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                            value={eachItem && eachItem.resolution && eachItem.resolution.length > 0 ? eachItem.resolution?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                                        />
                                    </div>
                                </div>

                                    <div className="col-md-6">
                                        <div className="mb-3 input-field">
                                            <label className="form-label form-label">Rights Available From Date</label>
                                            <input id="email" name="rightsavailablefromdate" type="date" disabled placeholder="Rights Available From Date" className="form-control" onChange={(e) => handleSellerChange(e)} value={eachItem && eachItem.rightsavailablefromdate && moment(new Date(eachItem.rightsavailablefromdate)).format('YYYY-MM-DD')||''} />





                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3 input-field">
                                            <label className="form-label form-label">Rights Available To Date</label>
                                            <input id="email" name="rightsavailabletodate" type="date" disabled placeholder="Rights Available To Date" className="form-control" onChange={(e) => handleSellerChange(e)} value={eachItem && eachItem.rightsavailabletodate && moment(new Date(eachItem.rightsavailabletodate)).format('YYYY-MM-DD')||''} />

                                          
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3 input-field">
                                            <label className="form-label form-label">Restriction Country</label>
                                            <Select isMulti={true}
                                                isDisabled={true}
                                                placeholder='Select Country'
                                                onChange={(e) => handleFilter(e, 'restrictedcountries')}
                                                options={lookup && lookup.country && lookup.country.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                value={eachItem && eachItem.restrictioncountry && eachItem.restrictioncountry.length > 0 ? eachItem.restrictioncountry?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3 input-field">
                                            <label className="form-label form-label">Territories Available</label>
                                         
                                            <Select isMulti={true}
                                                isDisabled={true}
                                                placeholder='Select Territories'
                                                onChange={(e) => handleFilter(e, 'territoriesavailable')}
                                                options={lookup && lookup.territories && lookup.territories.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                value={eachItem && eachItem.territoriesavailable && eachItem.territoriesavailable.length > 0 ? eachItem.territoriesavailable?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                                            />

                                           
                                        </div>
                                    </div>
                                </>}
                                {
                              
                                 <div className="col-md-6">
                                    <div className="mb-3 input-field">
                                        <label className="form-label form-label">Dubbing Languages</label>
                                        <Select isMulti={true}
                                            isDisabled={true}
                                            placeholder='Select Languages'
                                            onChange={(e) => handleFilter(e, 'dubbinglanguages')}
                                            options={lookup && lookup.language && lookup.language.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                            value={eachItem && eachItem.dubbinglanguages && eachItem.dubbinglanguages.length > 0 ? eachItem.dubbinglanguages?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                                        />
                                    </div>
                                </div>}


                            </div> */}




                            <div className="row">
                                <div className="col-md-12 sellers-btns">
                                    {/* {sellersData.length >1 ?
                                  <button onClick={(e) => {handleDeleteFile(e,eachItem,'seller');setIsFormVisible(false)}} className="btn btn-primary"><i className="mdi mdi-delete font-size-18"></i>Delete</button>: null} */}
                                    {!isFormVisible &&
                                        <button onClick={(e) => { setSellercontent(sellerEach); setshowupdateSeller(true); setIsFormVisible(false) }} className="btn btn-primary mb-1"><i className="mdi mdi-pencil font-size-18"></i>Edit</button>}

                                </div>



                            </div>
                        </div>
                    </div>
                )
            }
            )}

        </div>)
    }

    const historyTab = () => {
        return (<div className={`tab-pane ${activeTab == 'history' ? 'active show' : ''}`} role="tabpanel">

            <div className="row">
                <div className="col-md-12">
                    <label>Created By  :</label> <span>{editcontent && editcontent.createdBy && editcontent.createdBy.username}</span><br />
                    <label>Updated Time :</label> <span>{new Date(editcontent.created).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                    })}</span>

                </div>

            </div>


        </div>)
    }

    const handleSubTitles = (selected, keyname) => {
        GetTimeActivity()
       
        const {value,label}= selected
        console.log('subTitlesFormData',activeSubTitles)
        console.log('selected',selected)
        const valid = activeSubTitles.some(item=>item.lang === value)
        console.log('valid  11111',valid)
        if (valid) {
            console.log('valid 222222',valid)
            // setSubTitleErr(true)
           
        }else{
            // setSubTitleErr(false)
           
            let newContent = Object.assign({}, subTitlesFormData);
         
            console.log('selected',value)
            console.log('label',label)
            setSubTitlesFormData({ ...newContent, ['lang']: value ,'label':label,name:label,languagecode:value});
        }

       
    };
    // console.log('sibbb',subTitlesFormData)
    const handleFilter = (selected, keyname) => {
        GetTimeActivity()
        console.log('selectedselectedselectedselected',selected)
        let newContent = Object.assign({}, sellerContent);
        if (!!sellereErrors[keyname]) {
            let error = Object.assign({}, sellereErrors);
            delete error[keyname];
            setSellereErrors(error);
        }
        if(keyname == 'subtitle'){
            let selectedArray = returnArray(selected)
            let newContent = Object.assign({}, subTitlesFormData);
            console.log('selectedArray',selectedArray)
            console.log('selected',selected)
            // setSubTitlesFormData({ ...newContent, ['lang']: 'code' });
        }

        console.log('selected', selected, keyname);
      
        if (keyname === 'companyid') {
            if (selected?.item?.companytype === 'ONLINE' && (selected?.item?.agreement === undefined || selected?.item?.agreement === false)
            ) {
                setAgreementErr(true); // Display the popup
            } else {
                if (!!sellereErrors['companyname']) {
                    let error = { ...sellereErrors };
                    delete error['companyname'];
                    setSellereErrors(error);
                }
                setAgreementErr(false); // Hide the popup
            }
            setSellercontent({ ...newContent, [keyname]: selected.value, companyname: selected.label });
        } else {
            let selectedArray = returnArray(selected);
            setSellercontent({ ...newContent, [keyname]: selectedArray });
        }
    };
    // console.log('aelleere',sellerContent)
    const handleSellerChange = (e) => {
        if (!!sellereErrors[e.target.name]) {
            let error = Object.assign({}, sellereErrors);
            delete error[e.target.name];
            setSellereErrors(error);
        }
        if (e.target.name == "rightsavailabletodate" || e.target.name == "rightsavailablefromdate") {
            let date = moment(new Date(e.target.value)).toISOString();
            setSellercontent({ ...sellerContent, [e.target.name]: date });
        } else {
            setSellercontent({ ...sellerContent, [e.target.name]: e.target.value });
        }
    }
    // console.log('del seller',delSeller)
    const submitSeller = () => {
        GetTimeActivity()
        console.log('on click');
        setBtnLoader(true)
        // const isValid = validateSeller();
        const isValid = validateMandatoryFields();
        if (isValid) {
            console.log('is valid sellerContent',);
            if (id) {

                let sellerObj = { ...sellerContent, status: "ACTIVE", source: "admin", createdBy: { userid: userData.userid, username: userData.name } }
                // console.log('sellerObj',sellerObj)
                addClientcontent(id, sellerObj).then((data) => {
                    console.log("getClientcontent data", data);
                    if (data.statusCode == 200) {
                        if (data.result == "Invalid token or Expired") {
                            setShowSessionPopupup(true)
                        } else {
                            if (data.result === "Company already Exists") {
                                setIsCompExist(true)
                            } else {

                                setSuccess(true);
                                console.log(data.result, "---");
                                setSellercontent({})
                                getSellersData();
                                setshowupdateSeller(false)
                                setIsFormVisible(false)
                            }
                        }
                        setBtnLoader(false)
                    }
                }).catch((error) => {
                    setBtnLoader(false)
                    console.log(error);
                })
            } else {
                console.log('newContentID---> seller submit-->', newContentID)

                let addObj = { ...editcontent, createdBy: { userid: userData.userid, username: userData.name } }
                AddContentData(addObj).then((data) => {
                    console.log("Add Content data", data);
                    if (data.statusCode == 200) {
                        console.log(data.result, "---")
                        id = data.result;
                        let sellerObj = { ...sellerContent, status: "ACTIVE", source: "admin", createdBy: { userid: userData.userid, username: userData.name } }
                        if (data.result == "Same title aready exists") {
                            setBtnLoader(false);
                            setIsTitleExist(true)
                        }
                        else {
                            addClientcontent(id, sellerObj).then((data) => {
                                console.log("getClientcontent data", data);
                                if (data.statusCode == 200) {
                                    console.log(data.result, "---");
                                    setSellercontent({})
                                    getSellersData();
                                    setshowupdateSeller(false)
                                    // setSuccess(true);
                                }
                            }).catch((error) => {
                                console.log(error);
                            })


                            setAddSuccess(true);

                            history.push("/editcontent/" + id);
                            AfterAddgetContent(id);
                            setBtnLoader(false)
                        }
                        setBtnLoader(false)
                    }
                }).catch((error) => {
                    console.log(error);
                    setBtnLoader(false)
                })
            }
        } else {
            setBtnLoader(false)
        }
    }
    const validateSeller = (e) => {
        let formIsValid = true;
        let error = { ...sellereErrors };
        let mandatoryFileds = [{ name: 'Company Name', key: 'companyid' }, { name: 'Languages', key: 'languages' }, { name: 'Rights', key: 'typeofrights' }, { name: 'Territories', key: 'territories' }]
        if (mandatoryFileds) {
            mandatoryFileds.forEach(function (item) {
                if (item.key != 'companyid' && editcontent['category']?.length == 1 && editcontent['category']?.includes("FORMATS")) {
                    return
                }
                if (
                    (sellerContent[item.key] == "" ||
                        sellerContent[item.key] == undefined ||
                        sellerContent[item.key] == "undefined")
                ) {
                    error[item.key] = item.name + " is required";
                    formIsValid = false;
                }

            });
        }
        console.log("errors", error);
        setSellereErrors(error)
        return formIsValid;
    }
    const handleClosePopup = () => {
        GetTimeActivity()
        setshowupdateSeller(false)
    }
    const handlePreview = () => {
        GetTimeActivity()
        setShowPreview(false)
    }
    //  var myDate = new Date(editcontent.releasedate);



    const cardWidth = $(".basic-info-img").width();

    const handleBread = () => {
        GetTimeActivity()
        history.push("/contentmanagement")
    }

    const onClickSwitchTab = (e, typeOfTab) => {
        GetTimeActivity()
        setActiveTab(typeOfTab)

    }
    const onclickInvalid = () => {
        GetTimeActivity()
        setInvalidContent(false)
        history.push('/contentmanagement')
    }
    const onConfirmAgr = () => {
        GetTimeActivity()
        setAgreementErr(false)
    }
    // console.log('sellerContent',sellerContent)
    const validateMandatoryFields = () => {
        let isFormValid = true
        let error = activeTab == "info" ? { ...errors } : { ...sellereErrors };

        if (isFormValid) {
            let k = [{ name: 'Title', key: 'title' },
            { name: 'Category', key: 'category' },
            { name: 'Synopsis', key: 'synopsis' }
            ];



            fields.map((eachSub) => {
                if (eachSub.tab == activeTab) {

                    if (activeTab == "seller") {

                        if (eachSub.name == "clientname") {
                           
                            if (eachSub.mandatory === true && (sellerContent["companyname"] == "" || sellerContent["companyname"] == undefined || sellerContent["companyname"] == "undefined" || sellerContent["companyname"] == null)) {
                              
                                error["companyname"] = eachSub.errormsg
                                isFormValid = false;
                            }
                        }
                        else {
                           
                            if (eachSub.mandatory === true && (sellerContent[eachSub.name] == "" || sellerContent[eachSub.name] == undefined || sellerContent[eachSub.name] == "undefined" || sellerContent[eachSub.name] == null)) {
                                error[eachSub.name] = eachSub.errormsg;
                                isFormValid = false;
                            }
                        }
                        console.log('companiesData',companiesData)
                        if(sellerContent?.companyid){
                        const k = companiesData.filter((item)=>item.companyid[0]===sellerContent?.companyid[0])
                        if (k[0]?.companytype === 'ONLINE' && (k[0]?.agreement === undefined || k[0]?.agreement === false))
                        {
                            setAgreementErr(true)
                            isFormValid = false;
                          
                        }}

                    } else {
                       
                        if (id == undefined) {
                            if (eachSub.name === "portraitimage") {
                                return;
                            }
                            if (eachSub.name === "landscapeimage") {
                                return;
                            }
                        } else {
                            console.log('editcontent["status"]--->',editcontent["status"])
                            console.log('eachSub.nam---->',eachSub.name)
                            if ((editcontent["status"] === "INACTIVE" && eachSub.name === "landscapeimage")||editcontent["status"] === "INPROGRESS" && eachSub.name === "landscapeimage") {
                                return;
                            }
                            if ((editcontent["status"] === "INACTIVE" && eachSub.name === "portraitimage")||(editcontent["status"] === "INPROGRESS" && eachSub.name === "portraitimage")) {
                                return;
                            }
                        }
                  
                        if (id !== undefined) {
                            if ((eachSub.name === "portraitimage" || eachSub.name === "landscapeimage") && (editcontent["portraitimage"] === "" || editcontent["portraitimage"] === undefined || editcontent["portraitimage"] === null || editcontent["portraitimage"] === "orasi/common/images/img-default.jpg") &&
                                (editcontent["landscapeimage"] === "" || editcontent["landscapeimage"] === undefined || editcontent["landscapeimage"] === "orasi/common/images/img-default-landscape.jpg")) {
                                error[eachSub.name] = "portrait and landscape images are required";
                                isFormValid = false;
                            }
                        }

                        if (eachSub.name != "portraitimage" && eachSub.name != "landscapeimage") {


                            if (eachSub.mandatory === true && (editcontent[eachSub.name] === "" || editcontent[eachSub.name] == undefined || editcontent[eachSub.name] == null)) {

                                
                                error[eachSub.name] = eachSub.errormsg;
                                isFormValid = false;
                            }
                            if (typeof (editcontent[eachSub.name]) == 'object') {
                                if (eachSub.mandatory === true && editcontent[eachSub.name].length <= 0) {
                                   

                                    error[eachSub.name] = eachSub.errormsg;
                                    isFormValid = false;
                                }
                            }
                        }
                    }
                }
                if (activeTab == "info") {
                      
                    if (id == undefined) {
                        if (eachSub.name === "portraitimage") {
                            return;
                        }
                        if (eachSub.name === "landscapeimage") {
                            return;
                        }

                        if (editcontent["releasedate"] != "" && eachSub.name === "releasedate") {
                            return;
                        }
                    } else {
                        
                        if ((editcontent["status"] === "INACTIVE" && eachSub.name === "landscapeimage")||editcontent["status"] === "INPROGRESS" && eachSub.name === "landscapeimage") {
                            return;
                        }
                        if ((editcontent["status"] === "INACTIVE" && eachSub.name === "portraitimage")||(editcontent["status"] === "INPROGRESS" && eachSub.name === "portraitimage")) {
                            return;
                        }
                    }
                  
                  
                    if (id !== undefined) {
                        if ((eachSub.name === "portraitimage" || eachSub.name === "landscapeimage") && (editcontent["portraitimage"] === "" || editcontent["portraitimage"] === undefined || editcontent["portraitimage"] === null || editcontent["portraitimage"] === "orasi/common/images/img-default.jpg") &&
                            (editcontent["landscapeimage"] === "" || editcontent["landscapeimage"] === undefined || editcontent["landscapeimage"] === "orasi/common/images/img-default-landscape.jpg")) {
                           
                            error[eachSub.name] = "portrait and landscape images are required";
                            isFormValid = false;
                        }
                    }

                }
            });
           
          
        }

        if (editcontent.noofseasons <= 0 || editcontent.noofseasons <= "0") {
            error['noofseasons'] = "Number Of Seasons should be greater than Zero";
            isFormValid = false;
        }
        if (editcontent.noofepisodes <= 0 || editcontent.noofepisodes <= "0") {
            error['noofepisodes'] = "Number Of Episodes should be greater than Zero";

            isFormValid = false;
        }
        if (editcontent?.IMDBrating != null && editcontent?.IMDBrating != "" && editcontent.IMDBrating <= 0 || editcontent.IMDBrating <= "0") {
            error['IMDBrating'] = "IMDB Rating should be greater than Zero";

            isFormValid = false;
        }
        if(editcontent.duration !== undefined){
            if(editcontent.duration == '0'){
                console.log('editcontent.duration',editcontent.duration)
            error['duration'] = "Duration cannot be zero";

            isFormValid = false;
            }
        }
        if(editcontent.releaseyear !== undefined){
            const inputYear = parseInt(editcontent.releaseyear);
            const currentYear = new Date().getFullYear();
            if (inputYear >= 1900 && inputYear <= currentYear) {
              delete error['releaseyear'];
            } else {
                error['releaseyear'] = 'Please enter a year between 1900 and the current year'
                isFormValid = false;
            }
        }
        if (editcontent.releasedate !== undefined) {
            let date = moment(new Date(editcontent.releasedate)).toISOString();
            const inputDate = editcontent.releasedate;
            const selectedDate = new Date(inputDate);
            const minDate = new Date('1900-01-01');
            const maxDate = new Date(); // Today's date
            if (selectedDate >= minDate && selectedDate <= maxDate) {
                 delete error['releasedate'];
                // setEditContent({ ...editcontent, [e.target.name]: date, releaseyear: e.target.value.slice(0, 4) });
            } else {
              error['releasedate'] = 'Please select a date between 1900 and today'
              isFormValid = false;
            }

        }
        if (activeTab == "seller" && sellerContent && sellerContent.rightsavailablefromdate && sellerContent.rightsavailabletodate) {
            if (new Date(sellerContent.rightsavailablefromdate) > new Date(sellerContent.rightsavailabletodate)) {

                error['rightsavailabletodate'] = "To date cannot be earlier than From date"

                isFormValid = false;
            }else{
                delete error['rightsavailabletodate'] ;
            }

        }

        console.log("errors in validate mandatory fields", error);
        console.log("edit content in mandaatoryu validd", editcontent);
        activeTab == "info" ? setErrors(error) : setSellereErrors(error);
        return isFormValid;
    }

  
    return (
        <>
            {showSessionPopupup && <SessionPopup />}
            <div id="layout-wrapper">
                <Header />
                <Sidebar />
                <SweetAlert show={invalidContent}
                    custom
                    confirmBtnText="ok"
                    confirmBtnBsStyle="primary"
                    title={"Content Not Found"}
                    onConfirm={e => onclickInvalid()}
                >
                </SweetAlert>
                {!invalidContent &&
                    <div className="main-content create-user edit-content add-client">

                        <div className="page-content ">
                            <div className="container-fluid">



                                <div className="row mb-4 breadcrumb">
                                    <div className="col-lg-12">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <h4 className="mb-2 card-title">{id === undefined ? "Add Content" : contentTitle}</h4>
                                                <p className="menu-path"><span onClick={handleBread}>Content Management</span> / <b>{id === undefined ? "Add Content" : contentTitle}</b></p>
                                            </div>
                                            <div>
                                                <a onClick={handleBack} className="btn btn-primary">back</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="create-user-block content_edit">

                                    <div className="form-block">
                                        <ul className="nav nav-tabs nav-tabs-custom nav-justified" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <a className={`nav-link ${activeTab == 'info' ? 'active' : ''}`} style={{ cursor: 'pointer' }} data-bs-toggle="tab" role="tab" onClick={(e) => onClickSwitchTab(e, "info")}>
                                                    <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                                    <span className="d-none d-sm-block">INFO</span>
                                                </a>
                                            </li>
                                            {(id !== undefined || isInfoFormValid == true) && <li className={`nav-item ${BtnLoader ? 'pe-none' : ''}`} role="presentation">
                                                <button className={`nav-link ${activeTab == 'seller' ? 'active' : ''}`}
                                                    style={{ cursor: 'pointer' }}
                                                    data-bs-toggle="tab" role="tab" onClick={(e) => onClickSwitchTab(e, "seller")}
                                                //   disabled={!isValidInfo}
                                                >
                                                    <span className="d-block d-sm-none"><i className="far fa-user"></i></span>
                                                    <span className="d-none d-sm-block">SELLER</span>
                                                </button>
                                            </li>}
                                            {id !== undefined ?

                                                <li className="nav-item" role="presentation">
                                                    <a className={`nav-link ${activeTab == 'files' ? 'active' : ''}`} style={{ cursor: 'pointer' }} data-bs-toggle="tab" role="tab" onClick={(e) => onClickSwitchTab(e, "files")} >
                                                        <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                                        <span className="d-none d-sm-block">Files</span>
                                                    </a>
                                                </li>
                                                : null}
                                            {id !== undefined ?

                                                <li className="nav-item" role="presentation">
                                                    <a className={`nav-link ${activeTab == 'history' ? 'active' : ''}`} style={{ cursor: 'pointer' }} data-bs-toggle="tab" role="tab" onClick={(e) => onClickSwitchTab(e, "history")} >
                                                        <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                                        <span className="d-none d-sm-block">History</span>
                                                    </a>
                                                </li>
                                                : null}




                                            {/* <li className="nav-item" role="presentation">
                                            <a className="nav-link" data-bs-toggle="tab" href="#images" role="tab" aria-selected="false" tabIndex="-1">
                                                <span className="d-block d-sm-none"><i className="far fa-user"></i></span>
                                                <span className="d-none d-sm-block">IMAGES</span>
                                            </a>
                                        </li> */}


                                        </ul>
                                        <div className="tab-content p-3 text-muted">
                                            {activeTab == "info" && <div className={`tab-pane ${activeTab == 'info' ? 'active show' : ''}`} role="tabpanel" id="home1">
                                            { fields.length >0 ? 
                                            <>  
                                                
                                                {fields.some(iter => iter.section === 'Basic Details') &&
                                                    <div className="row">
                                                        <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i> basic details</h5>
                                                        <div className="col-md-12">
                                                            <div className="row basic-details">
                                                                {fields.map(eachfield => {
                                                                    // console.log('each itemmmmmm     1111111111111111111',eachfield)
                                                                    if ((eachfield.section === 'Basic Details' && eachfield.section !== undefined) && (eachfield.tab === 'info' && eachfield.tab !== undefined)) {
                                                                        // console.log('each itemmmmmm 22222222222222222',eachfield)
                                                                        // if (eachfield.default === true || eachfield.mandatory === true ) {

                                                                            if (eachfield.inputtype === 'text' || eachfield.inputtype === "number") {
                                                                                return (
                                                                                    <div className='col-md-6'>
                                                                                        <div className="input-field">
                                                                                            <label for="example-text-input" className="col-form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>
                                                                                            <input className="form-control contact-number" type={eachfield.inputtype} name={eachfield.name} value={editcontent[eachfield.name]||""} onChange={(e) => handleChange(e)} placeholder={'Enter ' + eachfield.display} id="example-email-input" />
                                                                                            { errors[eachfield.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors[eachfield.name]}</span>}
                                                                                        </div>
                                                                                    </div>)
                                                                            }
                                                                            if (eachfield.inputtype === "multiselectdropdown") {
                                                                                return (
                                                                                    <div className='col-md-6'>
                                                                                        <div className="mb-3 input-field">
                                                                                            <div className="title-block">
                                                                                                <label className="form-label form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>


                                                                                                {userData.type === "CONTENTMANAGER" ? null : eachfield.name !== "category" && eachfield.name !== "subtitleslanguages" && <button onClick={(e) => { setShowAddLookup(true); setLookupType(eachfield.lookupvalue);setLookupTypeName(eachfield.display) }}><span className="material-icons-outlined"> add </span>Add</button>}


                                                                                            </div>

                                                                                            <Select isMulti={true}
                                                                                                placeholder={"Select " + eachfield.display}
                                                                                                onChange={(e) => handleChangeMultiSelect(e, eachfield.name)}
                                                                                                options={eachfield.name === "category" ? categoryName : lookup && lookup[eachfield.lookupvalue] && lookup[eachfield.lookupvalue].map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                                                                value={editcontent && editcontent[eachfield.name] && Array.isArray(editcontent[eachfield.name]) ? editcontent[eachfield.name]?.map((eachItem) => { return { value: eachItem, label: eachItem } }):[]}
                                                                                            />
                                                                                            {eachfield.mandatory === true && errors[eachfield.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors[eachfield.name]}</span>}
                                                                                        </div>
                                                                                    </div>)
                                                                            }
                                                                            if (eachfield.inputtype === "dropdown") {
                                                                                // console.log('eachfield dropdown',eachfield)
                                                                                return (
                                                                                    <div className='col-md-6'>
                                                                                        <div className="mb-3 input-field">
                                                                                            <label className="form-label form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>
                                                                                            <select className="form-select" placeholder={"Select " + eachfield.display} name={eachfield.name} value={editcontent[eachfield.name]}
                                                                                                onChange={(e) => handleChange(e)} >
                                                                                                <option value="">Select</option>
                                                                                                <option value="false">False</option>
                                                                                                <option value="true">True</option>

                                                                                            </select>
                                                                                            {eachfield.mandatory === true && errors[eachfield.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors[eachfield.name]}</span>}


                                                                                        </div>
                                                                                    </div>)
                                                                            }
                                                                            if (eachfield.inputtype === "date") {
                                                                                return (
                                                                                    <div className='col-md-6'>
                                                                                        <div className="mb-3 input-field">
                                                                                            <label className="form-label form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>

                                                                                            <input id="email" placeholder={"Select " + eachfield.display} name={eachfield.name} value={editcontent && editcontent[eachfield.name] && moment(new Date(editcontent[eachfield.name])).format('YYYY-MM-DD')} onChange={(e) => handleChange(e)} type="date" className="form-control" max={new Date().toISOString().split('T')[0]}
                                                                                            />
                                                                                            {errors[eachfield.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors[eachfield.name]}</span>}
                                                                                        </div>
                                                                                    </div>)
                                                                            }
                                                                            if (eachfield.inputtype === "textarea") {
                                                                                return (
                                                                                    <div className='col-md-6'>
                                                                                        <div className="mb-3 input-field">
                                                                                            <label className="form-label form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>
                                                                                            <textarea id="email" placeholder={"Enter " + eachfield.display} name={eachfield.name} type="text" className="form-control" value={editcontent[eachfield.name]||""} onChange={(e) => handleChange(e)} />
                                                                                            {eachfield.mandatory === true && errors[eachfield.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors[eachfield.name]}</span>}
                                                                                        </div>
                                                                                    </div>)
                                                                            }

                                                                        // }

                                                                    }

                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>}
                                                {fields.some(iter => iter.section === 'Metadata') &&
                                                    <div className="row">
                                                        <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Metadata</h5>
                                                        {fields.map(eachfield => {
                                                            // console.log('1111111111111111111111111111111111111111',eachfield)
                                                            if (eachfield.section === 'Metadata' && eachfield.tab === 'info') {
                                                                // console.log('2222222222222222222222222222222222222222222222',eachfield)
                                                                // if ((eachfield.default === true && eachfield.default !== undefined) || eachfield.mandatory === true ) {
                                                                    // console.log('3333333333333333333333333333333333333',eachfield)

                                                                    if (eachfield.inputtype === 'text' || eachfield.inputtype === "number") {
                                                                        //  console.log('44444444444444444444444444444444444444444444 imdb check',editcontent[eachfield.name])

                                                                        return (
                                                                            <div className="col-md-4">
                                                                                <div className="input-field">
                                                                                    <label for="example-text-input" className="col-form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>
                                                                                    <input className="form-control contact-number" type={eachfield.inputtype} name={eachfield.name} value={editcontent[eachfield.name]||""} onChange={(e) => handleChange(e)} placeholder={'Enter ' + eachfield.display} id="example-email-input" />
                                                                                    {errors[eachfield.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors[eachfield.name]}</span>}
                                                                                </div>
                                                                            </div>)
                                                                    }
                                                                    if (eachfield.inputtype === "multiselectdropdown") {
                                                                        //  console.log('55555555555555555555555555555',eachfield)
                                                                        return (
                                                                            <div className="col-md-4">
                                                                                <div className="mb-3 input-field">
                                                                                    <label className="form-label form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>


                                                                                    {/* {userData.type === "CONTENTMANAGER" ? null : eachfield.name !== "category" && <button onClick={(e) => { setShowAddLookup(true); setLookupType(eachfield.lookupvalue) }}><span className="material-icons-outlined"> add </span>Add</button>} */}


                                                                                    <Select isMulti={true}
                                                                                        placeholder={"Select " + eachfield.display}
                                                                                        onChange={(e) => handleChangeMultiSelect(e, eachfield.name)}
                                                                                        options={lookup && lookup[eachfield.lookupvalue] && lookup[eachfield.lookupvalue].map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                                                        value={editcontent && editcontent[eachfield.name] && Array.isArray(editcontent[eachfield.name]) ? editcontent[eachfield.name]?.map((eachItem) => { return { value: eachItem, label: eachItem } }):[]}
                                                                                    />
                                                                                    {eachfield.mandatory === true && errors[eachfield.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors[eachfield.name]}</span>}
                                                                                </div>
                                                                            </div>)
                                                                    }
                                                                // }


                                                            }
                                                        })}


                                                    </div>}
                                                {fields.some(iter => iter.section === 'Cast & Crew') &&
                                                    <div className="row">
                                                        <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>cast and crew</h5>

                                                        {fields.map(eachfield => {
                                                            if (eachfield.section === 'Cast & Crew' && eachfield.tab === 'info') {
                                                                // if ((eachfield.default === true && eachfield.default !== undefined) || eachfield.mandatory === true ) {

                                                                    if (eachfield.inputtype === 'text' || eachfield.inputtype === "number") {
                                                                        return (
                                                                            <div className="col-md-4">
                                                                                <div className="input-field">
                                                                                    <label for="example-text-input" className="col-form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>
                                                                                    <input className="form-control contact-number" type={eachfield.inputtype} name={eachfield.name} value={editcontent[eachfield.name]||""} onChange={(e) => handleChange(e)} placeholder={'Enter ' + eachfield.display} id="example-email-input" />
                                                                                    {eachfield.mandatory === true && errors[eachfield.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors[eachfield.name]}</span>}
                                                                                </div>
                                                                            </div>)
                                                                    }


                                                                // }


                                                            }
                                                        })}


                                                    </div>}
                                                {fields.some(iter => iter.section === 'Life Style') &&
                                                    <div className="row">
                                                        <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Life Style</h5>

                                                        {fields.map(eachfield => {
                                                            if (eachfield.section === 'Life Style' && eachfield.tab === 'info') {
                                                                // if ((eachfield.default === true && eachfield.default !== undefined) || eachfield.mandatory === true ) {

                                                                    if (eachfield.inputtype === 'text' || eachfield.inputtype === "number") {
                                                                        return (
                                                                            <div className="col-md-4">
                                                                                <div className="input-field">
                                                                                    <label for="example-text-input" className="col-form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>
                                                                                    <input className="form-control contact-number" type={eachfield.inputtype} name={eachfield.name} value={editcontent[eachfield.name]||""} onChange={(e) => handleChange(e)} placeholder={'Enter ' + eachfield.display} id="example-email-input" />
                                                                                    {eachfield.mandatory === true && errors[eachfield.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors[eachfield.name]}</span>}
                                                                                </div>
                                                                            </div>)
                                                                    }
                                                                    if (eachfield.inputtype === "multiselectdropdown") {
                                                                        return (
                                                                            <div className="col-md-4">
                                                                                <div className="mb-3 input-field">
                                                                                    <label className="form-label form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>


                                                                                    {/* { userData.type === "CONTENTMANAGER" ? null :eachfield.name !== "category" &&  <button onClick={(e) => { setShowAddLookup(true); setLookupType(eachfield.lookupvalue) }}><span className="material-icons-outlined"> add </span>Add</button>} */}


                                                                                    <Select isMulti={true}
                                                                                        placeholder={"Select " + eachfield.display}
                                                                                        onChange={(e) => handleChangeMultiSelect(e, eachfield.name)}
                                                                                        options={lookup && lookup[eachfield.lookupvalue] && lookup[eachfield.lookupvalue].map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                                                        value={editcontent && editcontent[eachfield.name] && Array.isArray(editcontent[eachfield.name]) ? editcontent[eachfield.name]?.map((eachItem) => { return { value: eachItem, label: eachItem } }):[]}
                                                                                    />
                                                                                    {eachfield.mandatory === true && errors[eachfield.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors[eachfield.name]}</span>}
                                                                                </div>
                                                                            </div>)
                                                                    }

                                                                // }


                                                            }
                                                        })}


                                                    </div>
                                                }
                                                {fields.some(iter => iter.section === 'Awards & Certificate') &&
                                                    <div className="row">
                                                        <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Awards & Certificate</h5>

                                                        {fields.map(eachfield => {
                                                            if (eachfield.section === 'Awards & Certificate' && eachfield.tab === 'info') {
                                                                // if ((eachfield.default === true && eachfield.default !== undefined) || eachfield.mandatory === true ) {

                                                                    if (eachfield.inputtype === 'text' || eachfield.inputtype === "number") {
                                                                        // console.log('awarddsssssss section')
                                                                        return (
                                                                            <div className="col-md-4">
                                                                                <div className="input-field">
                                                                                    <label for="example-text-input" className="col-form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>
                                                                                    <input className="form-control contact-number" type={eachfield.inputtype} name={eachfield.name} value={editcontent[eachfield.name]||""} onChange={(e) => handleChange(e)} placeholder={'Enter ' + eachfield.display} id="example-email-input" />
                                                                                    {eachfield.mandatory === true && errors[eachfield.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors[eachfield.name]}</span>}
                                                                                </div>
                                                                            </div>)
                                                                    }
                                                                    if (eachfield.inputtype === "multiselectdropdown") {
                                                                        return (
                                                                            <div className="col-md-4">
                                                                                <div className="mb-3 input-field">
                                                                                    <label className="form-label form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>


                                                                                    {/* { userData.type === "CONTENTMANAGER" ? null :eachfield.name !== "category" &&  <button onClick={(e) => { setShowAddLookup(true); setLookupType(eachfield.lookupvalue) }}><span className="material-icons-outlined"> add </span>Add</button>} */}


                                                                                    <Select isMulti={true}
                                                                                        placeholder={"Select " + eachfield.display}
                                                                                        onChange={(e) => handleChangeMultiSelect(e, eachfield.name)}
                                                                                        options={lookup && lookup[eachfield.lookupvalue] && lookup[eachfield.lookupvalue].map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                                                        value={editcontent && editcontent[eachfield.name] && Array.isArray(editcontent[eachfield.name]) ? editcontent[eachfield.name]?.map((eachItem) => { return { value: eachItem, label: eachItem } }):[]}
                                                                                    />
                                                                                    {eachfield.mandatory === true && errors[eachfield.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors[eachfield.name]}</span>}
                                                                                </div>
                                                                            </div>)
                                                                    }

                                                                // }


                                                            }
                                                        })}


                                                    </div>}
                                                {fields.some(iter => iter.section === 'Seasons & Episodes') &&
                                                    <div className="row">
                                                        <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Seasons & Episodes</h5>

                                                        {fields.map(eachfield => {
                                                            if (eachfield.section === 'Seasons & Episodes' && eachfield.tab === 'info') {
                                                                // if ((eachfield.default === true && eachfield.default !== undefined) || eachfield.mandatory === true ) {

                                                                    if (eachfield.inputtype === 'text' || eachfield.inputtype === "number") {
                                                                        return (
                                                                            <div className="col-md-6">
                                                                                <div className="input-field">
                                                                                    <label for="example-text-input" className="col-form-label">{eachfield.display}{eachfield.mandatory === true && <span className="required">*</span>}</label>
                                                                                    <input className="form-control contact-number" type={eachfield.inputtype} name={eachfield.name} value={editcontent[eachfield.name]||""} onChange={(e) => handleChange(e)} placeholder={'Enter ' + eachfield.display} id="example-email-input" />
                                                                                    {errors[eachfield.name] && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors[eachfield.name]}</span>}
                                                                                </div>
                                                                            </div>)
                                                                    }


                                                                // }


                                                            }
                                                        })}


                                                    </div>}

                                                <div className="row status">

                                                    <div className="col-md-3 justify-content-between ps-0">
                                                        {id && <>
                                                            <label className="col-form-label">Status</label>
                                                            {/* {editcontent.status === "INPROGRESS" ? <label className="col-form-label status-inprogress">: IN PROGRESS</label> : */}
                                                                <select className="form-select" name="status" value={editcontent.status} onChange={(e) => handleChange(e)} >

                                                                    <option value="INACTIVE">INACTIVE</option>
                                                                    <option value="ACTIVE">ACTIVE</option>
                                                                    <option value="INPROGRESS">IN PROGRESS</option>
                                                                    <option value="OFFLINE">OFFLINE</option>

                                                                </select>
                                                                {/* } */}
                                                        </>
                                                        }
                                                    </div>

                                                    <div className="col-md-9 justify-content-end d-flex align-items-center">


                                                        {id == undefined ? <a className="btn btn-primary" onClick={(e) => saveNext(e)}>NEXT</a> :
                                                            <a className="btn btn-primary" onClick={submit}>{BtnLoader ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}UPDATE</a>}
                                                    </div>
                                                    {(errors.landscapeimage || errors.portraitimage) && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>Please upload a portrait or landscape image in the files tab to active or offline the content.</span>}

                                                </div>

                                                </>
                                                :  <div className="row"><Loader /></div>}

                                            </div>}
                                            {activeTab == "files" && filesTab()}
                                            {activeTab == "seller" && sellersTab()}
                                            {activeTab == "history" && historyTab()}


                                            <div className="tab-pane" id="images" role="tabpanel">
                                                <div className="row">
                                                    <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Asset Thumbnails</h5>
                                                    <div className="uploadPics">
                                                        <div className="upload">
                                                            <div className="img_block">
                                                                <img src="https://orasi-dev.imgix.net//orasi/client/resources/orasiv1/images//hero_thumb1.jpg" />

                                                            </div>
                                                            <div className="size">Landscape  (300*600)</div>
                                                        </div>

                                                        <div className="upload portrait">
                                                            <div className="img_block u-potrait">
                                                                <img src="https://orasi-dev.imgix.net//orasi/client/resources/orasiv1/images//hero_thumb1.jpg" />

                                                            </div>
                                                            <div className="size">Portrait (600*300)</div>
                                                        </div>
                                                        <div className="add-block">
                                                            <input type="file" name="upload" className="udisplay-none" id="upload" />
                                                            <span className="material-icons-outlined">add</span>
                                                            add
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>


                            </div>
                        </div>

                        <Modal className="seller-pop" show={showupdateSeller} onHide={handleClosePopup}>
                            <Modal.Header closeButton>
                                <Modal.Title>{sellerContent && sellerContent.clientcontentid ? 'Update ' : 'Add '} Seller</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>{updateSeller()}</Modal.Body>

                        </Modal>
                        <Modal className="seller-pop preview-pop" show={showPreview}>
                            <Modal.Header>
                            <button className="close-btn" onClick={handlePreview}><span className="material-icons">close</span></button>
                                <Modal.Title>Preview</Modal.Title>
                            </Modal.Header>
                            <Modal.Body><img src={previewImg} className="w-100"/></Modal.Body>

                        </Modal>
                        <Modal className="seller-pop new-look-up" show={showAddLookup} onHide={setShowAddLookup}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add New lookup</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>{AddLookUp()}</Modal.Body>

                        </Modal>
                        <Modal className="access-denied" show={AgreementErr} >

                            <div className="modal-body enquiry-form">
                                <div className="container">
                                    <button className="close-btn" onClick={e => onConfirmAgr()}><span className="material-icons">close</span></button>
                                    <span className="material-icons access-denied-icon">https</span>
                                    <h3>Access Denied</h3>
                                    <p>Agreement not signed cannot assign this company</p>
                                    {/* <p>Please select another company</p> */}
                                    <button className="fill_btn yellow-gradient mx-auto" data-bs-toggle="modal" data-bs-target="#recommendModal" onClick={e => onConfirmAgr()}>close</button>
                                </div>
                            </div>

                        </Modal>

                        <Footer />
                        <SweetAlert show={success}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Updated successfully"}
                            onConfirm={e => { setSuccess(false); setBtnLoader(false) }}
                        ></SweetAlert>
                         <SweetAlert show={subSuccess}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Subtitle added successfully"}
                            onConfirm={e => { setSubSuccess(false); setBtnLoader(false) }}
                        ></SweetAlert>
                        <SweetAlert show={delSuccess}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Image deleted successfully"}
                            onConfirm={e => { setDelSuccess(false); setBtnLoader(false) }}
                        >
                        </SweetAlert>
                        <SweetAlert show={lookupSuccess}
                             custom
                             confirmBtnText="ok"
                             confirmBtnBsStyle="primary"
                             title={"Added successfully"}
                             onConfirm={e => { setLookupSuccess(false); setBtnLoader(false) }}
                         ></SweetAlert>
                        {/* <SweetAlert show={isdelete}
                             custom
                             confirmBtnText="ok"
                             confirmBtnBsStyle="primary"
                             title={"File Deleted successfully"}
                             onConfirm={e => setDelete(false)}
                         >
                         </SweetAlert> */}
                        <SweetAlert show={AddSuccess}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Content details saved"}
                            onConfirm={e => { setAddSuccess(false); setBtnLoader(false) }}
                        >
                        </SweetAlert>
                        <SweetAlert show={uploadsuccess}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Image uploaded successfully"}
                            onConfirm={e => { setUploadSuccess(false); setBtnLoader(false) }}
                        >
                        </SweetAlert>
                        <SweetAlert show={delPopup}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Deleted successfully"}
                            onConfirm={e => { setDelPopup(false); setBtnLoader(false) }}
                        >
                        </SweetAlert>
                        <SweetAlert show={isCompExist}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Company already exists"}
                            onConfirm={e => { setIsCompExist(false); setBtnLoader(false) }}
                        >
                        </SweetAlert>
                        <SweetAlert show={isTitleExist}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"This title already exists"}
                            onConfirm={e => { setIsTitleExist(false); setBtnLoader(false) }}
                        >
                        </SweetAlert>
                        
                        <Modal className="access-denied" show={isdelete}>

                            <div className="modal-body enquiry-form">
                                <div className="container">
                                    <button className="close-btn" onClick={e => onCancel()}><span className="material-icons">close</span></button>
                                    <span className="material-icons access-denied-icon">delete_outline</span>
                                    <h3>Delete</h3>
                                    <p>This action cannot be undone.</p>
                                    <p>{`Are you sure you want to delete the ${delSeller ? 'seller' : 'File'}?`}</p>
                                    <div className="popup-footer">
                                        <button className="fill_btn yellow-gradient" data-bs-toggle="modal" data-bs-target="#recommendModal" onClick={e => delSeller ? deleteSellerFun(item) : handleDelete()}>{BtnLoader ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}Yes, Delete</button>
                                    </div>
                                </div>
                            </div>

                        </Modal>
                        <Modal className="access-denied" show={isdeleteImage}>

                            <div className="modal-body enquiry-form">
                                <div className="container">
                                    <button className="close-btn" onClick={e => onCancelDelete()}><span className="material-icons">close</span></button>
                                    <span className="material-icons access-denied-icon">delete_outline</span>
                                    <h3>Delete</h3>
                                    <p>This action cannot be undone.</p>
                                    <p>{`Are you sure you want to delete ${item == 'portraitimage' ? 'portrait image' : 'landscape image'}?`}</p>
                                    <div className="popup-footer">
                                        <button className="fill_btn yellow-gradient" data-bs-toggle="modal" data-bs-target="#recommendModal" onClick={e => confirmDeleteImage()}>{BtnLoader ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}Yes, Delete</button>
                                    </div>
                                </div>
                            </div>

                        </Modal>
                        {showUpload &&
                            <Modal show={true} className="seller-pop new-look-up add-document" >
                                <Modal.Header >
                                    <Modal.Title>{uploadType === "portrait" ? "Upload Portrait Image" : uploadType === "landscape" ? "Upload Landscape Image" : fileCategory === "CONTENT_IMAGE" ? "Add Thumbnail" : "File Name"}</Modal.Title>
                                    <button className="close-btn" onClick={handleClose}><span className="material-icons">close</span></button>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="row">
                                        <div className="col-md-12 documents">
                                            <div className="mb-3 input-field">
                                                {/* <label className="form-label form-label">{fileCategory === "CONTENT_IMAGE" ? "Thumbnail Name" :"File Name"}</label> */}
                                                <input name="filename" placeholder="Enter File Name" type="text" className="form-control" onChange={(e) => setFileName(e.target.value)} value={fileName} />
                                            </div>
                                            <div className="mb-3 input-field btn-gray">
                                                {fileCategory === "SCRIPTS" ?
                                                    <input type="file" name="upload" accept=".ppt, .pptx, .doc, .docx, .xls, .xlsx, .pdf" className="udisplay-none" id="upload"
                                                        onChange={e => uploadS3(e, ["1920*1080", "Image", "landscape_logo_image"])}
                                                        onClick={(e) => { e.target.value = ''; }} ref={ref} />
                                                    : fileCategory === "CONTENT_IMAGE" ?
                                                        <input type="file" name="upload" accept="image/png, image/jpeg , image/*" className="udisplay-none" id="upload"
                                                            onChange={e => uploadS3(e, ["1920*1080", "Image", uploadType])}
                                                            onClick={(e) => { e.target.value = ''; }} ref={ref} />
                                                          :  fileCategory === "SUBTITLE" ?
                                                       
                                                             <input type="file" name="upload" accept=".vtt, .srt, .ass, .ssa, .ttml" className="udisplay-none" id="upload"
                                                                    onChange={e => uploadS3(e, ["1920*1080", activeTrailerId, "subtitles"])}
                                                                   onClick={(e) => { e.target.value = ''; }} ref={ref} />
                                                             

                                                        :
                                                        <input type="file" name="upload" accept="video/*,.mkv,.avi, .divx, .f4v, .flv, .mts, .m2t, .m4v, .mkv, .mov, .mp4, .mpeg, .mpg, .mxf, .r3d, .wmv" className="udisplay-none" id="upload"
                                                            onChange={e => uploadS3(e, ["1920*1080", "Image", "landscape_logo_image"])}
                                                            onClick={(e) => { e.target.value = ''; }} ref={ref} />
                                                }

                                                {BtnLoader ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : <span className="material-icons">upload</span>}{(uploadType === "portrait" || uploadType === "landscape") ? "Upload Image" : "Upload File"}</div>
                                            {/* <p>Only pdf and word document allowed.</p> */}
                                            {fileCategory != "CONTENT_IMAGE" && fileCategory != "SCRIPTS" ? <p className={videoexcededfile ? "uploaderror" : ""}><span style={{ color: "red", fontSize: "16px" }}>*</span>Please upload file size less than 1.2 GB</p> : fileCategory === "CONTENT_IMAGE" ? <p className={excededfile ? "uploaderror" : ""}><span style={{ color: "red", fontSize: "16px" }}>*</span>Please upload file size less than 10MB</p>:""}
                                            {/* <a className="btn btn-primary">done</a> */}
                                        </div>
                                    </div>
                                </Modal.Body>
                            </Modal>


                        }
                        {showSubUpload &&
                            <Modal show={true} className="seller-pop new-look-up add-document" >
                                <Modal.Header >
                                    <Modal.Title>Add Subtitle</Modal.Title>
                                    <button className="close-btn" onClick={handleClose}><span className="material-icons">close</span></button>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="row">
                                        <div className="col-md-12 documents">
                                            <div className="mb-3 input-field">

                                                <Select isMulti={false}
                                                    placeholder={"Select Language"}
                                                    onChange={(e) => handleSubTitles(e, 'subtitle')}
                                                    options={subTitlesData && subTitlesData.map((eachItem) => { return { value: eachItem.languagecode, label: eachItem.name } })}
                                                    value={{ value: subTitlesFormData.languagecode, label: subTitlesFormData.name }}
                                                />

                                                           
                                            </div>
                                            <div className="mb-3 input-field btn-gray">
                                               
                                                             <input type="file" name="upload" accept=".vtt, .srt, .ass, .ssa, .ttml" className="udisplay-none" id="upload"
                                                                    onChange={e => uploads3Subtitle(e, ["1920*1080", activeTrailerId, "subtitles"])}
                                                                   onClick={(e) => { e.target.value = ''; }} ref={ref} />
                                                    
                                                {BtnLoader ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : <span className="material-icons">upload</span>}Upload subtitle file</div>
                                              {/* {subTitleErr && <p style={{ color: "red", fontSize: "8px" }}>Language Already Exists</p> } */}
                                           
                                        </div>
                                    </div>
                                </Modal.Body>
                            </Modal>


                        }
                    </div>


                }


            </div>

        </>
    );
};

export default EditContent;
