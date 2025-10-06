
import { NavLink } from "react-router-dom";
import Spinner from "@/components/Spinner/Spinner";
import { formatDate } from "@/util/formatDate"; 

const TableWrapper = ({ children }) => (
    <table className="table align-items-center mb-0">
        <thead>
            <tr>
                <th>Lane Name</th>
                <th className="text-center">Last Updated</th>
                <th className="text-center">Created At</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>{children}</tbody>
    </table>
);

const renderTableRows = (data, handleDeleteClick) => {
    // console.log(data);
    
 
    // const getLaneData = (lane, key) => lane[key] || lane.data?.[key];
    const getLaneId = (lane) => lane.id || lane._id || lane.data?.id || lane.data?._id;

    return data.map((lane, index) => (
        <tr key={index}>
            <td>
                <p className="text-xl font-weight-bold mb-0">{lane?.name}</p>
                <p className="text-xs text-secondary mb-0">{lane?.description}</p>
            </td>
            <td className="text-center">
                <span className="text-secondary text-xs font-weight-bold">
                    {formatDate(lane?.updatedAt)}
                </span>
            </td>
            <td className="text-center">
                <span className="text-secondary text-xs font-weight-bold">
                    {formatDate(lane?.createdAt)}
                </span>
            </td>
            <td>
                <div className="d-flex">
                    <NavLink
                        to={`/lane/${getLaneId(lane)}`}
                        className="btn btn-link m-0 text-secondary font-weight-bold text-xs"
                    >
                        Edit
                    </NavLink>
                    <button
                        className="btn btn-link text-danger text-gradient px-3 mb-0"
                      
                        onClick={() => handleDeleteClick(lane)} 
                    >
                        <i className="far fa-trash-alt me-2" /> Delete
                    </button>
                </div>
            </td>
        </tr>
    ));
};

const LaneTable = ({ filteredData, isLoading, handleDeleteClick }) => {
    
    if (isLoading) {
        return (
            <div className="text-center py-5" colSpan={4}>
                <Spinner />
                <p className="mt-2 text-secondary">Fetching lane data...</p>
            </div>
        );
    }

    if (filteredData.length === 0) {
        return (
            <TableWrapper>
                <tr><td colSpan={4} className="text-center py-5">No data available</td></tr>
            </TableWrapper>
        );
    }


    return (
        <TableWrapper>
            {renderTableRows(filteredData, handleDeleteClick)}
        </TableWrapper>
    );
};

export default LaneTable;