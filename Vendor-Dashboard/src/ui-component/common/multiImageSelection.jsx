


// import React, { useRef } from 'react';
// import { Button, Box, Typography, Grid, Paper, IconButton } from '@mui/material';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import CloseIcon from '@mui/icons-material/Close';

// function ImageDropzone({ selectedFiles, onFilesAdded, onFileRemoved }) {
//   const initialFileInputRef = useRef(null);
//   const addMoreFileInputRef = useRef(null);
//   const [isDragging, setIsDragging] = React.useState(false);

//   // --- Handlers for Click Selection ---
//   const handleFileChange = (event, inputType) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       onFilesAdded(files);
      
//       // Reset the specific input
//       if (inputType === 'initial' && initialFileInputRef.current) {
//         initialFileInputRef.current.value = '';
//       } else if (inputType === 'addMore' && addMoreFileInputRef.current) {
//         addMoreFileInputRef.current.value = '';
//       }
//     }
//   };

//   const handleUploadClick = () => {
//     initialFileInputRef.current?.click();
//   };

//   const handleAddMoreClick = () => {
//     addMoreFileInputRef.current?.click();
//   };

//   // --- Drag & Drop Handlers ---
//   const handleDragOver = (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//     setIsDragging(true);
//   };

//   const handleDragEnter = (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//     if (!event.currentTarget.contains(event.relatedTarget)) {
//       setIsDragging(false);
//     }
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//     setIsDragging(false);
    
//     const files = event.dataTransfer.files;
//     if (files && files.length > 0) {
//       onFilesAdded(files);
//     }
//   };

//   return (
//     <Box sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
      
//       {/* Hidden File Input for Initial Selection */}
//       <input
//         type="file"
//         multiple
//         accept="image/*"
//         ref={initialFileInputRef}
//         onChange={(e) => handleFileChange(e, 'initial')}
//         style={{ display: 'none' }} 
//       />

//       {/* Hidden File Input for Add More */}
//       <input
//         type="file"
//         multiple
//         accept="image/*"
//         ref={addMoreFileInputRef}
//         onChange={(e) => handleFileChange(e, 'addMore')}
//         style={{ display: 'none' }} 
//       />

//       {/* Drag & Drop Area */}
//       <Paper
//         variant="outlined"
//         onDragOver={handleDragOver}
//         onDragEnter={handleDragEnter}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//         onClick={handleUploadClick}
//         sx={{
//           p: 4,
//           textAlign: 'center',
//           cursor: 'pointer',
//           border: `2px dashed ${isDragging ? 'primary.main' : 'grey.400'}`,
//           backgroundColor: isDragging ? 'primary.light' : 'background.paper',
//           transition: 'all 0.3s',
//           mb: 3,
//           '&:hover': {
//             backgroundColor: 'grey.50',
//           }
//         }}
//       >
//         <CloudUploadIcon color="action" sx={{ fontSize: 40, mb: 1 }} />
//         <Typography variant="h6">
//           Drag & drop images here or click to browse
//         </Typography>
//         <Typography variant="body2" color="textSecondary">
//           (Supports multiple files)
//         </Typography>
//       </Paper>
      
//       {/* Image Previews */}
//       {selectedFiles.length > 0 && (
//         <Box sx={{ mb: 3 }}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//             <Typography variant="h6">
//               Selected Images ({selectedFiles.length})
//             </Typography>
//             <Button 
//               variant="outlined" 
//               onClick={handleAddMoreClick}
//               startIcon={<CloudUploadIcon />}
//             >
//               Add More Images
//             </Button>
//           </Box>
          
//           <Grid container spacing={2}>
//             {selectedFiles.map((file, index) => (
//               <Grid item key={`${file.name}-${index}-${file.lastModified}`}>
//                 <Paper 
//                   elevation={3} 
//                   sx={{ 
//                     position: 'relative', 
//                     width: 120, 
//                     height: 120,
//                     overflow: 'hidden',
//                   }}
//                 >
//                   <img 
//                     src={URL.createObjectURL(file)} 
//                     alt={`Preview ${file.name}`} 
//                     style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                   />
                  
//                   <IconButton 
//                     size="small"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onFileRemoved(file.name);
//                     }} 
//                     sx={{ 
//                       position: 'absolute', 
//                       top: 2, 
//                       right: 2, 
//                       bgcolor: 'rgba(255, 255, 255, 0.9)',
//                       '&:hover': {
//                         bgcolor: 'rgba(255, 255, 255, 1)',
//                       }
//                     }}
//                   >
//                     <CloseIcon fontSize="small" />
//                   </IconButton>
//                 </Paper>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       )}
//     </Box>
//   );
// }

// export default ImageDropzone;













import React, { useRef, useState } from 'react';
import { Box, Paper, Typography, Grid, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

export default function DualImageUploader2({ selectedFiles, onFilesAdded, onFileRemoved }) {
  const browseInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // --- Handle file selection (browse)
  const handleBrowseChange = (e) => {
    onFilesAdded(e.target.files);
    e.target.value = ''; // reset to allow reselecting same files
  };

  // --- Handle drop files
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    onFilesAdded(e.dataTransfer.files);
  };

  return (
    <Box>
      {/* Hidden input for browse */}
      <input
        type="file"
        multiple
        accept="image/*"
        ref={browseInputRef}
        onChange={handleBrowseChange}
        style={{ display: 'none' }}
      />

      {/* --- Browse Area --- */}
      <Paper
        variant="outlined"
        onClick={() => browseInputRef.current.click()}
        sx={{
          p: 3,
          mb: 2,
          textAlign: 'center',
          cursor: 'pointer',
          border: '2px dashed #aaa',
          '&:hover': { borderColor: 'primary.main', backgroundColor: 'grey.50' },
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 36, mb: 1 }} />
        <Typography variant="body1">Click to browse images</Typography>
      </Paper>

      {/* --- Drag & Drop Area --- */}
      <Paper
        variant="outlined"
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        sx={{
          p: 3,
          textAlign: 'center',
          border: `2px dashed ${isDragging ? 'green' : '#ccc'}`,
          backgroundColor: isDragging ? 'rgba(0,255,0,0.05)' : 'transparent',
        }}
      >
        <Typography variant="body1">
          Drag & drop images here
        </Typography>
      </Paper>

      {/* --- Previews --- */}
      {selectedFiles.length > 0 && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {selectedFiles.map((file) => (
            <Grid item key={file.name + file.lastModified}>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  position: 'relative',
                  border: '1px solid #ddd',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <IconButton
                  size="small"
                  onClick={() => onFileRemoved(file.name)}
                  sx={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    bgcolor: 'rgba(255,255,255,0.7)',
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
