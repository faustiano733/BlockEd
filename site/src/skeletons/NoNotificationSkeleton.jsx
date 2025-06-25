import {NotificationIcon} from "@icon";

export default function NoNotificationSkeleton(){
	return(
		<div style={styles.container}>
			<div style={styles.iconContainer}>
				<NotificationIcon color="#b8b8b8" fill/>
			</div>
			<span style={styles.text}>Sem alertas</span>
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