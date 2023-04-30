import Masonary from "../../components/masonary/Masonary";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import "./home.scss";

function Home() {
  const location = useLocation();
  const { category } = queryString.parse(location.search);

  return (
    <div className="home">
      <Masonary category={category} />
    </div>
  );
}

export default Home;
