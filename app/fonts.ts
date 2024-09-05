// app/fonts.ts
import { Jua, Gowun_Dodum, Dongle, Gaegu } from 'next/font/google';

export const jua = Jua({
  weight: '400',
  variable: '--font-jua',
  subsets: ['latin'],
});

export const gowunDodum = Gowun_Dodum({
  weight: '400',
  variable: '--font-gowun-dodum',
  subsets: ['latin'],
});

export const dongle = Dongle({
  weight: '300',
  variable: '--font-dongle',
  subsets: ['latin'],
});

export const gaegu = Gaegu({
  weight: '400',
  variable: '--font-gaegu',
  subsets: ['latin'],
});
