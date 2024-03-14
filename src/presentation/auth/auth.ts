import { NextFunction, Request, Response } from "express";
import { envs } from "../../config/envs";
import { Peticiones } from "../../fetch";

interface Token {
    access_token: string,
    token_type: string,
    expires_in: number
}
export class Auth {

    private readonly NomUsuario: string;
    private readonly ClaveUsuario: string;
    public tokenMarco: Token | undefined;
    public timeToken: Date | null;
    private user: string | undefined;

    constructor() {

        this.NomUsuario = 'provportal';
        this.ClaveUsuario = '+m8RuYOMNLGR1yvw0V+dJsTFuQT1BkUkNKXCSBQ6U9fZnRyTpsdg/YjlGFkDQGpIl7IctbC5LMPUexnG/hmkTVmEWC1+9gIR+iD8HqhBKUEgI0oOoJ+cetKxI+38rb57Apr6CfaAhLxFXdR+/fz1A414hEQ5zPCvxDqeLA/8gtHReMdqFxXNxu6j1i3DASDtrVMgMrOz3p0vDP4/Kqa79cOQSOFQrTq5Zjf0UYQRKqjyqz+7Up9Ghk6IIbYLXq8gz4cwrRVB81Iwx/NBNdAZ57ttM4JkkDCIk6b5Dfc0x7Q=6';
        this.tokenMarco = undefined;
        this.user = undefined;
        this.timeToken = null
    }

    generarToken = async () => {

        try {
            // 1.  se hace la autenticacion del usuario 
            let _pretoken = await Peticiones(`${envs.URL_RAIZ}/API/Auth/Usuario`, 'POST', { NomUsuario: this.NomUsuario, ClaveUsuario: this.ClaveUsuario }, false, false, '', '');
            // 2. se obtienen las empresas disponibles para el usuario por ambiente
            let _empresas = await Peticiones(`${envs.URL_RAIZ}/API/Cliente/Empresas`, 'GET', undefined, true, false, _pretoken, '');
            // 3. se obtienen las sucursales disponibles por empresa seleccionada
            let _sucursales = await Peticiones(`${envs.URL_RAIZ}/API/Cliente/1/Empresa/${_empresas[0].IdEmpresa}/Sucursales`, 'GET', undefined, true, false, _pretoken, '');
            // 4. se obtienen el token final para realizar el cual se utiliza para realizar peticiones al api de ADPRO
            let _token = await Peticiones(`${envs.URL_RAIZ}/API/Auth/Sesion/IniciarMovil/1/Empresa/${_empresas[0].IdEmpresa}/Sucursal/${_sucursales[0].Id}`, 'GET', undefined, true, false, _pretoken, '');

            this.user = _pretoken.data;
            this.tokenMarco = _token;
            this.timeToken = new Date();
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
        const diferenciaEnHoras: number = diferenciaEnMilisegundos / 3600000; // Convertir a horas
        return diferenciaEnHoras;
    }

    validarToken = async (req: Request, res: Response,next: NextFunction) => {

        try {
            if (this.tokenMarco === undefined) {
                await this.generarToken()
                req.headers.authorization = this.tokenMarco!.access_token;
                next();
            } else {
                const horasToken = this.calcularDiferenciaEnHoras(this.timeToken!, new Date());
                const tokenValido = horasToken < 24 && !this.hanCambiadoDeDia(this.timeToken!, new Date());
                if (!tokenValido) await this.generarToken();
                req.headers.authorization = this.tokenMarco?.access_token;
                next();

            }
        } catch (error) {
            throw new Error(error + '')
        }


    }



}