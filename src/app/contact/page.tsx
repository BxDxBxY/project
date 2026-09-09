"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TextField,
  Button,
  Alert,
  Snackbar,
  Checkbox,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import { Send, Phone, Mail, MapPin } from "lucide-react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { submitContact } from "@/lib/contactApi";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/constants/translations";
import { PageContainer } from "@/components/ui/PageContainer";
import { useLazyRecaptcha } from "@/lib/useLazyRecaptcha";

// Create custom theme with diplomatic colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#001c3b",
      light: "#1e3a5f",
      dark: "#000a1a",
    },
    secondary: {
      main: "#8a6d33",
      light: "#c9a96e",
      dark: "#6b5327",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": { borderColor: "#001c3b" },
    "&.Mui-focused fieldset": { borderColor: "#001c3b", borderWidth: 2 },
  },
  "& .MuiInputLabel-root": { fontSize: { xs: "0.875rem", sm: "1rem" } },
  "& .MuiInputLabel-root.Mui-focused": { color: "#001c3b" },
  "& .MuiInputBase-input": { fontSize: { xs: "0.875rem", sm: "1rem" } },
};

interface ContactFormValues {
  fullName: string;
  email: string;
  message: string;
}

type FormErrors = Partial<Record<keyof ContactFormValues | "consent", string>>;

// Lotin va kirill harflarini, oʻzbekcha apostroflarni qabul qiladi.
const NAME_PATTERN = /^[\p{L}\p{M}'ʻʼ‘’\-. ]+$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactPage() {
  const { language } = useLanguage();
  const t = translations[language].contact;

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const { prepare, execute, isConfigured } = useLazyRecaptcha(siteKey);

  const [formData, setFormData] = useState<ContactFormValues>({
    fullName: "",
    email: "",
    message: "",
  });
  const [consentGiven, setConsentGiven] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t.nameErrors.required;
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = t.nameErrors.min;
    } else if (!NAME_PATTERN.test(formData.fullName.trim())) {
      newErrors.fullName = t.nameErrors.pattern;
    }

    if (!formData.email.trim()) {
      newErrors.email = t.emailErrors.required;
    } else if (!EMAIL_PATTERN.test(formData.email)) {
      newErrors.email = t.emailErrors.pattern;
    }

    if (!formData.message.trim()) {
      newErrors.message = t.msgErrors.required;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t.msgErrors.min;
    }

    if (!consentGiven) {
      newErrors.consent = t.consentError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange =
    (field: keyof ContactFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [field]: event.target.value });
      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Rozilik berilgandan keyingina spamdan himoya tokeni olinadi.
      const captchaToken = isConfigured
        ? await execute("submit_contact")
        : undefined;

      await submitContact(
        {
          full_name: formData.fullName.trim(),
          email_address: formData.email.trim(),
          message: formData.message.trim(),
        },
        captchaToken,
      );

      setFormData({ fullName: "", email: "", message: "" });
      setConsentGiven(false);
      setShowSuccess(true);
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      setSubmitError(t.errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <PageContainer maxWidth="md">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#001c3b] mb-3 sm:mb-4 tracking-tight">
            {t.title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
          <div
            className="w-16 sm:w-20 md:w-24 h-1 bg-[#c9a96e] mx-auto mt-4 sm:mt-6"
            aria-hidden="true"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <section
              aria-labelledby="contact-info-title"
              className="bg-[#001c3b] text-white p-6 sm:p-8 rounded-xl shadow-lg h-fit"
            >
              <h2
                id="contact-info-title"
                className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6"
              >
                {t.infoTitle}
              </h2>

              <address className="not-italic space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <MapPin
                    className="w-5 h-5 sm:w-6 sm:h-6 text-[#e0c48f] mt-1 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-medium text-sm sm:text-base mb-1">
                      {t.address}
                    </h3>
                    <p className="text-gray-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                      {t.addressDetails}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <Phone
                    className="w-5 h-5 sm:w-6 sm:h-6 text-[#e0c48f] mt-1 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-medium text-sm sm:text-base mb-1">
                      {t.phone}
                    </h3>
                    <a
                      href="tel:+998712670706"
                      className="text-gray-200 text-xs sm:text-sm underline underline-offset-2 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c48f] rounded-sm"
                    >
                      (+998 71) 267-07-06 (232)
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <Mail
                    className="w-5 h-5 sm:w-6 sm:h-6 text-[#e0c48f] mt-1 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-medium text-sm sm:text-base mb-1">
                      {t.email}
                    </h3>
                    <a
                      href="mailto:info@da-uwed.uz"
                      className="text-gray-200 text-xs sm:text-sm underline underline-offset-2 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c48f] rounded-sm"
                    >
                      info@da-uwed.uz
                    </a>
                  </div>
                </div>
              </address>
            </section>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <section
              aria-labelledby="contact-form-title"
              className="bg-white p-6 sm:p-8 rounded-xl shadow-lg"
            >
              <h2
                id="contact-form-title"
                className="text-lg sm:text-xl md:text-2xl font-semibold text-[#001c3b] mb-2"
              >
                {t.formTitle}
              </h2>
              <p className="text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6">
                {t.dataNotice}
              </p>

              <form
                onSubmit={handleSubmit}
                onFocus={prepare}
                noValidate
                className="space-y-4 sm:space-y-6"
              >
                <TextField
                  fullWidth
                  label={t.nameLabel}
                  value={formData.fullName}
                  onChange={handleInputChange("fullName")}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  variant="outlined"
                  required
                  autoComplete="name"
                  sx={fieldSx}
                />

                <TextField
                  fullWidth
                  label={t.emailLabel}
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  error={!!errors.email}
                  helperText={errors.email}
                  variant="outlined"
                  required
                  autoComplete="email"
                  sx={fieldSx}
                />

                <TextField
                  fullWidth
                  label={t.msgLabel}
                  multiline
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange("message")}
                  error={!!errors.message}
                  helperText={errors.message}
                  variant="outlined"
                  required
                  sx={fieldSx}
                />

                {/* Shaxsga oid maʼlumotlarni qayta ishlashga rozilik */}
                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={consentGiven}
                        onChange={(event) => {
                          setConsentGiven(event.target.checked);
                          if (event.target.checked) {
                            setErrors({ ...errors, consent: undefined });
                          }
                        }}
                        required
                        inputProps={{
                          "aria-describedby": errors.consent
                            ? "consent-error"
                            : undefined,
                        }}
                        sx={{
                          color: errors.consent ? "#d32f2f" : "#001c3b",
                          "&.Mui-checked": { color: "#001c3b" },
                        }}
                      />
                    }
                    label={
                      <span className="text-xs sm:text-sm text-gray-800">
                        {t.consentLabel}
                      </span>
                    }
                    sx={{ alignItems: "flex-start", mr: 0 }}
                  />
                  <div className="pl-8 -mt-1">
                    <Link
                      href="/privacy"
                      className="text-xs sm:text-sm text-[#00527a] underline underline-offset-2 hover:text-[#001c3b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001c3b] rounded-sm"
                    >
                      {t.consentLink}
                    </Link>
                  </div>
                  {errors.consent && (
                    <FormHelperText id="consent-error" error>
                      {errors.consent}
                    </FormHelperText>
                  )}
                </div>

                {/* reCAPTCHA v3 — skript formaga tegilganda yuklanadi */}
                <p className="text-xs text-gray-600">
                  {t.recaptchaNoticePrefix}{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    className="text-[#00527a] underline underline-offset-2 hover:text-[#001c3b]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.recaptchaPrivacy}
                  </a>
                  {", "}
                  <a
                    href="https://policies.google.com/terms"
                    className="text-[#00527a] underline underline-offset-2 hover:text-[#001c3b]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.recaptchaTerms}
                  </a>
                  {". "}
                  {t.recaptchaNoticeSuffix}
                </p>

                {submitError && (
                  <Alert severity="error" role="alert">
                    {submitError}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  startIcon={
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                  }
                  sx={{
                    backgroundColor: "#001c3b",
                    py: { xs: 1, sm: 1.5 },
                    px: { xs: 3, sm: 4 },
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 2,
                    "&:hover": { backgroundColor: "#000a1a" },
                    "&:disabled": { backgroundColor: "#4b5563", color: "#fff" },
                  }}
                >
                  {isSubmitting ? t.btnSending : t.btnSend}
                </Button>
              </form>
            </section>
          </div>
        </div>

        {/* Success Snackbar */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={6000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setShowSuccess(false)}
            severity="success"
            role="status"
            sx={{ width: "100%", fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            {t.successMsg}
          </Alert>
        </Snackbar>
      </PageContainer>
    </ThemeProvider>
  );
}
