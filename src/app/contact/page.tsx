"use client";

import React, { useState } from "react";
import { TextField, Button, Alert, Snackbar } from "@mui/material";
import { Send, Phone, Mail, MapPin } from "lucide-react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Footer from "@/components/dictionary/FooterComponent";

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

interface ContactForm {
  fullName: string;
  email: string;
  message: string;
}

interface StoredContact extends ContactForm {
  id: string;
  timestamp: string;
}

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

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Ismingizni kiriting";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Pochta manzilingizni kiriting";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Iltimos haqiqiy pochta manzilini kiriting";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Xat matnini kiriting";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Xat matni 10ta sozdan kop bo'lishi kerak";
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

  const saveToLocalStorage = (data: ContactForm) => {
    try {
      const existingContacts = JSON.parse(
        localStorage.getItem("diplomaticContacts") || "[]"
      );
      const newContact: StoredContact = {
        ...data,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      };
      existingContacts.push(newContact);
      localStorage.setItem(
        "diplomaticContacts",
        JSON.stringify(existingContacts)
      );
      return true;
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      return false;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const saved = saveToLocalStorage(formData);

    if (saved) {
      setFormData({ fullName: "", email: "", message: "" });
      setShowSuccess(true);
    }

    setIsSubmitting(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-[#001c3b] mb-4">
                Diplomatik Akademiya
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Diplomatik {"ta'lim"} va xalqaro munosabatlarning mukammalligi
              </p>
              <div className="w-24 h-1 bg-[#c9a96e] mx-auto mt-6"></div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Information */}
              <div className="lg:col-span-1">
                <div className="bg-[#001c3b] text-white p-8 rounded-lg shadow-lg h-fit">
                  <h2 className="text-2xl font-semibold mb-6">
                    Kontakt Malumotlar
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <MapPin className="w-5 h-5 text-[#c9a96e] mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium mb-1">Manzil</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          100007, <br /> {"Oʻzbekiston"}, Toshkent, <br />{" "}
                          Mustaqillik shoh {"koʻchasi"}, 54.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Phone className="w-5 h-5 text-[#c9a96e] mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium mb-1">Telefon</h3>
                        <p className="text-gray-300 text-sm">
                          (+998 71) 267-07-06 (232)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Mail className="w-5 h-5 text-[#c9a96e] mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium mb-1">Pochta</h3>
                        <p className="text-gray-300 text-sm">info@da-uwed.uz</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-semibold text-[#001c3b] mb-6">
                    Biz bilan {"bog'laning"}
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <TextField
                        fullWidth
                        label="Toliq Ismingiz"
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
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#001c3b",
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
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#001c3b",
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
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#001c3b",
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
                        startIcon={<Send className="w-4 h-4" />}
                        sx={{
                          backgroundColor: "#001c3b",
                          py: 1.5,
                          px: 4,
                          fontSize: "1.1rem",
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

        {/* Footer */}
        {/* <Footer /> */}

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
            sx={{ width: "100%" }}
          >
            Thank you for your message! We will get back to you shortly.
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}
