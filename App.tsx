import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider } from "react-native-paper";
import EncryptedStorage from "react-native-encrypted-storage";
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, concat, useQuery } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { LoginScreen, HomeScreen, SplashScreen } from "./ui/screen";
import { LogInAction, LogInState } from "./lib/interface";
import { LogInActionType } from "./lib/enum";
import { Authenticator } from "./lib/class";

const httpLink = new HttpLink({ uri: "http://10.0.2.2:8080/" });
const authMiddleware = setContext(async (operation) => {
    const token = await EncryptedStorage.getItem("JWT_TOKEN");
    return {
        headers: {
            authorization: token ? token : "",
        }
    };
});
const client = new ApolloClient({
    link: concat(authMiddleware, httpLink),
    cache: new InMemoryCache(),
});

export const AuthContext = React.createContext<Authenticator>({} as Authenticator);
const Stack = createNativeStackNavigator();

function App({ navigation }: any) {
    const [state, dispatch] = React.useReducer<(state: LogInState, action: LogInAction) => LogInState>(
        function (prevState, action) {
            switch (action.type) {
                case LogInActionType.LOADING:
                    return {
                        isLoading: true,
                        jwtToken: null,
                        error: null
                    };
                case LogInActionType.TOKEN_RESTORED:
                    return {
                        isLoading: false,
                        jwtToken: action.jwtToken,
                        error: null
                    };
                case LogInActionType.SIGNED_IN:
                    EncryptedStorage.setItem("JWT_TOKEN", action.jwtToken!);
                    return {
                        isLoading: false,
                        jwtToken: action.jwtToken,
                        error: null
                    };
                case LogInActionType.SIGNED_OUT:
                    return {
                        ...prevState,
                        jwtToken: null,
                    };
                case LogInActionType.ERRORED:
                    return {
                        isLoading: false,
                        jwtToken: null,
                        error: action.error
                    };
            }
        },
        {
            isLoading: true,
            jwtToken: null,
            error: null
        }
    );

    const authenticator = new Authenticator(dispatch);
    React.useEffect(() => {
        authenticator.restoreToken();
    }, []);

    return (
        <ApolloProvider client={client}>
            <PaperProvider>
                <NavigationContainer>
                    <AuthContext.Provider value={authenticator}>
                        <Stack.Navigator screenOptions={{ headerShown: false }}>
                            {
                                (state.isLoading) ? (
                                    <Stack.Screen
                                        name="Splash"
                                        component={SplashScreen}
                                    />
                                ) : (
                                    (state.jwtToken) ? (
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
                    </AuthContext.Provider>
                </NavigationContainer>
            </PaperProvider>
        </ApolloProvider>
    );
}

export default App;