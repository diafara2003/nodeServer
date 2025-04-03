import { Request, Response } from "express";
import { requestAPI } from "../../requestAPI";


export class Controller {

    constructor() { }

    public getAll = async (req: Request, res: Response) => {
        const requestedPath = req.originalUrl;
        const requestedMethod = req.method;
        const requestBody = req.body;
        const token = req.headers.authorization ? req.headers.authorization : '';

        // Detectar si es una descarga
        const isDownload = req.headers['content-disposition']?.includes('attachment') ||
            requestedPath.includes('download') ||
            requestedPath.includes('export');

        if (requestedPath == '/token') {
            res.send(token);
            return;
        }

        const requestOptions = {
            type: requestedMethod,
            metodo: requestedPath,
            data: requestBody,
            isDownload: isDownload,
            isformData: req.headers['x-isformdata'] === 'true'
        };

         console.log( 'requestAPI:', isDownload, requestOptions);

        try {
            const response = await requestAPI(requestOptions, token);

            // Manejo de errores
            if (response.error) {
                return res.status(response.status || 500).send(response.data || response.message);
            }

            // console.log(isDownload)
            // console.log(response.data)

            // Manejo especial para descargas
            if (isDownload && response.success) {
                res.set({
                    'Content-Type': response.headers['content-type'],
                    'Content-Disposition': response.headers['content-disposition'],
                    'Content-Length': response.data.length
                });
                return res.send(response.data);
            }

            // Respuesta normal para JSON
            return res.json(response);
        } catch (error: any) {
            console.error('Error en controller:', error);

            if (error.response) {
                return res.status(error.response.status || 500)
                    .send(error.response.data || 'Error al procesar la solicitud');
            }

            return res.status(500).send('Error interno del servidor');
        }
    }
}