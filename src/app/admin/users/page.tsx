"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { User, UpdateUserData } from "@/types";
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "@/lib/usersApi";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/constants/translations";
import { apiErrorMessage } from "@/lib/apiErrors";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

type Toast = {
  open: boolean;
  msg: string;
  sev: "success" | "error";
};

interface EditDraft {
  id: number | null; // null = creating
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  is_active: boolean;
}

const emptyDraft: EditDraft = {
  id: null,
  username: "",
  first_name: "",
  last_name: "",
  phone_number: "",
  email: "",
  password: "",
  is_active: true,
};

export default function AdminUsersPage() {
  const { language } = useLanguage();
  const t = translations[language].admin.users;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<unknown>(null);

  const [draft, setDraft] = useState<EditDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [pendingDelete, setPendingDelete] = useState<User | null>(null);
  const [toast, setToast] = useState<Toast>({
    open: false,
    msg: "",
    sev: "success",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setUsers(await fetchUsers());
    } catch (error) {
      setLoadError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setFormError(null);
    setDraft({ ...emptyDraft });
  };

  const openEdit = (user: User) => {
    setFormError(null);
    setDraft({
      id: user.id,
      username: user.username,
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      phone_number: user.phone_number ?? "",
      email: user.email ?? "",
      password: "",
      is_active: user.is_active,
    });
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    setFormError(null);

    try {
      if (draft.id === null) {
        await createUser({
          username: draft.username.trim(),
          first_name: draft.first_name.trim(),
          last_name: draft.last_name.trim(),
          phone_number: draft.phone_number.trim(),
          password: draft.password,
        });
        setToast({ open: true, msg: t.created, sev: "success" });
      } else {
        const payload: UpdateUserData = {
          first_name: draft.first_name.trim(),
          last_name: draft.last_name.trim(),
          phone_number: draft.phone_number.trim(),
          email: draft.email.trim(),
          is_active: draft.is_active,
        };
        // An empty password box means "leave it alone", not "blank it".
        if (draft.password) payload.password = draft.password;

        await updateUser(draft.id, payload);
        setToast({ open: true, msg: t.saved, sev: "success" });
      }

      setDraft(null);
      await load();
    } catch (error) {
      setFormError(apiErrorMessage(error, language));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteUser(pendingDelete.id);
      setToast({ open: true, msg: t.removed, sev: "success" });
      setUsers((prev) => prev.filter((u) => u.id !== pendingDelete.id));
    } catch (error) {
      setToast({
        open: true,
        msg: apiErrorMessage(error, language),
        sev: "error",
      });
    } finally {
      setPendingDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="py-12">
        <ErrorState error={loadError} title={t.loadFailed} onRetry={load} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#001c3b]">{t.title}</h1>
          <p className="text-sm text-gray-600 mt-1">{t.subtitle}</p>
        </div>
        <Button
          variant="contained"
          startIcon={<PersonAddAltIcon />}
          onClick={openCreate}
          sx={{
            backgroundColor: "#001c3b",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "10px",
            "&:hover": { backgroundColor: "#00325f" },
          }}
        >
          {t.add}
        </Button>
      </header>

      {users.length === 0 ? (
        <p className="text-sm text-gray-500 py-12 text-center">{t.empty}</p>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: "14px", boxShadow: "0 1px 3px rgba(0,0,0,.08)" }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 700 }}>{t.name}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t.username}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t.phone}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t.status}</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  {t.actions}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <span className="font-medium text-gray-900">
                      {user.full_name || "—"}
                    </span>
                    {user.is_superuser && (
                      <Chip
                        size="small"
                        label={t.admin}
                        sx={{
                          ml: 1,
                          height: 20,
                          fontSize: "0.7rem",
                          backgroundColor: "#001c3b",
                          color: "#c9a96e",
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {user.username}
                  </TableCell>
                  <TableCell>{user.phone_number || "—"}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={user.is_active ? t.active : t.inactive}
                      color={user.is_active ? "success" : "default"}
                      variant="outlined"
                      sx={{ height: 22, fontSize: "0.72rem" }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={t.edit}>
                      <IconButton size="small" onClick={() => openEdit(user)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t.remove}>
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => setPendingDelete(user)}
                          disabled={user.is_superuser}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create / edit */}
      <Dialog
        open={!!draft}
        onClose={() => !saving && setDraft(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#001c3b" }}>
          {draft?.id === null ? t.add : t.edit}
        </DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}

          <div className="grid sm:grid-cols-2 gap-4 pt-1">
            <TextField
              label={t.firstName}
              value={draft?.first_name ?? ""}
              onChange={(e) =>
                setDraft((d) => d && { ...d, first_name: e.target.value })
              }
              fullWidth
              size="small"
            />
            <TextField
              label={t.lastName}
              value={draft?.last_name ?? ""}
              onChange={(e) =>
                setDraft((d) => d && { ...d, last_name: e.target.value })
              }
              fullWidth
              size="small"
            />
            <TextField
              label={t.username}
              value={draft?.username ?? ""}
              onChange={(e) =>
                setDraft((d) => d && { ...d, username: e.target.value })
              }
              fullWidth
              size="small"
              // The backend keeps username read-only after creation so an
              // account cannot be renamed out from under its tokens.
              disabled={draft?.id !== null}
            />
            <TextField
              label={t.phone}
              value={draft?.phone_number ?? ""}
              onChange={(e) =>
                setDraft((d) => d && { ...d, phone_number: e.target.value })
              }
              placeholder="+998901234567"
              fullWidth
              size="small"
            />
            {draft?.id !== null && (
              <TextField
                label={t.email}
                type="email"
                value={draft?.email ?? ""}
                onChange={(e) =>
                  setDraft((d) => d && { ...d, email: e.target.value })
                }
                fullWidth
                size="small"
              />
            )}
            <TextField
              label={draft?.id === null ? t.password : t.newPassword}
              type="password"
              value={draft?.password ?? ""}
              onChange={(e) =>
                setDraft((d) => d && { ...d, password: e.target.value })
              }
              fullWidth
              size="small"
              autoComplete="new-password"
            />
          </div>

          {draft?.id !== null && (
            <label className="flex items-center gap-2 mt-4 text-sm text-gray-700">
              <Switch
                checked={draft?.is_active ?? true}
                onChange={(e) =>
                  setDraft((d) => d && { ...d, is_active: e.target.checked })
                }
                size="small"
              />
              {t.active}
            </label>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDraft(null)}
            disabled={saving}
            sx={{ textTransform: "none" }}
          >
            {t.cancel}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            variant="contained"
            sx={{
              backgroundColor: "#001c3b",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#00325f" },
            }}
          >
            {t.save}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!pendingDelete} onClose={() => setPendingDelete(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>{t.remove}</DialogTitle>
        <DialogContent>
          <p className="text-sm text-gray-700">{t.confirmRemove}</p>
          <p className="mt-2 font-semibold text-[#001c3b]">
            {pendingDelete?.full_name} ({pendingDelete?.username})
          </p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setPendingDelete(null)}
            sx={{ textTransform: "none" }}
          >
            {t.cancel}
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {t.remove}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.sev} sx={{ width: "100%" }}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </div>
  );
}
