// vendors
import { Input } from '@nextui-org/input'
// icons
import { Eye, EyeOff } from 'lucide-react'
//
import { usePasswordVisibilityState } from '../_stores/password-visibility'
import { useFormSubmissionState } from '@/stores/form-submission'
import { useErrorMessageState } from '@/stores/input-error-message'

export default function ConfirmPasswordField() {
  // Stores
  const { isSubmitting } = useFormSubmissionState()
  const { isVisible, toggleVisibility } = usePasswordVisibilityState(
    state => state.confirmPassword,
  )
  const { fields } = useErrorMessageState()

  const errorMessage = fields.find(
    field => field.identifier === 'confirm_password',
  )?.message

  return (
    <Input
      label="Konfirmasi Kata Sandi Baru"
      name="confirm_password"
      isRequired
      isDisabled={isSubmitting}
      isInvalid={!!errorMessage}
      errorMessage={errorMessage}
      endContent={
        <button
          tabIndex={-1}
          className="focus:outline-none"
          type="button"
          onClick={() => toggleVisibility()}
          aria-label="toggle confirm-password visibility">
          {isVisible ? (
            <EyeOff className="pointer-events-none text-2xl text-default-400" />
          ) : (
            <Eye className="pointer-events-none text-2xl text-default-400" />
          )}
        </button>
      }
      type={isVisible ? 'text' : 'password'}
    />
  )
}
