import axios from 'axios';

const API_BASE = 'https://crime-analytics.onrender.com';
const ML_BASE = 'https://python-part-teic.onrender.com';

export const getCrimes = (params) =>
  axios.get(`${API_BASE}/api/crimes`, { params });

export const getSummary = () =>
  axios.get(`${API_BASE}/api/summary`);

export const getStates = () =>
  axios.get(`${API_BASE}/api/states`);

export const getYears = () =>
  axios.get(`${API_BASE}/api/years`);

export const getTrends = (params) =>
  axios.get(`${API_BASE}/api/trends`, { params });

export const getCrimeTypes = () =>
  axios.get(`${API_BASE}/api/crime-types`);

export const getTopStates = (params) =>
  axios.get(`${API_BASE}/api/top-states`, { params });

export const getCrimeTypeStats = (params) =>
  axios.get(`${API_BASE}/api/crime-stats`, { params });

export const getForecast = (params) =>
  axios.get(`${ML_BASE}/forecast`, { params });

export const getClusters = () =>
  axios.get(`${ML_BASE}/clusters`);
