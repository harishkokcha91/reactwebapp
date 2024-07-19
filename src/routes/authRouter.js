import storage from "@/utils/storage";
import { Navigate, useLocation } from "react-router-dom";
import routes from "./modules";
import { searchRoute } from "./utils";

const AuthRouter = ({ children }) => {
  const isLogin = storage.get('token');
  const { pathname } = useLocation();
  const route = searchRoute(pathname, routes);
  const roles = route?.meta?.roles;

  // Login status
  if (isLogin) {
    return children;
  } else {
    //Not logged in, no permissions required, such as login page
    if (roles?.length === 0) {
      return children;
    }
    return <Navigate to="/login" replace />;
  }
};

export default AuthRouter;
