import WebhooksCreateView from "@saleor/webhooks/views/WebhooksCreate";
import React from "react";
import { Routes, Route, useParams } from "react-router-dom";

import { webhookAddPath, webhookPath } from "./urls";
import WebhooksDetails from "./views/WebhooksDetails";

const WebhookDetails: React.FC = () => (
  <WebhooksDetails id={decodeURIComponent(useParams().id)} />
);

const WebhookCreate: React.FC = () => (
  <WebhooksCreateView id={decodeURIComponent(useParams().id)} />
);

const Component = () => (
  <Routes>
    <Route path={webhookAddPath(":id", "custom")} element={<WebhookCreate />} />
    <Route path={webhookPath(":id", "")} element={<WebhookDetails />} />
  </Routes>
);

export default Component;
