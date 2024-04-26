import { Request, Response } from "express";
import { requestAPI } from "../../requestAPI";


export class Controller {
    
    constructor() {}

    public getAll =  async (req:Request, res:Response) => {

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
        
        const response = await requestAPI({ 
            type: requestedMethod, 
            metodo: requestedPath, 
            data: requestBody ,
            isformData:Boolean(isFormData),
            responseType: attachmentRegex.test(disposition) ?'arraybuffer' : 'json'
        }, token)
      
        if( attachmentRegex.test(disposition) ){
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=archivo.xlsx');
            res.send(response.data);

        }
        else{
            res.send(response.data);

        }

        
    
    
    }
}