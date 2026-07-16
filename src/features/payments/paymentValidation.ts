import { z } from 'zod'
import { PAYMENT_METHOD_IDS } from './paymentTypes'

const emailSchema = z.string().trim().email('Une adresse email valide est requise.')
const MAX_PROOF_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_PROOF_MIME_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'] as const
export const MANUAL_PAYMENT_METHODS = ['BANK_TRANSFER', 'ZELLE', 'CASH_APP'] as const

export const manualPaymentValidationSchema = z
  .object({
    paymentMethod: z.enum(PAYMENT_METHOD_IDS),
    reference: z.string().trim().min(6, 'La référence doit contenir au moins 6 caractères.').max(100),
    proofFileName: z.string().trim().min(1, 'La preuve de paiement est requise.'),
    proofMimeType: z.string().trim().min(1, 'Le type du fichier est requis.'),
    proofFileSize: z.number().min(1, 'Le fichier est requis.').max(MAX_PROOF_FILE_SIZE, 'Le fichier dépasse 5 Mo.'),
  })
  .superRefine((values, context) => {
    if (!MANUAL_PAYMENT_METHODS.includes(values.paymentMethod as (typeof MANUAL_PAYMENT_METHODS)[number])) {
      return
    }

    if (!ALLOWED_PROOF_MIME_TYPES.includes(values.proofMimeType as (typeof ALLOWED_PROOF_MIME_TYPES)[number])) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Formats acceptés : PDF, PNG, JPG, JPEG ou WEBP.',
        path: ['proofMimeType'],
      })
    }
  })

export const paymentMethodSchema = z.object({
  paymentMethod: z.enum(PAYMENT_METHOD_IDS, {
    required_error: 'Veuillez choisir un mode de paiement.',
  }),
})

export const donationWizardSchema = z
  .object({
    donationType: z.enum(['general', 'program', 'campaign']),
    campaign: z.string().optional(),
    program: z.string().optional(),
    amount: z.number().min(1, 'Le montant minimum est de 1 USD'),
    frequency: z.enum(['one_time', 'monthly', 'weekly', 'yearly']),
    paymentMethod: z.enum(PAYMENT_METHOD_IDS, {
      required_error: 'Veuillez choisir un mode de paiement.',
    }),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    country: z.string().optional(),
    message: z.string().max(500).optional(),
    anonymous: z.boolean(),
    transactionReference: z.string().optional(),
    proofImage: z.string().optional(),
    proofFileName: z.string().optional(),
    proofMimeType: z.string().optional(),
    proofFileSize: z.number().optional(),
    isAuthenticated: z.boolean(),
  })
  .superRefine((values, context) => {
    if (values.donationType === 'campaign' && !values.campaign) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Veuillez sélectionner une campagne.',
        path: ['campaign'],
      })
    }

    if (values.donationType === 'program' && !values.program?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Veuillez sélectionner un programme.',
        path: ['program'],
      })
    }

    if (!values.paymentMethod) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Veuillez choisir un mode de paiement.',
        path: ['paymentMethod'],
      })
    }

    if (!values.isAuthenticated) {
      if (!values.firstName?.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Le prénom est requis.',
          path: ['firstName'],
        })
      }

      if (!values.lastName?.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Le nom est requis.',
          path: ['lastName'],
        })
      }

      if (!values.email?.trim() || !emailSchema.safeParse(values.email).success) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Une adresse email valide est requise.',
          path: ['email'],
        })
      }

      if (!values.country?.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Le pays est requis.',
          path: ['country'],
        })
      }
    }

    if (MANUAL_PAYMENT_METHODS.includes(values.paymentMethod as (typeof MANUAL_PAYMENT_METHODS)[number])) {
      const manualValidation = manualPaymentValidationSchema.safeParse({
        paymentMethod: values.paymentMethod,
        reference: values.transactionReference ?? '',
        proofFileName: values.proofFileName ?? '',
        proofMimeType: values.proofMimeType ?? '',
        proofFileSize: values.proofFileSize ?? 0,
      })

      if (!manualValidation.success) {
        for (const issue of manualValidation.error.issues) {
          const mappedPath =
            issue.path[0] === 'reference'
              ? 'transactionReference'
              : issue.path[0] === 'proofFileName' ||
                  issue.path[0] === 'proofMimeType' ||
                  issue.path[0] === 'proofFileSize'
                ? 'proofImage'
                : issue.path[0]

          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: issue.message,
            path: [mappedPath],
          })
        }
      }

      if (!values.transactionReference?.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La référence de paiement est requise.',
          path: ['transactionReference'],
        })
      }

      if (!values.proofImage?.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Une preuve de paiement est requise.',
          path: ['proofImage'],
        })
      }
    }
  })

export type DonationWizardFormValues = z.infer<typeof donationWizardSchema>
