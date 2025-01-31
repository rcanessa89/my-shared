export const isMobile = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    'android',
    'iphone',
    'ipad',
    'ipod',
    'webos',
    'blackberry',
    'windows phone',
    'opera mini'
  ];

  return mobileKeywords.some((keyword) => userAgent.includes(keyword));
};
