import * as React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useQuery } from "@apollo/client";
import { ScrollView } from "react-native";
import { ActivityIndicator, Banner, List } from "react-native-paper";
import { Query } from "../lib/graphql";

export function UsersScene() {
    const [visible, setVisible] = React.useState(true);
    const { loading, error, data } = useQuery(Query.getUsers());

    if (loading) {
        return <ActivityIndicator animating={true} size={100} style={{marginTop: "50%"}}/>;
    } else if (error) {
        return <Banner visible={visible} icon={() => <Icon size={50} name="error" />}>
            {error.message}
        </Banner>
    } else {
        return <ScrollView>
            {
                data.users.map((item: any) => {
                    return <List.Item
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