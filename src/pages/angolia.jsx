import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import moment from "moment";
import $ from "jquery";
let { lambda, appname } = window.app


const AlgoliaSearch = () => {
    const [items, setItems] = useState("");
    const componentRef = useRef();

    useEffect(() => {
        getOrderItems()
    }, []);

    const getOrderItems = async () => {

        const token = localStorage.getItem("token")
        const userid = localStorage.getItem("userId")

        axios({
            method: 'POST',
            url: lambda + '/items?appname=' + appname + "&token=" + token + "&userid=" + userid + "&orderid=" + "65c6008850ae4978546c1f07",
        })
            .then(function (response) {
                console.log("response", response)
                if (response.data.result === "Invalid token or Expired") {
                    //  setShowSessionPopupup(true)

                } else {
                    setItems(response.data.result.data)

                }
            });
    };


    const PageContent = ({ data }) => {
        const [qrSrc, setQrSrc] = useState('');
        useEffect(() => {
            const imageUrl = 'https://api.qrserver.com/v1/create-qr-code/?data=' +
              `https://develop.spacovers.com/item/${data.itemid}/${data.status}`;
            setQrSrc(imageUrl);
          }, [data.itemid, data.status]);


    return (
        <div style={{ pageBreakAfter: 'always' }}>

            <div className="print-content access-denied order_specification order_spe_print" style={{ padding: "30px" }}>
                <div className="modal-body enquiry-form">
                    <img src="https://spacovers.imgix.net/spacoversdev/admin/theme/images/logo-dark.png" />
                    <div className="details_block">
                        <div className="block_left">
                            <div className="input-field">
                                <label className="form-label form-label">delaler</label>
                                <p>{data?.name}</p>
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Size</label>
                                <p>{data?.productspecification?.dimensionA + "’" + " " + data?.productspecification?.dimensionB + "”"}</p>
                            </div>

                            <div className="input-field">
                                <label className="form-label form-label">Color</label>
                                <p>{data?.productspecification?.covercolor}</p>
                            </div>
                        </div>
                        <div className="block_right">
                            <div className="input-field">
                                <label className="form-label form-label">Radius</label>
                                <p>{data?.productspecification?.radius}</p>
                            </div>

                        </div>
                    </div>
                    <div className="details_block tie_downs">
                        <div className="block_left">
                            <div className="input-field">
                                <label className="form-label form-label">Plastic<br /># of tie downs</label>
                                <p>{data?.productspecification?.tiedown}</p>
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Connector</label>
                                <p>0</p>
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Velcro</label>
                                <p>--</p>
                            </div>
                        </div>
                        <div className="block_right">
                            <div className="input-field">
                                <h6>{data?.productspecification?.tiedownlocation}</h6>
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Cut Flap</label>
                                <p>{parseInt(data?.productspecification?.coverskritlength) * 2 + 1}</p>
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Flaps</label>
                                <p>{data?.productspecification?.coverskritlength}</p>
                            </div>
                        </div>
                    </div>
                    <div className="details_block connected">
                        <div className="block_left">
                            <div className="input-field">
                                <h6>{data?.productspecification?.skirtoption}</h6>
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Tie Downs</label>
                                <p>{data?.productspecification?.tiedown}</p>
                            </div>
                        </div>
                        <div className="block_right">
                            <div className="input-field">
                                <h6>{data?.productspecification?.skirtoption}</h6>
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Cut T/D</label>
                                <p>{parseInt(data?.productspecification?.tiedown) * 2 + 1}</p>
                            </div>
                        </div>
                    </div>
                    <div className="details_block foam_density">
                        <h6>Foam Density</h6>
                        <div className="dbl">
                            <div className="input-field">
                                <label className="form-label form-label">Dbl</label>
                                {data?.productspecification?.foamdensity ===
                                    "#2lbs Foam +$55" &&
                                    <p>{data?.productspecification?.foamdensity}</p>
                                }
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Plastic</label>
                                {data?.productspecification?.foamdensity ===
                                    ".25 Standard" &&
                                    <p>{data?.productspecification?.foamdensity}</p>
                                }
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">Webbing</label>
                                {data?.productspecification?.foamdensity ===
                                    "5-2.5+$55" &&
                                    <p>{data?.productspecification?.foamdensity}</p>
                                }
                            </div>
                            <div className="input-field">
                                <label className="form-label form-label">6”- 4”</label>
                                {data?.productspecification?.foamdensity ===
                                    "6-4 +$100" &&
                                    <p>{data?.productspecification?.foamdensity}</p>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="qr_block">
                        <img src={qrSrc}  className="qrImg" id="qrImg" />
                    </div>
                    <div className="details_block customer_location">
                        <div className="input-field">
                            <label className="form-label form-label">Customer / Location</label>
                            <p>{data && data?.deliveryaddress && (data?.deliveryaddress?.address1 + "," + data.deliveryaddress.address2 + "," + data.deliveryaddress.state + "," + data.deliveryaddress.pincode)}</p>
                        </div>
                        <div className="input-field">
                            <label className="form-label form-label">Date</label>
                            <p>{moment(data?.created).format('MMM-DD-YYYY')}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

console.log("items", items)

const handlePrint = useReactToPrint({
    content: () => componentRef.current,
});

return (
    <div>
        <button onClick={handlePrint}>Print</button>
        <div className='print-only' ref={componentRef}>
            {items && items.map((data) => (
                <PageContent data={data} />
            ))}
        </div>
    </div>
);
};

export default AlgoliaSearch;