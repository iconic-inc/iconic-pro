import { ActionFunctionArgs } from '@remix-run/node';
import { appendToSheet } from '~/configs/google-sheets.config';
import { COURSE_LEVELS, COURSES } from '~/constants/courses.constant';
import { createBooking } from '~/services/booking.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  switch (request.method) {
    case 'POST':
      try {
        const formData = await request.formData();
        const course = formData.get('course');
        const courseLevel = formData.get('courseLevel');
        const name = formData.get('name');
        const phone = formData.get('phone');

        if (!course || !name || !phone || !courseLevel) {
          return Response.json(
            { success: false, message: 'Vui lòng điền đầy đủ thông tin.' },
            { status: 400 },
          );
        }

        // Format data for Google Sheets
        // Each row is an array of values corresponding to columns
        const courseName =
          COURSES.find((crs) => crs.value === course)?.label || 'Khác';
        const courseLevelName =
          COURSE_LEVELS.find((level) => level.value === courseLevel)?.label ||
          'Khác';

        // const values = [
        //   [
        //     name.toString(),
        //     phone.toString(),
        //     courseName,
        //     courseLevelName,
        //     new Date().toLocaleDateString('vi-VN', {
        //       year: 'numeric',
        //       month: '2-digit',
        //       day: '2-digit',
        //       hour: '2-digit',
        //       minute: '2-digit',
        //     }), // Add timestamp
        //   ],
        // ];

        // Append data to Google Sheet
        // await appendToSheet(values);
        await createBooking({
          name: name.toString(),
          msisdn: phone.toString(),
          courseName,
          courseLevel: courseLevelName,
        });

        return Response.json({
          success: true,
          message: 'Đăng ký thành công.',
        });
      } catch (error) {
        console.error('Registration error:', error);
        return Response.json(
          {
            success: false,
            message: 'Đã xảy ra lỗi trong quá trình đăng ký.',
          },
          { status: 500 },
        );
      }

    default:
      return Response.json(
        { success: false, message: 'Phương thức không hợp lệ.' },
        { status: 405 },
      );
  }
};
