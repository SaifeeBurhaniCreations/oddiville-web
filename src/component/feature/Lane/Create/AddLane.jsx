import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { useFormValidator } from "../../../../../custom_library/formValidator/useFormValidator";
import { create, modify, fetchLanes } from "../../../../services/LaneService";
import Spinner from "../../../shared/Spinner/Spinner";
import {
  handleModifyData,
  handlePostData,
  handleFetchData,
} from "../../../../redux/LaneDataSlice";

const AddLane = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const param = useParams();
  const { id } = param;

  const lanes = useSelector((state) => state.lane.data);

  const [isLoading, setIsLoading] = useState(false);

  const form = useFormValidator(
    {
      name: "",
      description: "",
    },
    {
      name: [
        { type: "required", message: "Lane name is required" },
        {
          type: "minLength",
          length: 3,
          message: "Minimum 3 characters needed",
        },
      ],
      description: [
        { type: "required", message: "Lane description is required" },
        {
          type: "minLength",
          length: 5,
          message: "Description must be at least 5 characters",
        },
      ],
    },
    { validateOnChange: true, debounce: 300 }
  );

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

    fetchAll();
  }, [dispatch]);

  useEffect(() => {
    if (id && lanes?.length > 0) {
      const data = lanes.find((lane) => lane.id === id || lane._id === id);
      if (data) {
        form.setField("name", data.name || "");
        form.setField("description", data.description || "");
      }
    }
  }, [id, lanes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = form.validateForm();
  

    if (!result.success) return;

    setIsLoading(true);
    try {
      if (!id) {
        const response = await create(result.data);
        if (response.status === 201) {
          dispatch(handlePostData(response.data));
          toast.success("Lane is Added !!");
          form.resetForm();
          navigate("/lane");
        } else {
          toast.error(response.data.error);
        }
      } else {
        const response = await modify({ formData: result.data, id });
        

        if (response.status === 200) {
          dispatch(handleModifyData(response.data));
          toast.success("Lane is Updated !!");
          form.resetForm();
          navigate("/lane");
        } else {
          toast.error(response.data.error);
        }
      }
    } catch (error) {
      toast.error("An error occurred while processing the lane.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExit = () => {
    form.resetForm();
    navigate("/lane");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="card shadow-sm rounded-3">
          <div className="card-header flex-cs gap-2 justify-content-between pt-4 pb-2 bg-light">
            <h6 className="m-0">Manage Work Locations</h6>
            {id && (
              <button
                type="button"
                onClick={handleExit}
                className="btn btn-secondary btn-md m-0"
              >
                Clear
              </button>
            )}
          </div>

          <div className="card-body pb-4">
            <div className="grid-cs gtc-1 gap-3">
              <div className="mb-3">
                <label className="form-label fw-semibold">Lane Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.values.name}
                  onChange={(e) => form.setField("name", e.target.value)}
                  className={`form-control ${
                    form.errors.name ? "is-invalid" : ""
                  }`}
                  placeholder="Enter Lane Name"
                />
                {form.errors.name && (
                  <div className="invalid-feedback">{form.errors.name}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Lane Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={form.values.description}
                  onChange={(e) => form.setField("description", e.target.value)}
                  className={`form-control ${
                    form.errors.description ? "is-invalid" : ""
                  }`}
                  placeholder="Enter Lane Description"
                />
                {form.errors.description && (
                  <div className="invalid-feedback">
                    {form.errors.description}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card-footer text-end">
            <button
              type="submit"
              disabled={!form.isValid || isLoading}
              className="btn btn-primary btn-md m-0"
            >
              {id ? "Update" : "Save"} Lane {isLoading && <Spinner />}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddLane;
