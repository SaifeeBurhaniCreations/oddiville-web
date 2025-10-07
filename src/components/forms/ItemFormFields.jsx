import useChamberManagement from  "@/hooks/useChamberManagement"
const ItemFormFields = ({ form, chambers  }) => {
  const {chambersList} = useChamberManagement()

  
  
  return(

  <div className="row g-3">
    <div className="col-md-6">
      <label className="form-label">Item Name</label>
      <input
        type="text"
        value={form.values.item_name}
        onChange={(e) => form.setField("item_name", e.target.value)}
        className={`form-control ${form.errors.item_name ? "is-invalid" : ""}`}
        placeholder="Enter Item Name"
      />
      {form.errors.item_name && (
        <div className="text-danger mt-1">{form.errors.item_name}</div>
      )}
    </div>
    <div className="col-md-6">
      <label className="form-label">Service Description</label>
      <input
        type="text"
        value={form.values.description}
        onChange={(e) => form.setField("description", e.target.value)}
        className={`form-control ${
          form.errors.description ? "is-invalid" : ""
        }`}
        placeholder="Enter Description"
      />
      {form.errors.description && (
        <div className="text-danger mt-1">{form.errors.description}</div>
      )}
    </div>
    <div className="col-md-6">
      <label className="form-label">Date</label>
      <input
        type="date"
        value={
          form.values.warehoused_date
            ? new Date(form.values.warehoused_date).toISOString().split("T")[0]
            : ""
        }
        onChange={(e) => form.setField("warehoused_date", e.target.value)}
        className={`form-control ${
          form.errors.warehoused_date ? "is-invalid" : ""
        }`}
      />
      {form.errors.warehoused_date && (
        <div className="text-danger mt-1">{form.errors.warehoused_date}</div>
      )}
    </div>
    <div className="col-md-6">
      <label className="form-label">Item Quantity Unit</label>
      <input
        type="text"
        value={form.values.quantity_unit}
        onChange={(e) => form.setField("quantity_unit", e.target.value)}
        className={`form-control ${
          form.errors.quantity_unit ? "is-invalid" : ""
        }`}
        placeholder="Enter Quantity Unit"
      />
      {form.errors.quantity_unit && (
        <div className="text-danger mt-1">{form.errors.quantity_unit}</div>
      )}
    </div>
    <div className="col-md-6">
      <label className="form-label">Select Chamber</label>
      <select
        value={form.values.chamber_id || ""}
        onChange={(e) => form.setField("chamber_id", e.target.value)}
        className={`form-select ${form.errors.chamber_id ? "is-invalid" : ""}`}
      >
        <option value="">Select Category</option>

        {chambersList.current?.map((category, index) =>
          category.tag === "dry" ? (
            <option value={category.chamber_id} key={index}>
              {category.chamber_name}
            </option>
          ) : null
        )}
      </select>
      {form.errors.chamber_id && (
        <div className="text-danger mt-1">{form.errors.chamber_id}</div>
      )}
    </div>
  </div>
)};

export default ItemFormFields;
