import Router from "./router/router";
import { Suspense } from "react";
import Loading from "./pages/loading/Loading";

function App() {
  return (
    <div className="App">
      <Suspense fallback={<Loading />}>
        <Router />
      </Suspense>
    </div>
  );
}

export default App;
