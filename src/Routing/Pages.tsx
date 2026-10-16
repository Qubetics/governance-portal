import Path from "./Constant/RoutePaths";
import Home from "../Pages/Home/Home"
import Description from "../Pages/Description/Description";
import CreateProposal from "../Pages/CreateProposal/CreateProposal";
export default function PAGES() {
    return {
      PRIVATE_PAGES: [
        { path: Path.HOME, element: <Home /> },
        { path: Path.DESCRIPTION+"/:id", element: <Description /> },
        { path: Path.CREATEPROPOSAL, element: <CreateProposal /> },
      ],
    };
  }