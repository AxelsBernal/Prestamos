import styled from 'styled-components';

export const ModalContainer = styled.div`
    position: relative;
`;

export const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    overflow-y: auto;
`;

export const ModalContent = styled.div`
    max-height: 90vh;
    max-width: 90vw;
    overflow-y: auto;
    overflow-x: hidden;
    background: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
`;