import React from "react";
import EncryptedStorage from "react-native-encrypted-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider } from "react-native-paper";
import { LoginScreen, HomeScreen, SplashScreen } from "./ui/screen";
import { AuthContext, Credentials, FetchState } from "./lib/interface";
import { GraphQLError } from "graphql";
import { Key } from "./lib/enum";

export const AuthCtx = React.createContext<AuthContext>({} as AuthContext);
const Stack = createNativeStackNavigator();

function App() {    
    const [context, setContext] = React.useState<FetchState<any, GraphQLError>>({
        loading: true,
        error: undefined,
        data: undefined
    });
    async function callback(context: FetchState<Credentials, GraphQLError>) {
        if (context.data) {
            console.log("NEW_CREDENTIALS", context.data);
            await EncryptedStorage.setItem(Key.CREDENTIALS, JSON.stringify(context.data));
        }
        setContext(context);
    }

    React.useEffect(() => {
        EncryptedStorage.getItem(Key.CREDENTIALS).then(stringifiedCredentials => {
            setContext({
                loading: false,
                data: JSON.parse(stringifiedCredentials!) as Credentials,
                error: undefined
            });
        });
    }, []);

    return (
        <PaperProvider>
            <NavigationContainer>
                <AuthCtx.Provider value={{ ...context, callback }}>
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        {
                            (context.loading) ? (
                                <Stack.Screen
                                    name="Splash"
                                    component={SplashScreen}
                                />
                            ) : (
                                (context.data) ? (
                                    <Stack.Screen
                                        name="Home"
                                        component={HomeScreen}
                                    />
                                ) : (
                                    <Stack.Screen
                                        name="Login"
                                        component={LoginScreen}
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