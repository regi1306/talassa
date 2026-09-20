import axios from "axios";


const API_URL =
  "http://localhost:3000/api/asignaciones";


export async function evaluarMuelles(
  idOperacion
) {
  const respuesta =
    await axios.get(
      `${API_URL}/evaluar/${idOperacion}`
    );

  return respuesta.data;
}


export async function confirmarAsignacionMuelle(
  datos
) {
  const respuesta =
    await axios.post(
      `${API_URL}/confirmar`,
      datos
    );

  return respuesta.data;
}