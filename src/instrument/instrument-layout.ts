import type { ControlId } from './instrument';

export type InstrumentLayer = 'base' | 'raised';

export type InstrumentLayoutControl = {
  controlId: ControlId;
  layer: InstrumentLayer;
  leftPercent?: number;
};

export type InstrumentLayout = {
  label: string;
  baseControlCount: number;
  controls: InstrumentLayoutControl[];
};
