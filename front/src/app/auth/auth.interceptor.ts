import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';


@Injectable()
export class AuthInterceptor implements HttpInterceptor  {

    constructor(private authService: AuthService, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if ((req.url.split('/')[2] != 'api.github.com') &&
            (req.url.split('/')[2] != 'discordapp.com')) {
            req = req.clone({
                withCredentials: true
            });
        }
        return  next.handle(req).pipe(tap(
                event => { },
                err => {
                    if (err.error.auth === false) {
                        this.router.navigateByUrl('/login');
                    }
                }
            )
            );
        }
    }
