import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ErrorBar = styled.div`
  width: 400px;
  border: 1px solid hsl(354,61%,28%);
  border-radius: 6px;
  padding: 10px;
  color: hsl(354,61%,28%);
  font-weight: 600;
  background: hsl(355,70%,91%);
  margin: 30px auto;
  display: none;
  font-size: 1rem;
`;

const ErrorMessage = (props: { error: string }) => {
    const { error } = props;

    return (
        <ErrorBar style={error !== '' && error !== null ? { display: 'block' } : {}}>{error}</ErrorBar>
    );
};

ErrorMessage.defaultProps = {
    error: '',
};

ErrorMessage.propTypes = {
    error: PropTypes.string,
};

export { ErrorMessage };
