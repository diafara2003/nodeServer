import axios, { AxiosResponse, AxiosError, ResponseType } from "axios";
import { envs } from "./config/envs";
import fs from 'fs';

interface RequestOptions {
    AllowAnonymous?: boolean;
    isformData?: boolean;
    type: string;
    metodo: string;
    data?: any;
    responseType:ResponseType,
}

export async function requestAPI(request: RequestOptions, token: string): Promise<any> {
    if (request.AllowAnonymous == null) request.AllowAnonymous = false;
    if (request.isformData == null) request.isformData = false;

    const _http = axios.create({
        headers: {
            // 'Content-Type': 'application/json',           
            Authorization: `Bearer ${token}`
        },
        baseURL: envs.URL__BASE_API,
        responseType: request.responseType,
        

    });

    let response: AxiosResponse | null = null;

    try {
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
                        response = await _http.put(
                          request.metodo,
                          JSON.stringify(request.data)
                        );
                    }
                    break;
        }
        ;

     
   
  } catch (error) {
    console.log(error);
    return {};

  }

  if (response != null) {
    return response.data;
  } else {
    return {};
  }
}
