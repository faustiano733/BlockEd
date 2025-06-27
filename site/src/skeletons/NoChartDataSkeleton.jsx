import {StudentsIcon} from "@icon";

function LineChartIcon(props){
  return  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={props.color ? props.color : defaultColor}><path d="M120-120v-80l80-80v160h-80Zm160 0v-240l80-80v320h-80Zm160 0v-320l80 81v239h-80Zm160 0v-239l80-80v319h-80Zm160 0v-400l80-80v480h-80ZM120-327v-113l280-280 160 160 280-280v113L560-447 400-607 120-327Z"/></svg>
}

function BarChartIcon(props){
  return <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={props.color ? props.color : defaultColor}><path d="M640-160v-280h160v280H640Zm-240 0v-640h160v640H400Zm-240 0v-440h160v440H160Z"/></svg>
}

export default function NoChartDataSkeleton(){
	return(
		<div style={styles.container}>
			<div style={styles.iconContainer}>
				<LineChartIcon color="#b8b8b8" fill/>
			</div>
			<span style={styles.text}>Sem dados</span>
		</div>
	)
}

const styles = {
	container: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		gap: 10,
		width: "100%",
		height: "100%",
		background: "transparent"
	},
	iconContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		padding: 6,
		border: "solid 2px #b8b8b8",
		borderRadius: 100
	},
	text: {
		fontWeight: "bold",
		fontSize: 13,
		color: "#b8b8b8",
		letterSpacing: 1.5
	}
}