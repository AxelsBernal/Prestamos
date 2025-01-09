import styled from 'styled-components';

export const TablaVentas = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;
`;

export const Tabla = styled.table`
    border-collapse: collapse;
    width: 80%;
    text-align: left;
    font-family: Arial, sans-serif;
    margin-bottom: 10px;
`;

export const Th = styled.th`
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
    background-color: #4CAF50;
    color: white;
    text-align: center;
`;

export const Td = styled.td`
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
`;

export const Tr = styled.tr`
    &:nth-child(even){
        background-color: #f2f2f2;
    }
    
    &:hover{
        background-color: #ddd;
    }
`;