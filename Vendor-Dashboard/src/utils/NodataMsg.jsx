import React from "react";
import { Box, Typography } from "@mui/material"; // Import MUI components

// Assuming you still have 'cmnStyle.css' or its equivalent styles moved to MUI's system
// You'll need to define the 'noDataImgDiv', 'noDataImg', and 'noDataTextDiv' styles
// using MUI's sx prop or a custom theme if they are not very complex.
// For now, I'll translate them directly to sx prop for simplicity.
// import "../Common/cmnStyle.css"; // Keep if you still have global CSS
// import NoDataMsg from 'assets/images/nodata.png'
function NodataMsg(props) {
  // Destructure props for cleaner access
  const { filter, tableData, filter1, msgdata } = props;

  const getMessage = () => {
    // Check if props object itself is defined (though in modern React, props is always an object)
    // The original code had `if (props)` which is usually redundant.
    // We'll focus on the actual logic of filter/tableData.length
    if (!filter && (!tableData || tableData.length === 0)) { // Assuming tableData can be null/undefined initially or empty array
      return "No Data Found";
    } else if (filter && (!tableData || tableData.length === 0) && !filter1) {
      return `No ${msgdata || 'Data'} Against ${filter}`;
    } else if (filter && filter1 && (!tableData || tableData.length === 0)) {
      return `No ${msgdata || 'Data'} Against ${filter} and ${filter1}`;
    } else if (tableData && tableData.length > 0) {
        // If there is tableData, this component shouldn't typically be shown,
        // but if it is, the "No Data Found" message might be a fallback.
        // Re-evaluating original logic here: if tableData has length,
        // it means there IS data, so this component might not be appropriate.
        // Assuming the intention is to show "No Data Found" if no other specific filter matches.
        return "No Data Found";
    }
    // Fallback if none of the specific conditions are met
    return "No Data Found";
  };

  return (
    // Use Box for the main container div
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4, // Padding top/bottom, equivalent to some vertical spacing
      }}
    >
      {/* Use Box for the noDataImgDiv and a native <img> for the image */}
      <Box
        className="noDataImgDiv" // Keep your CSS class if it has specific non-MUI styles
        sx={{
          width: '100%', // Adjust as per your original CSS
          maxWidth: '300px', // Example max width for the image container
          mb: 2, // Margin bottom for spacing between image and text
          // Add more styles from your original .noDataImgDiv here
        }}
      >
        {/* <img
          className="noDataImg" // Keep your CSS class if it has specific non-MUI styles
          alt="NoDataImg"
          src={NoDataMsg}
          // Add more styles from your original .noDataImg here
          style={{
            width: '100%', // Make image responsive to its container
            height: 'auto',
            display: 'block', // Removes extra space below image
            // objectFit: 'contain' // Ensures image scales down to fit container without cropping
          }}
        /> */}
      </Box>

      {/* Use Typography for the message text */}
      <Typography
        variant="h6" // Use a suitable MUI Typography variant (e.g., h5, h6, body1, subtitle1)
        component="div" // Render as a div tag
        className="noDataTextDiv" // Keep your CSS class if it has specific non-MUI styles
        sx={{
          color: 'text.secondary', // Use MUI theme colors
          textAlign: 'center',
          // Add more styles from your original .noDataTextDiv here
        }}
      >
        {getMessage()}
      </Typography>
    </Box>
  );
}

export default NodataMsg;