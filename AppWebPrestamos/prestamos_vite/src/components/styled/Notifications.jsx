import styled from 'styled-components';
import { toast } from "react-toastify";

export const AlertaInformacion = (mensaje) => {
    toast(mensaje, {
        style:{
            background: 'darkblue',
            color: '#fff',
            fontSize: '18px',
            padding: '5px 10px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            top: '5px',
            textAlign: 'center',
            wordWrap: 'break-word',
            maxWidth: '90vw'
        },
        autoClose:3000,
        closeOnClick:true
    });
};

export const AlertaCorrecto = (mensaje) => {
    toast(mensaje, {
        style:{
            background: 'darkgreen',
            color: '#fff',
            fontSize: '18px',
            padding: '5px 10px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            top: '5px',
            textAlign: 'center',
            wordWrap: 'break-word',
            maxWidth: '90vw'
        },
        autoClose:3000,
        closeOnClick:true
    });
};

export const AlertaAdvertencia = (mensaje) => {
    toast(mensaje, {
        style:{
            background: 'darkgoldenrod',
            color: '#fff',
            fontSize: '18px',
            padding: '5px 10px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            top: '5px',
            textAlign: 'center',
            wordWrap: 'break-word',
            maxWidth: '90vw'
        },
        autoClose:3000,
        closeOnClick:true
    });
};

export const AlertaIncorrecto = (mensaje) => {
    toast(mensaje, {
        style:{
            background: 'darkred',
            color: '#fff',
            fontSize: '18px',
            padding: '5px 10px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            top: '5px',
            textAlign: 'center',
            wordWrap: 'break-word',
            maxWidth: '90vw'
        },
        autoClose:3000,
        closeOnClick:true
    });
};