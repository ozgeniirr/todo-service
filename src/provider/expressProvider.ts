
import { Application } from 'express'
import { startRouterConfig } from '@/config/router.config';

export class ExpressProvider {
  private constructor(private readonly app: Application) {}

  static fromExpress(app: Application): ExpressProvider {
    return new ExpressProvider(app);
  }

  public async mountRoutes(): Promise<void> {
    const routes = startRouterConfig;
    routes.forEach((config) => {
    console.log('Mounting route:', `${process.env.API_PREFIX}/${config.label}`);
      this.app.use(`${process.env.API_PREFIX!}/${config.label}`, config.router);
    });
  }
}
