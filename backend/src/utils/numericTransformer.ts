import { ValueTransformer } from 'typeorm/decorator/options/ValueTransformer';

const numericTransformer: ValueTransformer = {
  from: (value: string): number => parseFloat(value),
  to: (value: number): number => value,
};

export default numericTransformer;
