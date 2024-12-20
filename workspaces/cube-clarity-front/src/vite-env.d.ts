/// <reference types="vite/client" />

declare module "react" {
  // @ts-types="@types/react"
  import React from "npm:react";
  export = React;
}

declare module "react-dom/client" {
  // @ts-types="@types/react-dom/client"
  import ReactDOM from "npm:react-dom/client";
  export = ReactDOM;
}
