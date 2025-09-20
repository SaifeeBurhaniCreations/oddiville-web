import * as YUP from "yup";

export const itemFormValidation = YUP.object({
  item_name: YUP.string().required("Item Name is required"),
  chamber_id: YUP.string().required("Category Required"),
  warehoused_date: YUP.string()
    .required("Date required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  description: YUP.string().required("Description is required"),
  quantity_unit: YUP.string().required("Quantity required"),
  //   sample_image: YUP.mixed().required("Select a file"),
  sample_image: YUP.mixed()
    .required("Select a file")
    .test("fileType", "Only PNG and JPG images are allowed", (value) => {
      return value && ["image/png", "image/jpeg"].includes(value.type);
    })
    .test("fileSize", "File size too large (max 5MB)", (value) => {
      return value && value.size <= 5 * 1024 * 1024;
    }),
});
