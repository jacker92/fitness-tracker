import styled from 'styled-components';

const AccountPage = styled.div`
    width: 800px;
    margin: 40px auto;
    display: grid;
    grid-template-columns: 1fr 2fr;

    div.sidebar {
        grid-column-start:1;
        grid-column-end:1;
    }

    div.content {
        grid-column-start:2;
        grid-column-end:2;

        h1 {
            margin: 0 0 25px 0;
        }
    }
`;

export { AccountPage };
