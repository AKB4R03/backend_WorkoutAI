import bcryptjs from "bcryptjs";

export const hash = (text: string): string => bcryptjs.hashSync(text);
export const compare = (text: string, hash: string): boolean =>
  bcryptjs.compareSync(text, hash);
