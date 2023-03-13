const candidateWords = {
  ك: 'ک',
  دِ: 'د',
  بِ: 'ب',
  زِ: 'ز',
  ذِ: 'ذ',
  شِ: 'ش',
  سِ: 'س',
  ى: 'ی',
  ي: 'ی',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
  '٠': '0',
  '۰': '0',
  '۱': '1',
  '۲': '2',
  '۳': '3',
  '۴': '4',
  '۵': '5',
  '۶': '6',
  '۷': '7',
  '۸': '8',
  '۹': '9',
};
const candidateKeys: Array<string> = Object.keys(candidateWords);

export function persianify(input: string | any) {
  if (!input || (typeof input !== 'string')) {
    return input;
  }

  candidateKeys.forEach(key => {
    // @ts-ignore
    input = input.replace(new RegExp(key, 'g'), candidateWords[key]);
  });
  return input;
}
