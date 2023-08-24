import React from "react";
import EncryptedStorage from "react-native-encrypted-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider } from "react-native-paper";
import { LoginScreen, HomeScreen, SplashScreen } from "./ui/screen";
import { AuthContext, Credentials, FetchState } from "./lib/interface";
import { Key } from "./lib/enum";

export const AuthCtx = React.createContext<AuthContext>({} as AuthContext);
const Stack = createNativeStackNavigator();

function App() {
    const [credentials, setCredentials] = React.useState<FetchState<Credentials>>(null);
    async function callback(context: FetchState<Credentials>) {
        if (context && !(context instanceof Error)) {
            console.log("NEW_CREDENTIALS", context);
            await EncryptedStorage.setItem(Key.CREDENTIALS, JSON.stringify(context));
        }
        setCredentials(context);
    }

    if (credentials === null) {
        EncryptedStorage.getItem(Key.CREDENTIALS).then(stringifiedCredentials => {
            setCredentials(JSON.parse(stringifiedCredentials!) as Credentials);
        }).catch((err: Error) => {
            console.error(err);
            setCredentials(err);
        });
    }

    return (
        <PaperProvider>
            <NavigationContainer>
                <AuthCtx.Provider value={{ credentials, callback }}>
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        {
                            (credentials === null) ? (
                                <Stack.Screen
                                    name="Splash"
                                    component={SplashScreen}
                                />
                            ) : (
                                (credentials instanceof Error) ? (
                                    <Stack.Screen
                                    name="Login"
                                    component={LoginScreen}
                                    />
                                ) : (
                                    <Stack.Screen
                                        name="Home"
                                        component={HomeScreen}
                                    />
                                )
                            )
                        }
                    </Stack.Navigator>
                </AuthCtx.Provider>
            </NavigationContainer>
        </PaperProvider>
    );
}

export default App;