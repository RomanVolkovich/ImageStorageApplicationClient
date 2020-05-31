import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './imageStorageApplication/app.module';
const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
