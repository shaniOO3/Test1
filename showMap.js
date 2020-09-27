import React, { Component } from 'react'
import {Platform, SafeAreaView, StyleSheet, View} from 'react-native'
import MapboxGL from '@react-native-mapbox-gl/maps';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

MapboxGL.setAccessToken(
    'pk.eyJ1Ijoic29sbzAwMyIsImEiOiJja2Y5dWxuaHIwaGx2MnFweDJscXA2NG94In0.B0VegnM-IbkUiyEYdToSuw',
);
const IS_ANDROID=Platform.OS==='android';

export default class showMap extends Component {

    async UNSAFE_componentWillMount(){
        if(IS_ANDROID){
            this.turnOnLocation()
            const is_Granted=await MapboxGL.requestAndroidLocationPermissions();
            this.setState({
                isAndroidPermissionGranted :is_Granted,
                isFetchingAndroidPermission:false,
            });
        }
    }

    constructor(props){
        super(props);
        this.state={
            isAndroidPermissionGranted:false,
            isFetchingAndroidPermission:IS_ANDROID,
            coordinates: [[76.271080,10.850516]],
            showUserLocation:true,
            location:[76.271080,10.850516],
        };
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <MapboxGL.MapView
                        ref ={c=>(this._map=c)}
                        zoomLevel={14}
                        centerCoordinate={this.state.coordinates[0]}
                        showUserLocation={true}
                        style={styles.container}
                        userTrackingMode={this.state.userSelectedUserTrackingMode}
                    >
                        <MapboxGL.Camera
                            zoomLevel={10}
                            animationMode={'flyTo'}
                            animationDuration={0}
                            ref={c=>(this.camera=c)}
                            centerCoordinate={this.state.location}
                        >

                        </MapboxGL.Camera>

                        <MapboxGL.UserLocation>

                        </MapboxGL.UserLocation>
                    

                    </MapboxGL.MapView>
                </View>
            </SafeAreaView>
        )
    }

    turnOnLocation = () => {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
            .then(data => {
                if (data === "already-enable") {

                } else {
                    setTimeout(() => {
                        
                    }, 1000)
                }
        }).catch(err => {
            
        })
    };
}

const styles=StyleSheet.create({
    container: {
        flex: 1,
    },
});

