import React, { useState } from "react";
import './NavBar.css';

export default function NavBar( {onSwitchView} ){
    const [selected,setSelected] = useState('productos')

    return(
        <div>
            <div className="navbar">
                <button onClick={() => onSwitchView('productos')}>PRODUCTOS</button>
                <button onClick={() => onSwitchView('ventas')}>VENTAS</button>
            </div>
        </div>
    );
};