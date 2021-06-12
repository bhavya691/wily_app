import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import TransactionScreen from './screens/BookTransactionScreen';
import SearchScreen from './screens/SearchScreen';
import LoginScreen from './screens/LoginScreen';

export default class App extends React.Component{
  render(){
    return(
      <AppContainer />
    )
  }
}
  const TabNavigator = createBottomTabNavigator({
    Search: {screen:SearchScreen},
    Transaction: {screen:TransactionScreen}
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon:({}) => {
        const routeName = navigation.state.routeName;
        if(routeName === 'Transaction'){
          return (
            <Image source={require('./assets/book.png')} 
            style = {{width: 35, height: 35}}
            />
          )
        }else if(routeName === 'Search'){
          return(
            <Image source={require('./assets/searchingbook.png')} 
            style = {{width: 35, height: 35}}
            />
          )
        }
      }
    })
  }
  )
  const switchNavigator = createSwitchNavigator({
    LoginScreen: {screen: LoginScreen},
    TabNavigator: {screen: TabNavigator}
  })
  const AppContainer = createAppContainer(switchNavigator);

