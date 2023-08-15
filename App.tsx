import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider } from "react-native-paper";
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from "@apollo/client";

import { LoginScreen, HomeScreen } from "./ui/screen";

const Stack = createNativeStackNavigator();
const client = new ApolloClient({
    uri: "http://10.0.2.2:8080/",
    cache: new InMemoryCache(),
});

function App(): JSX.Element {
    return (
        <ApolloProvider client={client}>
            <PaperProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Home">
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                        />
                        <Stack.Screen
                            name="Home"
                            component={HomeScreen}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </ApolloProvider>
    );
}

export default App;