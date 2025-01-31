import { type FC } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

export interface ConfirmDialogProps {
  id: string | number;
  title?: string;
  description?: string;
  confirmedText?: string;
  declinedText?: string;
  isOpen: boolean;
  onConfirmed: () => void;
  onDeclined?: () => void;
  close: () => void;
}

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
  title,
  description,
  confirmedText = 'Confirm',
  declinedText = 'Cancel',
  isOpen,
  onConfirmed,
  onDeclined = () => null,
  close
}) => {
  const decline = () => {
    close();

    if (onDeclined) {
      onDeclined();
    }
  };
  const confirm = () => {
    close();

    if (onConfirmed) {
      onConfirmed();
    }
  };

  return (
    <Dialog fullWidth open={Boolean(isOpen)} onClose={close}>
      {title && <DialogTitle>{title}</DialogTitle>}
      {description && (
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={decline}>{declinedText}</Button>
        <Button onClick={confirm}>{confirmedText}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
