import * as emailValidator from 'email-validator';
import {
  Observable,
  PropertyChangeData
} from 'tns-core-modules/data/observable';
import { PtAuthService } from '~/core/contracts/services';
import { PtRegisterModel } from '~/core/models/domain';
import { EMPTY_STRING } from '~/core/models/domain/constants/strings';
import { getAuthService } from '~/globals/dependencies/locator';
import { ObservableProperty } from '~/shared/observable-property-decorator';

export class RegisterViewModel extends Observable {
  private authService: PtAuthService;
  public fullName = EMPTY_STRING;
  public nameEmpty = false;
  public email = EMPTY_STRING;
  public emailValid = true;
  public emailEmpty = false;
  public password = EMPTY_STRING;
  public passwordEmpty = false;
  public formValid = false;
  @ObservableProperty() public loggingIn = false;

  constructor() {
    super();

    this.authService = getAuthService();

    this.on(
      Observable.propertyChangeEvent,
      (propertyChangeData: PropertyChangeData) => {
        this.validate(propertyChangeData.propertyName);
      }
    );
  }

  public onRegisterTapHandler() {
    const registerModel: PtRegisterModel = {
      username: this.email,
      password: this.password,
      fullName: this.fullName
    };

    return new Promise((resolve, reject) => {
      this.authService
        .register(registerModel)
        .then(() => {
          this.loggingIn = false;
          resolve();
        })
        .catch(er => {
          this.loggingIn = false;
          reject(er);
        });
    });
  }

  private validate(changedPropName: string) {
    switch (changedPropName) {
      case 'fullName':
        if (this.fullName.trim() === EMPTY_STRING) {
          this.set('nameEmpty', true);
        } else {
          this.set('nameEmpty', false);
        }
        break;

      case 'email':
        if (this.email.trim() === EMPTY_STRING) {
          this.set('emailEmpty', true);
          this.set('emailValid', true);
        } else if (emailValidator.validate(this.email)) {
          this.set('emailValid', true);
          this.set('emailEmpty', false);
        } else {
          this.set('emailValid', false);
          this.set('emailEmpty', false);
        }
        break;

      case 'password':
        if (this.password.trim().length === 0) {
          this.set('passwordEmpty', true);
        } else {
          this.set('passwordEmpty', false);
        }
        break;

      default:
        return;
    }
    if (
      !this.nameEmpty &&
      this.emailValid &&
      !this.emailEmpty &&
      !this.passwordEmpty
    ) {
      this.set('formValid', true);
    } else {
      this.set('formValid', false);
    }
  }
}
