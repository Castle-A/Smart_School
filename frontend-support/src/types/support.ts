
export type TicketStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TicketType = 'TECHNIQUE' | 'FONCTIONNEL' | 'FACTURATION';

export type Ticket = {
    id: string;
    subject: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    type: TicketType;
    creatorId: string;
    creator?: {
        firstName: string;
        lastName: string;
        email: string;
    };
    schoolId?: string;
    assigneeId?: string;
    createdAt: string;
    updatedAt: string;
}

export type TicketMessage = {
    id: string;
    content: string;
    isInternal: boolean;
    ticketId: string;
    senderId: string;
    createdAt: string;
}

export type UserContext = {
    id: string;
    name: string;
    role: string;
    phone: string;
    email: string;
    school: string;
    isActive: boolean;
}
