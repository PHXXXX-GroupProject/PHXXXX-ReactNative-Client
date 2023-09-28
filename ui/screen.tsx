import React from "react";
import EncryptedStorage from "react-native-encrypted-storage";
import { ScrollView, View, Image, DevSettings } from "react-native";
import { Avatar, BottomNavigation, Button, TextInput, Appbar, ActivityIndicator, Headline, Text, DataTable, FAB } from "react-native-paper";
import { LogInScreenStyles, ManageFineStyles } from "./style";
import { FinesScene } from "./scene";
import { FetchResult, SceneRoute } from "../lib/interface";
import { Mutation as GQLMutation, Query as GQLQuery } from "../lib/graphql";
import { Util } from "../lib/util";
import { AuthCtx } from "../App";
import { Key } from "../lib/enum";
import { Query, Mutation } from "../lib/type";
import { ErrorBanner } from "./component";
import { useNavigation } from "@react-navigation/native";

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
    const { setCredentialsProxy } = React.useContext(AuthCtx);

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
                    Util.fetch({ jwtToken: "" }, Mutation.signIn(username, password), setCredentialsProxy);
                }}
            >
                Sign In
            </Button>
            <Button
                style={LogInScreenStyles.button}
                mode="outlined"
                onPress={() => {
                    Util.fetch({ jwtToken: "" }, Mutation.signIn(username, password), setCredentialsProxy);
                }}
            >
                Sign Up
            </Button>
        </View>
    );
}

const module2IconScene: Record<string, [string, () => React.JSX.Element]> = {
    Fines: ["pencil", () => <FinesScene></FinesScene>]
};

export function HomeScreen() {
    const credentials = React.useContext(AuthCtx).credentials;
    const [fetchResult, setFetchResult] = React.useState<FetchResult<Query["GetMe"]>>(null);
    const [index, setIndex] = React.useState(0);

    if (fetchResult === null) {
        Util.fetch(credentials, GQLQuery.getMe(), setFetchResult);
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

export function ManageFineScreen({ route }: any) {
    const navigation = useNavigation();
    const credentials = React.useContext(AuthCtx).credentials;
    const [fetchResult, setFetchResult] = React.useState<FetchResult<Query["GetFine"]>>(null);

    if (fetchResult === null) {
        Util.fetch(credentials, GQLQuery.getFine(route.params.id), setFetchResult);
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
        return (
            <View style={{ flex: 1 }}>
                <Appbar.Header>
                    <Appbar.Content title="Manage Fine" />
                    <Appbar.Action icon="account" onPress={() => { }} />
                    <Appbar.Action icon="logout" onPress={() => {
                        EncryptedStorage.removeItem(Key.CREDENTIALS);
                        DevSettings.reload();
                    }} />
                </Appbar.Header>
                <ScrollView style={ManageFineStyles.view}>
                    <Avatar.Icon
                        style={ManageFineStyles.avatar}
                        size={150} icon="clipboard-list"
                    />
                    <Text variant="titleLarge" style={ManageFineStyles.headline}>Officer</Text>
                    <Text>{fetchResult.officer.username}</Text>

                    <Text variant="titleLarge" style={ManageFineStyles.headline}>Time</Text>
                    <Text>{Util.formatDate(fetchResult.time)}</Text>

                    <Text variant="titleLarge" style={ManageFineStyles.headline}>Offenses</Text>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title>Type</DataTable.Title>
                            <DataTable.Title numeric>Amount</DataTable.Title>
                        </DataTable.Header>
                        {fetchResult.offenses.map((offense, i) => (
                            <DataTable.Row key={i}>
                                <DataTable.Cell>{offense.name}</DataTable.Cell>
                                <DataTable.Cell numeric>{offense.amount}</DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable>
                </ScrollView>
                <FAB
                    disabled={fetchResult.payment !== null}
                    icon="currency-usd"
                    label="Pay"
                    style={ManageFineStyles.fab}
                    onPress={() => navigation.navigate("PayFine", { id: route.params.id })}
                />
            </View>
        );
    }
}

export function PayFineScreen({ route }: any) {
    const navigation = useNavigation();
    const credentials = React.useContext(AuthCtx).credentials;
    const [fetchResult, setFetchResult] = React.useState<FetchResult<Mutation["PayFine"]> | "pending">(null);
    const [cardNo, setCardNo] = React.useState("XXXX-XXXX-XXXX-XXXX");
    const [cardExpMonth, setCardExpMonth] = React.useState("XX");
    const [cardExpYear, setCardExpYear] = React.useState("XX");
    const [cardCVC, setCardCVC] = React.useState("XXX");

    if (fetchResult === null) {
        return (
            <View style={{ flex: 1 }}>
                <Appbar.Header>
                    <Appbar.Content title="Manage Fine" />
                    <Appbar.Action icon="account" onPress={() => { }} />
                    <Appbar.Action icon="logout" onPress={() => {
                        EncryptedStorage.removeItem(Key.CREDENTIALS);
                        DevSettings.reload();
                    }} />
                </Appbar.Header>
                <ScrollView style={ManageFineStyles.view}>
                    <Avatar.Icon
                        style={ManageFineStyles.avatar}
                        size={150} icon="clipboard-list"
                    />
                    <Text variant="titleLarge" style={ManageFineStyles.headline}>Card No.</Text>
                    <TextInput
                        value={cardNo}
                        onChangeText={text => setCardNo(text)}
                    ></TextInput>

                    <Text variant="titleLarge" style={ManageFineStyles.headline}>Expiry Month</Text>
                    <TextInput
                        value={cardExpMonth}
                        onChangeText={text => setCardExpMonth(text)}
                    ></TextInput>

                    <Text variant="titleLarge" style={ManageFineStyles.headline}>Expiry Year</Text>
                    <TextInput
                        value={cardExpYear}
                        onChangeText={text => setCardExpYear(text)}
                    ></TextInput>

                    <Text variant="titleLarge" style={ManageFineStyles.headline}>CVC</Text>
                    <TextInput
                        value={cardCVC}
                        onChangeText={text => setCardCVC(text)}
                    ></TextInput>
                </ScrollView>
                <FAB
                    icon="currency-usd"
                    label="Confirm Payment"
                    style={ManageFineStyles.fab}
                    onPress={
                        () => {
                            setFetchResult("pending");
                            Util.fetch(
                                credentials,
                                GQLMutation.payFine(
                                    route.params.id,
                                    cardNo,
                                    cardExpMonth,
                                    cardExpYear,
                                    cardCVC
                                ),
                                setFetchResult
                            );
                        }
                    }
                />
            </View>
        );
    } else if (fetchResult === "pending") {
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
        navigation.goBack();
    }
}