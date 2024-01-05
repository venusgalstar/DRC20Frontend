import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import '../assets/toastOverrides.css'

const CustomToastContainer = () => {
  return (
    <ToastContainer
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  )
}

export default CustomToastContainer
