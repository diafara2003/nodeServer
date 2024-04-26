import { NextFunction, Request, Response } from "express";
import { envs } from "../../config/envs";
import { Peticiones } from "../../fetch";
import jwt, { TokenExpiredError } from 'jsonwebtoken';


interface Token {
    access_token: string,
    token_type: string,
    expires_in: number
}
export class Auth {

    private readonly NomUsuario: string;
    private readonly ClaveUsuario: string;
    public tokenMarco: Token | undefined;
    public timeToken: number | null;
    public FechaToken: Date | null;

    private user: string | undefined;

    constructor() {

        this.NomUsuario = 'admin';
        this.ClaveUsuario = 'V7uc4n0545XCurLsiHeuvgFjdDm8zw7qMFLIoigoBpLD3oURj+YF02TRMcBC0F4aFkVq/HkA0vnjhSTOHeLfdjAZj81yboM/hVFymsLI7Ndj7EPVhZ8wOezbNXI6Fh7Sailttg2y096jeWQlozLaZp2IdUq3u+7ML6eFtCU6GyA+I2lo9Cjx89O/AW5SESOnlVX6ZFbnrnJm/1U71pj38uRRbuExb6WtOsuoyvleanQFu6PUOXYVxyoghIpd03XHuQjUcQWMuelWuOni/rDKIFNA9F3GWTL03FrTSFOJ4vJ9RqZew2R9dXqalR6u0Hzeg0q9zAeIC6WtGNZ1gy762/NW8AyCmcwcOXSECQExusEomTjTpJXmOTbZifXGA6sPEoIexXRoaYBlKKmqEeCh6zQ8mLPcxR88dgop60NZpYYLFwWyqE4DwB+fo4s5UeiX08xa9jQ6tNLCjE8Ey8ryb6YMM4ZbDPhN9gb1HNVOEPdkb9UOEW5M4gARWXt2u7SuCwAovPVFLaMHNEm8TTtBxiH/UEAFvJwtB/DnayTO8fo=8';
        this.tokenMarco = undefined;
        this.user = undefined;
        this.timeToken = null;
        this.FechaToken=null;
    }

    generarToken = async () => {
       
        try {
        
            // 1.  se hace la autenticacion del usuario 
            let _pretoken = await Peticiones(`${envs.URL_RAIZ}/API/Auth/Usuario`, 'POST', { NomUsuario: this.NomUsuario, ClaveUsuario: this.ClaveUsuario }, false, false, '', '');
            // 2. se obtienen las empresas disponibles para el usuario por ambiente
            let _empresas = await Peticiones(`${envs.URL_RAIZ}/API/Cliente/Empresas`, 'GET', undefined, true, false, _pretoken, '');        
            // 3. se obtienen las sucursales disponibles por empresa seleccionada
            let _sucursales = await Peticiones(`${envs.URL_RAIZ}/API/Cliente/1/Empresa/1/Sucursales`, 'GET', undefined, true, false, _pretoken, '');      
            // 4. se obtienen el token final para realizar el cual se utiliza para realizar peticiones al api de ADPRO
            let _token = await Peticiones(`${envs.URL_RAIZ}/API/Auth/Sesion/IniciarMovil/1/Empresa/1/Sucursal/30`, 'GET', undefined, true, false, _pretoken, '');

            console.log("token:",_token);
            this.user = _pretoken.data;
            this.tokenMarco = _token;
            this.timeToken=_token.expires_in
            this.FechaToken= new Date();
        }
        catch (error) {
            this.user = undefined;
            this.tokenMarco = undefined;

        }
    }

    hanCambiadoDeDia = (fecha1: Date, fecha2: Date): boolean => {
        const dia1 = fecha1.getDate();
        const mes1 = fecha1.getMonth();
        const año1 = fecha1.getFullYear();

        const dia2 = fecha2.getDate();
        const mes2 = fecha2.getMonth();
        const año2 = fecha2.getFullYear();

        return dia1 !== dia2 || mes1 !== mes2 || año1 !== año2;
    }

    calcularDiferenciaEnHoras = (fechaInicial: Date, fechaFinal: Date) => {
        const diferenciaEnMilisegundos: number = fechaFinal.getTime() - fechaInicial.getTime();
        const diferenciaEnSegundos: number = diferenciaEnMilisegundos / 1000;
        return diferenciaEnSegundos;
    }

    validarToken = async (req: Request, res: Response,next: NextFunction) => {
        try {
          
            if (this.tokenMarco === undefined) {
               
                await this.generarToken();
              
                req.headers.authorization = this.tokenMarco!.access_token;
                next();
            } else {
                 const segundosTokenValido = this.calcularDiferenciaEnHoras(this.FechaToken!, new Date());
                 if(segundosTokenValido>this.timeToken!)
                    await this.generarToken()
                    req.headers.authorization = this.tokenMarco?.access_token;
                next();

            }
        } catch (error) {
            throw new Error(error + '')
        }


    }



}