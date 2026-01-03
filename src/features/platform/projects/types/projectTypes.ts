export interface CreateProjectRequest {
    name: string;
    description: string;
}

export interface ProjectResponse{
    id: string;
    name: string;
    description: string;
    ownerUserId: string;
    createdAt: string;
    lastActivity: string;
}

export interface Project{
    id: string;
    name: string;
    description: string;
    apiKeys: number;
    members: number;
    createdAt: string;
    lastActivity: string;
}

export interface ProjectUpdateRequest{
    name: string;
    description: string;
}