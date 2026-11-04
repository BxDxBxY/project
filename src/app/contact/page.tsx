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
import { apiErrorMessage } from "@/lib/apiErrors";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

// Create custom theme with diplomatic colors
const theme = createTheme({
  palette: {
    primary: { main: "#001c3b", light: "#1e3a5f", dark: "#000a1a" },
    secondary: { main: "#8a6d33", light: "#c9a96e", dark: "#6b5327" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#fff",
    "&:hover fieldset": { borderColor: "#001c3b" },
    "&.Mui-focused fieldset": { borderColor: "#001c3b", borderWidth: 2 },
  },
  "& .MuiInputLabel-root": { fontSize: { xs: "0.875rem", sm: "1rem" } },
  "& .MuiInputLabel-root.Mui-focused": { color: "#001c3b" },
  "& .MuiInputBase-input": { fontSize: { xs: "0.875rem", sm: "1rem" } },
  "& .MuiFormHelperText-root": { marginLeft: 0, marginTop: "6px" },
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

const MESSAGE_MAX = 2000;

export default function ContactPage() {
  const { language } = useLanguage();
  const t = translations[language].contact;
  const tNet = translations[language].network;
  const { online } = useNetworkStatus();

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
  const [sentOnce, setSentOnce] = useState(false);
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
      if (submitError) setSubmitError(null);
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    if (!online) {
      setSubmitError(tNet.offlineText);
      return;
    }

    setIsSubmitting(true);
    try {
      // Rozilik berilgandan keyingina spamdan himoya tokeni olinadi.
      //
      // Captcha never blocks a genuine message: if Google is unreachable, or
      // the configured key turns out to be the wrong reCAPTCHA version, the
      // form still sends. The server then applies a tighter rate limit to
      // unverified submissions instead of refusing them outright.
      let captchaToken: string | undefined;
      if (isConfigured) {
        try {
          captchaToken = await execute("submit_contact");
        } catch (captchaError) {
          console.warn("reCAPTCHA unavailable, sending unverified:", captchaError);
        }
      }

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
      setSentOnce(true);
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      setSubmitError(apiErrorMessage(error, language));
    } finally {
      setIsSubmitting(false);
    }
  };

  const messageLength = formData.message.length;

  return (
    <ThemeProvider theme={theme}>
      <PageContainer maxWidth="md">
        {/* Header Section */}
        <header className="text-center mb-10 sm:mb-12">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#001c3b] mb-3 tracking-tight">
            {t.title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
          <div
            className="w-16 sm:w-20 md:w-24 h-1 bg-[#c9a96e] mx-auto mt-5"
            aria-hidden="true"
          />
        </header>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          {/* Contact Information */}
          <section
            aria-labelledby="contact-info-title"
            className="lg:col-span-2 bg-[#001c3b] text-white p-6 sm:p-8 rounded-2xl shadow-lg"
          >
            <h2
              id="contact-info-title"
              className="text-lg sm:text-xl font-semibold mb-6"
            >
              {t.infoTitle}
            </h2>

            <address className="not-italic space-y-6">
              <div className="flex items-start gap-4">
                <MapPin
                  className="w-5 h-5 text-[#e0c48f] mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm mb-1.5">{t.address}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                    {t.addressDetails}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone
                  className="w-5 h-5 text-[#e0c48f] mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm mb-1.5">{t.phone}</h3>
                  <a
                    href="tel:+998712670706"
                    className="text-gray-300 text-sm underline underline-offset-2 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c48f] rounded-sm"
                  >
                    (+998 71) 267-07-06 (232)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail
                  className="w-5 h-5 text-[#e0c48f] mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm mb-1.5">{t.email}</h3>
                  <a
                    href="mailto:info@da-uwed.uz"
                    className="text-gray-300 text-sm underline underline-offset-2 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c48f] rounded-sm break-all"
                  >
                    info@da-uwed.uz
                  </a>
                </div>
              </div>
            </address>
          </section>

          {/* Contact Form */}
          <section
            aria-labelledby="contact-form-title"
            className="lg:col-span-3 bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100"
          >
            <h2
              id="contact-form-title"
              className="text-lg sm:text-xl font-semibold text-[#001c3b]"
            >
              {t.formTitle}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
              {t.dataNotice}
            </p>

            <hr className="my-6 border-gray-100" />

            <form onSubmit={handleSubmit} onFocus={prepare} noValidate>
              {/* Ism va pochta — keng ekranda yonma-yon, telefonda ustma-ust */}
              <div className="grid sm:grid-cols-2 gap-5">
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  sx={fieldSx}
                />
              </div>

              <div className="mt-5">
                <TextField
                  fullWidth
                  label={t.msgLabel}
                  multiline
                  rows={7}
                  value={formData.message}
                  onChange={handleInputChange("message")}
                  error={!!errors.message}
                  helperText={errors.message}
                  variant="outlined"
                  required
                  disabled={isSubmitting}
                  slotProps={{ htmlInput: { maxLength: MESSAGE_MAX } }}
                  sx={fieldSx}
                />
                <p className="mt-1.5 text-right text-xs text-gray-400 tabular-nums">
                  {messageLength} / {MESSAGE_MAX}
                </p>
              </div>

              {/* Shaxsga oid maʼlumotlarni qayta ishlashga rozilik */}
              <div
                className={`mt-5 rounded-xl border p-4 transition-colors ${
                  errors.consent
                    ? "border-red-300 bg-red-50/60"
                    : "border-gray-200 bg-gray-50/60"
                }`}
              >
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
                      disabled={isSubmitting}
                      inputProps={{
                        "aria-describedby": errors.consent
                          ? "consent-error"
                          : undefined,
                      }}
                      sx={{
                        paddingTop: 0,
                        color: errors.consent ? "#d32f2f" : "#001c3b",
                        "&.Mui-checked": { color: "#001c3b" },
                      }}
                    />
                  }
                  label={
                    <span className="text-xs sm:text-sm text-gray-800 leading-relaxed block">
                      {t.consentLabel}{" "}
                      <Link
                        href="/privacy"
                        className="text-[#00527a] underline underline-offset-2 hover:text-[#001c3b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001c3b] rounded-sm"
                      >
                        {t.consentLink}
                      </Link>
                    </span>
                  }
                  sx={{ alignItems: "flex-start", mr: 0, ml: "-9px" }}
                />
                {errors.consent && (
                  <FormHelperText id="consent-error" error sx={{ ml: 0 }}>
                    {errors.consent}
                  </FormHelperText>
                )}
              </div>

              {submitError && (
                <Alert
                  severity="error"
                  role="alert"
                  sx={{ mt: 2.5, borderRadius: "12px" }}
                >
                  {submitError}
                </Alert>
              )}

              {sentOnce && !submitError && !showSuccess && (
                <Alert
                  severity="success"
                  role="status"
                  sx={{ mt: 2.5, borderRadius: "12px" }}
                >
                  {t.successMsg}
                </Alert>
              )}

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                    py: 1.5,
                    px: 4,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: "12px",
                    alignSelf: "flex-start",
                    "&:hover": { backgroundColor: "#000a1a" },
                    "&:disabled": { backgroundColor: "#4b5563", color: "#fff" },
                  }}
                >
                  {isSubmitting ? t.btnSending : t.btnSend}
                </Button>

                {/* reCAPTCHA v3 — skript formaga tegilganda yuklanadi */}
                <p className="text-[11px] leading-relaxed text-gray-500 sm:text-right sm:max-w-[16rem]">
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
                  .
                </p>
              </div>
            </form>
          </section>
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
