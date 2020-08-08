import styled from 'styled-components';

const Form = styled.form`
  width: 300px;
  margin: 20px auto;

  fieldset {
    border: none;
    margin:0;
    padding:0
  }

  div.form-field {
    margin: 20px 0;

    label {
      font-weight: bold;
      display: block;
      font-size: 1.2rem;

      input[type="text"],
      input[type="password"] {
        margin-top: 7px;
        border: 1px solid hsl(0, 0%, 19%);
        padding: 8px;
        display: block;
        width: 300px;
        font-size: 1.2rem;
      }
    }

    label.errored {
      color: hsl(0, 100%, 50%);

      input[type="text"],
      input[type="password"] {
        border-color: hsl(0, 100%, 50%);
      }
    }
  }

  input[type="submit"],
  button {
    background: hsl(0, 0%, 19%);
    color: hsl(0,0%,100%);
    padding: 8px 12px;
    border: 1px solid hsl(0, 0%, 7%);
    font-size: 1.2rem;
    border-radius: 3px;

    &:hover {
      background: hsl(0, 0%, 13%)
    }
  }
`;

export { Form };
