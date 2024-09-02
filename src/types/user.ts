export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  address: string;
  public_id: string | null;
  url: string | null;
  status: string;
  isActive: boolean;
  activationToken: string | null;
  passwordResetToken: string | null;
  passwordChangeAt: string | null;
  createdAt: string;
}
