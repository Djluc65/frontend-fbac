import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type {
  PaymentMethodId,
  PaymentMethodOption,
  PaymentProofUploadResult,
  PaymentState,
} from './paymentTypes'

const initialState: PaymentState = {
  selectedMethod: null,
  methods: [],
  proofFile: null,
}

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentMethods: (state, action: PayloadAction<PaymentMethodOption[]>) => {
      state.methods = action.payload
    },
    setSelectedPaymentMethod: (state, action: PayloadAction<PaymentMethodId | null>) => {
      state.selectedMethod = action.payload
    },
    setPaymentProofFile: (state, action: PayloadAction<PaymentProofUploadResult | null>) => {
      state.proofFile = action.payload
    },
    resetPaymentState: (state) => {
      state.selectedMethod = null
      state.proofFile = null
    },
  },
})

export const {
  resetPaymentState,
  setPaymentMethods,
  setPaymentProofFile,
  setSelectedPaymentMethod,
} = paymentSlice.actions

export default paymentSlice.reducer
