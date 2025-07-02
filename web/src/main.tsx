import { StrictMode } from "react";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { VisibilityProvider } from './providers/VisibilityProvider';
import App from './app';
import './index.css';

import Layout from "./app/layout";
import Index from "./app/index";


//Sider
import PersonRegisterSide from "@/app/sider/personregister/Side"
import BrugerProfilSide from "@/app/sider/minprofil/side"

import { cn, isBrowser } from "./lib/utils";


//ThemeProvider
import { ThemeProvider } from "@/components/theme-provider"

import {
  RootRoute,
  RouterProvider,
  Router,
  Route,
  Outlet,
} from "@tanstack/react-router";


const rootRoute = new RootRoute({
  component: Root,
});

const routeTree = rootRoute.addChildren([
  new Route({
    getParentRoute: () => rootRoute,
    path: "/",
    component: Index,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/personregister",
    component: PersonRegisterSide,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/minprofil",
    component: BrugerProfilSide,
  })
]);

const router = new Router({ routeTree });

function Root() {
  return (
    <VisibilityProvider>
      <div
        className={cn(
          "h-full w-full",
          isBrowser() &&
          "bg-[url('https://forum.cfx.re/uploads/default/5d811d13c320e5e2323aea587f2eb4802d28f705')] bg-cover",
        )}
      >
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Layout>
            <Outlet />
          </Layout>
        </ThemeProvider>
      </div>
    </VisibilityProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}


