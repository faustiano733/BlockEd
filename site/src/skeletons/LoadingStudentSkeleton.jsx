import {StudentIcon} from "@icon";

export default function LoadingStudentSkeleton(){
    function Student(){
        return(
            <div style={styles.student}>
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
    }

    return(
        <div style={styles.container}>
            <Student/>
            <Student/>
            <Student/>
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
    student: {
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
    }


}