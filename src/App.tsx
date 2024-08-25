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
    <>
      <h1
        onClick={handleTheme}
        className="dark:bg-primary text-3xl dark:text-secondary text-[red] font-bold underline"
      >
        Hello world!
      </h1>
    </>
  );
}

export default App;
