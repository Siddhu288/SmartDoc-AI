import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  AppBar,
  Toolbar,
  Link,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme as useMuiTheme,
  Stack,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Upload as UploadIcon,
  AutoAwesome as AutoAwesomeIcon,
  Chat as ChatIcon,
  Description as DescriptionIcon,
  QuestionAnswer as QuestionAnswerIcon,
  ListAlt as ListAltIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Home', action: () => scrollToSection('hero') },
    { label: 'Features', action: () => scrollToSection('features') },
    { label: 'How it Works', action: () => scrollToSection('how-it-works') },
    { label: 'Upload Docs', action: () => navigate('/upload') },
    // { label: 'Login/Signup', action: () => scrollToSection('cta') },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header / Navbar */}
      <AppBar position="fixed" sx={{ backgroundColor: 'background.paper', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary', fontWeight: 'bold' }}>
            SmartDoc AI
          </Typography>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  component="button"
                  onClick={item.action}
                  sx={{
                    color: 'text.primary',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': { color: 'primary.main' },
                    cursor: 'pointer',
                  }}
                >
                  {item.label}
                </Link>
              ))}
              <IconButton onClick={toggleDarkMode}>
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>
          )}
          
          {/* Mobile Navigation */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={toggleDarkMode} >
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              <IconButton onClick={toggleMobileMenu} >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileMenuOpen} onClose={toggleMobileMenu}>
        <Box sx={{ width: 250, pt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2 }}>
            <IconButton onClick={toggleMobileMenu}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {navItems.map((item, index) => (
              <ListItem key={index} component="button" onClick={item.action}>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Hero Section */}
      <Box
        id="hero"
        sx={{
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
          background: darkMode 
            ? 'linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%)'
            : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                fontWeight: 'bold',
                mb: 3,
                background: 'linear-gradient(45deg, #4146C7, #6366f1)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Turn Documents into Insights Instantly
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                mb: 4,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                lineHeight: 1.6,
              }}
            >
              Upload PDFs, Word files, or text, and get summaries, key points, and answers powered by AI.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<UploadIcon />}
              onClick={() => navigate('/upload')}
              sx={{
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': { backgroundColor: '#5a5fcf' },
              }}
            >
              Upload Documents
            </Button>
          </Box>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box id="how-it-works" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}>
            How It Works
          </Typography>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={4}
            sx={{ alignItems: 'stretch' }}
          >
            {[
              { icon: <UploadIcon />, title: 'Upload your document', emoji: '📂', description: 'Simply drag and drop or select your PDF, Word, or text files' },
              { icon: <AutoAwesomeIcon />, title: 'AI summarizes instantly', emoji: '🤖', description: 'Our AI processes your document and creates intelligent summaries' },
              { icon: <ChatIcon />, title: 'Chat & explore insights', emoji: '💡', description: 'Ask questions and discover key insights from your documents' },
            ].map((step, index) => (
              <Paper
                key={index}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  flex: 1,
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-8px)' },
                }}
              >
                <Box sx={{ fontSize: '3rem', mb: 2 }}>{step.emoji}</Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Step {index + 1}: {step.title}
                </Typography>
                <Typography color="text.secondary">{step.description}</Typography>
              </Paper>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}>
            Features
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 3,
            }}
          >
            {[
              { icon: <DescriptionIcon />, title: 'Summarize long documents', description: 'Get concise summaries of lengthy documents in seconds' },
              { icon: <QuestionAnswerIcon />, title: 'Ask questions & get instant answers', description: 'Interactive Q&A with your documents using natural language' },
              { icon: <ListAltIcon />, title: 'Extract key points and action items', description: 'Automatically identify important information and next steps' },
              { icon: <PictureAsPdfIcon />, title: 'Supports PDFs/Word/More', description: 'Works with multiple file formats including PDF, DOCX, and TXT' },
            ].map((feature, index) => (
              <Paper
                key={index}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {feature.description}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Demo / Preview Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}>
            See It In Action
          </Typography>
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              backgroundColor: darkMode ? '#2c2c2e' : '#f8f9fa',
              border: darkMode ? '1px solid #3c3c3e' : '1px solid #e9ecef',
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={4}
              sx={{ alignItems: 'stretch' }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Document Excerpt
                </Typography>
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: 'background.paper',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                  }}
                >
                  "The quarterly financial report shows a 15% increase in revenue compared to Q3, driven primarily by strong performance in our SaaS division. Operating expenses remained stable while customer acquisition costs decreased by 8%..."
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                  AI Summary & Q&A
                </Typography>
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    borderRadius: 2,
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Key Points:
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    • 15% revenue increase vs Q3<br />
                    • SaaS division driving growth<br />
                    • 8% reduction in acquisition costs
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Q: What was the main growth driver?
                  </Typography>
                  <Typography variant="body2">
                    A: The SaaS division was the primary driver of the 15% revenue increase.
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Box>

      {/* Call To Action Section */}
      <Box
        id="cta"
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            Ready to get started?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Transform your documents into actionable insights today
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/upload')}
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': { backgroundColor: '#f0f0f0' },
            }}
          >
            Upload Now
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, backgroundColor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography color="text.secondary">
              © 2025 SmartDoc AI. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {['About', 'Privacy Policy', 'Contact'].map((link) => (
                <Link
                  key={link}
                  component="button"
                  onClick={() => navigate('/')}
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                    cursor: 'pointer',
                  }}
                >
                  {link}
                </Link>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;