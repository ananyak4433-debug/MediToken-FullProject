import React from "react";
import Lottie from "lottie-react";
import { Box, Typography, Container } from "@mui/material";
import animationData from "assets/Gif/NoData.json";
 
const UnderConstruction = () => {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
      }}
    >
      {/* Lottie Animation */}
      <Box sx={{ width: { xs: "90%", sm: "70%", md: "60%" }, mb: 2 }}>
        <Lottie animationData={animationData} loop />
      </Box>

      {/* Heading */}
      <Typography
        variant="h3"
        fontWeight="bold"
        // fontFamily="cursive"
        color="black"
      >
        WE ARE UNDER CONSTRUCTION 
      </Typography>
    </Container>
  );
};

export default UnderConstruction;