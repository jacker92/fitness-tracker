import styled from 'styled-components';
import React from 'react';

const StyledHeader = styled.header`
    background-color: hsl(0, 0%, 19%);
    height: 60px;
    line-height: 60px;
    color: hsl(0,0%,100%);

    .title {
      font-size: 24px;
      margin: 0 15px;
      float: left;
    }

    .menu {
      float: right;
      text-align: right;

      ul {
        margin: 0;
        padding: 0;

        li {
          display: inline;
          padding: 0 15px;
          list-style-type: none;

          a, a:visited, a:active {
            color: hsl(0,0%,100%);
            text-decoration: none;
          }

        }
      }
    }
`;

const Header = () => (
  <StyledHeader>
    <div className="title">Fitness Tracker</div>
    <div className="menu">
      <ul>
        <li><a href="/login">Login</a></li>
        <li><a href="/register">Register</a></li>
      </ul>
    </div>
  </StyledHeader>
);

export { Header };
