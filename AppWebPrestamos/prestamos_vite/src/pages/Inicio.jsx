import React, { useEffect, useState } from "react";
import axios from "axios";
import "./inicio.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Inicio() {
  document.title = "CdP - Inicio";

  const [prestamosTotales, setPrestamosTotales] = useState(0);
  const [capital, setCapital] = useState(0);
  const [ganancias, setGanancias] = useState(0);

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REST_API_PRESTAMOS}/resumen/prestamos`
        );

        const { totalPrestamos, totalCapital, totalGanancias } = response.data;

        setPrestamosTotales(totalPrestamos);
        setCapital(totalCapital);
        setGanancias(totalGanancias);
      } catch (error) {
        console.error("Error al obtener los datos del resumen:", error);
      }
    };

    fetchResumen();
  }, []);

  // Datos para el gráfico
  const chartData = [
    { label: "Capital", value: capital },
    { label: "Ganancias", value: ganancias },
  ];

  return (
    <div className="inicio-container">
      <h1 className="inicio-title">Resumen General</h1>
      <div className="cards-container">
        <div className="info-card">
          <h2>Préstamos Totales</h2>
          <p>{prestamosTotales}</p>
        </div>
        <div className="info-card">
          <h2>Capital Total</h2>
          <p>${capital.toFixed(2)}</p>
        </div>
        <div className="info-card">
          <h2>Ganancias Totales</h2>
          <p>${ganancias.toFixed(2)}</p>
        </div>
      </div>
      <div className="chart-container">
        <h2>Gráfico de Barras</h2>
        <ResponsiveContainer width="95%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
