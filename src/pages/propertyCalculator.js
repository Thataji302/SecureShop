/***
**Module Name: Header 
 **File Name :  Header.js
 **Project :    Orasi Media
 **Copyright(c) : X Platform Consulting.
 **Organization : Peafowl Inc
 **author :  chandrasekhar
 **author :  Hari
 **license :
 **version :  1.0.0
 **Created on :
 **Created on: Dec 27 2022
 **Last modified on: Dec 27 2022
 **Description : contains header component details.
 ***/
import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import Header from ".././components/header/Header";
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from 'axios';
import { formatCurrency } from '../utils/commonUtils.js';
// import * as Config from "./../../constants/Config";
let { lambda, appname } = window.app



const PropertyCalculator = (props) => {
    // const { pathname } = useLocation();
    // const headerRef = useRef(null);
    // const [scroll, setScroll] = useState(false);
    const history = useHistory();
    const [inputValue, setInputValue] = useState("");
    const [dayValue, setDayValue] = useState({ "average_eviction_days": 0, "average_rehab_days": 0, "average_listing_days": 0, "average_escrow_days": 0, });
    const [calculationValues, setCalculationValues] = useState({});
    const [addressData, setAddressData] = useState();
    const [addressDataValue, setAddressDataValue] = useState();
    const [success, setSuccess] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
    const [resultSuccess, setResultSuccess] = useState(false);
    useEffect(() => {
        if (localStorage.getItem("searchValueData")) {
            let name = localStorage.getItem("searchValueData");
            let splitValue = name.split(",")
          //  console.log('splitValue', splitValue)
            setAddressData(splitValue[0])
        }
        if (localStorage.getItem("searchData")) {
            let data = JSON.parse(localStorage.getItem("searchData"))
          //  console.log('data', data)
            setAddressDataValue(data)
        }
    }, []);
    // console.log("props", props.menus);
    // const active = headerNav.findIndex((e) => e.path === pathname);
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (value === '') {
            console.log('Input cleared');
        }
        setInputValue({
            ...inputValue,
            [name]: value
        });
        // inputCalculation()

    };
    const handleInputChange1 = (event) => {
        const { name, value } = event.target;
        if (value == '') {
            console.log('Input cleared');
            //value = 0
            // console.log("name", name)
            setDayValue({
                ...dayValue,
                [name]: 0
            });
        } else {
            // console.log("name", name)
            setDayValue({
                ...dayValue,
                [name]: value
            });
        }

        // inputCalculation()


    };
    // const reset = () => {
    //     console.log("reset1212112", inputValue)
    //     setInputValue({});
    //     console.log("reset", inputValue)
    //    // setCalculationValues({})

    // };
    const inputCalculation = () => {
       // console.log("inputValue", inputValue)
        if ((inputValue === "")) {
            console.log("inputValue1111", inputValue)
            setSuccess(true);
        }
         else {
            setOpenPopup(true)
          //  console.log("setOpenPopup", inputValue)
            let ar_value = parseInt(inputValue?.ar_value);
            let buyer_commission = parseFloat(inputValue?.buyer_commission);
            let seller_commission = parseFloat(inputValue?.seller_commission);
            let aslan_res_price = parseInt(inputValue?.aslan_res_price);
            let buy_transfer = parseFloat(inputValue?.buy_transfer);
            let sale_transfer = parseFloat(inputValue?.sale_transfer);
            let acqfee = parseFloat(inputValue?.acqfee);
            let developmentfee = parseFloat(inputValue?.developmentfee);
            let dispositionfee = parseFloat(inputValue?.dispositionfee);
            let escrow = parseFloat(inputValue?.escrow);
            let title = parseFloat(inputValue?.title);
            let sr_debt = parseInt(inputValue?.sr_debt);
            let srdebt_intrate = parseFloat(inputValue?.srdebt_intrate);
            let insurance = parseFloat(inputValue?.insurance);
            var assum_hold_days = parseFloat(inputValue?.average_eviction_days) + parseFloat(inputValue?.average_rehab_days) + parseFloat(inputValue?.average_listing_days) + parseFloat(inputValue?.average_escrow_days);
            let total_assum_hold = assum_hold_days;
            let hold_property_tax = parseFloat(inputValue?.hold_property_tax);
            let utility = parseInt(inputValue?.utility);
            let hoa_hold = parseInt(inputValue?.hoa_hold);
            let profit_margin = parseInt(inputValue?.profit_margin);
            let master_inv_price = parseInt(inputValue?.master_inv_price);
            // console.log('ar_value', ar_value)
            // console.log('buyer_commission', buyer_commission)
            var buyer_sales_comm_new_calc = ((ar_value) * (buyer_commission)) / 100;
            var seller_sales_comm_new_calc = ((ar_value) * (seller_commission)) / 100;
            var buy_transfer_new_calc = ((aslan_res_price) * (buy_transfer)) / 100;
            var sale_transferr_new_calc = ((((ar_value) * (sale_transfer)) / 100) + 50);
            var acqfee_new_calc = (((aslan_res_price) * (acqfee)) / 100);
            var developmentfee_new_calc = (((aslan_res_price) * (developmentfee)) / 100);
            var dispositionfee_new_calc = (((ar_value) * (dispositionfee)) / 100);
            var escrow_new_calc = ((ar_value) * (escrow)) / 100;
            var title_new_calc = ((ar_value) * (title)) / 100;
            var srdebt_intrate_calc = (((sr_debt) * (srdebt_intrate) / 100 * 100) / 100);
            var insturance_calc = (insurance) * (assum_hold_days / 30);
            var hold_property_tax_calc = (((total_assum_hold) * (hold_property_tax / 365) * (ar_value)));
            var utility_calc = (utility) * (assum_hold_days / 30);
            var hoa_hold_calc = ((hoa_hold) * (assum_hold_days / 30));

            let totalCosts = (buyer_sales_comm_new_calc) + (seller_sales_comm_new_calc) + (buy_transfer_new_calc) + (sale_transferr_new_calc) + (acqfee_new_calc) + (developmentfee_new_calc) + (dispositionfee_new_calc) + (escrow_new_calc) + (title_new_calc) + (insturance_calc) + (hold_property_tax_calc) + (utility_calc) + parseInt(inputValue?.warranty) + parseInt(inputValue?.locksmith) + (hoa_hold_calc) + (srdebt_intrate_calc) + parseInt(inputValue?.title_taxes_due_new) + (sr_debt) + parseInt(inputValue?.title_lien_amount) + parseInt(inputValue?.eviction_cashforkeys_new) + parseInt(inputValue?.estimated_rennovation_expense) + parseInt(inputValue?.misc);
            var proforma_profit_percent;
            var annual_proforma_profit;
            var master_inv_profit;
            var master_inv_profit_percent;
            var annual_master_inv_profit_percent;
            let roc = ((((((profit_margin) / 360) * total_assum_hold) * 100)) / 100);
            let annualized = profit_margin;
            let psf_new;
            let projected_profit;
            if (projected_profit > 0 && assum_hold_days > 0) {
                psf_new = (ar_value - projected_profit);
                psf_new = Math.round(psf_new)
            }
            else {
                psf_new = ar_value;
                psf_new = Math.round(psf_new)
            }
            if (assum_hold_days != "NaN" && psf_new != "NaN") {
                projected_profit = Math.max(0, Math.round((psf_new * roc) / 100));
              //  console.log('projected_profit projected_profit projected_profit', projected_profit)
            }

            if (projected_profit > 0) {
                psf_new = Math.max(0, Math.round((psf_new - projected_profit)));
              //  console.log('psf_new psf_new psf_new', psf_new)
            }
            var max_bid = (ar_value - projected_profit) - totalCosts;
            var proforma_profit = (ar_value - aslan_res_price - totalCosts);
            if (aslan_res_price != 0) {

                proforma_profit_percent = ((proforma_profit / aslan_res_price) * 100);
                proforma_profit_percent = Math.round(proforma_profit_percent * 100) / 100
            }
            else {
                proforma_profit_percent = 0
            }
            if (aslan_res_price != 0) {

                annual_proforma_profit = ((proforma_profit_percent * 360) / assum_hold_days);
                annual_proforma_profit = Math.round(annual_proforma_profit * 100) / 100;
            }
            else {
                annual_proforma_profit = 0;
            }
            if (master_inv_price != "" || master_inv_price != 'NULL') {
                master_inv_profit = (master_inv_price - totalCosts - aslan_res_price);
                master_inv_profit = Math.round(master_inv_profit)
            }
            else {
                master_inv_profit = 0;
            }
            if (aslan_res_price != 0) {
                master_inv_profit_percent = (master_inv_profit / aslan_res_price) * 100;
                master_inv_profit_percent = Math.round(master_inv_profit_percent * 100) / 100
            }
            else {
                master_inv_profit_percent = 0;
            }
            if (aslan_res_price != 0) {
                annual_master_inv_profit_percent = ((master_inv_profit_percent * 360) / assum_hold_days);
                annual_master_inv_profit_percent = Math.round(annual_master_inv_profit_percent * 100) / 100
            }
            else {
                annual_master_inv_profit_percent = 0;
            }
            let obj = {
                "buyer_sales_comm_new_calc": buyer_sales_comm_new_calc,
                "seller_sales_comm_new_calc": seller_sales_comm_new_calc,
                "buy_transfer_new_calc": buy_transfer_new_calc,
                "sale_transferr_new_calc": sale_transferr_new_calc,
                "acqfee_new_calc": acqfee_new_calc,
                "developmentfee_new_calc": developmentfee_new_calc,
                "dispositionfee_new_calc": dispositionfee_new_calc,
                "escrow_new_calc": escrow_new_calc,
                "title_new_calc": title_new_calc,
                "srdebt_intrate_calc": srdebt_intrate_calc,
                "insturance_calc": insturance_calc,
                "hold_property_tax_calc": hold_property_tax_calc,
                "utility_calc": utility_calc,
                "hoa_hold_calc": hoa_hold_calc,
                "total_assum_hold": total_assum_hold,
                "totalCosts": totalCosts,
                "max_bid": max_bid,
                "roc": roc,
                "annualized": annualized,
                "projected_profit": projected_profit,
                "psf_new": psf_new,
                "proforma_profit": proforma_profit,
                "proforma_profit_percent": proforma_profit_percent,
                "annual_proforma_profit": annual_proforma_profit,
                "master_inv_profit": master_inv_profit,
                "master_inv_profit_percent": master_inv_profit_percent,
                "annual_master_inv_profit_percent": annual_master_inv_profit_percent
            };
            // console.log('obj', obj)
            setCalculationValues(obj)
        }
    }
 //   console.log('calculation', calculationValues)
    const goBack = () => {
        history.goBack();
    }
    function onConfirm() {
        setOpenPopup(false)
        setSuccess(false)
        localStorage.removeItem("calculationValues");
        localStorage.removeItem("inputvalues");
    };
    function onConfirm1() {
        setResultSuccess(false)
        history.push("/dashboard");
    };
    const saveResults = () => {
        const token = localStorage.getItem("token");
        if (token) {
            setOpenPopup(false)
            const userid = localStorage.getItem("userId")
            let payload;
            payload = {
                "propertyName": addressData,
                "state": addressDataValue?.state,
                "city": addressDataValue?.city,
                "route": addressDataValue?.route,
                "postal_code": addressDataValue?.postal_code,
                "street_number": addressDataValue?.street_number,
                "locality": addressDataValue?.locality,
                "area": addressDataValue?.area,
                "image": addressDataValue?.image,
                "search": [calculationValues],
                "userid": userid
            };
            const urlLink = lambda + '/properties?appname=' + appname + "&token=" + token;
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        setResultSuccess(true)
                    }
                });
            localStorage.removeItem("calculationValues");
            localStorage.removeItem("inputvalues");
        }
        else {
            //console.log("calculationValues",calculationValues)
            let locData = JSON.stringify(calculationValues)
            let inputvalues = JSON.stringify(inputValue)
          //  console.log('locData', locData)
            localStorage.setItem("calculationValues", locData)
            localStorage.setItem("inputvalues", inputvalues)
            history.push("./login");
        }
    }
    var totalDays = parseFloat(dayValue?.average_eviction_days) + parseFloat(dayValue?.average_rehab_days) + parseFloat(dayValue?.average_listing_days) + parseFloat(dayValue?.average_escrow_days)
    return (

        <div className="property_calculator">
            <Header />
            <div className="estimate_calculator">
                <div className="container">
                    <div className="property_info">
                        <div className="info">
                            <div className="card-wrapper">
                                <div className="icon-box">
                                    <span className="material-symbols-outlined"> cottage </span>
                                </div>
                                <div className="card-info">
                                    <h6>Property Address</h6>
                                    <p>{addressData}, {addressDataValue?.state}, {addressDataValue?.city},{addressDataValue?.route}, {addressDataValue?.postal_code}</p>
                                </div>
                            </div>
                            <button type="button" className="back" onClick={goBack}><span className="material-symbols-outlined">chevron_left</span>back</button>
                        </div>
                    </div>
                    <div className="content_block">


                        <div className="right">
                            <div className="row">
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Margin %</label>
                                        <input className="form-control" type="number" name="profit_margin" placeholder="Enter Margin" id="example-email-input" value={inputValue?.profit_margin} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Rewize Value $</label>
                                        <input className="form-control" type="number" name="ar_value" placeholder="Enter Rewize Value" id="example-email-input" value={inputValue?.ar_value} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Published Bid / Listing Price $</label>
                                        <input className="form-control" type="number" name="list_price" placeholder="Enter Published Bid" id="example-email-input" value={inputValue?.list_price} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Master Inv. Price $</label>
                                        <input className="form-control" type="number" name="master_inv_price" placeholder="Enter Master Inv. Price" id="example-email-input" value={inputValue?.master_inv_price} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Rewize Res Price $</label>
                                        <input className="form-control" type="number" name="aslan_res_price" placeholder="Enter Rewize Res Price" id="example-email-input" value={inputValue?.aslan_res_price} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Buyer Sales Commission %</label>
                                        <input className="form-control" type="number" name="buyer_commission" placeholder="Enter Buyer Sales Commission" id="example-email-input" value={inputValue?.buyer_commission} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Seller Sales Commission %</label>
                                        <input className="form-control" type="number" name="seller_commission" placeholder="Enter Seller Sales Commission" id="example-email-input" value={inputValue?.seller_commission} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Buy Transfer Tax  %</label>
                                        <input className="form-control" type="number" name="buy_transfer" placeholder="Enter Buy Transfer" id="example-email-input" value={inputValue?.buy_transfer} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Sale Transfer Tax %</label>
                                        <input className="form-control" type="number" name="sale_transfer" placeholder="Enter Sale Transfer Tax" id="example-email-input" value={inputValue?.sale_transfer} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Acq. Fee %</label>
                                        <input className="form-control" type="number" name="acqfee" placeholder="Enter Acq. Fee" id="example-email-input" value={inputValue?.acqfee} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Development Fee %</label>
                                        <input className="form-control" type="number" name="developmentfee" placeholder="Enter Development Fee" id="example-email-input" value={inputValue?.developmentfee} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Disposition Fee %</label>
                                        <input className="form-control" type="number" name="dispositionfee" placeholder="Enter Disposition Fee" id="example-email-input" value={inputValue?.dispositionfee} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Escrow %</label>
                                        <input className="form-control" type="escrow" name="escrow" placeholder="Enter Escrow" id="example-email-input" value={inputValue?.escrow} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Title %</label>
                                        <input className="form-control" type="number" name="title" placeholder="Enter Title" id="example-email-input" value={inputValue?.title} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Insurance $</label>
                                        <input className="form-control" type="number" name="insurance" placeholder="Enter Insurance" id="example-email-input" value={inputValue?.insurance} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Hold Prop Taxes %</label>
                                        <input className="form-control" type="number" name="hold_property_tax" placeholder="Enter Hold Prop Taxes" id="example-email-input" value={inputValue?.hold_property_tax} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Hold Period Utilities $</label>
                                        <input className="form-control" type="number" name="utility" placeholder="Enter Hold Period Utilities" id="example-email-input" value={inputValue?.utility} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Buyer Home Warranty $</label>
                                        <input className="form-control" type="number" name="warranty" placeholder="Enter Buyer Home Warranty" id="example-email-input" value={inputValue?.warranty} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Locksmith $</label>
                                        <input className="form-control" type="number" name="locksmith" placeholder="Enter Locksmith" id="example-email-input" value={inputValue?.locksmith} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">HOA Hold $</label>
                                        <input className="form-control" type="number" name="hoa_hold" placeholder="Enter HOA Hold" id="example-email-input" value={inputValue?.hoa_hold} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Sr. Debt Interest $</label>
                                        <input className="form-control" type="number" name="srdebt_intrate" placeholder="Enter Sr. Debt Interest" id="example-email-input" value={inputValue?.srdebt_intrate} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Past Due Taxes $</label>
                                        <input className="form-control" type="number" name="title_taxes_due_new" placeholder="Enter Past Due Taxes" id="example-email-input" value={inputValue?.title_taxes_due_new} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Senior Debt $</label>
                                        <input className="form-control" type="number" name="sr_debt" placeholder="Enter Senior Debt" id="example-email-input" value={inputValue?.sr_debt} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Senior Liens $</label>
                                        <input className="form-control" type="number" name="title_lien_amount" placeholder="Enter Senior Liens" id="example-email-input" value={inputValue?.title_lien_amount} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Eviction ($4Keys/UD) $</label>
                                        <input className="form-control" type="number" name="eviction_cashforkeys_new" placeholder="Enter Eviction ($4Keys/UD)" id="example-email-input" value={inputValue?.eviction_cashforkeys_new} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Est. Renovations $</label>
                                        <input className="form-control" type="number" name="estimated_rennovation_expense" placeholder="Enter Est. Renovations" id="example-email-input" value={inputValue?.estimated_rennovation_expense} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Miscellaneous $</label>
                                        <input className="form-control" type="number" name="misc" placeholder="Enter Miscellaneous" id="example-email-input" value={inputValue?.misc} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="left">
                            <div className="header_block">
                                <h6>Default Days</h6>
                            </div>
                            <div className="form_block">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label for="example-text-input" className="col-form-label">Eviction days</label>
                                            <input className="form-control" type="number" name="average_eviction_days" placeholder="Enter Eviction days" id="example-email-input" value={inputValue?.average_eviction_days} onChange={handleInputChange1} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label for="example-text-input" className="col-form-label">Costs</label>
                                            <input className="form-control" type="number" name="eviction_cost" placeholder="Enter Costs" id="example-email-input" value={inputValue?.eviction_cost} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label for="example-text-input" className="col-form-label">Rehab days</label>
                                            <input className="form-control" type="number" name="average_rehab_days" placeholder="Enter Rehab days" id="example-email-input" value={inputValue?.average_rehab_days} onChange={handleInputChange1} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label for="example-text-input" className="col-form-label">Costs</label>
                                            <input className="form-control" type="number" name="renovation_cost" placeholder="Enter Costs" id="example-email-input" value={inputValue?.renovation_cost} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label for="example-text-input" className="col-form-label">Listing days</label>
                                            <input className="form-control" type="number" name="average_listing_days" placeholder="Enter Listing days" id="example-email-input" value={inputValue?.average_listing_days} onChange={handleInputChange1} />
                                        </div>
                                    </div>
                                    {/* <div className="col-md-6">
                                        <div className="form-group">
                                            <label for="example-text-input" className="col-form-label">Costs</label>
                                            <input className="form-control" type="number" name="title" placeholder="Enter" id="example-email-input" value={inputValue?.list_price} onChange={handleInputChange}/>
                                        </div>
                                    </div> */}
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label for="example-text-input" className="col-form-label">Escrow days</label>
                                            <input className="form-control" type="number" name="average_escrow_days" placeholder="Enter Escrow days" id="example-email-input" value={inputValue?.average_escrow_days} onChange={handleInputChange1} />
                                        </div>
                                    </div>
                                    {/* <div className="col-md-6">
                                        <div className="form-group">
                                            <label for="example-text-input" className="col-form-label">Costs</label>
                                            <input className="form-control" type="number" name="title" placeholder="Enter" id="example-email-input" value={inputValue?.list_price} onChange={handleInputChange}/>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                            <div className="total_block">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label for="example-text-input" className="col-form-label">Total</label>
                                            <input className="form-control disable" type="number" name="total_assum_hold" placeholder="Enter" id="example-email-input" value={totalDays} />
                                        </div>
                                    </div>
                                    {/* <div className="col-md-6">
                                        <div className="form-group">
                                            <label for="example-text-input" className="col-form-label"></label>
                                            <input className="form-control disable" type="number" name="title" id="example-email-input" value="10" />
                                        </div>
                                    </div> */}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="bottom_fixed">
                <div className="container">
                    <div className="d-flex align-items-center justify-content-center">
                        {/* <a href="#" className="reset  me-2" onClick={reset}>reset</a> */}
                        <button type="button" className="register" onClick={inputCalculation}><span className="material-symbols-outlined"> calculate </span>calculate</button>

                    </div>
                </div>
            </div>

            {openPopup &&
                <div className="custom_popup result_popup">
                    <div className="popup_content">
                        <div className="header">
                            <h5 className="title">results</h5><button type="button" className="pop_close" onClick={onConfirm}><span
                                className="material-symbols-outlined icon">close</span></button>
                        </div>
                        <div className="popup_body">
                            <div className="property_info">
                                <div className="info">
                                    <div className="card-wrapper">
                                        <div className="icon-box">
                                            <span className="material-symbols-outlined"> cottage </span>
                                        </div>
                                        <div className="card-info">
                                            <h6>Property Address</h6>
                                            <p>{addressData}, {addressDataValue?.state}, {addressDataValue?.city},{addressDataValue?.route}, {addressDataValue?.postal_code}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                            <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Max Bid/Offer $</label>
                                        <p>{calculationValues?.max_bid ? formatCurrency(calculationValues?.max_bid) : 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Profit % Required (ROC)</label>
                                        <p>{Math.round(calculationValues && (calculationValues?.roc)) + "%"}</p>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Annual ROC % Required</label>
                                        <p>{Math.round(calculationValues && (calculationValues?.annualized)) + "%"}</p>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Min. Gross Profit Required</label>
                                        <p>{calculationValues?.projected_profit ? formatCurrency(calculationValues?.projected_profit) : 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Cost Basis Required</label>
                                        <p>{calculationValues?.psf_new ? formatCurrency(calculationValues?.psf_new) : 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Pro-forma Profit</label>
                                        <p>{calculationValues?.proforma_profit ? formatCurrency(calculationValues?.proforma_profit) : 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Pro-forma Profit % of PP</label>
                                        <p>{calculationValues?.proforma_profit_percent + "%"}</p>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Annual Pro-forma Profit % of PP</label>
                                        <p>{calculationValues?.annual_proforma_profit + "%"}</p>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Master Inv. Profit</label>
                                        <p>{calculationValues?.master_inv_profit ? formatCurrency(calculationValues?.master_inv_profit) : 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Master Inv. Profit % of PP</label>
                                        <p>{calculationValues?.master_inv_profit_percent + "%"}</p>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Annual Master Inv. Profit % of PP</label>
                                        <p>{calculationValues?.annual_master_inv_profit_percent + "%"}</p>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Buyer Sales Commission</label>
                                        <div className="d-flex value_block">
                                            <div className="value">
                                                <p>{inputValue?.buyer_commission + "%"}</p>
                                            </div>
                                            <p>{calculationValues?.buyer_sales_comm_new_calc ? formatCurrency(calculationValues?.buyer_sales_comm_new_calc) : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Seller Sales Commission</label>
                                        <div className="d-flex value_block">
                                            <div className="value">
                                                <p>{inputValue?.seller_commission + "%"}</p>
                                            </div>
                                            <p>{calculationValues?.seller_sales_comm_new_calc ? formatCurrency(calculationValues?.seller_sales_comm_new_calc) : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Buy Transfer Tax</label>
                                        <div className="d-flex value_block">
                                            <div className="value">
                                                <p>{inputValue?.buy_transfer + "%"}</p>
                                            </div>
                                            <p>{calculationValues?.buy_transfer_new_calc ? formatCurrency(calculationValues?.buy_transfer_new_calc) : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Sale Transfer Tax</label>
                                        <div className="d-flex value_block">
                                            <div className="value">
                                                <p>{inputValue?.sale_transfer + "%"}</p>
                                            </div>
                                            <p>{calculationValues?.sale_transferr_new_calc ? formatCurrency(calculationValues?.sale_transferr_new_calc) : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Acq. Fee</label>
                                        <div className="d-flex value_block">
                                            <div className="value">
                                                <p>{inputValue?.acqfee + "%"}</p>
                                            </div>
                                            <p>{calculationValues?.acqfee_new_calc ? formatCurrency(calculationValues?.acqfee_new_calc) : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Development Fee</label>
                                        <div className="d-flex value_block">
                                            <div className="value">
                                                <p>{inputValue?.developmentfee + "%"}</p>
                                            </div>
                                            <p>{calculationValues?.developmentfee_new_calc ? formatCurrency(calculationValues?.developmentfee_new_calc) : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Disposition Fee</label>
                                        <div className="d-flex value_block">
                                            <div className="value">
                                                <p>{inputValue?.dispositionfee + "%"}</p>
                                            </div>
                                            <p>{calculationValues?.dispositionfee_new_calc ? formatCurrency(calculationValues?.dispositionfee_new_calc) : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Escrow</label>
                                        <div className="d-flex value_block">
                                            <div className="value">
                                                <p>{inputValue?.escrow + "%"}</p>
                                            </div>
                                            <p>{calculationValues?.escrow_new_calc ? formatCurrency(calculationValues?.escrow_new_calc) : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Title</label>
                                        <div className="d-flex value_block">
                                            <div className="value">
                                                <p>{inputValue?.title +"%"}</p>
                                            </div>
                                            <p>{calculationValues?.title_new_calc ? formatCurrency(calculationValues?.title_new_calc) : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Insurance</label>
                                        <div className="d-flex value_block">
                                            <div className="value">
                                                <p>{inputValue?.insurance ? formatCurrency(inputValue?.insurance) : 'N/A'}</p>
                                            </div>
                                            <p>{calculationValues?.insturance_calc ? formatCurrency(calculationValues?.insturance_calc) : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Hold Prop Taxes</label>
                                        <div className="d-flex value_block">
                                            <div className="value">
                                                <p>{inputValue?.hold_property_tax +"%"}</p>
                                            </div>
                                            <p>{calculationValues?.hold_property_tax_calc ? formatCurrency(calculationValues?.hold_property_tax_calc) : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Hold Period Utilities</label>
                                        <div className="d-flex value_block">
                                            <div className="value">
                                                <p>{inputValue?.utility ? formatCurrency(inputValue?.utility) : 'N/A'}</p>
                                            </div>
                                            <p>{calculationValues?.utility_calc ? formatCurrency(calculationValues?.utility_calc) : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">HOA Hold</label>
                                        <div className="d-flex value_block">
                                            <div className="value">
                                                <p>{inputValue?.hoa_hold ? formatCurrency(inputValue?.hoa_hold) : 'N/A'}</p>
                                            </div>
                                            <p>{calculationValues?.hoa_hold_calc ? formatCurrency(calculationValues?.hoa_hold_calc) : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Sr. Debt Interest</label>
                                        <div className="d-flex value_block">
                                            <div className="value">
                                                <p>{inputValue?.srdebt_intrate ? formatCurrency(inputValue?.srdebt_intrate) : 'N/A'}</p>
                                            </div>
                                            <p>{calculationValues?.srdebt_intrate_calc ? formatCurrency(calculationValues?.srdebt_intrate_calc) : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label for="example-text-input" className="col-form-label">Total Costs</label>
                                        <div className="d-flex value_block">
                                            {/* <div className="value">
                                                <p>{inputValue?.buyer_commission}</p>
                                            </div> */}
                                            <p>{calculationValues?.totalCosts ? formatCurrency(calculationValues?.totalCosts) : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="popup_footer">
                            <a href="#" className="reset  me-2" onClick={onConfirm}>Close</a>
                            <button className="register" onClick={e => saveResults(e)}><span className="material-symbols-outlined"> calculate </span>Save This Search</button>
                        </div>
                    </div>
                </div>}
            {success &&
                <SweetAlert show={success}
                custom
                confirmBtnText="Ok"
                confirmBtnBsStyle="primary"
                title={"Please enter all input fields"}
                onConfirm={e => onConfirm()}
            >
            </SweetAlert>}
            {resultSuccess &&
                <SweetAlert show={resultSuccess}
                    custom
                    confirmBtnText="Ok"
                    confirmBtnBsStyle="primary"
                    title={"Property Saved Successfully"}
                    onConfirm={e => onConfirm1()}
                >
                </SweetAlert>}
        </div>
    );
};

export default PropertyCalculator;
