import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
    PORT: env.get('PORT').required().asPortNumber(),
    PUBLIC_PATH: env.get('PUBLIC_PATH').default('public').asString(),
    URL__BASE_API:env.get('URL__BASE_API').asString(),
    URL_RAIZ:env.get('URL_RAIZ').asString(),

}