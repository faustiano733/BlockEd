import "@styles/Button.css";

export default function Button(props){
  return(
    <div className="default button"  onClick={props.onClick && props.onClick} style={props.style ? props.style : null}>
      {props.children}
    </div>
  );
}
