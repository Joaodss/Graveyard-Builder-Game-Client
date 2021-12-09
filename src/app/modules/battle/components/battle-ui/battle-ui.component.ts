import { CharacterService } from './../../../../shared/services/character.service';
import { CharacterSharingService } from './../../../../shared/services/character-sharing.service';
import { UserSharingService } from './../../../../shared/services/user-sharing.service';
import { BattleService } from './../../services/battle.service';
import { BattleSimulatorService } from './../../services/battle-simulator.service';
import { CharacterType } from './../../../../shared/models/character-type.enum';
import { CharacterDetails } from './../../../../shared/models/character.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-battle-ui',
  templateUrl: './battle-ui.component.html',
  styleUrls: ['./battle-ui.component.sass']
})
export class BattleUiComponent implements OnInit {
  attackMap = new Map<CharacterType, string>([
    [CharacterType.WARRIOR, 'Tackle'],
    [CharacterType.ARCHER, 'Shoot'],
    [CharacterType.MAGE, 'Staff Attack']
  ]);
  specialMap = new Map<CharacterType, string>([
    [CharacterType.WARRIOR, 'Sword Attack'],
    [CharacterType.ARCHER, 'Aim'],
    [CharacterType.MAGE, 'Fireball']
  ]);

  @Input() userTeam!: CharacterDetails[];
  @Input() opponentTeam!: CharacterDetails[];
  @Output() finishBattle = new EventEmitter<any>();

  firstRound: boolean = true;
  inCharacterSelection: boolean = true;

  selectedFighter!: CharacterDetails;
  fighter!: CharacterDetails;
  opponent!: CharacterDetails;
  opponentNumber: number = 0;

  isBattleWon: boolean = false;
  isBattleLost: boolean = false;
  goldGain = 0
  expGain = 0;

  constructor(
    private battleService: BattleService,
    private battleSimulator: BattleSimulatorService,
    private userSharing: UserSharingService,
    private characterSharingService: CharacterSharingService,
    private characterService: CharacterService
  ) { }

  ngOnInit(): void {
  }



  selectFighter(fighter: CharacterDetails) {
    if (!fighter.isAlive) return;
    this.selectedFighter = fighter;
  }

  cancelSwitch() {
    this.selectedFighter = this.fighter;
  }

  confirmSwitchFighter() {
    if (this.firstRound) {
      this.opponent = this.opponentTeam[this.opponentNumber];
      this.firstRound = false;
      this.fighter = this.selectedFighter;
      this.inCharacterSelection = false;
    } else if (this.inCharacterSelection) {
      this.fighter = this.selectedFighter;
      this.inCharacterSelection = false;
    } else {
      this.fighter = this.selectedFighter;
      this.battleSimulator.performSwitch(this.fighter, this.opponent);
      this.updateBattleStats()
    }
  }

  performAttack() {
    this.battleSimulator.performAttack(this.fighter, this.opponent);
    this.updateBattleStats()
  }

  performSpecial() {
    this.battleSimulator.performSpecial(this.fighter, this.opponent);
    this.updateBattleStats()
  }


  updateBattleStats() {
    this.fighter = this.battleSimulator.getPlayerStats();
    this.opponent = this.battleSimulator.getOpponentStats();

    this.battleService.updateCharacterHealth(this.fighter.id, this.fighter.currentHealth).subscribe();

    if (this.opponent.currentHealth <= 0) {
      console.log('opponent is dead');
      let maxExperienceToAdd = this.characterService.requiredExperienceToLvlUp(this.fighter.level) - this.fighter.experience;
      let experienceToAdd = Math.min(this.opponent.level, maxExperienceToAdd);
      this.battleService.addCharacterExperience(this.fighter.id, experienceToAdd).subscribe();
      this.inCharacterSelection = true;
      this.goldGain += this.opponent.level;
      this.expGain += this.opponent.level;

      this.opponentTeam = this.opponentTeam.filter(opponent => opponent.id !== this.opponent.id);
      if (this.opponentTeam.length > 0) {
        this.opponent = this.opponentTeam[0];
      } else {
        this.isBattleWon = true;
      }
    }
    if (this.fighter.currentHealth <= 0) {
      console.log('fighter is dead');
      this.fighter.isAlive = false;
      this.inCharacterSelection = true;
      if (this.userTeam.filter(char => char.isAlive).length === 0) {
        this.isBattleLost = true;
      }
    }
    this.checkEndOfBattle()
  }

  checkEndOfBattle(): void {
    if (this.isBattleWon && this.isBattleLost) {
      this.goldGain += 10;
      this.goldGain /= 2;
      this.battleService.addUserGoldAndExperience(this.goldGain, this.expGain).subscribe(
        () => {
          this.userSharing.getUserDetails();
          this.finishBattle.emit({ 'isWon': 0, 'goldEarned': this.goldGain, 'experienceEarned': this.expGain })
        }
      );
    } else if (this.isBattleWon && !this.isBattleLost) {
      this.goldGain += 10;
      this.battleService.addUserGoldAndExperience(this.goldGain, this.expGain).subscribe(
        () => {
          this.userSharing.getUserDetails();
          this.finishBattle.emit({ 'isWon': 1, 'goldEarned': this.goldGain, 'experienceEarned': this.expGain })
        }
      );
    } else if (!this.isBattleWon && this.isBattleLost) {
      this.expGain /= 2;
      this.battleService.addUserGoldAndExperience(0, this.expGain).subscribe(
        () => {
          this.userSharing.getUserDetails();
          this.finishBattle.emit({ 'isWon': -1, 'goldEarned': 0, 'experienceEarned': this.expGain })
        }
      );
    }
    return;
  }

}
