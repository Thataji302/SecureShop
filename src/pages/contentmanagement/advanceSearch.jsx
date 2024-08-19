/***
 **Module Name: category
 **File Name :  category.js
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
 **Description : contains category page details.
 ***/
import React, { useState, useEffect, useRef, useContext } from "react";
import tmdbApi from "../../api/tmdbApi";
import { useHistory } from "react-router";
import axios from 'axios';
import { useForm } from "react-hook-form";
import SessionPopup from "../SessionPopup"
import Select from 'react-select';
import { getCompanies } from "../../utils/reducer";
import { contentContext } from "../../context/contentContext";

import Modal from 'react-bootstrap/Modal';
let { lambda, appname } = window.app;

const AdvanceSearch = (props) => {
  const history = useHistory();
  const { control, handleSubmit } = useForm();
  const [menus, setMenus] = useState([]);
  // const [data, setData] = useState([]);
  const [content, setContent] = useState("");     

  const [categoryError, setCategoryError] = useState("");
  const [loaderEnable, setLoaderEnable] = useState(false);


  // const [selectedOptions, setSelectedOptions] = useState([]);

  // const [selectedOptionsClientName, setSelectedOptionsClientName] = useState([]);
  const [companiesData, setCompaniesData] = useState([]);

  const [lookup, setLookUp] = useState({});


  const [showSessionPopupup, setShowSessionPopupup] = useState(false);


  const { popup, setShowPopup, handleClosePopup, initialData, Categories, categoryName, setCategoryName, categoryNameAdv, setCategoryNameAdv,initialCategoriesData1, setInitialCategoriesData1, hideMenu, setHideMenu, clientData1, searchPayload, setSearchPayload, contentAdvCount, setContentAdvCount, selectedOptions, setSelectedOptions, selectedOptionsClientName, setSelectedOptionsClientName, multiSelectFields, setMultiSelectFields, activeFieldsObj, setActiveFieldsObj, setContentSearch,route, setRoute,setCurrentPage,setRowsPerPage,usePrevious,setData,GetTimeActivity} = useContext(contentContext)

  const prevRoute = usePrevious(route)
  useEffect(() => {
      if(prevRoute != undefined && prevRoute!=route){
          setCurrentPage(1)
          setRowsPerPage(15)
      }
  }, [prevRoute]);
  useEffect(() => {
    setRoute("content")
    Companies();
    // getCompanies().then((data) => {
    //   console.log("companies data", data);
    //   if (data.statusCode == 200) {
    //     if (data.result == "Invalid token or Expired") {
    //       setShowSessionPopupup(true)
    //     } else {
    //       setCompaniesData(data.result.data);
    //     }
    //   }
    // }).catch((error) => {
    //   console.log(error);
    // });
  }, []);

  const Companies = async (e) => {

    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")

  //  setcurrentPage(1);
   let obj = {sortby : 'companyname'}
    axios({
        method: 'POST',
        url: lambda + '/companies?appname=' + appname + "&token=" + token + "&userid=" + userid,
        data:obj
    })
        .then(function (response) {
            console.log("response", response.data.result.data);
            if (response.data.result == "Invalid token or Expired") {
                setShowSessionPopupup(true)
            } else {
              setCompaniesData(response.data.result.data);
            }
          }).catch((error) => {
            console.log(error);
          });
}

  // console.log('initialData',categoryName)
  // function onConfirm() {
  //   setSuccess(false)
  // };

  const returnArray = (arr) => {
    let arr2 = []
    arr.map((eachItem) => {
      arr2.push(eachItem.value)
    })
    // console.log(arr2)
    return arr2
  }

  const singleArray = (arr) => {
    let arr2 = []

    arr2.push(arr.value)

    // console.log(arr2)
    return arr2
  }


  const handleChange = (selected ) => {
   
    let selectedArray = returnArray(selected)

    console.log('selectedOptions', selectedOptions)


    setActiveFieldsObj({ CookingshowActive: false, seriesActive: false, SportsActive: false, MusicActive: false, LiveEventActive: false })

    if (selectedArray.length > 0) {

      selectedArray.forEach((eachItem) => {
        if (eachItem === 'LIFESTYLE') setActiveFieldsObj({ ...activeFieldsObj, CookingshowActive: true })
        if (eachItem === 'SPORTS') setActiveFieldsObj({ ...activeFieldsObj, SportsActive: true })
        if (eachItem === 'LIVE EVENTS') setActiveFieldsObj({ ...activeFieldsObj, LiveEventActive: true })
        if (eachItem === 'MUSIC') setActiveFieldsObj({ ...activeFieldsObj, MusicActive: true })
        if (eachItem === 'SERIES & TELENOVELAS') setActiveFieldsObj({ ...activeFieldsObj, seriesActive: true })
      })

    }

    searchPayload['category'] = selectedArray
    setCategoryError("")
    setSearchPayload({ ...searchPayload })
    setSelectedOptions(selected);
   
  };
  const handleMultiSelect = (selected, key) => {
    GetTimeActivity()
    let selectedArray = returnArray(selected)
    setMultiSelectFields({ ...searchPayload, [key]: selectedArray })
    setSearchPayload({ ...searchPayload, [key]: selectedArray })
  };
  useEffect(() => {
    if (Object.keys(searchPayload).length == 0) {
      const elements = document.getElementsByClassName('for-clear');
      for (let i = 0; i < elements.length; i++) {
        elements[i].value = '';
      }
      setMultiSelectFields([])
      // setSelectedOptions([])
    }
  }, [searchPayload]);

  console.log('searchPayload', searchPayload)

  const handleChangeClientName = (selected) => {
    GetTimeActivity()
    let selectedArray = singleArray(selected)
    searchPayload['companyid'] = selected.value
    setSearchPayload({ ...searchPayload })
    setSelectedOptionsClientName(selected);
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      history.push("/");
    }
    Categories();
    // GetLookUp();
    GetLookUp2();
    setInitialCategoriesData1([]);
  }, []);


console.log('multiSelectFields',multiSelectFields)
  const searchSubmit = async () => {
    GetTimeActivity()
    try {
      setLoaderEnable(true)

      if (activeFieldsObj.LiveEventActive ==  false && activeFieldsObj.MusicActive == false) {
        // console.log('!LiveEventActive && !MusicActive')
        if (searchPayload.hasOwnProperty('bandname')) delete searchPayload['bandname']
  
  
        if (searchPayload.hasOwnProperty('lyricist')) delete searchPayload['lyricist']
        if (searchPayload.hasOwnProperty('otherartists')) delete searchPayload['otherartists']
        if (searchPayload.hasOwnProperty('performancetype')) delete searchPayload['performancetype']
        if (searchPayload.hasOwnProperty('leadartist')) delete searchPayload['leadartist']
        if (searchPayload.hasOwnProperty('musicgenre')){
           delete searchPayload['musicgenre']
           setMultiSelectFields({...multiSelectFields,musicgenre:[]})
        }
      }
      if (activeFieldsObj.SportsActive == false && activeFieldsObj.LiveEventActive == false) {
        if (searchPayload.hasOwnProperty('sportsstars')) delete searchPayload['sportsstars']
        if (searchPayload.hasOwnProperty('sport')){
          setMultiSelectFields({...multiSelectFields,sport:[]})
          delete searchPayload['sport']
        }
      }
      if (activeFieldsObj.CookingshowActive == false) {
        if (searchPayload.hasOwnProperty('anchor')) delete searchPayload['anchor']
        if (searchPayload.hasOwnProperty('chef')) delete searchPayload['chef']
        if (searchPayload.hasOwnProperty('cuisine')){
          setMultiSelectFields({...multiSelectFields,cuisine:[]})
          delete searchPayload['cuisine']
        } 
        if (searchPayload.hasOwnProperty('mealtype')) delete searchPayload['mealtype']
      }
      if (activeFieldsObj.SportsActive == false) {
        if (searchPayload.hasOwnProperty('league_tournament')) delete searchPayload['league_tournament']
      }
    
      if (activeFieldsObj.seriesActive == false) {
        if (searchPayload.hasOwnProperty('noofepisodes')) delete searchPayload['noofepisodes']
      }
      if (searchPayload.hasOwnProperty('status')){
        if(searchPayload['status'] === ""){
           delete searchPayload['status']
        }
      }
      if (searchPayload.hasOwnProperty('featured')){
        if(searchPayload['featured'] === ""){
           delete searchPayload['featured']
        }
      }
      let arrayType = ["country", "genre", "videoformat", "resolution", "musicgenre", "rights", "cuisine", "sport", "certificate", "category", "typeofrights", "videoquality", "cast", "director", "countryorigin","territoriesavailable", "languages", "subtitleslanguages","dubbinglanguages"];
      var flag = true
      let isCategoryAvailable = searchPayload.hasOwnProperty('category')
      console.log('isCategoryAvailable', isCategoryAvailable)
     
      arrayType.forEach((eachItem) => {
        if (searchPayload.hasOwnProperty(eachItem)) {
          // console.log('eachiitemeemememme',eachItem)
          if (searchPayload[eachItem].length <= 0)
            delete searchPayload[eachItem]
        }
      })
      let arrayType2 = ["releaseyear", "bandname", "IMDBrating", "sportsstars", "title"];
      arrayType2.forEach((eachItem) => {
        if (searchPayload.hasOwnProperty(eachItem)) {
          if (searchPayload[eachItem] === "")
            delete searchPayload[eachItem]
        }
      })

    
      const updatedObject = Object.fromEntries(
        Object.entries(searchPayload).filter(([_, value]) => {
          if (Array.isArray(value)) {
            return value[0] !== '';
          } else {
            return value !== '';
          }
        })
      );
      setSearchPayload(updatedObject)


      const response = await tmdbApi.filterCategory(updatedObject);

      console.log("searchPayload response", response.result);
      if (response.result == "Invalid token or Expired") {
        setShowSessionPopupup(true)
      } else {
        let data = response.result && response.result.data && response.result.data.length > 0 ? response.result.data : []

        setInitialCategoriesData1(data);
        setContentAdvCount(response.result.totalContent);
        setShowPopup(false);
        setContentSearch("");
        props.onData(updatedObject);
        setCurrentPage(1)
        setRowsPerPage(15)
        if(data.length<=0){
          setData(data)
        }
      }
      setLoaderEnable(false)
    }
    catch {
      setLoaderEnable(false)
      console.log("error");
    }
  }



  const onChangeSearch = (e) => {

    if (e.target.name === "featured" || e.target.name === "videoAvailable") {
      if (e.target.value === "true") {
        setSearchPayload({ ...searchPayload, [e.target.name]: true })
      } else if(e.target.value === "false") {
        setSearchPayload({ ...searchPayload, [e.target.name]: false })
      }
      else{
        setSearchPayload({ ...searchPayload, [e.target.name]: e.target.value })
      }

    }
    else if (e.target.name === "releaseyear") {
      const regex = /^[0-9\b]+$/;
      if (e.target.value === "" || regex.test(e.target.value)) {
        setSearchPayload({ ...searchPayload, [e.target.name]: e.target.value })
      }


    } else if (e.target.name === "status") {
      if(e.target.value==""){
        if(searchPayload.hasOwnProperty['status']) delete searchPayload["status"]
      }
      setSearchPayload({ ...searchPayload, [e.target.name]: [e.target.value] })
    }
    else {
      searchPayload[e.target.name] = e.target.value
      setSearchPayload({ ...searchPayload })
    }

    
  };




 
  const clearSearch = () => {
    GetTimeActivity()
    setSelectedOptions([])
    setMultiSelectFields({ dubbinglanguages: [], typeofrights: [], countryorigin: [], languages: [], typeofrights: [], genre: [], videoquality: [], certificate: [], subtitleslanguages: [], territoriesavailable: [], sport: [], musicgenre: [] })
    setActiveFieldsObj({ CookingshowActive: false, seriesActive: false, SportsActive: false, LiveEventActive: false, MusicActive: false })
    setSelectedOptionsClientName([])
    setSearchPayload({featured:"",
    title:"",
    releaseyear:"",
    IMDBrating:"",
    cast:"",
    director:"",
    status:"",})
    setSearchPayload({})
  }
  const GetLookUp2 = async (e) => {
    try {
      let arrayType = ["country", "territories", "genre", "videoformat", "resolution", "musicgenre", "rights", "cuisine", "sports", "certificate", "language"];

      const response = await tmdbApi.getLookUp({
        type: arrayType

      });
      console.log(response);
      if (response.statusCode == 200) {
        let arrayType = ["country", "territories", "genre", "videoformat", "resolution", "musicgenre", "rights", "cuisine", "sports", "certificate", "language"];

        let lookupsData = response.result.data || []

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
        console.log('lookup', lookup)

      }

    } catch {
      console.log("error");
    }
  }

  // console.log("ssssss", searchPayload);
  console.log('lookup', lookup)
  return (
    <>
      {showSessionPopupup && <SessionPopup />}



      <div className="left-block adv_search">
        {/* <div className="adv_header">
           <h6>
             <span className="material-symbols-outlined">search</span>
             Advanced Search{" "}
           </h6>
         </div> */}
        <div className="adv_body">
          <div className="adv_body-inner">
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="example-text-input" className="col-form-label">category<span>*</span></label>
                  <Select isMulti={true}
                    // classNamePrefix="select category"
                    placeholder='Category'
                    onChange={handleChange}
                    options={categoryNameAdv}
                    value={selectedOptions}
                  />
                  <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{categoryError}</span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="example-text-input" className="col-form-label">TItle</label>
                  <input
                    type="text"
                    className="form-control for-clear"
                    id="example-email-input"
                    name="title"
                    placeholder="Title"
                    value={searchPayload && searchPayload.title}
                    onChange={(e) => onChangeSearch(e)}

                  />

                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="form-label form-label">Company Name</label>
                  <Select
                    isMulti={false}
                    placeholder='Select Company name'
                    onChange={handleChangeClientName}
                    options={companiesData && companiesData.map((eachItem) => { return { value: eachItem.companyid, label: eachItem.companyname } })}
                    value={selectedOptionsClientName}
                  />

                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="example-text-input" className="col-form-label">country of origin</label>

                  <Select isMulti={true}

                    placeholder='Country of origin'
                    id="countryorigin"
                    className="mul-cls"
                    onChange={(e) => handleMultiSelect(e, "countryorigin")}
                    options={lookup.country && lookup.country.map((eachItem) => { return { value: eachItem, label: eachItem }; })}
                    value={multiSelectFields && multiSelectFields.countryorigin && multiSelectFields.countryorigin.length > 0 ? multiSelectFields.countryorigin?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                  />

                </div>
              </div>
              {/* <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="example-text-input" className="col-form-label">country</label>
                 
                  <Select isMulti={true}

                    placeholder='Country'
                    id="country"
                    className="mul-cls"
                    onChange={(e) => handleMultiSelect(e, "country")}
                    options={lookup.country && lookup.country.map((eachItem) => { return { value: eachItem, label: eachItem }; })}
                    value={multiSelectFields && multiSelectFields.countryorigin && multiSelectFields.countryorigin.length > 0 ? multiSelectFields.country?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                  />
                </div>
              </div> */}
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="example-text-input" className="col-form-label">Dubbing Languages</label>

                  <Select isMulti={true}
                    placeholder='Dubbing Languages'
                    className="mul-cls"
                    id='mul2'
                    onChange={(e) => handleMultiSelect(e, "dubbinglanguages")}
                    options={lookup.language && lookup.language.map((eachItem) => { return { value: eachItem, label: eachItem }; })}
                    value={multiSelectFields && multiSelectFields.dubbinglanguages && multiSelectFields.dubbinglanguages.length > 0 ? multiSelectFields.dubbinglanguages?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}

                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="example-text-input" className="col-form-label">Languages</label>

                  <Select isMulti={true}

                    placeholder='Languages'
                    onChange={(e) => handleMultiSelect(e, "languages")}
                    options={lookup.language && lookup.language.map((eachItem) => { return { value: eachItem, label: eachItem }; })}
                    value={multiSelectFields && multiSelectFields.languages && multiSelectFields.languages.length > 0 ? multiSelectFields.languages?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="example-text-input" className="col-form-label">Types Of Rights</label>

                  <Select isMulti={true}
                    placeholder='Types of rights'
                    onChange={(e) => handleMultiSelect(e, "typeofrights")}
                    options={lookup.rights && lookup.rights.map((eachItem) => { return { value: eachItem, label: eachItem }; })}
                    value={multiSelectFields && multiSelectFields.typeofrights && multiSelectFields.typeofrights.length > 0 ? multiSelectFields.typeofrights?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []} />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="example-text-input" className="col-form-label"> Genre</label>
                  <Select isMulti={true}
                    placeholder='Genre'
                    onChange={(e) => handleMultiSelect(e, "genre")}
                    options={lookup.genre && lookup.genre.map((eachItem) => { return { value: eachItem, label: eachItem }; })}
                    value={multiSelectFields && multiSelectFields.genre && multiSelectFields.genre.length > 0 ? multiSelectFields.genre?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []} />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="example-text-input" className="col-form-label">Video Quality</label>

                  <Select isMulti={true}
                    placeholder='Video quality'
                    onChange={(e) => handleMultiSelect(e, "videoquality")}
                    options={lookup.videoformat && lookup.videoformat.map((eachItem) => { return { value: eachItem, label: eachItem }; })}
                    value={multiSelectFields && multiSelectFields.videoquality && multiSelectFields.videoquality.length > 0 ? multiSelectFields.videoquality?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                  />
                </div>
              </div>
              {/* <div className="col-md-4">

                <div className="form-group">
                  <label htmlFor="example-text-input" className="col-form-label">Resolution</label>

                  <Select isMulti={true}
                    placeholder='Resolution'
                    onChange={handleChangeresolution}
                    options={resolutionData}
                    value={selectedOptionsresolution}
                  />
                </div>
              </div> */}
              <div className="col-md-4">



                <div className="form-group">
                  <label htmlFor="example-text-input" className="col-form-label">Certificate</label>

                  <Select isMulti={true}
                    placeholder='Certificate'
                    onChange={(e) => handleMultiSelect(e, "certificate")}
                    options={lookup.certificate && lookup.certificate.map((eachItem) => { return { value: eachItem, label: eachItem }; })}
                    value={multiSelectFields && multiSelectFields.certificate && multiSelectFields.certificate.length > 0 ? multiSelectFields.certificate?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                  />
                </div>
              </div>
              <div className="col-md-4">


                <div className="form-group">
                  <label htmlFor="example-text-input" className="col-form-label">Territories Available</label>
                  <Select isMulti={true}
                    placeholder='Territories Available'
                    onChange={(e) => handleMultiSelect(e, "territoriesavailable")}
                    options={lookup && lookup.territories && lookup.territories.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                    value={multiSelectFields && multiSelectFields.territoriesavailable && multiSelectFields.territoriesavailable.length > 0 ? multiSelectFields.territoriesavailable?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                  />


                </div>
              </div>
              <div className="col-md-4">

                <div className="form-group">
                  <label htmlFor="example-text-input" className="col-form-label">Subtitle Languages</label>

                  <Select isMulti={true}
                    placeholder='Subtitles languages'
                    onChange={(e) => handleMultiSelect(e, "subtitleslanguages")}
                    options={lookup.language && lookup.language.map((eachItem) => { return { value: eachItem, label: eachItem }; })}
                    value={multiSelectFields && multiSelectFields.subtitleslanguages && multiSelectFields.subtitleslanguages.length > 0 ? multiSelectFields.subtitleslanguages?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                  />

                </div>
              </div>
              <div className="col-md-4">

                <div className="form-group">
                  <label htmlFor="example-text-input" className="col-form-label">Release Year</label>
                  <div className="onwards">
                    <input
                      type="number"
                      className="form-control for-clear"
                      id="example-email-input"
                      placeholder="Release year"
                      name="releaseyear"
                      value={searchPayload && searchPayload.releaseyear}
                      onChange={(e) => onChangeSearch(e)}
                    />
                    <span>onwards</span>
                  </div>
                </div>
              </div>
              <div className="col-md-4">

                <div className="form-group">
                  <label htmlFor="example-text-input" className="col-form-label">IMDB Rating</label>

                  <input
                    type="number"
                    className="form-control for-clear"
                    id="example-email-input"
                    placeholder="IMDB Rating"
                    name="IMDBrating"
                    value={searchPayload && searchPayload.IMDBrating}
                    onChange={(e) => onChangeSearch(e)}
                  />

                </div>
              </div>
              <div className="col-md-4">

                <div className="form-group">
                  <label htmlFor="example-text-input" className="col-form-label">Cast</label>

                  <input
                    type="text"
                    className="form-control for-clear"
                    id="example-email-input"
                    placeholder="Cast"
                    name="cast"
                    value={searchPayload && searchPayload.cast}

                    onChange={(e) => onChangeSearch(e)}
                  />

                </div>
              </div>
              <div className="col-md-4">

                <div className="form-group">
                  <label htmlFor="example-text-input" className="col-form-label">Director</label>

                  <input
                    type="text"
                    className="form-control for-clear"
                    id="example-email-input"
                    placeholder="Director"
                    name="director"
                    value={searchPayload && searchPayload.director}
                    onChange={(e) => onChangeSearch(e)}
                  />

                </div>
              </div>






              {activeFieldsObj.CookingshowActive == true ? (<>

                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="example-text-input" className="col-form-label">Anchor</label>

                    <input
                      type="text"
                      className="form-control for-clear"
                      id="example-email-input"
                      placeholder="Anchor"
                      name="anchor"
                      value={searchPayload && searchPayload.anchor}

                      onChange={(e) => onChangeSearch(e)}
                    />

                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="example-text-input" className="col-form-label">Chef</label>

                    <input
                      type="text"
                      className="form-control for-clear"
                      id="example-email-input"
                      placeholder="Chef"
                      name="chef"
                      value={searchPayload && searchPayload.chef}

                      onChange={(e) => onChangeSearch(e)}
                    />

                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="example-text-input" className="col-form-label">Cuisine</label>

                    <Select isMulti={true}

                      placeholder='Cuisine'
                      onChange={(e) => handleMultiSelect(e, "cuisine")}
                      options={lookup.cuisine && lookup.cuisine && lookup.cuisine.map((eachItem) => { return { value: eachItem, label: eachItem }; })}
                      value={multiSelectFields && multiSelectFields.cuisine && multiSelectFields.cuisine.length > 0 ? multiSelectFields.cuisine?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="example-text-input" className="col-form-label">Meal Type</label>

                    <input
                      type="text"
                      className="form-control for-clear"
                      id="example-email-input"
                      placeholder="Meal Type"
                      name="mealtype"
                      value={searchPayload && searchPayload.mealtype}

                      onChange={(e) => onChangeSearch(e)}
                    />

                  </div>
                </div>
              </>) : null}
              {activeFieldsObj.SportsActive == true ? (
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="example-text-input" className="col-form-label"> League/Tournament</label>

                    <input
                      type="text"
                      className="form-control for-clear"
                      id="example-email-input"
                      placeholder="League/Tournament"
                      name="league_tournament"
                      value={searchPayload && searchPayload.league_tournament}

                      onChange={(e) => onChangeSearch(e)}
                    />
                  </div>
                </div>
              ) : null}
              {activeFieldsObj.SportsActive == true || activeFieldsObj.LiveEventActive == true ? (<>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="example-text-input" className="col-form-label"> Sports Stars</label>

                    <input
                      type="text"
                      className="form-control for-clear"
                      id="example-email-input"
                      placeholder="Sports Stars"
                      name="sportsstars"
                      value={searchPayload && searchPayload.sportsstars}

                      onChange={(e) => onChangeSearch(e)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="example-text-input" className="col-form-label">Sports</label>

                    <Select isMulti={true}

                      placeholder='Sports'
                      onChange={(e) => handleMultiSelect(e, "sport")}
                      options={lookup.sports && lookup.sports.map((eachItem) => { return { value: eachItem, label: eachItem }; })}
                      value={multiSelectFields && multiSelectFields.sport && multiSelectFields.sport.length > 0 ? multiSelectFields.sport?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                    />
                  </div>
                </div>
              </>) : null}
              {activeFieldsObj.LiveEventActive == true || activeFieldsObj.MusicActive == true ? (<>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="example-text-input" className="col-form-label">Band Name</label>

                    <input
                      type="text"
                      className="form-control for-clear"
                      id="example-email-input"
                      placeholder="Band Name"
                      name="bandname"
                      value={searchPayload && searchPayload.bandname}

                      onChange={(e) => onChangeSearch(e)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="example-text-input" className="col-form-label">Lyricist</label>

                    <input
                      type="text"
                      className="form-control for-clear"
                      id="example-email-input"
                      placeholder="Lyricist"
                      name="lyricist"
                      value={searchPayload && searchPayload.lyricist}

                      onChange={(e) => onChangeSearch(e)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="example-text-input" className="col-form-label">Music genre</label>

                    <Select isMulti={true}

                      placeholder='Music genre'
                      onChange={(e) => handleMultiSelect(e, "musicgenre")}
                      options={lookup.musicgenre && lookup.musicgenre.map((eachItem) => { return { value: eachItem, label: eachItem }; })}
                      value={multiSelectFields && multiSelectFields.musicgenre && multiSelectFields.musicgenre.length > 0 ? multiSelectFields.musicgenre?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="example-text-input" className="col-form-label">Other Artists</label>


                    <input
                      type="text"
                      className="form-control for-clear"
                      id="example-email-input"
                      placeholder="Other Artists"
                      name="otherartists"
                      value={searchPayload && searchPayload.otherartists}

                      onChange={(e) => onChangeSearch(e)}
                    />


                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="example-text-input" className="col-form-label">Performance Type</label>

                    <input
                      type="text"
                      className="form-control for-clear"
                      id="example-email-input"
                      placeholder="Performance Type"
                      name="performancetype"
                      value={searchPayload && searchPayload.performancetype}

                      onChange={(e) => onChangeSearch(e)}
                    />


                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="example-text-input" className="col-form-label">Lead Artist</label>

                    <input
                      type="text"
                      className="form-control for-clear"
                      id="example-email-input"
                      placeholder="Lead Artist"
                      name="leadartist"
                      value={searchPayload && searchPayload.leadartist}

                      onChange={(e) => onChangeSearch(e)}
                    />

                  </div>
                </div>
              </>) : null}
              {activeFieldsObj.seriesActive  == true ?(
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="example-text-input" className="col-form-label">Number Of Episodes</label>

                    <input
                      type="text"
                      className="form-control for-clear"
                      id="example-email-input"
                      placeholder="Number Of Episodes"
                      name="noofepisodes"
                      value={searchPayload && searchPayload.noofepisodes}

                      onChange={(e) => onChangeSearch(e)}
                    />

                  </div>
                </div>
              ) : null}
                            <div className="col-md-4">
                <div className="form-group">
                  <label className="form-label form-label">Featured</label>
                  <select className="form-select" value={searchPayload.featured === true ||  searchPayload.featured === false? searchPayload.featured : ""} placeholder="Featured" name="featured" onChange={(e) => onChangeSearch(e)} >
                  <option value="">Select</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                   
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="form-label form-label">STATUS</label>
                  <select className="form-select" placeholder="Status" name="status" value={searchPayload && searchPayload.status?searchPayload.status :""} onChange={(e) => onChangeSearch(e)}>
                    <option value="">Select</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="INPROGRESS">IN PROGRESS</option>
                  <option value="OFFLINE">OFFLINE</option>
                  
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="form-label form-label">Video Available</label>
                  <select className="form-select" placeholder="Status" name="videoAvailable" value={searchPayload.videoAvailable === true ||  searchPayload.videoAvailable === false? searchPayload.videoAvailable : ""}  onChange={(e) => onChangeSearch(e)}>
                  <option value="">Select</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
              
                  
                  </select>

                </div>
              </div>





            </div>
          </div>
        </div>

        <div className="adv_footer">

  
          <button className="fill_btn yellow-gradient reset-btn" onClick={clearSearch}><span className="material-icons-outlined">sync</span>Reset</button>
                                

          <button className={`fill_btn yellow-gradient float-end ${Object.keys(searchPayload).length == 0 ? "disable" : ""}`} disabled={Object.keys(searchPayload).length == 0} onClick={searchSubmit}>
          {   loaderEnable ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon"/>) : null}SEARCH
          </button>

          <div className="clearfix"></div>
        </div>
      </div >
      {/* <SweetAlert show={success}
         custom
         confirmBtnText="Close"
         confirmBtnBsStyle="primary"
         title={"You are not eligible to view this content.Please contact administrator"}
         onConfirm={e => onConfirm()}
       >
       </SweetAlert> */}

    </>
  );
};

export default AdvanceSearch;
