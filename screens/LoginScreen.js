import React from 'react'
import {View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image, TextInput, KeyboardAvoidingView} from 'react-native';
import firebase from 'firebase';
import db from '../config';
import bg from '../assets/bg.jpg';
import logo from '../assets/booklogo.jpg';
import {LinearGradient} from 'expo-linear-gradient';

export default class LoginScreen extends React.Component {
    constructor(){
        super();
        this.state = {
            email: '',
            password: ''
        }
    }

    login = async(email, password) => {
        if(email && password){
            try{
                const response = await firebase.auth().signInWithEmailAndPassword(email,password)
                if(response){
                    this.props.navigation.navigate('Transaction')
                }
            }
            catch(error){
                switch(error.code){
                    case 'auth/user-not-found':alert("User Doesn't Exist")
                    break;
                    case 'auth/invalid-email':alert("Invalid Email Or Password")
                }
            }
        }
        else{
            alert('Enter Email and Password')
        }
    }

    render(){
        return(
            <KeyboardAvoidingView style={{flex: 1,justifyContent: 'center',alignItems: 'center'}} behavior = 'padding' enabled>
                <View style={styles.body}>
                    <ImageBackground source={bg} style={styles.container}>
                        <View style={styles.form}>
                            <Image source={logo} style={{width: 200, height:200}} />
                            <Text style={styles.logoText}>Welcome to the wily app</Text>
                            <TextInput style={styles.input} placeholder='Email' keyboardType='email-address' onChangeText={(email) => {
                                this.setState({
                                    email: email
                                })
                            }} />
                            <TextInput style={styles.input} placeholder='password' secureTextEntry={true} onChangeText={(password) => {
                                this.setState({
                                    password: password
                                })
                            }} />
                            <TouchableOpacity style={styles.btn} onPress={() => {this.login(this.state.email, this.state.password)}}>
                                <LinearGradient colors={['#2dbd6e','#a6f77b']} style={{width: '100%', height: '100%', borderRadius: 45}} />
                                <Text style={styles.loginTxt}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    body:{
        backgroundColor: '#76F666',
        width: '100vw',
        height: '100vh',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container:{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center'
    },
    form:{
        display: 'flex',
        // justifyContent: 'space-between',
        alignItems: 'center',
        width: '40%',
        height: '80%',
        backgroundColor: '#fff',
    },
    logoText:{
        fontSize: 26,
        fontWeight: 'bold',
        letterSpacing: 2,
        wordSpacing: 5
    },
    input:{
        borderRadius: 45,
        marginTop: 50,
        width: '60%',
        height: 50,
        fontSize: 20,
        paddingLeft: 10,
        textAlign: 'left',
        borderWidth: 2,
    },
    btn:{
        borderWidth: 2,
        borderRadius: 45,
        height: 60,
        width: '50%',
        marginTop: 70,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginTxt:{
        fontSize: 30,
        position: 'fixed'
    }
})