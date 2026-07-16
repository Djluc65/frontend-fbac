import type { RootState } from '../../app/store'

export const selectPaymentState = (state: RootState) => state.payment
export const selectPaymentMethods = (state: RootState) => state.payment.methods
export const selectSelectedPaymentMethod = (state: RootState) => state.payment.selectedMethod
export const selectPaymentProofFile = (state: RootState) => state.payment.proofFile
