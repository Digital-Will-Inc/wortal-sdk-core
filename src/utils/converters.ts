import { ContextPayload } from "../types/context-payload";

/** @hidden */
export function contextToLinkMessagePayload(payload: ContextPayload): ContextPayload {
    let obj: ContextPayload = {
        image: payload.image,
        text: payload.text,
    }
    if (payload?.cta) obj.caption = payload.cta;
    if (payload?.caption) obj.caption = payload.caption;
    if (payload?.data) obj.data = payload.data;
    return obj;
}

/** @hidden */
export function contextToViberChoosePayload(payload: ContextPayload): ContextPayload {
    let obj: ContextPayload = {
        // Not used in this payload.
        image: "",
        text: "",
    }
    if (payload?.filters) obj.filters = payload.filters;
    if (payload?.maxSize) obj.maxSize = payload.maxSize;
    if (payload?.minSize) obj.minSize = payload.minSize;
    if (payload?.hoursSinceInvitation) obj.hoursSinceInvitation = payload.hoursSinceInvitation;
    if (payload?.description) obj.description = payload.description;
    return obj;
}

/** @hidden */
export function contextToViberSharePayload(payload: ContextPayload): ContextPayload {
    let obj: ContextPayload = {
        image: payload.image,
        text: payload.text,
    }
    if (payload?.data) obj.data = payload.data;
    if (payload?.filters) obj.filters = payload.filters;
    if (payload?.hoursSinceInvitation) obj.hoursSinceInvitation = payload.hoursSinceInvitation;
    if (payload?.minShare) obj.minShare = payload.minShare;
    if (payload?.description) obj.description = payload.description;
    if (payload?.ui) obj.ui = payload.ui;
    if (payload?.cta) obj.cta = payload.cta;
    if (payload?.caption) obj.cta = payload.caption;
    if (payload?.intent) obj.intent = payload.intent
    else obj.intent = 'REQUEST';
    return obj;
}

/** @hidden */
export function contextToViberUpdatePayload(payload: ContextPayload): ContextPayload {
    let obj: ContextPayload = {
        image: payload.image,
        text: payload.text,
    }
    if (payload?.cta) obj.cta = payload.cta;
    if (payload?.caption) obj.cta = payload.caption;
    if (payload?.data) obj.data = payload.data;
    if (payload?.strategy) obj.strategy = payload.strategy;
    if (payload?.notifications) obj.notifications = payload.notifications;
    if (payload?.action) obj.action = payload.action;
    else obj.action = "CUSTOM";
    if (payload?.template) obj.template = payload.template;
    else obj.template = "";
    return obj;
}
