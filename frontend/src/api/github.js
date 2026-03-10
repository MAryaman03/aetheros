import axios from "axios";

const api = axios.create({ withCredentials: true });

export const getGithubProfile = () => api.get("/api/github/profile");
export const getGithubRepos = (params = {}) => api.get("/api/github/repos", { params });
export const getGithubEvents = () => api.get("/api/github/events");
export const getGithubStats = () => api.get("/api/github/stats");
export const getGithubRepo = (owner, repo) => api.get(`/api/github/repo/${owner}/${repo}`);
