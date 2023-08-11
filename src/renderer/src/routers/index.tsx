//import { HashRouter, Route, Routes } from "react-router-dom";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import Home from "@pages/home";
import Settings from "@pages/settings";
import GeneralSettings from "@pages/GeneralSettings";

const Router = (): JSX.Element => {
  const routes = [
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/settings",
      element: <Settings />,
      children: [
        {
          path: "/settings",
          element: <GeneralSettings />
        }
      ]
    }
  ];

  return (
    <RouterProvider
      router={createMemoryRouter(routes, {
        initialIndex: 0
      })}
    />
  );
};

export default Router;
