import { CharacterUiComponent } from './../character-ui/character-ui.component';
import { CharacterService } from './../../../../shared/services/character.service';
import { CharacterSharingService } from './../../../../shared/services/character-sharing.service';
import { UserSharingService } from './../../../../shared/services/user-sharing.service';
import { BattleService } from './../../services/battle.service';
import { BattleSimulatorService } from './../../services/battle-simulator.service';
import { CharacterType } from './../../../../shared/models/character-type.enum';
import { CharacterDetails } from './../../../../shared/models/character.model';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

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
  energyMap = new Map<CharacterType, string>([
    [CharacterType.WARRIOR, 'stamina'],
    [CharacterType.ARCHER, 'stamina'],
    [CharacterType.MAGE, 'mana']
  ]);

  @Input() userTeam!: CharacterDetails[];
  @Input() opponentTeam!: CharacterDetails[];
  @Output() finishBattle = new EventEmitter<any>();

  @ViewChild('fighterComponent') fighterComponent!: CharacterUiComponent;
  @ViewChild('opponentComponent') opponentComponent!: CharacterUiComponent;

  firstRound: boolean = true;
  inCharacterSelection: boolean = true;

  selectedFighter!: CharacterDetails;
  fighter!: CharacterDetails;
  fighterSpecialCost: number = 0;
  fighterEnergyChanges: number = 0;
  fighterDamageReceived: number = 0;
  fighterAction: string = '';

  opponent!: CharacterDetails;
  opponentNumber: number = 0;
  opponentSpecialCost: number = 0;
  opponentEnergyChanges: number = 0;
  opponentDamageReceived: number = 0;
  opponentAction: string = '';

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
      this.battleSimulator.initializeCombat(this.fighter, this.opponent);
    } else if (this.inCharacterSelection) {
      this.fighter = this.selectedFighter;
      this.inCharacterSelection = false;
      this.battleSimulator.initializeCombat(this.fighter, this.opponent);
    } else {
      this.fighter = this.selectedFighter;
      this.battleSimulator.performSwitch(this.fighter, this.opponent);
      this.opponentComponent.showEnergy();
      this.fighterComponent.showDamage();
      this.updateBattleStats();

    }
  }

  performAttack() {
    this.battleSimulator.performAttack(this.fighter, this.opponent);
    this.fighterComponent.showEnergy();
    this.opponentComponent.showEnergy();
    this.fighterComponent.showDamage();
    this.opponentComponent.showDamage();
    this.updateBattleStats();
  }

  performSpecial() {
    this.battleSimulator.performSpecial(this.fighter, this.opponent);
    this.fighterComponent.showEnergy();
    this.opponentComponent.showEnergy();
    this.fighterComponent.showDamage();
    this.opponentComponent.showDamage();
    this.updateBattleStats();
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


  getPlayerSpecialCost(): number {
    return this.battleSimulator.getPlayerSpecialCost();
  }
  getOpponentSpecialCost(): number {
    return this.battleSimulator.getOpponentSpecialCost();
  }
  getPlayerEnergyChanges(): number {
    return this.battleSimulator.getPlayerEnergyChange();
  }
  getOpponentEnergyChanges(): number {
    return this.battleSimulator.getOpponentEnergyChange();
  }
  getPlayerDamageReceived(): number {
    return this.battleSimulator.getOpponentDamage();
  }
  getOpponentDamageReceived(): number {
    return this.battleSimulator.getPlayerDamage();
  }
  getPlayerAction(): string | undefined {
    return this.battleSimulator.getPlayerAction();
  }
  getOpponentAction(): string | undefined {
    return this.battleSimulator.getOpponentAction();
  }
  getPlayerPassive(): string | undefined {
    return this.battleSimulator.getPlayerPassive();
  }
  getOpponentPassive(): string | undefined {
    return this.battleSimulator.getOpponentPassive();
  }






}
