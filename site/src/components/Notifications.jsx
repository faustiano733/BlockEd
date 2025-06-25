"use client";
import "@styles/Notifications.css";
import {NotificationIcon} from "@icon";
import {useState, useEffect} from "react";
import { useAlert } from "@/context/AlertContext";
import NoNotificationSkeleton from "@/skeletons/NoNotificationSkeleton"
 
export default function	Notifications(){
	const [loadingNot, setLoadingNot] = useState(true);
	const [data, setData] = useState([])
	const {showAlert} = useAlert();

	useEffect(() => {
  		const controller = new AbortController();
  		let isActive = true;

  		async function fetchData() {
    		while (isActive) {
      			if (document.hidden) {
        			await new Promise(resolve => setTimeout(resolve, 1000));
        			continue;
      			}

      			try {
        			let obj = await fetch("/api/alerts", { signal: controller.signal });
        			//if (!obj.ok) throw new Error("Erro na resposta da API");
        			let res = await obj.json();
        			setData(res);
      			} catch (error) {
        			console.log("Erro ao buscar notificações:", error);
      			} finally {
        			setLoadingNot(false);
      			}

      			await new Promise(resolve => setTimeout(resolve, 10000));
    		}
  		}

  		fetchData();

  		return () => {
    		isActive = false;
    		controller.abort();
  		};
	}, []);

	
	if (loadingNot) {
  		return <div className="notificationsContainer"><span>Carregando notificações...</span></div>
	}

	if (!data || data.length === 0) {
  		return <div className="notificationsContainer"><NoNotificationSkeleton/></div>
	}

	return (
  		<div className="notificationsContainer">
    		{data.map((elemento, index) => (
      			<div className="notification" key={"not" + elemento.id}>
        			<NotificationIcon />
        			<span>{elemento.text}</span>
        			<small>{new Date(elemento.createdAt).toLocaleString("sv-SE")}</small>
      			</div>
    		))}
  		</div>
	);
}