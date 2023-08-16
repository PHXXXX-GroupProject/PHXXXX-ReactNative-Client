import { LogInActionType } from "./enum";

export interface AuthActions {
    signIn: (username: string, password: string) => Promise<void>;
    signOut: () => void;
}

export interface LogInAction {
    type: LogInActionType;
    error: string | null;
    jwtToken: string | null;
}

export interface LogInState {
    isLoading: Boolean;
    error: string | null;
    jwtToken: string | null;
}