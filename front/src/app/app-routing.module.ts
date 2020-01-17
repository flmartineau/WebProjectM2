import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/home/profile/profile.component';
import { ProjectsComponent } from './components/home/projects/projects.component';
import { ProjectComponent } from './components/home/project/project.component';
import { GithubComponent } from './components/home/github/github.component';
import { AgendaComponent } from './components/home/agenda/agenda.component';
import { DiscordComponent } from './components/home/discord/discord.component';
import { AuthGuard } from './auth/auth.guard';
import { ContactsComponent } from './components/home/contacts/contacts.component';
import { NotesComponent } from './components/notes/notes.component';
import { TrelloComponent } from './components/home/trello/trello.component';


const routes: Routes = [
  {path: 'register', component: RegisterComponent},
  {path : 'login', component: LoginComponent},
  {path : '', component: LoginComponent, canActivate: [AuthGuard]},
  {path : 'home', component: HomeComponent, canActivate: [AuthGuard],
  children: [
    { path: '', redirectTo: 'projects', pathMatch: 'full' },
    { path: 'projects', component: ProjectsComponent },
    { path: 'projects/:id', component: ProjectComponent },
    { path: 'projects/:id/github', component: GithubComponent},
    { path: 'projects/:id/agenda', component: AgendaComponent},
    { path: 'projects/:id/agenda/:eventId', component: AgendaComponent},
    { path: 'projects/:id/discord', component: DiscordComponent},
    { path: 'projects/:id/trello', component: TrelloComponent},
    { path: 'projects/:id/contacts', component: ContactsComponent},
    { path: 'projects/:id/notes', component: NotesComponent},
    { path: 'profile', component: ProfileComponent}]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
