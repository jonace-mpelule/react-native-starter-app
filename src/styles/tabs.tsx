import { FONTFAMILY } from "@/constants/theme.values"
import { StyleSheet } from "react-native";
import { COLORS, THEME_COLORS } from "./colors";

export const TABS_STYLE = (theme: "dark" | "light") => StyleSheet.create({
    inactiveText: {
        fontSize: 11.5,
        color: THEME_COLORS(theme).InactiveText.color,
        fontFamily: "PoppinsMedium",
    },
    activeText: {
        fontSize: 11.5,
        color: COLORS.yellow.backgroundColor,
        fontFamily: "PoppinsSemiBold",
    },
});