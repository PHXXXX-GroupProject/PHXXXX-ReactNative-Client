import { PropsWithChildren, Component } from "react";
import { useColorScheme, View, Text } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { styles } from "../styles/screen";

type SectionProps = PropsWithChildren<{
    title: string;
}>;

export function Section({ children, title }: SectionProps) {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <View style={styles.sectionContainer}>
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        color: isDarkMode ? Colors.white : Colors.black,
                    },
                ]}>
                {title}
            </Text>
            <Text
                style={[
                    styles.sectionDescription,
                    {
                        color: isDarkMode ? Colors.light : Colors.dark,
                    },
                ]}>
                {children}
            </Text>
        </View>
    );
}