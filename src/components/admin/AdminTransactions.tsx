
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { CreditCard, Search } from "lucide-react";

interface ITransaction {
  _id: string;
  customer: {
    name: string;
    email: string;
  };
  serviceName: string;
  appointmentDate: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: "paid" | "failed";
  createdAt: string;
}

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const tokenResponse = await authClient.token();
        const token = tokenResponse.data?.token;

        if (!token) throw new Error("Authentication token not found.");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/transactions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) throw new Error(result.message);

        setTransactions(result.data);
      } catch (error) {
        console.error("Transactions Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    const query = search.toLowerCase();

    return (
      transaction.customer?.name?.toLowerCase().includes(query) ||
      transaction.customer?.email?.toLowerCase().includes(query) ||
      transaction.serviceName?.toLowerCase().includes(query) ||
      transaction.stripeSessionId?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-100" />
        <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  return (
    <section>
      <div className="mb-7">
        <p className="text-sm font-medium text-orange-500">
          Payment Management
        </p>
        <h2 className="mt-1 text-2xl font-bold text-gray-900">
          Transactions
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          View all customer payment records.
        </p>
      </div>

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-gray-500">
            Total Transactions
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {transactions.length}
          </p>
        </div>

        <div className="relative w-full sm:max-w-sm">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Service</th>
                <th className="px-5 py-4">Appointment Date</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Session ID</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Transaction Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction._id}
                  className="transition hover:bg-orange-50/30"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-800">
                      {transaction.customer?.name || "Unknown"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {transaction.customer?.email || "N/A"}
                    </p>
                  </td>

                  <td className="px-5 py-4 font-medium text-gray-700">
                    {transaction.serviceName}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {new Date(transaction.appointmentDate).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4 font-semibold text-gray-800">
                    {transaction.amount}{" "}
                    <span className="uppercase text-gray-500">
                      {transaction.currency}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-mono text-xs text-gray-500">
                    {transaction.stripeSessionId
                      ? `${transaction.stripeSessionId.slice(0, 14)}...`
                      : "N/A"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        transaction.status === "paid"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <CreditCard
                      size={32}
                      className="mx-auto mb-3 text-gray-300"
                    />
                    <p className="font-medium text-gray-700">
                      No transactions found
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      Transaction records will appear here.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminTransactions;
