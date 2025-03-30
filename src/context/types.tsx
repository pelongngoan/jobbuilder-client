export interface UserDataType {
  id: string;
  name: string;
  email: string;
}

export interface UserContextType {
  user: UserDataType | null;
  token: string | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<UserDataType | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  login: (
    params: LoginParams,
    errorCallback?: ErrCallbackType
  ) => Promise<void>;
  registerUser: (
    params: RegisterParams,
    errorCallback?: ErrCallbackType
  ) => Promise<void>;
  logout: () => void;
  isLoggedIn: () => boolean;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

export interface ErrCallbackType {
  (error: { message: string }): void;
}
