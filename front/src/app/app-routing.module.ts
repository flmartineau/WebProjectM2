import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/home/profile/profile.component';
import { ProjectsComponent } from './components/home/projects/projects.component';
import { ProjectComponent } from './components/home/project/project.component';
import { GithubComponent } from './components/home/github/github.component';


const routes: Routes = [
  {path: 'register', component: RegisterComponent},
  {path : 'login', component: LoginComponent},
  {path : '', component: LoginComponent},
  {path : 'home', component: HomeComponent,
  children: [
    { path: '', redirectTo: 'projects', pathMatch: 'full' },
    { path: 'projects', component: ProjectsComponent },
    { path: 'projects/:id', component: ProjectComponent },
    { path: 'projects/:id/github', component: GithubComponent},
    { path: 'profile', component: ProfileComponent}]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
