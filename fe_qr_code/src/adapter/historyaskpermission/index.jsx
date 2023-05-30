import * as yup from 'yup';
export const addAskHistoryPermission = yup.object({
  number_roll_call: yup
    .string()
    .typeError('Vui lòng chọn tuần ')
    .test('not-select-week', 'Vui lòng chọn tuần', (value) => value !== '0')
    .required('Vui lòng chọn tuần'),
  number_lesson_week: yup
    .string()
    .typeError('Vui lòng chọn tiết')
    .test('not-select-week', 'Vui lòng chọn tuần', (value) => value !== '0')
    .required('Vui lòng chọn tiết'),
  reason: yup.string().required('Vui lòng nhập lý do').trim(),
});
