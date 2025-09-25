import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
const Banners = ({
  fetchBanners,
  getBanners,
  deleteBanners,
  setDeleteBanners,
  name = "upload banner",
  onFileChange,
  form,
}) => {
  const bannerRef = useRef();
  const [banner, setBanner] = useState({
    banner: null,
    preview: "",
  });

  const updateBanner = (file) => {
    if (!file) return;
    // if (!["image/png", "image/jpeg"].includes(file.type)) {
    //   setTypeCheck("Only PNG and JPG formats allowed");
    // } else {
    const reader = new FileReader();
    reader.onload = (e) => {
      // console.log(e.target.result); return

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
          // if (form.setField) {
          //   form.setField("sample_image", file);
          // }
        };
        previewReader.readAsDataURL(file);
        if (onFileChange) {
          onFileChange({ target: { files: [file] } });
        }
      } else {
        setBanner({ banner: null, preview: "" });
        setTypeCheckError("Only valid PNG and JPG images are allowed");
        if (bannerRef.current) {
          bannerRef.current.value = "";
        }
        if (form.setField) {
          form.setField("sample_image", null);
        }
      }
    };

    reader.readAsArrayBuffer(file.slice(0, 4));
    // }
  };

  useEffect(() => {
    fetchBanners(banner.banner);
  }, [banner]);

  return (
    <>
      {/* <div className="card my-3"> */}
      {/* <div className="card-header pt-4 pb-2">
          <div className="flex-cs header">
            <h6>
              Add Banner
              <span data-tooltip="Preview">
                <button
                  className="cs-btn"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-banner"
                >
                  <i
                    className="fa-regular fa-lg fa-circle-info"
                    style={{ color: "#aaa" }}
                  />
                </button>
              </span>
            </h6>
          </div>
        </div> */}
      {/* <div className="card-body"> */}
      <input
        className="hide-me"
        type="file"
        accept="image/png, image/jpeg"
        ref={bannerRef}
        onChange={(e) => {
          updateBanner(bannerRef.current.files[0]);
          console.log(bannerRef.current.files[0]);
          form.setField("sample_image", e.target.files[0].name)
        }}
        style={{ visibility: "hidden" }}
      />
      <div className="projects-banners">
        {getBanners ? (
          <>
            <div className="mb-2 w-100 header">
              {/* <h5 className="m-0">Add Banner</h5> */}
            </div>
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
                  change
                </button>
              )}
              {banner?.preview ? (
                <img src={banner.preview} alt="Preview" />
              ) : (
                <img src={getBanners?.url} alt="" />
              )}
            </div>
          </>
        ) : (
          <>
            <div className="mb-2 w-100 header">
              {/* <h5 className="m-0">Add Banner</h5> */}
            </div>
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
                <button
                  type="button"
                  onClick={() => bannerRef.current?.click()}
                  className={
                    "btn btn-default" +
                    (form.errors.sample_image && " border border-danger")
                  }
                >
                  <i className="fa-solid fa-plus" /> &nbsp; {name}
                </button>
              )}
            </div>
          </>
        )}
      </div>
      {/* </div> */}
      {/* </div> */}
    </>
  );
};

export default Banners;
