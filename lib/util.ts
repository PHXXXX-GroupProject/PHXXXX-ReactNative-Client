import { Credentials, FetchResult } from "./interface";

export class Util {
    static fetch<D>(credentials: Credentials, query: string, callback: React.Dispatch<FetchResult<D>>) {
        fetch("http://10.0.2.2:8080", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": credentials
            },
            body: JSON.stringify({
                query
            })
        })
        .then(res => res.json())
        .then(res => {
            if (res.data) {
                callback(res.data.result as D);
            } else {
                throw res.errors[0];
            }
        }).catch((err: Error) => {
            console.error(err);
            callback(err);
        });
    }
}