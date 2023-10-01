import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Products from "./js_files/Products";
import Cart from "./js_files/Cart";
import Thanks from "./js_files/Thanks";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/thanks" element={<Thanks />} />
      </Routes>
    </Router>
  );
}

export default App;
