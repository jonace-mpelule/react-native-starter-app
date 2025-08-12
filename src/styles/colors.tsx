import { StyleSheet } from "react-native";

export const COLORS = StyleSheet.create({
    darkBackground: {
        backgroundColor: "#0C0C0C",
    },
    lightBackground: {
        backgroundColor: "#F9F9F9",
    },
    yellow: {
        backgroundColor: "#FFBF00",

    },
    darkAccentBackground: {
        backgroundColor: "#1A1A1A",
    },
    textWhite: {
        color: "white",
    },
    textBlack: {
        color: "#0C0C0C",
    },
    textInactive: {
        color: "#D9D9D9",
    },
    textInactiveSecondary: {
        color: "#CCCC",
    },
    errorRed: {
        color: "#FD2D2D"
    }
});


export const THEME_COLORS = (theme: "dark" | "light") => {
    const isDark = theme == "dark"
    return StyleSheet.create({
        Background: {
            backgroundColor: isDark ? "#0A0A0C" : "white"
        },
        FeintYellow: {
            backgroundColor: isDark ? "#16130B" : "#FFFCF2"
        },
        Text: {
            color: isDark ? "#F9F9F9" : "black"
        },
        InactiveText: {
            color: isDark ? "#8A909D" : "#8A909D"
        },
        BorderColor: {
            color: isDark ? "#242529" : "#DEDFE2"
        },
        FieldColor: {
            color: isDark ? "#242529" : "#DEDFE2"
        },
        FieldElevationColor: {
            color: isDark ? "#404040" : "white"
        }
    })
}