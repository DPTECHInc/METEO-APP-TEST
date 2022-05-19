//Import
import React, { useEffect, useState } from "react";
import { Text, TextInput, View, ScrollView, Image, StyleSheet, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import geoLoc from "../lib/geoloc";

//FONCTION principale
export default function Weather() {
    const [weatherData, setWeatherData] = useState({});
    const [weatherCity, setWeatherCity] = useState("");

    //FETCH vers l'API
    const getWeather = async () => {
        //Récupération réponse fetch et mise en valeur de la réponse
        let locationData = await geoLoc();
        //Définition des const de l'API
        let key = "0ee7d848f425be4a341a2b355b17b4a4";
        let timestamp = 10;
        let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${locationData.lat}&lon=${locationData.long}&lang=fr&units=metric&cnt=${timestamp}&appid=${key}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            //Mise en place des Datas en AsyncStorage
            await AsyncStorage.setItem("@weatherData", JSON.stringify(data));
            setWeatherData(data);
            console.log("fetch OK", weatherData);
        } catch (error) {
            console.log("fetch KO", error);
        }
    };
    const getCityWeather = async () => {
        let key = "0ee7d848f425be4a341a2b355b17b4a4";
        let timestamp = 10;
        let url = `https://api.openweathermap.org/data/2.5/forecast?q=${weatherCity}&lang=fr&units=metric&cnt=${timestamp}&appid=${key}`;
        const response = await fetch(url);
        const data = await response.json();
        setWeatherData(data);
    };
    useEffect(async () => {
        const data = JSON.parse(await AsyncStorage.getItem("@weatherData"));
        try {
            if (data) {
                setWeatherData(data);
            } else {
                getWeather();
            }
        } catch (e) {
            console.log(e);
        }
    }, []);

    // CONVERSION Data en modèle FR / OBSOLETE
    // const sortByDate = (forecast) => {
    //     let sortedForecast = [];
    //     forecast.list.forEach((e) => {
    //         let date = new Date(e.dt * 1000).toLocaleDateString("fr").split(",")[0];
    //         if (!sortedForecast[date]) {
    //             sortedForecast[date] = [e];
    //         } else {
    //             sortedForecast[date].push(e);
    //         }
    //         return sortedForecast;
    //     });
    // };
    //AFFICHAGE Conditionnel selon réponse API
    const renderForcast =
        weatherData != null ? (
            weatherData?.list?.map((element, index) => {
                return (
                    <View style={styles.contentContainer} key={index}>
                        <Text style={{ color: "white" }}>{element.dt_txt}</Text>
                        <Image
                            source={{
                                uri: "http://openweathermap.org/img/wn/" + element.weather[0].icon + "@2x.png",
                            }}
                            style={{ width: 130, height: 150 }}
                        />
                        <View>
                            <Text style={{ color: "white" }}>
                                Min temp:{element.main.temp_min + "°c"} / Max temp:{element.main.temp_max + "°c"}
                            </Text>
                            <Text style={{ color: "white" }}>{element.weather[0].description}</Text>
                            <Text style={{ color: "white" }}>Vitesse du vent: {element.wind.speed + "Km/h"}</Text>
                        </View>
                    </View>
                );
            })
        ) : (
            <View style={styles.errorMessage}>
                <Text>Merci d'accepter la demande de localisation en cliquant sur le bouton ci-dessous</Text>
            </View>
        );
    // const renderSearch =
    // weatherCity != null ?
    //     return (
    //         <View>
    //             <Text>Voici la météo à {weatherCity}</Text>
    //         </View>
    //     ) : (<View></View>)

    return (
        <View>
            <View style={styles.buttonMeteo}>
                <Button title="Voir ma météo" onPress={getWeather} />
            </View>
            <View style={styles.buttonVille}>
                <TextInput
                    placeholder="Choisir la Ville.."
                    onChange={(e) => setWeatherCity(e.target.value)}
                    value={weatherCity ?? ""}
                />
                <Button style={{ paddingTop: "5%" }} title="Rechercher" onPress={getCityWeather} />
            </View>
            {/* <View>{renderSearch}</View> */}
            <ScrollView horizontal style={styles.jour}>
                {renderForcast}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonMeteo: {
        padding: "10%",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonVille: {
        justifyContent: "center",
        alignItems: "center",
        borderColor: "black",
        paddingBottom: "10%",
    },
    jour: {
        backgroundColor: "#111111",
        flexDirection: "row",
        height: "100%",
    },
    ligne: {
        alignItems: "center",
    },
    contentContainer: {
        justifyContent: "center",
        alignItems: "center",
        paddingRight: "5px",
        paddingLeft: "10px",
    },
    infoText: {
        color: "#FFFFFF",
    },
    errorMessage: {
        justifyContent: "center",
        alignItems: "center",
    },
});
