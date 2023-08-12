import React from "react";
import { ScrollView, StatusBar, View, useColorScheme } from "react-native";
import { Avatar, Button, TextInput } from "react-native-paper";
import { LogInScreenStyles } from "../styles/screen";

export function HomeScreen() {
    const isDarkMode = useColorScheme() === "dark";

    return (
        <View>
            <ScrollView>
                <Button icon="camera" mode="contained" onPress={() => console.log('Pressed')}>
                    Press me
                </Button>
            </ScrollView>
        </View>
    );
}

export function LoginScreen() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = () => {
        console.log('Login button pressed!');
    };

    return (
        <View style={LogInScreenStyles.view}>
            <Avatar.Icon 
                style={LogInScreenStyles.avatar}
                size={150} icon="folder" />

            <TextInput
                style={LogInScreenStyles.textInput}
                label="Username"
                value={username}
                onChangeText={(text: string) => setUsername(text)}
            />

            <TextInput
                style={LogInScreenStyles.textInput}
                label="Password"
                secureTextEntry
                value={password}
                onChangeText={(text: string) => setPassword(text)}
            />

            <Button 
                style={LogInScreenStyles.button}
                mode="outlined"
                onPress={handleLogin}>
                Sign In
            </Button>
            <Button 
                style={LogInScreenStyles.button}
                mode="outlined"
                onPress={handleLogin}>
                SIgn Up
            </Button>
        </View>
    );
};