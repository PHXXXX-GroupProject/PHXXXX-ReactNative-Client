export class Query {
    static getMe() {
        return `
            query {
                result: GetMe {
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
                result: GetUsers {
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
                result: SignIn(username: "${username}", password: "${password}")
            }
        `;
    }
}