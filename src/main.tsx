import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Providers from "./lib/Providers.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Providers>
    <App />
    <ToastContainer />
  </Providers>
  // </StrictMode>,
);
