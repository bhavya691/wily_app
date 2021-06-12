import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Image, KeyboardAvoidingView, ToastAndroid } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import firebase from 'firebase';
import db from '../config';

export default class TransactionScreen extends React.Component {
    constructor(){
      super();
      this.state = {
        hasCameraPermissions: null,
        scanned: false,
        scannedBookId: '',
        scannedStudentId: '',
        buttonState: 'normal',
        transactionMsg: ''
      }
    }

    getCameraPermissions = async (id) =>{
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      
      this.setState({
        /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
        hasCameraPermissions: status === "granted",
        buttonState: id,
        scanned: false
      });
    }

    handleBarCodeScanned = async({type, data})=>{

      const {buttonState} = this.state

        if(buttonState === "bookId"){
            this.setState({
                scanned: true,
                scannedBookId: data,
                buttonState: 'normal'
              });
        }
        else if(buttonState === "studentId"){
            this.setState({
                scanned: true,
                scannedStudentId: data,
                buttonState: 'normal'
              });
        }
    }

    initiateBookIssue = async () => {
      // add transaction 
      db.collection("transactions").add({
        'bookId': this.state.scannedBookId,
        'date': firebase.firestore.Timestamp.now().toDate(),
        'studentId': this.state.scannedStudentId,
        'transactionType': "Issue"
      })
      db.collection("books").doc(this.state.scannedBookId).update({
        'bookAvailability': false
      })
      db.collection("students").doc(this.state.scannedStudentId).update({
        'NoOfBookIssued': firebase.firestore.FieldValue.increment(1)
      })
      alert("Book Issued");
      this.setState({
        scannedBookId: '',
        scannedStudentId: ''
      })
    }

    initiateBookReturn = async () => {
      db.collection("transactions").add({
        'bookId': this.state.scannedBookId,
        'date': firebase.firestore.Timestamp.now().toDate(),
        'studentId': this.state.scannedStudentId,
        'transactionType': "Return"
      })
      db.collection("books").doc(this.state.scannedBookId).update({
        'bookAvailability': true
      })
      db.collection("students").doc(this.state.scannedStudentId).update({
        'NoOfBookIssued': firebase.firestore.FieldValue.increment(-1)
      })
      alert("Book Returned");
      this.setState({
        scannedBookId: '',
        scannedStudentId: ''
      })
    }

    checkBookEligebility = async () => {
      const bookRef = await db.collection('books').where("bookId", "==", this.state.scannedBookId).get();
      var transactionType = "";
      if(bookRef.docs.length == 0){
        transactionType = false
      }else{
        bookRef.docs.map((doc) => {
          var book = doc.data();
          if(book.bookAvailability){
            transactionType = "Issue"
          }else{
            transactionType = "Return"
          }
        })
      }
      return transactionType
    }

    checkStudentEligebilityForReturn = async () => {
      const transactionRef = await db.collection('transactions').where("bookId", "==", this.state.scannedBookId).limit(1).get();
      var isStudentEligeble = "";
      transactionRef.docs.map((doc) => {
        var lastBookTransaction = doc.data();
        if(lastBookTransaction.studentId === this.state.scannedStudentId){
          isStudentEligeble = true
        }else{
          isStudentEligeble = false
          alert("The book wasn't issued to this student")
          this.setState({
            scannedBookId: '',
            scannedStudentId: ''
          })
        }
      })
      return isStudentEligeble
    }

    checkStudentEligebilityForIssue = async () => {
      const studentRef = await db.collection('students').where("studentId", "==", this.state.scannedStudentId).get();
      var isStudentEligeble = "";
      if (studentRef.docs.length == 0) {
        this.setState({
          scannedStudentId: '',
          scannedBookId: ''
        })
        isStudentEligeble = false
        alert('Student does not exist in our database')
      }else{
        studentRef.docs.map((doc) => {
          var student = doc.data();
          if(student.NoOfBookIssued < 2){
            isStudentEligeble = true
          }else{
            isStudentEligeble = false
            alert("Student has already issued two books")
            this.setState({
              scannedBookId: '',
              scannedStudentId:''
            })
          }
        })
      }
      return isStudentEligeble
    }

    handleTransaction = async () => {
      var transactionType = await this.checkBookEligebility();
      if(!transactionType){
        alert("The book doesn't exist in the library database");
        this.setState({
          scannedStudentId: '',
          scannedBookId: ''
        })
      }else if(transactionType === 'Issue'){
        var isStudentEligeble = await this.checkStudentEligebilityForIssue();
        if(isStudentEligeble){
          this.initiateBookIssue();
          alert("Book Issued")
        }
      }else{
        var isStudentEligeble = await this.checkStudentEligebilityForReturn();
        if(isStudentEligeble){
          this.initiateBookIssue();
          alert("Book Return") 
        }
      }
      // var transactionMsg;
      // db.collection("books").doc(this.state.scannedBookId).get()
      // .then((doc) => {
      //   var book = doc.data()
      //   if(book.bookAvailability){
      //     this.initiateBookIssue();
      //     transactionMsg = "Book Issued";
      //     // ToastAndroid.show("Book Issued", ToastAndroid.SHORT);
      //     alert(transactionMsg)
      //   }else{
      //     this.initiateBookReturn();
      //     transactionMsg = "Book Returned";
      //     // ToastAndroid.show("Book Returned", ToastAndroid.SHORT);
      //     alert(transactionMsg)
      //   }
      // })
      // this.setState({
      //   transactionMsg: transactionMsg
      // })
    }

    render() {
      const hasCameraPermissions = this.state.hasCameraPermissions;
      const scanned = this.state.scanned;
      const buttonState = this.state.buttonState;

      if (buttonState !== "normal" && hasCameraPermissions){
        return(
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        );
      }

      else if (buttonState === "normal"){
        return(
          <KeyboardAvoidingView style={styles.container} behavior = "padding" enabled>
            <View>
                <Image source={require('../assets/booklogo.jpg')} style={{width: 200, height:200, marginTop: -150, marginLeft: 80}} />
                <Text style={{textAlign: 'center', fontSize:30, marginBottom: 100}}>Wily</Text>
                <View style={styles.form}>
                  <View style={styles.inputView}>
                    <TextInput style={styles.inputBox} placeholder="book id" onChangeText = {
                      text => this.setState({
                        scannedBookId: text
                      })
                    } value={this.state.scannedBookId} />
                    <TouchableOpacity style={styles.scanButton} onPress={() => {this.getCameraPermissions("bookId")}}>
                        <Text style={styles.buttonText}>Scan</Text>
                    </TouchableOpacity>
                  </View>

                <View style={styles.inputView}>
                    <TextInput style={styles.inputBox} placeholder="student id" onChangeText = {
                      text => this.setState({
                        scannedStudentId: text
                      })
                    } value={this.state.scannedStudentId} />
                    <TouchableOpacity style={styles.scanButton} onPress={() => {this.getCameraPermissions("studentId")}}>
                        <Text style={styles.buttonText}>Scan</Text>
                    </TouchableOpacity>
                  </View>   
                  <TouchableOpacity style={styles.submitButton} onPress={async () => {var transactionMsg = this.handleTransaction();
                  this.setState({
                    scannedStudentId: '',
                    scannedBookId: ''
                  })
                  }}>
                    <Text style={styles.subText}>Submit</Text>
                  </TouchableOpacity>
                </View>           
          </View>
        </KeyboardAvoidingView>
        );
      }
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      marginLeft: 15,
      width: 120,
      borderWidth: 1.5,
      borderLeftWidth: 0
    },
    buttonText:{
      fontSize: 20,
      textAlign: 'center',
      marginTop: 10
    },
    inputView:{
        flexDirection: 'row',
        margin: 20,
    },
    inputBox:{
        width: 200,
        height: 40,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderTopWidth:0,
        borderBottomWidth: 1.5,
        borderBottomColor: '#fff',
        fontSize: 20,
        color: '#fff'
    },
    form:{
      backgroundColor: '#252324',
    },
    submitButton:{
      backgroundColor: 'pink',
      width: 100,
      height: 50
    },
    subText:{
      padding: 10,
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff'
    }
  });