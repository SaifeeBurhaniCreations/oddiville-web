import React, { useState, useEffect } from "react";
import { useFormValidator } from "../../../custom_library/formValidator/useFormValidator";
import { useDispatch, useSelector } from "react-redux";
import {
  create,
  modify,
  fetchDryWarehouse,
} from "../../services/DryChamberService";
import Spinner from "../../component/shared/Spinner/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Banners from "../../component/shared/Banners/Banners";
import {
  handleModifyData,
  handlePostData,
  handleFetchCategory,
} from "../../redux/ServiceDataSlice";

const CreateService = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const serviceData = useSelector((state) => state.ServiceDataSlice.data);
  const chambers = useSelector((state) => state.ServiceDataSlice.chamber) || [];

  const [isLoading, setIsLoading] = useState(false);
  const [banners, setBanners] = useState(null);
  const [fetchedBanners, setFetchedBanners] = useState(null);
  const [deleteBanners, setDeleteBanners] = useState([]);

  const form = useFormValidator(
    {
      item_name: "",
      chamber_id: "",
      warehoused_date: new Date(),
      description: "",
      quantity_unit: "",
      sample_image: null,
    },
    {
      item_name: [
        { type: "required", message: "Item Name is required" },
        {
          type: "minLength",
          length: 3,
          message: "Minimum 3 characters required",
        },
      ],
      chamber_id: [{ type: "required", message: "Please select a category" }],
      warehoused_date: [{ type: "required", message: "Date is required" }],
      description: [
        { type: "required", message: "Description is required" },
        {
          type: "minLength",
          length: 3,
          message: "Minimum 3 characters required",
        },
      ],
      quantity_unit: [
        { type: "required", message: "Quantity Unit is required" },
      ],
      sample_image: [{ type: "required", message: "image is required" }],
    },
    { validateOnChange: true, debounce: 300 }
  );

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetchDryWarehouse();
        console.log(response);
        dispatch(handleFetchCategory(response.data));
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    }
    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      const data = serviceData?.find((s) => s.id === id);
      if (data) {
        form.setFields({
          item_name: data.item_name,
          chamber_id: data.chamber_id,
          warehoused_date: data.warehoused_date,
          description: data.description,
          quantity_unit: data.quantity_unit,
          sample_image: data.sample_image,
        });
        setFetchedBanners(data.sample_image);
      }
    }
  }, [id, serviceData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = form.validateForm();
    if (!result.success) return;

    const formPayload = new FormData();
    formPayload.append("item_name", result.data.item_name);
    formPayload.append("chamber_id", result.data.chamber_id);
    formPayload.append("description", result.data.description);
    formPayload.append("quantity_unit", result.data.quantity_unit);
    formPayload.append("warehoused_date", result.data.warehoused_date);

    if (banners) formPayload.append("sample_image", banners);

    setIsLoading(true);
    try {
      if (!id) {
        const response = await create(formPayload);
        if (response.status === 201) {
          dispatch(handlePostData(response.data));
          toast.success("Item added successfully!");
          navigate("/dry-warehouse");
        } else {
          toast.error("Failed to add item");
        }
      } else {
        const response = await modify({ formData: formPayload, id });
        if (response.status === 200) {
          dispatch(handleModifyData(response.data));
          toast.success("Item updated successfully!");
          navigate("/dry-warehouse");
        } else {
          toast.error("Failed to update item");
        }
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBanners = (file) => {
    if (file) {
      setBanners(file);
      form.setField("sample_image", file);
    }
  };

  return (
    <div className="container-fluid">
      <form onSubmit={handleSubmit}>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">Manage Items</h5>
              </div>

              <div className="card-body">
                <div className="mb-3">
                  <Banners
                    name="Upload Item"
                    getBanners={fetchedBanners}
                    deleteBanners={deleteBanners}
                    setDeleteBanners={setDeleteBanners}
                    fetchBanners={fetchBanners}
                    form={form}
                  />
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Item Name</label>
                    <input
                      type="text"
                      value={form.values.item_name}
                      onChange={(e) =>
                        form.setField("item_name", e.target.value)
                      }
                      className={`form-control ${
                        form.errors.item_name ? "is-invalid" : ""
                      }`}
                      placeholder="Enter Item Name"
                    />
                    {form.errors.item_name && (
                      <div className="text-danger mt-1">
                        {form.errors.item_name}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Service Description</label>
                    <input
                      type="text"
                      value={form.values.description}
                      onChange={(e) =>
                        form.setField("description", e.target.value)
                      }
                      className={`form-control ${
                        form.errors.description ? "is-invalid" : ""
                      }`}
                      placeholder="Enter Description"
                    />
                    {form.errors.description && (
                      <div className="text-danger mt-1">
                        {form.errors.description}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      value={
                        form.values.warehoused_date
                          ? new Date(form.values.warehoused_date)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        form.setField("warehoused_date", e.target.value)
                      }
                      className={`form-control ${
                        form.errors.warehoused_date ? "is-invalid" : ""
                      }`}
                    />
                    {form.errors.warehoused_date && (
                      <div className="text-danger mt-1">
                        {form.errors.warehoused_date}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Item Quantity Unit</label>
                    <input
                      type="text"
                      value={form.values.quantity_unit}
                      onChange={(e) =>
                        form.setField("quantity_unit", e.target.value)
                      }
                      className={`form-control ${
                        form.errors.quantity_unit ? "is-invalid" : ""
                      }`}
                      placeholder="Enter Quantity Unit"
                    />
                    {form.errors.quantity_unit && (
                      <div className="text-danger mt-1">
                        {form.errors.quantity_unit}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Select Category</label>
                    <select
                      value={form.values.chamber_id || ""}
                      onChange={(e) =>
                        form.setField("chamber_id", e.target.value)
                      }
                      className={`form-select ${
                        form.errors.chamber_id ? "is-invalid" : ""
                      }`}
                    >
                      <option value="">Select Category</option>
                      {chambers?.map((category, index) =>
                        category.tag === "dry" ? (
                          <option value={category.chamber_id} key={index}>
                            {category.chamber_name}
                          </option>
                        ) : null
                      )}
                    </select>
                    {form.errors.chamber_id && (
                      <div className="text-danger mt-1">
                        {form.errors.chamber_id}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="card-footer d-flex justify-content-end gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/dry-warehouse")}
                  className="btn btn-secondary"
                >
                  Exit
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary"
                >
                  Save {isLoading && <Spinner />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateService;
