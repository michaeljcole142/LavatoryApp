import React, { Component } from 'react';
import { Text, View, Button,StyleSheet } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';

 
async function checkInOrOut(data,server,port,ilav,name) {
	console.log("in checkin");
	
	var x = [ { id: data, lav : ilav, by:name } ];

console.log("checkInOrOut", data, server,port,ilav, name);	
	/* Trying to make this a sync call.  */
	const rr = async()=> { 
//		const response = await fetch('http://10.10.124.84:8888/check_in_or_out', {
	const response = await fetch('http://' + server + ':' + port + '/check_in_or_out', {
			method : 'POST' ,
			headers: {'Content-Type': 'application/json'},
			body : JSON.stringify(x) 
		});
		const json = await response.json();
		return json.message;
	}
	var vv = rr();
	return vv;
}

export default class BarCodeScannerComponent extends React.Component {
	
	/*  
	 * constructor for setup.  Key is that this class gets sent pointers
	 * for callbacks to getting -> server, name and lav.
	 */
	constructor(props) {
		super(props);
		this.state = {
			hasCameraPermission:null,
			scanned :false ,
			checkedInOrOutFlag:false,
			checkedInOrOutMsg : ''
		}
	};
	
	/* get permissions for camera after component mounts. */
	async componentDidMount() {
		this.getPermissionsAsync();
	}

	/* get's the permissions for the camera. */
	getPermissionsAsync = async () => {
		const { status } = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({ hasCameraPermission: status === 'granted' });
	};

	/* paint the screen.  gets called when props or state change.*/
	render() {
		const { hasCameraPermission, scanned } = this.state;
		if (hasCameraPermission === null) {
			return <Text>Requesting for camera permission</Text>;
		}
		if (hasCameraPermission === false) {
			return <Text>No access to camera</Text>;
		}
		/* 
		 * This view below handles 3 situations for the screen paint. 
		 * First when code recognized but server not responded.
		 * Second, when server responded.
		 * Third, painting server response.
		 */
		return (
			<View
				style={{
					flex: 1,
					flexDirection: 'column',
					justifyContent: 'flex-end',
				}}
			>
				<View style={{ flex: 6 }}>
					<BarCodeScanner
						onBarCodeScanned={this.state.scanned ? undefined : this.handleBarCodeScanned}
						style={StyleSheet.absoluteFillObject}
					/>
				</View>
				<View style={{flex:1}}>
					{( this.state.scanned == true && this.state.checkedInOrOutFlag == false &&
						<Text> Checking Student In.... </Text> 
					)}
					{ ( this.state.scanned == true && this.state.checkedInOrOutFlag == true &&
						<Button 
							style={{flex:1,flexDirection:'row', alignItems:'center',justifyContent:'center',}} 
							title={'Tap to Scan Again'} 
							onPress={() => this.setState({ 
								scanned: false , 
								checkedInOrOutFlag : false, 
								checkedInOrOutMsg: "" 
							})} 
						/>
					)}
					{( this.state.scanned == true && this.state.checkedInOrOutFlag == true &&
						<Text>{this.state.checkedInOrOutMsg}</Text>
					)}
				</View>
			</View>
		);
	}

	/* callback for when a barcode is found. */
	handleBarCodeScanned = ({ type, data }) => {
		this.setState({ scanned: true });
		const rr = async()=> { 
			var msg=await checkInOrOut(data,this.props.getServer(),this.props.getPort(),this.props.getLav(),this.props.getMyName());
			this.setState( { checkedInOrOutFlag: true , checkedInOrOutMsg : msg });
		}
		rr();
	};
}
