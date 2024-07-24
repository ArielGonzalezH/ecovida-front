import { Box, Container, Typography } from "@mui/material";

const Home = () => {
    return (
        <Container>
            <Box sx={{ textAlign: 'center', mt: 5 }}>
                <Typography variant="h2" component="h1" gutterBottom>
                    Bienvenido al portal de ECOVIDA
                </Typography>
            </Box>
        </Container>
    );
}

export default Home;