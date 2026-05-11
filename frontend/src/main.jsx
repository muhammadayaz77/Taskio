import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./providers/AuthProviders.jsx";
import { SocketProvider } from "./providers/SocketProvider.jsx";
import { store } from "../store/index.js"; // 👈 redux store

export const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <SocketProvider>
            <App />
          </SocketProvider>
          <ReactQueryDevtools initialIsOpen={false} position="top" />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
