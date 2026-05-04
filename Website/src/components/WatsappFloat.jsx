import React from "react";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const WhatsAppFloat = ({
  phone = "919876543210",   // default number
  message = "Hello, I need help",
  position = "right",       // 'right' or 'left'
  bottom = "20px",
  size = 55
}) => {
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encodedMessage}`;

  const styles = {
    container: {
      position: "fixed",
      bottom: bottom,
      [position]: "20px",
      zIndex: 1000,
      cursor: "pointer"
    },
    image: {
      width: size,
      height: size,
      borderRadius: "50%",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease"
    }
  };

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={styles.container}>
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: "#25D366",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
    }}
  >
    <WhatsAppIcon style={{ color: "#fff", fontSize: size * 0.6 }} />
  </div>
</a>
  );
};

export default WhatsAppFloat;