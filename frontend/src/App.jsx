import Home from "./pages/homepage/home";
import Login from "./pages/loginpage/login";
import SignUp from "./pages/loginpage/signup";
import SpinWheel from "./pages/spinwheel/spinwheel";
import UserSelection from "./pages/userselection/userselection";

function App() {
  if (window.location.pathname === "/login") return <Login />;
  if (window.location.pathname === "/signup") return <SignUp />;
  if (window.location.pathname === "/userselection") return <UserSelection />;
  if (window.location.pathname === "/spinwheel") return <SpinWheel />;
  return <Home />;
}

export default App