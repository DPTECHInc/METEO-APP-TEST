import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Weather from "./components/weatherApp";

export default function App() {
    const Header = () => {
        return (
            <View style={styles.header}>
                <Text> Météo</Text>
                <Text>La météo de la semaine</Text>
            </View>
        );
    };
    const Footer = () => {
        return (
            <View style={styles.footer}>
                <Text>DPTECH INC</Text>
                <Text>APP METEO TEST</Text>
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <Header />
            <Weather />
            <Footer />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        width: "100%",
        height: "15%",
        backgroundColor: "#F2F2F2",
        alignItems: "center",
        justifyContent: "center",
    },
    footer: {
        paddingTop: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
});
