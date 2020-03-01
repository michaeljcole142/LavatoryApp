import React, { Component } from 'react';
import { TextInput, Image,StyleSheet,Text, View, Button, Alert } from 'react-native';
import SetUpComponent from './SetUpComponent';
import BarCodeScannerComponent from './BarCodeScannerComponent';

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
		borderWidth:5
    },
	topSection: {
		flex: 1,
		backgroundColor: '#000'
	},
    midSection: {
        flex: 4,
        backgroundColor: '#efefef'
    },
    bottomSection: {
        flex: 1,
        backgroundColor: '#000',
		flexDirection: 'row',
		justifyContent:  'space-evenly'
    }
  });
export default class LavatoryManagerApp extends Component {
	
	constructor(props) {
		super(props)
		this.theMenu = null;
		this.state = {
			setUpComplete : false, 
			myName: "", 
			server: "",
			port: "",
			lav: "", 
			someString : "SetUp", 
			menuOpen: false 
		}
		this.setMyName = this.setMyName.bind(this);
		this.getMyName = this.getMyName.bind(this);
		this.setServer = this.setServer.bind(this);
		this.getServer = this.getServer.bind(this);
		this.setPort = this.setPort.bind(this);
		this.getPort = this.getPort.bind(this);
		this.setLav = this.setLav.bind(this);
		this.getLav = this.getLav.bind(this);
		this.setSetUpComplete = this.setSetUpComplete.bind(this);
		this.getSetUpComplete = this.getSetUpComplete.bind(this);
	}

	
	setMyName( nm ) {
		this.setState({myName: nm}) ;
	}

	getMyName() {
		return this.state.myName;
	}
	setServer( nm ) {
		this.setState({server:nm }) ;
	}
	getServer() {
		return this.state.server;
	}
	setPort( pp ) {

		this.setState({port:pp });
	}
	getPort() {
		return this.state.port;
	}
	setLav( nm ) {
		this.setState({lav:nm });
	}
	getLav() {
		return this.state.lav;
	}
	setSetUpComplete() {
		this.setState({setUpComplete:true});
	}
	getSetUpComplete() {
		return this.state.setUpComplete;
	}
	render() {
		return (
			<View style={ styles.container }>
				<View style={ styles.topSection }>
					<Image 
						style={{width: 750, height: 120}} 
						source={ require('./HC_Header.jpg') } 
					/>
					<Text>This is the top section</Text>
				</View>
				<View style= { styles.midSection }>
					{ this.state.someString=="SetUp"  && 
					<SetUpComponent					
						setSomethingNew={this.setSomethingNew}
						getSomethingNew={this.getSomethingNew}
						setMyName={this.setMyName} 
						getMyName={this.getMyName} 
						setServer={this.setServer} 
						getServer={this.getServer} 
						setPort={this.setPort} 
						getPort={this.getPort} 
						setLav={this.setLav} 
						getLav={this.getLav}
						setSetUpComplete={this.setSetUpComplete}
						getSetUpComplete={this.getSetUpComplete}
					/>}
					{ this.state.someString=="Scan"  && 
					<BarCodeScannerComponent 
						getMyName={this.getMyName} 
						getServer={this.getServer} 
						getLav={this.getLav}
						getPort={this.getPort}
					/>}
				</View>
				<View style = {styles.bottomSection } >
					<Button title="Set Up" onPress={() => { this.setState({someString : "SetUp"})}} />
					{ this.state.setUpComplete == true &&
						<Button title="Scan" onPress={() => { this.setState({someString : "Scan"}); }} 
					/>}
				</View>
			</View>
		);
	}

}
