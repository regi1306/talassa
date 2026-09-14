import {
  obtenerTodosLosBuques,
} from "../repositories/buques.repository.js";


export async function listarBuques() {
  return await obtenerTodosLosBuques();
}