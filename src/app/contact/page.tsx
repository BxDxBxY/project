"use client";

import React, { useState } from "react";
import { TextField, Button, Alert, Snackbar } from "@mui/material";
import { Send, Phone, Mail, MapPin } from "lucide-react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
// import Footer from "@/components/dictionary/FooterComponent";
import { submitContact } from "@/lib/contactApi";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/constants/translations";

// Create custom theme with diplomatic colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#001c3b",
      light: "#1e3a5f",
      dark: "#000a1a",
    },
    secondary: {
      main: "#c9a96e",
      light: "#ddc49c",
      dark: "#a8834a",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";

interface ContactForm {
  fullName: string;
  email: string;
  message: string;
}

function ContactFormInner() {
  const { language } = useLanguage();
  const t = translations[language].contact;
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formData, setFormData] = useState<ContactForm>({
    fullName: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactForm> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t.nameErrors.required;
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = t.nameErrors.min;
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿʼ'‘’\-. ]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = t.nameErrors.pattern;
    }

    if (!formData.email.trim()) {
      newErrors.email = t.emailErrors.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.emailErrors.pattern;
    }

    if (!formData.message.trim()) {
      newErrors.message = t.msgErrors.required;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t.msgErrors.min;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange =
    (field: keyof ContactForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [field]: event.target.value });
      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    if (!executeRecaptcha) {
      alert(
        "Iltimos, kuting. ReCAPTCHA tekshirilmoqda. (Please wait. ReCAPTCHA is loading.)",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const captchaToken = await executeRecaptcha("submit_contact");
      await submitContact(
        {
          full_name: formData.fullName,
          email_address: formData.email,
          message: formData.message,
        },
        captchaToken,
      );

      setFormData({ fullName: "", email: "", message: "" });
      setShowSuccess(true);
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      alert(
        "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring yoki bot emasligingizni tasdiqlang.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="flex flex-col pt-28 sm:pt-32 md:pt-36 pb-8 sm:pb-12 md:pb-16 transition-all duration-300">
        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
            {/* Header Section */}
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#001c3b] mb-3 sm:mb-4 tracking-tight">
                {t.title}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
                {t.subtitle}
              </p>
              <div className="w-16 sm:w-20 md:w-24 h-1 bg-[#c9a96e] mx-auto mt-4 sm:mt-6"></div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Contact Information */}
              <div className="lg:col-span-1">
                <div className="bg-[#001c3b] text-white p-6 sm:p-8 rounded-xl shadow-lg h-fit">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6">
                    {t.infoTitle}
                  </h2>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#c9a96e] mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-sm sm:text-base mb-1">
                          {t.address}
                        </h3>
                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                          {t.addressDetails}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-[#c9a96e] mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-sm sm:text-base mb-1">
                          {t.phone}
                        </h3>
                        <a
                          href="tel:+998712670706"
                          className="text-gray-300 text-xs sm:text-sm"
                        >
                          (+998 71) 267-07-06 (232)
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[#c9a96e] mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-sm sm:text-base mb-1">
                          {t.email}
                        </h3>
                        <p className="text-gray-300 text-xs sm:text-sm">
                          info@da-uwed.uz
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#001c3b] mb-4 sm:mb-6">
                    {t.formTitle}
                  </h2>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-6"
                  >
                    <div>
                      <TextField
                        fullWidth
                        label={t.nameLabel}
                        value={formData.fullName}
                        onChange={handleInputChange("fullName")}
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        variant="outlined"
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                              borderColor: "#001c3b",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#001c3b",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#001c3b",
                          },
                          "& .MuiInputBase-input": {
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          },
                        }}
                      />
                    </div>

                    <div>
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
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                              borderColor: "#001c3b",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#001c3b",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#001c3b",
                          },
                          "& .MuiInputBase-input": {
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          },
                        }}
                      />
                    </div>

                    <div>
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
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                              borderColor: "#001c3b",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#001c3b",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#001c3b",
                          },
                          "& .MuiInputBase-input": {
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          },
                        }}
                      />
                    </div>

                    {/* V3 doesn't need the visual component, it runs in background */}
                    <div className="text-xs text-gray-400 mt-2">
                      Ushbu sayt Google reCAPTCHA bilan himoyalangan va Google{" "}
                      <a
                        href="https://policies.google.com/privacy"
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Maxfiylik siyosati
                      </a>{" "}
                      hamda{" "}
                      <a
                        href="https://policies.google.com/terms"
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Foydalanish shartlari
                      </a>{" "}
                      qo&apos;llaniladi.
                    </div>

                    <div>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isSubmitting}
                        startIcon={<Send className="w-4 h-4 sm:w-5 sm:h-5" />}
                        sx={{
                          backgroundColor: "#001c3b",
                          py: { xs: 1, sm: 1.5 },
                          px: { xs: 3, sm: 4 },
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                          fontWeight: 600,
                          textTransform: "none",
                          borderRadius: 2,
                          "&:hover": {
                            backgroundColor: "#000a1a",
                          },
                          "&:disabled": {
                            backgroundColor: "#6b7280",
                          },
                        }}
                      >
                        {isSubmitting ? t.btnSending : t.btnSend}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
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
            sx={{ width: "100%", fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            {t.successMsg}
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}

export default function ContactPage() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "dummy_key";

  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      <ContactFormInner />
    </GoogleReCaptchaProvider>
  );
}
