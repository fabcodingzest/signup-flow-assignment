import * as yup from "yup";

const phoneNumberLengthByCountryCode: Record<string, number> = {
  "+1": 10,
  "+91": 10,
};
const namePattern = /^[A-Za-z\s]+$/;

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
  otp: yup
    .string()
    .required("Enter the 4-digit OTP.")
    .length(4, "Enter the 4-digit OTP."),
  firstName: yup
    .string()
    .required("First name is required.")
    .matches(namePattern, "First name can only contain letters.")
    .min(3, "First name must be at least 3 characters.")
    .max(40, "First name must be 40 characters or fewer."),
  lastName: yup
    .string()
    .default("")
    .test("last-name-characters", "Last name can only contain letters.", (value) => {
      if (!value) {
        return true;
      }

      return namePattern.test(value);
    })
    .test("last-name-min-length", "Last name must be at least 3 characters.", (value) => {
      if (!value) {
        return true;
      }

      return value.length >= 3;
    })
    .max(40, "Last name must be 40 characters or fewer."),
  password: yup
    .string()
    .required("Password is required.")
    .min(6, "Password must be at least 6 characters."),
  confirmPassword: yup
    .string()
    .required("Please confirm your password.")
    .oneOf([yup.ref("password")], "Both passwords must match."),
});
