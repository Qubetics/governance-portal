import Pages from "./Pages";
import Private from "./Private/Private";
const routes = [
  {
    path: "/",
    element: <Private />, // Wrap private pages with PrivateRoute
    children: Pages().PRIVATE_PAGES,
  },
];

export default routes;
