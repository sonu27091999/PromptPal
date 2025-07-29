import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import ContentPage from "./components/Content/Content";

const root = document.createElement("div");
root.id = "__promptpal_ai_whisper_container";
document.body.append(root);

createRoot(root).render(
  <StrictMode>
    <ContentPage />
  </StrictMode>
);
