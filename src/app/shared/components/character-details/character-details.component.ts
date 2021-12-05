import { UserSharingService } from './../../services/user-sharing.service';
import { UserDetails } from './../../models/user.model';
import { CharacterSharingService } from './../../services/character-sharing.service';
import { CharacterService } from './../../services/character.service';
import { CharacterDetails } from './../../models/character.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.sass']
})
export class CharacterDetailsComponent implements OnInit {
  @Input() character!: CharacterDetails;
  @Input() experienceToLvlUp!: number;
  @Input() isAlive!: boolean;
  @Output() setSideNavTypeToAdd = new EventEmitter();
  user!: UserDetails;


  constructor(
    private characterService: CharacterService,
    private characterSharingService: CharacterSharingService,
    private userSharing: UserSharingService
  ) { }

  ngOnInit(): void {
    this.userSharing.getUserDetails()
    this.userSharing.sharedUser.subscribe(user => this.user = user);
  }



  removeCharacter() {
    this.characterService.deleteCharacter(this.character.id).subscribe({
      next: () => {
        this.characterSharingService.getCharacters();
        this.setSideNavTypeToAdd.emit();
      },
      error: (err) => console.log(err)
    });
  }

}
