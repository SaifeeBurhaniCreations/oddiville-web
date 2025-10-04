// import Home from "../../component/feature/Home/Home";
// import Logout from "../../component/shared/Auth/Logout";
// import Services from "../../component/feature/Services/View/Services";
// import CreateService from "../../component/feature/Services/Create/CreateService";
// import WorkLocation from "../../component/feature/work-location/View/WorkLocation";
// import Lane from "../../component/feature/Lane/View/Lane";
// import RawMaterial from "../../component/feature/RawMaterial/RawMaterial";
// import ThirdPartyRM from "../../component/feature/third-party-raw-material/View/RawMaterial";
// import AddThirdPartyRM from "../../component/feature/third-party-raw-material/Create/AddRawMaterial";
// import Chamber from "../../component/feature/Services/Chamber/Chamber";
import Home from '@/pages/Home/Home';
import Logout from '@/pages/Auth/Logout';
import Services from '@/pages/Services/Services';
import CreateService from '@/pages/Services/CreateService';
import WorkLocation from '@/components/feature/work-location/View/WorkLocation';
import Lane from '@/components/feature/Lane/View/Lane';
import RawMaterial from '@/components/feature/RawMaterial/RawMaterial';
import ThirdPartyRM from '@/components/feature/third-party-raw-material/View/RawMaterial';
import AddThirdPartyRM from '@/components/feature/third-party-raw-material/Create/AddRawMaterial';
import Chamber from '@/pages/Chamber/Chamber';


const rootRoutes = [
  {
    path: "",
    element: <Home />,
  },
  {
    path: "work-location",
    element: <WorkLocation />,
  },
  {
    path: "work-location/:id",
    element: <WorkLocation />,
  },
  {
    path: "lane",
    element: <Lane />,
  },
  {
    path: "lane/:id",
    element: <Lane />,
  },
  {
    path: "dry-warehouse",
    element: <Services />,
  },
  {
    path: "dry-warehouse/add-item",
    element: <CreateService />,
  },
  {
    path : "frozen-warehouse/create-chamber",
    element:<Chamber/>
  },
  {
    path: "dry-warehouse/update-warehouse/:id",
    element: <CreateService />,
  },
  {
    path: "raw-material",
    element: <RawMaterial />,
  },
  {
    path: "raw-material/:id",
    element: <RawMaterial />,
  },
  {
    path: "raw-material-other",
    element: <ThirdPartyRM />,
  },
  {
    path: "raw-material-other/add",
    element: <AddThirdPartyRM />,
  },
  {
    path: "raw-material-other/update/:id",
    element: <AddThirdPartyRM />,
  },
  {
    path: "logout",
    element: <Logout />,
  },
];

export default rootRoutes;
