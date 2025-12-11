export class UserDto {
    givenName: string;
    familyName: string;
    email: string;

    constructor(givenName: string, familyName: string, email: string) {
        this.givenName = givenName;
        this.familyName = familyName;
        this.email = email;
    }
}