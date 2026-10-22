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

import {
  Users as UsersIcon,
  UserPlus,
  Pencil,
  Trash2,
  X,
  Search,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  UsersRound,
  CheckCircle2,
  XCircle,
  KeyRound,
  UserCog,
  Plus,
} from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase().trim();

    return (
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.phone_number.toLowerCase().includes(search) ||
      user.role.toLowerCase().includes(search)
    );
  });

  const adminCount = users.filter(
    (user) => user.role.toLowerCase() === "admin"
  ).length;

  const customerCount = users.filter(
    (user) => user.role.toLowerCase() === "customer"
  ).length;

  const activeCount = users.filter((user) => user.is_active).length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 lg:p-10">
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="mx-auto max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 p-6 shadow-xl shadow-blue-950/10 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 right-1/3 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-100">
                <ShieldCheck size={14} />
                Administration
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                User Management
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100/75 sm:text-base">
                Manage system accounts, contact information, access roles, and
                user status from one place.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-blue-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              <UserPlus size={18} />
              Add User
            </button>
          </div>

          <div className="relative mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-100/75">Total Users</p>
                <UsersRound size={18} className="text-blue-200" />
              </div>
              <p className="mt-3 text-3xl font-bold text-white">{users.length}</p>
              <p className="mt-1 text-xs text-blue-100/60">Registered accounts</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-100/75">Administrators</p>
                <ShieldCheck size={18} className="text-violet-200" />
              </div>
              <p className="mt-3 text-3xl font-bold text-white">{adminCount}</p>
              <p className="mt-1 text-xs text-blue-100/60">Admin accounts</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-100/75">Customers</p>
                <UserRound size={18} className="text-cyan-200" />
              </div>
              <p className="mt-3 text-3xl font-bold text-white">
                {customerCount}
              </p>
              <p className="mt-1 text-xs text-blue-100/60">Customer accounts</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-100/75">Active</p>
                <CheckCircle2 size={18} className="text-emerald-200" />
              </div>
              <p className="mt-3 text-3xl font-bold text-white">{activeCount}</p>
              <p className="mt-1 text-xs text-blue-100/60">Active accounts</p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                User Directory
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Browse and manage registered users.
              </p>
            </div>

            <div className="relative w-full md:max-w-sm">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name, email, phone, or role..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 px-5 py-3.5 sm:px-6">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filteredUsers.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {users.length}
              </span>{" "}
              users
            </p>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {activeCount} active
              <span className="mx-1 text-slate-300">|</span>
              <span className="h-2 w-2 rounded-full bg-red-400" />
              {users.length - activeCount} inactive
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-slate-200 bg-white">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Contact Information
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Account Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const isAdmin = user.role.toLowerCase() === "admin";

                  return (
                    <tr
                      key={user.id}
                      className="group transition hover:bg-blue-50/40"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                              isAdmin
                                ? "bg-violet-100 text-violet-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {user.first_name.charAt(0).toUpperCase()}
                            {user.last_name.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              ID: {user.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <Mail
                              size={15}
                              className="shrink-0 text-slate-400"
                            />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Phone
                              size={15}
                              className="shrink-0 text-slate-400"
                            />
                            <span>{user.phone_number || "No phone provided"}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                            isAdmin
                              ? "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200"
                              : "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200"
                          }`}
                        >
                          {isAdmin ? (
                            <ShieldCheck size={13} />
                          ) : (
                            <UserRound size={13} />
                          )}
                          {isAdmin ? "Administrator" : "Customer"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                            user.is_active
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
                              : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200"
                          }`}
                        >
                          {user.is_active ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <XCircle size={14} />
                          )}
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(user)}
                            title="Edit user"
                            aria-label={`Edit ${user.first_name} ${user.last_name}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(user.id)}
                            title="Delete user"
                            aria-label={`Delete ${user.first_name} ${user.last_name}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <UsersIcon size={26} />
                      </div>
                      <p className="mt-4 font-semibold text-slate-700">
                        {searchTerm ? "No matching users" : "No users found"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {searchTerm
                          ? "Try adjusting your search terms."
                          : "Users will appear here once they have been created."}
                      </p>
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={() => setSearchTerm("")}
                          className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800"
                        >
                          Clear search
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <div className="my-6 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 px-6 py-6 sm:px-8">
              <div className="pointer-events-none absolute -right-8 -top-16 h-40 w-40 rounded-full bg-blue-400/20 blur-2xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-blue-100">
                    {editingUser ? (
                      <UserCog size={20} />
                    ) : (
                      <UserPlus size={20} />
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-white sm:text-2xl">
                    {editingUser ? "Edit User" : "Create User"}
                  </h2>
                  <p className="mt-1 text-sm text-blue-100/75">
                    {editingUser
                      ? "Update the user's account information."
                      : "Add a new account to the system."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  aria-label="Close form"
                  className="rounded-xl border border-white/10 bg-white/10 p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <UserRound size={16} className="text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      required
                      autoComplete="given-name"
                      placeholder="Enter first name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      required
                      autoComplete="family-name"
                      placeholder="Enter last name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <div className="mb-3 flex items-center gap-2">
                  <Mail size={16} className="text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Contact Information
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      autoComplete="email"
                      placeholder="user@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(event) => setPhoneNumber(event.target.value)}
                        required
                        autoComplete="tel"
                        placeholder="Enter phone number"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        {editingUser ? "New Password" : "Password"}
                      </label>
                      <div className="relative">
                        <KeyRound
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type="password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          required={!editingUser}
                          autoComplete={
                            editingUser ? "new-password" : "new-password"
                          }
                          placeholder={
                            editingUser
                              ? "Leave blank if unchanged"
                              : "Create a password"
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>
                      {editingUser && (
                        <p className="mt-1.5 text-xs text-slate-400">
                          Leave blank if you do not want to change the password.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Access Permissions
                  </h3>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Account Role
                  </label>
                  <select
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                  <p className="mt-1.5 text-xs text-slate-400">
                    The role determines the user's access permissions.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700"
                >
                  {editingUser ? <Pencil size={16} /> : <Plus size={17} />}
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