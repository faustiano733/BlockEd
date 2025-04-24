import "@styles/Button.css";

export default function Button(props){
  return(
    <button className={`button ${props.className || ""}`}  onClick={props.onClick && props.onClick} style={props.style ? props.style : null}>
      {props.children}
    </button>
  );
}
