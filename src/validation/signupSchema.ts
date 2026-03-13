import * as yup from "yup";

const phoneNumberLengthByCountryCode: Record<string, number> = {
  "+1": 10,
  "+91": 10,
};

export const signupSchema = yup.object({
  accountType: yup.string().required("Select an account type."),
  countryCode: yup.string().required("Select a country code."),
  mobileNumber: yup
    .string()
    .required("Mobile number is required.")
    .test("mobile-number-length", function validateMobileNumberLength(value) {
      const countryCode = this.parent.countryCode;
      const requiredLength = phoneNumberLengthByCountryCode[countryCode];

      if (!value) {
        return false;
      }

      if (!requiredLength) {
        return true;
      }

      if (value.length === requiredLength) {
        return true;
      }

      if (countryCode === "+1") {
        return this.createError({
          message: "Enter a valid 10-digit US mobile number.",
        });
      }

      if (countryCode === "+91") {
        return this.createError({
          message: "Enter a valid 10-digit Indian mobile number.",
        });
      }

      return false;
    }),
});
