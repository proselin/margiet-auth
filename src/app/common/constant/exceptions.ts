export const enum ExceptionCode {
  MA_1 = 'MA_1',
  MA_2 = 'MA_2',
  MA_3 = 'MA_3',
}

export const ExceptionsMessage: Readonly<Record<ExceptionCode, string>> = {
  MA_1: 'User was not confirmed email !',
  MA_2: 'Email has been used !',
  MA_3: 'Password and confirm password is not match !',
} as const;
