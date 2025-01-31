import { type FC, type PropsWithChildren } from 'react';
import Button from '@mui/material/Button';
import Dialog, { type DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FormProvider, type UseFormReturn } from 'react-hook-form';

export interface FormDialogProps {
  isOpen: boolean;
  loading?: boolean;
  title?: string;
  contentText?: string;
  cancelText?: string;
  submitText?: string;
  form: UseFormReturn<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  dialog?: Omit<DialogProps, 'open' | 'onClose'>;
  disabledSubmit?: boolean;
  close: () => void;
  onCancel?: () => void;
  onSubmit: () => void;
}

export const FormDialog: FC<PropsWithChildren<FormDialogProps>> = ({
  children,
  isOpen,
  close,
  title,
  contentText,
  loading = false,
  cancelText = 'Cancel',
  submitText = 'Accept',
  form,
  dialog = {},
  disabledSubmit = false,
  onCancel,
  onSubmit
}) => {
  const cancel = () => {
    close();

    if (!loading && onCancel) {
      onCancel();
    }

    form.reset();
  };

  return (
    <Dialog open={isOpen || false} onClose={cancel} {...dialog}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <FormProvider {...form}>
        <form noValidate onSubmit={onSubmit}>
          <DialogContent>
            {contentText && (
              <DialogContentText>{contentText}</DialogContentText>
            )}
            {children}
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={cancel} disabled={loading}>
              {cancelText}
            </Button>
            <Button
              type="submit"
              disabled={loading || disabledSubmit}
              loading={loading}
            >
              {submitText}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};
