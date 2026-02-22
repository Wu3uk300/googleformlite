import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "../pages/HomePage/HomePage";
import { FormBuilderPage } from "../pages/FormBuilderPage/FormBuilderPage";
import { FormFillPage } from "../pages/FormFillPage/FormFillPage";
import { FormResponsesPage } from "../pages/FormResponsesPage/FormResponsesPage";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/forms/new", element: <FormBuilderPage /> },
  { path: "/forms/:id/fill", element: <FormFillPage /> },
  { path: "/forms/:id/responses", element: <FormResponsesPage /> },
]);