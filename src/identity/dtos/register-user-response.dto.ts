export interface IRegisterUserResponse {
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
