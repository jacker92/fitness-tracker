import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SuccessBar = styled.div`
  width: 400px;
  border: 1px solid hsl(140, 100%, 15%);
  border-radius: 6px;
  padding: 10px;
  color: hsl(140, 100%, 15%);
  font-weight: 600;
  background: hsl(105, 100%, 80%);
  margin: 30px auto;
  display: none;
  font-size: 1rem;
`;

const SuccessMessage = (props: { message: string }) => {
    const { message } = props;

    return (
        <SuccessBar style={message !== '' && message !== null ? { display: 'block' } : {}}>{message}</SuccessBar>
    );
};

SuccessMessage.defaultProps = {
    message: '',
};

SuccessMessage.propTypes = {
    message: PropTypes.string,
};

export { SuccessMessage };
