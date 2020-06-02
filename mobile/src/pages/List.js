import React, { useState, useEffect } from 'react';
import socketio from 'socket.io-client';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Image, AsyncStorage, TouchableHighlight } from 'react-native';

import SpotList from '../components/SpotList';
import logo from '../assets/logo.png';
import logout from '../assets/logout.png';

export default function List({ navigation }) {
    const [techs, setTechs] = useState([])

    useEffect(() => {
        AsyncStorage.getItem('user').then(user_id => {
            const socket = socketio('http://192.168.0.106:3333', {
                query: { user_id }
            })

            socket.on('booking_response', booking => {
                Alert.alert(`Sua reserva em ${booking.spot.company} em ${booking.date} foi ${booking.approved ? 'APROVADA' : 'REJEITADA'}`)
            })
        })
    }, []);

    useEffect(() => {
        AsyncStorage.getItem('techs').then(storagedTechs => {
            const techsArray = storagedTechs.split(',').map(tech => tech.trim());

            setTechs(techsArray);
        })
    }, []);

    function returnLogin() {
        navigation.navigate('Login');

        AsyncStorage.setItem('user', '');
        AsyncStorage.setItem('techs', '');
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image style={styles.logo} source={logo} />
            <TouchableHighlight onPress={returnLogin}>
                <Image style={styles.exit} source={logout}></Image>
            </TouchableHighlight>
            <ScrollView>
                {techs.map(tech => <SpotList key={tech} tech={tech} />)}
            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 25
    },

    logo: {
        height: 40,
        resizeMode: "contain",
        alignSelf: "center",
        marginTop: 10
    },

    exit: {
        height: 25,
        width: 25,
        resizeMode: "contain",
        marginTop: 15,
        marginRight: 5,
        opacity: 0.7
    }
});