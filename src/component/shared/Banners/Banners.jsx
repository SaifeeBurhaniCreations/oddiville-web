import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
const Banners = ({
  fetchBanners,
  getBanners,
  deleteBanners,
  setDeleteBanners,
  formError,
  formTouched,
  name = "upload banner",
  onFileChange,
}) => {
  const bannerRef = useRef();
  const [banner, setBanner] = useState({
    banner: null,
    preview: "",
  });

  const updateBanner = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setBanner({
        banner: file,
        preview: reader.result,
      });
    };
    reader.readAsDataURL(file);

    if (onFileChange) {
      onFileChange({ target: { files: [file] } });
    }
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
        accept="image/png, image/jpeg"
        type="file"
        ref={bannerRef}
        onChange={(e) => updateBanner(e.target.files[0])}
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
                <div className="d-flex flex-column">
                  <button
                    type="button"
                    onClick={() => bannerRef.current?.click()}
                    className="btn btn-default"
                  >
                    <i className="fa-solid fa-plus" /> &nbsp; {name}
                  </button>
                  {/* <sub className="text-danger">Only PNG and JPG format supported</sub> */}
                </div>
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
