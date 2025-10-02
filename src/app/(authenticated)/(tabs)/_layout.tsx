import { Tabs } from "expo-router"
import { Text } from "react-native";
import {TABS_STYLE} from "@/styles/tabs"
export default () => {
    return (
        <Tabs screenOptions={{
            headerShown: false,
        }}/>
    )
}


const CustomLabel = ({ props, theme } : any) => {
    return (
        <Text style={[TABS_STYLE(theme).inactiveText, props.focused && TABS_STYLE(theme).activeText]}>
            {props.children}{" "}
        </Text>

    );
};