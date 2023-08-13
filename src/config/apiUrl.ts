const apiUrlDev = process.env.NEXT_PUBLIC_API_URL_DEV;
const apiUrlProd = process.env.NEXT_PUBLIC_API_URL;

export const API_URL = process.env.NODE_ENV === 'development' ? apiUrlDev : apiUrlProd;
