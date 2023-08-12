import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider } from "react-native-paper";
import { LoginScreen, HomeScreen } from "./components/screen";

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
    return (
        <PaperProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                    />
                    {/* <Stack.Screen
                        name="Home"
                        component={Home}
                        options={{ title: "Welcome" }}
                    /> */}
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}

export default App;