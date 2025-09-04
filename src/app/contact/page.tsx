"use client";

import React, { useState } from "react";
import { TextField, Button, Alert, Snackbar } from "@mui/material";
import { Send, Phone, Mail, MapPin } from "lucide-react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
// import Footer from "@/components/dictionary/FooterComponent";
import { submitContact } from "@/lib/contactApi";

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

export default function ContactPage() {
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

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Ismingizni kiriting";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Ism kamida 3 ta harfdan iborat bo‘lishi kerak";
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿʼ'‘’\-. ]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = "Ism faqat harflar iborat bo‘lishi kerak";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Pochta manzilingizni kiriting";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Iltimos haqiqiy pochta manzilini kiriting";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Xat matnini kiriting";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Xat matni juda kam";
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

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await submitContact({
        full_name: formData.fullName,
        email_address: formData.email,
        message: formData.message,
      });

      setFormData({ fullName: "", email: "", message: "" });
      setShowSuccess(true);
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      // Optionally show error Snackbar
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="flex flex-col pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 md:pb-16 transition-all duration-300">
        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
            {/* Header Section */}
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#001c3b] mb-3 sm:mb-4 tracking-tight">
                Diplomatik Akademiya
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
                Diplomatik {"ta'lim"} va xalqaro munosabatlarning mukammalligi
              </p>
              <div className="w-16 sm:w-20 md:w-24 h-1 bg-[#c9a96e] mx-auto mt-4 sm:mt-6"></div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Contact Information */}
              <div className="lg:col-span-1">
                <div className="bg-[#001c3b] text-white p-6 sm:p-8 rounded-xl shadow-lg h-fit">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6">
                    Kontakt Malumotlar
                  </h2>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#c9a96e] mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-sm sm:text-base mb-1">
                          Manzil
                        </h3>
                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                          100007, <br /> {"Oʻzbekiston"}, Toshkent, <br />{" "}
                          Mustaqillik shoh {"koʻchasi"}, 54.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-[#c9a96e] mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-sm sm:text-base mb-1">
                          Telefon
                        </h3>
                        <p className="text-gray-300 text-xs sm:text-sm">
                          (+998 71) 267-07-06 (232)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[#c9a96e] mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-sm sm:text-base mb-1">
                          Pochta
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
                    Biz bilan {"bog'laning"}
                  </h2>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-6"
                  >
                    <div>
                      <TextField
                        fullWidth
                        label="Toʻliq Ismingiz"
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
                        label="Pochta manzilingiz"
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
                        label="Xat matni"
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
                        {isSubmitting ? "Yuborilmoqda..." : "Xat yuborish"}
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
            Thank you for your message! We will get back to you shortly.
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}

// {/* Footer */}
//         {/* <Footer /> */}
