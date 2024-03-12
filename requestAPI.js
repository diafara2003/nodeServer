const axios = require('axios');

const URLBase = "http://localhost/sinco/v3/adpro/api";

async function requestAPI(request, token) {



    if (request.AllowAnonymous == null) request.AllowAnonymous = false;
    if (request.isformData == null) request.isformData = false;


    const _http = axios.create({
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',

            Authorization: `Bearer ${token}`
        },
        baseURL: URLBase
    });

    let response = null;

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
                        response = await _http.put(request.metodo, JSON.stringify(request.data));
                }
                break;

        }
    } catch (error) {
        console.log(error);
        response = null;
    }


    if (response != null) {
        return response.data;

    } else {
        return ({});
    }


}

module.exports = requestAPI;