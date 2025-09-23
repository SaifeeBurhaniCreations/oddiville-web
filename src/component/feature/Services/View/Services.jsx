import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { formatDate } from "../../../../util/formateDate";
import {
  fetchChamber,
  fetchDryWarehouse,
  remove as removeService,
} from "../../../../services/DryChamberService";
import {
  handleFetchData,
  handleRemoveData,
} from "../../../../redux/ServiceDataSlice";

import Spinner from "../../../shared/Spinner/Spinner";

const Services = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const serviceData = useSelector((state) => state.ServiceDataSlice.data);
  const chambers = useSelector((state) => state.ServiceDataSlice.chamber);

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const warehouseRes = await fetchDryWarehouse();
        console.log(warehouseRes.data);
        
        dispatch(handleFetchData(warehouseRes.data));

        const chamberRes = await fetchChamber();
        console.log(serviceData);
        
        if (chamberRes.status === 200) {
          dispatch({
            type: "ServiceDataSlice/handleFetchCategory",
            payload: chamberRes.data,
          });
        }
      } catch (error) {
        toast.error("Failed to fetch data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    serviceData?.length === 0 ? fetchAll() : setIsLoading(false);
  }, [dispatch]);

  useEffect(() => {
    setFilteredData(serviceData);
  }, [serviceData]);

  const handleFilter = (chamberName) => {
    setFilteredData(
      chamberName === "All"
        ? serviceData
        : serviceData.filter((item) => item?.chamber_id === chamberName)
    );
  };

  const handleDeleteClick = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedService?.id) return;
    setIsLoading(true);
    try {
      const response = await removeService(selectedService.id);
      if (response.status === 200) {
        dispatch(handleRemoveData(selectedService.id));
        toast.success("Item deleted successfully!");
        setShowModal(false);
      } else {
        toast.error("Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Error deleting service");
    } finally {
      setIsLoading(false);
    }
  };

  const TableWrapper = ({ children }) => (
    <table className="table align-items-center mb-0">
      <thead>
        <tr>
          <th>Image</th>
          <th>Item Name</th>
          <th className="text-center">Chamber</th>
          <th className="text-center">Created Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );

  const renderTableRows = () => {
    return filteredData.map((service, ind) => (
      <tr key={ind}>
        <td>
          <img
            src={service?.banner?.s3Url || "/assets/img/png/fallback_img.png"}
            className="avatar avatar-lg"
            alt="banner"
          />
        </td>
        <td>
          <p className="text-xl font-weight-bold mb-0">{service.item_name}</p>
          <p className="text-xs text-secondary mb-0">{service.description}</p>
        </td>
        <td className="text-center">
          <span className="text-secondary text-xs font-weight-bold">
            {service?.chamber_id || "N/A"}
          </span>
        </td>
        <td className="text-center">
          <span className="text-secondary text-xs font-weight-bold">
            {formatDate(service?.warehoused_date)}
          </span>
        </td>
        <td>
          <div className="d-flex">
            <NavLink
              to={`/dry-warehouse/update-warehouse/${service?.id}`}
              className="btn m-0 btn-link text-secondary font-weight-bold text-xs"
            >
              Edit
            </NavLink>
            <button
              className="btn btn-link text-danger text-gradient px-3 mb-0"
              onClick={() => handleDeleteClick(service)}
            >
              <i className="far fa-trash-alt me-2" /> Delete
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="card mb-4">
            <div className="card-header pb-0 d-flex justify-content-between align-items-center">
              <h5>Dry Chamber Item List</h5>
              <NavLink
                to="/dry-warehouse/add-item"
                className="btn bg-gradient-info"
              >
                <i className="fa-solid fa-plus" /> &nbsp; Add Item
              </NavLink>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2 mb-3">
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleFilter("All")}
                >
                  All
                </button>
                {chambers
                  ?.filter((ch) => ch.tag === "dry")
                  .map((chamber, idx) => (
                    <button
                      key={idx}
                      className="btn btn-success btn-sm"
                      onClick={() => handleFilter(chamber.chamber_name)}
                    >
                      {chamber.chamber_name}
                    </button>
                  ))}
              </div>

              <div className="table-responsive p-0">
                {isLoading ? (
                  <TableWrapper>
                    <tr>
                      <td>
                        <div className="d-flex px-2 py-1">
                          <div>
                            <img
                              src={"./assets/img/png/fallback_img.png"}
                              className="avatar avatar-lg"
                              alt="banner"
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <Spinner />
                      </td>
                      <td className="align-middle text-center">
                        <span className="text-secondary text-xs font-weight-bold">
                          .....
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
                    <tr>
                      <td colSpan={5} className="text-center">
                        No data available
                      </td>
                    </tr>
                  </TableWrapper>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
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
                Are you sure you want to delete service "
                {selectedService?.item_name}"?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
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

export default Services;
