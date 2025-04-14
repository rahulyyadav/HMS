"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    bloodType: "",
    allergies: "",
    medications: "",
    medicalConditions: "",
  });

  // Simulate loading profile data
  useEffect(() => {
    // Check if user is authenticated
    if (status === "unauthenticated") {
      router.push("/login/user");
      return;
    }

    // Load profile data after authentication check
    if (status === "authenticated") {
      const timer = setTimeout(() => {
        // Mock profile data
        setProfileData({
          firstName: "John",
          lastName: "Doe",
          email: session?.user?.email || "john.doe@example.com",
          phone: "555-123-4567",
          dateOfBirth: "1985-06-15",
          gender: "Male",
          address: "123 Health St",
          city: "Wellness City",
          state: "Healthy State",
          zipCode: "12345",
          emergencyContactName: "Jane Doe",
          emergencyContactPhone: "555-987-6543",
          bloodType: "O+",
          allergies: "Penicillin, Peanuts",
          medications: "Vitamin D, Omega-3",
          medicalConditions: "None",
        });
        setLoading(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [status, router, session]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate saving profile data
    setLoading(true);
    setTimeout(() => {
      setEditing(false);
      setLoading(false);
    }, 1000);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="pt-20 flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="pt-20 flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
            <p className="text-gray-600">
              {session?.user?.name ||
                profileData.firstName + " " + profileData.lastName}
            </p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1 bg-gray-50 p-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {session?.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="object-cover"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    )}
                  </div>
                  {editing && (
                    <button
                      type="button"
                      aria-label="Upload profile picture"
                      className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <p className="text-gray-500">{profileData.email}</p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Medical Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Blood Type
                    </p>
                    <p className="mt-1 text-sm text-gray-900">
                      {profileData.bloodType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Allergies
                    </p>
                    <p className="mt-1 text-sm text-gray-900">
                      {profileData.allergies}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Medications
                    </p>
                    <p className="mt-1 text-sm text-gray-900">
                      {profileData.medications}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Medical Conditions
                    </p>
                    <p className="mt-1 text-sm text-gray-900">
                      {profileData.medicalConditions}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 p-8">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Personal Information
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Update your personal details.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        First name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={profileData.firstName}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                            !editing ? "bg-gray-100" : ""
                          }`}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={profileData.lastName}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                            !editing ? "bg-gray-100" : ""
                          }`}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email address
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                            !editing ? "bg-gray-100" : ""
                          }`}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone number
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                            !editing ? "bg-gray-100" : ""
                          }`}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="dateOfBirth"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Date of birth
                      </label>
                      <div className="mt-1">
                        <input
                          type="date"
                          name="dateOfBirth"
                          id="dateOfBirth"
                          value={profileData.dateOfBirth}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                            !editing ? "bg-gray-100" : ""
                          }`}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="gender"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Gender
                      </label>
                      <div className="mt-1">
                        <select
                          id="gender"
                          name="gender"
                          value={profileData.gender}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                            !editing ? "bg-gray-100" : ""
                          }`}
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">
                            Prefer not to say
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mt-8">
                      Address
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Street address
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address"
                          id="address"
                          value={profileData.address}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                            !editing ? "bg-gray-100" : ""
                          }`}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        City
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="city"
                          id="city"
                          value={profileData.city}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                            !editing ? "bg-gray-100" : ""
                          }`}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700"
                      >
                        State
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="state"
                          id="state"
                          value={profileData.state}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                            !editing ? "bg-gray-100" : ""
                          }`}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="zipCode"
                        className="block text-sm font-medium text-gray-700"
                      >
                        ZIP / Postal code
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="zipCode"
                          id="zipCode"
                          value={profileData.zipCode}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                            !editing ? "bg-gray-100" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mt-8">
                      Emergency Contact
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="emergencyContactName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Emergency contact name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="emergencyContactName"
                          id="emergencyContactName"
                          value={profileData.emergencyContactName}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                            !editing ? "bg-gray-100" : ""
                          }`}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="emergencyContactPhone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Emergency contact phone
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="emergencyContactPhone"
                          id="emergencyContactPhone"
                          value={profileData.emergencyContactPhone}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                            !editing ? "bg-gray-100" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {editing && (
                    <div className="flex justify-end space-x-3 pt-6">
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
