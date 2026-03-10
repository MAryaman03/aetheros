import axios from "axios";

const api = axios.create({ withCredentials: true });

export const getAITools = () => api.get("/api/ai/tools");
export const explainCode = (code, language) =>
    api.post("/api/ai/explain", { code, language });
