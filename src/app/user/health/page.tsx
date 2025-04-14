"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Define types for our data structures
interface BloodPressure {
  systolic: number;
  diastolic: number;
}

interface MetricData {
  current: number | BloodPressure;
  average: number | BloodPressure;
  data: number[] | BloodPressure[];
  unit: string;
}

interface Metrics {
  [key: string]: MetricData;
}

interface Appointment {
  id: number;
  date: string;
  doctor: string;
  type: string;
  status: string;
}

interface Doctor {
  name: string;
  specialty: string;
  experience: string;
  hospital: string;
  contactNumber: string;
  email: string;
  availability: string;
  image: string;
}

interface Hospital {
  name: string;
  address: string;
  contactNumber: string;
  emergencyNumber: string;
  distance: string;
  coordinates: { lat: number; lng: number };
}

interface UserData {
  name: string;
  email: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  bloodType: string;
  emergencyContact: string;
  healthStatus: string;
  metrics: Metrics;
  appointments: Appointment[];
  assignedDoctor: Doctor;
  nearestHospital: Hospital;
}

const UserHealthDashboard = () => {
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "";
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState("heartRate");

  useEffect(() => {
    // Fetch user data from the test.json file
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Fetch data from test.json
        const response = await fetch("/test.json");
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();

        // Set the test data (with the email from URL if provided)
        setUserData({
          ...data,
          email: email || data.email,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [email]);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Function to render basic chart from data
  const renderChart = (data: any[], metricType: string) => {
    const maxValue =
      metricType === "bloodPressure"
        ? Math.max(...data.map((item: BloodPressure) => item.systolic))
        : Math.max(...(data as number[]));

    const minValue =
      metricType === "bloodPressure"
        ? Math.min(...data.map((item: BloodPressure) => item.diastolic))
        : Math.min(...(data as number[]));

    const range = maxValue - minValue + 10;

    return (
      <div className="w-full h-48 mt-4 relative">
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
          <span>{maxValue}</span>
          <span>{minValue}</span>
        </div>
        <div className="absolute left-6 right-0 top-0 h-full">
          <div className="w-full h-full flex items-end">
            {metricType === "bloodPressure"
              ? // Special case for blood pressure
                (data as BloodPressure[]).map((item, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center space-y-1"
                  >
                    <div
                      className="w-2 bg-primary rounded-t"
                      style={{
                        height: `${
                          ((item.systolic - minValue) / range) * 100
                        }%`,
                      }}
                    ></div>
                    <div
                      className="w-2 bg-accent rounded-t"
                      style={{
                        height: `${
                          ((item.diastolic - minValue) / range) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                ))
              : // Standard metrics
                (data as number[]).map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className="w-2 bg-primary rounded-t"
                      style={{
                        height: `${((value - minValue) / range) * 100}%`,
                      }}
                    ></div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-12 w-12 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-4 text-lg text-gray-600">
              Loading your health data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Data Not Found</h2>
            <p className="mt-2 text-gray-600">
              We couldn't find health data for this account.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block px-6 py-2 bg-primary text-white rounded-md"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {userData.name}'s Health Dashboard
                </h1>
                <p className="text-gray-600 mt-1">{userData.email}</p>
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <svg
                    className="mr-1.5 h-2 w-2 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 8 8"
                  >
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                  Health Status: {userData.healthStatus}
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                <p className="text-sm text-gray-600">
                  Age: {userData.age} • Gender: {userData.gender}
                </p>
                <p className="text-sm text-gray-600">
                  Blood Type: {userData.bloodType}
                </p>
                <p className="text-sm text-gray-600">
                  Emergency Contact: {userData.emergencyContact}
                </p>
                <p className="text-sm text-gray-600">
                  Weight: {userData.weight} kg • Height: {userData.height} cm
                </p>
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Health Metrics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {Object.entries(userData.metrics).map(([key, metric]) => (
                <button
                  key={key}
                  className={`p-4 rounded-lg border transition-colors ${
                    activeMetric === key
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-primary/50"
                  }`}
                  onClick={() => setActiveMetric(key)}
                >
                  <p className="text-sm text-gray-500 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <div className="mt-2 flex justify-between items-baseline">
                    <p className="text-2xl font-bold text-gray-900">
                      {key === "bloodPressure"
                        ? `${(metric.current as BloodPressure).systolic}/${
                            (metric.current as BloodPressure).diastolic
                          }`
                        : String(metric.current)}
                    </p>
                    <p className="text-sm text-gray-600">{metric.unit}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Metric Details & Chart */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-col md:flex-row md:justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 capitalize">
                  {activeMetric.replace(/([A-Z])/g, " $1").trim()} History
                </h3>
                <div className="mt-2 md:mt-0">
                  <span className="text-sm text-gray-600 mr-2">Average:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {activeMetric === "bloodPressure"
                      ? `${
                          (
                            userData.metrics[activeMetric]
                              .average as BloodPressure
                          ).systolic
                        }/${
                          (
                            userData.metrics[activeMetric]
                              .average as BloodPressure
                          ).diastolic
                        } ${userData.metrics[activeMetric].unit}`
                      : `${userData.metrics[activeMetric].average} ${userData.metrics[activeMetric].unit}`}
                  </span>
                </div>
              </div>

              {/* Chart */}
              {renderChart(userData.metrics[activeMetric].data, activeMetric)}

              <div className="mt-4 text-center text-xs text-gray-500">
                <p>Last 7 days (or measurements)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Assigned Doctor */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your Doctor
              </h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <div className="flex-shrink-0 w-24 h-24 relative rounded-full overflow-hidden mb-4 sm:mb-0 sm:mr-6">
                  <Image
                    src={userData.assignedDoctor.image}
                    alt={userData.assignedDoctor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {userData.assignedDoctor.name}
                  </h3>
                  <p className="text-gray-600">
                    {userData.assignedDoctor.specialty}
                  </p>
                  <p className="text-gray-600">
                    {userData.assignedDoctor.experience} experience
                  </p>
                  <p className="text-gray-600">
                    {userData.assignedDoctor.hospital}
                  </p>
                  <div className="mt-3 flex space-x-4">
                    <button className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                      Contact Doctor
                    </button>
                    <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                      Schedule Appointment
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600">
                  Available: {userData.assignedDoctor.availability}
                </p>
                <p className="text-sm text-gray-600">
                  Email: {userData.assignedDoctor.email}
                </p>
                <p className="text-sm text-gray-600">
                  Phone: {userData.assignedDoctor.contactNumber}
                </p>
              </div>
            </div>

            {/* Nearest Hospital */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Nearest Hospital
              </h2>
              <div className="mb-4 h-48 bg-gray-200 rounded-md relative">
                {/* This would be a map in a real application */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500">
                    Map showing {userData.nearestHospital.name}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {userData.nearestHospital.name}
                </h3>
                <p className="text-gray-600">
                  {userData.nearestHospital.address}
                </p>
                <p className="text-gray-600">
                  Distance: {userData.nearestHospital.distance}
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">General Line:</span>{" "}
                    {userData.nearestHospital.contactNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Emergency:</span>{" "}
                    {userData.nearestHospital.emergencyNumber}
                  </p>
                </div>
                <div className="mt-4">
                  <button className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/85 transition-colors">
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Appointments
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Doctor
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userData.appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(appointment.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.doctor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appointment.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <button className="text-primary hover:text-primary-dark text-sm">
                View All Appointments →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHealthDashboard;
