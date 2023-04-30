import "./notFound.scss";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div className="notfound">
      <img className="status" src="/images/404.png" alt="" />
      <p className="info">PAGE NOT FOUND</p>
      <div className="msg">
        <p>The page you are looking for might have been removed</p>
        <p>had its name changed or is temporarily unavailable</p>
      </div>
      <button onClick={handleBackHome}>Back Home</button>
    </div>
  );
}

export default NotFound;
