import { CharacterDetails } from './../../../shared/models/character.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BattleService {
  readonly baseUrl: string = "http://localhost:8000/api/v1/battle";


  constructor(
    private http: HttpClient
  ) { }


  getOpponent(): Observable<CharacterDetails[]> {
    return this.http.get<CharacterDetails[]>(this.baseUrl + '/opponents');
  }





}
