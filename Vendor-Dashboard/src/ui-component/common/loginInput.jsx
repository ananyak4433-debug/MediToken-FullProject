import React from 'react';
import { FormControl, TextField } from '@mui/material';
import { useField } from 'formik';

const FormikTextField = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <TextField
        {...field}
        {...props}
        label={label}
        size="small"
        error={meta.touched && Boolean(meta.error)}
        helperText={meta.touched && meta.error}
        onKeyDown={(e) => {
          if (e.key === ' ') {
            e.preventDefault();
          }
        }}
        // To handle the password visibility icon within the TextField
        InputProps={props.InputProps}
      />
    </FormControl>
  );
};
export default FormikTextField;
