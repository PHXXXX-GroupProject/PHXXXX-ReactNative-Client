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

    static getUser(id: string) {
        return `
            query {
                result: GetUser(id: "${id}") {
                    preferredName
                    username
                    roleId
                }
            }
        `;
    }

    static getRole(id: string) {
        return `
            query {
                result: GetRole(id: "${id}") {
                    name
                    permissions {
                        module {
                            name
                        }
                        value
                    }
                }
            }
        `;
    }

    static getExam(id: string) {
        return `
            query {
                result: GetExam(id: "${id}") {
                    name
                    questions {
                        _id
                        prompt
                    }
                }
            }
        `;
    }

    static getUsers() {
        return `
            query {
                result: GetUsers {
                    _id
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

    static getExams() {
        return `
            query {
                result: GetExams {
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