
export interface IAppointment {
    _id: string;
    serviceId: string;
    customerId: string;
    appointmentDate: string;
    timeSlot: string;
    message?: string;
    servicePrice: number;
    paymentStatus: 'unpaid' | 'paid';
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: string;
}

export interface IAppointmentWithDetails extends IAppointment {
    customer: {
        name: string;
        email: string;
        image: string | null;
    };
    service: {
        serviceName: string;
        category: string;
        image: string;
    };
}