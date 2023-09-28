import { StyleSheet } from "react-native";

export const LogInScreenStyles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },
    avatar: {
        margin: 10
    },
    textInput: {
        margin: 10,
        width: "70%"
    },
    button: {
        margin: 10
    }
});

export const ManageFineStyles = StyleSheet.create({
    view: {
        padding: 20
    },
    avatar: {
        alignSelf: "center"
    },
    headline: {
        marginTop: 20
    },
    button: {
        margin: 20
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 20,
        bottom: 20,
    }
});