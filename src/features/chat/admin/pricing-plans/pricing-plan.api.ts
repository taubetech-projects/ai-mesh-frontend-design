// api/admin-pricing-plan.api.ts
import {
  PlanView,
  PlanCreateRequest,
  PlanUpdateRequest,
} from "./pricing-plan.types";
import { chatProxyApi } from "@/lib/api/axiosApi";

const BASE_URL = "/v1/api/chat/admin/plans";

export class AdminPricingPlanApi {
  static async listPlans(): Promise<PlanView[]> {
    const res = await chatProxyApi.get<PlanView[]>(BASE_URL);
    return res.data;
  }

  static async getPlan(id: string): Promise<PlanView> {
    const res = await chatProxyApi.get<PlanView>(`${BASE_URL}/${id}`);
    return res.data;
  }

  static async createPlan(req: PlanCreateRequest): Promise<PlanView> {
    const res = await chatProxyApi.post<PlanView>(BASE_URL, req);
    return res.data;
  }

  static async updatePlan(
    id: string,
    req: PlanUpdateRequest
  ): Promise<PlanView> {
    const res = await chatProxyApi.put<PlanView>(`${BASE_URL}/${id}`, req);
    return res.data;
  }

  static async deletePlan(id: string): Promise<void> {
    await chatProxyApi.delete(`${BASE_URL}/${id}`);
  }
}
