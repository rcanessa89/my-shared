export interface FormView {
  signIn: boolean;
  code: boolean;
  forgotPass: boolean;
  newPass: boolean;
}

export type FormViewKey = keyof FormView;

export interface LoginContextType {
  formViewState: FormView;
  setFormView: (f: FormViewKey, v: boolean) => void;
}

export type FormCallBack<T> = (
  values: T,
  context: LoginContextType
) => Promise<void>;

export type OnCode = FormCallBack<{
  code: string;
  password: string;
  confirm: string;
}>;

export type OnForgotPass = FormCallBack<{ username: string }>;

export type OnNewPass = FormCallBack<{
  password: string;
  confirm: string;
}>;

export type OnSignIn = FormCallBack<{
  username: string;
  password: string;
}>;
