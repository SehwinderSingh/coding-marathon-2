import { useContext } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import NotFoundPage from "./pages/NotFoundPage";
import JobPage from "./pages/JobPage";
import AddJobPage from "./pages/AddJobPage";
import EditJobPage from "./pages/EditJobPage";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/SignupPage";
import { AuthContext } from "./context/AuthContext";

const App = () => {
  const { user } = useContext(AuthContext);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobPage />} />

        {/* Protected routes: only for logged-in users */}
        <Route
          path="/add-job"
          element={user ? <AddJobPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit-job/:id"
          element={user ? <EditJobPage /> : <Navigate to="/login" />}
        />

        {/* Only for logged-out users */}
        <Route
          path="/signup"
          element={!user ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/" />}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;