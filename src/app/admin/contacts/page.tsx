"use client";

"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Divider,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import {
  fetchAdminContacts,
  fetchAdminContact,
  // deleteAdminContact,
  AdminContact,
} from "@/lib/contactApi";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<AdminContact[]>([]);
  const [loading, setLoading] = useState(true);

  // pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // modal + selection
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<AdminContact | null>(null);

  // toasts
  const [toast, setToast] = useState<{
    open: boolean;
    msg: string;
    sev: "success" | "error";
  }>({
    open: false,
    msg: "",
    sev: "success",
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAdminContacts();
        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        setContacts(sorted);
      } catch (e) {
        setToast({ open: true, msg: "Failed to load contacts.", sev: "error" });
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const onView = async (id: number) => {
    try {
      const data = await fetchAdminContact(id);
      setSelected(data);
      setOpen(true);
    } catch (e) {
      setToast({
        open: true,
        msg: "Failed to load message details.",
        sev: "error",
      });
      console.error(e);
    }
  };

  // const onDelete = async (id: number) => {
  //   if (!confirm("Delete this message?")) return;
  //   try {
  //     await deleteAdminContact(id);
  //     setContacts((prev) => prev.filter((c) => c.id !== id));
  //     setToast({ open: true, msg: "Message deleted.", sev: "success" });
  //     // keep pagination sane if last item on the page removed
  //     const newTotal = contacts.length - 1;
  //     const maxPage = Math.max(0, Math.ceil(newTotal / rowsPerPage) - 1);
  //     if (page > maxPage) setPage(maxPage);
  //   } catch (e) {
  //     setToast({ open: true, msg: "Failed to delete message.", sev: "error" });
  //     console.error(e);
  //   }
  // };

  const paginatedContacts = contacts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <div className="p-6 sm:p-8 md:p-10">
      <Typography
        variant="h4"
        className="!mb-6 font-bold text-[#001c3b] text-center"
      >
        Qabul qilingan xabarlar
      </Typography>

      <Paper className="!rounded-xl !shadow-lg !overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center !h-64">
            <CircularProgress />
          </div>
        ) : (
          <>
            {isMobile ? (
              // 📱 MOBILE VIEW (cards)
              <div className="flex flex-col gap-4 p-3">
                {paginatedContacts.map((contact) => (
                  <Card
                    key={contact.id}
                    className="rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition"
                  >
                    <CardContent className="flex flex-col gap-2">
                      {/* Header Section */}
                      <div className="flex justify-between items-center">
                        <Typography
                          variant="subtitle2"
                          className="text-xs font-medium text-gray-400"
                        >
                          ID: {contact.id}
                        </Typography>
                        <Typography
                          variant="caption"
                          className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 font-medium"
                        >
                          {new Date(contact.created_at).toLocaleDateString()}
                        </Typography>
                      </div>

                      {/* Name & Email */}
                      <div>
                        <Typography
                          variant="h6"
                          className="font-semibold text-[#001c3b]"
                        >
                          {contact.full_name}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="text-blue-600 break-words"
                        >
                          {contact.email_address}
                        </Typography>
                      </div>

                      <Divider className="my-2" />

                      {/* Message */}
                      <div>
                        <Typography
                          variant="subtitle2"
                          className="text-gray-500 text-xs uppercase tracking-wide"
                        >
                          Message
                        </Typography>
                        <Typography
                          variant="body2"
                          className="text-gray-700 whitespace-pre-wrap mt-1"
                        >
                          {contact.message}
                        </Typography>
                      </div>

                      <Divider className="my-2" />

                      {/* Footer */}
                      <Typography variant="caption" className="text-gray-400">
                        Submitted at:{" "}
                        {new Date(contact.created_at).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              // 🖥️ DESKTOP/TABLE VIEW (your original table)
              <TableContainer
                sx={{
                  overflowX: "auto",
                  "&::-webkit-scrollbar": { height: "6px" },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#cbd5e1",
                    borderRadius: "8px",
                  },
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#001c3b" }}>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        ID
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Ism Familiya
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Elektron manzil
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Xat matni
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Yuborilgan vaqt
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        Amallar
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedContacts.map((contact) => (
                      <TableRow
                        key={contact.id}
                        sx={{
                          "&:nth-of-type(odd)": { backgroundColor: "#f9fafb" },
                          "&:hover": { backgroundColor: "#f1f5f9" },
                        }}
                      >
                        <TableCell>{contact.id}</TableCell>
                        <TableCell>{contact.full_name}</TableCell>
                        <TableCell>{contact.email_address}</TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {contact.message}
                        </TableCell>
                        <TableCell>
                          {new Date(contact.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => onView(contact.id)}
                          >
                            <Visibility />
                          </IconButton>
                          {/* <IconButton
                            color="error"
                            onClick={() => onDelete(contact.id)}
                          >
                            <Delete />
                          </IconButton> */}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Pagination (shared for both views) */}
            <TablePagination
              component="div"
              count={contacts.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              sx={{
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                  { fontSize: "0.8rem" },
              }}
            />
          </>
        )}
      </Paper>
      {/* View Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Contact Message Details</DialogTitle>
        <DialogContent dividers>
          {selected ? (
            <div className="space-y-2">
              <Typography>
                <strong>ID:</strong> {selected.id}
              </Typography>
              <Typography>
                <strong>Full Name:</strong> {selected.full_name}
              </Typography>
              <Typography>
                <strong>Email:</strong> {selected.email_address}
              </Typography>
              <Typography className="whitespace-pre-wrap">
                <strong>Message:</strong> {selected.message}
              </Typography>
              <Typography>
                <strong>Created At:</strong>{" "}
                {new Date(selected.created_at).toLocaleString()}
              </Typography>
              {/* {selected.updated_at && (
                <Typography><strong>Updated At:</strong> {new Date(selected.updated_at).toLocaleString()}</Typography>
              )} */}
            </div>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Toasts */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.sev}
          onClose={() => setToast((s) => ({ ...s, open: false }))}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </div>
  );
}
