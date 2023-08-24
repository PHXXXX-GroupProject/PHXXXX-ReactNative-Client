export type FetchState<D> = D | Error | null;

export interface AuthActions {
    signIn: (username: string, password: string) => Promise<void>;
    signOut: () => void;
}

export interface AuthContext {
    credentials: FetchState<Credentials>;
    callback: React.Dispatch<FetchState<Credentials>>
}

export interface Credentials {
    jwtToken: string;
}

export interface SceneRoute {
    key: string,
    title: string,
    focusedIcon: string
}