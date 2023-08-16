import EncryptedStorage from "react-native-encrypted-storage";

import { LogInActionType } from "./enum";
import { LogInAction } from "./interface";

export class Authenticator {
    private dispatch: (action: LogInAction) => void;

    constructor(dispatch: (action: LogInAction) => void) {
        this.dispatch = dispatch;
    }

    async restoreToken() {
        const jwtToken = await EncryptedStorage.getItem("JWT_TOKEN");

        this.dispatch({
            type: LogInActionType.TOKEN_RESTORED,
            jwtToken: jwtToken,
            error: null
        });
    }

    async signIn(username: string, password: string) {
        this.dispatch({
            type: LogInActionType.LOADING,
            jwtToken: null,
            error: null
        });

        fetch("http://10.0.2.2:8080", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `mutation {
                    jwtToken: SignIn(username: "${username}", password: "${password}")
                }`
            })
        }).then(res => res.text())
        .then(jwtToken => {
            console.log(jwtToken);
            
            this.dispatch({
                type: LogInActionType.SIGNED_IN,
                jwtToken: jwtToken,
                error: null
            });
        }).catch(err => {
            this.dispatch({
                type: LogInActionType.ERRORED,
                jwtToken: null,
                error: err
            });
        });
    }
}