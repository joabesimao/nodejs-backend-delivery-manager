export class NoExistsError extends Error {
  constructor() {
    super(`No Exists resources`);
    this.name = "NoExistsErrorResources";
  }
}
