import "../global.css";
import { useFonts } from "expo-font"
import { AuthProvider } from "@/context/auth.context";
import RootLayout from "./rootLayout";
import { Text, TextInput } from "react-native"

export default function Layout() {
  const [fontsLoaded] = useFonts({
    PoppinsBlack: require("../assets/fonts/Poppins-Black.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    PoppinsExtraBold: require("../assets/fonts/Poppins-ExtraBold.ttf"),
    PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
  });


  if (!fontsLoaded) return null;

  const setDefaultProps = (component: any) => {
    component.defaultProps = component.defaultProps || {};
    component.defaultProps.allowFontScaling = false;
  };
  
  // Apply to both Text and TextInput
  setDefaultProps(Text);
  setDefaultProps(TextInput);
  return (
    <AuthProvider>
      <RootLayout/>
    </AuthProvider>
  );
}
