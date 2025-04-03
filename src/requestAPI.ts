import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { envs } from "./config/envs";

export async function requestAPI(request: any, token: string) {
    const url = request.metodo.includes("core/api") ? envs.URL__BASE_API_CORE : envs.URL__BASE_API;

    // Configuración especial para descargas
    const isDownload = request.isDownload 
    
    const config: AxiosRequestConfig = {
        baseURL: url,
        headers: {
            'Authorization': `Bearer ${token}`,
            ...(isDownload ? {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            } : {
                'Content-Type': request.isformData ? 'multipart/form-data' : 'application/json'
            })
        },
        responseType: isDownload ? 'arraybuffer' : 'json'
    };

   
    try {
        let response: AxiosResponse;
        
        switch (request.type) {
            case "GET":
                response = await axios.get(request.metodo, config);
                break;
            case "DELETE":
                response = await axios.delete(request.metodo, config);
                break;
            case "POST":
                response = await axios.post(
                    request.metodo, 
                    request.isformData ? request.data : JSON.stringify(request.data),
                    config
                );
                break;
            case "PUT":
                response = await axios.put(
                    request.metodo,
                    request.isformData ? request.data : JSON.stringify(request.data),
                    config
                );
                break;
            default:
                throw new Error(`Método HTTP no soportado: ${request.type}`);
        }

        // Para descargas, devolver toda la respuesta
        if (isDownload) {
            return {
                success: true,
                data: response.data,
                headers: {
                    'content-type': response.headers['content-type'],
                    'content-disposition': response.headers['content-disposition']
                }
            };
        }
        
        return response.data;

    } catch (error: any) {
        console.error('Error en requestAPI:', error);
        
        if (error.response && isDownload) {
            return {
                error: true,
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            };
        }
        
        throw error;
    }
}