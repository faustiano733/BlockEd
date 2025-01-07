import "@styles/Confirm.css";

export default function Confirm(props){
  if(props.visible && props.text) return(
    <div className="confirmConteiner">
      <div className="confirm">
        {/*<h5 className="confirmHeader">Atenção</h5>*/}
        <h4 className="confirmTxt">{props.text}</h4>
        <div className="confirmCancel" onClick={props.onCancel && props.onCancel}>Cancelar</div>
	<div className="confirmOk" onClick={props.onOk && props.onOk}>Ok</div>
      </div>
    </div>
  );
}
