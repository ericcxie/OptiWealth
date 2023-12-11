import {
  EmailAuthProvider,
  User,
  deleteUser,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/sidebar";
import { auth } from "../utils/firebase";

import DeleteConfirmationModal from "../components/modal/ConfirmDeleteModal";
import PromptPasswordModal from "../components/modal/PromptPasswordModal";

interface UserData {
  name: string;
  email: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

const Account: React.FC = () => {
  // State declarations
  const [userData, setUserData] = useState<UserData>({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);

  // Firebase related variables
  const user = auth.currentUser;
  const userEmail = user ? user.email : null;
  const displayName = user ? user.displayName : "User";
  const firstName = displayName
    ? displayName.split(" ")[0].toLowerCase()
    : "User";

  // Navigation hook
  const navigate = useNavigate();

  // Event handlers
  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const promptPassword = () => {
    setShowPasswordModal(true);
  };

  const handleAccountDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowPasswordModal(true);
  };

  const handlePasswordDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && user.email) {
      try {
        const credential = EmailAuthProvider.credential(
          user.email,
          passwordData.currentPassword
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, passwordData.newPassword);
        setMessage("Password updated successfully!");
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 10000);
        setPasswordData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
        }));
      } catch (error: any) {
        if (error.code === "auth/wrong-password") {
          setMessage("Incorrect password. Please try again");
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 10000);
          return;
        }

        if (error.code === "auth/weak-password") {
          setMessage("Password should be at least 6 characters");
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 10000);
          return;
        }
      }
    }
  };

  const handleDeleteAccount = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = async (inputValue: string) => {
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

  const handleNameUpdate = async (user: User, name: string) => {
    await updateProfile(user, { displayName: name });
    setMessage("Name updated successfully!");
    setUserData((prev) => ({ ...prev, name: "" }));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 10000);
  };

  const handleEmailUpdate = async (user: User, email: string) => {
    await verifyBeforeUpdateEmail(user, email);
    setMessage("Verification email sent. Please verify your new email");
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 10000);

    await user.reload();
    // Only update email in db if user has verified their new email
    if (user.emailVerified) {
      const response = await fetch("/update-user-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          new_email: email,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update email");
      }
      setMessage("Email updated successfully!");
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 10000);
    }
  };

  const handleConfirmUpdate = async (password: string) => {
    setShowPasswordModal(false);
    if (user && user.email && password) {
      try {
        // Reauthenticate user with provided password
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
        // If name change, update name in firebase
        if (userData.name) {
          await handleNameUpdate(user, userData.name);
        }
        // If email change, update email in firebase & db
        if (userData.email && userData.email !== user.email) {
          try {
            await handleEmailUpdate(user, userData.email);
          } catch (error: unknown) {
            if (
              typeof error === "object" &&
              error !== null &&
              "code" in error
            ) {
              if (error.code === "auth/requires-recent-login") {
                promptPassword();
                return;
              }
            } else {
              console.error(error);
            }
          }
        }
      } catch (error: any) {
        setMessage("Incorrect password. Please try again");
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 10000);
      }
    }
  };

  return (
    <div className="bg-background">
      <SideBar />
      <div className="flex h-screen flex-1 flex-col justify-center md:pl-60">
        <div className="max-w-3xl mx-auto w-full items-center space-y-8 md:space-y-0 flex-col md:flex-row flex md:space-x-8">
          {/* User Details Form */}
          <div className="w-full px-10 md:px-0 md:w-1/2">
            <h1 className="font-inter md:mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-white mb-6">
              Update Account Details
            </h1>
            <form onSubmit={handleAccountDetailsSubmit} className="space-y-6">
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
                  onClick={promptPassword}
                  disabled={!userData.name && !userData.email}
                  className="flex w-full justify-center rounded-md bg-indigo-600 disabled:cursor-not-allowed disabled:brightness-50 disabled:bg-indigo-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Update
                </button>
              </div>
            </form>
          </div>

          {/* Password Update Form */}
          <div className="w-full px-10 md:px-0 md:w-1/2">
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
                  disabled={
                    passwordData.currentPassword === "" ||
                    passwordData.newPassword === ""
                  }
                  className="flex w-full justify-center rounded-md bg-indigo-600 disabled:cursor-not-allowed disabled:brightness-50 disabled:bg-indigo-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
            <div
              className={`mt-4 flex justify-center items-center bg-gray-500 px-4 py-2 rounded-lg text-white`}
            >
              {message}
            </div>
          </div>
        )}
        <DeleteConfirmationModal
          showModal={showModal}
          handleConfirmDelete={handleConfirmDelete}
          handleCloseModal={() => setShowModal(false)}
          firstName={firstName}
        />
        <PromptPasswordModal
          showModal={showPasswordModal}
          handleConfirmUpdate={handleConfirmUpdate}
          handleCloseModal={() => setShowPasswordModal(false)}
        />
      </div>
    </div>
  );
};

export default Account;
