import axios from "axios";

const api = axios.create({ withCredentials: true });

export const getVSCodeExtensions = () => api.get("/api/vscode/extensions");
export const getVSCodeDeepLink = (repoUrl) =>
    api.get("/api/vscode/open", { params: { repoUrl } });
export const getDevContainerTips = () => api.get("/api/vscode/devcontainer-tips");
