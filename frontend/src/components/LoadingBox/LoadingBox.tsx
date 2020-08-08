import React from 'react';
import styled from 'styled-components';

const Box = styled.div`
    margin: 20px auto;
    font-size: 0.9rem;
    text-align: center;
    font-size: 1.4rem;
    width: 100px;
`;

const LoadingSpinner = styled.div`
    height: 48px;
    width: 48px;
    border: 5px solid hsla(0, 0%, 59%, 0.2);
    border-radius: 50%;
    border-top-color: hsl(0, 0%, 59%);
    animation: rotate 1s 0s infinite linear normal;
    margin: 0 auto 12px;

    @keyframes rotate {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

const LoadingBox = () => (
  <Box>
    <LoadingSpinner />
  </Box>
);

export { LoadingBox };
