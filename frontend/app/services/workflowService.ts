import { api } from "../lib/api";

export const createWorkflow = async (data: any) => {
  const response = await api.post("/workflows/", data);
  return response.data;
};

export const getWorkflows = async () => {
  const response = await api.get("/workflows/");
  return response.data;
};

export const getWorkflow = async (id: number) => {
  const response = await api.get(`/workflows/${id}`);
  return response.data;
};

export const updateWorkflow = async (
  id: number,
  data: any
) => {
  const response = await api.put(
    `/workflows/${id}`,
    data
  );
  return response.data;
};

export const executeWorkflow = async (
  id: number
) => {
  const response = await api.post(
    `/workflows/${id}/execute`
  );
  return response.data;
};

export const deleteWorkflow = async (
  id: number
) => {
  const response = await api.delete(
    `/workflows/${id}`
  );
  return response.data;
};