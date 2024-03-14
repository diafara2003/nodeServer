import { Request, Response } from "express";
import { requestAPI } from "../../requestAPI";


export class Controller {
    
    constructor() {}

    public getAll =  async (req:Request, res:Response) => {

        const requestedPath = req.originalUrl;
        const requestedMethod = req.method;
        const requestBody = req.body;   
        const token = req.headers.authorization ? req.headers.authorization :'';
    
        // if (tokenMarco == null) {
        //     const tokenERP = await generarToken();
    
        //     tokenMarco = tokenERP.token.access_token;
        // }
    
    
        if(requestedPath=='/token'){
            res.send(token);
    
            return;
        }
        
        const response = await requestAPI({ type: requestedMethod, metodo: requestedPath, data: requestBody }, token)
    
        console.log(token);
    
        res.send(response);
    
    
    }
}