// src/pages/Contact.js
import React from 'react';
import { Typography, Box, Link } from '@mui/material';

const Contact = () => {
    const email = 'sudeepa.rajesh1102@gmail.com';

    return (
        <Box
            sx={{
                minHeight: '80vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                px: 2,
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 600,
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    boxShadow: 3,
                    p: 4,
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    align="center"
                    gutterBottom
                    sx={{ fontWeight: 'bold', color: 'primary.main' }}
                >
                    Contact Us
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 3,
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Email:
                    </Typography>
                    <Link
                        href={`mailto:${email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            fontSize: '1rem',
                            color: 'primary.main',
                            fontWeight: 'medium',
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        {email}
                    </Link>
                </Box>
            </Box>
        </Box>
    );
};

export default Contact;
