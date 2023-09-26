import React from "react";
import EncryptedStorage from "react-native-encrypted-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider } from "react-native-paper";
import { LoginScreen, HomeScreen, SplashScreen, ManageFineScreen } from "./ui/screen";
import { AuthContext, Credentials, FetchResult } from "./lib/interface";
import { Key } from "./lib/enum";

export const AuthCtx = React.createContext<AuthContext>({} as AuthContext);
const Stack = createNativeStackNavigator();

export default function App() {
    const [credentials, setCredentials] = React.useState<FetchResult<Credentials>>(null);
    async function setCredentialsProxy(result: FetchResult<Credentials>) {
        if (result && !(result instanceof Error)) {
            console.log("NEW_CREDENTIALS", result);
            await EncryptedStorage.setItem(Key.CREDENTIALS, result);
        }
        setCredentials(result);
    }

    if (credentials === null) {
        EncryptedStorage.getItem(Key.CREDENTIALS).then(credentials => {
            if (credentials === null) {
                throw Error("Session expired. Please login again");
            } else {
                setCredentials(credentials);
            }
        }).catch((err: Error) => {
            console.error(err);
            setCredentials(err);
        });
    }

    return (
        <PaperProvider>
            <NavigationContainer>
                <AuthCtx.Provider value={{ credentials, callback: setCredentialsProxy }}>
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
                                    [<Stack.Screen
                                        key="0"
                                        name="Home"
                                        component={HomeScreen}
                                    />,
                                    <Stack.Screen
                                        key="1"
                                        name="ManageFineScreen"
                                        component={ManageFineScreen}
                                    />]
                                )
                            )
                        }
                    </Stack.Navigator>
                </AuthCtx.Provider>
            </NavigationContainer>
        </PaperProvider>
    );
}