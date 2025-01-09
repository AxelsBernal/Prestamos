import styled from 'styled-components';

export const DropdownList = styled.ul`
    position: relative;
    top: 100%;
    left: 0;
    margin: 0;
    padding: 0;
    list-style: none;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    width: 700px;
    margin-bottom: 20px;
`;
  
export const Li = styled.li`
    padding: 10px 15px;
    cursor: pointer;
    border-bottom: 1px solid #ddd;

    &:hover {
        background-color: #f0f0f0;
    }
`;

export const DropdownListInput = styled.ul`
    position: relative;
    top: 100%;
    left: 0;
    margin: 0;
    padding: 0;
    list-style: none;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    width: 400px;
    margin-bottom: 20px;
`;
  
export const LiInput = styled.li`
    padding: 10px 15px;
    cursor: pointer;
    border-bottom: 1px solid #ddd;

    &:hover{
        background-color: #f0f0f0;
    }
`;