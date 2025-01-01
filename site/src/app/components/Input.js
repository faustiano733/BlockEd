import "@styles/Input.css";

export default function Input(props){
  return(
    <div className="inputConteiner">
      {props.label && <label>{props.label}</label>}
      <input id={props.id && props.id} type={props.type ? props.type : "text"} placeholder={props.placeholder ? props.placeholder : ""}/>
      {props.icon && props.icon}
    </div>
  );
}
