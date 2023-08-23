import { GraphQLError } from "graphql";

export interface AuthActions {
    signIn: (username: string, password: string) => Promise<void>;
    signOut: () => void;
}

export interface AuthContext {
    loading: boolean;
    error: undefined | GraphQLError;
    data: Credentials;
    callback: React.Dispatch<FetchState<Credentials, GraphQLError>>
}

export interface Credentials {
    jwtToken: string | null;
}

export interface FetchState<D = any, E = any> {
    loading: boolean;
    error: undefined | E;
    data: undefined | D
}

export interface SceneData {
    key: string,
    title: string,
    focusedIcon: string
}