import styled from 'styled-components';

const Form = styled.form`
  width: 300px;
  margin: 20px auto;

  &.autowidth {
    width: 100%;
  }

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

      select {
        margin-top: 7px;
        border: 1px solid hsl(0, 0%, 19%);
        padding: 8px;
        display: block;
        width: 300px;
        font-size: 1.2rem;
      }

      select.react-datepicker__month-select,
      select.react-datepicker__year-select {
        width: auto;
        padding:4px;
        font-size:1rem;
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
  button[type="submit"] {
    background: hsl(0, 0%, 19%);
    color: hsl(0,0%,100%);
    padding: 8px 12px;
    border: 1px solid hsl(0, 0%, 7%);
    font-size: 1.2rem;
    border-radius: 3px;

    &:hover {
      background: hsl(0, 0%, 13%)
    }

    &:disabled {
      background:hsl(0, 0%, 73%);
      color:hsl(0, 0%, 37%);
      border-color:hsl(0, 0%, 37%);
    }
  }

  .form-field-upload {
    .upload-field {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      width: 100%;
    }

    input[type="file"] {
      position: absolute;
      z-index: -1;
      top: 7px;
      left: 38px;
      font-size: 0.9rem;
      color: hsl(0, 0%, 19%);;
    }

    .button-wrap {
      position: relative;
    }

    label.button {
      background: hsl(0, 0%, 19%);
      color: hsl(0,0%,100%);
      padding: 4px 8px;
      border: 1px solid hsl(0, 0%, 7%);
      font-size: 1.05rem;
      border-radius: 3px;
      display: inline-block;
      cursor: pointer;
      font-weight: normal;
    }

    label {
      font-weight: bold;
      display: block;
      font-size: 1.2rem;
    }

    .image-preview {
      margin:25px 0;

      img {
        max-width:300px;
      }
    }
  }
`;

export { Form };
