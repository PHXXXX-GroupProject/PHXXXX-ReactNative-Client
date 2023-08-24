import { Banner } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { GraphQLError } from "graphql";

export function ErrorBanner({ error, actions }: { error: Error, actions: any }) {
    return <Banner
        visible={true}
        icon={() => <Icon size={50} name="error" />}
        actions={actions}
    >
        {
            (error instanceof GraphQLError) ? (
                `${(error.extensions.title as string).toUpperCase()}\n${error.extensions.suggestion}`
            ) : (
                `${error.message}\n${error.name}`
            )
        }
    </Banner>
}