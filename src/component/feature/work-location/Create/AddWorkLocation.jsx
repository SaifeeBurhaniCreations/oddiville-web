import { useFormik } from "formik";
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
import { useFormValidator } from ".././../../../../custom_library/formValidator/useFormValidator";

const AddWorkLocation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const param = useParams();
  const { id } = param;

  const workLocation = useSelector((state) => state.location.data);

  const [isLoading, setIsLoading] = useState(false);
  const [banners, setBanners] = useState();
  const [fetchedBanners, setFetchedBanners] = useState();
  const [deleteBanners, setDeleteBanners] = useState();
  // const [initialValues, setInitialValues] = useState({
  //   location_name: '',
  //   description: '',
  //   sample_image: null
  // })

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
      sample_image: [
        {
          type: "required",
          message: "Image is required",
          // condition: () => !id,
        },
      ],
    },
    { validateOnChange: true, debounce: 300 }
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    // const formData = new FormData();
    // formData.append("location_name", form?.values?.location_name)
    // formData.append("description", form?.values?.description)
    // if(banners){
    //   formData.append("sample_image", form?.values?.sample_image)
    // }

    if(banners){
      console.log(banners);
      
      // form.setField("sample_image", banners)
    }
    const res = form.validateForm();
    console.log(res);
    
  };


  // const formFormik = useFormik({
  //   initialValues,
  //   onSubmit: async (formData) => {
  //     const formPayload = new FormData();

  //     // Add basic fields
  //     formPayload.append("location_name", formData.location_name);
  //     formPayload.append("description", formData.description);

  //     // Add sample_image if exists
  //     if (banners) {
  //       formPayload.append("sample_image", banners);
  //     }

  //     // // Log the formPayload
  //     // const payloadObject = {};
  //     // formPayload.forEach((value, key) => {
  //     //   payloadObject[key] = value;
  //     // });
  //     // console.log("Form Payload:", payloadObject); // Log the payload

  //     // return

  //     setIsLoading(true);
  //     try {
  //       if (!id) {
  //         const response = await create(formPayload);
  //         if (response.status === 201) {
  //           dispatch(handlePostData(response.data));
  //           navigate("/work-location");
  //           toast.success("location is Added !!");
  //         } else {
  //           toast.error("Failed to create location.");
  //         }
  //       } else {
  //         // Add deleteBanner flag if updating
  //         // if (deleteBanner) {
  //         //   formPayload.append("deleteBanner", "true");
  //         // }

  //         const response = await modify({ formData: formPayload, id });
  //         if (response.status === 200) {
  //           dispatch(handleModifyData(response.data));
  //           navigate("/work-location");
  //           toast.success("location is Updated !!");
  //         } else {
  //           toast.error("Failed to update location.");
  //         }
  //       }
  //     } catch (error) {
  //       toast.error("An error occurred while processing the location.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   },
  // });

  useEffect(() => {
    if (id) {
      const data = workLocation?.find((value) => value.id === id);
      form.setField(data);
      setFetchedBanners(data?.sample_image);
    }
  }, [id]);

  const fetchBanners = (data) => {
    setBanners(data);
  };

  const handleExit = () => {
    setFetchedBanners(null);
    form.setFields({ location_name: "", description: "", sample_image: null });
    navigate("/work-location");
  };

  return (
    <>
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
              name="Uplaod Location"
              form={form}
              getBanners={fetchedBanners}
              deleteBanners={deleteBanners}
              setDeleteBanners={setDeleteBanners}
              fetchBanners={fetchBanners}
            />
            <div className="grid-cs gtc-1">
              <div>
                <input
                  type="text"
                  value={form?.values?.location_name}
                  // onChange={form.handleChange}
                  onChange={(e)=>form.setField("location_name", e.target.value)}
                  className="form-control"
                  name="location_name"
                  placeholder="Location Name"
                  id=""
                />
              </div>
              <div>
                <input
                  type="text"
                  value={form?.values?.description}
                  // onChange={form.handleChange}
                  onChange={(e)=>form.setField("description", e.target.value)}
                  className="form-control"
                  name="description"
                  placeholder="Service Description"
                  id=""
                />
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-md m-0"
            >
              {id ? "Update" : "Save"} Location {isLoading && <Spinner />}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddWorkLocation;
