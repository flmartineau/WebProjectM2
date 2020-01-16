import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DiscordService {

  constructor(private httpClient : HttpClient) { }


  /**
   * Get the server info from its id.
   * @param serverId id of the discord server
   */
  getServerInfoFromId(serverId) {
    return this.httpClient.get('https://discordapp.com/api/guilds/'+ serverId + '/widget.json');
  }

}
