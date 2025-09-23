import React, { useState, useEffect } from "react";
import { useFormValidator } from "../../../../../custom_library/formValidator/useFormValidator";
import { useDispatch, useSelector } from "react-redux";
import {
  createChamber,
  removeChamber,
  fetchChamber,
} from "../../../../services/DryChamberService";
import { toast } from "react-toastify";
import Spinner from "../../../shared/Spinner/Spinner";
import { handleFetchCategory } from "../../../../redux/ServiceDataSlice";
import ConfirmationModal from "../../../shared/Dialogue_box/ConfirmationModal";

const Chamber = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.ServiceDataSlice.chamber);
  const [chamberToDelete, setChamberToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [newChamber, setNewChamber] = useState("");
  // const [tag, setTag] = useState("frozen");
  // const [capacity, setCapacity] = useState("");
  // const [initialValues] = useState({
  //   chamber_name: "",
  //   capacity: "",

  // });

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
    const result = addChamberForm.validateForm();

    setIsLoading(true);
    try {
      const response = await createChamber(result.data);
      if (response.status === 201) {
        dispatch({
          type: "ServiceDataSlice/handlePostCategory",
          payload: response.data,
        });
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

  return (
    <>
      <ConfirmationModal
        title="Delete Chamber?"
        item={chamberToDelete}
        onConfirm={() => {
          if (chamberToDelete) {
            handleDelete(chamberToDelete.id);
          }
        }}
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
                  className={
                    "form-control " +
                    (addChamberForm.errors.chamber_name
                      ? "is-invalid text-danger"
                      : "")
                  }
                  placeholder="Enter Chamber Name"
                />
                <label htmlFor="">
                  Enter Chamber Name
                  {addChamberForm.errors.chamber_name && (
                    <span className="text-danger fw-normal fs-error">
                      &emsp;
                      {addChamberForm.errors.chamber_name}
                    </span>
                  )}
                </label>
              </div>
              <div className="form-floating">
                <input
                  type="text"
                  name="capacity"
                  value={addChamberForm.values.capacity}
                  onChange={(e) =>
                    addChamberForm.setField("capacity", e.target.value)
                  }
                  className={
                    "form-control " +
                    (addChamberForm.errors.capacity
                      ? "is-invalid text-danger"
                      : "")
                  }
                  placeholder="Enter Chamber Capacity"
                />
                <label htmlFor="">
                  Enter Chamber Capacity
                  {addChamberForm.errors.capacity && (
                    <span className="text-danger fw-normal fs-error">
                      &emsp;
                      {addChamberForm.errors.capacity}
                    </span>
                  )}
                </label>
              </div>
              <div className="form-floating">
                <select
                  name="tag"
                  onChange={(e) =>
                    addChamberForm.setField("tag", e.target.value)
                  }
                  value={addChamberForm.values.tag}
                  className={
                    "form-select " +
                    (addChamberForm.errors.tag ? "is-invalid text-danger" : "")
                  }
                  id="floatingSelect"
                  aria-label="Select Chamber Type"
                >
                  <option selected value="">
                    {addChamberForm.errors.tag && addChamberForm.errors.tag}
                  </option>
                  <option value="frozen">Frozen</option>
                  <option value="dry">Dry</option>
                </select>
                <label
                  className={addChamberForm.errors.tag && "text-danger"}
                  htmlFor="floatingSelect"
                >
                  Select Chamber Type
                </label>
              </div>

              <button
                type="submit"
                // onClick={handleSubmit}
                disabled={!addChamberForm.isValid}
                className="btn btn-primary"
              >
                {isLoading ? <Spinner /> : "Add"}
              </button>
            </form>

            <div className="categories-list">
              <h6 className="mb-3">Existing Chambers</h6>
              <div className="d-flex flex-wrap gap-2">
                {categories?.length === 0 ? (
                  <div className="d-flex flex-column flex-md-row gap-2 align-items-center mt-3 justify-content-center">
                    <p className="text-muted mb-0">No chamber found</p>
                    {/* <Spinner /> */}
                  </div>
                ) : categories?.length === 0 ? (
                  <div className="d-flex flex-column flex-md-row gap-2 align-items-center mt-3 justify-content-center">
                    <p className="text-muted mb-0">No chamber found</p>
                    <Spinner />
                  </div>
                ) : (
                  <table className="table table-borderless table-hover">
                    <tr className="table-disabled">
                      <th className="text-center text-dark">Name</th>
                      <th className="text-center text-dark">
                        Capacity {"(in kgs)"}
                      </th>
                      <th className="text-center text-dark">No. of Items</th>
                      <th className="text-center text-dark">Type</th>
                      <th className="text-center text-dark">Delete</th>
                    </tr>
                    {categories?.map((chamber, id) => (
                      <tr
                        key={id}
                        className={
                          "text-dark " +
                          (chamber.tag === "dry" ? "is-dry" : "is-frozen")
                        }
                      >
                        <td className="text-center p-1 rounded-start rounded-end">
                          {chamber.chamber_name}
                        </td>
                        <td className="text-center p-1 rounded-start rounded-end">
                          {chamber.capacity} Kgs
                        </td>
                        <td className="text-center p-1 rounded-start rounded-end">
                          {chamber?.items?.length == null
                            ? "No item"
                            : chamber?.items?.length}
                        </td>
                        <td className="text-center p-1 rounded-start rounded-end text-capitalize">
                          {chamber.tag}
                        </td>
                        <td className="text-center p-1 rounded-start rounded-end">
                          <button
                            className="btn btn-link text-dark p-1"
                            type="button"
                            style={{ fontSize: "1rem", lineHeight: 1 }}
                            data-bs-toggle="modal"
                            data-bs-target="#deleteModal"
                            onClick={() => setChamberToDelete(chamber)} // pass whole object or id
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </table>
                )}
              </div>
              {/* {console.log(categories[0])} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chamber;
