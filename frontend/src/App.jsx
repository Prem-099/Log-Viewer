import { Toaster } from "react-hot-toast";
import { Routes, Route, redirect } from "react-router-dom";
import { LogProvider } from "./components/context/LogContext";
import { AuthProvider } from "./components/context/AuthContext";
import Home from "./pages/home";
import Dashboard from "./components/Dashboard/Dashboard";
import LogViewer from "./components/LogViewer/LogViewer";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";
import AccessToken from "./components/AccessToken/AccessToken";
import SourceManagenment from "./components/SourceRegister/SourceRegister";
import LogManager from "./components/LogManagement/logManagement";

function App() {
  return (
    <AuthProvider>
      <LogProvider>
        {/* Toast Container */}
        <Toaster position="top-right" reverseOrder={false} />

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/signup" element={<SignUpPage/>}/>
          <Route path="/logs" element={<LogViewer />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accesstoken" element={<AccessToken/>}/>
          <Route path="/source-management" element={<SourceManagenment/>}/>
          <Route path="/log-management" element={<LogManager/>}/>
        </Routes>

      </LogProvider>
    </AuthProvider>
  );
}

export default App;
