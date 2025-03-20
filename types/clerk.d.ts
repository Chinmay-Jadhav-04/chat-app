declare module "@clerk/backend" {
  export interface WebhookEvent {
    type: string;
    data: {
      id: string;
      first_name: string;
      last_name: string;
      image_url: string;
      email_addresses: Array<{ email_address: string }>;
    };
  }
}