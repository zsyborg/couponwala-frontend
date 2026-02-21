'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart, CartItem } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import axios from 'axios';

// Load Razorpay script
const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (document.getElementById('razorpay-script')) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.id = 'razorpay-script';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Razorpay script'));
        document.body.appendChild(script);
    });
};

// Types
interface AddressFormData {
  fullName: string;
  phoneNumber: string;
  alternatePhone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
  landmark: string;
  addressType: 'home' | 'office' | 'other';
}

interface SavedAddress extends AddressFormData {
  _id: string;
  isDefault: boolean;
}

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

interface Coupon {
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minimumOrder?: number;
}

// Indian States
const INDIAN_STATES = [
  { value: '', label: 'Select State' },
  { value: 'andhra-pradesh', label: 'Andhra Pradesh' },
  { value: 'arunachal-pradesh', label: 'Arunachal Pradesh' },
  { value: 'assam', label: 'Assam' },
  { value: 'bihar', label: 'Bihar' },
  { value: 'chhattisgarh', label: 'Chhattisgarh' },
  { value: 'goa', label: 'Goa' },
  { value: 'gujarat', label: 'Gujarat' },
  { value: 'haryana', label: 'Haryana' },
  { value: 'himachal-pradesh', label: 'Himachal Pradesh' },
  { value: 'jharkhand', label: 'Jharkhand' },
  { value: 'karnataka', label: 'Karnataka' },
  { value: 'kerala', label: 'Kerala' },
  { value: 'madhya-pradesh', label: 'Madhya Pradesh' },
  { value: 'maharashtra', label: 'Maharashtra' },
  { value: 'manipur', label: 'Manipur' },
  { value: 'meghalaya', label: 'Meghalaya' },
  { value: 'mizoram', label: 'Mizoram' },
  { value: 'nagaland', label: 'Nagaland' },
  { value: 'odisha', label: 'Odisha' },
  { value: 'punjab', label: 'Punjab' },
  { value: 'rajasthan', label: 'Rajasthan' },
  { value: 'sikkim', label: 'Sikkim' },
  { value: 'tamil-nadu', label: 'Tamil Nadu' },
  { value: 'telangana', label: 'Telangana' },
  { value: 'tripura', label: 'Tripura' },
  { value: 'uttar-pradesh', label: 'Uttar Pradesh' },
  { value: 'uttarakhand', label: 'Uttarakhand' },
  { value: 'west-bengal', label: 'West Bengal' },
  { value: 'delhi', label: 'Delhi' },
];

// Payment Methods Configuration
const PAYMENT_METHODS = [
  {
    id: 'upi' as PaymentMethod,
    name: 'UPI',
    description: 'Google Pay, PhonePe, Paytm, BHIM, etc.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'card' as PaymentMethod,
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, RuPay via Razorpay',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    id: 'netbanking' as PaymentMethod,
    name: 'Net Banking',
    description: 'All major Indian banks supported',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: 'cod' as PaymentMethod,
    name: 'Cash on Delivery',
    description: 'Pay when you receive the order',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

// Demo coupons
const DEMO_COUPONS: Record<string, Coupon> = {
  'WELCOME10': { code: 'WELCOME10', discount: 10, discountType: 'percentage', minimumOrder: 100 },
  'SAVE20': { code: 'SAVE20', discount: 20, discountType: 'percentage', minimumOrder: 200 },
  'FLAT50': { code: 'FLAT50', discount: 50, discountType: 'fixed', minimumOrder: 150 },
  'FIRST100': { code: 'FIRST100', discount: 100, discountType: 'fixed', minimumOrder: 300 },
};

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { items, totalPrice, discount, finalPrice, appliedCoupon, applyCoupon, removeCoupon, clearCart, isLoading: cartLoading } = useCart();
  const { addToast } = useToast();

  // Form state
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedSavedAddress, setSelectedSavedAddress] = useState<string>('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(true);
  const [formData, setFormData] = useState<AddressFormData>({
    fullName: '',
    phoneNumber: '',
    alternatePhone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pinCode: '',
    landmark: '',
    addressType: 'home',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({});
  const [saveAddress, setSaveAddress] = useState(false);

  // Payment state
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      addToast('warning', 'Please login to continue checkout');
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated, authLoading, router, addToast]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!authLoading && items.length === 0) {
      addToast('info', 'Your cart is empty');
      router.push('/cart');
    }
  }, [items.length, authLoading, router, addToast]);

  // Load saved addresses from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('savedAddresses');
      if (stored) {
        try {
          setSavedAddresses(JSON.parse(stored));
        } catch {
          console.warn('Failed to parse saved addresses');
        }
      }
    }
  }, []);

  // Handle form input changes
  const handleInputChange = (field: keyof AddressFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof AddressFormData, string>> = {};

    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }
    if (formData.alternatePhone && !/^[6-9]\d{9}$/.test(formData.alternatePhone)) {
      errors.alternatePhone = 'Please enter a valid phone number';
    }
    if (!formData.addressLine1.trim()) errors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state) errors.state = 'State is required';
    if (!formData.pinCode.trim()) errors.pinCode = 'PIN code is required';
    else if (!/^\d{6}$/.test(formData.pinCode)) {
      errors.pinCode = 'Please enter a valid 6-digit PIN code';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Select saved address
  const handleSelectSavedAddress = (addressId: string) => {
    setSelectedSavedAddress(addressId);
    const address = savedAddresses.find((a) => a._id === addressId);
    if (address) {
      setFormData({
        fullName: address.fullName,
        phoneNumber: address.phoneNumber,
        alternatePhone: address.alternatePhone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        pinCode: address.pinCode,
        landmark: address.landmark,
        addressType: address.addressType,
      });
      setShowNewAddressForm(false);
    }
  };

  // Save address to localStorage
  const saveAddressToStorage = (address: AddressFormData) => {
    const newAddress: SavedAddress = {
      _id: Date.now().toString(),
      ...address,
      isDefault: savedAddresses.length === 0,
    };
    const updated = [...savedAddresses, newAddress];
    setSavedAddresses(updated);
    localStorage.setItem('savedAddresses', JSON.stringify(updated));
    return newAddress._id;
  };

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError('');

    try {
      const success = await applyCoupon(couponCode.toUpperCase());
      if (success) {
        addToast('success', `Coupon ${couponCode.toUpperCase()} applied!`);
        setCouponCode('');
      } else {
        setCouponError('Invalid coupon code');
      }
    } catch {
      setCouponError('Failed to apply coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    // Validate address
    if (selectedSavedAddress) {
      const address = savedAddresses.find((a) => a._id === selectedSavedAddress);
      if (!address) {
        addToast('error', 'Please select a valid address');
        return;
      }
    } else if (!validateForm()) {
      addToast('error', 'Please fill in all required fields');
      return;
    }

    // Save address if requested
    if (saveAddress && !selectedSavedAddress) {
      const addressId = saveAddressToStorage(formData);
      setSelectedSavedAddress(addressId);
    }

    setIsProcessing(true);

    try {
      // For Cash on Delivery, skip Razorpay
      if (selectedPayment === 'cod') {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await clearCart();
        addToast('success', 'Order placed successfully!');
        router.push('/checkout/confirmation');
        return;
      }

      // Load Razorpay script
      await loadRazorpayScript();

      // Create payment order via API
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await axios.post(`${API_URL}/api/payments/create-order`, {
        amount: grandTotal,
        currency: 'INR',
        items: items.map((item: CartItem) => ({
          offerId: item.offerId,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
        })),
        customerId: user?.id,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create payment order');
      }

      const { orderId, keyId, amount: orderAmount, currency: orderCurrency, mockMode } = response.data;

      // If in mock mode, simulate successful payment
      if (mockMode) {
        console.warn('Running in mock mode - simulating payment success');
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await clearCart();
        addToast('success', 'Order placed successfully! (Mock Mode)');
        router.push('/checkout/confirmation');
        return;
      }

      // Initialize Razorpay
      const options = {
        key: keyId,
        name: 'CouponWala',
        description: 'Order Payment',
        order_id: orderId,
        amount: orderAmount,
        currency: orderCurrency,
        prefill: {
          name: formData.fullName,
          email: user?.email || '',
          contact: formData.phoneNumber,
        },
        notes: {
          address: `${formData.addressLine1}, ${formData.city}, ${formData.state} - ${formData.pinCode}`,
        },
        theme: {
          color: '#f97316',
        },
        handler: async (razorpayResponse: any) => {
          try {
            // Verify payment
            const verifyResponse = await axios.post(`${API_URL}/api/payments/verify`, {
              razorpayOrderId: razorpayResponse.razorpay_order_id,
              razorpayPaymentId: razorpayResponse.razorpay_payment_id,
              razorpaySignature: razorpayResponse.razorpay_signature,
              customerId: user?.id,
              items: items.map((item: CartItem) => ({
                offerId: item.offerId,
                title: item.title,
                quantity: item.quantity,
                price: item.price,
              })),
            });

            if (verifyResponse.data.success) {
              await clearCart();
              addToast('success', 'Payment successful! Order placed.');
              router.push('/checkout/confirmation');
            } else {
              addToast('error', verifyResponse.data.message || 'Payment verification failed');
            }
          } catch (verifyError: any) {
            addToast('error', verifyError.response?.data?.message || 'Payment verification failed');
          }
        },
      };

      // @ts-ignore - Razorpay is loaded dynamically
      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        throw new Error('Razorpay not loaded');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to place order';
      addToast('error', message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate totals
  const gstRate = 0.18; // 18% GST
  const gstAmount = finalPrice * gstRate;
  const shippingCost = finalPrice >= 500 ? 0 : 49;
  const grandTotal = finalPrice + gstAmount + shippingCost;

  // Loading state
  if (authLoading || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Breadcrumb */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <Breadcrumb
            items={[
              { label: "Cart", href: "/cart" },
              { label: "Checkout" },
            ]}
            className="mt-4 text-sm opacity-90 text-white"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardBody>
                {/* Saved Addresses */}
                {savedAddresses.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Use Saved Address</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {savedAddresses.map((address) => (
                        <div
                          key={address._id}
                          onClick={() => handleSelectSavedAddress(address._id)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedSavedAddress === address._id
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{address.fullName}</p>
                              <p className="text-sm text-gray-600 mt-1">{address.addressLine1}</p>
                              {address.addressLine2 && (
                                <p className="text-sm text-gray-600">{address.addressLine2}</p>
                              )}
                              <p className="text-sm text-gray-600">
                                {address.city}, {address.state} - {address.pinCode}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">{address.phoneNumber}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              address.addressType === 'home' ? 'bg-blue-100 text-blue-700' :
                              address.addressType === 'office' ? 'bg-purple-100 text-purple-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {address.addressType}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div
                        onClick={() => {
                          setSelectedSavedAddress('');
                          setShowNewAddressForm(true);
                        }}
                        className={`p-4 border border-dashed rounded-lg cursor-pointer transition-all flex items-center justify-center ${
                          showNewAddressForm
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-300 hover:border-orange-300'
                        }`}
                      >
                        <span className="text-sm text-gray-600">+ Add New Address</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* New Address Form */}
                {showNewAddressForm && (
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name *"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        error={formErrors.fullName}
                      />
                      <Input
                        label="Phone Number *"
                        placeholder="+91 9876543210"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        error={formErrors.phoneNumber}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Alternate Phone"
                        placeholder="+91 (optional)"
                        value={formData.alternatePhone}
                        onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                        error={formErrors.alternatePhone}
                      />
                      <Input
                        label="PIN Code *"
                        placeholder="123456"
                        value={formData.pinCode}
                        onChange={(e) => handleInputChange('pinCode', e.target.value)}
                        error={formErrors.pinCode}
                      />
                    </div>

                    <Input
                      label="Address Line 1 *"
                      placeholder="House No., Street Name, Area"
                      value={formData.addressLine1}
                      onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                      error={formErrors.addressLine1}
                    />

                    <Input
                      label="Address Line 2"
                      placeholder="Landmark (optional)"
                      value={formData.addressLine2}
                      onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="City *"
                        placeholder="Mumbai"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        error={formErrors.city}
                      />
                      <Select
                        label="State *"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        options={INDIAN_STATES}
                        error={formErrors.state}
                      />
                    </div>

                    <Input
                      label="Landmark"
                      placeholder="Near, e.g., Metro Station"
                      value={formData.landmark}
                      onChange={(e) => handleInputChange('landmark', e.target.value)}
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                      <div className="flex space-x-4">
                        {(['home', 'office', 'other'] as const).map((type) => (
                          <label
                            key={type}
                            className={`flex items-center space-x-2 cursor-pointer px-4 py-2 rounded-lg border transition-all ${
                              formData.addressType === type
                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                : 'border-gray-200 hover:border-orange-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="addressType"
                              value={type}
                              checked={formData.addressType === type}
                              onChange={(e) => handleInputChange('addressType', e.target.value as AddressFormData['addressType'])}
                              className="sr-only"
                            />
                            <span className="capitalize">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveAddress}
                        onChange={(e) => setSaveAddress(e.target.checked)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">Save this address for future orders</span>
                    </label>
                  </form>
                )}
              </CardBody>
            </Card>

            {/* Payment Method Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PAYMENT_METHODS.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPayment === method.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`${selectedPayment === method.id ? 'text-orange-500' : 'text-gray-500'}`}>
                          {method.icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{method.name}</p>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* UPI Details */}
                {selectedPayment === 'upi' && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <Input
                      label="UPI ID"
                      placeholder="yourname@upi"
                      type="text"
                    />
                  </div>
                )}

                {/* Card Details */}
                {selectedPayment === 'card' && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Card payment will be processed via Razorpay</p>
                    <div className="flex items-center space-x-2">
                      <img src="https://cdn.razorpay.com/logo.svg" alt="Razorpay" className="h-6" />
                      <span className="text-sm text-gray-500">Secure payment with Razorpay</span>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardBody className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item: CartItem) => (
                    <div key={item.offerId} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.store}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="border-gray-200" />

                {/* Promo Code */}
                {!appliedCoupon ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        error={couponError}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyCoupon}
                        isLoading={isApplyingCoupon}
                        disabled={!couponCode.trim()}
                      >
                        Apply
                      </Button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Try: WELCOME10, SAVE20, FLAT50, FIRST100
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium text-green-700">
                        {appliedCoupon.code} applied
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        removeCoupon();
                        addToast('info', 'Coupon removed');
                      }}
                      className="text-xs text-green-700 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <hr className="border-gray-200" />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount</span>
                      <span className="text-green-600">-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST (18%)</span>
                    <span className="text-gray-900">₹{gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">
                      {shippingCost === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${shippingCost}`
                      )}
                    </span>
                  </div>
                  {finalPrice < 500 && (
                    <p className="text-xs text-gray-500">
                      Add ₹{(500 - finalPrice).toFixed(2)} more for free shipping
                    </p>
                  )}
                </div>

                <hr className="border-gray-200" />

                {/* Total */}
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-orange-600">₹{grandTotal.toFixed(2)}</span>
                </div>

                {/* Place Order Button */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full mt-4"
                  isLoading={isProcessing}
                  onClick={handlePlaceOrder}
                  disabled={items.length === 0 || isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </Button>

                {/* Security Note */}
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 mt-3">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure checkout - 100% secure</span>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

