import { Mutation } from "./type";

export type FetchResult<D> = D | Error | null;

export interface AuthActions {
    signIn: (username: string, password: string) => Promise<void>;
    signOut: () => void;
}

export interface AuthContext {
    credentials: Mutation["SignIn"];
    setCredentialsProxy: React.Dispatch<FetchResult<Mutation["SignIn"]>>
}

export interface SceneRoute {
    key: string,
    title: string,
    focusedIcon: string
}