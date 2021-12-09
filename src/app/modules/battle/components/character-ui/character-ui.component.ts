import { CharacterType } from './../../../../shared/models/character-type.enum';
import { CharacterDetails } from './../../../../shared/models/character.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-character-ui',
  templateUrl: './character-ui.component.html',
  styleUrls: ['./character-ui.component.sass']
})
export class CharacterUiComponent implements OnInit {
  iconMap = new Map<CharacterType, string>([
    [CharacterType.WARRIOR, './../../../../../assets/images/character-types/sword.svg'],
    [CharacterType.ARCHER, './../../../../../assets/images/character-types/bow.svg'],
    [CharacterType.MAGE, './../../../../../assets/images/character-types/staff.svg']
  ]);

  @Input() character!: CharacterDetails;

  constructor() { }

  ngOnInit(): void {
  }


  getEnergy(): string {
    switch (this.character.type) {
      case 'WARRIOR':
      case 'ARCHER':
        return 'Stamina: ' + this.character.currentStamina.toString();
      case 'MAGE':
        return 'Mana: ' + this.character.currentMana.toString();
    }
    return '';
  }

  healthPercentage(): number {
    return (this.character.currentHealth / this.character.maxHealth) * 100;
  }
}
