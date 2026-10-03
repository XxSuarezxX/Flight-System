import { createBrowserRouter } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import Flights from "../pages/Flights";
import Countries from "../pages/Countries";
import Cities from "../pages/Cities";
import Airports from "../pages/Airports";
import Users from "../pages/Users";
import AdminLayout from "../pages/AdminLayout";
import Home from "../pages/Home";
import Profile from "../pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "countries", element: <Countries /> },
      { path: "cities", element: <Cities /> },
      { path: "airports", element: <Airports /> },
      { path: "flights", element: <Flights /> },
      { path: "users", element: <Users /> },
    ],
  },
]);

export default router;