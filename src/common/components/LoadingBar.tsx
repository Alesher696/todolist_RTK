import React from 'react';
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

export const LoadingBar = () => {
    return (
        <Box sx={{ width: '100%' , position: 'absolute'}}>
            <LinearProgress />
        </Box>
    );
};

