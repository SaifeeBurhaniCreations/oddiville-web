import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { formatDate } from "../../../../util/formateDate";
import { fetchLanes, remove as removeLane } from "../../../../services/LaneService";
import { handleFetchData, handleRemoveData } from "../../../../redux/LaneDataSlice";
import Spinner from "../../../shared/Spinner/Spinner";
import AddLane from "../Create/AddLane";

const Lane = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedLane, setSelectedLane] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const lanes = useSelector((state) => state.lane.data);

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const getLane = await fetchLanes();
        dispatch(handleFetchData(getLane.data));
      } catch (error) {
        toast.error("Failed to fetch data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    lanes?.length === 0 ? fetchAll() :  setIsLoading(false);
  }, [dispatch]);

  useEffect(() => {
    setFilteredData(lanes);
  }, [lanes]);

  const handleDeleteClick = (lane) => {
    setSelectedLane(lane);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedLane?.id) return;
    setIsLoading(true);
    try {
      const response = await removeLane(selectedLane.id);
      if (response.status === 200) {
        dispatch(handleRemoveData(selectedLane.id));
        toast.success("Lane deleted successfully!");
        setShowModal(false);
      } else {
        toast.error("Failed to delete lane");
      }
    } catch (error) {
      console.error("Error deleting lane:", error);
      toast.error("Error deleting lane");
    } finally {
      setIsLoading(false);
    }
  };

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

  const renderTableRows = () => {
    return filteredData.map((lane) => (
      <tr key={lane._id}>
        <td>
          <p className="text-xl font-weight-bold mb-0">{lane.name}</p>
          <p className="text-xs text-secondary mb-0">{lane.description}</p>
        </td>
        <td className="text-center">
          <span className="text-secondary text-xs font-weight-bold" >{formatDate(lane.updatedAt)}</span>
        </td>
        <td className="text-center">
          <span className="text-secondary text-xs font-weight-bold">{formatDate(lane.createdAt)}</span>
        </td>
        <td>
          <div className="d-flex">
            <NavLink
              to={`/lane/${lane.id}`}
              className="btn btn-link m-0 text-secondary font-weight-bold text-xs"
            >
              Edit
            </NavLink>
            <button
              className="btn btn-link text-danger text-gradient px-3 mb-0"
              onClick={() => handleDeleteClick(lane)}
            >
              <i className="far fa-trash-alt me-2"></i> Delete
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="container-fluid">
      <div className="row reverse">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header pb-0">
              <h5>Work Locations</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive p-0">
                {isLoading ? (
                  <TableWrapper>
                    <tr>
                      <td className="align-middle text-center">
                        <span className="text-secondary text-xs font-weight-bold">
                          <Spinner />
                        </span>
                      </td>
                      <td className="align-middle text-center">
                        <span className="text-secondary text-xs font-weight-bold">
                          ....
                        </span>
                      </td>
                      <td className="align-middle text-center">
                        <span className="text-secondary text-xs font-weight-bold">
                          ....
                        </span>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex">
                          <button
                            disabled
                            className="btn btn-link m-0 text-secondary font-weight-bold text-xs"
                          >
                            Edit
                          </button>
                          <button
                            disabled
                            className="btn btn-link text-danger text-gradient px-3 mb-0"
                          >
                            <i className="far fa-trash-alt me-2"></i>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  </TableWrapper>
                ) : filteredData.length > 0 ? (
                  <TableWrapper>{renderTableRows()}</TableWrapper>
                ) : (
                  <TableWrapper>
                    <tr><td colSpan={4} className="text-center">No data available</td></tr>
                  </TableWrapper>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <AddLane />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete lane "{selectedLane?.name}"?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Delete {isLoading && <Spinner />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lane;