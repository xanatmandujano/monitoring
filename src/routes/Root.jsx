import React, { Suspense } from "react";
//Bootstrap
import ThemeProvider from "react-bootstrap/ThemeProvider";
//Components
import NavBar from "../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

const Root = () => {
  return (
    <>
      <Suspense fallback="loading">
        <ThemeProvider
          breakpoints={["xxl", "xl", "lg", "md", "sm", "xs"]}
          minBreakpoint="xxs"
        >
          <NavBar />
          <Outlet />
        </ThemeProvider>
      </Suspense>
    </>
  );
};

export default Root;
