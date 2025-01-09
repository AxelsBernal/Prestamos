import styled from 'styled-components';

export const Form = styled.div`
    width: 100%;
    max-width: 500px;
    margin: 30px auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const Input = styled.input`
    width: 100%;
    padding: 12px;
    margin: 8px 0;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    color: #333;
    transition: border 0.3s, box-shadow 0.3s;
    box-sizing: border-box;
  
    &:focus {
        border-color: #3498db;
        box-shadow: 0 0 8px rgba(52, 152, 219, 0.3);
    }
    
    &:disabled {
        background-color: #eaebec
    }
`;
  
export const InputList = styled.input`
    width: 95%;
    padding: 12px;
    margin: 8px 0;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    color: #333;
    transition: border 0.3s, box-shadow 0.3s;
    box-sizing: border-box;
  
    &:focus {
        border-color: #3498db;
        box-shadow: 0 0 8px rgba(52, 152, 219, 0.3);
    }
    
    &:disabled {
        background-color: #eaebec
    }
`;

export const InputGroup = styled.div`
    margin-bottom: 20px;
    text-align: left;
`;

export const InputGroupList = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 10px;
    gap: 5px;
    text-align: left;
    display: flex; /* Habilitar flexbox */
    flex-direction: column;
`;

export const Label = styled.label`
    font-weight: bold;
    color: #333;
    font-size: 14px;
`;

export const Select = styled.select`
    width: 100%;
    padding: 12px;
    margin: 8px 0;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    color: #333;
    transition: border 0.3s, box-shadow 0.3s;
    box-sizing: border-box;
  
    &:focus {
        border-color: #3498db;
        box-shadow: 0 0 8px rgba(52, 152, 219, 0.3);
    }
`;