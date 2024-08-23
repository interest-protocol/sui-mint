import { TimeScale } from '@interest-protocol/dca-sdk';
import * as yup from 'yup';

export const dcaValidationSchema = yup.object({
  from: yup.object({
    type: yup.string().required('Select the coin to pay'),
    display: yup
      .string()
      .required('Set the amount to pay')
      .test({
        name: 'amount',
        test(value, ctx) {
          if (!Number(value))
            return ctx.createError({
              message: 'Amount should be greater than 0',
            });

          return true;
        },
      }),
  }),
  to: yup.object({
    type: yup.string().required('Select the coin to get'),
  }),
  orders: yup.number().min(2, 'You cannot add numbers less than 0').required(),
  periodicity: yup.number().required(),
  intervals: yup
    .number()
    .required()
    .test({
      name: 'range',
      test(value, ctx) {
        if (!value)
          return ctx.createError({ message: 'Set the interval value' });

        if (
          ctx.parent.periodicity === TimeScale.Seconds &&
          (value < 30 || value > 59)
        )
          return ctx.createError({
            message: 'Seconds valid between 30 and 59',
          });

        if (
          ctx.parent.periodicity === TimeScale.Minutes &&
          (value < 1 || value > 59)
        )
          return ctx.createError({ message: 'Minutes valid between 1 and 59' });

        if (
          ctx.parent.periodicity === TimeScale.Hour &&
          (value < 1 || value > 24)
        )
          return ctx.createError({ message: 'Hours valid between 1 and 24' });

        if (
          ctx.parent.periodicity === TimeScale.Day &&
          (value < 1 || value > 6)
        )
          return ctx.createError({ message: 'Days valid between 1 and 6' });

        if (
          ctx.parent.periodicity === TimeScale.Week &&
          (value < 1 || value > 4)
        )
          return ctx.createError({ message: 'Weeks valid between 1 and 4' });

        if (
          ctx.parent.periodicity === TimeScale.Month &&
          (value < 1 || value > 12)
        )
          return ctx.createError({ message: 'Months valid between 1 and 12' });

        return true;
      },
    }),
});