
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Eye,
  Ban,
  CheckCircle,
  X,
  Loader2,
  Users,
} from "lucide-react";

interface IUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  isBlocked?: boolean;
  createdAt: string;
  appointmentsCount?: number;
}

interface IUsersResponse {
  success: boolean;
  message: string;
  users: IUser[];
}

const AdminManageUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [confirmUser, setConfirmUser] = useState<IUser | null>(null);
  const [updating, setUpdating] = useState(false);

  // Fetch all customers
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
          throw new Error("Authentication token not found.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users`,
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
            cache: "no-store",
          }
        );

        const result: IUsersResponse = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch users.");
        }

        setUsers(result.users);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Block / Unblock customer
  const handleUpdateStatus = async () => {
    if (!confirmUser) return;

    setUpdating(true);

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Authentication token not found.");
      }

      const newBlockedStatus = !confirmUser.isBlocked;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${confirmUser._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            isBlocked: newBlockedStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update user.");
      }

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user._id === confirmUser._id
            ? { ...user, isBlocked: newBlockedStatus }
            : user
        )
      );

      if (selectedUser?._id === confirmUser._id) {
        setSelectedUser({
          ...selectedUser,
          isBlocked: newBlockedStatus,
        });
      }

      toast.success(result.message);
      setConfirmUser(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#000099]">
          Customers
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-gray-900">
          Customer Directory
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          View registered customers and manage their account access.
        </p>
      </div>

      {/* Customer Table */}
      <div className="overflow-x-auto border border-gray-200 bg-white">
        <table className="w-full min-w-[850px] text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr className="text-xs uppercase tracking-wider text-gray-500">
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Joined</th>
              <th className="px-5 py-4">Appointments</th>
              <th className="px-5 py-4">Account</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <Loader2
                    className="mx-auto animate-spin text-[#000099]"
                    size={28}
                  />
                  <p className="mt-3 text-sm text-gray-500">
                    Loading customers...
                  </p>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <Users className="mx-auto text-gray-400" size={32} />
                  <p className="mt-3 text-sm text-gray-500">
                    No registered customers found.
                  </p>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  {/* Customer */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="h-10 w-10 border border-gray-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center bg-gray-100 font-semibold text-gray-600">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <p className="font-medium text-gray-900">
                        {user.name}
                      </p>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {user.email}
                  </td>

                  {/* Joined */}
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  {/* Appointments */}
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {user.appointmentsCount ?? 0}
                  </td>

                  {/* Account Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium ${
                        user.isBlocked
                          ? "bg-red-50 text-red-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 bg-current" />
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-[#000099] hover:bg-blue-50"
                      >
                        <Eye size={15} />
                        View
                      </button>

                      <button
                        onClick={() => setConfirmUser(user)}
                        className={`flex items-center gap-1 border px-3 py-2 text-sm ${
                          user.isBlocked
                            ? "border-green-200 text-green-700 hover:bg-green-50"
                            : "border-red-200 text-red-600 hover:bg-red-50"
                        }`}
                      >
                        {user.isBlocked ? (
                          <CheckCircle size={15} />
                        ) : (
                          <Ban size={15} />
                        )}

                        {user.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Customer Details
              </h2>

              <button onClick={() => setSelectedUser(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 text-center">
              {selectedUser.image ? (
                <img
                  src={selectedUser.image}
                  alt={selectedUser.name}
                  className="mx-auto h-20 w-20 border border-gray-200 object-cover"
                />
              ) : (
                <div className="mx-auto flex h-20 w-20 items-center justify-center bg-gray-100 text-2xl font-semibold text-gray-600">
                  {selectedUser.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <h3 className="mt-3 text-lg font-semibold">
                {selectedUser.name}
              </h3>

              <p className="text-sm text-gray-500">
                {selectedUser.email}
              </p>
            </div>

            <div className="mt-6 space-y-4 border-t border-gray-200 pt-5 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Joined</span>
                <span>
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Appointments</span>
                <span>{selectedUser.appointmentsCount ?? 0}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Account Status</span>
                <span
                  className={
                    selectedUser.isBlocked
                      ? "font-medium text-red-600"
                      : "font-medium text-green-600"
                  }
                >
                  {selectedUser.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Block / Unblock Confirmation */}
      {confirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {confirmUser.isBlocked ? "Unblock Customer?" : "Block Customer?"}
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              {confirmUser.isBlocked
                ? `Are you sure you want to restore access for ${confirmUser.name}?`
                : `Are you sure you want to block ${confirmUser.name}? They will lose access to protected platform features.`}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmUser(null)}
                disabled={updating}
                className="border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateStatus}
                disabled={updating}
                className={`flex items-center gap-2 px-4 py-2 text-sm text-white disabled:opacity-60 ${
                  confirmUser.isBlocked
                    ? "bg-green-700 hover:bg-green-800"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {updating && (
                  <Loader2 size={15} className="animate-spin" />
                )}

                {confirmUser.isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageUsers;