import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createChamber,
  removeChamber,
  fetchChamber,
} from "../../../../services/DryChamberService";
import { toast } from "react-toastify";
import Spinner from "../../../shared/Spinner/Spinner";
import { handleFetchCategory } from "../../../../redux/ServiceDataSlice";

const Chamber = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.ServiceDataSlice.chamber);

  const [isLoading, setIsLoading] = useState(false);
  const [newChamber, setNewChamber] = useState("");
  const [tag, setTag] = useState("frozen");
  const [capacity, setCapacity] = useState("");

  useEffect(() => {
    const loadChambers = async () => {
      if (!categories || categories.length === 0) {
        try {
          const res = await fetchChamber();
          if (res.status === 200) {
            dispatch({
              type: "ServiceDataSlice/handleFetchCategory",
              payload: res.data,
            });
          }
        } catch (error) {
          console.error(error);
          toast.error("Failed to fetch chambers");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadChambers();
  }, [categories, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newChamber.trim()) {
      toast.error("Please enter a chamber name");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createChamber({
        chamber_name: newChamber.trim(),
        tag,
        capacity: Number(capacity),
      });
      if (response.status === 201) {
        dispatch({
          type: "ServiceDataSlice/handlePostCategory",
          payload: response.data,
        });
        setNewChamber("");
        setCapacity("");
        toast.success("Chamber added successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add chamber");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (categoryName) => {
    try {
      const response = await removeChamber(categoryName);
      if (response.status === 200) {
        dispatch({
          type: "ServiceDataSlice/handleRemoveCategory",
          payload: categoryName,
        });
        toast.success("Chamber deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete chamber");
    }
  };

  // return(<>
  // {console.log(categories)
  // }
  // </>)

  return (
    <div className="d-flex justify-content-center px-3">
      <div className="card my-4 w-100" style={{ maxWidth: "700px" }}>
        <div className="card-header pt-4 pb-2 bg-light">
          <h5 className="m-0 text-center text-md-start">
            Dry Chamber Management
          </h5>
        </div>

        <div className="card-body">
          <div className="d-flex flex-column gap-3 mb-4">
            <input
              type="text"
              value={newChamber}
              onChange={(e) => setNewChamber(e.target.value)}
              className="form-control"
              placeholder="Enter Chamber Name"
            />
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="form-control"
              placeholder="Enter Chamber Capacity"
            />
            <select
              onChange={(e) => setTag(e.target.value)}
              value={tag}
              className="form-control"
            >
              <option value="frozen">Frozen</option>
              <option value="dry">Dry</option>
            </select>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? <Spinner /> : "Add"}
            </button>
          </div>

          <div className="categories-list">
            <h6 className="mb-3">Existing Chambers</h6>
            <div className="d-flex flex-wrap gap-2">
              {categories?.length === 0 ? (
                <div className="d-flex flex-column flex-md-row gap-2 align-items-center mt-3 justify-content-center">
                  {/* <Spinner /> */}
                  <p className="text-muted mb-0">No chamber found</p>
                </div>
              ) : isLoading === true ? (
                <div className="d-flex flex-column flex-md-row gap-2 align-items-center mt-3 justify-content-center">
                  <Spinner />
                  <p className="text-muted mb-0">No chamber found</p>
                </div>
              ) : (
                categories?.map((chamber) => (
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
                    {chamber.chamber_name}
                    <button
                      onClick={() => handleDelete(chamber.id)}
                      className="btn btn-link text-white p-0 ms-2"
                      type="button"
                      style={{ fontSize: "1rem", lineHeight: 1 }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* {isLoading === true && (
              <div className="d-flex flex-column flex-md-row gap-2 align-items-center mt-3 justify-content-center">
                <Spinner />
                <p className="text-muted mb-0">No chamber found</p>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chamber;
