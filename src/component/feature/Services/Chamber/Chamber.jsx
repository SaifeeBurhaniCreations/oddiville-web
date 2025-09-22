import React, { useState, useEffect } from "react";
// import { useFormik as formik } from "formik";
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
  // const [initialValues] = useState({
  //   chamber_name: "",
  //   capacity: "",

  // });

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

  // const addChamberForm = formik({});

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

  const handleDelete = async (chamberName) => {
    setDeletingChamber(chamberName);

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
      toast.error(error.response?.data?.message || "Failed to delete chamber");
    } finally {
      setDeletingChamber(null);
    }
  };

  // return(<>
  // {console.log(categories)
  // }
  // </>)

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", padding: "1rem" }}
    >
      <div
        className="card my-3"
        style={{
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <div className="card-header pt-4 pb-2">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            <h6 className="mb-2 mb-md-0 ">Dry Chamber Management</h6>
          </div>
        </div>

        <div className="card-body">
          <form
            onSubmit={formik.handleSubmit}
            className="d-flex flex-column gap-3 mb-4 mx-auto"
          >
            <div className="w-100">
              <label htmlFor="chamber_name" className="form-label fw-semibold">
                Chamber Name
              </label>
              <input
                type="text"
                id="chamber_name"
                name="chamber_name"
                value={formik.values.chamber_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isAdding}
                className={`form-control ${
                  formik.touched.chamber_name && formik.errors.chamber_name
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Enter Chamber Name"
              />

              {formik.touched.chamber_name && formik.errors.chamber_name && (
                <div className="invalid-feedback">
                  {formik.errors.chamber_name}
                </div>
              )}
            </div>

            <div className="w-100">
              <label htmlFor="capacity" className="form-label fw-semibold">
                Capacity
              </label>
              <input
                type="text"
                id="capacity"
                name="capacity"
                value={formik.values.capacity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isAdding}
                className={`form-control ${
                  formik.touched.capacity && formik.errors.capacity
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Enter Chamber Capacity"
              />
              {formik.touched.capacity && formik.errors.capacity && (
                <div className="invalid-feedback">{formik.errors.capacity}</div>
              )}
            </div>

            <div className="w-100">
              <label htmlFor="tag" className="form-label fw-semibold">
                Tag
              </label>
              <select
                id="tag"
                name="tag"
                value={formik.values.tag}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isAdding}
                className={`form-control ${
                  formik.touched.tag && formik.errors.tag ? "is-invalid" : ""
                }`}
              >
                <option value="frozen">Frozen</option>
                <option value="dry">Dry</option>
              </select>
              {formik.touched.tag && formik.errors.tag && (
                <div className="invalid-feedback">{formik.errors.tag}</div>
              )}
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isAdding}
                className="btn btn-primary w-100"
                style={{ maxWidth: "200px" }}
              >
                {isAdding ? <Spinner /> : "Add Chamber"}
              </button>
            </div>
          </form>

          <div className="categories-list text-center">
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
