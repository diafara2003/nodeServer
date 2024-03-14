import express, { NextFunction, Router ,Request, Response} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Auth } from './auth/auth';

interface Options {
    port:number;
    routes: Router;
    public_path?:string;
}


export class Server{

    private app = express();
    private readonly  port:number;
    private readonly  publicPath: string;
    private readonly routes: Router;

    constructor( options: Options){
        const{ port,public_path='public',routes } = options;
        this.port= port;
        this.publicPath=public_path;
        this.routes = routes
    }

    async start(){

        //* Middlewares

        //*Public Folder
        //this.app.use(express.static('public'));
        this.app.use(bodyParser.json());
        this.app.use(cors());

        const auth = new Auth();
        const tokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
            const tokenValid = await auth.validarToken();
            console.log(tokenValid);
            if (!tokenValid) {
                await auth.generarToken();
            }
            req.headers.authorization = auth.tokenMarco?.access_token; // Pasar el token a través del objeto de solicitud
            next();
        };

        this.app.use(tokenMiddleware);
        
        // //*Routes
        this.app.use(this.routes);
       
        
        this.app.listen(this.port, () => {
            console.log( `Server running on port ${this.port}` )
        })
    }
}