import { FetchState } from "./interface";

export class Util {
    static fetch<D, E>(jwtToken: string, query: string, callback: React.Dispatch<FetchState<D, E>>) {
        fetch("http://10.0.2.2:8080", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": jwtToken
            },
            body: JSON.stringify({
                query
            })
        })
        .then(res => res.json())
        .then(res => {
            if (res.data) {
                callback({
                    loading: false,
                    error: undefined,
                    data: res.data
                });
            } else {
                callback({
                    loading: false,
                    error: res.errors[0],
                    data: undefined
                });
            }
        }).catch(err => {
            callback({
                loading: false,
                error: err,
                data: undefined
            });
        });
    }
}