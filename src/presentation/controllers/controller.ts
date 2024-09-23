import { Request, Response } from "express";
import { requestAPI } from "../../requestAPI";


export class Controller {
    
    constructor() {}

    public getAll =  async (req:Request, res:Response) => {

      //  console.log(req);

        const requestedPath = req.originalUrl;
        const requestedMethod = req.method;
        const requestBody = req.body;   
        const token = req.headers.authorization ? req.headers.authorization :'';
        const disposition = req.headers["content-disposition"] || '';
        const attachmentRegex = /attachment/i;
        const isFormData = req.headers["x-isformdata"] || 'false'; 
        
      
        if(requestedPath=='/token'){
            res.send(token);
           
            return;
        }
        // console.log(req.originalUrl);
        
        const response = await requestAPI({ type: requestedMethod, metodo: requestedPath, data: requestBody }, token)
    
     
    
        res.send(response);
    
    
    }
}