import * as yup from 'yup';
import { getCookiesClient, handleGetInformationClient } from '../../api/Client/Auth';
import { getCookiesAdmin, handleGetInformationAdmin } from '../../api/Admin/Auth/authAPI';
export const registerClientSchema = yup.object({
  first_name: yup
    .string()
    .required('Vui lòng nhập tên')
    .matches(
      /^[0-9a-zA-Z\sáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ.\-\_]+$/,
      'Không đúng định dạng'
    )
    .min(1)
    .max(50)
    .trim(),
  last_name: yup
    .string()
    .required('Vui lòng nhập họ')
    .matches(
      /^[0-9a-zA-Z\sáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ.\-\_]+$/,
      'Không đúng định dạng'
    )
    .min(1)
    .max(50)
    .trim(),
  student_code: yup
    .string()
    .matches(/^[0-9\s]+$/, 'Không đúng định dạng (0-9)')
    .required('Vui lòng nhập mã sinh viên')
    .min(1),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .matches(/^[0-9a-zA-Z\s]+$/, 'Không đúng định dạng')
    .min(8, 'Mật khẩu phải trên 8 ký tự')
    .trim(),
  email: yup
    .string()
    .required('Vui lòng nhập email')
    .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Không đúng định dạng')

    .trim(),
});

export const checkLoginClient = () => {
  const getTokenClient = getCookiesClient('tokenClient');
  return getTokenClient ? true : false;
};
export const handleGetMeClient = async () => {
  const response = await handleGetInformationClient();
  if (response === 401) {
    return 401;
  } else {
    return response;
  }
};

// Admin

export const loginAdminSchema = yup.object({
  teacher_code: yup
    .string()
    .matches(/^[0-9\s]+$/, 'Không đúng định dạng (0-9)')
    .required('Vui lòng nhập mã giảng viên')
    .min(1),
  password: yup.string().required('Vui lòng nhập mật khẩu').trim(),
});

export const registerAdminSchema = yup.object({
  first_name: yup
    .string()
    .required('Vui lòng nhập tên')
    .matches(
      /^[0-9a-zA-Z\sáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ.\-\_]+$/,
      'Không đúng định dạng'
    )
    .min(1)
    .max(50)
    .trim(),
  last_name: yup
    .string()
    .required('Vui lòng nhập họ')
    .matches(
      /^[0-9a-zA-Z\sáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ.\-\_]+$/,
      'Không đúng định dạng'
    )
    .min(1)
    .max(50)
    .trim(),
  teacher_code: yup
    .string()
    .matches(/^[0-9\s]+$/, 'Không đúng định dạng (0-9)')
    .required('Vui lòng nhập mã sinh viên')
    .min(1),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .matches(/^[0-9a-zA-Z\s]+$/, 'Không đúng định dạng')
    .min(8, 'Mật khẩu phải trên 8 ký tự')
    .trim(),
  email: yup
    .string()
    .required('Vui lòng nhập email')
    .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Không đúng định dạng')
    .trim(),
});

export const checkLoginAdmin = () => {
  const getTokenAdmin = getCookiesAdmin('token');
  return getTokenAdmin ? true : false;
};
export const handleGetMeAdmin = async () => {
  const response = await handleGetInformationAdmin();
  if (response === 401) {
    return 401;
  } else {
    return response;
  }
};
