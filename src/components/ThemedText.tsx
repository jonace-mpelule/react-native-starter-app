import { Text, type TextStyle } from 'react-native';
import { FONTFAMILY } from '@/constants/theme.values';
import { getFontSize } from '@/helpers/fontScaler';
import { useThemeMode } from '@/stores/thememode.store';
import { THEME_COLORS } from '@/styles/colors';

export default function ThemedText({
	text,
	fontSize,
	styles,
	children,
}: {
	text?: any;
	fontSize: number;
	styles?: TextStyle;
	children?: React.ReactNode;
}) {
	const { theme } = useThemeMode();
	return children ? (
		<Text
			style={[
				{ color: THEME_COLORS(theme).Text.color },
				styles || { ...FONTFAMILY.RubikMedium },
				{ fontSize: getFontSize(fontSize) },
			]}
		>
			{children}
		</Text>
	) : (
		<Text
			style={[
				{ color: THEME_COLORS(theme).Text.color },
				styles || { ...FONTFAMILY.RubikMedium },
				{ fontSize: getFontSize(fontSize) },
			]}
		>
			{text}
		</Text>
	);
}
