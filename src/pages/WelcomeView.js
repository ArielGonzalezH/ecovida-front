import React from 'react';
import { Typography, Container, Box } from '@mui/material';

const WelcomeView = () => {
    return (
        <Container>
            <Box sx={{ textAlign: 'center', mt: 5 }}>
                <Typography variant="h2" component="h1" gutterBottom>
                    Bienvenido al portal de ECOVIDA
                </Typography>
            </Box>
        </Container>
    );
};

export default WelcomeView;
