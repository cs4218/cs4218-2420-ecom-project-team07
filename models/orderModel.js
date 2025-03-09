import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: {
      type: [{
        type: mongoose.ObjectId,
        ref: "Products",
        required: true,
      }],
      validate: {
        validator: function(products) {
          return products.length > 0;
        },
        message: "Products array must not be empty"
      },
      required: true
    },
    payment: {
      type: Object,
      required: true,
      properties: {
        errors: {
          type: Object,
          properties: {
            validationErrors: { type: Object },
            errorCollections: { type: Object }
          }
        },
        params: { 
          type: Object,
          properties: {
            transaction: { 
              type: Object, 
              properties: {
                amount: { type: String },
                paymentMethodNonce: { type: String },
                options: { type: Object },
                type: { type: String }
              }
            }
          }
        },
        message: { type: String },
        success: { type: Boolean }
      }
    },
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
      required: true,
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "delivered", "cancel"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);