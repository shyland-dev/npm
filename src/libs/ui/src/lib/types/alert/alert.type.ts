import { ShyIntent } from '../intent/intent.type';

export type ShyAlertIntent = Extract<ShyIntent, 'info' | 'success' | 'warning' | 'danger'>;
