import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  constructor(private httpClient : HttpClient) { }

  /**
   * Fetch the commit list from the project Github repository.
   * @param owner owner of the repository.
   * @param repo name of the repository.
   * @param gitUser username of the github account
   * @param gitToken token of the github account
   */
  getAllCommits(owner, repo, gitUser, gitToken) {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Basic " + btoa(gitUser+":"+gitToken));
    return this.httpClient.get('https://api.github.com/repos/'+owner+'/'+repo+'/commits', { headers });
  }


  /**
   * Fetch a commit details.
   * @param owner owner of the repository.
   * @param repo name of the repository.
   * @param sha id of the commit.
   * @param gitUser username of the github account
   * @param gitToken token of the github account
   */
  getCommitDetails(owner, repo, sha, gitUser, gitToken) {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Basic " + btoa(gitUser+":"+gitToken));
    return this.httpClient.get('https://api.github.com/repos/'+owner+'/'+repo+'/commits/'+sha, { headers });
  }

}
