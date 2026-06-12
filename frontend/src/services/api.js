import axios from 'axios';

const BASE = 'http://localhost:5000';

export const getCrimes = (params) =>
  axios.get(`${BASE}/api/crimes`, { params });

export const getSummary = () =>
  axios.get(`${BASE}/api/summary`);

export const getStates = () =>
  axios.get(`${BASE}/api/states`);

export const getYears = () =>
  axios.get(`${BASE}/api/years`);

export const getTrends = (params) =>
  axios.get(`${BASE}/api/trends`, { params });

export const getCrimeTypes = () =>
  axios.get(`${BASE}/api/crime-types`);

export const getForecast = (params) =>
  axios.get('http://localhost:5001/forecast', { params });

export const getClusters = () =>
  axios.get('http://localhost:5001/clusters');

export const getTopStates = (params) =>
  axios.get(`${BASE}/api/top-states`, { params });

export const getCrimeTypeStats = (params) =>
  axios.get(`${BASE}/api/crime-stats`, { params });