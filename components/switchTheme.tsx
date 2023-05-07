import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

const SwitchTheme = () => {
  //we store the theme in localStorage to preserve the state on next visit with an initial theme of dark.
  const [theme, setTheme] = useState(typeof window !== "undefined" ? window.localStorage.getItem('theme') : '')
  
  typeof window !== "undefined" ? window.localStorage.setItem("theme", theme || '') : false;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "wireframe" : "dark");
  };

  useEffect(() => {
    const body = document.documentElement.setAttribute('data-theme', theme || '');
  }, [theme]);


  return (
    <button className="btn btn-circle" onClick={toggleTheme}>
      {theme === "dark" ? (
        <FontAwesomeIcon icon={faMoon} />
      ) : (
        <FontAwesomeIcon icon={faSun} />
      )}
    </button>
  );
};

export default SwitchTheme;