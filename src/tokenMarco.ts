import { envs } from "./config/envs";

// variable que almacena el pretoken
let _pretoken = { data:[],token_type:'' , access_token:''  };
// variable que almacena las empresas disponibles en el ambiente
let _empresas = [];
// variable que almacena las sucursales disponibles en el ambiente
let _sucursales = [];
// variable que almacena el token para realizar peticiones al API de ADPRO
let _token = { token_type:'' , access_token:'' };


enum APiMethod {
    GET = 'GET',
    POST = "POST",
    DELETE = "DELETE",
    PUT = "PUT",
}


export const generarToken = async () => {
    try {
        let data_auth = { NomUsuario: "provportal", ClaveUsuario: "+m8RuYOMNLGR1yvw0V+dJsTFuQT1BkUkNKXCSBQ6U9fZnRyTpsdg/YjlGFkDQGpIl7IctbC5LMPUexnG/hmkTVmEWC1+9gIR+iD8HqhBKUEgI0oOoJ+cetKxI+38rb57Apr6CfaAhLxFXdR+/fz1A414hEQ5zPCvxDqeLA/8gtHReMdqFxXNxu6j1i3DASDtrVMgMrOz3p0vDP4/Kqa79cOQSOFQrTq5Zjf0UYQRKqjyqz+7Up9Ghk6IIbYLXq8gz4cwrRVB81Iwx/NBNdAZ57ttM4JkkDCIk6b5Dfc0x7Q=6" };

        // 1.  se hace la autenticacion del usuario 
        _pretoken = await Peticiones(`${envs.URL_RAIZ}/API/Auth/Usuario`, APiMethod.POST, data_auth, false, false);
        // 2. se obtienen las empresas disponibles para el usuario por ambiente
        _empresas = await Peticiones(`${envs.URL_RAIZ}/API/Cliente/Empresas`, APiMethod.GET, undefined, true, false);
        // 3. se obtienen las sucursales disponibles por empresa seleccionada
        _sucursales = await Peticiones(`${envs.URL_RAIZ}/API/Cliente/1/Empresa/${_empresas[0].IdEmpresa}/Sucursales`, APiMethod.GET, undefined, true, false);
        // 4. se obtienen el token final para realizar el cual se utiliza para realizar peticiones al api de ADPRO
        _token = await Peticiones(`${envs.URL_RAIZ}/API/Auth/Sesion/IniciarMovil/1/Empresa/${_empresas[0].IdEmpresa}/Sucursal/${_sucursales[0].Id}`, APiMethod.GET, undefined, true, false);

        return { usuario: _pretoken.data, token: _token };
    } catch (error) {
        // Si hay algún error, manejarlo aquí
        throw new Error('Error al hacer la solicitud:' + error);
     
    }
}

interface Header{
    method: APiMethod,
    headers: RowsHeaders,
    body?:string | null
}

type HeaderValue = string | string[] | number | boolean | null;


interface RowsHeaders {
    [key: string]: HeaderValue
}

async function Peticiones(url:string, type:APiMethod, data:any, reqPre:boolean, reqToken:boolean) {

    // configuracion de la peticion
    let _headers:Header = {
        method: type,
        headers: {
            'Content-Type': 'application/json',
           
        }
    };

    // Agrega el parametro de autorizacion para las solicitudes que lo requieren // depende si requiere token o pretoken 
    if (reqPre) _headers.headers.Authorization = reqToken ? _token.token_type + " " + _token.access_token : _pretoken.token_type + " " + _pretoken.access_token;

    // Serializacion de parametros necesarios para el metodo a llamar , se hace siempre y cuando sea diferente de undefined
    if (data != undefined) _headers.body = JSON.stringify(data);

    const request = await fetch(url, _headers as RequestInit);

    // serializa la respuesta de la peticion
    const result = request.json();
    return result;
}