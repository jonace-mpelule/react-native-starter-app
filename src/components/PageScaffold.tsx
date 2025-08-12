import { View, Text } from 'react-native'
import React from 'react'
import { useThemeMode } from '@/stores/thememode.store'
import { THEME_COLORS } from '@/styles/colors'
import { StatusBar } from 'expo-status-bar'

const PageScaffold = ({ children }: any) => {
    const { theme } = useThemeMode()
    const Background = THEME_COLORS(theme).Background
    return (
        <View style={{ ...Background }}>
            <StatusBar style={theme == "dark" ? "light" : "dark"} />
            {children}
        </View>
    )
}

export default PageScaffold