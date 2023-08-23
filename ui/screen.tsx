import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import EncryptedStorage from "react-native-encrypted-storage";
import { ScrollView, Text, View, Image, DevSettings } from "react-native";
import { Avatar, BottomNavigation, Button, TextInput, Appbar, Banner } from "react-native-paper";
import { LogInScreenStyles } from "./style";
import { UsersScene } from "./scene";
import { FetchState, SceneData } from "../lib/interface";
import { GraphQLError } from "graphql";
import { Mutation, Query } from "../lib/graphql";
import { Util } from "../lib/util";
import { AuthCtx } from "../App";
import { Key } from "../lib/enum";

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
    const { callback } = React.useContext(AuthCtx);

    return (
        <View style={LogInScreenStyles.view}>
            <Avatar.Icon 
                style={LogInScreenStyles.avatar}
                size={150} icon="folder" />
            <TextInput
                style={LogInScreenStyles.textInput}
                mode="outlined"
                label="Username"
                value={username}
                onChangeText={(text: string) => setUsername(text)}
            />
            <TextInput
                style={LogInScreenStyles.textInput}
                mode="outlined"
                label="Password"
                secureTextEntry
                value={password}
                onChangeText={(text: string) => setPassword(text)}
            />
            <Button 
                style={LogInScreenStyles.button}
                mode="outlined"
                onPress={() => {
                    Util.fetch("", Mutation.signIn(username, password), callback);
                }}
            >
                Sign In
            </Button>
            <Button 
                style={LogInScreenStyles.button}
                mode="outlined"
                onPress={() => {
                    Util.fetch("", Mutation.signIn(username, password), callback);
                }}
            >
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
    const credentials = React.useContext(AuthCtx).data;
    const [fetchState, setFetchState] = React.useState<FetchState<any, GraphQLError>>({
        loading: true,
        error: undefined,
        data: undefined
    });
    React.useEffect(() => {
        Util.fetch(credentials.jwtToken!, Query.getMe(), setFetchState);
    }, [fetchState.loading]);

    const [index, setIndex] = React.useState(0);

    if (fetchState.loading) {
        return <Text>Loading</Text>
    } else if (fetchState.error) {
        return <Banner
            visible={true}
            icon={() => <Icon size={50} name="error"/>}
            actions={[
                {
                  label: "RELOAD",
                  onPress: () => {
                    EncryptedStorage.removeItem(Key.CREDENTIALS);
                    DevSettings.reload();
                  }
                }
            ]}
        >
            {(fetchState.error.extensions.title as string).toUpperCase() + "\n" + fetchState.error.extensions.suggestion}
        </Banner>
    } else {
        const sceneData: SceneData[] = [];
        const permissions = fetchState.data.user.role.permissions as any[];
        for (const permission of permissions) {
            if (module2Icon.hasOwnProperty(permission.module.url) && permission.value[1] === "1") {
                sceneData.push({
                    key: permission.module.url,
                    title: permission.module.url,
                    focusedIcon: module2Icon[permission.module.url]
                });
            }
        }

        return (
            <View style={{flex:1}}>
                <Appbar.Header>
                    <Appbar.Content title="Title" />
                    <Appbar.Action icon="account" onPress={() => {}} />
                    <Appbar.Action icon="logout" onPress={() => {
                        EncryptedStorage.removeItem(Key.CREDENTIALS);
                        DevSettings.reload();
                    }}
                    />
                </Appbar.Header>
                <BottomNavigation
                    navigationState={{ index, routes: sceneData }}
                    onIndexChange={setIndex}
                    renderScene={BottomNavigation.SceneMap({
                        Exams: () => <ScrollView><Text>Exams</Text></ScrollView>,
                        Results: () => <Text>Results</Text>,
                        Users: () => <UsersScene></UsersScene>,
                        Roles: () => <Text>Roles</Text>
                    })}
                />
            </View>
        );
    }
}