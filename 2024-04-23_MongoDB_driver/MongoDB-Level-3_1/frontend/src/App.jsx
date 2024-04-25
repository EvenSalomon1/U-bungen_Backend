import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Detailpage from "./pages/Detailpage/Detailpage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detail" element={<Detailpage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
