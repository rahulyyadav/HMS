"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

interface SensorData {
  heartRate: number;
  spo2: number;
  temperature: number;
  breathingRate: number;
  timestamp: string;
}

export default function StatisticsPage() {
  const [data, setData] = useState<SensorData>({
    heartRate: 0,
    spo2: 0,
    temperature: 0,
    breathingRate: 0,
    timestamp: new Date().toISOString(),
  });
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8765");

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
      setConnectionStatus("connected");
    };

    socket.onmessage = (event) => {
      try {
        const rawData = event.data;
        // Parse the data from the format: "HR:72,SPO2:98,TEMP:36.5,BR:16"
        const parsedData = rawData
          .split(",")
          .reduce((acc: any, item: string) => {
            const [key, value] = item.split(":");
            acc[key.toLowerCase()] = parseFloat(value);
            return acc;
          }, {});

        setData({
          heartRate: parsedData.hr || 0,
          spo2: parsedData.spo2 || 0,
          temperature: parsedData.temp || 0,
          breathingRate: parsedData.br || 0,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error parsing sensor data:", error);
      }
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket server");
      setConnectionStatus("disconnected");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("error");
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Real-time Health Statistics
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Live monitoring of vital signs from Bluetooth sensors
            </p>
            <div className="mt-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  connectionStatus === "connected"
                    ? "bg-green-100 text-green-800"
                    : connectionStatus === "error"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {connectionStatus === "connected"
                  ? "Connected"
                  : connectionStatus === "error"
                  ? "Connection Error"
                  : "Disconnected"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Heart Rate Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Heart Rate
                </h3>
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-bold text-gray-900">
                  {data.heartRate}
                </p>
                <p className="text-sm text-gray-500">beats per minute</p>
              </div>
            </div>

            {/* SpO2 Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">SpO2</h3>
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-bold text-gray-900">{data.spo2}%</p>
                <p className="text-sm text-gray-500">oxygen saturation</p>
              </div>
            </div>

            {/* Temperature Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Temperature
                </h3>
                <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></div>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-bold text-gray-900">
                  {data.temperature}°C
                </p>
                <p className="text-sm text-gray-500">body temperature</p>
              </div>
            </div>

            {/* Breathing Rate Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Breathing Rate
                </h3>
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-bold text-gray-900">
                  {data.breathingRate}
                </p>
                <p className="text-sm text-gray-500">breaths per minute</p>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="mt-8 text-center text-sm text-gray-500">
            Last updated: {new Date(data.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}
