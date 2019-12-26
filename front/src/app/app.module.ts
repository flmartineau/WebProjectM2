import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule }   from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/home/profile/profile.component';
import { ProjectsComponent } from './components/home/projects/projects.component';
import { ProjectComponent } from './components/home/project/project.component';
import { GithubComponent } from './components/home/github/github.component';
import { AgendaComponent } from './components/home/agenda/agenda.component';
import { SlackComponent } from './components/home/slack/slack.component';
import { DiscordComponent } from './components/home/discord/discord.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    ProjectsComponent,
    ProfileComponent,
    ProjectComponent,
    GithubComponent,
    AgendaComponent,
    SlackComponent,
    DiscordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    NgSelectModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
