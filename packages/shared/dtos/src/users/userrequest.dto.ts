export class CreateUserDto {
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}

export class UpdateUserDto {
  givenName?: string;
  familyName?: string;
}