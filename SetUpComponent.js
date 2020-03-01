import React, { Component } from 'react';
import { Button, TouchableOpacity, StyleSheet, TextInput,Text, View } from 'react-native';
import ReactNativePickerModule from 'react-native-picker-module';
import {AsyncStorage} from 'react-native';

var setUpStyles = StyleSheet.create({
    container: { 
		flex: 1, 
		flexDirection:'column',
		borderWidth: 5
	},	
	headerSection: { 
		flex: 3, 
		justifyContent: 'center', 
		alignItems : 'center' 
	},
	labelStyle: {
		fontSize: 25
	},
	placeHolderStyle: {
		fontSize: 22,
		color: 'grey'
	},
	textEntryStyle: { 
		fontSize: 22, 
		height: 28, 
		width: 200, 
		borderColor: 'black', 
		borderWidth: 1 
	},

    midSection: {
        flex: 4,
        backgroundColor: '#FF3366'
    },
    bottomSection: {
        flex: 1,
        backgroundColor: '#000',
		flexDirection: 'row',
		justifyContent:  'space-evenly'
    }
  });
/*
 *  This class is used to paint the setup screen of the Lavatory Manager App.  
 *  It will collect configuration data such are name, server and lavatory in order to enable
 * checkIn and checkOut of students from the lavatory.
 */

export default class SetUpComponent extends Component {
	/* 
	 * Constructor.  For now it hard codes the lavlist.  This will need to change later.
	 */
	constructor(props) {
console.log("In setup constructor");
		super(props)
		this.theMenu = null
		this.state = { 
			name: "", 
			lav: "", 
			server : "", 
			port:  "",
			data: [ "No Lavatory List"] 
		}
		this.handleServerChange = this.handleServerChange.bind(this);
		this.handlePortChange = this.handlePortChange.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleLavChange = this.handleLavChange.bind(this);		
	};
	
	handleServerChange(e) {
		const rr = async()=> {
			await this.setState({server:e.nativeEvent.text});
			this.props.setServer(this.state.server);
			this.checkSetUpComplete();
			AsyncStorage.setItem('server', this.state.server);
		}
		rr();
	}
	handlePortChange(e) {
		const rr = async()=> {
			await this.setState({port:e.nativeEvent.text});
			this.props.setPort(this.state.port);
			this.checkSetUpComplete();
			AsyncStorage.setItem('port', this.state.port);
		}
		rr();
	}
	handleNameChange(e) {
		const rr = async()=> {
			await this.setState({name:e.nativeEvent.text});
			this.props.setMyName(this.state.name);
			this.checkSetUpComplete();
			AsyncStorage.setItem('name', this.state.name);
		}
		rr();
	}
	handleLavChange(lav) {
		const rr = async()=> {
			await this.setState({lav:lav});
			this.props.setLav(this.state.lav);
			this.checkSetUpComplete();
			AsyncStorage.setItem('lav', this.state.lav);
		}
		rr();
	}
	async componentDidMount() {
		console.log("setupcomponent.componentdidmount");
		if ( this.props.getSetUpComplete() == false ) {
			AsyncStorage.getAllKeys()
			.then((ks) => {
				ks.forEach((k) => {
				AsyncStorage.getItem(k)
				.then((v) => {
					const rr = async (v) => { 
						if ( k == "server" ) {
							await this.setState({server:v});
							this.props.setServer(this.state.server);
							this.checkSetUpComplete();						
						} else if ( k == "port" ) {
							await this.setState({port:v});
							this.props.setPort(this.state.port);
							this.checkSetUpComplete();
						} else if ( k == "name" ) {
							await this.setState({name:v});
							this.props.setMyName(this.state.name);
							this.checkSetUpComplete();
						} else if ( k == "lav" ) {
							await this.setState({lav:v});
							this.props.setLav(this.state.lav);
							this.checkSetUpComplete();
						}
					}
					rr(v);
				})
			});
			});
		}
		this.setState({lav:this.props.getLav()});
		this.setState({name: this.props.getMyName()});
		this.setState({server: this.props.getServer()});
		this.setState({port: this.props.getPort()});
	}
	checkSetUpComplete() { 
		if ( this.props.getSetUpComplete() == true ) {
			return true;
		}
		if (  this.state.name != "" && this.state.server != ""  && this.state.lav != "" && this.state.p != "") {
			this.props.setSetUpComplete();
			return true;
		}
		return false;
	}
			
	getLavListFromServer() {
		console.log("in getLavListFromServer");
	
		/* Trying to make this a sync call.  */
		const rr = async()=> { 

console.log("server->", this.state.server, " port->", this.state.port);

			const response = await fetch('http://' + this.state.server + ':' + this.state.port + '/get_lavkeylist', {
				method : 'GET' ,
				headers: {'Content-Type': 'application/json'},
			});
			const json = await response.json();
			this.setState( {"data":json});
			console.log("message is ", json);
			return json.message;
		}
		var vv = rr();
		return vv;
	}
	/* 
	 * render paints the screen portion of SetUp.
	 */
	render() {
		return (
	
			<View style={setUpStyles.container}>
				<View style={setUpStyles.headerSection}>
					<Text style={{fontSize: 25}}> Set Up Screen </Text>
				</View>
				<View style={{ flex: 1, flexDirection: 'row'}} >
					<Text style={setUpStyles.labelStyle}>Server: </Text>
					<TextInput
						style={setUpStyles.textEntryStyle}
						onChange={this.handleServerChange}
						placeholder="Set Server..."
						placeholderTextColor='grey'
						value = {this.state.server}
					/>
				</View>
				<View style={{ flex: 1, flexDirection: 'row'}} >
					<Text style={setUpStyles.labelStyle}>Port: </Text>
					<TextInput
						style={setUpStyles.textEntryStyle}
						onChange={this.handlePortChange}
						placeholder="Set Port..."
						placeholderTextColor='grey'
						value = {this.state.port}
					/>
				</View>
				<View style={{ flex: 1, flexDirection: 'row'}}  >
					<Text style={setUpStyles.labelStyle} >Name: </Text>
					<TextInput
						style={setUpStyles.textEntryStyle}
						onChange={this.handleNameChange}
						placeholder="Set a name..."
						placeholderTextColor='grey'
						value = {this.state.name}
					/>
				</View>
				<View style={{ flex: 1, flexDirection: 'row'}}  >
					<Button title="Get Lavatory List"   onPress={ ()=> { var x = this.getLavListFromServer(); console.log("button pressed",x) }}/>
				</View>
				<View style={{flex:1, flexDirection:'row'}}>
					<Text style={setUpStyles.labelStyle}>Lavatory: </Text>
					<TouchableOpacity
						style={setUpStyles.textEntryStyle}
						onPress={() => {this.pickerRef.show()}}
						placeholder="Pick a Lavatory..."
						placeholderTextColor='grey'
					> 
					{ this.state.lav == "" && <Text style={setUpStyles.placeHolderStyle}>Pick a Lavatory...</Text> }
					{ this.state.lav != "" && <Text style={setUpStyles.textEntryStyle}>{ this.state.lav }</Text> }
					</TouchableOpacity>
					<ReactNativePickerModule 
						pickerRef={e => this.pickerRef = e}
						title={"Select a lavatory"}
						items={this.state.data}
						onValueChange={this.handleLavChange}		
					/>
				</View>
				<View style={{ flex: 4 }}/>
			</View>
		);
	}
}
