import { Routes, Route, Navigate } from "react-router-dom";
import Store from "./components/Store";
import Confirmation from "./components/Confirmation";
import "./App.css";

function App() {
  return (
    <div className="">
      <main className="w-[1200px] max-w-full m-auto p-5">
        <Routes>
          <Route path="/" element={<Store />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
