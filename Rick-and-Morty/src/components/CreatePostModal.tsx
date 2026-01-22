import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Box
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  title: Yup.string()
    .min(1, 'Title must be at least 1 character')
    .max(50, 'Title must be at most 50 characters')
    .required('Title is required'),
  body: Yup.string()
    .min(1, 'Body must be at least 1 character')
    .max(1000, 'Body must be at most 1000 characters')
    .required('Body is required'),
  url: Yup.string()
    .url('Invalid URL format')
    .matches(/^http/, 'URL must start with http')
    .required('URL is required'),
  rate: Yup.number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5')
});

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreatePostRequest) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  open,
  onClose,
  onSubmit
}) => {
  const formik = useFormik({
    initialValues: {
      title: '',
      body: '',
      url: '',
      rate: 0
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Post</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            margin="normal"
          />

          <TextField
            fullWidth
            id="body"
            name="body"
            label="Body"
            multiline
            rows={4}
            value={formik.values.body}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.body && Boolean(formik.errors.body)}
            helperText={formik.touched.body && formik.errors.body}
            margin="normal"
          />

          <TextField
            fullWidth
            id="url"
            name="url"
            label="Image URL"
            value={formik.values.url}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.url && Boolean(formik.errors.url)}
            helperText={formik.touched.url && formik.errors.url}
            margin="normal"
          />

          <Box sx={{ mt: 2 }}>
            <Rating
              name="rate"
              value={formik.values.rate}
              onChange={(_, value) => formik.setFieldValue('rate', value || 0)}
            />
            {formik.touched.rate && formik.errors.rate && (
              <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                {formik.errors.rate}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Create Post
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreatePostModal;