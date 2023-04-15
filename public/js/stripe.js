/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";
import { Stripe } from 'stripe';

const stripe = Stripe('pk_test_51MwoPQBVIFu22LwbsmpCFXtckm1v9uNM54jPWRnv3gV13ZzR1cRdgraZGUv7riCQ5rp0hQZeZ8EmeAFGp5WwsfOs00qfxiPjDR');

export const bookTour = async (tourId) => {
    try {
     
      const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
      console.log(session);

      window.location.replace(session.data.session.url);
    } catch (err) {
      console.log(err);
      showAlert('error', err);
    }
  };