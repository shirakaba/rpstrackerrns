import * as appSettings from 'tns-core-modules/application-settings';
import { PtStorageRepository } from '~/core/contracts/repositories';

export class StorageRepository implements PtStorageRepository {
  public setItem<T>(key: string, value: T): void {
    const valueStr = JSON.stringify(value);
    appSettings.setString(key, valueStr);
  }

  public getItem<T>(key: string): T {
    const valueStr = appSettings.getString(key);
    if (valueStr) {
      return JSON.parse(valueStr);
    } else {
      return undefined;
    }
  }

  public removeItem(key: string): void {
    appSettings.remove(key);
  }

  public clearAll(): void {
    appSettings.clear();
  }
}
