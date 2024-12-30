import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = '__IS_PUBLIC_KEY__';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
