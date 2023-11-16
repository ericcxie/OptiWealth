import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/sidebar";
import { auth } from "../utils/firebase";
import {
  getAuth,
  updateEmail,
  updateProfile,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
} from "firebase/auth";

import DeleteConfirmationModal from "../components/ui/ConfirmDeleteModal";

interface UserData {
  name: string;
  email: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

const Account: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({ name: "", email: "" });
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
  });
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const user = auth.currentUser;
  const userEmail = user ? user.email : null;
  const displayName = user ? user.displayName : "User";
  const firstName = displayName
    ? displayName.split(" ")[0].toLowerCase()
    : "User";
  const [showModal, setShowModal] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching user data for:", userEmail);
    console.log("User display name:", displayName);
  }, [userEmail]);

  console.log("User data:", userData.email);

  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      try {
        // Update the user's name and email in Firebase
        if (userData.name) {
          await updateProfile(user, { displayName: userData.name });
        }
        if (userData.email) {
          await updateEmail(user, userData.email);

          const response = await fetch("/update-user-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: userEmail,
              new_email: userData.email,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to update email");
          }
        }

        // Update the user's name and email in the local state
        setUserData((prev) => ({
          ...prev,
          name: userData.name || prev.name,
          email: userData.email || prev.email,
        }));

        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handlePasswordDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      try {
        await updatePassword(user, passwordData.newPassword);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteAccount = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = async (inputValue: string) => {
    console.log("Input value:", inputValue);
    if (user && inputValue === `${firstName}/confirm-delete`) {
      try {
        await deleteUser(user);

        const response = await fetch("/delete-account", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete account");
        }

        setShowModal(false);
        navigate("/");
      } catch (error) {
        console.error(error);
      }
    } else {
      // Show an error message
      console.error("Failed to confirm deletion");
    }
  };

  return (
    <div className="bg-background">
      <SideBar />
      <div className="flex h-screen flex-1 flex-col justify-center pl-60">
        <div className="max-w-3xl mx-auto w-full flex space-x-8">
          {/* User Details Form */}
          <div className="w-1/2">
            <h1 className="font-inter mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-white mb-6">
              Update Account Details
            </h1>
            <form onSubmit={handleUserDataSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium leading-6 text-white"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleUserDataChange}
                  placeholder={displayName ?? ""}
                  className="pl-2 block w-full rounded-md border-0 py-1.5 bg-[#212834] text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="space-y-2">
                <label
                  className="block text-sm font-medium leading-6 text-white"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleUserDataChange}
                  placeholder={userEmail ?? ""}
                  className="pl-2 block w-full rounded-md border-0 py-1.5 bg-[#212834] text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={!userData.name && !userData.email}
                  className="flex w-full justify-center rounded-md bg-indigo-600 disabled:cursor-not-allowed disabled:brightness-50 disabled:bg-indigo-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Update
                </button>
              </div>
            </form>
          </div>

          {/* Password Update Form */}
          <div className="w-1/2">
            <h1 className="font-inter mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-white mb-6">
              Change Password
            </h1>
            <form onSubmit={handlePasswordDataSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium leading-6 text-white"
                  htmlFor="currentPassword"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordDataChange}
                  className="pl-2 block w-full rounded-md border-0 py-1.5 bg-[#212834] text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  className="block text-sm font-medium leading-6 text-white"
                  htmlFor="newPassword"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordDataChange}
                  className="pl-2 block w-full rounded-md border-0 py-1.5 bg-[#212834] text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-4 flex justify-center items-center w-full">
          <button
            onClick={handleDeleteAccount}
            className="flex w-72 mt-2 justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Delete Account
          </button>
        </div>

        {isSaved && (
          <div className="mt-4 flex justify-center items-center">
            <div className="bg-green-400 p-4 rounded-lg text-white">
              Changes Saved Successfully!
            </div>
          </div>
        )}
        <DeleteConfirmationModal
          showModal={showModal}
          handleConfirmDelete={handleConfirmDelete}
          handleCloseModal={() => setShowModal(false)}
          firstName={firstName}
        />
      </div>
    </div>
  );
};

export default Account;
