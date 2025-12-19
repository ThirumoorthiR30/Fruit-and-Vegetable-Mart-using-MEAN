import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';  // Import the client AppModule
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,// Import the client AppModule
    ServerModule,  // Import the server-side rendering module
  ],
  bootstrap: [AppComponent],  // Bootstraps the app on the server
})
export class AppServerModule {}
