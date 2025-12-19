// src/app/models/product-response.model.ts
export interface ProductResponse {
    status: string;
    data?: any;  // Optional, will hold the product data
    message?: string;  // Optional, will hold the error message
  }
  