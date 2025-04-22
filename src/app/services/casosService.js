// src/services/caseService.js
import { apiRequest } from "./apiServices";

// Função para buscar todos os casos
export const fetchCases = async () => {
  try {
    const data = await apiRequest("/cases", "GET", null, true);
    return data;
  } catch (error) {
    throw new Error(error.message || "Erro ao buscar casos");
  }
};

// Função para criar um novo caso
export const createCase = async (caseData) => {
  try {
    const data = await apiRequest("/cases", "POST", caseData, true);
    return data;
  } catch (error) {
    throw new Error(error.message || "Erro ao criar caso");
  }
};