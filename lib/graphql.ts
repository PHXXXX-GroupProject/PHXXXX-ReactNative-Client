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

    static getUser(username: string) {
        return `
            query {
                result: GetUser(username: "${username}") {
                    preferredName
                    username
                    roleId
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

    static getRoles() {
        return `
            query {
                result: GetRoles {
                    _id
                    name
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