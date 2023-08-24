import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ScrollView } from "react-native";
import { ActivityIndicator, Banner, List } from "react-native-paper";
import { Query } from "../lib/graphql";
import { AuthCtx } from "../App";
import { Credentials, FetchState } from "../lib/interface";
import { GraphQLError, isNullableType } from "graphql";
import { Util } from "../lib/util";
import { User } from "../lib/type";
import { ErrorBanner } from "./component";

export function UsersScene() {
    const credentials = React.useContext(AuthCtx).credentials;
    const [fetchResult, setFetchResult] = React.useState<FetchState<User[]>>(null);
    
    if (fetchResult === null) {
        Util.fetch(credentials as Credentials, Query.getUsers(), setFetchResult);
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
                    />
                })
            }
        </ScrollView>
    }
}