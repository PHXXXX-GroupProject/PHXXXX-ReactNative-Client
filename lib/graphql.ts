import { MutationPayFineArgs } from "./type";

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

    static getFine(id: string) {
        return `
        query {
            result: GetFine(id: "${id}") {
                    time
                    offender {
                        username
                    }
                    offenses {
                        amount
                        name
                    }
                    officer {
                        username
                    }
                    payment {
                        time
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

    static getFines() {
        return `
            query {
                result: GetMe {
                    fines {
                        _id
                        payment {
                            time
                        }
                    }
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

    static payFine(fineId: string, cardNo: string, cardExpMonth: string, cardExpYear: string, cardCVC: string) {
        return `
            mutation {
                result: PayFine(info: {
                    fineId: "${fineId}",
                    cardNo: "${cardNo}",
                    cardExpMonth: "${cardExpMonth}",
                    cardExpYear: "${cardExpYear}",
                    cardCVC: "${cardCVC}"
                })
            }
        `;
    }
}