import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ChatUI = ({ messages }) => {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
  if (containerRef.current) {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }
}, [messages]);

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: 2,
        overflowY: 'auto',
        height: '100%',
        bgcolor: 'background.default',
      }}
    >
      {messages.map((msg, idx) => (
        <Box
          key={idx}
          sx={{
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '75%',
          }}
        >
          <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  bgcolor: msg.sender === 'user' ? '#6666AD' : '#6666AD',
                  color: msg.sender === 'user' ? '#ffffff' : '#ffffff',
                  wordBreak: 'break-word',
                  position: 'relative', // needed for the tail
                  borderRadius: 2,      // rounded corners
                  '&::after': {
                    content: "''",
                    position: 'absolute',
                    width: 0,
                    height: 0,
                    bottom: 0,
                  },
                }}
              >
            <Typography
              variant="body1"
              component="span"
              sx={{
                whiteSpace: 'pre-wrap',
                color: msg.sender === 'user' ? 'common.white' : 'text.white',
              }}
            >
              {formatMessage(msg.text)}
            </Typography>
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

// Basic formatter: supports **bold**, *italic*, `inline code`
function formatMessage(text) {
  if (!text) return '';

  return text
    .split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g) // split by formatting tokens
    .map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      } else if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={idx}>{part.slice(1, -1)}</em>;
      } else if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <Box
            key={idx}
            component="code"
            sx={{
              backgroundColor: 'grey.200',
              borderRadius: 0.5,
              px: 0.5,
              color: 'grey.900',
            }}
          >
            {part.slice(1, -1)}
          </Box>
        );
      }
      return part;
    });
}

export default ChatUI;
