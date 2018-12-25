export class Food {
  cooked: boolean = false;
  constructor(
    public type: string,
    public cost: number,
    public health: number
  ) {}
}
