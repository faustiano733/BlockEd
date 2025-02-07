"use client";
import "@styles/Loading.css";
import {LoadingIcon} from "@icon";

export default function Loading(props){
	return(
		<div className="LoadingComponent" style={{background: props.bg ? props.bg : "white"}}>
			<LoadingIcon color="#358bff"/>			
		</div>
	);
}