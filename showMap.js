import React, {Component} from 'react';
import {Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import GeoFencing from 'react-native-geo-fencing';


MapboxGL.setAccessToken(
  'pk.eyJ1Ijoic29sbzAwMyIsImEiOiJja2Y5dWxuaHIwaGx2MnFweDJscXA2NG94In0.B0VegnM-IbkUiyEYdToSuw',
);

const IS_ANDROID = Platform.OS === 'android';

export default class showMap extends Component {
    async UNSAFE_componentWillMount() {
        if (IS_ANDROID) {
            this.turnOnLocation();
            const is_Granted = await MapboxGL.requestAndroidLocationPermissions();
            this.setState({
                isAndroidPermissionGranted: is_Granted,
                isFetchingAndroidPermission: false,
            });
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            isAndroidPermissionGranted: false,
            isFetchingAndroidPermission: IS_ANDROID,
            coordinates: [[76.27108, 10.850516]],
            showUserLocation: [75.987450,10.938220],
            location: [76.27108, 10.850516],
            polygonCoordinates: [],
        };
    }

    componentDidMount() {
        fetch('http://mobilemate-001-site6.atempurl.com/api/Location')
            .then((response) => response.json())
            .then((json) => {
                json.Result.forEach((location) => {
                    const Coordinates = location.Coordinates.map(
                    (coordinate) => coordinate.LatLng.split(',')
                        .reverse()
                        .map((x) => +x),
                    ); 
                    this.setState({polygonCoordinates: [...this.state.polygonCoordinates, Coordinates] });
                });
            });

        let point = [
            76.116697,10.907111
        ];

        GeoFencing.containsLocation(point,this.state.polygonCoordinates)
            .then(() => console.log('point is within polygon'))
            .catch(() => console.log('point is NOT within polygon'))
    }

    render() {
        return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <MapboxGL.MapView
                    ref={(c) => (this._map = c)}
                    zoomLevel={14}
                    centerCoordinate={this.state.coordinates[0]}
                    showUserLocation={[75.987450,10.938220]}
                    style={styles.container}
                    userTrackingMode={this.state.userSelectedUserTrackingMode}>
                    
                    <MapboxGL.Camera
                        zoomLevel={13}
                        animationMode={'flyTo'}
                        animationDuration={0}
                        ref={(c) => (this.camera = c)}
                        centerCoordinate={this.state.location}
                    />

                    <MapboxGL.UserLocation
                        >

                    </MapboxGL.UserLocation>

                    <MapboxGL.ShapeSource
                        id={'abcd'}
                        shape={{
                            type: 'Feature',
                            properties: {
                                icon: 'exampleicon',
                            },
                            geometry: {
                                type: 'MultiPolygon',
                                coordinates: [this.state.polygonCoordinates],
                            },
                    }}>

                    <MapboxGL.FillLayer
                        id={'abcd'}
                        style={{fillColor: '#FF0000', fillOpacity: 0.6}}
                    />

                    </MapboxGL.ShapeSource>

                </MapboxGL.MapView>
            
            </View>
        </SafeAreaView>
        );
    }

    turnOnLocation = () => {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
            interval: 10000,
            fastInterval: 5000,
        })
            .then((data) => {
                if (data === 'already-enable') {
                
                } else {
                    setTimeout(() => {}, 1000);
                }
            })
            .catch((err) => {});
    };
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});