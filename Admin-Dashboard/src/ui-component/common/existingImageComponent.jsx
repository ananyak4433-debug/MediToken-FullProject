// import React, { useRef, useState } from 'react';
// import { Button, Box, Typography, Grid, Paper, IconButton } from '@mui/material';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import CloseIcon from '@mui/icons-material/Close';
// import { useFormikContext } from 'formik';

// function ImageAttachmentManager({ selectedNewFiles, onNewFilesAdded, onRemoveNewFile }) {
//     const { values, setFieldValue } = useFormikContext(); 
//     const fileInputRef = useRef(null);
//     const [isDragging, setIsDragging] = useState(false);
    

//     const handleDragOver = (event) => {
//         console.log("-----------handleDragOver-------------------",event);
        
//         event.preventDefault(); 
//         setIsDragging(true);
//     };

//     const handleDrop = (event) => {
//                 console.log("-----------handleDrop-------------------",event);

//         event.preventDefault();
//         setIsDragging(false);
//         onNewFilesAdded(event.dataTransfer.files);
//     };

//     const handleFileChange = (event) => {
//                         console.log("-----------handleFileChange-------------------",event);

//         onNewFilesAdded(event.target.files);
//          event.target.value = null; 
//         // event.target.value = '';
//     };

//     const handleRemoveExistingAttachment = (urlToRemove) => {
//                                 console.log("-----------handleRemoveExistingAttachment-------------------",event);

//         const updatedAttachments = values.attachments.filter(att => att.attachmentUrl !== urlToRemove);
        
//         setFieldValue('attachments', updatedAttachments);
//     };

//     return (
//         <Grid container spacing={2}>
//             {/* Hidden File Input */}
//             <input
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//                 style={{ display: 'none' }} 
//             />
            
//             <Grid item xs={12}>
//                 <Box sx={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
//                     <Typography variant="h5">Image Attachments</Typography>
//                 </Box>
//             </Grid>

//             <Grid item xs={12}>
//                 {/* Drag & Drop Area */}
//                 <Paper
//                     variant="outlined"
//                     onDragOver={handleDragOver}
//                     onDragLeave={() => setIsDragging(false)}
//                     onDrop={handleDrop}
//                     onClick={() => fileInputRef.current.click()}
//                     sx={{
//                         p: 4,
//                         textAlign: 'center',
//                         cursor: 'pointer',
//                         border: `2px dashed ${isDragging ? 'primary.main' : 'grey.400'}`,
//                         backgroundColor: isDragging ? 'primary.light' : 'background.paper',
//                         transition: 'all 0.3s',
//                         mb: 3,
//                     }}
//                 >
//                     <CloudUploadIcon color="action" sx={{ fontSize: 40, mb: 1 }} />
//                     <Typography variant="h6">
//                         Drag & drop images here or click to browse
//                     </Typography>
//                 </Paper>
//             </Grid>

//             {(values.attachments.length > 0 || selectedNewFiles.length > 0) && (
//                 <Grid container item xs={12} spacing={2} sx={{ mb: 3 }}>
                    
//                     {/* 1. Existing Attachments (URLs from Formik) */}
//                     {values.attachments.map((att) => (
//                         <Grid item key={`existing-${att.attachmentUrl}`}>
//                             <Paper elevation={3} sx={{ position: 'relative', width: 120, height: 120, overflow: 'hidden' }}>
//                                 <img 
//                                     src={att.attachmentUrl} 
//                                     alt={att.name || 'Existing Attachment'}
//                                     style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                                 />
//                                 <IconButton 
//                                     size="small"
//                                     onClick={() => handleRemoveExistingAttachment(att.attachmentUrl)} 
//                                     sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(255, 255, 255, 0.7)' }}
//                                 >
//                                     <CloseIcon fontSize="small" />
//                                 </IconButton>
//                             </Paper>
//                         </Grid>
//                     ))}

//                     {/* 2. Newly Selected Files (File Objects from Parent State) */}
//                     {selectedNewFiles.map((file) => (
//                         <Grid item key={`new-${file.name}-${file.lastModified}`}>
//                             <Paper elevation={3} sx={{ position: 'relative', width: 120, height: 120, overflow: 'hidden', border: '2px dashed green' }}>
//                                 <img 
//                                     src={URL.createObjectURL(file)} 
//                                     alt={`New File ${file.name}`} 
//                                     style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                                 />
//                                 <IconButton 
//                                     size="small"
//                                     // Calls parent handler to remove from 'selectedNewFiles' array
//                                     onClick={() => onRemoveNewFile(file.name)} 
//                                     sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(255, 255, 255, 0.7)' }}
//                                 >
//                                     <CloseIcon fontSize="small" />
//                                 </IconButton>
//                             </Paper>
//                         </Grid>
//                     ))}
//                 </Grid>
//             )}
//         </Grid>
//     );
// }

// export default ImageAttachmentManager;




import React, { useRef, useState } from 'react';
import { Button, Box, Typography, Grid, Paper, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { useFormikContext } from 'formik';

function ImageAttachmentManager({ selectedNewFiles, onNewFilesAdded, onRemoveNewFile }) {
    const { values, setFieldValue } = useFormikContext(); 
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    
    const handleDragOver = (event) => {
        event.preventDefault(); 
        setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        // Only set dragging to false if leaving the actual drop zone
        if (event.currentTarget.contains(event.relatedTarget)) return;
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            onNewFilesAdded(files);
        }
    };

    const handleFileInputClick = (event) => {
        // This ensures we can select files again after removal
        event.stopPropagation();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            onNewFilesAdded(files);
        }
        
        // CRITICAL FIX: Reset input to allow selecting same files again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveExistingAttachment = (urlToRemove) => {
        const updatedAttachments = values.attachments.filter(att => att.attachmentUrl !== urlToRemove);
        setFieldValue('attachments', updatedAttachments);
    };

    const handleDropZoneClick = (event) => {
        // Trigger file input when clicking anywhere in the drop zone
        handleFileInputClick(event);
    };

    return (
        <Grid container spacing={2}>
            {/* Hidden File Input - FIXED: Proper reset handling */}
            <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }} 
            />
            
            {/* <Grid item xs={12}>
                <Box sx={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    <Typography variant="h5">Image Attachments</Typography>
                </Box>
            </Grid> */}

            <Grid item xs={12}>
                {/* Drag & Drop Area - FIXED: Better click handling and drag detection */}
                <Paper
                    variant="outlined"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleDropZoneClick}
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        cursor: 'pointer',
                        border: `2px dashed ${isDragging ? 'primary.main' : 'grey.400'}`,
                        backgroundColor: isDragging ? 'action.hover' : 'background.paper',
                        transition: 'all 0.3s',
                        mb: 3,
                        '&:hover': {
                            borderColor: 'primary.main',
                            backgroundColor: 'action.hover'
                        },
                        // Ensure the entire area is clickable
                        position: 'relative',
                        minHeight: 120,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <CloudUploadIcon 
                        color={isDragging ? "primary" : "action"} 
                        sx={{ fontSize: 40, mb: 1 }} 
                    />
                    <Typography variant="h6" color={isDragging ? "primary" : "text.primary"}>
                        {isDragging ? 'Drop images here' : 'Drag & drop images here or click to browse'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Select multiple images or drag multiple files at once
                    </Typography>
                    
                    {/* Hidden button that covers the entire area for better click handling */}
                    <Button
                        component="span"
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            cursor: 'pointer'
                        }}
                        onClick={handleFileInputClick}
                    >
                        Browse Files
                    </Button>
                </Paper>
            </Grid>

            {(values.attachments.length > 0 || selectedNewFiles.length > 0) && (
                <Grid container item xs={12} spacing={2} sx={{ mb: 3 }}>
                    
                    {/* 1. Existing Attachments (URLs from Formik) */}
                    {values.attachments.map((att, index) => (
                        <Grid item key={`existing-${att.attachmentUrl}-${index}`}>
                            <Paper 
                                elevation={2} 
                                sx={{ 
                                    position: 'relative', 
                                    width: 120, 
                                    height: 120, 
                                    overflow: 'hidden',
                                    border: '1px solid #e0e0e0'
                                }}
                            >
                                <img 
                                    src={att.attachmentUrl} 
                                    alt={att.name || 'Existing Attachment'}
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover' 
                                    }}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/120x120?text=Image+Error';
                                    }}
                                />
                                <IconButton 
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveExistingAttachment(att.attachmentUrl);
                                    }} 
                                    sx={{ 
                                        position: 'absolute', 
                                        top: 2, 
                                        right: 2, 
                                        bgcolor: 'background.paper',
                                        '&:hover': {
                                            bgcolor: 'error.light'
                                        },
                                        width: 24,
                                        height: 24
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Paper>
                        </Grid>
                    ))}

                    {/* 2. Newly Selected Files (File Objects from Parent State) */}
                    {selectedNewFiles.map((file, index) => (
                        <Grid item key={`new-${file.name}-${file.lastModified}-${index}`}>
                            <Paper 
                                elevation={2} 
                                sx={{ 
                                    position: 'relative', 
                                    width: 120, 
                                    height: 120, 
                                    overflow: 'hidden', 
                                    border: '2px dashed',
                                    borderColor: 'success.main'
                                }}
                            >
                                <img 
                                    src={URL.createObjectURL(file)} 
                                    alt={`New File ${file.name}`} 
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover' 
                                    }}
                                />
                                <IconButton 
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveNewFile(file.name);
                                    }} 
                                    sx={{ 
                                        position: 'absolute', 
                                        top: 2, 
                                        right: 2, 
                                        bgcolor: 'background.paper',
                                        '&:hover': {
                                            bgcolor: 'error.light'
                                        },
                                        width: 24,
                                        height: 24
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        bgcolor: 'rgba(0,0,0,0.7)',
                                        color: 'white',
                                        p: 0.5,
                                        fontSize: '0.7rem',
                                        textAlign: 'center'
                                    }}
                                >
                                    New
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Helper text to show current count */}
            <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                    {values.attachments.length} existing images + {selectedNewFiles.length} new images selected
                </Typography>
            </Grid>
        </Grid>
    );
}

export default ImageAttachmentManager;