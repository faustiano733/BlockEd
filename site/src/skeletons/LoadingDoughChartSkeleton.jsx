import {StudentIcon} from "@icon";

export default function LoadingDoughChartSkeleton(){
    /*function DoughChart(){
        return(
            <div style={styles.doughChart}>
                <div style={styles.icon}></div>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    //alignItems: "center",
                    gap: 10,
                    width: "100%",
                    height: "100%",
                    //background: "black"
                }}>
                    <div style={{...styles.rect, width: 120}}></div>
                    <div style={{...styles.rect, width: 60}}></div>
                </div>
                <div style={{...styles.rect, width: 90}}></div>
            </div>
        )
    }*/

    return(
        <div style={styles.container}>
            <div style={{display: "flex", width: "100%", gap: 6, justifyContent: "center", alignItems: "center"}}>
                <div style={{...styles.rect, minWidth: 150, height: 13, marginBottom: 2}}></div>
            </div>
            <div style={{display: "flex", width: "100%", gap: 10, justifyContent: "center", alignItems: "center", height: "100%"}}>
                <div style={styles.circle}></div>
                <div style={{display: "flex", flexDirection: "column", gap: 6, justifyContent: "center", alignItems: "center"}}>
                    <div style={{...styles.rect, minWidth: 80}}></div>
                    <div style={{...styles.rect, minWidth: 80}}></div>
                    <div style={{...styles.rect, minWidth: 80}}></div>
                </div>
                {/*<div style={{display: "flex", width: "100%", gap: 3, flexDirection: "column"}}>
                    <div style={styles.innerSquare}></div>
                    <div style={styles.innerSquare}></div>
                </div>*/}
            </div>
            {/*<div style={{display: "flex", width: "100%", gap: 6, justifyContent: "space-between", alignItems: "center", paddingBottom: 30}}>
                <div style={{...styles.rect, minWidth: 50, height: 10}}></div>
                <div style={{...styles.rect, minWidth: 50, height: 10}}></div>
                <div style={{...styles.rect, minWidth: 50, height: 10}}></div>
                <div style={{...styles.rect, minWidth: 50, height: 10}}></div>
            </div>*/}
        </div>
    )
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        //justifyContent: "center",
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
    },
    doughChart: {
        with: "100%",
        display: "flex",
        borderRadius: 10,
        padding: 10,
        gap: 10,
        justifyContent: "space-between",
        background: "rgba(137, 146, 154, 0.1)"
    },
    icon: {
        height: 37,
        width: 37,
        minHeight: 37,
        minWidth: 37,
        borderRadius: 100,
        background: "rgba(0, 0, 0, 0.1)"
    },
    rect: {
        height: 11.5,
        borderRadius: 100,
        background: "rgba(0, 0, 0, 0.1)",
        width: 10
    },
    square: {
        height: "100%",
        width: "100%",
        background: "rgba(0, 0, 0, 0.1)",
        borderRadius: 10,
        padding: 10
    },
    innerSquare: {
        height: 30,
        width: 30,
        background: "rgba(0, 0, 0, 0.15)",
        borderRadius: 5
    },
    circle: {
        width: 70,
        height: 70,
        borderRadius: 100,
        background: "transparent",
        border: "solid 8px rgba(0, 0, 0, 0.1)"
    }


}