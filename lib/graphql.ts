import { gql } from "@apollo/client";

export class Query {
    static getMe() {
        return gql`
            query {
                user: GetMe {
                    username
                }
            }
        `;
    }

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
}

export class Mutation {
    static signIn(username: string, password: string) {
        return gql`
            mutation {
                jwtToken: SignIn(username: "${username}", password: "${password}")
            }
        `;
    }
}