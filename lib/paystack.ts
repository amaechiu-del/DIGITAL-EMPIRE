declare global {
  interface Window {
    PaystackPop: {
      setup: (options: PaystackOptions) => { openIframe: () => void };
    };
  }
}

interface PaystackOptions {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  callback: (response: { reference: string }) => void;
  onClose: () => void;
}

export function initializePaystackPayment(params: {
  email: string;
  amount: number;
  reference: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}) {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  if (!publicKey) {
    console.error("Paystack public key is not set.");
    return;
  }

  const loadScript = () =>
    new Promise<void>((resolve, reject) => {
      if (document.getElementById("paystack-script")) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.id = "paystack-script";
      script.src = "https://js.paystack.co/v1/inline.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Paystack script"));
      document.head.appendChild(script);
    });

  loadScript()
    .then(() => {
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: params.email,
        amount: params.amount * 100, // convert Naira to kobo
        currency: "NGN",
        ref: params.reference,
        callback: (response) => params.onSuccess(response.reference),
        onClose: params.onClose,
      });
      handler.openIframe();
    })
    .catch((err) => console.error(err));
}

export function generatePaymentReference(): string {
  return `DE_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}
