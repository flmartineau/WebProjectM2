import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  constructor(private httpClient : HttpClient) { }

  /**
   * Fetch the commit list from the project Github repository.
   * @param owner owner of the repository.
   * @param repo name of the repository.
   */
  getAllCommits(owner, repo) {
    return this.httpClient.get('https://api.github.com/repos/'+owner+'/'+repo+'/commits');
  }

}
