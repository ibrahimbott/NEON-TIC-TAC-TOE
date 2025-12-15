export type Player = 'X' | 'O';
export type SquareValue = Player | null;

export enum Difficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH', // Unbeatable
}

export enum GameMode {
  MENU = 'MENU',
  SCANNING = 'SCANNING', // Simulated Bluetooth scan
  GAME_VS_CPU = 'GAME_VS_CPU',
  GAME_PVP = 'GAME_PVP',
  STATS = 'STATS',
}

export interface WinState {
  winner: Player | 'DRAW' | null;
  line: number[] | null;
}