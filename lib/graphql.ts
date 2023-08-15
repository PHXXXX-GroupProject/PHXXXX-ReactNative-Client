import { gql } from "@apollo/client";

export class Query {
    static getUsers() {
        return gql`
            query {
                users: GetUsers {
                    username
                    preferredName
                }
            }
        `;
    }

    static getUser(username: string) {
        return gql`
            query {
                user: GetUser(username: "${username}") {
                    username
                }
            }
        `;
    }
}