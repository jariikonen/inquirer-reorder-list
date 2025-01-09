import colors from 'yoctocolors-cjs';
import figures from '@inquirer/figures';
import { Choice } from './types.js';

/**
 * Separator object
 * Used to space/separate choices group
 */
export class Separator implements Choice<string> {
  name = colors.dim(Array.from({ length: 15 }).join(figures.line));
  description = '';
  value = 'separator';
  short = 'separator';
  disabled = false;
  checked?: boolean | undefined;

  constructor(separator = this.name) {
    if (separator != this.name) {
      this.name = separator;
      this.value = separator;
    }
  }
}
