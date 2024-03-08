type ItemType = "consumable" | "expiration" | "permanent" | "lootboxes" | "physical";
type VirtualItemType = "consumable" | "non_consumable" | "non_renewing_subscription";
type OrderStatus = "new" | "paid" | "done" | "cancelled";

export interface VirtualItem {
    item_id: string;
    sku: string;
    name: string;
    type?: ItemType;
    description: string;
    image_url?: string;
    price: {
        amount: string;
        amount_without_discount?: string;
        currency: string;
    },
    virtual_item_type?: VirtualItemType;
    [key: string]: any;
}

export interface VirtualItemsList {
    has_more: boolean;
    items: VirtualItem[];
}

export interface InventoryItem {
    sku: string;
    name: string;
    type?: ItemType;
    description: string;
    image_url?: string;
    quantity?: number | null;
    remaining_uses?: number | null;
    virtual_item_type?: VirtualItemType;
}

export interface InventoryItemList {
    items: InventoryItem[];
}

export interface GetOrderOptions {
    projectId: number,
    token: string,
    orderId: string
}

export interface Order {
    order_id: string;
    status: OrderStatus;
}

export interface OrderRequestBody {
    sandbox: boolean;
    quantity: number;
    promo_code?: string;
    settings?: {
        ui?: {
            theme?: string;
            desktop?: {
                header?: {
                    is_visible?: boolean;
                    visible_logo?: boolean;
                    visible_name?: boolean;
                    visible_purchase?: boolean;
                    type?: "normal" | "compact";
                    close_button?: boolean;
                }
            };
            mode?: "user_account";
        };
        payment_method?: number;
        return_url?: string;
        redirect_policy?: {
            redirect_conditions?: string,
            delay?: number,
            status_for_manual_redirection?: string
        }
    };
    custom_parameters?: {
        [key: string]: any;
    };
}

export interface CreateOrderWithSpecifiedItemOptions extends OrderRequestBody {
    projectId: number;
    token: string;
    sku: string;
}

export interface OrderResponse {
    order_id: number;
    token: string;
}

export interface ConsumeRequestBody {
    sku: string;
    quantity: number;
}

export interface ConsumeItemOptions extends ConsumeRequestBody {
    projectId: number;
    // platform: "xsolla";
    token: string;
}