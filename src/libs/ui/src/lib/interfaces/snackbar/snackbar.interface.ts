import { SnackbarComponent } from '../../components/snackbar/snackbar.component';
import { SnackbarPosition } from '../../types';

export interface SnackbarShowOptions {
  element: SnackbarComponent;
  position?: SnackbarPosition;
  delay?: number;
  text?: string;
}
