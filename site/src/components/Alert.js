"use client";
import "@styles/Alert.css";
import {useState, useEffect} from "react";

export default function Alert(){
	const[text, setText] = useState("");
	const[top, setTop] = useState(10);

	function alertar(texto){
		setText(texto);
		setTop(-20);
	}

	return(
		<div className="alertPopup" onClick={()=>{alertar("Bruh")}} style={{top}}>
			{text}
		</div>
	)
}