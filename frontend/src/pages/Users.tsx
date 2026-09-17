import { useEffect, useState } from "react";
import axios from "axios";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/users";

import type { User, UserRequest } from "../api/users";
import Notification from "../components/Notification";
import ConfirmationModal from "../components/ConfirmationModal";

function Users() {
  const [users, setUsers] = useState<User[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("customer");

  const [notification, setNotification] = useState<string | null>(null);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateForm = () => {
    setEditingUser(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setPhoneNumber("");
    setRole("customer");
    setShowForm(true);
  };

  const openEditForm = (user: User) => {
    setEditingUser(user);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setEmail(user.email);
    setPassword("");
    setPhoneNumber(user.phone_number);
    setRole(user.role);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const userData: UserRequest = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      phone_number: phoneNumber,
      role,
    };

    try {
      if (editingUser) {
        await updateUser(editingUser.id, userData);
      } else {
        await createUser(userData);
      }

      closeForm();
      await loadUsers();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.detail || "Unable to complete the action.";

        setNotification(message);
      } else {
        setNotification("Unable to complete the action.");
      }
    }
  };

  const handleDelete = (userId: string) => {
    setItemToDelete(userId);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) {
      return;
    }

    try {
      await deleteUser(itemToDelete);
      await loadUsers();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.detail || "Unable to delete the user.";

        setNotification(message);
      } else {
        setNotification("Unable to delete the user.");
      }
    } finally {
      setShowConfirmation(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setItemToDelete(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">

      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Users
            </h1>

            <p className="text-slate-500 mt-1">
              Manage system users and their roles.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition"
          >
            + Add User
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Name
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Email
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Phone
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Role
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4 text-slate-800 font-medium">
                      {user.first_name} {user.last_name}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {user.email}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {user.phone_number}
                    </td>

                    <td className="px-6 py-4">
                      <span className="capitalize text-sm font-medium text-slate-700">
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={
                          user.is_active
                            ? "text-sm font-medium text-green-600"
                            : "text-sm font-medium text-red-600"
                        }
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-3">

                        <button
                          type="button"
                          onClick={() => openEditForm(user)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-40">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {editingUser ? "Edit User" : "Add User"}
              </h2>

              <button
                type="button"
                onClick={closeForm}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    First Name
                  </label>

                  <input
                    type="text"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Last Name
                  </label>

                  <input
                    type="text"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required={!editingUser}
                  placeholder={editingUser ? "Enter new password" : ""}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone Number
                </label>

                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role
                </label>

                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">

                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  {editingUser ? "Update User" : "Create User"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {showConfirmation && (
        <ConfirmationModal
          message="Are you sure you want to delete this user?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

    </div>
  );
}

export default Users;