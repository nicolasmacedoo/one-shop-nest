export class Email {
  public value: string

  constructor(value: string) {
    this.value = value
  }

  get email(): string {
    return this.value
  }

  toString(): string {
    return this.value
  }

  isValid(): boolean {
    const regex = /\S+@\S+\.\S+/
    return regex.test(this.value)
  }
}
