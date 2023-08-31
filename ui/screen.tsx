import React from "react";
import EncryptedStorage from "react-native-encrypted-storage";
import { ScrollView, Text, View, Image, DevSettings } from "react-native";
import { Avatar, BottomNavigation, Button, TextInput, Appbar, ActivityIndicator, Headline, RadioButton } from "react-native-paper";
import { LogInScreenStyles, ManageScreenStyles } from "./style";
import { ExamsScene, RolesScene, UsersScene } from "./scene";
import { Credentials, FetchResult, SceneRoute } from "../lib/interface";
import { Mutation, Query } from "../lib/graphql";
import { Util } from "../lib/util";
import { AuthCtx } from "../App";
import { Key } from "../lib/enum";
import { Role, User } from "../lib/type";
import { ErrorBanner } from "./component";

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
                    Util.fetch({ jwtToken: "" }, Mutation.signIn(username, password), callback);
                }}
            >
                Sign In
            </Button>
            <Button
                style={LogInScreenStyles.button}
                mode="outlined"
                onPress={() => {
                    Util.fetch({ jwtToken: "" }, Mutation.signIn(username, password), callback);
                }}
            >
                Sign Up
            </Button>
        </View>
    );
}

const module2IconScene: Record<string, [string, () => React.JSX.Element]> = {
    Exams: ["book", () => <ExamsScene></ExamsScene>],
    Results: ["pencil", () => <Text>Results</Text>],
    Users: ["account", () => <UsersScene></UsersScene>],
    Roles: ["account-tie", () => <RolesScene></RolesScene>]
};

export function HomeScreen() {
    const credentials = React.useContext(AuthCtx).credentials;
    const [fetchResult, setFetchResult] = React.useState<FetchResult<User>>(null);
    const [index, setIndex] = React.useState(0);

    if (fetchResult === null) {
        Util.fetch(credentials as Credentials, Query.getMe(), setFetchResult);
        return <ActivityIndicator animating={true} size={100} style={{ marginTop: "50%" }} />;
    } else if (fetchResult instanceof Error) {
        return <ErrorBanner error={fetchResult} actions={[
            {
                label: "RELOAD",
                onPress: () => {
                    EncryptedStorage.removeItem(Key.CREDENTIALS);
                    DevSettings.reload();
                }
            }
        ]} />
    } else {
        const sceneRoutes: SceneRoute[] = [];
        const sceneMap: Record<string, () => React.JSX.Element> = {};

        const permissions = fetchResult.role.permissions;
        for (const permission of permissions) {
            const key = permission.module.url;
            if (module2IconScene.hasOwnProperty(key) && permission.value[1] === "1") {
                sceneRoutes.push({
                    key: key,
                    title: key,
                    focusedIcon: module2IconScene[key][0]
                });

                sceneMap[key] = module2IconScene[key][1];
            }
        }

        return (
            <View style={{ flex: 1 }}>
                <Appbar.Header>
                    <Appbar.Content title={Object.keys(module2IconScene)[index]} />
                    <Appbar.Action icon="account" onPress={() => { }} />
                    <Appbar.Action icon="logout" onPress={() => {
                        EncryptedStorage.removeItem(Key.CREDENTIALS);
                        DevSettings.reload();
                    }} />
                </Appbar.Header>
                <BottomNavigation
                    navigationState={{ index, routes: sceneRoutes }}
                    onIndexChange={setIndex}
                    renderScene={BottomNavigation.SceneMap(sceneMap)}
                />
            </View>
        );
    }
}

export function ManageUserScreen({ route }: any) {
    const credentials = React.useContext(AuthCtx).credentials;
    const [userFetchResult, setUserFetchResult] = React.useState<FetchResult<User>>(null);
    const [rolesFetchResult, setRolesFetchResult] = React.useState<FetchResult<Role[]>>(null);
    const [roleId, setRoleId] = React.useState("");

    if (userFetchResult === null) {
        Util.fetch(credentials as Credentials, Query.getUser(route.params.id), setUserFetchResult);
        Util.fetch(credentials as Credentials, Query.getRoles(), setRolesFetchResult);
        return <ActivityIndicator animating={true} size={100} style={{ marginTop: "50%" }} />;
    } else if (userFetchResult instanceof Error) {
        return <ErrorBanner error={userFetchResult} actions={[
            {
                label: "RELOAD",
                onPress: () => {
                    EncryptedStorage.removeItem(Key.CREDENTIALS);
                    DevSettings.reload();
                }
            }
        ]} />
    } else {
        return (
            <View style={{ flex: 1 }}>
                <Appbar.Header>
                    <Appbar.Content title="Manage User" />
                    <Appbar.Action icon="account" onPress={() => { }} />
                    <Appbar.Action icon="logout" onPress={() => {
                        EncryptedStorage.removeItem(Key.CREDENTIALS);
                        DevSettings.reload();
                    }} />
                </Appbar.Header>
                <ScrollView style={ManageScreenStyles.view}>
                    <Avatar.Icon
                        style={ManageScreenStyles.avatar}
                        size={150} icon="account-tie"
                    />
                    <TextInput
                        label="Username"
                        value={userFetchResult.username}
                        mode="outlined"
                        disabled={true}
                        style={ManageScreenStyles.input}
                    />
                    <TextInput
                        label="Preferred Name"
                        value={userFetchResult.preferredName ? userFetchResult.preferredName : ""}
                        mode="outlined"
                        style={ManageScreenStyles.input}
                    />
                    <Headline style={ManageScreenStyles.heading}>Role</Headline>
                    <RadioButton.Group onValueChange={roleId => setRoleId(roleId)} value={roleId}>
                        {
                            (rolesFetchResult && !(rolesFetchResult instanceof Error)) ? (
                                rolesFetchResult.map(role => {
                                    return <RadioButton.Item
                                        key={role._id}
                                        style={ManageScreenStyles.input}
                                        label={role.name}
                                        value={role._id}
                                    />
                                })
                            ) : (
                                <View></View>
                            )
                        }
                    </RadioButton.Group>
                </ScrollView>
            </View>
        );
    }
}