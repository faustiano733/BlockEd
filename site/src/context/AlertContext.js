// src/context/AlertContext.js
/*
"use client";
import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [text, setText] = useState("");
  const [top, setTop] = useState(-50)
  const [borderColor, setBorderColor] = useState("#ffa500") 


  function showAlert(message, option) {
    let tmp_bc = option == 1 ? "#00dd00" : option == 2 ?  "#ff6060" : "#ffa500";

    setBorderColor(tmp_bc);
    setText(message);
    setTop(20)

    setTimeout(()=>{
      setTop(-100)
    }, 2000)
  }

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
        <div style={{...styles.alert, top, borderColor}}>
          {text}
        </div>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}

const styles = {
  alert: {
    position: "fixed",
    top: "-100px",
    right: "20px",
    //red background: "#ffdfdf",
    //red border: "solid 1px #ff6060",
    background: "#ffffaa",
    border: "solid 1px #ffa500",
    //background: "#dfffdf",
    //border: "solid 1px #00dd00",
    maxWidth: 300,
    wordBreak: "break-word",
    color: "#af5500", //"#007700"*,
    padding: "12px 24px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    fontSize: "13px",
    transition: "all 0.5s",
    //borderTopRightRadius: 0,
    //borderBottomRightRadius: 0,
    //borderRight: "solid 3px",
  },
};*/// src/context/AlertContext.js
"use client";
import { createContext, useContext, useState, useCallback, useMemo } from "react";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [text, setText] = useState("");
  const [top, setTop] = useState(-100);
  const [borderColor, setBorderColor] = useState("#ffa500");

  const showAlert = useCallback((message, option) => {
    const tmp_bc = option === 1
      ? "#00dd00"
      : option === 2
        ? "#ff6060"
        : "#ffa500";

    setBorderColor(tmp_bc);
    setText(message);
    setTop(20);

    setTimeout(() => setTop(-100), 2000);
  }, []);

  // value nunca muda, então consumidores não re-renderizam
  const contextValue = useMemo(() => ({ showAlert }), [showAlert]);

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      <div style={{ ...styles.alert, top, borderColor }}>
        {text}
      </div>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}

const styles = {
  alert: {
    position: "fixed",
    top: "-100px",
    right: "20px",
    background: "#ffffaa",
    border: "solid 1px #ffa500",
    maxWidth: 300,
    wordBreak: "break-word",
    color: "#af5500",
    padding: "12px 24px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    fontSize: "13px",
    transition: "all 0.5s",
  },
};
