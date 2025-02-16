import { type PropsWithChildren } from 'react';
import { z } from 'zod';
import Button from '@mui/material/Button';
import Dialog, { type DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { FormProvider } from '../form-provider';
import { useForm } from '../hooks/use-form';
import { type ZodInferSchema } from '../types';

export interface FormDialogProps<T extends z.ZodType> {
  schema: T;
  defaultValues?: ZodInferSchema<T> | null;
  isOpen: boolean;
  title?: string;
  contentText?: string;
  cancelText?: string;
  submitText?: string;
  dialog?: Omit<DialogProps, 'open' | 'onClose'>;
  disabledSubmit?: boolean;
  close: () => void;
  onCancel?: () => void;
  onSubmit: (data: ZodInferSchema<T>) => void;
}

export const FormDialog = <T extends z.ZodType>({
  schema,
  defaultValues,
  children,
  isOpen,
  close,
  title,
  contentText,
  cancelText = 'Cancel',
  submitText = 'Accept',
  dialog = {},
  disabledSubmit = false,
  onCancel,
  onSubmit
}: PropsWithChildren<FormDialogProps<T>>) => {
  const { errors, isPending, submitAction } = useForm({
    schema,
    defaultValues,
    onSubmit
  });
  const cancel = () => {
    close();

    if (!isPending && onCancel) {
      onCancel();
    }
  };

  return (
    <Dialog open={isOpen || false} onClose={cancel} {...dialog}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <FormProvider errors={errors} isPending={isPending}>
        <form noValidate action={submitAction}>
          <DialogContent>
            {contentText && (
              <DialogContentText>{contentText}</DialogContentText>
            )}
            {children}
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={cancel} disabled={isPending}>
              {cancelText}
            </Button>
            <Button
              type="submit"
              disabled={isPending || disabledSubmit}
              loading={isPending}
            >
              {submitText}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};
