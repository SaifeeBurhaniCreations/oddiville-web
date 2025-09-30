import React, { useState, useEffect } from "react";
import { useFormValidator } from "../../../custom_library/formValidator/useFormValidator";
import { useDispatch, useSelector } from "react-redux";
import {
  createChamber,
  removeChamber,
  fetchChamber,
} from "../../services/DryChamberService";
import { toast } from "react-toastify";
import Spinner from "../../component/shared/Spinner/Spinner";
import ConfirmationModal from "../../component/shared/Dialogue_box/ConfirmationModal";

const Chamber = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.ServiceDataSlice.chamber);
  const [chamberToDelete, setChamberToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const addChamberForm = useFormValidator(
    {
      chamber_name: "",
      capacity: "",
      tag: "",
    },
    {
      chamber_name: [
        { type: "required", message: "Chamber name is required" },
        {
          type: "minLength",
          length: 3,
          message: "Minimum 3 characters needed",
        },
      ],
      capacity: [
        { type: "required", message: "Please mention the capacity of chamber" },
        { type: "number", message: "Only numbers allowed" },
      ],
      tag: [{ type: "required", message: "Chamber type required" }],
    },
    { validateOnChange: true, debounce: 300 }
  );

  useEffect(() => {
    const loadChambers = async () => {
      if (!categories || categories.length === 0) {
        setIsLoading(true);
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
      }
    };
    loadChambers();
  }, [categories, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = addChamberForm.validateForm();
    if (!result.success) return;

    setIsLoading(true);
    try {
      const response = await createChamber(result.data);
      if (response.status === 201) {
        dispatch({
          type: "ServiceDataSlice/handlePostCategory",
          payload: response.data,
        });
        toast.success("Chamber added successfully");
        addChamberForm.setFields({ chamber_name: "", capacity: "", tag: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add chamber");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    setIsLoading(true);
    try {
      const response = await removeChamber(categoryId);
      if (response.status === 200) {
        dispatch({
          type: "ServiceDataSlice/handleRemoveCategory",
          payload: categoryId,
        });
        toast.success("Chamber deleted successfully");
        setChamberToDelete(null);
      }
    } catch (error) {
      toast.error("Failed to delete chamber");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ConfirmationModal
        title="Delete Chamber?"
        item={chamberToDelete}
        onConfirm={() => handleDelete(chamberToDelete.id)}
        onClose={() => setChamberToDelete(null)}
      />

      <div className="d-flex justify-content-center px-3">
        <div className="card my-4 w-100" style={{ maxWidth: "700px" }}>
          <div className="card-header pt-4 pb-2 bg-light">
            <h5 className="m-0 text-center text-md-start">
              Dry Chamber Management
            </h5>
          </div>

          <div className="card-body">
            <form
              onSubmit={handleSubmit}
              className="d-flex flex-column gap-3 mb-4"
            >
              <div className="form-floating">
                <input
                  type="text"
                  name="chamber_name"
                  value={addChamberForm.values.chamber_name}
                  onChange={(e) =>
                    addChamberForm.setField("chamber_name", e.target.value)
                  }
                  className={`form-control ${
                    addChamberForm.errors.chamber_name ? "is-invalid" : ""
                  }`}
                  placeholder="Enter Chamber Name"
                />
                <label>Enter Chamber Name</label>
                {addChamberForm.errors.chamber_name && (
                  <div className="text-danger mt-1">
                    {addChamberForm.errors.chamber_name}
                  </div>
                )}
              </div>

              <div className="form-floating">
                <input
                  type="text"
                  name="capacity"
                  value={addChamberForm.values.capacity}
                  onChange={(e) =>
                    addChamberForm.setField("capacity", e.target.value)
                  }
                  className={`form-control ${
                    addChamberForm.errors.capacity ? "is-invalid" : ""
                  }`}
                  placeholder="Enter Chamber Capacity"
                />
                <label>Enter Chamber Capacity</label>
                {addChamberForm.errors.capacity && (
                  <div className="text-danger mt-1">
                    {addChamberForm.errors.capacity}
                  </div>
                )}
              </div>

              <div className="form-floating">
                <select
                  name="tag"
                  value={addChamberForm.values.tag}
                  onChange={(e) =>
                    addChamberForm.setField("tag", e.target.value)
                  }
                  className={`form-select ${
                    addChamberForm.errors.tag ? "is-invalid" : ""
                  }`}
                >
                  <option value="">Select Chamber Type</option>
                  <option value="frozen">Frozen</option>
                  <option value="dry">Dry</option>
                </select>
                {addChamberForm.errors.tag && (
                  <div className="text-danger mt-1">
                    {addChamberForm.errors.tag}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={!addChamberForm.isValid || isLoading}
              >
                {isLoading ? <Spinner /> : "Add Chamber"}
              </button>
            </form>

            <div className="categories-list">
              <h6 className="mb-3">Existing Chambers</h6>
              {categories?.length === 0 ? (
                <div className="text-center text-secondary py-4">
                  No chamber found
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-borderless table-hover mb-0">
                    <thead>
                      <tr>
                        <th className="text-center">Name</th>
                        <th className="text-center">Capacity (in kgs)</th>
                        <th className="text-center">No. of Items</th>
                        <th className="text-center">Type</th>
                        <th className="text-center">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((chamber, idx) => (
                        <tr
                          key={idx}
                          className={`text-dark ${
                            chamber.tag === "dry" ? "is-dry" : "is-frozen"
                          }`}
                        >
                          <td className="text-center p-1">
                            {chamber.chamber_name}
                          </td>
                          <td className="text-center p-1">
                            {chamber.capacity} Kgs
                          </td>
                          <td className="text-center p-1">
                            {chamber?.items?.length ?? "No item"}
                          </td>
                          <td className="text-center p-1 text-capitalize">
                            {chamber.tag}
                          </td>
                          <td className="text-center p-1">
                            <button
                              className="btn btn-link text-dark p-1"
                              type="button"
                              onClick={() => setChamberToDelete(chamber)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chamber;
