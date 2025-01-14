import { customAppListPath } from "@saleor/apps/urls";
import { appsSection } from "@saleor/apps/urls";
import { stringifyQs } from "@saleor/utils/urls";
import urlJoin from "url-join";

import { ActiveTab, Dialog, SingleAction, TabActionDialog } from "../types";

export const webhookSection = "/webhooks/";
export const webhookListPath = webhookSection;

export type WebhookListUrlDialog = "remove" | TabActionDialog;

export type WebhookListUrlQueryParams = ActiveTab &
  Dialog<WebhookListUrlDialog> &
  SingleAction;

export const webhookPath = (id: string, section = appsSection) =>
  urlJoin(section, webhookSection, id);

export type WebhookUrlDialog = "remove";
export type WebhookUrlQueryParams = Dialog<WebhookUrlDialog> & SingleAction;
export const webhookUrl = (id: string, params?: WebhookUrlQueryParams) =>
  webhookPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const webhookAddPath = (id: string, section = customAppListPath) =>
  urlJoin(section, id, webhookSection, "add");
export const webhookAddUrl = webhookAddPath;
