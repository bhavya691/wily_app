import React from 'react';
import {View, Text, TextInput, Image, StyleSheet, ScrollView, FlatList} from 'react-native';
import SearchIcon from '@material-ui/icons/Search';
import firebase from 'firebase';
import db from '../config';

export default class SearchScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            searchedWord: '',
            allTransactions: [],
            lastVisibleTransaction: null
        }
    }
    componentDidMount = async () => {
        const query = await db.collection("transactions").get()
        query.docs.map((doc) => {
            this.setState({
                allTransactions: [...this.state.allTransactions, doc.data()]
            })
        })
    }
    fetchMoreTransactions = async () => {
        const query = db.collection('transactions').startAfter(this.state.lastVisibleTransaction).orderBy('bookId', 'desc')
        .limit(1).get()
        query.docs.map((doc) => {
            this.setState({
                allTransactions: [...this.state.allTransactions, doc.data()],
                lastVisibleTransaction: doc
            })
        })
    }

    render(){
        return(
            <FlatList 
            data = {this.state.allTransactions}
            renderItem = {({item}) => (
                <View style={{borderBottomWidth: 2}}>
                            <Text>
                                {"bookId: "+ item.bookId}
                            </Text>
                            <Text>
                                {"studentId: " + item.studentId}
                            </Text>
                            <Text>
                                {"transaction type: " + item.transactionType}
                            </Text>
                            <Text>
                                {"date: " + item.date.toDate()}
                            </Text>
                </View>
            )}
            keyExtractor = {(item,index) => index.toString()}
            onEndReached = {this.fetchMoreTransactions}
            onEndReachedThreshold = {0.7}
            />
            
        )
        // return(
        //     <View style = {{flex:1, justifyContent:'center', alignItems:'center'}}>
        //         <Image source={require('../assets/booklogo.jpg')} style={{width: 200, height:200, marginTop: -350, marginLeft: 80}} />
        //         <SearchIcon style={{marginLeft: -550, marginBottom: -60, zIndex: 10, marginTop: 50, width: 40, height: 40, color: '#777'}} />
        //         <TextInput style={styles.searchBar} placeholder='Enter the name of book' onChangeText={(word) => {
        //             this.setState({
        //                 searchedWord: word
        //             })
        //         }}/>
        //     </View>
        // )
    }
}

const styles = StyleSheet.create({
    searchBar:{
        border: 'none',
        borderRadius: 50,
        textAlign: 'center',
        width: '50%',
        height: '10%',
        fontSize: 30,
        backgroundColor: '#f0f0f0',
    }
})