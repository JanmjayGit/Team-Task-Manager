import api from './axios';
import apiEndpoints from './apiEndpoints';

export const createTask = async (payload) => {
  const { data } = await api.post(apiEndpoints.CREATE_TASK, payload);
  return data;
};

export const getMyTasks = async () => {
  const { data } = await api.get(apiEndpoints.GET_MY_TASKS);
  return data;
};

export const updateTaskStatus = async (taskId, status) => {
  const { data } = await api.put(apiEndpoints.UPDATE_TASK_STATUS(taskId), { status });
  return data;
};

export const getProjectTasks = async (projectId) => {
  const { data } = await api.get(apiEndpoints.GET_PROJECT_TASKS(projectId));
  return data;
};
