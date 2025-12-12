import { EntityBase } from '@deigma/domain';

export class User extends EntityBase {
  familyName: string;
  givenName: string;
  email: string
}
