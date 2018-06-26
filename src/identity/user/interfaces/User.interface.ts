export interface IUser {
  readonly toshi_id: string;
  readonly type: string;
  readonly payment_address: string;
  readonly username: string;
  readonly name: string;
  readonly description: string;
  readonly avatar: string;
  readonly location: any;
  readonly reputation_score: any;
  readonly review_count: number;
  readonly average_rating: number;
}

export interface ICreateUser {
  readonly username: string;
  readonly name: string;
  readonly payment_address: string;
  readonly description: string;
  readonly bot?: boolean;
  readonly avatar?: string;
  readonly location?: string;
  readonly categories?: Array<string>;
}

export interface IUpdateUser extends ICreateUser {}
