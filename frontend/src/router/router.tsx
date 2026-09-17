import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/AdminDashboard";
import Flights from "../pages/Flights";
import Countries from "../pages/Countries";
import Cities from "../pages/Cities";
import Airports from "../pages/Airports";
import Users from "../pages/Users";
import AdminLayout from "../pages/AdminLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },

      {
        path: "countries",
        element: <Countries />,
      },

      {
        path: "cities",
        element: <Cities />,
      },

      {
        path: "airports",
        element: <Airports />,
      },

      {
        path: "flights",
        element: <Flights />,
      },

      {
        path: "users",
        element: <Users />,
      },
    ],
  },
]);

export default router;