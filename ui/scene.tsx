import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Headline, List } from "react-native-paper";
import { Query as GQLQuery } from "../lib/graphql";
import { AuthCtx } from "../App";
import { FetchResult } from "../lib/interface";
import { Util } from "../lib/util";
import { Query } from "../lib/type";
import { ErrorBanner } from "./component";
import { useNavigation } from "@react-navigation/native";

export function RolesScene() {
    const credentials = React.useContext(AuthCtx).credentials;
    const [fetchResult, setFetchResult] = React.useState<FetchResult<Query["GetRoles"]>>(null);
    
    if (fetchResult === null) {
        Util.fetch(credentials, GQLQuery.getRoles(), setFetchResult);
        return <ActivityIndicator animating={true} size={100} style={{marginTop: "50%"}}/>;
    } else if (fetchResult instanceof Error) {
        return <ErrorBanner error={fetchResult} actions={[]}/>
    } else {
        return <ScrollView>
            {
                fetchResult.map((item, i) => {
                    return <List.Item
                        key={i}
                        title={item.name}
                        titleStyle={{ fontSize: 20 }}
                        left={props => <Icon {...props} size={70} name="person" />}
                        onPress={() => {
                            // navigation.navigate("ManageRoleScreen", { id: item._id });
                        }}
                    />
                })
            }
        </ScrollView>
    }
}

export function UsersScene() {
    const navigation = useNavigation();
    const credentials = React.useContext(AuthCtx).credentials;
    const [fetchResult, setFetchResult] = React.useState<FetchResult<Query["GetUsers"]>>(null);
    
    if (fetchResult === null) {
        Util.fetch(credentials, GQLQuery.getUsers(), setFetchResult);
        return <ActivityIndicator animating={true} size={100} style={{marginTop: "50%"}}/>;
    } else if (fetchResult instanceof Error) {
        return <ErrorBanner error={fetchResult} actions={[]}/>
    } else {
        return <ScrollView>
            {
                fetchResult.map((item, i) => {
                    return <List.Item
                        key={i}
                        title={item.username}
                        titleStyle={{ fontSize: 20 }}
                        description={item.preferredName}
                        left={props => <Icon {...props} size={70} name="person" />}
                        onPress={() => {
                            navigation.navigate("ManageUserScreen", { id: item._id });
                        }}
                    />
                })
            }
        </ScrollView>
    }
}

export function FinesScene() {
    const navigation = useNavigation();
    const credentials = React.useContext(AuthCtx).credentials;
    const [fetchResult, setFetchResult] = React.useState<FetchResult<Query["GetMe"]>>(null);
    
    if (fetchResult === null) {
        Util.fetch(credentials, GQLQuery.getFines(), setFetchResult);
        return <ActivityIndicator animating={true} size={100} style={{marginTop: "50%"}}/>;
    } else if (fetchResult instanceof Error) {
        return <ErrorBanner error={fetchResult} actions={[]}/>
    } else {
        return <ScrollView>
            <Headline>   Pending</Headline>
            <View>
            {
                fetchResult.fines.filter(item => item.payment === null).map((item, i) => {
                    return <List.Item
                        key={i}
                        title={item._id}
                        titleStyle={{ fontSize: 20 }}
                        left={props => <Icon {...props} size={70} name="pending-actions" />}
                        onPress={() => {
                            navigation.navigate("ManageFine", { id: item._id });
                        }}
                    />
                })
            }
            </View>
            <Headline>   Completed</Headline>
            <View>
            {
                fetchResult.fines.filter(item => item.payment !== null).map((item, i) => {
                    return <List.Item
                        key={i}
                        title={item._id}
                        titleStyle={{ fontSize: 20 }}
                        left={props => <Icon {...props} size={70} name="task-alt" />}
                        onPress={() => {
                            navigation.navigate("ManageFine", { id: item._id });
                        }}
                    />
                })
            }
            </View>
        </ScrollView>
    }
}