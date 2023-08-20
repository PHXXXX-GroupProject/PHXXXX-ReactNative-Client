import React from "react";
import { ScrollView, Text, View, Image } from "react-native";
import { Avatar, BottomNavigation, Button, TextInput, Appbar, Banner } from "react-native-paper";
import { LogInScreenStyles } from "./style";
import { UsersScene } from "./scene";
import { AuthContext } from "../App";
import { gql, useQuery } from "@apollo/client";
import { Query } from "../lib/graphql";
import Icon from "react-native-vector-icons/MaterialIcons";

export function SplashScreen() {
    return (
        <Image
            source={require("./img/splash.jpg")}
            style={{
                width: "100%",
                height: "100%"
            }}
        />
    );
}

export function LoginScreen() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const authenticator = React.useContext(AuthContext);

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
                onPress={() => {authenticator.signIn(username, password)}}>
                Sign In
            </Button>
            <Button 
                style={LogInScreenStyles.button}
                mode="outlined"
                onPress={() => {authenticator.signIn(username, password)}}>
                Sign Up
            </Button>
        </View>
    );
};

const module2Icon = {
    Exams: "book",
    Results: "pencil",
    Users: "account",
    Roles: "account-tie"
} as any;

export function HomeScreen() {
    const { loading, error, data, networkStatus } = useQuery(gql`${Query.getMe()}`);
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([]);

    if (loading) {
        //WARNING: Loading state is ignored
        return <Text>Loading</Text>;
    } else if (error) {
        return <Banner visible={true} icon={() => <Icon size={50} name="error" />}>
            {error.message}
        </Banner>
    } else {
        console.log(data.errors);
        
        const permissions = data.user.role.permissions as any[];
        routes.length = 0;
        for (const permission of permissions) {
            if (module2Icon.hasOwnProperty(permission.module.url) && permission.value[1] === "1") {
                routes.push({
                    key: permission.module.url,
                    title: permission.module.url,
                    focusedIcon: module2Icon[permission.module.url]
                } as never);
            }
        }

        return (
            <View style={{flex:1}}>
                <Appbar.Header>
                    <Appbar.Content title="Title" />
                    <Appbar.Action icon="account" onPress={() => {}} />
                    <Appbar.Action icon="logout" onPress={() => {}} />
                </Appbar.Header>
                <BottomNavigation
                    navigationState={{ index, routes }}
                    onIndexChange={setIndex}
                    renderScene={BottomNavigation.SceneMap({
                        Exams: () => <ScrollView><Text>Music</Text></ScrollView>,
                        Results: () => <Text>Albums</Text>,
                        Users: () => <UsersScene></UsersScene>,
                        Roles: () => <Text>Music</Text>
                    })}
                />
            </View>
        );
    }
}