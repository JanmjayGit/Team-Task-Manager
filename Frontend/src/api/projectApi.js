import api from './axios';
import apiEndpoints from './apiEndpoints';

export const createProject = async (payload) => {
  const { data } = await api.post(apiEndpoints.CREATE_PROJECT, payload);
  return data;
};

export const getProjects = async () => {
  const { data } = await api.get(apiEndpoints.GET_PROJECTS);
  return data;
};

export const addProjectMember = async (projectId, userId) => {
  const { data } = await api.post(apiEndpoints.ADD_PROJECT_MEMBER(projectId), null, {
    params: { userId },
  });
  return data;
};
