

export type TypeApi = 'GET' | 'POST' | 'DELETE' | 'PUT';

export async function Peticiones (
        url:string, 
        type:TypeApi, 
        data:any, 
        reqPre:boolean, 
        reqToken:boolean,
        _pretoken:any,
        _token:any
) {

    // configuracion de la peticion
    let _headers:any = {
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
    //console.log(request)
    // serializa la respuesta de la peticion
    const result = request.json();
    return result;
}
