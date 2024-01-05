import { toast, ToastOptions } from 'react-toastify'

function useToast() {
  const showToast = (message: string, options = {}) => {
    const defaultOptions = {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2500,
      hideProgressBar: true,
    }

    return toast(message, { ...defaultOptions, ...options })
  }

  const showSuccessToast = (message: string, options?: ToastOptions) => {
    return showToast(message, { ...options, type: toast.TYPE.SUCCESS })
  }

  const showErrorToast = (message: string, options?: ToastOptions) => {
    return showToast(message, { ...options, type: toast.TYPE.ERROR })
  }

  const showWarningToast = (message: string, options?: ToastOptions) => {
    return showToast(message, { ...options, type: toast.TYPE.WARNING })
  }

  return {
    showToast,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
  }
}

export default useToast
