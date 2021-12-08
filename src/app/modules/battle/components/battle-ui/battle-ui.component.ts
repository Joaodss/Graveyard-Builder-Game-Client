import { CharacterDetails } from './../../../../shared/models/character.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-battle-ui',
  templateUrl: './battle-ui.component.html',
  styleUrls: ['./battle-ui.component.sass']
})
export class BattleUiComponent implements OnInit {
  @Input() userTeam!: CharacterDetails[];
  @Input() opponentTeam!: CharacterDetails[];

  inCharacterSelection:boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
