const config = {
  basename: '',
  defaultPath: '/dashboard',
  fontFamily: `'Roboto', sans-serif`,
  borderRadius: 4,
  env: import.meta.env.VITE_REACT_APP_ENV,
  ip: import.meta.env.VITE_REACT_APP_API_ENDPOINT,
  token: import.meta.env.VITE_REACT_APP_API_TOKEN,
  imgServerip: import.meta.env.VITE_REACT_APP_IMG_API_ENDPOINT
};

export default config;
