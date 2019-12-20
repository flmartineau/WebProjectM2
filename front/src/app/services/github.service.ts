import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  constructor(private httpClient : HttpClient) { }

  getAllCommits(owner, repo) {
    return this.httpClient.get('https://api.github.com/repos/'+owner+'/'+repo+'/commits');
  }

}
