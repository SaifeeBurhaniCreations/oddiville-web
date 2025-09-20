import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createChamber,
  removeChamber,
} from "../../../../services/DryChamberService";
import { toast } from "react-toastify";
import Spinner from "../../../shared/Spinner/Spinner";

const Chamber = () => {
  const dispatch = useDispatch();
  const chambers = useSelector(state => state.ServiceDataSlice.chamber);

  const [isLoading, setIsLoading] = useState(false);
  const [newChamber, setNewChamber] = useState("");
  const [tag, setTag] = useState("frozen");
  const [capacity, setCapacity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const chamberName = newChamber.trim();
    const chamberCapacity = Number(capacity);

    if (!chamberName) {
      toast.error("Please enter a chamber name");
      return;
    }

    if (Number.isNaN(chamberCapacity) || chamberCapacity <= 0) {
      toast.error("Please enter a valid, positive number for capacity");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createChamber({
        chamber_name: chamberName,
        tag,
        capacity: chamberCapacity,
      });

      if (response.status === 201) {
        dispatch({
          type: "ServiceDataSlice/handlePostCategory",
          payload: response.data,
        });
        setNewChamber("");
        setCapacity("");
        toast.success("Chamber added successfully 🎉");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to add chamber due to a network or server error.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (chamberName) => {
    setIsLoading(true);

    try {
      const response = await removeChamber(chamberName);
      if (response.status === 200) {
        dispatch({
          type: "ServiceDataSlice/handleRemoveCategory",
          payload: chamberName,
        });
        toast.success("Chamber deleted successfully");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete chamber";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center px-3">
      <div className="card my-4 w-100" style={{ maxWidth: "700px" }}>
        <div className="card-header pt-4 pb-2 bg-light">
          <h5 className="m-0 text-center text-md-start">
            Dry Chamber Management
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-6">
                <input
                  type="text"
                  value={newChamber}
                  onChange={(e) => setNewChamber(e.target.value)}
                  className="form-control"
                  placeholder="Enter Chamber Name"
                  disabled={isLoading}
                />
              </div>

              <div className="col-12 col-md-6">
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="form-control"
                  placeholder="Enter Chamber Capacity"
                  disabled={isLoading}
                />
              </div>

              <div className="col-12 col-md-6">
                <select
                  onChange={(e) => setTag(e.target.value)}
                  value={tag}
                  className="form-control"
                  disabled={isLoading}
                >
                  <option value="frozen">Frozen</option>
                  <option value="dry">Dry</option>
                </select>
              </div>

              <div className="col-12 col-md-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-100"
                >
                  {isLoading ? <Spinner /> : "Add Chamber"}
                </button>
              </div>
            </div>
          </form>

          <div className="categories-list">
            <h6 className="mb-3">Existing Chambers</h6>
            <div className="d-flex flex-wrap gap-2">
              {chambers?.map((chamber) => (
                <div
                  key={chamber.id || chamber.chamber_name}
                  className={`badge ${
                    chamber.tag === "frozen" ? "bg-info" : "bg-success"
                  } d-flex align-items-center gap-2`}
                  style={{
                    fontSize: "0.9rem",
                    padding: "8px 12px",
                    cursor: "default",
                  }}
                >
                  {chamber.chamber_name} ({chamber.tag.toUpperCase()})
                  <button
                    onClick={() => handleDelete(chamber.chamber_name)}
                    className="btn btn-link text-white p-0 ms-2"
                    type="button"
                    style={{ fontSize: "1rem", lineHeight: 1 }}
                    disabled={isLoading}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>

            {chambers?.length === 0 && !isLoading && (
              <div className="text-center mt-3 text-muted">
                No chambers found. Add a new one above.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chamber;
