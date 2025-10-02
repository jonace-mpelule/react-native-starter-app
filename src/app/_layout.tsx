import '../global.css';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Text, TextInput } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LoadingWrapper from '@/components/LoadingWidget';
import { FONTFAMILY } from '@/constants/theme.values';
import { AppProvider } from '@/context/app.context';
import { AuthProvider } from '@/context/auth.context';
import RootLayout from './rootLayout';

SplashScreen.setOptions({
	duration: 1000,
	fade: true,
});

SplashScreen.preventAutoHideAsync();

export default function Layout() {
	const [fontsLoaded] = useFonts({
		RubikBlack: require('../assets/fonts/Rubik-Black.ttf'),
		RubikBold: require('../assets/fonts/Rubik-Bold.ttf'),
		RubikExtraBold: require('../assets/fonts/Rubik-ExtraBold.ttf'),
		RubikSemiBold: require('../assets/fonts/Rubik-SemiBold.ttf'),
		RubikMedium: require('../assets/fonts/Rubik-Medium.ttf'),
		RubikRegular: require('../assets/fonts/Rubik-Regular.ttf'),
	});

	useEffect(() => {
		if (fontsLoaded) {
			SplashScreen.hide();

			const setDefaultProps = (component: any) => {
				component.defaultProps = component.defaultProps || {};
				component.defaultProps.allowFontScaling = false;
				component.defaultProps.fontFamily = FONTFAMILY.RubikRegular.fontFamily;
			};

			setDefaultProps(Text);
			setDefaultProps(TextInput);
		}
	}, [fontsLoaded]);

	if (!fontsLoaded) return null;


  
	return (
		<GestureHandlerRootView>
			<AuthProvider>
				<LoadingWrapper>
					<AppProvider>
						<RootLayout />
					</AppProvider>
				</LoadingWrapper>
			</AuthProvider>
		</GestureHandlerRootView>
	);
}
