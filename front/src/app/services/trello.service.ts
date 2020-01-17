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


  /**
   * Add a card to a list
   * @param key api key of the trello user
   * @param token token of the trello user
   * @param idBoard id of the trello board
   * @param idList id of the list
   * @param name name of the card
   * @param description description of the card
   */
  addCardToList(key, token, idList, name, description) {
    return this.httpClient.post('https://api.trello.com/1/cards?idList='+ idList +'&keepFromSource=all&key='+ key +'&token=' + token + '&name='+ name + '&desc='+ description,null);
  }

  /**
   * Delete a card
   * @param key api key of the trello user
   * @param token token of the trello user
   * @param idCard id of the card to delete
   */
  deleteCard(key, token, idCard) {
    return this.httpClient.delete('https://api.trello.com/1/cards/' + idCard + '?key='+ key +'&token=' + token);
  }

  /**
   * Delete a list
   * @param key api key of the trello user
   * @param token token of the trello user
   * @param idList id of the list to delete
   */
  deleteList(key, token, idList) {
    return this.httpClient.put('https://api.trello.com/1/lists/'+ idList + '/closed?key='+ key +'&token=' + token + '&value=true',null);
  }


  /**
   * Add a list
   * @param key api key of the trello user
   * @param token token of the trello user
   * @param idBoard id of the trello board
   * @param name name of the list
   */
  addList(key, token, idBoard, name){
    return this.httpClient.post('https://api.trello.com/1/lists?name=' + name + '&idBoard=' + idBoard + '&key='+ key +'&token=' + token+ '&pos=bottom', null);
  }

  /**
   * Update the name of a list
   * @param key api key of the trello user
   * @param token token of the trello user
   * @param idList id of the list to update
   * @param name updated name of the list
   */
  updateListName(key, token, idList, name){
    return this.httpClient.put('https://api.trello.com/1/lists/'+ idList + '?key='+ key +'&token=' + token + '&name=' + name,null);
  }

  /**
   * Update a card
   * @param key api key of the trello user
   * @param token token of the trello user
   * @param idCard id of the card to update
   * @param name updated name of the card
   * @param description updated description of the card
   */
  updateCard(key, token, idCard, name, description){
    return this.httpClient.put('https://api.trello.com/1/cards/'+ idCard + '?key='+ key +'&token=' + token + '&name=' + name + '&desc=' + description,null);

  }



}
