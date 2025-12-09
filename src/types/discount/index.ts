export type DiscountTrigger = "Birthday" | "CompletionPercent" | "FirstPurchase" | "StreakCheckpoint";

export type DiscountType = "Percentage" | "FixedAmount";

export interface DiscountTemplate {
  id: string;
  name: string;
  description: string;
  trigger: DiscountTrigger;
  type: DiscountType;
  value: number;
  isActive: boolean;
  minCompletionPercent: number | null;
  minCheckpointStreak: number | null;
  maxUsesPerUser: number;
  timesTriggered: number;
  totalDiscountGiven: number;
}

// API Response structure
export interface DiscountTemplateListResponse {
  data: DiscountTemplate[];
}

// For backward compatibility
export type DiscountTemplateState = DiscountTemplateListResponse;

export interface DiscountTemplateParams {
  isActive?: boolean | null; // Filter by active status (true/false/null for all)
  trigger?: DiscountTrigger; // Filter by trigger type (optional)
}

// Update discount template request
export interface UpdateDiscountTemplateRequest {
  value: number;
  isActive: boolean;
}

