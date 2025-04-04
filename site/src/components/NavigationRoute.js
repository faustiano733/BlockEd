"use client";

import {usePathname} from "next/navigation";
import "@styles/NavigationRoute.css";



function Route(props){
  return(
  <>
  <div className="route">{props.route ? props.route : "Início"}</div>
  <div className="proximo" style={(props.proximo ? {} : {display: "none"})}>{">"}</div>
  </>
  )
}
export default function NavigationRoute(props){
  const pathname = usePathname()+props.diretorios;
  return(
   <div id="barra">
    {
     pathname.split("/").map((elemento, index)=>{
     let proximo = (index < pathname.split("/").length - 1)
     return(
       <Route key={elemento+index} route={elemento} proximo={proximo}/>
    )
    })
    }
   </div>
  );
}
