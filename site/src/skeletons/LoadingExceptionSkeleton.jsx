import {StudentIcon} from "@icon";

export default function LoadingExceptionSkeleton(){
    function Exception(){
        return(
            <div style={styles.exception}>
                <div style={styles.icon}></div>
                {/*<div style={{
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
                </div>*/}
                <div style={{...styles.rect, width: 30}}></div>
                <div style={styles.icon}></div>
            </div>
        )
    }

    return(
        <div style={styles.container}>
            <Exception/>
            <Exception/>
            <Exception/>
        </div>
    )
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        //alignItems: "center",
        gap: 20,
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
    exception: {
        with: "100%",
        display: "flex",
        borderRadius: 12,
        padding: 7,
        gap: 10,
        justifyContent: "space-between",
        alignItems: "center",
        background: "rgba(137, 146, 154, 0.1)"
    },
    icon: {
        height: 25,
        width: 25,
        minHeight: 27,
        minWidth: 27,
        borderRadius: 5,
        background: "rgba(0, 0, 0, 0.1)"
    },
    rect: {
        height: 11.5,
        borderRadius: 100,
        background: "rgba(0, 0, 0, 0.1)",
        width: 10
    }


}