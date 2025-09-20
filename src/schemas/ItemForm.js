import * as YUP from "yup";

export const itemFormValidation = YUP.object({
  item_name: YUP.string().required("Item Name is required"),
  chamber_id: YUP.string().required("Category Required"),
  warehoused_date: YUP.date().default(()=> new Date()).required("Date required"),
  description: YUP.string().required("Description is required"),
  quantity_unit: YUP.string().required("Quantity required"),
  sample_image: YUP.mixed().required("Select a file"),
});
