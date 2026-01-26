// api/plan-billing-option.api.ts
import { chatProxyApi } from "@/lib/api/axiosApi";
import {
  PlanBillingOption,
  PlanBillingOptionCreateRequest,
  PlanBillingOptionUpdateRequest,
} from "./plan-billing.types";

const BASE_URL = "/v1/api/chat/admin/plan-billing-options";

export class PlanBillingOptionApi {
  static async list(): Promise<PlanBillingOption[]> {
    const res = await chatProxyApi.get<PlanBillingOption[]>(BASE_URL);
    return res.data;
  }

  static async get(id: string): Promise<PlanBillingOption> {
    const res = await chatProxyApi.get<PlanBillingOption>(`${BASE_URL}/${id}`);
    return res.data;
  }

  static async create(
    payload: PlanBillingOptionCreateRequest
  ): Promise<PlanBillingOption> {
    const res = await chatProxyApi.post<PlanBillingOption>(BASE_URL, payload);
    return res.data;
  }

  static async update(
    id: string,
    payload: PlanBillingOptionUpdateRequest
  ): Promise<PlanBillingOption> {
    const res = await chatProxyApi.put<PlanBillingOption>(
      `${BASE_URL}/${id}`,
      payload
    );
    return res.data;
  }

  static async delete(id: string): Promise<void> {
    await chatProxyApi.delete(`${BASE_URL}/${id}`);
  }
}
