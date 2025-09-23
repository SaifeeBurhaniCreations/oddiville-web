import { useEffect, useState } from "react";
import { create, modify } from "../../../../services/WorkLocatonService";
import Spinner from "../../../shared/Spinner/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  handleModifyData,
  handlePostData,
} from "../../../../redux/WorkLocationSlice";
import Banners from "../../../shared/Banners/Banners";
import { useFormValidator } from "../../../../../custom_library/formValidator/useFormValidator";

const AddWorkLocation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const workLocation = useSelector((state) => state.location.data);

  const [isLoading, setIsLoading] = useState(false);
  const [fetchedBanners, setFetchedBanners] = useState(null);
  const [deleteBanners, setDeleteBanners] = useState(null);

  const form = useFormValidator(
    {
      location_name: "",
      description: "",
      sample_image: null,
    },
    {
      location_name: [
        { type: "required", message: "Location Name is required" },
      ],
      description: [
        { type: "required", message: "Description is required" },
        { type: "minLength", length: 5, message: "Minimum 5 characters" },
      ],
      sample_image: [{ type: "required", message: "Image is required" }],
    },
    { validateOnChange: true, debounce: 300 }
  );

  useEffect(() => {
    if (id) {
      const data = workLocation?.find((value) => value.id === id);
      if (data) {
        form.setField("location_name", data.location_name);
        form.setField("description", data.description);
        setFetchedBanners(data?.sample_image);
      }
    }
  }, [id, workLocation]);

  const handleExit = () => {
    setFetchedBanners(null);
    form.setField("location_name", "");
    form.setField("description", "");
    form.setField("sample_image", null);
    navigate("/work-location");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = form.validateForm();
    if (!result.success) return;

    const formPayload = new FormData();
    
    formPayload.append("location_name", form.values.location_name);
    formPayload.append("description", form.values.description);
    
    if (form.values.sample_image) {
      formPayload.append("sample_image", form.values.sample_image);
    }
    
    console.log(formPayload);
    setIsLoading(true);
    try {
      if (!id) {
        const response = await create(formPayload);
        if (response.status === 201) {
          dispatch(handlePostData(response.data));
          navigate("/work-location");
          toast.success("Location is Added!");
        } else {
          toast.error("Failed to create location.");
        }
      } else {
        const response = await modify({ formData: formPayload, id });
        if (response.status === 200) {
          dispatch(handleModifyData(response.data));
          navigate("/work-location");
          toast.success("Location is Updated!");
        } else {
          toast.error("Failed to update location.");
        }
      }
    } catch (error) {
      toast.error("An error occurred while processing the location.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div className="card-header flex-cs gap-2 justify-content-between pt-4 pb-2">
          <h6>Manage Work Locations</h6>
          {id && (
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={handleExit}
            >
              Clear
            </button>
          )}
        </div>
        <div className="card-body grid-cs gtc-1 pb-4">
          <Banners
            name="Upload Location"
            getBanners={fetchedBanners}
            deleteBanners={deleteBanners}
            setDeleteBanners={setDeleteBanners}
            form={form}
            setFieldValue={form.setField}
          />
          {console.log(form.values)}
          <div className="grid-cs gtc-1">
            <div>
              <input
                type="text"
                value={form.values.location_name}
                onChange={(e) => form.setField("location_name", e.target.value)}
                className="form-control"
                name="location_name"
                placeholder="Location Name"
              />
              {form.errors.location_name && (
                <span className="text-danger">{form.errors.location_name}</span>
              )}
            </div>
            <div>
              <input
                type="text"
                value={form.values.description}
                onChange={(e) => form.setField("description", e.target.value)}
                className="form-control"
                name="description"
                placeholder="Service Description"
              />
              {form.errors.description && (
                <span className="text-danger">{form.errors.description}</span>
              )}
            </div>
          </div>
        </div>
        <div className="card-footer">
          <button
            type="submit"
            // disabled={!form.isValid || isLoading}
            className="btn btn-primary btn-md m-0"
          >
            {id ? "Update" : "Save"} Location {isLoading && <Spinner />}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddWorkLocation;
