export interface DamageFromAndTo {
  to: separateDamages;
  from: separateDamages;
}

export interface separateDamages {
  double_damage?: Damage[];
  half_damage?: Damage[];
  no_damage?: any[];
}

export interface Damage {
  damageValue: string;
  name: string;
  url: string;
}
