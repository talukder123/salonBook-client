import React from "react";
import AddServiceForm from "@/components/dashboard/admin/services/addServiceForm";

const AdminAddServicesPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0B1F54]">
        Add New Service
      </h1>

      <AddServiceForm />
    </div>
  );
};

export default AdminAddServicesPage;