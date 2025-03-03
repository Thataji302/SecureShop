import moment from "moment";

const LookupTable = ({ data, header, addClick, imageCloudfront,columns,editClick,deleteClick }) => {

    if (!data || data.length === 0) {
        return <div className="form_section"><div className="empty_page">
            <img src={imageCloudfront + "propertyCalculator/images/dashboard.png"} />
            <p>There are no {header} available.<br />Please add {header}.</p>
            <a className="btn btn-primary" onClick={addClick}>ADD</a>
        </div> </div>;
    }


    return (
        <>
            <div className="breadcurmb">
                <div className="title_block">
                    <h5>{header}</h5>
                </div>
                <div className="buttons">

                    <button className=" btn-primary" onClick={addClick}>add</button>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index} className="align-middle">
                                    {col.label}
                                </th>
                            ))}
                            <th className="align-middle">Action</th> {/* Extra column for actions */}
                        </tr>
                    </thead>
                    <tbody>
                        {data
                            .filter(item => item.status === "Active") // Show only active records
                            .map((eachItem, key) => (
                                <tr key={key}>
                                    {columns.map((col, index) => (
                                        <td key={index}>
                                            {col.type === "date"
                                                ? moment(eachItem[col.key]).format("DD-MM-YYYY") // Format date
                                                : eachItem[col.key] || "N/A"} {/* Show 'N/A' for empty fields */}
                                        </td>
                                    ))}
                                    <td>
                                        <div className="d-flex">
                                            <a className="action-button edit tooltip-container" onClick={e => editClick(eachItem)}>
                                                <span className="material-symbols-outlined"><span className="tooltip">Edit</span>edit</span>
                                            </a>
                                            <a className="action-button delete tooltip-container" onClick={e => deleteClick(eachItem)}>
                                                <span className="material-symbols-outlined"><span className="tooltip">Delete</span>delete</span>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div></>
    );
};

export default LookupTable;
