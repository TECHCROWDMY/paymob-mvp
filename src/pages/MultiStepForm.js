import { useState } from 'react';
// @mui
import {
  Box,
  Stack,
  Button,
  Popover,
  MenuItem,
  Container,
  Typography,
  Grid,
  TextField,
  FormControl,
  Input
} from '@mui/material';
// components
import CheckoutSteps from '../sections/@dashboard/multiStepForm/CheckoutSteps';
import Iconify from '../components/iconify';
import upload from '../assets/Upload.svg';
 
export default function MultiStepForm() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  const [open, setOpen] = useState(null);
 
  const handleCloseMenu = () => {
    setOpen(null);
  };

   
  const STEPS = ['Form 1', 'File Uploader', 'Payment'];
  const [activeStep, setActiveStep] = useState(0)

  const handleNextStep = () => {
    setActiveStep(prev=>prev+1)
  }
  const handleBackStep = () => {
    setActiveStep(prev=>prev-1)
  }


  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
    setImagePreviewUrl(URL.createObjectURL(file)); // Create a temporary URL for the image preview
  };
  const handleDragOver = (event) => {
    event.preventDefault();
  };
    // Inside your handleFileChange function
    const handleFileChange = async (event) => {
      const file = event.target.files[0];
      setSelectedFile(file);
      if (file) {
        setImagePreviewUrl(URL.createObjectURL(file));
      }
    };
    const handleRemove = () => {
      setSelectedFile(null);
    };



  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button>
        </Stack>
        <Grid container justifyContent='center' >
          <Grid item xs={12} md={8}>
            <CheckoutSteps activeStep={activeStep} steps={STEPS} />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom> {STEPS[activeStep]} </Typography>

        {activeStep === 0 && 
                <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="firstName"
                    name="firstName"
                    label="First name"
                    fullWidth
                    autoComplete="given-name"
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="lastName"
                    name="lastName"
                    label="Last name"
                    fullWidth
                    autoComplete="family-name"
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="address1"
                    name="address1"
                    label="Address line 1"
                    fullWidth
                    autoComplete="shipping address-line1"
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="address2"
                    name="address2"
                    label="Address line 2"
                    fullWidth
                    autoComplete="shipping address-line2"
                    variant="standard"
                  />
                </Grid>
              </Grid>
        }
        {activeStep === 1 && 
          <FormControl sx={{ width: '100%' }}>
          <div>
            <label
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              htmlFor="fileInput"
              style={{
                border: '2px dashed #aaa',
                borderRadius: '4px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '1rem',
                cursor: 'pointer'
              }}
            >
              {selectedFile ? (
                <>
                  <img src={imagePreviewUrl} alt="Preview" style={{ maxHeight: '500px', marginBottom: '10px' }} />
                  <span style={{ alignItems: 'center' }}>{selectedFile.name}</span>
                </>
              ) : (
                <>
                  <img src={upload} style={{ height: '50px', margin: '10px' }} alt="upload" />
                  <span>Drag and drop files here or click to browse</span>
                </>
              )}
            </label>
            <Input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              value={''} // Reset the input value
              style={{ display: 'none' }} // Hide the input element
            />
            {selectedFile && (
              <div style={{ display: 'flex' }}>
                <Button variant="contained" color="error" onClick={handleRemove}>
                  Remove
                </Button>
              </div>
            )}
          </div>
        </FormControl>
        }



        <Box sx={{pt:5}}>
          <Button onClick={handleNextStep} fullWidth variant="contained">Next</Button>
        </Box>
        <Box sx={{pt:2}}>
          <Button onClick={handleBackStep} fullWidth variant="contained">Back</Button>
        </Box>

      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
