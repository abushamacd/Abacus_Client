import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    console.log("tiger");
  };

  return (
    <div>
      <h1
        onClick={handleTheme}
        className="text-[2vw] text-primary bg-secondary font-bold underline"
      >
        Hello world!
      </h1>
    </div>
  );
}

export default App;
