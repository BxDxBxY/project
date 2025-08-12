import { Modal, Box, Button, TextField, Typography } from "@mui/material";
import React from "react";

type ModalType = "add" | "edit" | "delete";

interface CategoryModalProps {
  newCategoryName: string;
  setNewCategoryName: React.Dispatch<React.SetStateAction<string>>;
  open: boolean;
  type: ModalType;
  categoryName?: string;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onSubmitDelete: () => Promise<void>;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  type,
  categoryName = "",
  loading = false,
  error,
  onClose,
  onSubmit,
  onSubmitDelete,
  newCategoryName,
  setNewCategoryName,
}) => {
  // const [name, setName] = React.useState(categoryName);

  React.useEffect(() => {
    setNewCategoryName(categoryName);
  }, [categoryName, setNewCategoryName]);

  const titles: Record<ModalType, string> = {
    add: "Add Category",
    edit: "Edit Category",
    delete: "Delete Category",
  };

  const submitText: Record<ModalType, string> = {
    add: loading ? "Creating..." : "Create",
    edit: loading ? "Saving..." : "Save",
    delete: loading ? "Deleting..." : "Delete",
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute" as const,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          width: 400,
        }}
      >
        <Typography variant="h6" mb={2}>
          {titles[type]}
        </Typography>

        {type !== "delete" ? (
          <form
            onSubmit={(e) => {
              onSubmit(e);
            }}
          >
            <TextField
              fullWidth
              label="Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              required
              margin="normal"
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
              <Button onClick={onClose} variant="outlined">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color={type === "add" ? "success" : "primary"}
                disabled={loading}
              >
                {submitText[type]}
              </Button>
            </Box>
          </form>
        ) : (
          <>
            <Typography mb={2}>
              Are you sure you want to delete this category?
            </Typography>
            {error && (
              <Typography color="error" variant="body2" mb={1}>
                {error}
              </Typography>
            )}
            <Box display="flex" justifyContent="flex-end" gap={1}>
              <Button onClick={onClose} variant="outlined" color="info">
                Cancel
              </Button>
              <Button
                onClick={() => onSubmitDelete()}
                variant="contained"
                color="error"
                disabled={loading}
              >
                {submitText.delete}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};
