import { PtStorageRepository } from '~/core/contracts/repositories';
import { PtStorageService } from '~/core/contracts/services';

export class StorageService implements PtStorageService {
  constructor(private storageRepo: PtStorageRepository) {}

  public setItem<T>(key: string, value: T): void {
    this.storageRepo.setItem(key, value);
  }
  public getItem<T>(key: string): T {
    return this.storageRepo.getItem(key);
  }
  public removeItem(key: string): void {
    this.storageRepo.removeItem(key);
  }
  public clearAll(): void {
    this.storageRepo.clearAll();
  }
}
