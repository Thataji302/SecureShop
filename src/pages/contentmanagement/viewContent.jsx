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
     const [editcontent, setEditContent] = useState({ });
     const [contentTitle, setContentTitle] = useState("");
     const [sellerContent, setSellercontent] = useState({});
     const [genreTag, setGenreTag] = useState({});
     const [selectedOptions, setSelectedOptions] = useState([]);
     const [selectedOptionsgenre, setSelectedOptionsgenre] = useState([]);
     const [genreData, setGenreData] = useState({});
     const [lookup, setLookUp] = useState({});
     const [selectedOptionscountryOfOrigin, setSelectedOptionscountryOfOrigin] = useState([]);
     const [countryData, setCountryData] = useState({});
     const [BtnLoader, setBtnLoader] = useState(false);
 
     const [apiDataCountry, setApiDataCountry] = useState({});
     const { categoryName, Categories, catBasedContentFields } = useContext(contentContext);
     const [image, setImg] = useState('');
     const [companiesData, setCompaniesData] = useState([]);
     const [sellersData, setSellersData] = useState([]);
     const [filesData, setFilesData] = useState([]);
     const [errors, setErrors] = useState({});
     const [play, setPlay] = useState(false);
     const [playContent, setPlayContent] = useState({});
     const [sellereErrors, setSellereErrors] = useState({});
     const [showupdateSeller, setshowupdateSeller] = useState(false);
     const [showDoc, setshowDoc] = useState(false);
     const [success, setSuccess] = useState(false);
     const [AddSuccess, setAddSuccess] = useState(false);
     const [showAddLookup, setShowAddLookup] = useState(false);
     const [NewLookupValue, setNewLookupValue] = useState('');
     const [lookupType, setLookupType] = useState('');
     const [lookupErr, setLookupErr] = useState("");
 
 
     const [isdelete, setDelete] = useState(false); 
     const [isdeleteImage, setIsdeleteImage] = useState(false);
     const [item, setItem] = useState("");
 
     const [fileCategory, setFileCategory] = useState("");
     const [activeTrailerId, setActiveTrailerId] = useState(''); 
     const [activeSubTitles, setActiveSubTitles] = useState([]); 

    const [activeVideo, setActiveVideo] = useState([]); 
     const [fileName, setFileName] = useState("");
     const [showUpload, setShowUpload] = useState(false);
    
 
     const [type, setType] = useState(false);
     const [activeTab, setActiveTab] = useState('info');
     const [isValidInfo, setIsValidInfo] = useState(false);
     const [isInfoFormValid, setIsInfoFormValid] = useState(false);
     const [isFormVisible, setIsFormVisible] = useState(false);
     const [showPreview, setShowPreview] = useState(false);  
    const [previewImg, setPreviewImg] = useState("");  
     const [uploadType, setUploadType] = useState('');
 
     const [delPopup, setDelPopup] = useState(false);
     const [delSuccess, setDelSuccess] = useState(false);
     const [delSeller, setDelSeller] = useState(false);
 
     const [uploadsuccess, setUploadSuccess] = useState(false);
     const [isCompExist, setIsCompExist] = useState(false);
     // const [includeInputsCat, setIncludeInputsCat] = useState([]); 
     const [invalidContent, setInvalidContent] = useState(false); 

 
     const includeInputsCat = ["SPORTS", "SHORT FILMS", "LIVE EVENTS", "MUSIC", "COOKING SHOWS", "LIFESTYLE", "SERIES & TELENOVELAS", "DOCUMENTARIES", "DOCUSERIES", "KIDS MOVIES", "MOVIES", "KIDS SERIES", "MUSIC", "LIVE EVENTS", "MY CATEGORY"];
     // console.log('catBasedContentFieldscatBasedContentFields',catBasedContentFields)
     const {route, setRoute,setCurrentPage,setRowsPerPage,usePrevious , userData, setActiveMenuId, setShowSessionPopupup,showSessionPopupup,GetTimeActivity} = useContext(contentContext);
 
     const prevRoute = usePrevious(route)
     useEffect(() => {
         if(prevRoute != undefined && prevRoute!=route){
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
 
         // const k = categoryName.map(item => item.value)
         // setIncludeInputsCat(k)
 
     }, [sellerContent]);
     useEffect(() => {
         if (!localStorage.getItem("token")) {
             history.push("/");
             localStorage.setItem("check", id);
         }
         setRoute("content")
         Categories();
         setActiveMenuId(200001)
         GetLookUp();
         if (id) {
             getContent();
         }
         console.log('before calling');
 
         getSellersData();
         if (id) {
             getContentFiles(id).then((data) => {
                 console.log("getClientcontent data", data);
                 if (data.statusCode == 200) {
                     // console.log(data.result, "---")
                     if (data.result === "Invalid token or Expired") {
                         setShowSessionPopupup(true)
                     } else {
                         setFilesData(data.result);
                     }
                 }
             }).catch((error) => {
                 console.log(error);
             })
         }
 
         userActivity();
     }, []);
     const userActivity = () => {
        let path = window.location.pathname.split("/");
        const pageName = id != undefined ? path[path.length - 2] :path[path.length - 1];;
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
 
         if (id) {
             if (editcontent.category != undefined) {
                 getCompanies(editcontent.category).then((data) => {
                     // console.log("companies data", data);
                     if (data.statusCode == 200) {
                         if (data.result === "Invalid token or Expired") {
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
                     if (data.result === "Invalid token or Expired") {
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
     console.log('delSuccess', delSuccess)
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
                 if (data.result === "Invalid token or Expired") {
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
     console.log('fields====>', fields)


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
                         if (data.result === "Invalid token or Expired") {
                             setShowSessionPopupup(true)
                         } else {
                             setSuccess(true);
                             //history.push("/contentmanagement");
                             getContent();
                             setBtnLoader(false);
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
                         if (data.result === "Invalid token or Expired") {
                             setShowSessionPopupup(true)
                         } else {
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
 
 
     const handlePreview = () => {
        GetTimeActivity()
        setShowPreview(false)
    }
     // console.log('category fields', categoryName);
     const handleAddSubtitle = (e,item)=>{
        GetTimeActivity()
     
        setFileCategory("SUBTITLE");
        setActiveTrailerId(item.contentfileid)
        setActiveSubTitles(item?.subtitles != undefined ? item?.subtitles : [])
        setActiveVideo(item)
        // setShowSubUpload(true);
    }
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
                 if (response.data.result === "Invalid token or Expired") {
                     setShowSessionPopupup(true)
                 } else {
                     let result = response.data.result[0]
                     if(response.data.result.length>0){

                     setEditContent({ ...editcontent, ...result });
                     setContentTitle(result.title)
 
 
                     const apiCategory = result.category?.map((eachItem) => { return { value: eachItem, label: eachItem }; })
                     setSelectedOptions(apiCategory);
 
                     const apigenre = result.genre?.map((eachItem) => { return { value: eachItem, label: eachItem }; })
                     setSelectedOptionsgenre(apigenre);
 
                     const apiCountryofOrigin = result.countryoforigin?.map((eachItem) => { return { value: eachItem, label: eachItem }; })
                     setSelectedOptionscountryOfOrigin(apiCountryofOrigin)
                 }else{
                    setInvalidContent(true)
                 }}
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
                 if (response.data.result === "Invalid token or Expired") {
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
         if (!!errors[e.target.name]) {
             let error = Object.assign({}, errors);
             delete error[e.target.name];
             setErrors(error);
         }
         if(e.target.value == "INACTIVE"){
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
         if (e.target.name == "releasedate") {
             let date = moment(new Date(e.target.value)).toISOString();
             setEditContent({ ...editcontent, [e.target.name]: date, releaseyear: e.target.value.slice(0, 4) });
             // setEditContent({ ...editcontent,  });
 
         } else if (e.target.name == "cast" || e.target.name == "director") {
             var temp = new Array();
             temp = e.target.value && e.target.value.split(",");
             setEditContent({ ...editcontent, [e.target.name]: temp });
         } else {
             console.log('e.target.value222222222--->', e.target.value)
             setEditContent({ ...editcontent, [e.target.name]: e.target.value });
         }
 
     }
 
 
 
 
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
                 delete newContent['leadartist'];
                 delete newContent['musicgenre'];
                 setEditContent(newContent)
             }
             if (!selectedArrayNew.includes("SPORTS")) {
                 delete newContent['sport'];
                 setEditContent(newContent)
             }
             if (selectedArrayNew.length == 1 && selectedArrayNew.includes("FORMATS")) {
                 delete newContent['subtitleslanguages'];
                 setEditContent(newContent)
             }
             if (!selectedArrayNew.includes("SPORTS") && !selectedArrayNew.includes("MUSIC") && !selectedArrayNew.includes("LIVE EVENTS")) {
                 delete newContent['sport'];
                 delete newContent['leadartist'];
                 delete newContent['musicgenre'];
                 // console.log('newContent', newContent); editcontent['category'].includes("LIFESTYLE")
                 setEditContent(newContent)
             }
             if ((editcontent['category'] && !editcontent['category'].includes("FORMATS") ||
                 editcontent['category'] && !editcontent['category'].includes("KIDS SERIES") ||
                 editcontent['category'] && !editcontent['category'].includes("DOCUSERIES") ||
                 editcontent['category'] && !editcontent['category'].includes("SERIES & TELENOVELAS") ||
                 editcontent['category'] && !editcontent['category'].includes("COOKING SHOWS") ||
                 editcontent['category'] && !editcontent['category'].includes("LIFESTYLE") ||
                 editcontent['category'] && !editcontent['category'].includes("MOVIES") ||
                 editcontent['category'] && !editcontent['category'].includes("MY CATEGORY")
             )) {
                 delete newContent['genre'];
                 // console.log('newContent----------->', newContent);
                 setEditContent(newContent)
             }
 
             if ((editcontent['category'] && !editcontent['category'].includes("FORMATS") ||
                 editcontent['category'] && !editcontent['category'].includes("LIVE EVENTS") ||
                 editcontent['category'] && !editcontent['category'].includes("MUSIC") ||
                 editcontent['category'] && !editcontent['category'].includes("SPORTS") ||
                 editcontent['category'] && !editcontent['category'].includes("KIDS SERIES") ||
                 editcontent['category'] && !editcontent['category'].includes("DOCUSERIES") ||
                 editcontent['category'] && !editcontent['category'].includes("DOCUMENTARIES") ||
                 editcontent['category'] && !editcontent['category'].includes("SERIES & TELENOVELAS") ||
                 editcontent['category'] && !editcontent['category'].includes("SERIES & TELENOVELAS") ||
                 editcontent['category'] && !editcontent['category'].includes("LIFESTYLE"))) {
                 delete newContent['noofepisodes'];
                 delete newContent['noofseasons'];
                 // console.log('newContent', newContent);
                 setEditContent(newContent)
             }
 
 
             // console.log('returnArray(selected);', returnArray(selected));
             setErrors({});
             getCompanies(selectedArrayNew).then((data) => {
                 // console.log("companies data", data);
                 if (data.statusCode == 200) {
                     if (data.result === "Invalid token or Expired") {
                         setShowSessionPopupup(true)
                     } else {
                         setCompaniesData(data.result.data);
                     }
                 }
             }).catch((error) => {
                 console.log(error);
             });
         }
         if (key == 'sport' || key == 'leadartist') {
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
                 type: arrayType
 
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
         if (content.filetype === "VIDEO" && content?.video?.m3u8?.proxyUrl) {
             let source = window.site.common.proxiesCloudFront + content?.video?.m3u8?.proxyUrl
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
 
     }
     const openFileViewer = (e, content) => {
        GetTimeActivity()
         let source;
         // if (content.filetype === "JPG") {
         source = window.site.common.resourcesUrl + "/" + content.sourcepath;
         // console.log("source", source)
         // console.log("source", content)
         // } else {
         //     source = window.site.common.proxiesCloudFront + "/" + content.sourcepath;
         //     console.log("source", source)
         // }
 
         setPlayContent(source);
         setType(content.mimetype);
         setshowDoc(true);
         console.log("source content", content);
         console.log("source content",);
     }
 

  
 
 
 
   
 
 
 const previewImage = (e,value)=>{
    GetTimeActivity()
    console.log('valueeeee',value)
    setShowPreview(true)
    setPreviewImg(value)
}
    
 
     // console.log("userData",userData)
 
 
     const filesTab = () => {
        
         return (
             <div className={`tab-pane ${activeTab == 'files' ? 'active show' : ''}`} role="tabpanel" id="videoclips">
                 {id ?
 
                     <div className="col-md-3 basic-info-img">
                        
 
                         <div className="position-relative">
                             <h5 className="font-size-14">portrait image</h5>
                            
                             {(image && editcontent.portraitimage && editcontent.portraitimage != "") ?
                                 <img src={image + editcontent.portraitimage + "?auto=compress,format&width=" + cardWidth} /> : <img src={image + "orasi/common/images/img-default.jpg?auto=compress,format&width=" + cardWidth} />}
                            <div className="edit-info black-gradient portrait-btns">
                         
                         {(image && editcontent.portraitimage && editcontent.portraitimage != "") ?   
                         <button className="border-btn_sm portrait team-edit-btn preview-btn" style={{ zIndex: "999" }}
                          onClick={(e) => previewImage(e,image + editcontent.portraitimage )}><i className="mdi mdi-eye font-size-18"></i></button>:
                          null}



                         </div>
                         </div>
                         <div className="position-relative">
                             <h5 className="font-size-14">landscape image</h5>
                             {(image && editcontent.landscapeimage && editcontent.landscapeimage != "") ? <img src={image + editcontent.landscapeimage + "?auto=compress,format&width=" + cardWidth} /> : <img src={image + "orasi/common/images/img-default-landscape.jpg?auto=compress,format&width=" + cardWidth} />}
                             <div className="edit-info black-gradient landscape-btns">

                                 {(image && editcontent.landscapeimage && editcontent.landscapeimage != "") ?

                                     <button className="border-btn_sm landscape team-edit-btn preview-btn" onClick={(e) => previewImage(e, image + editcontent.landscapeimage )}><i className="mdi mdi-eye font-size-18"></i></button>
                                     : null}





                             </div>
 
                         </div>
 
 
                     </div>
                     : null}
                 {videoClipcategories?.map((eachItem, key) => {
 
                     const items = filesData.filter(item => item.contentType.indexOf(eachItem) !== -1);
 
 
                    //  console.log('eachItem--->',eachItem)
                    //  console.log('items--->',items)
                     // if(items && items[0]?.contentType){
                     return (
                         <>
 
                             {items.length > 0 ?
 
                                 <div className="row" key={key}>
 
                                     <div className="col-md-3 d-flex align-items-center">
                                         <h5 className="font-size-14">{eachItem}</h5>
                                         
                                     </div>
                                     <div className="col-md-9">
 
                                     </div>
                                     {filesData?.map((item, key) => {
                                       
 
                                       return (
                                        eachItem == item.contentType && <><div className="thumbnail-block">

                                            
                                            <div className="asset-card">
                                                {item.filetype == 'VIDEO' && item.status === "AVAILABLE" && <div className="play-icon">
                                                    <span className="material-icons-outlined">play_circle</span>
                                                </div>}
                                                <a className="spinner-class" onClick={(e) => (item.filetype == 'VIDEO') || (item.filetype == 'AUDIO') ? handlePlayer(e, item) : item.filetype != 'AUDIO' ? openFileViewer(e, item) : null}>
                                                    <img src={(editcontent.landscapeimage && image) ? image + editcontent.landscapeimage : (image && editcontent.portraitimage) ? image + editcontent.portraitimage : "https://orasi-dev.imgix.net/orasi/common/images/img-default.jpg"} />
                                                </a>
                                                <p style={{ clear: 'both', display: "inline-block", overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.name ? item.name : item.filename}</p>
                                            </div>
                                            <div className="mb-3 mt-3 input-field"></div>
                                            <div className="mt-0 input-field"></div>
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
                                                      

                                                       {activeSubTitles && activeSubTitles.length>0 ?
                                                        <div className="mb-4 mt-4 input-field">
                                                            <label className="form-label form-label">available subtitles</label>
                                                            <div className="d-flex">
                                                                {activeSubTitles && activeSubTitles.length>0 && activeSubTitles.map((eachSubtitle)=>{

                                                                    return(
                                                                        <div className="sub-titles">
                                                                            <p>{eachSubtitle.label}</p>
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
                                    
                                 </div>
                                 : <div className="row" key={key}>
                                     <div className="col-md-3 d-flex align-items-center">
                                         <h5 className="font-size-14">No {eachItem} data was found</h5>
 
                                       
                                     </div>
                                     <div className="col-md-9">
 
                                     </div>
                                    
                                 </div>
                             }
                         </>
                     )
 
 
 
                     // }
 
                 })
                 }
                 {play ?
 
                     <PlayerInfo source={playContent} play={play} setPlay={setPlay} />
                     : null
                 }
                 {showDoc && <FileViewer source={playContent} type={type} close={setshowDoc} />}
             </div>
         )
     }
 
 
     const sellersTab = () => {
         return (<div className={`tab-pane ${activeTab == 'seller' ? 'active show' : ''}`} role="tabpanel">
 
             {sellersData?.map((eachItem, key) => {
                 return (
                     <div className="row">
                         <div className="col-md-12">
 
                         <div className="row seller-tab">
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
                                         <label className="form-label form-label">Type of Rights</label>
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
                                             <input id="email" name="rightsavailablefromdate" type="text" disabled placeholder="Rights Available From Date" className="form-control" onChange={(e) => handleSellerChange(e)}
                                             value={eachItem.rightsavailablefromdate ? new Date(eachItem.rightsavailablefromdate).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                              }):""}
                                             
                                             />
 
 
 
 
 
                                         </div>
                                     </div>
                                     <div className="col-md-6">
                                         <div className="mb-3 input-field">
                                             <label className="form-label form-label">Rights Available To Date</label>
                                             <input id="email" name="rightsavailabletodate" type="text" disabled placeholder="Rights Available To Date" className="form-control"
                                              value={eachItem.rightsavailabletodate ? new Date(eachItem.rightsavailabletodate).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                              }):""} />
 
                                         </div>
                                     </div>
                                     <div className="col-md-6">
                                         <div className="mb-3 input-field">
                                             <label className="form-label form-label">Restriction Country</label>
                                             <Select isMulti={true}
                                                 isDisabled={true}
                                                 placeholder='Select Country'
                                                 onChange={(e) => handleFilter(e, 'restrictioncountry')}
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
                                 {["MOVIES", "SHORT FILMS", "COOKING SHOWS", "LIFESTYLE", "LINEAR CHANNELS", "SERIES & TELENOVELAS", "DOCUMENTARIES", "DOCUSERIES", "KIDS MOVIES", "KIDS SERIES"].some(el => editcontent['category']?.includes(el)) && <div className="col-md-6">
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
               <label>Created By  :</label> <span>{editcontent && editcontent.createdBy && editcontent.createdBy.username}</span><br/>
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
     const handleFilter = (selected, keyname) => {
         let newContent = Object.assign({}, sellerContent);
         if (!!sellereErrors[keyname]) {
             let error = Object.assign({}, sellereErrors);
             delete error[keyname];
             setSellereErrors(error);
         }
 
 
         console.log('selected', selected, keyname);
         if (keyname == 'companyid') {
             if (!!sellereErrors["companyname"]) {
                 let error = Object.assign({}, sellereErrors);
                 delete error["companyname"];
                 setSellereErrors(error);
             }
             setSellercontent({ ...newContent, [keyname]: selected.value, ['companyname']: selected.label, });
         } else {
             let selectedArray = returnArray(selected)
             setSellercontent({ ...newContent, [keyname]: selectedArray });
         }
     };
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
 console.log('del seller',delSeller)
    
     //  var myDate = new Date(editcontent.releasedate);
 
 
 
     const cardWidth = $(".basic-info-img").width();
 
     const handleBread = () => {
         history.push("/contentmanagement")
     }
 
     const onClickSwitchTab = (e, typeOfTab) => {
         // const isValid = validateMandatoryFields(typeOfTab);
 
         setActiveTab(typeOfTab)
 
 
     }
     const onclickInvalid = () => {
        setInvalidContent(false)
        history.push('/contentmanagement')
    }
     // console.log('editcontenteditcontent',editcontent && editcontent.genre)
     const validateMandatoryFields = () => {
         let isFormValid = true
         let error = activeTab == "info" ? { ...errors } : { ...sellereErrors };
 
         if (isFormValid) {
             let k = [{ name: 'Title', key: 'title' },
             { name: 'Category', key: 'category' },
             { name: 'Synopsis', key: 'synopsis' }
             ];
             k.forEach(function (item) {
 
                 if (editcontent[item.key] == "" || editcontent[item.key] == undefined || editcontent[item.key] == "undefined" || editcontent[item.key] == null) {
                     console.log('editcontent[item.key]editcontent[item.key]---->', editcontent[item.key])
                     console.log('editcontent--/>', editcontent)
                     error[item.key] = item.name + " is required";
                     isFormValid = false;
                 }
 
             });
             catBasedContentFields.some((eachItem) => {
 
                 if (editcontent && editcontent['category'] && editcontent['category'].includes(eachItem.name)) {
                     eachItem.fields.map((eachSub) => {
                         if (eachSub.tab == activeTab) {
 
                             if (activeTab == "seller") {
 
                                 if (eachSub.name == "clientname") {
                                     // console.log(' eachi ssusdfasdf asdfa sfasdfasdf 22222222222222', sellerContent["companyname"])
                                     if (eachSub.mandatory === true && (sellerContent["companyname"] == "" || sellerContent["companyname"] == undefined || sellerContent["companyname"] == "undefined" ||sellerContent["companyname"] == null )) {
                                         // console.log('each 333333333333333333 ', sellerContent["companyname"])
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
 
                             } else {
                                 //    console.log('eachSub.name',eachSub.name)
                                 if (id == undefined) {
                                     if (eachSub.name === "portraitimage") {
                                         return;
                                     }
                                     if (eachSub.name === "landscapeimage") {
                                         return;
                                     }
 
                                     if (eachSub.name === "releasedate") {
                                         return;
                                     }
                                 } else {
                                     if (editcontent["status"] === "INACTIVE" && eachSub.name === "landscapeimage") {
                                         return;
                                     }
                                     if (editcontent["status"] === "INACTIVE" && eachSub.name === "portraitimage") {
                                         return;
                                     }
                                 }
                                 // if(editcontent["status"] === "ACTIVE" && eachSub.name === "portraitimage" && editcontent["landscapeimage"] != "" && eachSub.mandatory === true && (editcontent[eachSub.name] === "" ||
                                 // editcontent[eachSub.name] == undefined )){
                                 //     return;
                                 // }
                                 // if(editcontent["status"] === "ACTIVE" && eachSub.name === "landscapeimage" && editcontent["portraitimage"] != "" && eachSub.mandatory === true && (editcontent[eachSub.name] === "" ||
                                 // editcontent[eachSub.name] == undefined )){
                                 //     return;
                                 // }
                                 if (id !== undefined) {
                                     if ((eachSub.name === "portraitimage" || eachSub.name === "landscapeimage") && (editcontent["portraitimage"] === "" || editcontent["portraitimage"] === undefined || editcontent["portraitimage"] === null  || editcontent["portraitimage"] === "orasi/common/images/img-default.jpg") &&
                                         (editcontent["landscapeimage"] === "" || editcontent["landscapeimage"] === undefined || editcontent["landscapeimage"] === "orasi/common/images/img-default-landscape.jpg")) {
                                         console.log('-------------------------------both-------------')
                                         error[eachSub.name] = "portrait and landscape images are required";
                                         isFormValid = false;
                                     }
                                 }
 
                                 if (eachSub.name != "portraitimage" && eachSub.name != "landscapeimage") {
 
 
                                     if (eachSub.mandatory === true && (editcontent[eachSub.name] === "" || editcontent[eachSub.name] == undefined || editcontent[eachSub.name] == undefined)) {
 
                                         console.log("editcontent---->", editcontent)
                                         console.log('eachSub---->', eachSub)
                                         console.log('eachSub.name--->', eachSub.name)
                                         console.log('editcontent[eachSub.name]--->', editcontent[eachSub.name])
                                         error[eachSub.name] = eachSub.errormsg;
                                         isFormValid = false;
                                     }
                                     if (typeof (editcontent[eachSub.name]) == 'object') {
                                         if (eachSub.mandatory === true && editcontent[eachSub.name].length <= 0) {
                                             // console.log("editcontent---->", editcontent)
                                             // console.log('eachSub---->', eachSub)
                                             // console.log('eachSub.name--->', eachSub.name)
                                             // console.log('editcontent[eachSub.name]--->', editcontent[eachSub.name])
 
                                             error[eachSub.name] = eachSub.errormsg;
                                             isFormValid = false;
                                         }
                                     }
                                 }
                             }
                         }
                     });
                 }
             })
         }
 
         if (editcontent.noofseasons <= 0 || editcontent.noofseasons <= "0") {
             error['noofseasons'] = "Number Of Seasons should be greater than Zero";
             isFormValid = false;
         }
         if (editcontent.noofepisodes <= 0 || editcontent.noofepisodes <= "0") {
             error['noofepisodes'] = "Number Of Episodes should be greater than Zero";
 
             isFormValid = false;
         }
         if (editcontent.imdbrating <= 0 || editcontent.imdbrating <= "0") {
             error['imdbrating'] = "IMDB Rating should be greater than Zero";
 
             isFormValid = false;
         }
         if (activeTab == "seller" && sellerContent && sellerContent.rightsavailablefromdate && sellerContent.rightsavailabletodate) {
             if (new Date(sellerContent.rightsavailablefromdate) > new Date(sellerContent.rightsavailabletodate)) {
 
                 error['rightsavailabletodate'] = "To date cannot be earlier than From date"
 
                 isFormValid = false;
             }
 
         }
         const currentDate = new Date();
         const currentYear = currentDate.getFullYear();
         const formattedDate = currentDate.toISOString();
         if (editcontent.releaseyear > currentYear) {
             error['releaseyear'] = "Future Year connot be Allowed"
             isFormValid = false;
         }
         if (editcontent.releasedate > formattedDate) {
 
             error['releasedate'] = "Future date connot be Allowed"
             isFormValid = false;
         }
 
         console.log("errors in validate mandatory fields", error);
         console.log("edit content in mandaatoryu validd", editcontent);
         activeTab == "info" ? setErrors(error) : setSellereErrors(error);
         return isFormValid;
     }
     // console.log('is show form', errors)
     // console.log('release date', editcontent.releasedate)
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
                                                 <h4 className="mb-2 card-title">{contentTitle}</h4>
                                                 <p className="menu-path"><span onClick={handleBread}>Content Management</span> / <b>{contentTitle}</b></p>
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
                                             {(id !== undefined || isInfoFormValid == true) && <li className="nav-item" role="presentation">
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
                                                                  
                                                                    if ((eachfield.section === 'Basic Details' && eachfield.section !== undefined) && (eachfield.tab === 'info' && eachfield.tab !== undefined)) {
                                                                        if (eachfield.inputtype === 'text' || eachfield.inputtype === "number") {
                                                                                return (
                                                                                    <div className='col-md-6'>
                                                                                        <div className="input-field">
                                                                                            <label for="example-text-input" className="col-form-label">{eachfield.display}</label>
                                                                                            <input className="form-control contact-number" type={eachfield.inputtype} name={eachfield.name} value={editcontent[eachfield.name]||""} disabled placeholder={'Enter ' + eachfield.display} id="example-email-input" />
                                                                                             
                                                                                        </div>
                                                                                    </div>)
                                                                            }
                                                                            if (eachfield.inputtype === "multiselectdropdown") {
                                                                                return (
                                                                                    <div className='col-md-6'>
                                                                                        <div className="mb-3 input-field">
                                                                                            <div className="title-block">
                                                                                                <label className="form-label form-label">{eachfield.display}</label>
                                                                                            </div>

                                                                                            <Select isMulti={true}
                                                                                                placeholder={"Select " + eachfield.display}
                                                                                                 
                                                                                                isDisabled={true}
                                                                                                options={eachfield.name === "category" ? categoryName : lookup && lookup[eachfield.lookupvalue] && lookup[eachfield.lookupvalue].map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                                                                value={editcontent && editcontent[eachfield.name] && Array.isArray(editcontent[eachfield.name]) ? editcontent[eachfield.name]?.map((eachItem) => { return { value: eachItem, label: eachItem } }):[]}
                                                                                            />
                                                                                             
                                                                                        </div>
                                                                                    </div>)
                                                                            }
                                                                            if (eachfield.inputtype === "dropdown") {
                                                                               
                                                                                return (
                                                                                    <div className='col-md-6'>
                                                                                        <div className="mb-3 input-field">
                                                                                            <label className="form-label form-label">{eachfield.display}</label>
                                                                                            <select className="form-select" disabled placeholder={"Select " + eachfield.display} name={eachfield.name} value={editcontent[eachfield.name]}
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

                                                                                            <input id="email" disabled placeholder={"Select " + eachfield.display} name={eachfield.name} value={editcontent && editcontent[eachfield.name] && moment(new Date(editcontent[eachfield.name])).format('YYYY-MM-DD')}  type="date" className="form-control" max={new Date().toISOString().split('T')[0]}
                                                                                            />
                                                                                             
                                                                                        </div>
                                                                                    </div>)
                                                                            }
                                                                            if (eachfield.inputtype === "textarea") {
                                                                                return (
                                                                                    <div className='col-md-6'>
                                                                                        <div className="mb-3 input-field">
                                                                                            <label className="form-label form-label">{eachfield.display}</label>
                                                                                            <textarea id="email" placeholder={"Select " + eachfield.display} name={eachfield.name} disabled type="text" className="form-control" value={editcontent[eachfield.name]||""}  />
                                                                                             
                                                                                        </div>
                                                                                    </div>)
                                                                            }


                                                                    }

                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>}
                                                {fields.some(iter => iter.section === 'Metadata') &&
                                                    <div className="row">
                                                        <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Metadata</h5>
                                                        {fields.map(eachfield => {
                                                            if (eachfield.section === 'Metadata' && eachfield.tab === 'info') {
                                                               
                                                                    if (eachfield.inputtype === 'text' || eachfield.inputtype === "number") {
                                                                     
                                                                        return (
                                                                            <div className="col-md-4">
                                                                                <div className="input-field">
                                                                                    <label for="example-text-input" className="col-form-label">{eachfield.display}</label>
                                                                                    <input className="form-control contact-number" disabled type={eachfield.inputtype} name={eachfield.name} value={editcontent[eachfield.name]||""}  placeholder={'Enter ' + eachfield.display} id="example-email-input" />
                                                                                     
                                                                                </div>
                                                                            </div>)
                                                                    }
                                                                    if (eachfield.inputtype === "multiselectdropdown") {
                                                                        return (
                                                                            <div className="col-md-4">
                                                                                <div className="mb-3 input-field">
                                                                                    <label className="form-label form-label">{eachfield.display}</label>
                                                                                        <Select isMulti={true}
                                                                                        placeholder={"Select " + eachfield.display}
                                                                                         isDisabled={true}
                                                                                        options={lookup && lookup[eachfield.lookupvalue] && lookup[eachfield.lookupvalue].map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                                                        value={editcontent && editcontent[eachfield.name] && Array.isArray(editcontent[eachfield.name]) ? editcontent[eachfield.name]?.map((eachItem) => { return { value: eachItem, label: eachItem } }):[]}
                                                                                    />
                                                                                     
                                                                                </div>
                                                                            </div>)
                                                                    }
                                                            


                                                            }
                                                        })}


                                                    </div>}
                                                {fields.some(iter => iter.section === 'Cast & Crew') &&
                                                    <div className="row">
                                                        <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>cast and crew</h5>

                                                        {fields.map(eachfield => {
                                                            if (eachfield.section === 'Cast & Crew' && eachfield.tab === 'info') {
                                                               
                                                                    if (eachfield.inputtype === 'text' || eachfield.inputtype === "number") {
                                                                        return (
                                                                            <div className="col-md-4">
                                                                                <div className="input-field">
                                                                                    <label for="example-text-input" className="col-form-label">{eachfield.display}</label>
                                                                                    <input className="form-control contact-number" disabled type={eachfield.inputtype} name={eachfield.name} value={editcontent[eachfield.name]||""}  placeholder={'Enter ' + eachfield.display} id="example-email-input" />
                                                                                     
                                                                                </div>
                                                                            </div>)
                                                                    }


                                                            


                                                            }
                                                        })}


                                                    </div>}
                                                {fields.some(iter => iter.section === 'Life Style') &&
                                                    <div className="row">
                                                        <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Life Style</h5>

                                                        {fields.map(eachfield => {
                                                            if (eachfield.section === 'Life Style' && eachfield.tab === 'info') {
                                                               
                                                                    if (eachfield.inputtype === 'text' || eachfield.inputtype === "number") {
                                                                        return (
                                                                            <div className="col-md-4">
                                                                                <div className="input-field">
                                                                                    <label for="example-text-input" className="col-form-label">{eachfield.display}</label>
                                                                                    <input className="form-control contact-number" disabled type={eachfield.inputtype} name={eachfield.name} value={editcontent[eachfield.name]||""}  placeholder={'Enter ' + eachfield.display} id="example-email-input" />
                                                                                     
                                                                                </div>
                                                                            </div>)
                                                                    }
                                                                    if (eachfield.inputtype === "multiselectdropdown") {
                                                                        return (
                                                                            <div className="col-md-4">
                                                                                <div className="mb-3 input-field">
                                                                                    <label className="form-label form-label">{eachfield.display}</label>

                                                                                    <Select isMulti={true}
                                                                                        placeholder={"Select " + eachfield.display}
                                                                                         isDisabled={true}
                                                                                        options={lookup && lookup[eachfield.lookupvalue] && lookup[eachfield.lookupvalue].map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                                                        value={editcontent && editcontent[eachfield.name] && Array.isArray(editcontent[eachfield.name]) ? editcontent[eachfield.name]?.map((eachItem) => { return { value: eachItem, label: eachItem } }):[]}
                                                                                    />
                                                                                     
                                                                                </div>
                                                                            </div>)
                                                                    }

                                                               


                                                            }
                                                        })}


                                                    </div>
                                                }
                                                {fields.some(iter => iter.section === 'Awards & Certificate') &&
                                                    <div className="row">
                                                        <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Awards & Certificate</h5>

                                                        {fields.map(eachfield => {
                                                            if (eachfield.section === 'Awards & Certificate' && eachfield.tab === 'info') {
                                                         
                                                                    if (eachfield.inputtype === 'text' || eachfield.inputtype === "number") {
                                                                      
                                                                        return (
                                                                            <div className="col-md-4">
                                                                                <div className="input-field">
                                                                                    <label for="example-text-input" className="col-form-label">{eachfield.display}</label>
                                                                                    <input className="form-control contact-number" disabled type={eachfield.inputtype} name={eachfield.name} value={editcontent[eachfield.name]||""}  placeholder={'Enter ' + eachfield.display} id="example-email-input" />
                                                                                     
                                                                                </div>
                                                                            </div>)
                                                                    }
                                                                    if (eachfield.inputtype === "multiselectdropdown") {
                                                                        return (
                                                                            <div className="col-md-4">
                                                                                <div className="mb-3 input-field">
                                                                                    <label className="form-label form-label">{eachfield.display}</label>



                                                                                    <Select isMulti={true}
                                                                                        placeholder={"Select " + eachfield.display}
                                                                                         isDisabled={true}
                                                                                        options={lookup && lookup[eachfield.lookupvalue] && lookup[eachfield.lookupvalue].map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                                                        value={editcontent && editcontent[eachfield.name] && Array.isArray(editcontent[eachfield.name]) ? editcontent[eachfield.name]?.map((eachItem) => { return { value: eachItem, label: eachItem } }):[]}
                                                                                    />
                                                                                     
                                                                                </div>
                                                                            </div>)
                                                                    }

                                                       


                                                            }
                                                        })}


                                                    </div>}
                                                {fields.some(iter => iter.section === 'Seasons & Episodes') &&
                                                    <div className="row">
                                                        <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Seasons & Episodes</h5>

                                                        {fields.map(eachfield => {
                                                            if (eachfield.section === 'Seasons & Episodes' && eachfield.tab === 'info') {
                                                              
                                                                    if (eachfield.inputtype === 'text' || eachfield.inputtype === "number") {
                                                                        return (
                                                                            <div className="col-md-6">
                                                                                <div className="input-field">
                                                                                    <label for="example-text-input" className="col-form-label">{eachfield.display}</label>
                                                                                    <input className="form-control contact-number" disabled type={eachfield.inputtype} name={eachfield.name} value={editcontent[eachfield.name]||""}  placeholder={'Enter ' + eachfield.display} id="example-email-input" />
                                                                                     
                                                                                </div>
                                                                            </div>)
                                                                    }



                                                            }
                                                        })}


                                                    </div>}

                                                <div className="row status">

                                                    <div className="col-md-3 justify-content-between ps-0">
                                                        {id && <>
                                                            <label className="col-form-label">Status</label>
                                                   
                                                                 <input className="form-control contact-number" disabled type="text"  value={editcontent.status === "INPROGRESS"? "IN PROGRESS":editcontent.status} id="example-email-input" />

                                                             
                                                        </>
                                                        }
                                                    </div>

                                                    {/* <div className="col-md-9 justify-content-end d-flex align-items-center">


                                                        {id == undefined ? <a className="btn btn-primary" onClick={(e) => saveNext(e)}>NEXT</a> :
                                                            <a className="btn btn-primary" onClick={submit}>{BtnLoader ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}UPDATE</a>}
                                                    </div> */}
                                                    {/* {(errors.landscapeimage || errors.portraitimage) && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>Please upload a portrait or landscape image in the files tab to activate the content.</span>} */}

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
                                         {/* <div className="tab-content p-3 text-muted">
                                             {activeTab == "info" && <div className={`tab-pane ${activeTab == 'info' ? 'active show' : ''}`} role="tabpanel" id="home1">
                                                 <div className="row">
                                                     <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i> basic details</h5>
                                                     <div className="col-md-12">
                                                         <div className="row basic-details">
                                                             <div className="col-md-6">
                                                                 <div className="input-field">
                                                                     <label for="example-text-input" className="col-form-label">TITLE</label>
                                                                     <input className="form-control contact-number" type="text" name="title" value={editcontent.title} disabled placeholder="TITLE" id="example-email-input" />
                                                                    
                                                                 </div>
                                                             </div>
                                                             <div className="col-md-6">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Foreign Title</label>
                                                                     <input id="email" name="foreigntitle" placeholder="Foreign Title" type="text" className="form-control" value={editcontent.foreigntitle} disabled />
                                                                 </div>
                                                             </div>
 
 
                                                             <div className="col-md-6">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Category</label>
                                                                 
                                                                     <Select isMulti={true}
                                                                      
                                                                         placeholder='Category'
                                                                         isDisabled={true}
                                                                         options={categoryName}
                                                                         value={editcontent && editcontent.category && editcontent.category?.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                                     />
                                                                   
                                                                 </div>
                                                             </div>
                                                             <div className="col-md-6">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Featured</label>
                                                                     <select className="form-select" placeholder="Select" name="featured" value={editcontent.featured}
                                                                         disabled >
                                                                         <option value="">Select</option>
                                                                         <option value="false">False</option>
                                                                         <option value="true">True</option>
 
                                                                     </select>
                                                                  
 
 
                                                                 </div>
                                                             </div>
                                                             <div className="col-md-6">
                                                                 <div className="mb-3 input-field">
                                                                     <div className="title-block">
                                                                         <label className="form-label form-label">Country of Origin</label>
                                                                        
                                                                     </div>
                                                                   
                                                                     <Select isMulti={true}
                                                                         placeholder='Country of origin'
                                                                         isDisabled={true}
                                                                         options={countryData}
                                                                         value={editcontent && editcontent.countryorigin?.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                                     />
                                                                    
                                                                 </div>
                                                             </div>
                                                             {editcontent && editcontent['category'] && includeInputsCat.some(el => editcontent['category'].includes(el)) &&
 
                                                                 handleField('audiodetails') &&
                                                                 <div className="col-md-6">
                                                                     <div className="mb-3 input-field">
                                                                         <label className="form-label form-label">Audio Details</label>
                                                                         <input id="email" name="audiodetails" placeholder="Audio Details" type="text" className="form-control" value={editcontent.audiodetails} disabled />
                                                                     </div>
                                                                 </div>}
 
                                                          
                                                             {handleField('videoquality') &&
                                                                 <div className="col-md-6">
                                                                     <div className="mb-3 input-field">
                                                                         <div className="title-block">
                                                                             <label className="form-label form-label">Video Quality</label>
                                                                           
                                                                         </div>
                                                                         <Select isMulti={true}
                                                                             placeholder='Select Video Quality'
                                                                             isDisabled={true}
                                                                             options={lookup && lookup.videoformat && lookup.videoformat.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                                             value={editcontent && editcontent.videoquality && Array.isArray(editcontent.videoquality) && editcontent.videoquality?.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                                         />
                                                                         <div className="add-block">
                                                                         </div>
                                                                        
                                                                     </div>
                                                                 </div>}
                                                         
                                                             {
                                                                 editcontent && editcontent['category'] && includeInputsCat.some(el => editcontent['category'].includes(el)) &&
 
                                                                 <>
 
                                                                     {handleField('releaseyear') &&
                                                                         <div className="col-md-6">
                                                                             <div className="mb-3 input-field">
                                                                                 <label className="form-label form-label">Release Year</label>
                                                                                 <input id="email" placeholder="Release Year" type="number"
                                                                                     name="releaseyear" value={editcontent.releaseyear} disabled
                                                                                     className="form-control" />
                                                                              
                                                                             </div>
                                                                         </div>}
                                                                     {handleField('releasedate') &&
                                                                         <div className="col-md-6">
                                                                             <div className="mb-3 input-field">
                                                                                 <label className="form-label form-label">Release Date</label>
                                                                                 <input id="email" name="releasedate" value={editcontent && editcontent.releasedate && moment(new Date(editcontent.releasedate)).format('YYYY-MM-DD')} disabled placeholder="Release Date" type="date" className="form-control"
                                                                                     max={new Date().toISOString().split('T')[0]} // Set the maximum date to today
                                                                                 />
                                                                                
                                                                             </div>
                                                                         </div>}</>}
                                                             {
                                                                
 
                                                                 <>
                                                                     {handleField('imdbrating') &&
                                                                         <div className="col-md-6">
                                                                             <div className="mb-3 input-field">
                                                                                 <label htmlFor="example-text-input" className="col-form-label">IMDB Rating</label>
                                                                                 <input
                                                                                     type="number"
                                                                                     className="form-control"
                                                                                     id="example-email-input"
                                                                                     placeholder="IMDB Rating"
                                                                                     name="imdbrating"
                                                                                     disabled
                                                                                     value={editcontent.imdbrating}
                                                                                 />
                                                                                
                                                                             </div>
                                                                         </div>}
                                                                     {handleField('availabilityofme') &&
                                                                         <div className="col-md-6">
                                                                             <div className="mb-3 input-field">
                                                                                 <label htmlFor="example-text-input" className="col-form-label">Availability of M&E</label>
 
                                                                                 <select className="form-select" placeholder="Select" name="availabilityofme" value={editcontent.availabilityofme} disabled ><option value="">Select</option><option>True</option><option>False</option></select>
                                                                             </div>
                                                                         </div>}
                                                                     {handleField('availabilityofscripts') &&
                                                                         <div className="col-md-6">
                                                                             <div className="mb-3 input-field">
                                                                                 <label htmlFor="example-text-input" className="col-form-label">Availability of Scripts</label>
                                                                                 <select className="form-select" placeholder="Select" name="availabilityofscripts" value={editcontent.availabilityofscripts} disabled ><option value="">Select</option><option value="true">True</option><option value="false">False</option></select>
 
                                                                             </div>
                                                                         </div>}
                                                                 </>}
 
                                                             {
                                                               
                                                                 handleField('genre') &&
                                                                 <div className="col-md-6">
                                                                     <div className="mb-3 input-field">
                                                                         <div className="title-block">
                                                                             <label className="form-label form-label">Genre</label>
                                                                           
                                                                         </div>
 
                                                                         <Select isMulti={true}
                                                                             placeholder='Genre'
                                                                             options={genreData}
                                                                             isDisabled={true}
                                                                             value={editcontent && editcontent.genre && editcontent.genre?.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                                         />
                                                                         <div className="add-block">
                                                                         </div>
                                                                        
                                                                     </div>
                                                                 </div>}
 
                                                             <div className="col-md-6">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Keywords</label>
                                                                     <input id="email" name="keywords" placeholder="Keywords" type="text" className="form-control" value={editcontent.keywords} disabled />
                                                                 </div>
                                                             </div>
                                                             <div className="col-md-6">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Remarks</label>
                                                                     <input id="email" name="remarks" placeholder="Remarks" type="text" className="form-control" value={editcontent.remarks} disabled />
                                                                 </div>
                                                             </div>
                                                             <div className="col-md-12">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Analytics</label>
                                                                     <textarea id="email" name="analytics" placeholder="Analytics" type="text" className="form-control" value={editcontent.analytics} disabled />
                                                                 </div>
                                                             </div>
                                                             <div className="col-md-12">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Synopsis </label>
                                                                     <textarea id="email" name="synopsis" placeholder="Synopsis" type="text" className="form-control" value={editcontent.synopsis} disabled />
                                                                    
                                                                 </div>
                                                             </div>
                                                             
 
                                                         </div>
                                                     </div>
 
 
 
 
 
 
                                                 </div>
 
 
                                                 <div className="row">
                                                     <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Metadata</h5>
 
                                                     {
                                                         editcontent && editcontent['category'] && (editcontent['category'].length > 1 || !editcontent['category'].includes("FORMATS")) &&
                                                         handleField('subtitleslanguages') &&
                                                         <div className="col-md-4">
                                                             <div className="mb-3 input-field">
                                                                 <label className="form-label form-label">Subtitle Languages</label>
                                                                 <Select isMulti={true}
                                                                     placeholder='Select Subtitle Languages'
                                                                     isDisabled={true}
                                                                     options={lookup && lookup.language && lookup.language.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                                     value={editcontent && editcontent.subtitleslanguages && Array.isArray(editcontent.subtitleslanguages) && editcontent.subtitleslanguages?.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                                 />
                                                             </div>
                                                         </div>}
                                                     {
                                                       
                                                         handleField('duration') &&
                                                         <div className="col-md-4">
                                                             <div className="input-field">
                                                                 <label for="example-text-input" className="col-form-label">DURATION</label>
                                                                 <input className="form-control contact-number" type="text" name="duration" value={editcontent.duration} disabled placeholder="DURATION" id="example-email-input" />
                                                                
                                                             </div>
                                                         </div>}
                                                     {
 
                                                      
                                                         handleField('location') &&
                                                         <div className="col-md-4">
                                                             <div className="mb-3 input-field">
                                                                 <label className="form-label form-label">Location</label>
                                                                 <input id="email" name="location" value={editcontent.location} disabled placeholder="Location" type="text" className="form-control" />
 
                                                             </div>
                                                         </div>}
 
 
 
                                                   
                                                 </div>
 
                                                 {
                                                     editcontent && editcontent['category'] && includeInputsCat.some(el => editcontent['category'].includes(el)) &&
 
                                                     <div className="row">
                                                         <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>cast and crew</h5>
                                                         {handleField('cast') &&
                                                             <div className="col-md-4">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Cast  </label>
                                                                     <input id="email" name="cast" placeholder="Cast" type="text" className="form-control" value={editcontent.cast} disabled />
                                                                    
                                                                 </div>
                                                             </div>}
                                                         {handleField('director') &&
                                                             <div className="col-md-4">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Director</label>
                                                                     <input id="email" name="director" placeholder="Director" type="text" className="form-control" value={editcontent.director} disabled />
                                                                 </div>
                                                             </div>}
                                                         {handleField('musicdirector') &&
                                                             <div className="col-md-4">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Director Music</label>
                                                                     <input id="email" name="musicdirector" placeholder="Director Music" type="text" className="form-control" value={editcontent.musicdirector} disabled />
                                                                 </div>
                                                             </div>}
                                                         {
 
                                                         
                                                             handleField('writer') &&
                                                             <div className="col-md-4">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Writer</label>
                                                                     <input id="email" name="writer" placeholder="Writer" type="text" className="form-control" value={editcontent.writer} disabled />
                                                                 </div>
                                                             </div>}
                                                         {handleField('producer') &&
                                                             <div className="col-md-4">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Producer</label>
                                                                     <input id="email" name="producer" placeholder="Producer" type="text" className="form-control" value={editcontent.producer} disabled />
                                                                 </div>
                                                             </div>}
                                                         {handleField('productionhouse') &&
                                                             <div className="col-md-4">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Production House</label>
                                                                     <input id="email" name="productionhouse" placeholder="Production House" type="text" className="form-control" value={editcontent.productionhouse} disabled />
                                                                 </div>
                                                             </div>}
                                                         {handleField('productionyear') &&
                                                             <div className="col-md-4">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Production Year</label>
                                                                     <input id="email" name="productionyear" placeholder="Production Year" type="text" className="form-control" value={editcontent.productionyear} disabled />
                                                                   
                                                                 </div>
                                                             </div>}
 
 
                                                     </div>}
                                                 {
 
                                                     editcontent && editcontent['category'] && editcontent['category'].includes('LIFESTYLE') &&
 
 
                                                     <div className="row">
                                                         <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Life Style</h5>
                                                         {handleField('recipename') &&
                                                             <div className="col-md-4">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Recipe Name</label>
                                                                     <input id="email" name="recipename" value={editcontent.recipename} disabled placeholder="Recipe Name" type="text" className="form-control" />
                                                                 </div>
                                                             </div>}
                                                         {handleField('chef') &&
                                                             <div className="col-md-4">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Chef</label>
                                                                     <input id="email" name="chef" value={editcontent.chef} disabled placeholder="Chef" type="text" className="form-control" />
                                                                 </div>
                                                             </div>}
                                                         {handleField('ingredients') &&
                                                             <div className="col-md-4">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Ingredients</label>
                                                                     <input id="email" name="ingredients" value={editcontent.ingredients} disabled placeholder="Ingredients" type="text" className="form-control" />
                                                                 </div>
                                                             </div>}
                                                         {handleField('mealcoursetype') &&
                                                             <div className="col-md-4">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Meal Course Type</label>
                                                                     <input id="email" name="mealcoursetype" value={editcontent.mealcoursetype} disabled placeholder="Enter meal course type" type="text" className="form-control" />
                                                                 </div>
                                                             </div>}
                                                         {handleField('mealtype') &&
                                                             <div className="col-md-4">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Meal Type</label>
                                                                     <input id="email" name="mealtype" value={editcontent.mealtype} disabled placeholder="Enter meal type" type="text" className="form-control" />
                                                                 </div>
                                                             </div>}
                                                         {handleField('anchor') &&
                                                             <div className="col-md-4">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Anchor</label>
                                                                     <input id="email" name="anchor" placeholder="Anchor" type="text" className="form-control" value={editcontent.anchor} disabled />
                                                                 </div>
                                                             </div>}
                                                         {handleField('cuisine') &&
                                                             <div className="col-md-4">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Cuisine</label>
                                                                     <Select isMulti={true}
                                                                         placeholder='Select Cuisine'
                                                                         isDisabled={true}
                                                                         options={lookup && lookup.cuisine && lookup.cuisine.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                                         value={editcontent && editcontent.cuisine && Array.isArray(editcontent.cuisine) && editcontent.cuisine?.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                                     />
                                                                 </div>
                                                             </div>}
                                                     </div>}
                                                 {(editcontent && editcontent['category'] &&
                                                     (editcontent['category'].includes("MUSIC") ||
                                                         editcontent['category'].includes("SPORTS") ||
                                                         editcontent['category'].includes("LIVE EVENTS"))) &&
                                                     <div className="row">
                                                         <h5 className="font-size-14">
                                                             <i className="mdi mdi-arrow-right"></i>{editcontent.category.filter(x => (x == "SPORTS") || (x == "LIVE EVENTS") || (x == "MUSIC") || (x == "SERIES & TELENOVELAS")).join('/')}</h5>
                                                         {
                                                            
                                                             handleField('league_tournament') &&
                                                             <div className="col-md-4">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">League/Tournament</label>
                                                                     <input id="email" name="league_tournament" value={editcontent.league_tournament} disabled placeholder="League/Tournament" type="text" className="form-control" />
                                                                 </div>
                                                             </div>}
                                                         {
                                                           
 
                                                             <>
                                                                 {handleField('sportsstars') &&
                                                                     <div className="col-md-4">
                                                                         <div className="mb-3 input-field">
                                                                             <label className="form-label form-label">Sports Stars</label>
                                                                             <input id="email" name="sportsstars" value={editcontent.sportsstars} disabled placeholder="Sports Stars" type="text" className="form-control" />
                                                                         </div>
                                                                     </div>}
                                                                 {handleField('sport') &&
                                                                     <div className="col-md-4">
                                                                         <div className="mb-3 input-field">
                                                                             <label className="form-label form-label">Sport</label>
                                                                             <Select isMulti={true}
                                                                                 placeholder='Select sport'
                                                                                 isDisabled={true}
                                                                                 options={lookup && lookup.sports && lookup.sports.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                                                 value={editcontent && editcontent.sport && Array.isArray(editcontent.sport) && editcontent.sport?.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                                             />
                                                                         
                                                                         </div>
                                                                     </div>}
 
                                                             </>}
                                                         {
                                                         
 
                                                             <>
                                                                 {handleField('bandname') &&
                                                                     <div className="col-md-4">
                                                                         <div className="mb-3 input-field">
                                                                             <label className="form-label form-label">Band Name</label>
                                                                             <input id="email" name="bandname" placeholder="Band Name" type="text" className="form-control" value={editcontent.bandname} disabled />
                                                                         </div>
                                                                     </div>}
                                                                 {handleField('lyricist') &&
                                                                     <div className="col-md-4">
                                                                         <div className="mb-3 input-field">
                                                                             <label className="form-label form-label">Lyricist</label>
                                                                             <input id="email" name="lyricist" placeholder="Lyricist" type="text" className="form-control" value={editcontent.lyricist} disabled />
                                                                         </div>
                                                                     </div>}
                                                                 {handleField('musicgenre') &&
                                                                     <div className="col-md-4">
                                                                         <div className="mb-3 input-field">
                                                                             <label className="form-label form-label">Music Genre</label>
                                                                             <Select isMulti={true}
                                                                                 placeholder='Select Music Genre'
                                                                                 isDisabled={true}
                                                                                 options={lookup && lookup.musicgenre && lookup.musicgenre.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                                                 value={editcontent && editcontent.musicgenre && editcontent.musicgenre?.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                                             />
                                                                           
                                                                         </div>
                                                                     </div>}
                                                                 {handleField('otherartists') &&
                                                                     <div className="col-md-4">
                                                                         <div className="mb-3 input-field">
                                                                             <label className="form-label form-label">Other Artists</label>
                                                                             <input id="email" name="otherartists" placeholder="Other Artists" type="text" className="form-control" value={editcontent.otherartists} disabled />
                                                                         </div>
                                                                     </div>}
                                                                 {handleField('performancetype') &&
 
                                                                     <div className="col-md-4">
                                                                         <div className="mb-3 input-field">
                                                                             <label className="form-label form-label">Performance Type</label>
                                                                             <input id="email" name="performancetype" placeholder="Performance Type" type="text" className="form-control" value={editcontent.performancetype} disabled />
                                                                         </div>
                                                                     </div>}
                                                                 {handleField('leadartist') &&
                                                                     <div className="col-md-4">
                                                                         <div className="mb-3 input-field">
                                                                             <label className="form-label form-label">Lead Artist</label>
                                                                             <input id="email" name="leadartist" placeholder="Lead Artist" type="text" className="form-control" value={editcontent.leadartist} disabled />
                                                                             
                                                                         </div>
                                                                     </div>}</>}
 
 
 
                                                     </div>}
                                                 {editcontent && editcontent['category'] && editcontent['category'].length > 0 &&
 
                                                     <div className="row">
                                                         <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Awards & Certificate</h5>
                                                         {handleField('awards_recognition') &&
                                                             <div className="col-md-4">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Awards & Recognition</label>
                                                                     <input id="email" name="awards_recognition" placeholder="Awards & Recognition" type="text" className="form-control" value={editcontent.awardrecognition} disabled />
                                                                 </div>
                                                             </div>}
                                                         {handleField('certificate') &&
                                                             <div className="col-md-4">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Certificate</label>
                                                                     <input id="email" name="certificate" placeholder="Certificate" type="text" className="form-control" value={editcontent.certificate} disabled />
                                                                 </div>
                                                             </div>}
 
                                                     </div>}
                                                 {
 
                                                     (editcontent && editcontent['category'] &&
                                                         (editcontent['category'].includes("FORMATS") ||
                                                             editcontent['category'].includes("LIVE EVENTS") ||
                                                             editcontent['category'].includes("MUSIC") ||
                                                             editcontent['category'].includes("SPORTS") ||
                                                             editcontent['category'].includes("KIDS SERIES") ||
                                                             editcontent['category'].includes("DOCUSERIES") ||
 
                                                             editcontent['category'].includes("SERIES & TELENOVELAS") || editcontent['category'].includes("COOKING SHOWS") ||
                                                             editcontent['category'].includes("LIFESTYLE"))) &&
 
                                                     <div className="row">
                                                         <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Seasons & Episodes</h5>
                                                         {handleField('noofseasons') &&
                                                             <div className="col-md-6">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Number Of Seasons</label>
                                                                     <input id="email" name="noofseasons" value={editcontent.noofseasons} disabled placeholder="Number Of Seasons" type="number" className="form-control" />
                                                                   
                                                                 </div>
                                                             </div>}
                                                         {handleField('noofepisodes') &&
                                                             <div className="col-md-6">
                                                                 <div className="mb-3 input-field">
                                                                     <label className="form-label form-label">Number Of Episodes</label>
                                                                     <input id="email" name="noofepisodes" placeholder="Number Of Episodes" type="number" className="form-control" value={editcontent.noofepisodes} disabled />
                                                                    
                                                                 </div>
                                                             </div>}
                                                     </div>}
 
 
                                                 <div className="row status">
 
                                                     <div className="col-md-3 justify-content-between ps-0">
                                                         {id && <>
                                                             <label className="col-form-label">Status</label>
                                                             {editcontent.status === "INPROGRESS" ? <label className="col-form-label">: In Progress</label> :
                                                            <input id="email" name="status" type="text" className="form-control" value={editcontent.status} disabled />
                                                                 }
                                                         </>
                                                         }
                                                     </div>

                                                   
 
                                                 </div>
 
 
 
 
                                             </div>}
                                             {activeTab == "files" && filesTab()}
                                             {activeTab == "seller" && sellersTab()}
                                             {activeTab == "history" && historyTab()}
 
 
                                           
                                         </div> */}
 
                                     </div>
 
                                 </div>
 
 
                             </div>
                         </div>
 
                         <Modal className="seller-pop preview-pop" show={showPreview} >
                         <button className="close-btn" onClick={handlePreview}><span className="material-icons">close</span></button>
                            <Modal.Header>
                                <Modal.Title>Preview</Modal.Title>
                            </Modal.Header>
                            <Modal.Body><img src={previewImg} className="w-100"/></Modal.Body>

                        </Modal>
                      
                         <Footer />
                       
                     
                        
                     </div>
 }
 
 
             </div>
 
         </>
     );
 };
 
 export default EditContent;
 