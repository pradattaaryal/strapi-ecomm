import type { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';

interface AuthConfig {
    required?: boolean; // default true
}

export default (config: AuthConfig = {}) => {
    const required = config.required ?? true;
    strapi.log.info("the auth middle ware is running");
    return async (ctx: Context, next: Next) => {
        try {
            const authHeader = ctx.get('authorization');

            // No token provided
            if (!authHeader) {
                if (required) {
                    ctx.status = 401;
                    ctx.body = { error: 'Unauthorized', message: 'Missing token' };
                    return;
                }
                return await next();
            }

            const token = authHeader.replace('Bearer ', '').trim();

            // Verify JWT (use same secret Strapi uses)
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            ctx.state.user = decoded; // make user info accessible in controllers
            console.log(ctx.state.user);
            await next();
        } catch (err: any) {
            ctx.status = 401;
            ctx.body = { error: 'Unauthorized', message: 'Invalid or expired token' };
        }
    };
};
