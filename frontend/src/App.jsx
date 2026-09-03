import Dashboard from "./pages/dashboard/ui";
import History from "./pages/history/ui";
import Analytics from "./pages/analytics/ui";
import Home from "./pages/homepage/home";
import AdminDashboard from "./pages/admin.dash/ui";
import Login from "./pages/loginpage/login";
import SignUp from "./pages/loginpage/signup";

function App() {
  const path = window.location.pathname;
  const authUser = JSON.parse(localStorage.getItem("authUser") || "null");

  if (path === "/login") return <Login />;
  if (path === "/signup") return <SignUp />;
  if (path === "/admin") {
    if (!authUser) {
      window.location.replace("/login");
      return null;
    }
    if (!authUser.is_admin) {
      window.location.replace("/dashboard");
      return null;
    }
    return <AdminDashboard />;
  }
  if (path === "/history") {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F8FC", padding: "24px 32px" }}>
        <History authUser={authUser} />
      </div>
    );
  }
  if (path === "/analytics") {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F8FC", padding: "24px 32px" }}>
        <Analytics authUser={authUser} />
      </div>
    );
  }
  if (path === "/dashboard") {
    if (!authUser) {
      window.location.replace("/login");
      return null;
    }
    if (authUser.is_admin) return <AdminDashboard />;
    return <Dashboard authUser={authUser} />;
  }
  return <Home />;
}

export default App;
