import React from 'react';
import { useField } from 'formik';
import { Switch } from '@mui/material';

const FormikSwitch = ({ name, ...props }) => {
  const [field, , helpers] = useField(name);

  return (
    <Switch
      checked={field.value}
      onChange={(e) => helpers.setValue(e.target.checked)} // preferred way with Formik
      {...props}
      sx={{
        '& .MuiSwitch-switchBase.Mui-checked': {
          color: 'green',
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
          backgroundColor: 'green',
        },
        '& .MuiSwitch-track': {
          borderRadius: '13px', // ensures the track is rounded
        },
        '& .MuiSwitch-thumb': {
          boxShadow: 'none',
        },
      }}
    />
  );
};

export default FormikSwitch;
