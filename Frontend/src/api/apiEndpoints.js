// const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';
const BASE_URL = 'http://localhost:8080'

export const apiEndpoints = {
  LOGIN: `${BASE_URL}/api/auth/login`,
  SIGNUP: `${BASE_URL}/api/auth/signup`,
  CREATE_PROJECT: `${BASE_URL}/api/projects`,
  GET_PROJECTS: `${BASE_URL}/api/projects`,
  ADD_PROJECT_MEMBER: (projectId) => `${BASE_URL}/api/projects/${projectId}/add-member`,
  CREATE_TASK: `${BASE_URL}/api/tasks`,
  GET_MY_TASKS: `${BASE_URL}/api/tasks/my`,
  UPDATE_TASK_STATUS: (taskId) => `${BASE_URL}/api/tasks/${taskId}/status`,
  GET_PROJECT_TASKS: (projectId) => `${BASE_URL}/api/tasks/project/${projectId}`,
};

export default apiEndpoints;
