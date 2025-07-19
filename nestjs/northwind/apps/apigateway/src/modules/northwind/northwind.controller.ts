import { Controller, Req, Res, All, Get } from '@nestjs/common';
import { NorthwindService } from './northwind.service';
import { Request, Response } from 'express';

@Controller('northwind')
export class NorthwindController {
    constructor(private readonly gateway: NorthwindService) {}

    @Get('/')
    async get(@Req() req: Request, @Res() res: Response) {
        //console.log('Request received:', req.method, req.url);
        res.send('🚀 You have reached northwind service...............');
    }

    @Get(['/swagger', '/swagger/*'])
        async swagger(@Req() req: Request, @Res() res: Response) {
        const baseUrl = "/api/northwind";
        const strippedPath = req.url.toLocaleLowerCase().slice(baseUrl.length);
        const isProd = process.env.NODE_ENV === 'production';

        const targetBaseUrl = isProd
            ? 'http://northwindapi-nestjs-service.riskiq.svc.cluster.local'
            : 'http://localhost:3002';

        console.log(strippedPath);

        const result = await this.gateway.forwardRequest(
            targetBaseUrl,
            req.method as any,
            strippedPath,
            req.headers,
            undefined
        );

        // Attempt to parse and transform JSON paths
        if (typeof result === 'object' && result?.paths) {
            const transformed = {
            ...result,
            paths: {},
            };

            for (const [path, value] of Object.entries(result.paths)) {
            const newPath = path.replace(/^\/api/, baseUrl);
            transformed.paths[newPath] = value;
            }

            return res.json(transformed);
        }

        // Fallback to regular response
        return res.send(result);
    }

    
    
    @All('*')
    async allRequests(@Req() req: Request, @Res() res: Response) {
        const baseUrl = "/api/northwind";
        const strippedPath = req.url.toLocaleLowerCase().slice(baseUrl.length); 
        //console.log('Request received:', req.method, strippedPath);
        const isProd = process.env.NODE_ENV === 'production';
        let targetBaseUrl = isProd
            ? 'http://northwindapi-nestjs-service.riskiq.svc.cluster.local/api'
            : 'http://localhost:3002/api';

        const hasBody = !['GET', 'HEAD'].includes(req.method.toUpperCase());

        const result = await this.gateway.forwardRequest(
            targetBaseUrl,
            req.method as any,
            strippedPath,
            req.headers,
            hasBody ? req.body : undefined
        );

        res.send(result);
    }
}
