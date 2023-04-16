import * as yup from 'yup';
export const addSchema = yup.object({
  class_name: yup
    .string()
    .required('Vui lòng nhập tên lớp')
    .matches(/^[0-9a-zA-Z\s]+$/, 'Không đúng định dạng')
    .min(1)
    .max(10)
    .trim(),
  number_roll_call: yup
    .number()
    .typeError('Vui lòng nhập số tuần từ 1-20')
    .min(1)
    .max(20)
    .required('Vui lòng nhập số tuần'),
  number_lesson_week: yup
    .number()
    .typeError('Vui lòng nhập số tiết từ 1 - 5')
    .required('Vui lòng nhập số tiết')
    .max(5)
    .min(1),
});
export const addSchemaStudent = yup.object({
  student_code: yup
    .string()
    .required('Vui lòng nhập Mã sinh viên')
    .matches(/^[0-9\s]+$/, 'Không đúng định dạng')
    .max(20)
    .trim(),
  last_name: yup
    .string()
    .required('Vui lòng nhập tên')
    .matches(/^[0-9a-zA-Z\s]+$/, 'Không đúng định dạng')
    .max(256)
    .trim(),
  first_name: yup
    .string()
    .required('Vui lòng nhập họ')
    .matches(/^[0-9a-zA-Z\s]+$/, 'Không đúng định dạng')
    .max(256)
    .trim(),
});
