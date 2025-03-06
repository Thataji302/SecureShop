/***
**Module Name: add user
 **File Name :  adduser.js
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
 **Description : contains add user details.
 ***/
import React, { useState, useEffect ,useContext} from "react";
import Footer from "../../components/dashboard/footer";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import tmdbApi from "../../api/tmdbApi";
import SweetAlert from 'react-bootstrap-sweetalert';
import moment from "moment";

import { useHistory, Link } from "react-router-dom";
import { contentContext } from "../../context/contentContext";
import axios from 'axios';
let { appname,lambda, country } = window.app;


const AddUser = () => {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [type, setType] = useState("");
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [typeError, setTypeError] = useState('');
    const [success, setSuccess] = useState(false);
    const [values, setValues] = useState('IND');
    const [countries, setCountries] = useState('');

    const {route, setRoute,setCurrentPage,setRowsPerPage,usePrevious,setActiveMenuId,GetTimeActivity} = useContext(contentContext);

    const prevRoute = usePrevious(route)
    useEffect(() => {
        if(prevRoute != undefined && prevRoute!=route){
            setCurrentPage(1)
            setRowsPerPage(15)
        }
    }, [prevRoute]);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        setActiveMenuId(200005)
        setRoute("user")
        GetCountries();
        userActivity();
    }, []);
    const userActivity = () => {
        let path = window.location.pathname.split("/");
        const pageName = path[path.length - 2];
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
    const handleBack = (e) => {
        GetTimeActivity()   
        history.push("/usermanagement");
    }
    const checkInput = (e) => {
        const onlyDigits = e.target.value.replace(/\D/g, "");
        setNumber(onlyDigits);

    };

    const handleAddUser = (e) => {
        GetTimeActivity()   
        const isValid = formvalidation();
        if (isValid) {
            createuser();
        }
    }
    function formvalidation() {
        GetTimeActivity()   
        let formIsValid = true;
        const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
        if (regEx.test(email)) {
            setEmailError("");
            setTimeout(function () { setEmailError("") }, 2000)
        } else if (!regEx.test(email) && email !== "") {
            setEmailError("Invalid Email");
            setTimeout(function () { setEmailError("") }, 2000)
            formIsValid = false;
        }

        if (name == "") {
            setNameError("Please enter Name");
            setTimeout(function () { setNameError("") }, 3000);
            formIsValid = false;
        }

        if (type == "") {
            setTypeError("Please select Type");
            setTimeout(function () { setTypeError("") }, 3000);
            formIsValid = false;
        }

        if (email == "") {
            setEmailError("Please enter Email");
            setTimeout(function () { setEmailError("") }, 3000);
            formIsValid = false;
        }

        return formIsValid;
    }


    const GetCountries = async () => {
        
        try {
            console.log(tmdbApi);
            const response = await tmdbApi.getLookUp({
                "type": ["country"],
                "sortBy":"alpha3",
                "projection":"tiny"
            });

            console.log(response.result);
            setCountries(response.result.data);
        } catch {
            console.log("error");
        }
    };

    const createuser = async () => {
        GetTimeActivity()   
        try {
            const response = await tmdbApi.Adduser({
                "emailid": email,
                "userType": type,
                "name": name,
                "idc": values,
                "phone": number,
                "status": "PENDING REGISTRATION"
            });
            console.log(response);
            // if (response.statusCode == 200) {
            setSuccess(true);
            //  }
        } catch {
            console.log("error");
        }
    };
    

    function onConfirm() {
        GetTimeActivity()   
        setSuccess(false);
    };

    const handleBread = () => {
        GetTimeActivity()   
        history.push("/usermanagement")
    }
    return (
        <>

            <div id="layout-wrapper">
                <Header />
                <Sidebar />

                <div className="main-content user-management create-user">

                    <div className="page-content ">
                        <div className="container-fluid">



                            <div className="row mb-4 breadcrumb">
                                <div className="col-lg-12">
                                    <div className="d-flex align-items-center">

                                        <div className="flex-grow-1">
                                            <h4 className="mb-2 card-title">Create User</h4>
                                            <p className="menu-path"><span onClick={handleBread}>User Management</span> / <b>Create User</b></p>

                                        </div>
                                        <div>
                                            <a onClick={handleBack} className="btn btn-primary">back</a>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="create-user-block">
                                <div className="form-block">
                                    <div className="row">
                                        <div className="col-md-6">
                                        <div className="col-md-12">
                                            <div className="mb-3 input-field">
                                                <label className="form-label form-label">NAME<span className="required">*</span></label>
                                                <input id="email" name="email" placeholder="Enter Your Name" type="text" className="form-control form-control" aria-invalid="false" onChange={(e) => setName(e.target.value)} value={name} />
                                                <span className="errormsg" style={{
                                                    fontWeight: 'bold',
                                                    color: 'red',
                                                }}>{nameError}</span>
                                            </div>
                                            </div>

                                            <div className="col-md-12">
                                                <div className="mb-3 input-field">
                                                    <label className="form-label form-label">USER TYPE<span className="required">*</span></label>
                                                    <select name="countryCodeAlpha2" className="colorselect capitalize form-control" onChange={(e) => setType(e.target.value)} value={type}>
                                                        <option value="">Select User Type</option>
                                                        <option value="ADMIN">Admin</option>
                                                        <option value="CONTENTMANAGER">Content Manager</option>
                                                        <option value="ACCOUNTMANAGER">Account Manager</option>
                                                        <option value="MANAGER">Manager</option>
                                                    </select>
                                                    <span className="material-icons dropdown-icon">expand_more</span>
                                                    <span className="errormsg" style={{
                                                        fontWeight: 'bold',
                                                        color: 'red',
                                                    }}>{typeError}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="mb-3 input-field">
                                                    <label className="form-label form-label">E MAIL ID<span className="required">*</span></label>
                                                    <input id="email" name="email" placeholder="Enter Your Email" type="email" className="form-control form-control" aria-invalid="false" onChange={(e) => setEmail(e.target.value)} value={email} />
                                                </div>
                                                <span className="errormsg" style={{
                                                    fontWeight: 'bold',
                                                    color: 'red',
                                                }}>{emailError}</span>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="mb-3 input-field">
                                                    <label className="form-label form-label">CONTACT NUMBER</label>
                                                    {/* <input id="email" name="email" placeholder="Enter Your Number" type="email" className="form-control form-control" aria-invalid="false" onChange={e => checkInput(e)} value={number} /> */}
                                                    <div className="country-code">
                                                        <select name="countryCodeAlpha2" value={values} className="colorselect capitalize" onChange={(e) => setValues(e.target.value)}>
                                                            <option value="91">IND(+91)</option>
                                                            {countries && countries.length > 0 && countries.map((task, i) => {
                                                                return (
                                                                    <><option key={i} value={task.alpha3}>{task.alpha3 + task.countrycode}</option></>
                                                                )
                                                            }
                                                            )}
                                                        </select>

                                                        <input className="form-control contact-number" type="tel" name="personalphone" value={number} placeholder="Enter Phone Number" onChange={e => checkInput(e)} maxLength="10" id="example-tel-input" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 permission-block">
                                            <div className="table-responsive">
                                                <table className="table align-middle table-nowrap table-check">
                                                    <thead>
                                                        <tr>

                                                            <th className="align-middle"><div className="d-flex"><span className="material-icons-outlined"> vpn_lock</span>PERMISSIONS</div></th>
                                                            <th className="align-middle"><div className="d-flex">
                                                                {/* <input type="checkbox" className="form-check-input" id="customControlInline" />Display</div> */}
                                                                <p>DISPLAY</p></div>
                                                                </th>
                                                            <th className="align-middle"><div className="d-flex">
                                                                {/* <input type="checkbox" className="form-check-input" id="customControlInline" />Enable</div> */}
                                                                <p>ENABLE</p></div>
                                                                </th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="align-middle">CONTENT MANAGEMENT</td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">chevron_right</span>Import</div></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">chevron_right</span>Export</div></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">chevron_right</span>Edit</div></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">chevron_right</span>View</div></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                    </tbody>
                                                    <tbody>
                                                        <tr>
                                                            <td className="align-middle">DEAL MANAGEMENT</td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">chevron_right</span>Add</div></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">chevron_right</span>Edit</div></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">chevron_right</span>View</div></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                    </tbody>
                                                    <tbody>
                                                        <tr>
                                                            <td className="align-middle">CLIENT MANAGEMENT</td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">chevron_right</span>Clients</div></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                        <tr className="arrow-right">
                                                            <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">arrow_right</span>Add</div></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                        <tr className="arrow-right">
                                                            <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined ">arrow_right</span>Edit</div></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                        <tr className="arrow-right">
                                                            <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">arrow_right</span>View</div></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">chevron_right</span>Company</div></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                        <tr className="arrow-right">
                                                            <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">arrow_right</span>Add</div></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                        <tr className="arrow-right">
                                                            <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined ">arrow_right</span>Edit</div></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                        <tr className="arrow-right reports">
                                                            <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">arrow_right</span>View</div></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                    </tbody>
                                                    <tbody>
                                                        <tr>
                                                            <td className="align-middle">REPORTS</td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">chevron_right</span>Clients Search</div></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                        <tr className="arrow-right">
                                                            <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">arrow_right</span>View</div></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">chevron_right</span>Recommend</div></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                        <tr className="arrow-right reports">
                                                            <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">arrow_right</span>View</div></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                    </tbody>
                                                    <tbody>
                                                        <tr>
                                                            <td className="align-middle">BLOCK BUYER</td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">chevron_right</span>Add</div></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">chevron_right</span>Edit</div></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">chevron_right</span>View</div></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" /></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="permission-block">
                                <p className="d-flex align-items-center permissions">Permissions<span className="material-icons-outlined"> vpn_lock</span></p>
                                    <div className="d-flex">
                                        <div className="check-list-block">
                                            <p>CONTENT MANAGEMENT</p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">All</label>
                                            </p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">Create</label>
                                            </p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">View</label>
                                            </p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">Edit</label>
                                            </p>
                                        </div>
                                        <div className="check-list-block">
                                            <p>DEAL MANAGEMENT</p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">All</label>
                                            </p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">Create</label>
                                            </p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">View</label>
                                            </p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">Edit</label>
                                            </p>
                                        </div>
                                        <div className="check-list-block">
                                            <p>CLIENT MANAGEMENT</p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">All</label>
                                            </p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">Create</label>
                                            </p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">View</label>
                                            </p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">Edit</label>
                                            </p>
                                        </div>
                                        <div className="check-list-block">
                                            <p>USER MANAGEMENT</p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">All</label>
                                            </p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">Create</label>
                                            </p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">View</label>
                                            </p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">Edit</label>
                                            </p>
                                        </div>
                                        <div className="check-list-block">
                                            <p>REPORTS</p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">All</label>
                                            </p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">Create</label>
                                            </p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">View</label>
                                            </p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">Edit</label>
                                            </p>
                                        </div>
                                        <div className="check-list-block">
                                            <p>CONTENT MANAGEMENT</p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">All</label>
                                            </p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">Create</label>
                                            </p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">View</label>
                                            </p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">Edit</label>
                                            </p>
                                        </div>
                                        <div className="check-list-block">
                                            <p>BLOCK BUYER</p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">All</label>
                                            </p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">Create</label>
                                            </p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">View</label>
                                            </p>
                                            <p className="form-check">
                                                <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                <label className="form-check-label" htmlFor="customControlInline">Edit</label>
                                            </p>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="row">
                                    <div className="col-md-12">
                                        <button className="btn btn-primary btn-block " type="submit" onClick={e => handleAddUser(e)}>Add User</button>
                                    </div>
                                </div>
                                <SweetAlert show={success}
                                    custom
                                    confirmBtnText="ok"
                                    confirmBtnBsStyle="primary"
                                    title={"Login Link sent successfully"}
                                    onConfirm={e => onConfirm()}
                                >
                                </SweetAlert>
                            </div>


                        </div>
                    </div>



                    <Footer />
                </div>


            </div>

        </>
    );
};

export default AddUser;
