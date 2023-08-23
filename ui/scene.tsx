import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ScrollView } from "react-native";
import { ActivityIndicator, Banner, List } from "react-native-paper";
import { Query } from "../lib/graphql";
import { AuthCtx } from "../App";
import { FetchState } from "../lib/interface";
import { GraphQLError } from "graphql";
import { Util } from "../lib/util";

export function UsersScene() {
    const credentials = React.useContext(AuthCtx).data;
    const [fetchState, setFetchState] = React.useState<FetchState<any, GraphQLError>>({
        loading: true,
        error: undefined,
        data: undefined
    });
    React.useEffect(() => {
        Util.fetch(credentials.jwtToken!, Query.getUsers(), setFetchState);
    }, [fetchState.loading]);

    if (fetchState.loading) {
        return <ActivityIndicator animating={true} size={100} style={{marginTop: "50%"}}/>;
    } else if (fetchState.error) {
        return <Banner
            visible={true}
            icon={() => <Icon size={50} name="error"/>}
        >
            {(fetchState.error.extensions.title as string).toUpperCase() + "\n" + fetchState.error.extensions.suggestion}
        </Banner>
    } else {
        return <ScrollView>
            {
                fetchState.data.users.map((item: any, i: number) => {
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