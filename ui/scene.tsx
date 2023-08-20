import * as React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { gql, useQuery } from "@apollo/client";
import { ScrollView } from "react-native";
import { ActivityIndicator, Banner, List } from "react-native-paper";
import { Query } from "../lib/graphql";

export function UsersScene() {
    const { loading, error, data } = useQuery(gql`${Query.getUsers()}`);

    if (loading) {
        return <ActivityIndicator animating={true} size={100} style={{marginTop: "50%"}}/>;
    } else if (error) {
        return <Banner visible={true} icon={() => <Icon size={50} name="error" />}>
            {error.message}
        </Banner>
    } else {
        return <ScrollView>
            {
                data.users.map((item: any, i: number) => {
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