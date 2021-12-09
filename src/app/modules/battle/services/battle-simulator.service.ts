import { CharacterType } from './../../../shared/models/character-type.enum';
import { CharacterDetails } from './../../../shared/models/character.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BattleSimulatorService {
  private actionsBaseCosts = new Map<CharacterType, number>([
    [CharacterType.WARRIOR, 5],
    [CharacterType.ARCHER, 10],
    [CharacterType.MAGE, 10]
  ]);
  private baseEnergyRestore = new Map<string, number>([
    ['Tackle', 5],
    ['Shoot', 5],
    ['Staff Attack', 5],
    ['Mage Passive', 10]
  ]);
  private attackMap = new Map<CharacterType, string>([
    [CharacterType.WARRIOR, 'Tackle'],
    [CharacterType.ARCHER, 'Shoot'],
    [CharacterType.MAGE, 'Staff Attack']
  ]);
  private specialMap = new Map<CharacterType, string>([
    [CharacterType.WARRIOR, 'Sword Attack'],
    [CharacterType.ARCHER, 'Aim'],
    [CharacterType.MAGE, 'Fireball']
  ]);
  private passiveMap = new Map<CharacterType, string>([
    [CharacterType.WARRIOR, 'Block'],
    [CharacterType.ARCHER, 'Critical Hit'],
    [CharacterType.MAGE, 'Restore Mana']
  ]);

  private fighter!: CharacterDetails;
  private playerAction!: string | undefined;
  private playerPassiveActive: boolean = false;
  private playerPassive!: string | undefined;
  private playerDamage: number = 0;

  private opponent!: CharacterDetails;
  private opponentAction!: string | undefined;
  private opponentPassiveActive: boolean = false;
  private opponentPassive!: string | undefined;
  private opponentDamage: number = 0;

  constructor() { }

  getPlayerDamage(): number {
    return this.playerDamage;
  }
  getOpponentDamage(): number {
    return this.opponentDamage;
  }
  getPlayerAction(): string | undefined {
    return this.playerAction;
  }
  getOpponentAction(): string | undefined {
    return this.opponentAction
  }
  getPlayerPassive(): string | undefined {
    if (this.playerPassiveActive)
      return this.playerPassive;
    return undefined;
  }
  getOpponentPassive(): string | undefined {
    if (this.opponentPassiveActive)
      return this.opponentPassive;
    return undefined;
  }
  getPlayerStats(): CharacterDetails {
    return this.fighter;
  }
  getOpponentStats(): CharacterDetails {
    return this.opponent;
  }


  performAttack(fighter: CharacterDetails, opponent: CharacterDetails) {
    console.log('perform attack');

    this.initializeCombat(fighter, opponent);
    this.playerAction = this.attackMap.get(this.fighter.type);
    this.battle();
  }
  performSpecial(fighter: CharacterDetails, opponent: CharacterDetails) {
    console.log('perform special');

    if (!this.isSufficientEnergy(fighter)) return;
    this.initializeCombat(fighter, opponent);
    this.playerAction = this.specialMap.get(this.fighter.type);
    this.battle();
  }
  performSwitch(fighter: CharacterDetails, opponent: CharacterDetails) {
    console.log('perform switch');

    this.initializeCombat(fighter, opponent);
    this.playerAction = 'Switch';
    this.battle();
  }


  private initializeCombat(fighter: CharacterDetails, opponent: CharacterDetails) {
    this.fighter = fighter;
    this.opponent = opponent;
    this.opponentAction = this.makeOpponentAction(this.opponent);
    console.log('opponent action: ' + this.opponentAction);

  }
  private makeOpponentAction(opponent: CharacterDetails): string | undefined {
    if (!this.isSufficientEnergy(opponent))
      return this.attackMap.get(opponent.type);

    return this.specialMap.get(opponent.type);
  }


  private battle() {
    console.log('battle');
    console.log('player action: ' + this.playerAction);
    console.log('opponent action: ' + this.opponentAction);

    if (this.playerAction !== 'Switch')
      this.executeActions('player');
    if (this.opponentAction !== 'Switch')
      this.executeActions('opponent');
    console.log('player damage before passive: ' + this.playerDamage);
    console.log('opponent damage before passive: ' + this.opponentDamage);

    this.initializePassives();
    if (this.playerPassiveActive && this.playerAction !== 'Switch')
      this.applyPassive('player');

    if (this.opponentPassiveActive && this.opponentAction !== 'Switch')
      this.applyPassive('opponent');

    console.log('player damage after passive: ' + this.playerDamage);
    console.log('opponent damage after passive: ' + this.opponentDamage);
    this.calculateDamage();


  }

  private executeActions(target: string) {
    let damage: number = 0;
    switch (target === 'player' ? this.playerAction : this.opponentAction) {
      case 'Tackle':
        this.restoreEnergy(target, 'Tackle');
        damage = this.tackle(target);
        break;
      case 'Shoot':
        this.restoreEnergy(target, 'Shoot');
        damage = this.shoot(target);
        break;
      case 'Staff Attack':
        this.restoreEnergy(target, 'Staff Attack');
        damage = this.staffAttack(target);
        break;
      case 'Sword Attack':
        this.removeEnergy(target, 'Sword Attack');
        damage = this.swordAttack(target);
        break;
      case 'Aim':
        this.removeEnergy(target, 'Aim');
        damage = this.aim(target);
        break;
      case 'Fireball':
        this.removeEnergy(target, 'Fireball');
        damage = this.fireball(target);
        break;
      default:
        damage = 0;
        break;
    }
    if (target === 'player') {
      this.playerDamage = damage;
    } else  {
      this.opponentDamage = damage;
    }
  }
  private tackle(target: String): number {
    const character = target === 'player' ? this.fighter : this.opponent;
    const damage = Math.round(character.strength / 2)
    const variableDamage = Math.round(Math.random() * (character.strength / 5) - (character.strength / 10));
    return damage + variableDamage;
  }
  private shoot(target: String): number {
    const character = target === 'player' ? this.fighter : this.opponent;
    const damage = Math.round(character.accuracy)
    const variableDamage = Math.round(Math.random() * (character.strength / 5) - (character.strength / 10));
    return damage + variableDamage;
  }
  private staffAttack(target: String): number {
    const character = target === 'player' ? this.fighter : this.opponent;
    const damage = 3;
    const variableDamage = Math.round(Math.random() * 2 - 1);
    return damage + variableDamage;
  }
  private swordAttack(target: String): number {
    const character = target === 'player' ? this.fighter : this.opponent;
    const damage = Math.round(character.strength)
    const variableDamage = Math.round(Math.random() * (character.strength / 5) - (character.strength / 10));
    return damage + variableDamage;
  }
  private aim(target: String): number {
    let character = target === 'player' ? this.fighter : this.opponent;
    character.passiveChance += 0.25;
    if (target === 'player') {
      this.fighter = character;
    } else {
      this.opponent = character;
    }
    return 0;
  }
  private fireball(target: String): number {
    const character = target === 'player' ? this.fighter : this.opponent;
    const damage = Math.round(character.intelligence * 2)
    const variableDamage = Math.round(Math.random() * (character.intelligence / 2) - (character.intelligence / 4));
    return damage + variableDamage;
  }


  private initializePassives(): void {
    this.playerPassiveActive = this.isPassiveActive(this.fighter);
    this.opponentPassiveActive = this.isPassiveActive(this.opponent);
    this.playerPassive = this.passiveMap.get(this.fighter.type);
    this.opponentPassive = this.passiveMap.get(this.opponent.type);
  }
  private isPassiveActive(character: CharacterDetails): boolean {
    const randomValue = Math.random();
    const chance = character.passiveChance;
    return randomValue < chance;
  }
  private applyPassive(target: string) {
    let character = target === 'player' ? this.fighter : this.opponent;
    let action = target === 'player' ? this.playerAction : this.opponentAction;
    let receivedDamage = target === 'player' ? this.opponentDamage : this.playerDamage;
    let sentDamage = target === 'player' ? this.playerDamage : this.opponentDamage;

    switch (target === 'player' ? this.playerPassive : this.opponentPassive) {
      case 'Block':
        receivedDamage = 0;
        break;
      case 'Critical Hit':
        if (action === 'Shoot') {
          sentDamage *= 3;
          character.passiveChance = 0.25;
        }
        break;
      case 'Restore Mana':
        this.restoreEnergy(target, 'Mage Passive');
        break;
      default:
        break;
    }
    if (target === 'player') {
      this.opponentDamage = receivedDamage;
      this.playerDamage = sentDamage;
      this.fighter = character;
    } else {
      this.playerDamage = receivedDamage;
      this.opponentDamage = sentDamage;
      this.opponent = character;
    }
  }

  private calculateDamage() {
    this.opponent.currentHealth -= this.playerDamage;
    this.fighter.currentHealth -= this.opponentDamage;
    // Set dead heath to 0 if health is less than 0.
    this.opponent.currentHealth = (this.opponent.currentHealth < 0) ? 0 : this.opponent.currentHealth;
    this.fighter.currentHealth = (this.fighter.currentHealth < 0) ? 0 : this.fighter.currentHealth;
  }


  private removeEnergy(target: string, byAction: string) {

    let character = target === 'player' ? this.fighter : this.opponent;
    const energyCost: number = this.getSpecialsCost(character);
    console.log('character', character);
    console.log('energy cost' + target +energyCost);
    switch (character.type) {
      case CharacterType.WARRIOR:
        character.currentStamina -= energyCost;
        break;
      case CharacterType.ARCHER:
        character.currentStamina -= energyCost;
        break;
      case CharacterType.MAGE:
        character.currentMana -= energyCost;
        break;
    }

    if (target === 'player') {
      this.fighter = character;
    } else {
      this.opponent = character;
    }
  }
  private restoreEnergy(target: string, byAction: string) {
    let character = target === 'player' ? this.fighter : this.opponent;
    const baseEnergyRestore: number | undefined = this.baseEnergyRestore.get(byAction);
    console.log('base mana to restore', baseEnergyRestore);
    switch (byAction) {
      case 'Tackle':
        character.currentStamina += Math.round(baseEnergyRestore! + (character.strength / 2));
        break;
      case 'Shoot':
        character.currentStamina += Math.round(baseEnergyRestore! + (character.accuracy / 4));
        break;
      case 'Staff Attack':
        character.currentMana += Math.round(baseEnergyRestore! + (character.currentMana / 5));
        break;
      case 'Mage Passive':
        character.currentMana += Math.round(baseEnergyRestore! + (character.intelligence / 2));
        break;
    }
    if (target === 'player') {
      this.fighter = character;
    } else {
      this.opponent = character;
    }
  }

  isSufficientEnergy(character: CharacterDetails): boolean {
    const currentEnergy: number = this.getEnergy(character);
    const specialCost: number = this.getSpecialsCost(character);
    console.log('current energy', currentEnergy);
    console.log('special cost', specialCost);
    return currentEnergy >= specialCost;
  }
  private getEnergy(character: CharacterDetails): number {
    switch (character.type) {
      case CharacterType.WARRIOR:
        return character.currentStamina;
      case CharacterType.ARCHER:
        return character.currentStamina;
      case CharacterType.MAGE:
        return character.currentMana;
    }
  }
  private getSpecialsCost(character: CharacterDetails): number {
    const baseCost: number | undefined = this.actionsBaseCosts.get(character.type);
    switch (character.type) {
      case CharacterType.WARRIOR:
        return Math.round(baseCost! + (character.strength / 4));
      case CharacterType.ARCHER:
        return Math.round(baseCost! + (character.accuracy / 3));
      case CharacterType.MAGE:
        return Math.round(baseCost! + (character.intelligence / 2));
    }
  }


}
