import { CharacterSharingService } from './../../../../shared/services/character-sharing.service';
import { CharacterService } from './../../../../shared/services/character.service';
import { CharacterDetails } from './../../../../shared/models/character.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-party-list',
  templateUrl: './party-list.component.html',
  styleUrls: ['./party-list.component.sass']
})
export class PartyListComponent implements OnInit {
  party!: CharacterDetails[];
  partySize!: number;
  selectedCharacter!: CharacterDetails;
  selectedInfoType!: string;

  constructor(
    private characterService: CharacterService,
    private characterSharing: CharacterSharingService
  ) { }


  ngOnInit(): void {
    this.characterSharing.getCharacters();
    this.getPartyDetails();
  }


  defineInfoType(infoType: string): void {
    this.selectedInfoType = infoType;
    console.log(this.selectedInfoType);
  }

  selectCharacter(partyMember: any): void {
    this.selectedCharacter = partyMember;
    console.log(this.selectedCharacter);
  }

  requiredExperienceToLvlUp(character: CharacterDetails): number {
    let levelToNextLevel = 0;
    for (let index = 0; index <= character.level; index++) {
      levelToNextLevel = levelToNextLevel + index + 2;
    }
    return levelToNextLevel;
  }


  private getPartyDetails(): void {
    this.characterSharing.sharedParty.subscribe(
      (party: CharacterDetails[]) => {
        this.party = party
        this.partySize = party.length;
      }
    );
  }

}
