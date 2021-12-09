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
  }

  selectCharacter(partyMember: any): void {
    this.selectedCharacter = partyMember;
  }

  requiredExperienceToLvlUp(character: CharacterDetails): number {
    return this.characterService.requiredExperienceToLvlUp(character.level);
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
