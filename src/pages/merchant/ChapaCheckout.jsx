import { Button } from "@/components/ui/button";
import React from "react";

const ChapaCheckout = ({ amount, user }) => {
  const handleCheckout = async () => {
    const tx_ref = "tx-" + Date.now();

    const response = await fetch(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer CHAPUBK_TEST-0tMAyZcHQ2NmFO437ZsuIVATe2EkQJVN", // ⚠️ NEVER USE THIS IN PRODUCTION
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency: "ETB",
          email: user.email,
          first_name: user.name.split(" ")[0],
          last_name: user.name.split(" ")[1] || "NoLastName",
          phone_number: user.phone,
          tx_ref,
          callback_url: "https://webhook.site/your-custom-id", // optional
          return_url: "https://localhost:5173",
          customization: {
            title: "Demam Payment",
            description: "Order payment",
          },
        }),
      }
    );

    const result = await response.json();

    if (result?.data?.checkout_url) {
      window.location.href = result.data.checkout_url;
    } else {
      alert("Failed to initialize payment");
      console.error(result);
    }
  };

  return (
    <Button onClick={handleCheckout} className="">
      Pay with Chapa
    </Button>
  );
};

export default ChapaCheckout;
