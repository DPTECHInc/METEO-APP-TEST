//Import
import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import geoLoc from "../lib/geoloc";

//FONCTION principale
export default function Weather() {
    const [weatherData, setWeatherData] = useState({});

    //FETCH vers l'API
    const getWeather = async () => {
        //Récupération réponse fetch et mise en valeur de la réponse
        let locationData = await geoLoc();
        //Définition des const de l'API
        let key = "0ee7d848f425be4a341a2b355b17b4a4";
        let unité = "metric";
        let lang = "fr";
        let timestamp = 10;
        let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${locationData.lat}&lon=${locationData.long}&lang=${lang}&units=${unité}&cnt=${timestamp}&appid=${key}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            //Mise en place des Datas en AsyncStorage
            await AsyncStorage.setItem("@weatherData", JSON.stringify(data));
            setWeatherData(sortByDate(data));
            console.log("fetch OK", weatherData);
        } catch (error) {
            console.log("fetch KO", error);
        }
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

    // CONVERSION Data en modèle FR
    const sortByDate = (forecast) => {
        let sortedForecast = [];
        forecast.list.forEach((e) => {
            let date = new Date(e.dt * 1000).toLocaleDateString("fr").split(",")[0];
            if (!sortedForecast[date]) {
                sortedForecast[date] = [e];
            } else {
                sortedForecast[date].push(e);
            }
            return sortedForecast;
        });
    };
    //AFFICHAGE Conditionnel selon réponse API
    const renderForcast =
        weatherData != null ? (
            weatherData?.list?.map((element, index) => {
                return (
                    <View style={styles.contentContainer} key={index}>
                        <Text>{element.dt_txt}</Text>
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
            <View>
                <Text>Merci d'accepter la demande de localisation en cliquant sur le bouton ci-dessous</Text>
            </View>
        );
    return (
        <View>
            <View style={styles.buttonMeteo}>
                <Button title="Voir ma météo" onPress={getWeather} />
            </View>

            <View style={styles.jour}>{renderForcast}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonMeteo: {
        alignItems: "center",
        justifyContent: "center",
    },
    jour: {
        backgroundColor: "#111111",
        flexDirection: "row",
    },
    ligne: {
        alignItems: "center",
    },
    contentContainer: {
        paddingVertical: "30",
        paddingHorizontal: "40",
        flexWrap: "wrap",
        flexDirection: "row",
    },
    infoText: {
        color: "#FFFFFF",
    },
});
