import NodeRSA from 'node-rsa';
import { randomUUID } from 'crypto';
import type { PaymentRequest, PaymentResponse } from '@shared/schema';

// Generate RSA key pair for payment encryption
const key = new NodeRSA({ b: 2048 });

export function getPublicKey(): string {
  return key.exportKey('public');
}

export function getPrivateKey(): string {
  return key.exportKey('private');
}

interface DecryptedCardData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

function decryptCardData(encryptedData: string): DecryptedCardData {
  try {
    // For demo purposes, we'll decode the base64 encoded data from client
    // In production, this would use proper RSA decryption
    const decrypted = Buffer.from(encryptedData, 'base64').toString('utf8');
    return JSON.parse(decrypted);
  } catch (error) {
    // Fallback to RSA decryption if base64 fails
    try {
      const decrypted = key.decrypt(encryptedData, 'utf8');
      return JSON.parse(decrypted);
    } catch (rsaError) {
      throw new Error('Failed to decrypt card data');
    }
  }
}

function validateCardData(cardData: DecryptedCardData): boolean {
  // Basic validation
  if (!cardData.cardNumber || !cardData.expiryDate || !cardData.cvv || !cardData.cardholderName) {
    return false;
  }

  // Remove spaces and validate card number (simple Luhn check)
  const cardNumber = cardData.cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cardNumber)) {
    return false;
  }

  // Validate expiry date format (MM/YY)
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardData.expiryDate)) {
    return false;
  }

  // Validate CVV
  if (!/^\d{3,4}$/.test(cardData.cvv)) {
    return false;
  }

  return true;
}

function simulatePaymentProcessing(cardData: DecryptedCardData, amount: string): boolean {
  // Simulate payment processing with various scenarios
  const cardNumber = cardData.cardNumber.replace(/\s/g, '');
  
  // Test cards for different scenarios
  if (cardNumber === '4111111111111111') return true;  // Always succeeds
  if (cardNumber === '4000000000000002') return false; // Always fails
  if (cardNumber === '4000000000000341') return false; // Insufficient funds
  
  // Random success/failure for other cards (90% success rate)
  return Math.random() > 0.1;
}

export async function processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
  try {
    // Decrypt the card data
    const cardData = decryptCardData(paymentRequest.encryptedCardData);
    
    // Validate card data
    if (!validateCardData(cardData)) {
      return {
        success: false,
        error: 'Invalid card data provided'
      };
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Process the payment
    const success = simulatePaymentProcessing(cardData, paymentRequest.amount);
    
    if (success) {
      return {
        success: true,
        transactionId: `txn_${randomUUID()}`
      };
    } else {
      return {
        success: false,
        error: 'Payment declined by bank'
      };
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: 'Payment processing failed'
    };
  }
}
