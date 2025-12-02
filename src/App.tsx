import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./LandingPage/LandingPage";
import { ChatDemo } from "./ChatDemo/ChatDemo";
import "./App.css";
import '@cometchat/chat-uikit-react/css-variables.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/demo-ui" element={<ChatDemo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
