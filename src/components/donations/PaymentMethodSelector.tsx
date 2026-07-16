import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useGetPaymentMethodsQuery } from '../../features/payments/paymentApi'
import {
  selectPaymentMethods,
  selectSelectedPaymentMethod,
} from '../../features/payments/paymentSelectors'
import {
  setPaymentMethods,
  setSelectedPaymentMethod,
} from '../../features/payments/paymentSlice'
import type { PaymentMethodId } from '../../features/payments/paymentTypes'
import PaymentMethodCard from './PaymentMethodCard'

interface PaymentMethodSelectorProps {
  value: PaymentMethodId | null
  onChange: (methodId: PaymentMethodId) => void
  error?: string
}

const PaymentMethodSelector = ({ value, onChange, error }: PaymentMethodSelectorProps) => {
  const dispatch = useAppDispatch()
  const selectedMethod = useAppSelector(selectSelectedPaymentMethod)
  const methodsFromStore = useAppSelector(selectPaymentMethods)
  const { data: methods = [] } = useGetPaymentMethodsQuery()

  useEffect(() => {
    if (methods.length > 0) {
      dispatch(setPaymentMethods(methods))
    }
  }, [dispatch, methods])

  const availableMethods = methodsFromStore.length > 0 ? methodsFromStore : methods
  const effectiveValue = value ?? selectedMethod

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {availableMethods.map((method) => (
          <PaymentMethodCard
            key={method.id}
            method={method}
            selected={effectiveValue === method.id}
            onSelect={(methodId) => {
              dispatch(setSelectedPaymentMethod(methodId))
              onChange(methodId)
            }}
          />
        ))}
      </div>

      {error ? (
        <p className="inline-flex items-center gap-2 text-sm font-medium text-red-600">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default PaymentMethodSelector
