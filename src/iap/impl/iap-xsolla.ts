import { API_URL, WORTAL_API, API_ENDPOINTS } from "../../data/core-data";
import { notSupported, invalidOperation, operationFailed } from "../../errors/error-handler";
import Wortal from "../../index";
import { IAPBase } from "../iap-base";
import { Product } from "../interfaces/product";
import { Purchase } from "../interfaces/purchase";
import { PurchaseConfig } from "../interfaces/purchase-config";
import { SubscribableProduct } from "../interfaces/subscribable-product";
import { Subscription } from "../interfaces/subscription";
import type { VirtualItemsList, VirtualItem, InventoryItemList, InventoryItem, CreateOrderWithSpecifiedItemOptions, Order, GetOrderOptions, OrderResponse, ConsumeItemOptions } from "../interfaces/xsolla-store";

/**
 * Xsolla implementation of the IAP API.
 * @hidden
 */
export class IAPXsolla extends IAPBase {
    /**
     * to validate xsolla project ID and token
     * @param context the same argument used in invalidOperation
     * @param url the same argument used in invalidOperation
     * @returns
     */
    protected async validateXsollaProjectIDAndToken(context: string, url: string): Promise<{projectId: number, token: string}> {
        const sdkParameters = await Wortal.getSDKParameters();
        if (!sdkParameters.xsollaProjectID) {
            throw invalidOperation('Xsolla project ID not set', context, url);
        }

        let token: string | null | undefined = undefined;

        if (Wortal.session.getPlatform() === 'crazygames') {
            token = await Wortal._internalPlatformSDK.user.getXsollaUserToken();
        } else {
            token = await Wortal.player.getTokenAsync();
        }

        if (!token) {
            throw invalidOperation('Player Token not set', context, url);
        }

        return {
            projectId: sdkParameters.xsollaProjectID,
            token,
        };
    }

    protected cancelSubscriptionAsyncImpl(purchaseToken: string): Promise<void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.IAP_CANCEL_SUBSCRIPTION_ASYNC, API_URL.IAP_CANCEL_SUBSCRIPTION_ASYNC));
    }

    protected async consumePurchaseAsyncImpl(sku: string): Promise<void> {
        const {projectId, token} = await this.validateXsollaProjectIDAndToken(WORTAL_API.IAP_CONSUME_PURCHASE_ASYNC, API_URL.IAP_CONSUME_PURCHASE_ASYNC);
        await consumeItem({
            projectId,
            token,
            sku,
            quantity: 1,
        });
    }

    protected async getCatalogAsyncImpl(): Promise<Product[]> {
        const {projectId, token} = await this.validateXsollaProjectIDAndToken(WORTAL_API.IAP_GET_CATALOG_ASYNC, API_URL.IAP_GET_CATALOG_ASYNC);

        const items: VirtualItem[] = []
        let hasMore = true;

        while (hasMore) {
            const virtualItems = await fetchVirtualItems({
                projectId,
                token,
                offset: items.length,
                limit: 50,
            });

            items.push(...virtualItems.items);
            hasMore = virtualItems.has_more;
        }

        return items.map(item => ({
            title: item.name,
            productID: item.sku,
            description: item.description,
            imageURI: item.image_url,
            price: `${item.price.amount} ${item.price.currency}`,
            priceCurrencyCode: item.price.currency,
            priceAmount: Number(item.price.amount),
        }));
    }

    protected async getPurchasesAsyncImpl(): Promise<Purchase[]> {
        const {projectId, token} = await this.validateXsollaProjectIDAndToken(WORTAL_API.IAP_GET_PURCHASES_ASYNC, API_URL.IAP_GET_PURCHASES_ASYNC);

        const items: InventoryItem[] = []
        let hasMore = true;

        while (hasMore) {
            const userInventory = await fetchUserInventory({
                projectId,
                token,
                offset: items.length,
                limit: 50,
            });

            items.push(...userInventory.items);
            hasMore = userInventory.items.length === 50;
        }

        return items.map(item => ({
            productID: item.sku,
            paymentID: '',
            purchaseTime: '',
            purchaseToken: '',
            signedRequest: '',
            ...item,
        }));
    }

    protected getSubscribableCatalogAsyncImpl(): Promise<SubscribableProduct[]> {
        return Promise.reject(notSupported(undefined, WORTAL_API.IAP_GET_SUBSCRIBABLE_CATALOG_ASYNC, API_URL.IAP_GET_SUBSCRIBABLE_CATALOG_ASYNC));
    }

    protected getSubscriptionsAsyncImpl(): Promise<Subscription[]> {
        return Promise.reject(notSupported(undefined, WORTAL_API.IAP_GET_SUBSCRIPTIONS_ASYNC, API_URL.IAP_GET_SUBSCRIPTIONS_ASYNC));
    }

    protected isEnabledImpl(): boolean {
        return true;
    }

    protected async makePurchaseAsyncImpl(purchase: PurchaseConfig): Promise<Purchase> {
        return new Promise(async (resolve, reject) => {
            try {
                const { projectId, token } = await this.validateXsollaProjectIDAndToken(WORTAL_API.IAP_MAKE_PURCHASE_ASYNC, API_URL.IAP_MAKE_PURCHASE_ASYNC);
                const sandbox = Wortal.session.getPlatform() === 'debug' || (Wortal.session.getPlatform() === 'crazygames' && Wortal._internalPlatformSDK.isQaTool);
                const response = await createOrderWithItem({
                    projectId,
                    token,
                    sandbox,
                    sku: purchase.productID,
                    quantity: 1,
                    settings: {
                        redirect_policy: {
                            redirect_conditions: 'none',
                            status_for_manual_redirection: 'none'
                        }
                    }
                });

                let paymentCompleted = false;
                Wortal.iap._payStationWidget.init({
                    access_token: response.token,
                    sandbox: sandbox
                })

                Wortal.iap._payStationWidget.on("status-delivering", () => {
                    paymentCompleted = true;
                    resolve({
                        productID: purchase.productID,
                        purchaseToken: purchase.productID,
                        purchaseTime: new Date().toJSON(),
                        signedRequest: response.token,
                        paymentID: response.order_id.toString(),
                    });
                })

                Wortal.iap._payStationWidget.on("status-done", () => {
                    paymentCompleted = true;
                    resolve({
                        productID: purchase.productID,
                        purchaseToken: purchase.productID,
                        purchaseTime: new Date().toJSON(),
                        signedRequest: response.token,
                        paymentID: response.order_id.toString(),
                    });
                })

                Wortal.iap._payStationWidget.on("status-troubled", () => {
                    reject(new Error('payment cancelled'));
                })

                Wortal.iap._payStationWidget.on("error", () => {
                    reject(new Error('payment cancelled'));
                })

                Wortal.iap._payStationWidget.on("close", () => {
                    if (!paymentCompleted) {
                        reject(new Error('payment cancelled'));
                    }
                })

                Wortal.iap._payStationWidget.open();
            } catch (error) {
                reject(error); // Reject the promise if any error occurs
            }
        });
    }
    
    
    protected purchaseSubscriptionAsyncImpl(productID: string): Promise<Subscription> {
        return Promise.reject(notSupported(undefined, WORTAL_API.IAP_PURCHASE_SUBSCRIPTION_ASYNC, API_URL.IAP_PURCHASE_SUBSCRIPTION_ASYNC));
    }

    protected _tryEnableIAPImpl(): void {
        // this._isIAPEnabled = false;
        this._isIAPEnabled = true;
        Wortal._log.debug(`IAP initialized for ${Wortal._internalPlatform} platform.`);
    }
}

const { XSOLLA_STORE } = API_ENDPOINTS;
const STORE_BASE_URL = `${XSOLLA_STORE}/v2/project`;

/**
 * fetch VirtualItems from xsolla store
 * @param options which requires projectId, token, and optionally offset, limit, locale, country, promo_code
 * @returns the list of item available in the store
 */
async function fetchVirtualItems({ projectId, token, ...rest }: {
    projectId: number;
    token: string;
    offset?: number;
    limit?: number;
    locale?: string;
    country?: string;
    promo_code?: string;
}): Promise<VirtualItemsList> {
    rest.offset = rest.offset || 0;
    rest.limit = rest.limit || 50;
    rest.locale = rest.locale || 'en';
    const params = Object.entries(rest).map(([key, value]) => [key, value.toString()]);
    const query = new URLSearchParams(params).toString();

    const resp = await fetch(
        `${STORE_BASE_URL}/${projectId}/items/virtual_items?${query}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (resp.status !== 200) {
        throw operationFailed(
            `Failed to fetch virtual items with projectId: ${projectId} [${resp.status}:${resp.statusText}]`,
            WORTAL_API.IAP_GET_CATALOG_ASYNC, API_URL.IAP_GET_CATALOG_ASYNC);
    } else if (!resp.headers.get('Content-Type')?.toLowerCase().includes('application/json')) {
        // else if response headers Content-Type does not contains application/json
        throw operationFailed(
            `Failed to fetch virtual items: invalid response content type`,
            WORTAL_API.IAP_GET_CATALOG_ASYNC, API_URL.IAP_GET_CATALOG_ASYNC);
    }
    return await resp.json() as VirtualItemsList;
}

/**
 * To fetch player inventory from Xsolla store
 * @param options which requires projectId, token, and optionally offset, limit
 * @returns the item list in the player inventory
 */
async function fetchUserInventory({ projectId, token, ...rest }: {
    projectId: number;
    token: string;
    offset?: number;
    limit?: number;
}): Promise<InventoryItemList> {
    const query = new URLSearchParams({
        limit: '50',
        offset: '0',
        platform: 'xsolla'
    }).toString();

    const resp = await fetch(
        `${STORE_BASE_URL}/${projectId}/user/inventory/items?${query}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (resp.status !== 200) {
        throw operationFailed(
            `Failed to fetch user inventory with projectId: ${projectId} [${resp.status}:${resp.statusText}]`,
            WORTAL_API.IAP_GET_PURCHASES_ASYNC, API_URL.IAP_GET_PURCHASES_ASYNC);
    } else if (!resp.headers.get('Content-Type')?.toLowerCase().includes('application/json')) {
        // else if response headers Content-Type does not contains application/json
        throw operationFailed(
            `Failed to fetch user inventory: invalid response content type`,
             WORTAL_API.IAP_GET_PURCHASES_ASYNC, API_URL.IAP_GET_PURCHASES_ASYNC);
    }
    return await resp.json() as InventoryItemList;
}

/**
 * Create order with specified item
 * url: https://developers.xsolla.com/api/igs-bb/operation/create-order-with-item/
 * @param options which requires projectId, token, sku of the item
 */
async function createOrderWithItem({ projectId, token, sku, ...rest }: CreateOrderWithSpecifiedItemOptions): Promise<OrderResponse> {
    const url = `${STORE_BASE_URL}/${projectId}/payment/item/${sku}`
    const resp = await fetch(
        url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(rest)
        }
    );
    if (resp.status !== 200) {
        throw operationFailed(
            `Failed to create order with item: ${sku} with projectId: ${projectId} [${resp.status}:${resp.statusText}]`,
            WORTAL_API.IAP_MAKE_PURCHASE_ASYNC, API_URL.IAP_MAKE_PURCHASE_ASYNC);
    } else if (!resp.headers.get('Content-Type')?.toLowerCase().includes('application/json')) {
        // else if response headers Content-Type does not contains application/json
        throw operationFailed(
            `Failed to create order with item: invalid response content type`,
            WORTAL_API.IAP_MAKE_PURCHASE_ASYNC, API_URL.IAP_MAKE_PURCHASE_ASYNC);
    }
    return await resp.json() as OrderResponse;
}

/**
 * Consume item
 * url: https://developers.xsolla.com/api/igs-bb/operation/consume-item/
 * @param options which requires projectId, token, sku of the item, quantity
 */
async function consumeItem({ projectId, token, ...rest }: ConsumeItemOptions): Promise<void> {
    const query = new URLSearchParams({
        platform: "xsolla"
    }).toString()
    const url = `${STORE_BASE_URL}/${projectId}/user/inventory/item/consume?${query}`
    const resp = await fetch(
        url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(rest)
        }
    );
    if (resp.status !== 200) {
        throw operationFailed(
            `Failed to consume item: ${rest.sku} with projectId: ${projectId} [${resp.status}:${resp.statusText}]`,
            WORTAL_API.IAP_CONSUME_PURCHASE_ASYNC, API_URL.IAP_CONSUME_PURCHASE_ASYNC);
    }
}
/**
 * Get order
 * url: https://developers.xsolla.com/api/igs-bb/operation/get-order/
 * @param options which requires projectId and orderId
 */
async function getOrder({projectId, token, orderId}: GetOrderOptions): Promise<Order> {
    const resp = await fetch(
        `${STORE_BASE_URL}/${projectId}/order/${orderId}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (resp.status !== 200) {
        throw operationFailed(
            `Failed to get order with projectId: ${projectId} and orderId: ${orderId} [${resp.status}:${resp.statusText}]`,
            WORTAL_API.IAP_MAKE_PURCHASE_ASYNC, API_URL.IAP_MAKE_PURCHASE_ASYNC);
    } else if (!resp.headers.get('Content-Type')?.toLowerCase().includes('application/json')) {
        throw operationFailed(
            `Failed to get order: invalid response content type`,
             WORTAL_API.IAP_MAKE_PURCHASE_ASYNC, API_URL.IAP_MAKE_PURCHASE_ASYNC);
    }
    return await resp.json() as Order;
}