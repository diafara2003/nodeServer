import axios, { AxiosResponse} from "axios";
import { envs } from "./config/envs";

export async function requestAPI(request: any, token: string) {


    if (request.AllowAnonymous == null) request.AllowAnonymous = false;
    if (request.isformData == null) request.isformData = false;

    const _http = axios.create({
        headers: {
            // 'Content-Type': 'application/json',           
            Authorization: `Bearer ${token}`
        },
        baseURL: request.metodo.includes("core/api") ? envs.URL__BASE_API_CORE : envs.URL__BASE_API
    });

    let response: AxiosResponse | null = null;

    try {
 // console.log(`Request: ${envs.URL__BASE_API}${request.metodo}`);
        switch (request.type) {
            case "GET":
                 response = await _http.get(request.metodo);
                break;
            case "DELETE":
                response = await _http.delete(request.metodo);
                break;
            case "POST":
                if (request.data != null) {
                    if (request.isformData)
                        response = await _http.post(request.metodo, request.data);
                    else
                        response = await _http.post(request.metodo, JSON.stringify(request.data));
                }
                break;
            case "PUT":
                if (request.data != null) {
                    if (request.isformData)
                        response = await _http.put(request.metodo, request.data);
                    else
                        response = await _http.put(request.metodo, JSON.stringify(request.data));
                }
                break;
        }
    } catch (error) {
        console.log('error');
        response = null;
    }
    //console.log(response)
    if (response != null) return response.data; 
    else { return {}; }
}