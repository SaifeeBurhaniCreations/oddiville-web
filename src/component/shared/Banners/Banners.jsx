import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
const Banners = ({
  form,
  getBanners,
  deleteBanners,
  setDeleteBanners,
  // formError,
  // formTouched,
  name = "upload banner",
  onFileChange,
  setFieldValue,
}) => {
  const bannerRef = useRef();

  const [banner, setBanner] = useState({
    banner: null,
    preview: "",
  });
  const [typeCheckError, setTypeCheckError] = useState("");


  const updateBanner = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const arr = new Uint8Array(e.target.result).subarray(0, 4);
      let header = "";
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }
      const isPNG = header.startsWith("89504e47");
      const isJPG = header.startsWith("ffd8");

      if (isPNG || isJPG) {
        const previewReader = new FileReader();
        previewReader.onload = () => {
          setBanner({
            banner: file,
            preview: previewReader.result,
          });

          if (setFieldValue) {
            setFieldValue("sample_image", file);
          }
        };
        previewReader.readAsDataURL(file);

        if (onFileChange) {
          onFileChange({ target: { files: [file] } });
        }
      } else {
        setBanner({ banner: null, preview: "" });
        setTypeCheckError("Only valid PNG and JPG images are allowed");

        if (bannerRef?.current) {
          bannerRef.current.value = "";
        }

        if (setFieldValue) {
          setFieldValue("sample_image", null);
        }
      }
    };

    reader.readAsArrayBuffer(file.slice(0, 4));
  };

  useEffect(() => {
    // fetchBanners(banner.banner);
  }, [banner]);

  return (
    <>
      <input
        type="file"
        name="sample_image"
        accept="image/png, image/jpeg"
        ref={bannerRef}
        onChange={(e) => updateBanner(e.target.files[0])}
        style={{ visibility: "hidden" }}
      />
      <label htmlFor="">
        {name}
        {form?.errors.sample_image && (
          <span className="text-danger fw-normal fs-error">
            &emsp;{form.errors.sample_image}
          </span>
        )}
      </label>

      <div className="projects-banners">
        {getBanners ? (
          <div
            className={`layout ${
              deleteBanners?.includes(getBanners?.key) ? "fade-cs" : ""
            }`}
          >
            {banner?.preview ? (
              <button
                type="button"
                onClick={() => setBanner({ banner: null, preview: "" })}
                className="btn remove-btn-cs bg-gradient-danger mt-2"
              >
                Remove
              </button>
            ) : (
              <button
                type="button"
                onClick={() => bannerRef.current?.click()}
                className="btn remove-btn-cs bg-gradient-success m-0"
              >
                Change
              </button>
            )}
            {banner?.preview ? (
              <img src={banner.preview} alt="Preview" />
            ) : (
              <img src={getBanners?.url} alt="" />
            )}
          </div>
        ) : (
          <div className="layout">
            {banner?.preview && (
              <button
                type="button"
                onClick={() => setBanner({ banner: null, preview: "" })}
                className="btn bg-gradient-danger remove-btn-cs mt-2"
              >
                Remove
              </button>
            )}
            {banner.banner ? (
              <img src={banner.preview} alt="Preview" />
            ) : (
              <div className="d-flex flex-column">
                <button
                  type="button"
                  onClick={() => bannerRef.current?.click()}
                  className="btn btn-default"
                >
                  <i className="fa-solid fa-plus" /> &nbsp; {name}
                </button>
                {typeCheckError && (
                  <sub className="text-danger text-center">
                    {typeCheckError}
                  </sub>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Banners;
