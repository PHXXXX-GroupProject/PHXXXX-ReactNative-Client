export type Credentials = string;

export type FetchResult<D> = D | Error | null;

export interface AuthActions {
    signIn: (username: string, password: string) => Promise<void>;
    signOut: () => void;
}

export interface AuthContext {
    credentials: FetchResult<Credentials>;
    callback: React.Dispatch<FetchResult<Credentials>>
}

export interface SceneRoute {
    key: string,
    title: string,
    focusedIcon: string
}