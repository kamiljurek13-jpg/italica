import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initAmplitude, identifyABGroup } from "./lib/amplitude";
import { getABGroup } from "./hooks/useABGroup";

initAmplitude();
identifyABGroup(getABGroup());

createRoot(document.getElementById("root")!).render(<App />);
