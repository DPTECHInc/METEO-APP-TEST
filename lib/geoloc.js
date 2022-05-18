//Imports
import * as Location from "expo-location";

export default async function geoLoc() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "denied") {
        console.log(status, "L'utilisateur a refusé l'autorisation");
        return status;
    }
    if (status !== "granted") {
        console.log(status, "l'utilisateur a accepté l'autorisation, merci de patienter");
        return status;
    }

    let locationData = await Location.getCurrentPositionAsync({});
    return { lat: locationData.coords.latitude, long: locationData.coords.longitude };
}
