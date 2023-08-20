export class Query {
    static getMe() {
        return `
            query {
                user: GetMe {
                    role {
                        permissions {
                            moduleId value module {
                                url
                            }
                        }
                    }
                }
            }
        `;
    }

    static getUsers() {
        return `
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
        return `
            mutation {
                jwtToken: SignIn(username: "${username}", password: "${password}")
            }
        `;
    }
}