import { NavLink } from "react-router-dom";

const Sidebar = ({ open, onClose }) => {
  return (
    <aside
      className={`sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 ${
        open ? "open" : "closed"
      }`}
      id="sidenav-main"
    >
      <div className="sidenav-header">
        <button
          className="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-xl-none"
          aria-label="Close sidebar"
          onClick={onClose}
          style={{ background: "none", border: "none" }}
        />
        <NavLink to="/" className="navbar-brand m-0">
          <img
            src="/assets/img/logo.png"
            className="navbar-brand-img h-100"
            alt="main_logo"
          />
        </NavLink>
      </div>
      <hr className="horizontal dark mt-0" />
      <div
        className="collapse navbar-collapse  w-auto "
        id="sidenav-collapse-main"
      >
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink to="/" className="nav-link  ">
              <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                <svg
                  width="12px"
                  height="12px"
                  viewBox="0 0 45 40"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <title>shop </title>
                  <g
                    stroke="none"
                    strokeWidth={1}
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      transform="translate(-1716.000000, -439.000000)"
                      fill="#FFFFFF"
                      fillRule="nonzero"
                    >
                      <g transform="translate(1716.000000, 291.000000)">
                        <g transform="translate(0.000000, 148.000000)">
                          <path
                            className="color-background opacity-6"
                            d="M46.7199583,10.7414583 L40.8449583,0.949791667 C40.4909749,0.360605034 39.8540131,0 39.1666667,0 L7.83333333,0 C7.1459869,0 6.50902508,0.360605034 6.15504167,0.949791667 L0.280041667,10.7414583 C0.0969176761,11.0460037 -1.23209662e-05,11.3946378 -1.23209662e-05,11.75 C-0.00758042603,16.0663731 3.48367543,19.5725301 7.80004167,19.5833333 L7.81570833,19.5833333 C9.75003686,19.5882688 11.6168794,18.8726691 13.0522917,17.5760417 C16.0171492,20.2556967 20.5292675,20.2556967 23.494125,17.5760417 C26.4604562,20.2616016 30.9794188,20.2616016 33.94575,17.5760417 C36.2421905,19.6477597 39.5441143,20.1708521 42.3684437,18.9103691 C45.1927731,17.649886 47.0084685,14.8428276 47.0000295,11.75 C47.0000295,11.3946378 46.9030823,11.0460037 46.7199583,10.7414583 Z"
                          />
                          <path
                            className="color-background"
                            d="M39.198,22.4912623 C37.3776246,22.4928106 35.5817531,22.0149171 33.951625,21.0951667 L33.92225,21.1107282 C31.1430221,22.6838032 27.9255001,22.9318916 24.9844167,21.7998837 C24.4750389,21.605469 23.9777983,21.3722567 23.4960833,21.1018359 L23.4745417,21.1129513 C20.6961809,22.6871153 17.4786145,22.9344611 14.5386667,21.7998837 C14.029926,21.6054643 13.533337,21.3722507 13.0522917,21.1018359 C11.4250962,22.0190609 9.63246555,22.4947009 7.81570833,22.4912623 C7.16510551,22.4842162 6.51607673,22.4173045 5.875,22.2911849 L5.875,44.7220845 C5.875,45.9498589 6.7517757,46.9451667 7.83333333,46.9451667 L19.5833333,46.9451667 L19.5833333,33.6066734 L27.4166667,33.6066734 L27.4166667,46.9451667 L39.1666667,46.9451667 C40.2482243,46.9451667 41.125,45.9498589 41.125,44.7220845 L41.125,22.2822926 C40.4887822,22.4116582 39.8442868,22.4815492 39.198,22.4912623 Z"
                          />
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <span className="nav-link-text ms-1">Home</span>
            </NavLink>
          </li>
          <li className="nav-item mt-3">
            <h6 className="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">
              Dry Warehouse
            </h6>
          </li>
          <li className="nav-item">
            <NavLink to="/dry-warehouse" className="nav-link">
              <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                {/* List Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                </svg>
              </div>
              <span className="nav-link-text ms-1">List Items</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" to="/dry-warehouse/add-item">
              <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
              </div>
              <span className="nav-link-text ms-1">Add Item</span>
            </NavLink>
          </li>

          

          <li className="nav-item mt-3">
            <h6 className="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">
              Frozen Chamber
            </h6>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="frozen-warehouse/create-chamber">
              <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    x="3"
                    y="10"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                  ></rect>
                  <path d="M7 10V6a5 5 0 0 1 10 0v4"></path>
                  <circle cx="12" cy="15" r="2"></circle>
                </svg>
              </div>
              <span className="nav-link-text ms-1">Add Chamber</span>
            </NavLink>
          </li>

          <li className="nav-item mt-3">
            <h6 className="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">
              Labour Location
            </h6>
          </li>
          <li className="nav-item">
            <NavLink to="work-location" className="nav-link">
              <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                {/* Location SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16px"
                  height="16px"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <span className="nav-link-text ms-1">List Locations</span>
            </NavLink>
          </li>

          <li className="nav-item mt-3">
            <h6 className="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">
              Production Lines
            </h6>
          </li>
          <li className="nav-item">
            <NavLink to="lane" className="nav-link">
              <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                {/* Lane / Road SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16px"
                  height="16px"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2v20" />
                  <path d="M18 2v20" />
                  <path d="M12 2v4" />
                  <path d="M12 10v4" />
                  <path d="M12 18v4" />
                </svg>
              </div>
              <span className="nav-link-text ms-1">List Lanes</span>
            </NavLink>
          </li>

          <li className="nav-item mt-3">
            <h6 className="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">
              Raw Material
            </h6>
          </li>
          <li className="nav-item">
            <NavLink to="raw-material" className="nav-link">
              <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                {/* Raw Material (Box / Package) Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16px"
                  height="16px"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <span className="nav-link-text ms-1">List Raw Material</span>
            </NavLink>
          </li>

          <li className="nav-item mt-3">
            <h6 className="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">
              Third Party Booking
            </h6>
          </li>
          <li className="nav-item">
            <NavLink to="raw-material-other" className="nav-link">
              <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                {/* Products (Stacked Boxes) Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16px"
                  height="16px"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </div>
              <span className="nav-link-text ms-1">List Products</span>
            </NavLink>
          </li>

          <li className="nav-item mt-3">
            <h6 className="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">
              Account pages
            </h6>
          </li>
          <li className="nav-item">
            <NavLink to="/logout" className="nav-link">
              <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                {/* Logout Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16px"
                  height="16px"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              <span className="nav-link-text ms-1">Logout</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
