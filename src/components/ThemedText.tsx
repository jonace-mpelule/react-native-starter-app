import { FONTFAMILY } from "@/constants/theme.values"
import { useThemeMode } from "@/stores/thememode.store"
import { THEME_COLORS } from "@/styles/colors"
import { getFontSize } from "@/helpers/fontScaler"
import {Text} from "react-native"
import { TextStyle } from "react-native"

export default function ThemedText({text, fontSize, styles, children } : {text?: any, fontSize: number, styles? : TextStyle, children?: React.ReactNode} ) {
    const { theme } = useThemeMode()
    return children  ? <Text style={[
        {color: THEME_COLORS(theme).Text.color}, 
        styles || {...FONTFAMILY.PoppinsMedium}, 
        {fontSize: getFontSize(fontSize)}
    ]}>{children}</Text> : <Text style={[
        {color: THEME_COLORS(theme).Text.color}, 
        styles || {...FONTFAMILY.PoppinsMedium}, 
        {fontSize: getFontSize(fontSize)}
    ]}>{text}</Text>
}