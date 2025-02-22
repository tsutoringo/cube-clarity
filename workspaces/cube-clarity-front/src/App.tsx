import { BrowserRouter, Route, Routes } from "react-router";
import { Main } from "./pages/Miain.tsx";
import { Playground } from "./pages/Playground/Playground.tsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="playground" element={<Playground />}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
