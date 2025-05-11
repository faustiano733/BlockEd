"use client";
import "@styles/Notifications.css";
import {NotificationIcon} from "@icon";
import {useState, useEffect} from "react";
 
export default function	Notifications(){
	const[visible, setVisible] = useState(false);
	return(
			<>
			<div className="notificationsIcon" onClick={()=>{setVisible(!visible)}}>
				<NotificationIcon />
			</div>
			{ visible &&
			<div className="notificationsContainer">
				<div className="notification">
					Carlos Chagas Santos desinstalou o app do seu celular
				</div>
				<div className="notification">
					gvxgsjgdjsgdhghjdgfhdhgfdhfgdgfdggfjdgfgdhfdgfhdgf
				</div>
				<div className="notification">
					gvxgsjgdjsgdhghjdgfhdhgfdhfgdgfdggfjdgfgdhfdgfhdgf
				</div>
				<div className="notification">
					gvxgsjgdjsgdhghjdgfhdhgfdhfgdgfdggfjdgfgdhfdgfhdgf
				</div>
				<div className="notification">
					gvxgsjgdjsgdhghjdgfhdhgfdhfgdgfdggfjdgfgdhfdgfhdgf
				</div>
				<div className="notification">
					gvxgsjgdjsgdhghjdgfhdhgfdhfgdgfdggfjdgfgdhfdgfhdgf
				</div>
				<div className="notification">
					gvxgsjgdjsgdhghjdgfhdhgfdhfgdgfdggfjdgfgdhfdgfhdgf
				</div>
			</div>
			}
			</>
	)
}