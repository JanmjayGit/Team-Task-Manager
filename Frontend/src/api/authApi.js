import api from './axios';
import apiEndpoints from './apiEndpoints';

export const login = async (payload) => {
  const { data } = await api.post(apiEndpoints.LOGIN, payload);
  return data;
};

export const signup = async (payload) => {
  const { data } = await api.post(apiEndpoints.SIGNUP, payload);
  return data;
};
