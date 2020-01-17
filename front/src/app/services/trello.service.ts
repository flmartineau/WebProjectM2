import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TrelloService {

  constructor(private httpClient : HttpClient) { }


  /**
   * Get the board info from its id.
   * @param key api key of the trello user
   * @param token token of the trello user
   * @param idBoard id of the trello board
   */
  getBoardFromId(key, token, idBoard) {
    return this.httpClient.get('https://api.trello.com/1/boards/'+ idBoard + '?key='+ key +'&token='+ token);
  }


  /**
   * Get the board lists.
   * @param key api key of the trello user
   * @param token token of the trello user
   * @param idBoard id of the trello board
   */
  getLists(key, token, idBoard) {
    return this.httpClient.get('https://api.trello.com/1/boards/'+ idBoard + '/lists?key=' + key + '&token=' + token);
  }

  /**
   * Get the board cards.
   * @param key api key of the trello user
   * @param token token of the trello user
   * @param idBoard id of the trello board
   */
  getCards(key, token, idBoard) {
    return this.httpClient.get('https://api.trello.com/1/boards/' + idBoard + '/cards?key=' + key + '&token=' + token);
  }


  /**
   * Update the trello board name
   * @param key api key of the trello user
   * @param token token of the trello user
   * @param idBoard id of the trello board
   * @param name updated name of the trello board
   */
  updateName(key, token, idBoard, name) {
    return this.httpClient.put('https://api.trello.com/1/boards/'+ idBoard +'?key='+ key +'&token=' + token + '&name='+name,null);
  }





}
