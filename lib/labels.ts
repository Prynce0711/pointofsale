export const PRODUCT_CATEGORIES = [
  "COFFEE",
  "MILK_TEA",
  "FRAPPE",
  "NON_COFFEE",
  "FOOD_PASTRY",
  "COFFEE_BEANS",
  "MILK",
  "SYRUP",
  "CUPS",
  "LIDS",
  "STRAWS",
  "PASTRIES",
  "ADD_ON",
  "OTHER_INGREDIENT",
  "SUPPLY",
] as const;

export const PRODUCT_SIZES = [
  "NOT_APPLICABLE",
  "SMALL",
  "MEDIUM",
  "LARGE",
] as const;

export const TEMPERATURE_OPTIONS = [
  "NOT_APPLICABLE",
  "HOT",
  "ICED",
] as const;

export const ORDER_TYPES = ["DINE_IN", "TAKE_OUT"] as const;

export const STOCK_LOG_TYPES = [
  "STOCK_IN",
  "STOCK_OUT",
  "ADJUSTMENT",
] as const;

export const EMPLOYEE_ROLES = [
  "BARISTA",
  "CASHIER",
  "STAFF",
  "MANAGER",
] as const;

export const EMPLOYEE_STATUSES = ["ACTIVE", "INACTIVE"] as const;

export const DRINK_CATEGORIES = [
  "COFFEE",
  "MILK_TEA",
  "FRAPPE",
  "NON_COFFEE",
] as const;

export type ProductCategoryValue = (typeof PRODUCT_CATEGORIES)[number];
export type ProductSizeValue = (typeof PRODUCT_SIZES)[number];
export type TemperatureValue = (typeof TEMPERATURE_OPTIONS)[number];
export type OrderTypeValue = (typeof ORDER_TYPES)[number];
export type StockLogTypeValue = (typeof STOCK_LOG_TYPES)[number];
export type EmployeeRoleValue = (typeof EMPLOYEE_ROLES)[number];
export type EmployeeStatusValue = (typeof EMPLOYEE_STATUSES)[number];

export const productCategoryLabels: Record<ProductCategoryValue, string> = {
  COFFEE: "Coffee",
  MILK_TEA: "Milk tea",
  FRAPPE: "Frappe",
  NON_COFFEE: "Non-coffee",
  FOOD_PASTRY: "Food and pastries",
  COFFEE_BEANS: "Coffee beans",
  MILK: "Milk",
  SYRUP: "Syrups",
  CUPS: "Cups",
  LIDS: "Lids",
  STRAWS: "Straws",
  PASTRIES: "Pastries",
  ADD_ON: "Add-ons",
  OTHER_INGREDIENT: "Other ingredients",
  SUPPLY: "Supplies",
};

export const productSizeLabels: Record<ProductSizeValue, string> = {
  NOT_APPLICABLE: "N/A",
  SMALL: "Small",
  MEDIUM: "Medium",
  LARGE: "Large",
};

export const temperatureLabels: Record<TemperatureValue, string> = {
  NOT_APPLICABLE: "N/A",
  HOT: "Hot",
  ICED: "Iced",
};

export const orderTypeLabels: Record<OrderTypeValue, string> = {
  DINE_IN: "Dine-in",
  TAKE_OUT: "Take-out",
};

export const stockLogTypeLabels: Record<StockLogTypeValue | "SALE", string> = {
  STOCK_IN: "Stock in",
  STOCK_OUT: "Stock out",
  ADJUSTMENT: "Adjustment",
  SALE: "Sale",
};

export const employeeRoleLabels: Record<EmployeeRoleValue, string> = {
  BARISTA: "Barista",
  CASHIER: "Cashier",
  STAFF: "Staff",
  MANAGER: "Manager",
};

export const employeeStatusLabels: Record<EmployeeStatusValue, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

export function isDrinkCategory(category: string) {
  return DRINK_CATEGORIES.includes(category as (typeof DRINK_CATEGORIES)[number]);
}

